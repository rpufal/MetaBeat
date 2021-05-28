const puppeteer = require('puppeteer');
const fs = require('fs');

const tableFromArray = (array) => {
  let textBase = '';
  textBase = array.reduce((accumulator, currentValue) => accumulator + currentValue + '\n', textBase)
  return textBase;
}

// const constructTable = (title,tableString) => {
//   if (title !== 'game-title') {
//     console.log('tabela')
//     let tableArray = tableString.split('\n').map((row) => {
//       let arrayRow = row.split('\t');
//       arrayRow.splice(1,1);
//       arrayRow.splice(-2,2);
//       return arrayRow.join(';');
//     })
//     return tableArray.join(';');
//   }
//   console.log('titulo');
//   return tableString;
// };
const getFiles = () => {
  const consoles = ['wii'];
  // const consoles = ['3ds', 'ds', 'pc', 'ps3', 'ps4','switch', 'wii', 'wiiu', 'xbox360', 'xboxone'];
  const desiredPath = './tables_best_games/';
  const filesList = consoles.map((console) => {
    const array = [];
    // pegar o numero de arquivos de uma pasta e fazer o loop em cima desse numero
    for (let index = 0; index < 3; index++) {
      array.push(`${desiredPath}${console}/${console}-${index}-names.csv`)
    };
    return array;
  });
  return [].concat.apply([], filesList);
}
//read files and prepare text arrays from them
readNameFile = (filePath) => {
  const file = fs.readFileSync(filePath,{encoding: 'utf-8'});
  const textArray = file.split('\n');
  textArray.pop();
  return textArray;
}

const searchForTitle = (title) => {
  const titleArray = title.split(' ');
  if (titleArray.length > 2) return titleArray[0].concat(' ', titleArray[1]);
  return titleArray[0]; 
}

const errorTreatment = (err) => {

}

const beatScrapper = async (urlObject) => {
  const namesToSearch = urlObject.urlArray;
  const consoleName = urlObject.consoleName;
  const pageNumber = urlObject.pageNumber;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const table = [];
  const currentPage = `https://www.howlongtobeat.com/#search`;
  await page.goto(currentPage);

  for (let listIndex = 0; listIndex < namesToSearch.length; listIndex++ ) {
    await page.click('div[class = "search_container"]');
    const gameName = namesToSearch[listIndex];
    await page.type('div[class = "search_container"]', gameName);
    await page.keyboard.press('Enter');
    
    try {
      // await page.waitForSelector('div.search_list_details a.text_green');    
      await page.waitForSelector(`[title*="${searchForTitle(gameName)}"]`);
    } catch (err) {
      console.log(`erro, o jogo ${gameName} não foi encontrado`, err);
      table.push([`${gameName}`,'null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null'].join(';'))
      await page.goto(`https://www.howlongtobeat.com/#search`);
      continue;
    }
    try {
      // await page.click('div.search_list_details a');
      // await page.click(`[title*="${searchForTitle(gameName)}"]`);
      await page.$eval('div.search_list_details a', elem => elem.click());
      // const result = await page.evaluate(() => {return document.querySelectorAll('div.search_list_details a')[0].href});
      // await console.log(result)
      // await page.goto(result);
    } catch (err) {
      console.log(`erro, o jogo ${gameName} não foi clicavel`, err);
      table.push([`${gameName}`,'null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null','null'].join(';'))
      await page.goto(`https://www.howlongtobeat.com/#search`);
      continue;
    }
    await page.screenshot({path: 'teste_hltb.jpg'});

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
    await page.goto(`https://www.howlongtobeat.com/#search`);
  }
  const finalTable = tableFromArray(table);
  fs.writeFileSync(`./beatDetails/${consoleName}-${pageNumber}-hltb-details.csv`, finalTable, 'utf-8');
  await browser.close();  
};

const detailHLTBScrappingPipeline = async () => {
  const listFiles = getFiles();
  for (let index = 0; index < listFiles.length; index ++) {
    const file = listFiles[index];
    const urlArray = readNameFile(file);
    const urlObject = { consoleName: file.split('/')[2], urlArray, pageNumber: file.split('-')[1]};
    await beatScrapper(urlObject);
  }
}

detailHLTBScrappingPipeline();