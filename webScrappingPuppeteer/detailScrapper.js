const puppeteer = require('puppeteer');
const fs = require('fs');


const tableFromArray = (array) => {
  let newArray = [];
  for (let index = 0;index < array.length; index++) {
    let newCell = array[index].join(';');
    newArray.push(newCell);
  }
  console.log('novo array', newArray)
  let textBase = '';
  textBase = newArray.reduce((accumulator, currentValue) => accumulator + currentValue + '\n', textBase)
  return textBase;
}

const getFiles = () => {
  const consoles = ['wii'];
  // const consoles = ['3ds', 'ds', 'pc', 'ps3', 'ps4','switch', 'wii', 'wiiu', 'xbox360', 'xboxone'];
  const desiredPath = './tables_best_games/';
  const suffix = '-url.csv';
  const filesList = consoles.map((console) => {
    const array = [];
    // pegar o numero de arquivos de uma pasta e fazer o loop em cima desse numero
    for (let index = 0; index < 3; index++) {
      array.push(`${desiredPath}${console}/url/${console}-${index}${suffix}`)
    };
    return array;
  });
  return [].concat.apply([], filesList);
}


readUrlFile = (fileName) => {
  const file = fs.readFileSync(fileName,{encoding: 'utf-8'});
  const textArray = file.split('\n');
  textArray.pop();
  return textArray;
}

const metacriticDetailScrapper = async (urlObject) => {
  const pagesToVisit = urlObject.urlArray;
  const consoleName = urlObject.consoleName;
  const pageNumber = urlObject.pageNumber;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const table = []
  for (let listIndex = 0; listIndex < pagesToVisit.length; listIndex++ ) {
    const currentPage = `https://www.metacritic.com${pagesToVisit[listIndex]}`;
    await page.goto(currentPage);
    await console.log(`numero ${listIndex} ; visitamos a pagina ${currentPage}`)
    const result = await page.evaluate(()=>{
      let queriesResults = [];
      const requestInfos = [{
        title: 'game-title',
        query: 'div.product_title a h1'
      },
      {
        title: 'metascore',
        query: 'div.metascore_w.xlarge.game span'
      },
      {
        title: 'userscore',
        query: 'div.metascore_w.user.large.game'
      },
      {
        title: 'platform',
        query: 'span.platform a'
      },
      {
        title: 'publisher',
        query: 'li.summary_detail.publisher span a'
      },
      {
        title: 'developer',
        query: 'li.summary_detail.developer span a'
      },
      {
        title: 'release-date',
        query: 'li.summary_detail.release_data span.data'
      },
      {
        title: 'summary',
        query: 'li.summary_detail.product_summary span.data span'
      },
      {
        title: 'critic_number',
        query: 'div.score_summary.metascore_summary span.count a span'
      },
      {
        title: 'genres',
        query: 'li.summary_detail.product_genre span.data'
      }
      ];
      requestInfos.map((info) => {
        if (info.title !== 'genres') {
          try {
            let infosFromWeb = document.querySelector(info.query).innerText.replace('\n','+');
            console.log(`puxou a info${info.title}`)
            queriesResults.push(infosFromWeb)
          } catch (err) {
            console.log(err);
          }
        } else {
          try {
            let infosFromWeb = document.querySelectorAll(info.query);
            const infosList = [...infosFromWeb];
            const infos = infosList.map(currData => currData.innerText);
            console.log(`puxou a info${info.title}`)
            queriesResults.push(infos);
          } catch (err) {
            console.log(err);
          }
        }
      })
      return queriesResults;
    })
    table.push(result);
  }
  const finalTable = tableFromArray(table);
  fs.writeFileSync(`./tables_details/${consoleName}-${pageNumber}-details.csv`, finalTable, 'utf-8');
  await browser.close();  
};

const detailScrappingPipeline = async () => {
  const listFiles = getFiles();
  for (let index = 0; index < listFiles.length; index ++) {
    const file = listFiles[index];
    const urlArray = readUrlFile(file);
    const urlObject = { consoleName: file.split('/')[2], urlArray, pageNumber: file.split('-')[1]};
    await metacriticDetailScrapper(urlObject);
  }
}

detailScrappingPipeline();
