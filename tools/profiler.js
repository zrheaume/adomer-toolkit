const validator = require("./validator")

class Profiler {
   constructor(appdir) {
      // Create validator profile
      this.ATKmap = new validator.ATKmap(appdir)
      this.createAppProfile()
   }

   // Using the ATKmap validator profile, we can begin to create a Profile
   // on our app
   createAppProfile() {
      // validationProfile is an instance of the ATKmap
      // We can leverage the ATKmap's inherant properties
      // `mainDirPath` => Filepath to the app dir
      // `has` => Obj { "app subset" : <bool> } 
      // `pathTo` => { "app subset" : <path> }
      // `mapped` => number of files/dirs noted by ATKmap
      // `mapDat` => { [ directory map : object ] }
      


   }

}

module.exports = {
   Profiler
}