const fs = require("fs")
const path = require("path")

// // ATKsnoop is our app file structure sniffing class
// class ATKsnoop extends ATKmap {
//    // It takes in a pathlike string and

// }


class ATKmap {
   constructor(appDir) {
      this.mainDirPath = appDir
      this.has = {}
      this.pathTo = { self: appDir }
      this.mapped = 0
      this.is = {
         "react-enabled": null
      }
      this.mapDat = this.snoop(appDir)
      this.determineAppValidity()
   }

   snoop(pathLike) {
      // Uses fs.lstat to determine if the path is a dir
      if (pathLike[pathLike.length - 1] === "/") {
         pathLike = pathLike.substring(0, pathLike.length - 1)
      }
      let rawStats = fs.lstatSync(pathLike)
      let isDir = rawStats.isDirectory()
      // Declare `next` var to be the next layer of files if a dir
      // or null if not a dir
      let next = isDir ? fs.readdirSync(pathLike) : (null);
      (/^.*\/src$/.test(pathLike)) ? (this.setPath("src", pathLike)) : (null);
      (/.*\/src\/index\.js/.test(pathLike)) ? (this.setPath("poe", pathLike)) : (null);
      // If next is not null, we want to instantiate a new ATKsnoop
      // class on each element of the array of files
      let contains = {}
      if (next !== null) {
         for (let f = 0; f < next.length; f++) {
            contains[next[f]] = (next[f] !== 'node_modules' && next[f] !== '.git') ? this.snoop(`${pathLike}/${next[f]}`) : "unmapped dir"
         }
      } else if (next === null) {

      }

      this.mapped++
      return {
         isDir,
         contains
      }
   }

   setPath(ref, path) {
      this.has[ref] = true
      this.pathTo[ref] = path
   }

   determineAppValidity() {
      try {
         let POE = fs.readFileSync(this.pathTo["poe"], { encoding: "utf8" });
         ((/((.*)\n)*reactdom\.render/gi).test(POE)) ? (this.is["react-enabled"] = true) : (this.is["react-enabled"] = false)
      } catch (err) {
         this.is["react-enabled"] = false
      }
   }

   printStats() {
      console.log(`success!\n`)
      console.log(`audited ${this.mapped} files from [ App ] :: `)
      console.log(`${this.pathTo["self"]}\n`)
      console.log(`determined that this app ${this.is["react-enabled"] ? "*IS*" : "*IS NOT*"} react enabled`)
      if (this.is["react-enabled"]) {
         console.log(`found src dir at ${this.pathTo["src"]}`)
         console.log(`found point of entry at ${this.pathTo["poe"]}`)
      }
   }

   printMap() {
      console.log(JSON.stringify(this.mapDat, null, 2))
   }
}

// function getRelevantStats(appDir) {
//    return new ATKmap(appDir)
// }

function viewCoreMap(appDir) {
   return new ATKmap(appDir).printMap()
}

function isReactEnabled(appDir) {
   return new ATKmap(appDir).printStats()
}

module.exports = { 
   viewCoreMap,
   isReactEnabled
}