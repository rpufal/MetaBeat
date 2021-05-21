const puppeteer = require('puppeteer');
const fs = require('fs');
const tableFromArray = (array) => {
  let newArray = [];
  for (let index = 0;index < 100; index++ ) {
    const newCell = array[0][index].concat(',',array[1][index])
    newArray.push(newCell);
  }
  return newArray;
}

(async () => {
  let gamesData = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.metacritic.com/browse/games/score/metascore/all/switch/filtered');
  // await page.screenshot({ path: 'exampleZelda.png' });

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
  const singleTable = tableFromArray(result)
  fs.writeFileSync('./tables/gamesData.csv', JSON.stringify(singleTable), 'utf-8');
})();