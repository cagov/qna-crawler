/*
new steps:
  dedupe the scraped content
  append the editorial content
*/

const fs = require('fs')
const tsvtojson = require('tsvtojson');

let editorial, scrape;

async function writeFile() {
  await tsvtojson('./qna.tsv')
  .then(data=>{
    scrape = data;
  })
  .catch(err=>{
    console.log(err);
  })

  await tsvtojson('./editorial.tsv')
  .then(data=>{
    editorial = data;
  })
  .catch(err=>{
    console.log(err);
  })

  let scrapeMap = new Map();
  let dups = [];

  // determine if source urls are the same language
  function is_same_language(urlA, urlB) {
    if (urlA.includes('/ar/') != urlB.includes('/ar/') ||
        urlA.includes('/es/') != urlB.includes('/es/') ||
        urlA.includes('/tl/') != urlB.includes('/tl/') ||
        urlA.includes('/ko/') != urlB.includes('/ko/') ||
        urlA.includes('/vi/') != urlB.includes('/vi/') ||
        urlA.includes('/zh-hans/') != urlB.includes('/zh-hans/') ||
        urlA.includes('/zh-hant/') != urlB.includes('/zh-hant/')) {
          return false;
    }
    return true;
  }

  function addItem(s){
    if(scrapeMap.get(s.Question) && is_same_language(scrapeMap.get(s.Question).Source,s.Source)) {
      s.duplicate = scrapeMap.get(s.Question)
      console.log('found dup',s.Question, s.duplicate.Source, s.Source);
      dups.push(s)
    } else {
      scrapeMap.set(s.Question,s);
      // console.log('unique')
    }
  }

  scrape.forEach(s => {
    addItem(s);
  })
  editorial.forEach(e => {
    addItem(e);
  })


  let qnaFile = `Question	Answer	Source	Metadata	SuggestedQuestions	IsContextOnly	Prompts	QnaId\n`
  let QnaId = 1;
  scrapeMap.forEach(item => {
    qnaFile += `${item.Question}	${item.Answer}	${item.Source}	 	[]	false	[]	${QnaId}\n`;
    QnaId++;
  })
  fs.writeFileSync('./merged.tsv',qnaFile,'utf8');
  // console.log(dups)
}

writeFile();