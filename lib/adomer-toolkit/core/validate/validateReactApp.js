const fs = require("fs")
const path = require("path")

// ATKsnoop is our app file structure sniffing class
class ATKsnoop {
   // It takes in a pathlike string and
   constructor(pathLike) {
      // Uses fs.lstat to determine if the path is a dir
      let rawStats = fs.lstatSync(pathLike)
      this.isDir = rawStats.isDirectory()

      // Declare `next` var to be the next layer of files if a dir
      // or null if not a dir
      let next = this.isDir ? fs.readdirSync(pathLike) : null

      // If next is not null, we want to instantiate a new ATKsnoop
      // class on each element of the array of files
      if (next !== null) {
         this.contains = {}
         for (let f = 0; f < next.length; f++){
            this.contains[next[f]] = (next[f] !== 'node_modules' && next[f]!== '.git') ? new ATKsnoop(`${pathLike}/${next[f]}`) : "unmapped dir"
         }
      }
   }
}


class ATKmap {
   constructor(appDir) {
      this.mainDirPath = appDir
      this.mapDat = new ATKsnoop(appDir)
   }
   print() {
      return JSON.stringify(this.mapDat, null, 4)
   }
}

function getRelevantStats(appDir) {
   return new ATKmap(appDir).print()
}

function pathLeadsToReactApp(appDir) {
   // create object 'react app validator' (rav)
   return getRelevantStats(appDir)
}

module.exports = {
   pathLeadsToReactApp
}