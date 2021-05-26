const puppeteer = require('puppeteer');
const fs = require('fs');



const tableFromArray = (array, nColumns) => {
  let newArray = [];
  if (nColumns > 1) {
    for (let index = 0;index < array[0].length; index++ ) {
      let newCell = array[0][index];
      for (let index2 = 1; index2 < nColumns; index2++) {
        newCell = newCell.concat(',',array[index2][index])
      }
      newArray.push(newCell);
    }
  } else if (nColumns === 1) {
    for (let index = 0;index < array.length; index++ ) {
      let newCell = array[index];
      for (let index2 = 1; index2 < nColumns; index2++) {
        newCell = newCell.concat(',',array[index2][index])
      }
      newArray.push(newCell);
    }
  }
  let textBase = '';
  textBase = newArray.reduce((accumulator, currentValue) => accumulator + currentValue + '\n', textBase)
  console.log(textBase);
  return textBase;
}

const pagesToVisitLegacy = [
  {
    pageTitle: 'ps3',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/ps3/filtered'
  },
  {
    pageTitle: 'xbox360',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/xbox360/filtered'
  },
  {
    pageTitle: 'ds',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/ds/filtered'
  },
  {
    pageTitle: '3ds',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/3ds/filtered'
  },
  {
    pageTitle: 'wii',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/wii/filtered'
  },
  {
    pageTitle: 'wiiu',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/wii-u/filtered'
  },
];

const pagesToVisitCurrent = [
  {
    pageTitle: 'switch',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/switch/filtered'
  },
  {
    pageTitle: 'xboxone',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/xboxone/filtered'
  },
  {
    pageTitle: 'ps4',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/ps4/filtered'
  },
  {
    pageTitle: 'pc',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/pc/filtered'
  }
]

const pagesToVisitNextGen = [
  {
    pageTitle: 'xboxseriesx',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/xbox-series-x/filtered'
  },
  {
    pageTitle: 'ps5',
    url: 'https://www.metacritic.com/browse/games/score/metascore/all/ps5/filtered'
  }
]


const metacriticScrapper = async (pagesToVisit, nPages) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (let listIndex = 0; listIndex < pagesToVisit.length; listIndex++ ) {
    for (let pageIndex = 0; pageIndex < nPages; pageIndex++) {
      const currentPage = `${pagesToVisit[listIndex].url}?page=${pageIndex}`;
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
      const finalTable = tableFromArray(result,result.length);
      fs.writeFileSync(`./tables_best_games/${pagesToVisit[listIndex].pageTitle}/${pagesToVisit[listIndex].pageTitle}-${pageIndex}.csv`, finalTable, 'utf-8');
      const urlTable = tableFromArray(result[result.length - 2],1);
      fs.writeFileSync(`./tables_best_games/${pagesToVisit[listIndex].pageTitle}/url/${pagesToVisit[listIndex].pageTitle}-${pageIndex}-url.csv`, urlTable, 'utf-8');
    }
  }
  await browser.close();  
};
metacriticScrapper(pagesToVisitCurrent, 3);
metacriticScrapper(pagesToVisitLegacy, 3);
metacriticScrapper(pagesToVisitNextGen, 1);
