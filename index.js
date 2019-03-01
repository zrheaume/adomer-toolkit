// DEV FT Start process timer 
console.time("process")
// Import minimist (CLI parser)
const minimist = require('minimist')
const util = require("util")
// Import utils
const utils = require("./tools/utils/index")

// Import atk tools
const validator = require("./tools/validator")
const profiler = require("./tools/profiler")
const client = require("./tools/client")

// Parse process.argv as "args" with minimist
const args = minimist(process.argv.slice(2))

// Define `target` -> main execution arg of command
let target

switch (args._[0]) {
   case "login":
      let creds = {
         username: args.u,
         secret: args.p
      }
      client.getServiceID(creds)
      break
   case "create":
      break
   case "?":
      target = (utils.isPathlike(args._[1]) ? (args._[1] ? args._[1] : process.cwd()) : process.cwd())
      // console.log(utils.isPathlike(args._[1]))
      // mapdat = new validator.Validator(target)
      // console.log(JSON.stringify(mapdat.mapdata, null, 3))
      let devValidator = new validator.Validator(target)
      let devProfiler = new profiler.Profiler(devValidator)
      console.timeEnd("process")
      // console.log(util.inspect(devProfiler.flaggedAs, false, null, true /* enable colors */))
      break
   case "sbx":
      console.log(args.c)
      if (args.c) {
         utils.getClientCred().then(cred=>console.log(cred)).catch(err=>{throw err})
      }
      break
   case "hook":
      break
   case "reel":
      break
   default:
      break
}

module.exports = {
   args: args._
}