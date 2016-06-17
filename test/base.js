/* eslint-env mocha */
import fs from 'fs'
import cheerio from 'cheerio'
import Base from '../src/base.js'
import { expect } from 'chai'

const TEST_HTML = fs.readFileSync('./test/fixtures/hinsdale_mt_showtimes.html', 'utf8').replace(/(\n|\s{2,})/g, ' ')
let $ = cheerio.load(TEST_HTML)
const THEATRES = $('.theater').toArray()

describe('Base', function () {
  describe('constructor', function () {
    it('should take a cheerio element', function () {
      expect(() => new Base($(THEATRES[0]))).to.not.throw(Error)
    })
    it('should throw an error when not given a cheerio element', function () {
      expect(() => new Base(THEATRES[0])).to.throw(Error)
    })
    it('should set name, info, url, and id', function () {
      expect(new Base($(THEATRES[0]))).to.include.keys(['name', 'info', 'url', 'id'])
    })
  })
  describe('_stripAndTrim', function () {
    it('should take a string')
    it('should remove unicode characters')
    it('should trim whitespace')
  })
})
