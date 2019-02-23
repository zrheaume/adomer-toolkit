#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const utils = require("./utils")
const profiler = require("./profiler")

class Validator {
   constructor(appDir) {
      this.appDir = appDir
      this.pathTo = {
         self: this.appDir
      }
      this.meta = {
         mapped: 0,
         is: { "react-enabled": null },
         has: {}
      }
      this.mapdata = this.snoopDir(appDir)
      this.determineAppValidity()
   }

   snoopDir(pathLike) {
      try {
         // Resolve input path
         pathLike = path.resolve(pathLike)
         
         // Use fs.lstat to determine if the path is a dir
         let rawStats = fs.lstatSync(pathLike)
         let isDir = rawStats.isDirectory()

         // Declare `next` var to be the next layer of files if a dir or null if not a dir
         let next = isDir ? fs.readdirSync(pathLike) : (null);

         // Use regex test on path to check for certain react-standard directories
         (/^.*\/src$/.test(pathLike)) ? (this.setPath("src", pathLike)) : (null);
         (/.*\/src\/index\.js/.test(pathLike)) ? (this.setPath("poe", pathLike)) : (null);

         // If next is not null, we want to instantiate a new ATKsnoop
         // class on each element of the array of files
         let contains = {}
         let flags = {}
         let pathTo = pathLike
         if (next !== null) {
            for (let f = 0; f < next.length; f++) {
               contains[next[f]] = (next[f] !== 'node_modules' && next[f] !== '.git' &&next[f] !== 'build') ? this.snoopDir(`${pathLike}/${next[f]}`) : "unmapped dir"
            }
         } else if (next === null && !isDir) {
            console.clear()
            console.log(`Reading ${pathLike} for keywords`)
            let fileContents = fs.readFileSync(pathLike, { encoding: "utf8" })
            flags = {
               react: utils.includesReact(fileContents),
               express: utils.includesExpress(fileContents),
               listener_HTTP: utils.includesHTTPlistener(fileContents)
            }
            contains = null
            console.log(`${pathLike} : ${flags}`)
         } else {
            throw Error
         }
         
         this.meta.mapped++
         
         return {
            isDir,
            pathTo,
            contains,
            flags
         }
      } catch (err) {
         console.error(err)
      }
   }

   setPath(ref, path) {
      this.meta.has[ref] = true
      this.pathTo[ref] = path
   }
   
   determineAppValidity() {
      try {
         let POE = fs.readFileSync(this.pathTo["poe"], { encoding: "utf8" });
         ((/((.*)\n)*reactdom\.render/gi).test(POE)) ? (this.meta.is["react-enabled"] = true) : (this.meta.is["react-enabled"] = false)
      } catch (err) {
         this.meta.is["react-enabled"] = false
      }
   }
}

function run(appDir) {
   let thisValidator = new Validator(appDir)
   let thisProfiler = new profiler.Profiler(thisValidator)

   return thisProfiler
}


module.exports = { Validator, run }