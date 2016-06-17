var fs = require('fs')
var cheerio = require('cheerio')
var Theatre = require('../../index.js').Theatre

let testHtml = fs.readFileSync('./tests/fixtures/hinsdale_mt_showtimes.html').toString()
let $ = cheerio.load(testHtml.replace(/(\n|\s{2,})/g, ' '))

let theatres = $('.theater')
  .toArray()
  .map(theatreElement => new Theatre($(theatreElement)))

console.log(theatres)
