class Base {
  constructor (element) {
    // assume element is a cheerio object:
    // I've noticed that some google HTML seems to have Left-to-Right marks
    // (\u200E) strewn about so we'll have to strip them
    this.name = this._stripAndTrim(element.find('.name').text())
    this.info = this._stripAndTrim(element.find('.info').text())
    this.url = element.find('.name a').attr('href')
    this.id = undefined

    if (this.url) {
      // clean up white space on the URL
      this.url = this.url.trim()

      // extract the theatre of movie id from the URL.
      // the mid or tid depends on whether element has the
      // "theater" or "movie" HTML class.
      let regexMatch = this.url.match(/[tm]id=(\w*)/)
      this.id = regexMatch ? regexMatch[1] : undefined
    }
  }

  _stripAndTrim (string) {
    return string.replace(/[^\x00-\x7F]/g, '').replace(/\s{2,}/g, ' ').trim() // eslint-disable-line
  }
}

export default Base
