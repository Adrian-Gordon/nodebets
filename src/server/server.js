'use strict'
const express = require('express')
const logger = require('../logger/log.js').logger
const setupAPI = require('../api/api.js').setupAPI

const startServer = (port, repository) => {


  return new Promise((resolve, reject) => {
  
    if (!repository) {
      reject(new Error('No connected repository provided for Server'))
    }
    if (!port) {
      reject(new Error('No port number provided for Server'))
    }

    const app = express()

    app.set('view engine','pug')
    app.locals.moment = require('moment');

    app.use('/static', express.static('/Users/adriangordon/Development/GP/data/newmongo'))

    app.use((err, req, res, next) => {
      reject(new Error('Something went wrong, err: ' + err))
      res.status(500).send('Something went wrong')
    })

    setupAPI(app, repository)

    const server = app.listen(port, () => resolve(server))
  })
}

module.exports = Object.assign({}, {startServer})
