#!/usr/bin/env node
// In development

const action = process.argv[2]
const providedPath = process.argv[3]
const target_app = providedPath || process.cwd()

const app_validator = require("../tools/validator")

switch (action) {
   case "map":
      app_validator.viewCoreMap(target_app)
      break
   case "?":
      app_validator.reactEnabled(target_app)
      break
}