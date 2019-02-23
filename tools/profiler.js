
class Profiler {
   constructor(validator) {
      // Create validator profile
      // console.time('validate')
      // this.validator = validator
      // console.timeEnd('validate')
      console.time('flatten')
      this._flat = this.makeFlat(validator)
      console.timeEnd('flatten')
      this.flaggedAs = this.aggregateFlags()

   }
   // Using the ATKmap validator profile, we can begin to create a Profile
   // on our app
   makeFlat(nest) {
      let _flat = []
      let mapdata = nest.mapdata

      function flatten(obj) {
         if (obj.isDir) {
            console.clear()
            console.log("dir. Should flatten.")
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
         if(someItem.flags["react"]){ agg.react.push([someName, someItem])}
         if (someItem.flags["express"]) {agg.express.push([someName, someItem])}
         if (someItem.flags["listener_HTTP"]) {(agg.http.push([someName, someItem]))}
      }
      return agg
   }

}

module.exports = {
   Profiler
}