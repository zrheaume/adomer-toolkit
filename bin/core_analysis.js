#!/usr/bin/env node
// In development

let providedPath = process.argv[2]
const target_app = providedPath || process.cwd()

const app_validator = require("../lib/adomer-toolkit/core/validate/validateReactApp")

class Test {
   static isReactApp(arg) {
      console.log(app_validator.getRelevantStats(arg))
   }
}

console.log(target_app)
Test.isReactApp(target_app)