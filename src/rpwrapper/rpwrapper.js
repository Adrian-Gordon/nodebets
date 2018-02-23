'use strict'

const nconf = require('../config/conf.js').nconf
const logger = require('../logger/log.js').logger
const moment = require('moment')

const getDateCards = (date, outputbatch) => {
  logger.info('date: ' + date + ' outputbatch: ' + outputbatch)
  let result = []
  return new Promise((resolve, reject) => {
    if (typeof date === 'undefined') {
      date = moment().format('YYYY-MM-DD')
    }

    const url = nconf.get('rprooturl') + '/racecards/' + date

    const request = require('request')
    const headers = {
      'User-Agent': 'Mozilla/5.0'
    }

    const options = {
      url: url,
      headers: headers

    }

    request(options, (error, resp, body) => {
      if (error) {
        const obj = {
          status: 'ERROR',
          message: error
        }
        reject(obj)
      } else if (typeof resp === 'undefined') {
        const obj = {
          status: 'ERROR',
          message: 'No response from: ' + url
        }
        reject(obj)
      } else if (resp.statusCode !== 200) {
        var obj = {
          status: 'ERROR',
          message: JSON.stringify('bad response code: ' + resp.statusCode + ' from: ' + url)
        }
        logger.error('bad response code: ' + resp.statusCode + ' from: ' + url)
        reject(obj)
      } else {
        const cheerio = require('cheerio')
        let $ = cheerio.load(body)
        $('.RC-meetingItem a').each(function (index, value) {
          let raceUrl = $(value).attr('href')
          result.push(raceUrl)
        })

        if (typeof outputbatch !== 'undefined' && outputbatch === 'true') {
          let sendString = ''
          for (let i = 0; i < result.length; i++) {
            let rurl = result[i]
                 // sudo node /Users/adriangordon/Development/GP/data/scrape/downloadcard --raceid 643501 > dbatchout0.txt 2>&1 &
                 // sudo chmod +x dbatch0.sh
                // at -f dbatch0.sh now +1 minute
            sendString = sendString + 'echo "sudo node ' + nconf.get('scrapedir') + 'downloadcard --conf ' + nconf.get('datadir') + 'scrapeconfig.json --raceurl  ' + rurl + ' > ' + nconf.get('datadir') + 'dbatchout' + i + '.txt 2>&1 &" > ' + nconf.get('datadir') + 'dbatch' + i + '.sh\n'
            sendString = sendString + 'sudo chmod +x ' + nconf.get('datadir') + 'dbatch' + i + '.sh\n'
                  // sendString=sendString+"at -f dbatch" + i + ".sh now +" + ((i + 1) +(i * nconf.get("delay"))) +" minute\n";
            sendString = sendString + 'at -f ' + nconf.get('datadir') + 'dbatch' + i + '.sh now +' + i * nconf.get('delay') + ' minute\n'
          }
          resolve(sendString)
        } else resolve(result)
      }
    })
  })
}

module.exports = Object.assign({}, {getDateCards})
