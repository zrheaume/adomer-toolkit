#!/usr/bin/env node
// In development

const action = process.argv[2]
const providedPath = process.argv[3]
const target_app = providedPath || process.cwd()

const app_validator = require("../lib/adomer-toolkit/core/validate/validateReactApp")

switch (action) {
   case "?":
      console.log(app_validator.getRelevantStats(providedPath))
}