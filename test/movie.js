/* eslint-env mocha */
import $ from 'cheerio'
import { expect } from 'chai'
import THEATRES from './fixtures/theatres.js'
import Movie from '../src/movie.js'

describe('Movie', function () {
  describe('constructor', function () {
    it('should take a cheerio element', function () {
      let movieElements = $(THEATRES[0]).find('.showtimes .movie').toArray()
      expect(() => new Movie($(movieElements[0]))).to.not.throw(Error)
    })
    it('should throw an error when not given a cheerio element', function () {
      expect(() => new Movie(THEATRES[0])).to.throw(Error)
    })
    it('should have properties: name, info, url, id, times and runtime', function () {
      let movieElements = $(THEATRES[0]).find('.showtimes .movie').toArray()
      expect(new Movie($(movieElements[0]))).to.include.keys(['name', 'info', 'url', 'id', 'times', 'runtime'])
    })
  })
  describe('_convertTimesTo24h', function () {
    it('should take an array of times and a flag')
    it('should return an array of times formatted to the 24 hour clock')
  })
})
