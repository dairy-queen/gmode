import Base from './base.js'
import $ from 'cheerio'

class Movie extends Base {
  constructor (movieElement) {
    super(movieElement)

    this._extractRuntime()

    let times = movieElement
        .children('.times')
        .children('span')
        .toArray()
        .map(el => $(el).text().normalize().match(/\d{1,2}:\d{2}/)[0])

    this.times = this._convertTimesTo24h(times)
  }

  _extractRuntime () {
    let hours = this.info.match(/\d+(?=hr)/)
    let mins = this.info.match(/\d+(?=min)/)

    hours = hours ? parseInt(hours) : 0
    mins = mins ? parseInt(mins) : 0

    this.runtime = 60 * hours + mins
  }

  _convertTimesTo24h (times, opinionated = true) {
    // opinionated is a flag that assumes that monotonic
    // sequences which never cross 12:00 are actually PM times...

    const THIRTEEN_OCLOCK = Date.parse('1970-01-01T13:00:00')
    const TWELVE_HOURS = Date.parse('1970-01-01T12:00:00')

    let timesAreIn24hFormat = false
    let times24h = []
    let breakpoint = -1

    times.forEach((time, index) => {
      // We only care about milliseconds since minute, it is convenient to choose Jan 1st, 1970 as our base.
      // However, we much check if the time we have is in the 24h-format
      // Adjusting it, if it is not, by adding a leading 0
      let millitaryTime = time.length === 5 ? time : '0' + time
      millitaryTime = Date.parse('1970-01-01T' + millitaryTime)

      // check to make sure the given time is in 24h format
      // and only change this once.
      if (!timesAreIn24hFormat && millitaryTime >= THIRTEEN_OCLOCK) {
        timesAreIn24hFormat = true
      }

      times24h[index] = millitaryTime

      // check for monotonicity:
      if (index > 1 && times24h[index - 1] > millitaryTime) {
        breakpoint = index
      }
    })

    // if breakpoint is never changed from its initial value,
    // then the times are monotonically increasing.
    if (breakpoint === -1) {
      if (timesAreIn24hFormat) {
        return times24h
      }
      // if we're opinionated AND the times aren't in a 24h format
      // AND we have a monotonic sequence, we'll need to add 12 hours
      // to each time, since we assume all times are PM
      if (opinionated) {
        return times24h.map(time => new Date(time + TWELVE_HOURS).getTime())
      } else {
        return times24h
      }
    }

    // now, we're in the situation where we've been given a sequence that
    // has a breakpoint in its monotonicity:
    // add 12 hours to each time after the breakpoint
    times24h.forEach((elem, index) => {
      if (index >= breakpoint) {
        times24h[index] = new Date(elem + TWELVE_HOURS).getTime()
      }
    })

    return times24h
  }
}

export default Movie
