const puppeteer = require('puppeteer');
const fs = require('fs');

const tableFromArray = (array) => {
  let textBase = '';
  textBase = array.reduce((accumulator, currentValue) => accumulator + currentValue + '\n', textBase)
  return textBase;
}

const getFiles = () => {
  // const consoles = ['wiiu'];
  // const consoles = ['3ds', 'ds', 'pc', 'ps3', 'ps4','switch', 'wii', 'xbox360', 'xboxone'];
  const consoles = ['xboxseriesx', 'ps5']
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
  const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const textArray = file.split('\n');
  textArray.pop();
  return textArray;
}

const searchForTitle = (title) => {
  const titleArray = title.split(' ');
  if (titleArray.length > 2) return titleArray[0].concat(' ', titleArray[1]);
  // if (titleArray.length > 2) return titleArray[0].concat(' ', titleArray[1]).slice(0,-1);
  return titleArray[0].slice(0,-1);
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
  for (let listIndex = 0; listIndex < namesToSearch.length; listIndex++) {
    await page.click('div[class = "search_container"]');
    const gameName = namesToSearch[listIndex];
    await page.type('.search_container', gameName);
    // await page.type('div[class = "search_container"]', gameName);
    await page.keyboard.press('Enter');

    try {
      // await page.waitForSelector(`[title*="${searchForTitle(gameName)}"]`);
      await page.waitForSelector('div.search_list_details h3.shadow_text a.text_green')
    } catch (err) {
      console.log(`erro, o jogo ${gameName} não foi encontrado`, err);
      table.push([`${gameName}`, 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null'].join(';'))
      await page.goto(`https://www.howlongtobeat.com/#search`);
      continue;
    }
    try {
      // await page.$eval(`[title*="${searchForTitle(gameName)}"]`, elem => elem.click());
      await page.$eval('div.search_list_details a', elem => elem.click());
    } catch (err) {
      console.log(`erro, o jogo ${gameName} não foi clicavel`, err);
      table.push([`${gameName}`, 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null'].join(';'))
      await page.goto(`https://www.howlongtobeat.com/#search`);
      continue;
    }
    //tirar o await 

    const result = await page.evaluate(() => {
      let queriesResults = [];
      const requests = [
        { query: async () => [...document.querySelectorAll('table.game_main_table')].shift().innerText, title: 'table' },
        { query: async () => [...document.querySelectorAll('table.game_main_table')].pop().innerText,
        title: 'table'},
        { query: async () => document.querySelector('div.profile_header.shadow_text').innerText,
        title: 'game-title'}
      ];
      requests.forEach(async (request) => {
        try {
          const infosFromWeb = await request.query();
          if (request.title !== 'game-title') {
              let tableArray = infosFromWeb.split('\n').map((row) => {
                let arrayRow = row.split('\t');
                arrayRow.splice(-2, 2);
                return arrayRow.join(';');
              })
              let infos = tableArray.join(';');
              queriesResults.push(infos);
          } else {
            queriesResults.push(infosFromWeb);
          }
         
          
        } catch (err) {
          console.log('erro ao colocar info no queriesResults', err);
        }
      })
      return queriesResults;
    });
    result.unshift(gameName);
    table.push(result.join(';'));
    console.log(table);
    await page.goto(`https://www.howlongtobeat.com/#search`);
  }
  const finalTable = tableFromArray(table);
  fs.writeFile(`./beatDetails/${consoleName}-${pageNumber}-hltb-details.csv`, finalTable, err => {
    if (err) {
      console.log(err)
      return
    }
  });
  await browser.close();
};

const detailHLTBScrappingPipeline = async () => {
  const listFiles = getFiles();
  for (let index = 0; index < listFiles.length; index++) {
    const file = listFiles[index];
    const urlArray = readNameFile(file);
    const urlObject = { consoleName: file.split('/')[2], urlArray, pageNumber: file.split('-')[1] };
    await beatScrapper(urlObject);
  }
}

detailHLTBScrappingPipeline();