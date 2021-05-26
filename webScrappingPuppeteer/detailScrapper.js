const puppeteer = require('puppeteer');
const fs = require('fs');

const urlList = ['/game/playstation-5/demons-souls',
'/game/playstation-5/tony-hawks-pro-skater-1-+-2',
'/game/playstation-5/disco-elysium-the-final-cut'];

const tableFromArray = (array) => {
  let newArray = [];
  for (let index = 0;index < array.length; index++) {
    let newCell = array[index].concat();
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
        query: 'li.summary_detail.product_summary span.data span.blurb.blurb_expanded'
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
          let infosFromWeb = document.querySelector(info.query).innerText;
          queriesResults.push(infosFromWeb)
        } else {
          let infosFromWeb = document.querySelectorAll(info.query);
          const infosList = [...infosFromWeb];
          const infos = infosList.map(currData => currData.innerText);
          queriesResults.push(infos);
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