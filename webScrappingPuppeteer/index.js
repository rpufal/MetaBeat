const puppeteer = require('puppeteer');
const fs = require('fs');



const tableFromArray = (array, nColumns) => {
  let newArray = [];
  for (let index = 0;index < array[0].length; index++ ) {
    for (let index2 = 1; index2 < nColumns; index2++) {
      const newCell = array[0][index].concat(',',array[index2][index])
      newArray.push(newCell);
    }
  }
  let textBase = 'Game Title, MetaScore\n';
  textBase = newArray.reduce((accumulator, currentValue) => accumulator + currentValue + '\n', textBase)
  console.log(textBase);
  return textBase;
}

// por que colocar requestInfos e getInfos dentro da função evaluate? por que nao funcionam daqui?
const requestInfos = [{
  title: 'game title',
  query: 'a.title h3'
},
{
  title: 'metascore',
  query: 'td.clamp-summary-wrap div.clamp-score-wrap a.metascore_anchor div.metascore_w.large.game.positive'
}
]
const getInfos  = (requestInfos, queriesResults) =>{
  requestInfos.map((info) => {
    let infosFromWeb = document.querySelectorAll(info.query);
    const infosList = [...infosFromWeb];
    const infos = infosList.map(currData => currData.innerText);
    queriesResults.push(infos);
  })
}


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.metacritic.com/browse/games/score/metascore/all/switch/filtered');
  // await page.goto('https://www.metacritic.com/browse/games/score/metascore/all/xboxone/filtered');
  
  const result = await page.evaluate(()=>{
    let queriesResults = [];
    const requestInfos = [{
      title: 'game title',
      query: 'a.title h3'
    },
    {
      title: 'metascore',
      query: 'td.clamp-summary-wrap div.clamp-score-wrap a.metascore_anchor div.metascore_w.large.game.positive'
    }
    ]
    requestInfos.map((info) => {
      let infosFromWeb = document.querySelectorAll(info.query);
      const infosList = [...infosFromWeb];
      const infos = infosList.map(currData => currData.innerText);
      queriesResults.push(infos);
    })
    return queriesResults;
  })
  await browser.close();
  const finalTable = tableFromArray(result,2)
  fs.writeFileSync('./tables/gamesData.csv', finalTable, 'utf-8');
})();