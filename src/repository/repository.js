'use strict'
var execSync=require('child_process').execSync

var logger = require('../logger/log.js').logger

const nconf = require('../config/conf.js').nconf

const repository = (dbConnection) => {
  logger.info('repository ' + dbConnection)

  const getRace = (raceid) => {
    logger.info('In getRace ' + raceid + ' connection: ' + dbConnection.constructor.name)
    const collection = dbConnection.db('rpdata').collection('races')
    return new Promise((resolve, reject) => {
      collection.findOne({_id: raceid}, (err, race) => {
        if (err) {
          reject(new Error('An error occured fetching a race with id:' + raceid + ' err: ' + err))
        }
        resolve(race)
      })
    })
  }

  const getBetaTestBet = (raceid) => {
    //logger.info('In getRace ' + raceid + ' connection: ' + dbConnection.constructor.name)
    const collection = dbConnection.db('rpdata').collection('betatestbets')
    return new Promise((resolve, reject) => {
      collection.findOne({rpraceid: raceid}, (err, bet) => {
        if (err) {
          reject(new Error('An error occured fetching a betatestbet with id:' + raceid + ' err: ' + err))
        }
        let hIndex = 0
        for(let horse in bet.horses){
          let h = bet.horses[horse]
          if((h.status == "LOSER")||(h.status == "WINNER")){
            h.imageIndex = hIndex++
            //generate the horse images
            const cmd = "/Users/adriangordon/Development/GP/data/newmongo/plothorse.sh /Users/adriangordon/Development/GP/data/newmongo/" + raceid + " " + h.imageIndex
            console.log(cmd)
            const rval = execSync(cmd);
          }

        }
         //generate the race image
        const cmd = "/Users/adriangordon/Development/GP/data/newmongo/plotrace.sh /Users/adriangordon/Development/GP/data/newmongo/" + raceid
        const rval = execSync(cmd);
        logger.info("execSync returns: " + rval)
        resolve(bet)
      })
    })
  }

  const getHorsePerformances = (raceid, horseid) => {
    const collection1 = dbConnection.db('rpdata').collection('horses')
    const collection2 = dbConnection.db('rpdata').collection('races')
    return new Promise((resolve, reject) => {
      collection1.findOne({_id:horseid}, (err, horse) =>{
        if (err) {
          reject(new Error('An error occured fetching a horse with id:' + horseid + ' err: ' + err))
        }
        collection2.findOne({_id:raceid}, (err, race) =>{
          if (err) {
            reject(new Error('An error occured fetching a race with id:' + raceid + ' err: ' + err))
          }
          let performances=horse.performances
          let perfids=Object.keys(performances)
          let nperfs=perfids.length;
          for(let i=0;i<nperfs;i++){
            let perfid=perfids[i]
            let performance=performances[perfid]
            performance["exclude"] = ""
            let cardRaceType=1;
            if(race.racetype=='HURDLE'){
              cardRaceType=1
            }
            else if(race.racetype=='CHASE'){
               cardRaceType=2
            }

            let perfRaceType=1;
            if(performance.racetype=='HURDLE'){
              perfRaceType=1
            }
            else if(performance.racetype=='CHASE'){
               perfRaceType=2
            }

            let cardCode="FLAT"
            if(race.racetype=='CHASE'){

              cardCode="JUMPS"
            }
            else if(race.racetype=="HURDLE"){
              cardCode="JUMPS"
            }

            var perfCode="FLAT"
            if(performance.racetype=="CHASE"){
              perfCode="JUMPS"
            }
            else if(performance.racetype=="HURDLE"){
              perfCode="JUMPS"
            }
            let goodPerf = false
            if(performance.date < race.date){
              goodPerf=true
              performance["exclude"] = ""
            }
            if(daysBetween(race.date,performance.date) > nconf.get("maxperfage")){
              goodPerf=false
              performance["exclude"] = "too old"
              
            }
            if(typeof performance.percentofwinningtime == 'undefined'){
              goodPerf=false
              performance.exclude = "tailed off"
            }
            if(performance.percentofwinningtime < nconf.get("minwinspeedpercent")){
              goodPerf=false
              performance["exclude"] = "too slow for dist"
              
            }
            let msindex=Math.floor((performance.distance -1000.0)/100.0);
            let maxSpeed=nconf.get("maxspeeds")[msindex]
            if(performance.speed > maxSpeed){
              //logger.info("badperf because speed is too high");
              //console.log(performance.speed +" : " + " index: " + msindex + " " + nconf.get("maxspeeds")[msindex])
              goodPerf=false
              performance["exclude"] = "too fast"
              
            }
            let minSpeedFactor=nconf.get("minspeedfactor")
            if(performance.speed < (minSpeedFactor * maxSpeed)){
              //console.log("Too slow a performance: " + performance.speed + " " + (minSpeedFactor * maxSpeed));
              goodPerf=false
              performance.exclude = "too slow"
            }
            if(performance.speed > 20.0){
              
              goodPerf=false
              performance["exclude"] = "faster than 20"
            }
            if(performance.speed < 12.0){
              
              goodPerf=false
              performance["exclude"] = "slower than 12"
            }
            if(perfCode !== cardCode){
              
              goodPerf=false
              performance["exclude"] = "wrong code"
            }
            //logger.info(hid + " " + perfid + " " + performance.date + " " + goodPerf);
            if(Math.abs(race.distance - performance.distance) > nconf.get('maxdistdiff')){
              
              goodPerf=false
             performance["exclude"] = "distance too different"
            }
            logger.info(goodPerf + " "  + JSON.stringify(performance))

          }
          horse.race=race
          resolve(horse)

        })
        
      })
      
    })
  }

  const daysBetween = (date1, date2) =>{
     //Get 1 day in milliseconds
    let one_day=1000*60*60*24

    // Convert both dates to milliseconds
    let date1_ms = date1.getTime()
    let date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    let difference_ms = date2_ms - date1_ms
    
    let days = Math.floor(difference_ms/one_day) 
    logger.info(date1 + " " + date2 + " " + days)
    return Math.abs(days)
  }

  return Object.create({
    getRace,
    getBetaTestBet,
    getHorsePerformances
  })
}

const getRepository = (connection) => {
  logger.info('In getRepository, connection is: ' + connection)
  return new Promise((resolve, reject) => {
    logger.info('in getRepository promise, connection is: ' + connection)
    if (!connection) {
      logger.info('go reject')
      reject(new Error('No Database Connection provided'))
    } else {
      logger.info('go resolve')
      resolve(repository(connection))
    }
  })
}

// logger.info("getRepository: " + getRepository);

module.exports = Object.assign({}, {getRepository})
// module.exports = {getRepository};
