const fs = require('fs');

readUrlFile = (fileName) => {
  const file = fs.readFileSync(fileName,{encoding: 'utf-8'});
  const textArray = file.split('\n');
  return textArray;
}


prepareTable = () => {
const tArray = readUrlFile('metaDetails/testeGenres.csv');
let textBase = '';
tArray.forEach((line) => {
  const treatedLine = line.split('"').slice(0,2);
  // console.log(treatedLine)
  let id = treatedLine[0].replace(',', ';');
  let genresArrays = treatedLine[1].split(',');
  let tablePrep = '';
  genresArrays.forEach((genre) => {
    tablePrep = tablePrep + id + genre + '\n'
  })
  textBase = textBase + tablePrep;
})
fs.writeFileSync(`./metaDetails/genresTable.csv`, textBase, 'utf-8');
}
prepareTable()


