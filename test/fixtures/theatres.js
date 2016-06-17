import fs from 'fs'
import cheerio from 'cheerio'
const TEST_HTML = fs.readFileSync('./test/fixtures/hinsdale_mt_showtimes.html', 'utf8').replace(/(\n|\s{2,})/g, ' ')
let $ = cheerio.load(TEST_HTML)
const THEATRES = $('.theater').toArray()

export default THEATRES
