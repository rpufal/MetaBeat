const puppeteer = require('puppeteer');
const fs = require('fs');

const tableFromArray = (array) => {
  let textBase = '';
  textBase = array.reduce((accumulator, currentValue) => accumulator + currentValue + '\n', textBase)
  return textBase;
}

const constructTable = (title,tableString) => {
  if (title !== 'game-title') {
    console.log('tabela')
    let tableArray = tableString.split('\n').map((row) => {
      let arrayRow = row.split('\t');
      arrayRow.splice(1,1);
      arrayRow.splice(-2,2);
      return arrayRow.join(';');
    })
    return tableArray.join(';');
  }
  console.log('titulo');
  return tableString;
};

const gamesNames = ['The Legend of Zelda: Breath of the Wild']

const beatScrapper = async (gamesList) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const table = []
  for (let listIndex = 0; listIndex < gamesList.length; listIndex++ ) {
    const currentPage = `https://www.howlongtobeat.com/#search`;
    await page.goto(currentPage);
    await page.click('div[class = "search_container"]');
    await page.type('div[class = "search_container"]', gamesList[listIndex]);
    await page.keyboard.press('Enter');
    await page.waitForSelector('div.search_list_details a.text_green');
    await page.click('div.search_list_details a.text_green')
    await page.screenshot({path: 'teste_hltbeat.jpg'});
    const result = await page.evaluate(()=>{
      let queriesResults = [];
      const requestInfos = [{
        title: 'game-title',
        query: 'div.profile_header.shadow_text'
      },
      {
        title: 'time_tables',
        query: 'table.game_main_table'
      }
    ];
      requestInfos.map((info) => {
          try {
            const infosFromWeb = document.querySelectorAll(info.query)[0];
            console.log(`puxou a info${info.title}`);
            let infos = infosFromWeb.innerText;
            // const cleanedInfos = constructTable(info.title, infos);
            if (info.title !== 'game-title') {
              let tableArray = infos.split('\n').map((row) => {
                let arrayRow = row.split('\t');
                arrayRow.splice(1,1);
                arrayRow.splice(-2,2);
                return arrayRow.join(';');
              })
               infos = tableArray.join(';');
            }
            queriesResults.push(infos);
            // queriesResults.push(cleanedInfos);
          } catch (err) {
            console.log('erro',err);
          }
        });
      return queriesResults;
    });
    table.push(result.join(';'));
    console.log(table);
  }
  const finalTable = tableFromArray(table);
  fs.writeFileSync(`./beatDetails/games-details.csv`, finalTable, 'utf-8');
  await browser.close();  
};

beatScrapper(gamesNames);