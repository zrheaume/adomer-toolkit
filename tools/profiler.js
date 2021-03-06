// Require atk utils
const utils = require("./utils")
// Require 3rd party dependencies
const fs = require("fs")
const chalk = require("chalk")
//Require validator
const Validator = require("./validator").Validator
// Require extractor
const ext = require("./extractor")
// Require mapper
const mapper = require("./mapper")

class Profiler {
   constructor(validator, options) {
      options = Object(options)
      if (typeof validator === "string") {
         validator = new Validator(validator, { verbose: options["verbose"] })
      }
      try {
         this.timer = new utils.Timer("profiler", options.verbose)
         this.timer.start()
         this.timer.log("Flattening the hierarchy")
         this._src = validator.pathTo.self
         this._flat = this.makeFlat(validator)
         this.mapped = 0
         // this.tag = (files = this._flat, mapped = this.mapped) => {
         //    this.structure = {}
         //    if (Array.isArray(files)) {
         //       let file = files[mapped]
         //       if (!utils.ignore(file[0])) {
         //          let codeChunk = fs.readFileSync(file[1].pathTo, { encoding: "utf8" })
         //       }
         //    }
         // }
         // this.markup = this.tag()
         this.types = []
         this.timer.log("Dehumanizing application")
         this.extracted = this.findComponents(this.aggregateFlags())
         // this.expressed = this.findExpressItems(this.aggregateFlags())
         this.timer.log("Hold on.")
         this.stats = this.getStats()
         this.timer.log("Practicing cartography")
         this.tree = new mapper.Tree(this.extracted, validator.pathTo.poe, options)
         this.timer.end("Ready to transfer.")
      } catch (err) {
         utils.err(err)
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
                  flatten(someItem)
               } else if (!someItem.isDir && someItem.contains === null) {
                  _flat.push([someKey, someItem])
               }
            }
         } else {
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
      // console.log("Find components!")
      var grab = []
      try {
         // console.log(flags.react.length)
         for (let q = 0; q < flags.react.length; q++) {
            // for (let q = 0; q < 2; q++){
            let fileInfo = flags.react[q]
            let fileName = fileInfo[0]
            let fileMeta = fileInfo[1]
            if (fileInfo && fileName && fileMeta) {
               if (fileMeta.pathTo) {
                  let data = fs.readFileSync(fileMeta.pathTo, "utf8")
                  if (data) {
                     let components = {
                        func: [],
                        class: []
                     }
                     let lineArr = data.split("\n")
                     for (let l = 0; l < lineArr.length; l++) {
                        let target = null
                        let line = lineArr[l]
                        if (utils.isFunctionComponent(line)) {
                           components.func.push(l)
                        } else if (utils.isClassComponent(line)) {
                           components.class.push(l)
                        }
                     }
                     this.types.push(components)
                     let extractor = ext.grab(components, lineArr, fileMeta.pathTo)
                     for (let u = 0; u < extractor.length; u++) {
                        let item = extractor[u]
                        grab.push(item)
                     }
                  }
               }
            } else {
               throw q
            }
         }
      } catch (err) {
         utils.err(err)
      } finally {
         return grab
      }
   }

   // findExpressItems(flags) {
   //    let grab = []
   //    let toRead = []
   //    for (let h = 0; h < flags.express.length; h++){
   //       toRead.push(flags.exprss[h])
   //    }
   //    for (let q = 0; q < flags.http.length; q++){
   //       toRead.push(flags.http[q])
   //    }
   //    let extracted = {
   //       count: 0,
   //       instanceName: null,
   //       endpoints: []
   //    }
   //    let run = (list, extracted) => {
   //       let expressItem = list[extracted.count]

   //       extracted.count++
   //    }

   //    run(toRead, extracted)

   // }

   getStats() {
      let theStats = {
         ΣSt: 0,
         // ^ Total stateful
         ΣSl: 0,
         // ^ Total stateless
         ΣFu: 0,
         // ^ Total function-defined
         ΣCl: 0,
         // ^ Total class-defined
         ΣEfl: 0,
         // ^ Total effectful
         ΣEfs: 0,
         // ^ Total effectless
         ΣMon: 0,
         // ^ Total monitored
         ΣCuH: 0,
         // ^ Total num hooks
         μStSl: 0.00,
         // ^ Ratio stateful/stateless
         μFuCl: 0.00
         // ^ Ratio functionDef/classDef
      }
      // console.log()
      for (let q = 0; q < this.types.length; q++) {
         // console.log(this.types[q].func.length + "<-f || c ->" + this.types[q].class.length)
         theStats.ΣFu += this.types[q].func.length
         theStats.ΣCl += this.types[q].class.length
      }

      for (let j = 0; j < this.extracted.length; j++) {
         let theComp = this.extracted[j].content
         if (/usestate/gmi.test(theComp)) {
            theStats.ΣSt++
         } else if (/this\.state/gmi.test(theComp)) {
            theStats.ΣSt++
         } else {
            theStats.ΣSl++
         }

         if (/.*componentdidmount.*/gmi.test(theComp)) {
            theStats.ΣEfl++
         } else if (/useffect/gmi.test(theComp)) {
            theStats.ΣEfl++
         } else {
            theStats.ΣEfs++
         }
         if (/use([a-z_]).*/gmi.test(theComp)) {
            theStats.ΣCuH++
         }

         if ((/componentdid/gmi.test(theComp) || /componentwill/gmi.test(theComp) || /componentshould/gmi.test(theComp)) && !/componentdidmount/gmi.test(theComp)) {
            theStats.ΣMon++
         }
      }
      if (theStats.ΣFu > 0 && theStats.ΣCl > 0) {
         theStats.μFuCl = theStats.ΣFu / theStats.ΣCl
      } else if (theStats.ΣFu > 0 && theStats.ΣCl === 0) {
         theStats.μFuCl = "all"
      }
      if (theStats.ΣSt > 0 && theStats.ΣSl > 0) {
         theStats.μStSl = theStats.ΣSt / theStats.ΣSl
      }
      return theStats
   }
}

module.exports = {
   Profiler
}