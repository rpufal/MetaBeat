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


(async () => {
  let gamesData = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.metacritic.com/browse/games/score/metascore/all/switch/filtered');
  // await page.goto('https://www.metacritic.com/browse/games/score/metascore/all/xboxone/filtered');

  const result = await page.evaluate(()=>{
    let titlesFromWeb = document.querySelectorAll('a.title h3');
    const titlesList = [...titlesFromWeb];
    const titles =  titlesList.map(title => title.innerText);
    let scoresFromWeb = document.querySelectorAll('td.clamp-summary-wrap div.clamp-score-wrap a.metascore_anchor div.metascore_w.large.game.positive');
    const scoresList = [...scoresFromWeb];
    const scores = scoresList.map(score => score.innerText);
    return [titles, scores];
  })
  await browser.close();
  const singleTable = tableFromArray(result,2)
  fs.writeFileSync('./tables/gamesData.csv', singleTable, 'utf-8');

})();