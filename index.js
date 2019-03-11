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

const devUtil = require("util")

const chalk = require("chalk")
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
         client.getServiceID(creds).then(status => {
            if (status === 1) {
               timer.end()
            } else {
               utils.err("Something went wrong.")
            }
         })
      } else {
         utils.err("login command requires args : (-u || -username) && (-p || -password)")
      }
      break
   case "test":
      break
   // case "?":
   //    target = (utils.isPathlike(args._[1]) ? (args._[1] ? args._[1] : process.cwd()) : process.cwd())
   //    // console.log(utils.isPathlike(args._[1]))
   //    // mapdat = new validator.Validator(target)
   //    // console.log(JSON.stringify(mapdat.mapdata, null, 3))
   //    // timer.log("building validator")
   //    let devValidator = new Validator(target)
   //    // timer.log("building profiler")
   //    let devProfiler = new Profiler(devValidator)
   //    timer.end()
   //    // let toSvr = JSON.stringify({ val : devValidator, prof: devProfiler})
   //    // console.log(util.inspect(devProfiler, false, null, true /* enable colors */))
   //    // console.log(util.inspect(devValidator, false, null, true /* enable colors */))
   //    // console.log(toSvr)
   //    break
   case "dev":
      // console.log(args.c)
      if (args.c) {
         utils.getClientCred().then(cred => "TODO: add validator").catch(err => { throw err })
      }
      if (args.v && args._[1] && !args.s) {
         console.log(devUtil.inspect(new Validator(args._[1]), false, null, true))
      } else if (args.v && args._[1] && args.s) {
         return new Validator(args._[1])
      } else if (args.v && !args._[1]) {
         console.log(utils.err("dev validator requires target directory"))
      }

      if (args.p && args._[1]) {
         console.log(devUtil.inspect(new Profiler(args._[1]), false, null, true))
      }
      break
   case "hook":
      target = (utils.isPathlike(args._[1]) ? (args._[1] ? args._[1] : process.cwd()) : process.cwd())
      if (args.a || args.app) {
         client.hook(target, args.a || args.app).then(status => {
            if (status === "ok!") {
               console.log(chalk.bold.green(`Success! ${args.a || args.app} was added to your adomer online account.`))
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