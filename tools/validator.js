#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const utils = require("./utils")

const timer = new utils.Timer("validator")


class Validator {
   constructor(appDir) {
      timer.start()
      this.appDir = appDir
      this.pathTo = {
         self: this.appDir
      }
      this.meta = {
         mapped: 0,
         is: { "react-enabled": null },
         has: {}
      }
      timer.log("Propogating nosiness")
      this.mapdata = this.snoopDir(appDir)
      this.determineAppValidity()
      timer.end("done.")
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

         // If next is not null, we want to (potentially) instantiate a new ATKsnoop
         // class on each element of the array of files
         let contains = {}
         let flags = {}
         let pathTo = pathLike
         if (next !== null) {
            for (let f = 0; f < next.length; f++) {
               contains[next[f]] = !utils.ignore(next[f]) ? this.snoopDir(`${pathLike}/${next[f]}`) : "NOMAP"
               if (contains[next[f]] === "NOMAP") {
                  // contains = "NOMAP"
               }
               // contains[next[f]] = (next[f] !== 'node_modules' && next[f] !== '.git' && next[f] !== 'build' && next[f] !== ".DS_Store") ? this.snoopDir(`${pathLike}/${next[f]}`) : "unmapped dir/file"
            }
         } else if (next === null && !isDir) {
            let fileContents = fs.readFileSync(pathLike, { encoding: "utf8" })
            flags = {
               react: utils.includes.React(fileContents),
               express: utils.includes.Express(fileContents),
               listener_HTTP: utils.includes.HTTPlistener(fileContents)
            }
            contains = null

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
         utils.err(err)
      }
   }

   setPath(ref, path) {
      this.meta.has[ref] = true
      this.pathTo[ref] = path
   }

   determineAppValidity() {
      try {
         let POE = fs.readFileSync(this.pathTo["poe"], { encoding: "utf8" });
         ((/((.*)\n)*reactdom\.render/gmi).test(POE)) ? (this.meta.is["react-enabled"] = true) : (this.meta.is["react-enabled"] = false)
      } catch (err) {
         this.meta.is["react-enabled"] = false
      }
   }
}

module.exports = { Validator }