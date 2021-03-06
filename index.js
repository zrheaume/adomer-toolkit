// Import minimist (CLI parser)
const minimist = require('minimist')
// Import utils
const utils = require("./tools/utils/index")
// Import atk tools
const Validator = require("./tools/validator").Validator
const Profiler = require("./tools/profiler").Profiler
const client = require("./tools/client")

const devUtil = require("util")

const chalk = require("chalk")
// Parse process.argv as "args" with minimist
const args = minimist(process.argv.slice(2), { boolean: true })
// Set some default paramaters
if (args.verbose === true) {
   args.verbose = true
} else {
   args.verbose = false
}


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
            } else {
               utils.err("Something went wrong.")
            }
         })
      } else {
         utils.err("login command requires args : (-u || -username) && (-p || -password)")
      }
      break
   case "dev":
      if (args.c) {
         utils.getClientCred().then(cred => "TODO: add validator").catch(err => { throw err })
      }
      if (args.p && args._[1] && !args.s) {
         console.log(devUtil.inspect(new Profiler(args._[1], { verbose: args.verbose }), false, null, true))
      } else if (args.p && args._[1] && args.s) {
         return new Profiler(args._[1], { verbose: args.verbose })
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
         client.hook(target, (args.a || args.app), { verbose: args.verbose }).then(status => {
            if (status === "ok!") {
               console.log(chalk.bold.green(`Success! ${args.a || args.app} was added to your adomer online account.`))
            }
         })
      } else {
         utils.err("atkERR: `hook` requires an arg (-app || -a) <appName>")
      }
      break
   case "reel":
      if (args.a || args.app) {
         client.reel(args.a || args.app)
      } else {
         utils.err("atkERR: `reel` requires an arg (-app || -a) <appName>")
      }
      break
   default:
      break
}

module.exports = {
   args: args._,
   Validator,
   Profiler
}