const puppeteer = require('puppeteer');
const fs = require('fs');

const tableFromArray = (array) => {
  let newArray = [];
  for (let index = 0;index < 100; index++ ) {
    const newCell = array[0][index].concat(',',array[1][index])
    newArray.push(newCell);
    //fazer um reduce com esse array p que ele me entregue uma string
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
  fs.writeFileSync('./tables/gamesData.csv', singleTable, 'utf-8');

})();