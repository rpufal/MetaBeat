const fs = require('fs');

readUrlFile = (fileName) => {
  const file = fs.readFileSync(fileName,{encoding: 'utf-8'});
  const textArray = file.split('\n');
  textArray.pop();
  return textArray;
}

prepareColection = () => {
  const tArray = readUrlFile('metaDetails/metaDetails.csv');
  let collection = {"games": []};
  tArray.forEach((line)=> {
    const lineContent = line.split(';');
    let documentBasis = {
      gameTitle: "",
      metacriticScore: "",
      userScore: "",
      platform: "",
      publisher: "",
      developer: "",
      releaseDate: "",
      summary: "",
      criticsQuantity:"",
      genres: "",
  }
    const keys = Object.keys(documentBasis);
    lineContent.forEach((cell,index) => {
      if (index === 9) {
        documentBasis[keys[index]] = [... new Set(cell.split(','))];
      } else if (index === 6) {
        const splitDate = cell.split(',');
        const year = splitDate[1].trim();
        const day = splitDate[0].slice(splitDate[0].length -2, splitDate[0].length).trim();
        let monthNumber = String("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(splitDate[0].slice(0,3)) / 3 + 1 );
        if (monthNumber.length < 2) monthNumber = "0" + monthNumber;
        documentBasis[keys[index]] = `${year}-${monthNumber}-${day}`;
      }  else {
        documentBasis[keys[index]] = cell;      
      }
    })
    collection["games"].push(documentBasis);
  })
  console.log(collection["games"].length);
  fs.writeFileSync(`./testeJson.js`, JSON.stringify(collection), 'utf-8');
}

prepareColection();