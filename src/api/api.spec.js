'use strict'

const logger = require('../logger/log.js').logger
const request = require('supertest')
const server = require('../server/server')
const should = require('should')

describe('Bets API', () => {
  let app = null
  let testRace ={

    "_id" : "663916",
    "conditions" : [ 
        {
            "conditiontype" : "conditions",
            "ageconditions" : {
                "lower" : 3
            }
        }, 
        {
            "conditiontype" : "distance",
            "miles" : 1,
            "furlongs" : 1,
            "yards" : 0
        }, 
        {
            "conditiontype" : "going",
            "going" : "Fast"
        }
    ],
    "date" : "2016-11-25T00:00:00.000Z",
    "distance" : 1810.512,
    "going" : "Fast",
    "iscomplete" : false,
    "meeting" : "JEBEL ALI",
    "offtime" : "\n «\n 11:45 »\n ",
    "racetype" : "FLAT",
    "runners" : [ 
        "885766", 
        "773163", 
        "902506", 
        "800195", 
        "880233", 
        "306618", 
        "778883", 
        "772741", 
        "724592", 
        "818169"
    ],
    "surface" : "AW",
    "winningtime" : 109.14

  }

  let testRepo = {
    getRace () {
      logger.info("calling testRepo getRace");
      return Promise.resolve(testRace)
    }
  }

  beforeEach(() =>{
    return server.startServer(3000, testRepo).then(serv => {
      app = serv
    })
  })

  afterEach(() =>{
    app.close()
    app = null
  })

  it('can return a race', (done) => {
    request(app)
      .get('/races/663916')
      .expect((res) => {
        logger.info("ID: " + res.body._id)
        let id = res.body._id
        id.should.eql("663916")
      })
      .expect(200, done)
  })
})