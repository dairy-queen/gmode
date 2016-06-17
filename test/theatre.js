/* eslint-env mocha */
import $ from 'cheerio'
import { expect } from 'chai'
import THEATRES from './fixtures/theatres.js'
import Theatre from '../src/theatre.js'

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
