/**
 * Created by user on 14/06/16.
 */
"use strict";

class Base {

    constructor(element) {
        // assume element is a cheerio object:
        // I've noticed that some google HTML seems to have Left-to-Right marks
        // (\u200E) strewn about so we'll have to strip them
        this.name = this._stripAndTrim(element.find('.name').text());
        this.info = this._stripAndTrim(element.find('.info').text());
        this.url = element.find('.name a').attr('href');
        this.id = undefined;

        if (this.url) {

            // clean up white space on the URL
            this.url = this.url.trim();

            // extract the theatre of movie id from the URL.
            // the mid or tid depends on whether element has the
            // "theater" or "movie" HTML class.
            let regexMatch = this.url.match(/[tm]id=(\w*)/);
            this.id = regexMatch ? regexMatch[1] : undefined;
        }
    }

    _stripAndTrim(string) {
        return string.replace(/[^\x00-\x7F]/g, '').replace(/\s{2,}/g, ' ').trim();
    }

}

class Movie extends Base {

    constructor(movieElement) {
        super(movieElement);

        this._extractRuntime();

        let times = movieElement
            .children('.times')
            .children('span')
            .toArray()
            .map(el => $(el).text().normalize().match(/\d{1,2}:\d{2}/)[0]);

        this.times = this._convertTimesTo24h(times);
    }

    _extractRuntime() {
        let hours = this.info.match(/\d+(?=hr)/),
            mins = this.info.match(/\d+(?=min)/);

        hours = hours ? parseInt(hours) : 0;
        mins = mins ? parseInt(mins) : 0;

        this.runtime = 60 * hours + mins;
    }

    _convertTimesTo24h(times, opinionated = true) {

        // opinionated is a flag that assumes that monotonic
        // sequences which never cross 12:00 are actually PM times...

        const THIRTEEN_OCLOCK = Date.parse('1970-01-01T13:00:00'),
            TWELVE_HOURS = Date.parse('1970-01-01T12:00:00');

        let timesAreIn24hFormat = false,
            times24h = [],
            breakpoint = -1;

        times.forEach((time, index) => {
            // we can check that time is in 24h-format on-the-fly
            // by checking that Date.parse returns a truth-y value
            // If it doesn't we'll prepend a leading 0 to time
            let newTime = Date.parse('1970-01-01T' + time);
            newTime = newTime ? newTime : Date.parse('1970-01-01T0' + time);

            // check to make sure the given time is in 24h format
            // and only change this once.
            if (!timesAreIn24hFormat && newTime >= THIRTEEN_OCLOCK) {
                timesAreIn24hFormat = true;
            }

            times24h[index] = newTime;

            // check for monotonicity:
            if (index > 1 && times24h[index - 1] > newTime) {
                breakpoint = index;
            }
        });

        // if breakpoint is never changed from its initial value,
        // then the times are monotonically increasing.
        if (breakpoint === -1) {

            if (timesAreIn24hFormat) {
                return times24h;
            }
            // if we're opinionated AND the times aren't in a 24h format
            // AND we have a monotonic sequence, we'll need to add 12 hours
            // to each time, since we assume all times are PM
            if (opinionated) {
                return times24h.map(time => new Date(time + TWELVE_HOURS).getTime());
            } else {
                return times24h;
            }
        }

        // now, we're in the situation where we've been given a sequence that
        // has a breakpoint in its monotonicity:
        // add 12 hours to each time after the breakpoint
        times24h.forEach((elem, index) => {
            if (index >= breakpoint) {
                times24h[index] = new Date(elem + TWELVE_HOURS).getTime();
            }
        });

        return times24h;
    }

}

class Theatre extends Base {

    constructor(theatreElement) {

        super(theatreElement.find('.desc').first());

        // let description = $(theatreElement).find('.desc').first(),
        //     theatre = this._extractNameInfoURLId(description);

        this.showtimes = theatreElement
            .find('.showtimes .movie')
            .toArray()
            .map(movieElement => new Movie($(movieElement)));
    }
}

var fs = require('fs'),
    cheerio = require('cheerio');

let test_html = fs.readFileSync('hinsdale_mt_showtimes_test.html').toString();
let $ = cheerio.load(test_html.replace(/(\n|\s{2,})/g, ' '));

let theatres = $('.theater')
    .toArray()
    .map(theatreElement => new Theatre($(theatreElement)));

console.log(theatres);