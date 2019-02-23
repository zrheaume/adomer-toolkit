// Import minimist (CLI parser)
const minimist = require('minimist')
const util =require("util")
// Import utils
const utils = require("./tools/utils/index")


// Import atk tools
const validator = require("./tools/validator")
const configurer = require("./tools/configurer")
const profiler = require("./tools/profiler")

// Parse process.argv with minimist as "args"
const args = minimist(process.argv.slice(2))
console.log(args)

// Define `target` -> main execution arg of command
let target

switch (args._[0]) {
   case "login":
      break
   case "create":
      break
   case "?":
      let devObj
      target = (utils.isPathlike(args._[1]) ? (args._[1] ? args._[1] : process.cwd()) : process.cwd())
      // console.log(utils.isPathlike(args._[1]))
      // mapdat = new validator.Validator(target)
      // console.log(JSON.stringify(mapdat.mapdata, null, 3))
      devValidator = new validator.Validator(target)
      devProfiler = new profiler.Profiler(devValidator)
      // console.log(util.inspect(devProfiler, false, null, true /* enable colors */))
      // console.log(mapdat)
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