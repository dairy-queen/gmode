require('babel-register')
var Movie = require('./src/movie.js').default
var Theatre = require('./src/theatre.js').default

module.exports = {
  Movie: Movie,
  Theatre: Theatre
}
