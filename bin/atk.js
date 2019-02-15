#!/usr/bin/env node
let toolkitLoaded = false
try {
   const atk = require("../lib/adomer-toolkit")
   const cmd = process.argv.slice(2)
   atk.run(cmd)
} catch (err) {
   console.log(err.stack)
} finally {
   toolkitLoaded = true
}