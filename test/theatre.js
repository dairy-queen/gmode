/* eslint-env mocha */
import fs from 'fs'
import cheerio from 'cheerio'
import Theatre from '../src/theatre.js'
import { expect } from 'chai'

const TEST_HTML = fs.readFileSync('./test/fixtures/hinsdale_mt_showtimes.html', 'utf8').replace(/(\n|\s{2,})/g, ' ')
let $ = cheerio.load(TEST_HTML)
const THEATRES = $('.theater').toArray()

describe('Theatre', function () {
  describe('constructor', function () {
    it('should take a cheerio element', function () {
      expect(() => new Theatre($(THEATRES[0]))).to.not.throw(Error)
    })
    it('should throw an error when not given a cheerio element', function () {
      expect(() => new Theatre(THEATRES[0])).to.throw(Error)
    })
    it('should set name, info, url, id, and showtimes', function () {
      expect(new Theatre($(THEATRES[0]))).to.include.keys(['name', 'info', 'url', 'id', 'showtimes'])
    })
  })
})
