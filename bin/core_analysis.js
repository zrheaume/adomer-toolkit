#!/usr/bin/env node
// In development

const action = process.argv[2]
const providedPath = process.argv[3]
const target_app = providedPath || process.cwd()

const app_validator = require("./validator")

switch (action) {
   case "map":
      app_validator.viewCoreMap(providedPath)
      break
   case "?":
      app_validator.isReactEnabled(providedPath)
      break
}