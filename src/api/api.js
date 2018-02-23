'use strict'
const logger = require('../logger/log.js').logger
const status = require('http-status')
const rpWrapper = require('../rpwrapper/rpwrapper.js')

const setupAPI = (app, repository) => {
  logger.info('setupAPI')
  app.get('/races/:id', (req, res, next) => {
    repository.getRace(req.params.id).then(race => {
      res.status(status.OK).json(race)
    })
    .catch(next)
  })
 
  app.get('/getdatecards', (req, res, next) => {
    logger.info(JSON.stringify(req.query))
    rpWrapper.getDateCards(req.query.date, req.query.outputbatch).then(cards => {
      if (typeof req.params.outputbatch !== 'undefined' && req.params.outputbatch === 'true') {
        res.status(status.OK).send(cards)
      } else res.status(status.OK).json(cards)
    })
    .catch(next)
  })

   app.get('/betatestbets/:id', (req, res, next) => {
    repository.getBetaTestBet(req.params.id).then(bet => {
      logger.info(JSON.stringify(bet))
      res.render('betatestbet',bet)
    })
    .catch(next)
  })
}

module.exports = Object.assign({}, {setupAPI})
