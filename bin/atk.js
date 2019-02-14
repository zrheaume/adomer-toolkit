#!/usr/bin/env node
let toolkitLoaded = false
try {
   const atk = require("../lib/atk")
   const cmd = process.argv.slice(2)
   console.log(cmd)
   switch (process.argv[2]) {
      case "init": case "-i":
         atk.initializeCLIapp()
         break;
      case "help": case "-h":
         console.log("open adomer-toolkit command list")
         break;
      default: 
         console.log(`err: could not find arg. \ntry -help or -h to see a list of adomer commands`)
         break;
   }
} catch (err) {
   console.log(err.stack)
} finally {
   toolkitLoaded = true
}