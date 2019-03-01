// Require dependencies
const fs = require("fs")
const chalk = require("chalk")
// Require atk utils
const utils = require("./utils")
// Require extractor
const ext = require("./extractor")

class Profiler {
   constructor(validator) {
      try {
         this._flat = this.makeFlat(validator)
         this.flaggedAs = this.aggregateFlags()
         this.findComponents(this.flaggedAs)
      } catch (err) {
         console.error(err)
      }
   }
   // Instantiating this Profiler class on an instance of the Validator class
   // allows us to profile the directory. Step one - flatten the validator tree
   // to create a single-layer array that we can iterate over
   makeFlat(nest) {
      // Empty result array
      let _flat = []
      // Take the "nest" - nested Validator object - and pull out the mapdata obj.
      let mapdata = nest.mapdata

      // flatten function
      function flatten(obj) {
         // If the object describes a directory, we have to to go down a level and either
         // push the files contained or flatten any subdirectory contained.
         if (obj.isDir) {
            // Get all the child keys (filenames) of the "contains" property of dirs 
            // in the Validator instance to iterate over obj
            let childKeys = Object.keys(obj.contains)
            for (let q = 0; q < childKeys.length; q++) {
               let someKey = childKeys[q]
               let someItem = obj.contains[someKey]
               if (someItem.isDir && someItem.contains !== null) {
                  console.clear()
                  console.log("flattening subdir")
                  flatten(someItem)
               } else if (!someItem.isDir && someItem.contains === null) {
                  console.clear()
                  console.log("branch ended. pushing.")
                  _flat.push([someKey, someItem])
               }
            }
            // console.log(`${childKeys[0]} : ${obj.contains[childKeys[0]]}`)
         } else {
            console.clear()
            console.log("not dir. Should push.")
            _flat.push(obj)

         }
      }
      flatten(mapdata)
      return _flat
   }

   aggregateFlags() {
      let agg = {
         react: [],
         express: [],
         http: []
      }
      for (let p = 0; p < this._flat.length; p++) {
         let someName = this._flat[p][0]
         let someItem = this._flat[p][1]
         if (someItem.flags["react"]) { agg.react.push([someName, someItem]) }
         if (someItem.flags["express"]) { agg.express.push([someName, someItem]) }
         if (someItem.flags["listener_HTTP"]) { (agg.http.push([someName, someItem])) }
      }
      return agg
   }

   findComponents(flags) {
      console.log("Find components!")
      try {
         console.log(flags.react.length)
         for (let q = 0; q < flags.react.length; q++) {
            // for (let q = 0; q < 2; q++){
            let fileInfo = flags.react[q]
            let fileName = fileInfo[0]
            let fileMeta = fileInfo[1]
            if (fileInfo && fileName && fileMeta) {
               if (fileMeta.pathTo) {
                  fs.readFile(fileMeta.pathTo, "utf8", (err, data) => {
                     if (err) throw err
                     if (data) {
                        let components = {
                              func: [],
                              class: []
                           }
                        
                        // console.log(data.length)
                        let lineArr = data.split("\n")
                        // console.log(fileArr.length)
                        for (let l = 0; l < lineArr.length; l++) {
                           let target = null
                           let line = lineArr[l]
                           if (utils.isFunctionComponent(line)) {
                              components.func.push(l)
                              console.log(chalk.blue.bgWhite(`${l} -> ${line}`))
                           } else {
                              // console.log(chalk.yellow(`${l} -> ${line}`))
                           }
                        }
                        // data.split("\n")
                        let extracted = ext.grab(components, lineArr)
                        // console.log(chalk.green.bgBlue(`${fileMeta.pathTo} : ${JSON.stringify(components)}`))
                        for (let q = 0; q < extracted.length; q++){
                           console.log(chalk.yellow.bgBlue(extracted[q].content + "\n"))
                        }
                     }
                  })
               }
            } else {
               throw q
            }
         }
      } catch (err) {
         console.error(err)
      }
   }
}

module.exports = {
   Profiler
}