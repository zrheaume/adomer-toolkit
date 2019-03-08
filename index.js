// DEV FT Start process timer
// Import minimist (CLI parser)
const minimist = require('minimist')
// Import utils
const utils = require("./tools/utils/index")
// DEV Declare process Timer and start it.
let timer = new utils.Timer("atk")
timer.start()
// Import atk tools
const Validator = require("./tools/validator").Validator
const Profiler = require("./tools/profiler").Profiler
const client = require("./tools/client")
// Parse process.argv as "args" with minimist
const args = minimist(process.argv.slice(2))
// Define `target` -> main execution arg of command
let target
// Run switch on `verb` [[first arg]]
switch (args._[0]) {
   // login command
   case "login":
      // if we pass -u or -username and we pass -p or -password we can submit credentials
      // to the server
      if ((args.u || args.username) && (args.p || args.password)) {
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
      // timer.log("building validator")
      let devValidator = new Validator(target)
      // timer.log("building profiler")
      let devProfiler = new Profiler(devValidator)
      timer.end()
      // let toSvr = JSON.stringify({ val : devValidator, prof: devProfiler})
      // console.log(util.inspect(devProfiler, false, null, true /* enable colors */))
      // console.log(util.inspect(devValidator, false, null, true /* enable colors */))
      // console.log(toSvr)
      break
   case "sbx":
      // console.log(args.c)
      if (args.c) {
         utils.getClientCred().then(cred => "TODO: add validator").catch(err => { throw err })
      }
      break
   case "hook":
      target = (utils.isPathlike(args._[1]) ? (args._[1] ? args._[1] : process.cwd()) : process.cwd())
      if (args.a || args.app) {
         client.hook(target, args.a || args.app).then(status => {
            if (status === "ok!") {
               timer.end()
            }
         })
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
   args: args._,
   Validator,
   Profiler
}