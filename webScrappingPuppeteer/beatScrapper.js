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

const beatScrapper = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const currentPage = `https://www.howlongtobeat.com/#search`;
  await page.goto(currentPage);
  await page.click('div[class = "search_container"]');
  await page.type('div[class = "search_container"]','The Legend of Zelda: Breath of the Wild');
  await page.keyboard.press('Enter');
  await page.waitForSelector('div.search_list_details a.text_green');
  await page.click('div.search_list_details a.text_green')
  await page.screenshot({path: 'teste_hltbeat.jpg'});
  await browser.close();  
};

beatScrapper();