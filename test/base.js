/* eslint-env mocha */
import $ from 'cheerio'
import { expect } from 'chai'
import THEATRES from './fixtures/theatres.js'
import Base from '../src/base.js'

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
