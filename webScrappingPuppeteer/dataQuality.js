const fs = require('fs');


const getFiles = () => {
  const consoles = ['3ds', 'ds', 'pc', 'ps3', 'ps4','switch', 'wii', 'xbox360', 'xboxone'];
  const consoles = ['xboxseriesx', 'ps5']
  const desiredPath = './beatDetails/';
  const filesList = consoles.map((console) => {
    const array = [];
    for (let index = 0; index < 3; index++) {
      array.push(`${desiredPath}${console}-${index}-htlb-details.csv`)
    };
    return array;
  });
  return [].concat.apply([], filesList);
}

[...document.querySelectorAll('table.game_main_table')].shift().innerText;
[...document.querySelectorAll('table.game_main_table')].pop().innerText;

readNameFile = (filePath) => {
  const file = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const textArray = file.split('\n');
  textArray.pop();
  return textArray;
}
const similarityTitles = (row) => {
  const metacriticTitle  = row.split(';')[0].split(' ');
  const hltbTitle  = row.split(';').pop().split(' ');
  let simIndex = 0;
  metacriticTitle.forEach((segment) => {
    if (hltbTitle.includes(segment)) {
      simIndex += 1
    }
  });
  const report = {
    metacriticRatio: (simIndex/metacriticTitle.length) * 100,
    hltbRatio: (simIndex/hltbTitle.length) * 100,
    simIndex
  };
  return report;
}
const scrappedDataQuality = (tableObject) => {
  const currentTable = tableObject.tableArray;
  const consoleName = tableObject.consoleName;
  const pageNumber = tableObject.pageNumber;
  const reportArray = currentTable.forEach((row) => {
     
    if (row.length < 50 || row.split(';')[1] === 'null' || row.split(';')[])
  });
  fs.writeFile(`./beatQualityReport/${consoleName}-${pageNumber}-hltb-quality-report.csv`,
  finalTable, err => {
    if (err) {
      console.log(err)
      return
    }
  });
}

const dataQualityPipeline = async () => {
  const listFiles = getFiles();
  for (let index = 0; index < listFiles.length; index++) {
    const file = listFiles[index];
    const tableArray = readNameFile(file);
    const tableObject = { consoleName: file.split('/')[2].split('-')[0], tableArray, pageNumber: file.split('-')[1] };
    await scrappedDataQuality(tableObject);
  }
}

dataQualityPipeline();

const basicFunc = async () => {
  let queriesResults = [];
  const requests = [
    { query: async () => [...document.querySelectorAll('table.game_main_table')].shift().innerText, title: 'table' },
    { query: async () => [...document.querySelectorAll('table.game_main_table')].pop().innerText,
    title: 'table'},
    { query: async () => document.querySelector('div.profile_header.shadow_text').innerText,
    title: 'game-title'}
  ];
  requests.forEach(async (request) => {
    try {
      const infosFromWeb = await request.query();
      if (request.title !== 'game-title') {
          let tableArray = infosFromWeb.split('\n').map((row) => {
            let arrayRow = row.split('\t');
            arrayRow.splice(-2, 2);
            return arrayRow.join(';');
          })
          let infos = tableArray.join(';');
          queriesResults.push(infos);
      } else {
        queriesResults.push(infosFromWeb);
      }
     
      
    } catch (err) {
      console.log('erro ao colocar info no queriesResults', err);
    }
  })
  return queriesResults
};
const result = await basicFunc();
let rowText  = ';' + result.join(';');
rowText;