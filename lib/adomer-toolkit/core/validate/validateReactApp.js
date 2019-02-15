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
      this.mapDat = this.snoop(appDir)
   }

   snoop(pathLike) {
      // Uses fs.lstat to determine if the path is a dir
      if (pathLike[pathLike.length - 1] === "/") {
         pathLike.split()
         let tempPathLike = pathLike.pop()
         pathLike = tempPathLike.join("")
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

   }
   print() {
      return JSON.stringify(this, null, 3)
   }
}

function getRelevantStats(appDir) {
   return new ATKmap(appDir).print()
}

module.exports = {
   getRelevantStats
}