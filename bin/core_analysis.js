#!/usr/bin/env node
// In development

let providedPath = process.argv[2]

console.log(`Run core analysis on ${providedPath || process.cwd()}`)