// Project: adomer-toolkit / atk
// Filename: index.js
// Author: Zach Rheaume 
// Version: 1.0.0

class AdomerToolkit {
   // The Adomer Toolkit class contains many helpful methods for creating a
   // contained, reusable react component that you can bundle into a kit

   initializeCLIapp() {
      console.log("Welcome to the adomer-toolkit CLI \nAdomer version 1.0.0 \nUse command 'import --default' to install default component library")
      require("./AdomerCLI").run()
   }
}


module.exports = new AdomerToolkit