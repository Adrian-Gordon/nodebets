'use strict'
var execSync=require('child_process').execSync

var logger = require('../logger/log.js').logger

const nconf = require('../config/conf.js').nconf

const repository = (dbConnection) => {

  const getRace = (raceid) => {
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
    const goingMappings=nconf.get("goingMappings")
    const gpnode=require(nconf.get("gpnodepath"));

    const rule=nconf.get("rule")
    const stats=nconf.get("observationStats")
    const node=new gpnode().parseNode(rule,nconf.get('variables'),nconf.get('functionSet'))
    const minfofx=nconf.get('minfofx')
    const maxfofx=nconf.get('maxfofx')
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
          let targetPerformance=horse.performances[raceid]
          if(!targetPerformance){
            if(horse.status !== 'REMOVED'){
              logger.error("No performance found for horse " +horse._id + " in race " + rpraceid);
              logger.error(JSON.stringify(hs))
        
            }
          }
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
              goodPerf=false
              performance["exclude"] = "too fast"
              
            }
            let minSpeedFactor=nconf.get("minspeedfactor")
            if(performance.speed < (minSpeedFactor * maxSpeed)){
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
            if(Math.abs(race.distance - performance.distance) > nconf.get('maxdistdiff')){
              
              goodPerf=false
             performance["exclude"] = "distance too different"
            }

            let observation = {
                perfid:perfid,
                speed1:performance.speed,
                going1:goingMappings[performance.going],
                going2:goingMappings[race.going],
                goingdiff: goingMappings[race.going]-goingMappings[performance.going],
                distance1:performance.distance,
                distance2:race.distance,
                distancediff:race.distance - performance.distance,
                weight1:performance.weight,
                weight2:targetPerformance.weight,
                weightdiff:targetPerformance.weight -performance.weight
            }
             //Now do the prediction
            let predictedVal=node.eval(observation)
            let predictedProportion=(predictedVal - minfofx)/(maxfofx - minfofx)
            let predictedChange=nconf.get('observationStats').minSpeedDif.dif +(predictedProportion *(nconf.get('observationStats').maxSpeedDif.dif - nconf.get('observationStats').minSpeedDif.dif))
            //var observation=nconf.get("observation");

            let predictedSpeed=observation.speed1 + (predictedChange *  observation.speed1)

            performance["prediction"] = predictedSpeed


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
    return Math.abs(days)
  }

  return Object.create({
    getRace,
    getBetaTestBet,
    getHorsePerformances
  })
}

const getRepository = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('No Database Connection provided'))
    } else {
      resolve(repository(connection))
    }
  })
}



module.exports = Object.assign({}, {getRepository})

