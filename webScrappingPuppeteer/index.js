const puppeteer = require('puppeteer');
const fs = require('fs');



const tableFromArray = (array, nColumns) => {
  let newArray = [];
  for (let index = 0;index < array[0].length; index++ ) {
    let newCell = array[0][index];
    for (let index2 = 1; index2 < nColumns; index2++) {
      newCell = newCell.concat(',',array[index2][index])
    }
    newArray.push(newCell);
  }
  let textBase = '';
  textBase = newArray.reduce((accumulator, currentValue) => accumulator + currentValue + '\n', textBase)
  console.log(textBase);
  return textBase;
}


// const pagesToVisit = ['https://www.metacritic.com/browse/games/score/metascore/all/switch/filtered',
//   'https://www.metacritic.com/browse/games/score/metascore/all/xboxone/filtered'];
const pagesToVisit = [
  {
    pageTitle: 'SwitchBest1',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/switch/filtered'
  },
  {
    pageTitle: 'XboxBest1',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/xboxone/filtered'
  }
]

const metacriticScrapper = async (pagesToVisit) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (let index = 0; index < pagesToVisit.length; index++ ) {
    const currentPage = pagesToVisit[index].url;
    await page.goto(currentPage);
    const result = await page.evaluate(()=>{
      let queriesResults = [];
      const requestInfos = [{
        title: 'game-title',
        query: 'a.title h3'
      },
      {
        title: 'metascore',
        query: 'td.clamp-summary-wrap div.clamp-score-wrap a.metascore_anchor div.metascore_w.large.game'
      },
      {
        title: 'userscore',
        query: 'div.metascore_w.user.large.game'
      },
      {
        title: 'platform',
        query: 'div.platform span.data'
      },
      {
        title: 'release-date',
        query: 'div.clamp-details span:not(.label):not(.data)'
      },
      {
        title: 'metacritic-website',
        query: 'a.title'
      },
      {
        title: 'thumbnail',
        query: 'td.clamp-image-wrap a img'
      }
      ];
      requestInfos.map((info) => {
        let infosFromWeb = document.querySelectorAll(info.query);
        const infosList = [...infosFromWeb];
        if (info.title === 'metacritic-website') {
          const infos = infosList.map(currData => currData.getAttribute('href'));
          queriesResults.push(infos);
        } else if (info.title === 'thumbnail') {
          const infos = infosList.map(currData => currData.getAttribute('src'));
          queriesResults.push(infos);
        } else {
          const infos = infosList.map(currData => currData.innerText);
          queriesResults.push(infos);
        }
      })
      return queriesResults;
    })
    const finalTable = tableFromArray(result,result.length)
    fs.writeFileSync(`./tables/${pagesToVisit[index].pageTitle}.csv`, finalTable, 'utf-8');
  }
  await browser.close();  
};
metacriticScrapper(pagesToVisit);