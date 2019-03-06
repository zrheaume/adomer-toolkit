// DEV FT Start process timer 
console.time("process")
// Import minimist (CLI parser)
const minimist = require('minimist')
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
// Run switch on `verb` [[first arg]]
switch (args._[0]) {
   // login command
   case "login":
      if ((args.u && args.p) || (args.username && args.password)) {
         let creds = {
            username: args.u || args.username,
            secret: args.p || args.password
         }
         client.getServiceID(creds)
      } else {
         utils.err("login command requires args : (-u || -username) && (-p || -password)")
      }
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
      // let toSvr = JSON.stringify({ val : devValidator, prof: devProfiler})
      console.timeEnd("process")
      // console.log(util.inspect(devProfiler, false, null, true /* enable colors */))
      // console.log(util.inspect(devValidator, false, null, true /* enable colors */))
      // console.log(toSvr)
      break
   case "sbx":
      console.log(args.c)
      if (args.c) {
         utils.getClientCred().then(cred => console.log(cred)).catch(err => { throw err })
      }
      break
   case "hook":
      target = (utils.isPathlike(args._[1]) ? (args._[1] ? args._[1] : process.cwd()) : process.cwd())
      if (args.a) {
         client.hook(target, args.a)
      } else if (args.app) {
         client.hook(target, args.app)
      } else {
         utils.err("atkERR: `hook` requires an arg (-app || -a) <appName>")
      }
      break
   case "reel":
      break
   default:
      break
}

module.exports = {
   args: args._
}