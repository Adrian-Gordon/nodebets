'use strict'
const express = require('express')
const logger = require('../logger/log.js').logger
const setupAPI = require('../api/api.js').setupAPI

const startServer = (port, repository) => {
  logger.info('In startServer')

  return new Promise((resolve, reject) => {
    logger.info('In promise')
    if (!repository) {
      logger.info('go reject 1')
      reject(new Error('No connected repository provided for Server'))
    }
    if (!port) {
      logger.info('go reject 2')
      reject(new Error('No port number provided for Server'))
    }

    const app = express()

    app.set('view engine','pug')
    app.locals.moment = require('moment');

    app.use((err, req, res, next) => {
      reject(new Error('Something went wrong, err: ' + err))
      res.status(500).send('Something went wrong')
    })
    logger.info('go resolve 1')

    setupAPI(app, repository)

    const server = app.listen(port, () => resolve(server))
  })
}

module.exports = Object.assign({}, {startServer})
