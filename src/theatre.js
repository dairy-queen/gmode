import Base from './base.js'
import Movie from './movie.js'
import $ from 'cheerio'

class Theatre extends Base {
  constructor (theatreElement) {
    super(theatreElement.find('.desc').first())

    // let description = $(theatreElement).find('.desc').first(),
    //     theatre = this._extractNameInfoURLId(description);

    this.showtimes = theatreElement
        .find('.showtimes .movie')
        .toArray()
        .map(movieElement => new Movie($(movieElement)))
  }
}

export default Theatre
