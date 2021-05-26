const puppeteer = require('puppeteer');
const fs = require('fs');



readUrlFile = () => {
  const file = fs.readFileSync('./tables_best_games/ps5/url/ps5-0-url.csv',{encoding: 'utf-8'});
  const textArray = file.split('\n');
  textArray.pop();
  return textArray;
}

const urlList = readUrlFile();
// console.log(urlList)

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


const metacriticDetailScrapper = async (pagesToVisit) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const table = []
  for (let listIndex = 0; listIndex < pagesToVisit.length; listIndex++ ) {
    const currentPage = `https://www.metacritic.com${pagesToVisit[listIndex]}`;
    await page.goto(currentPage);
    await console.log(`visitou a pagina ${currentPage}`)
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
            let infosFromWeb = document.querySelector(info.query).innerText;
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
  fs.writeFileSync(`./tables_details/games-details.csv`, finalTable, 'utf-8');
  await browser.close();  
};



metacriticDetailScrapper(urlList);