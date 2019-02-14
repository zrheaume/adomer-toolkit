// Project: adomer-toolkit / atk
// Filename: index.js
// Author: Zach Rheaume 
// Version: 1.0.0

class AdomerToolkit {
   // The Adomer Toolkit class contains many helpful methods for creating a
   // standard self-contained bundle of components

   // Adomer Toolkit syntax guide SCB or "Standard Component Bundle"

   // initializeCLIapp method
   // Starts atk config CLI
   initializeCLIapp() {
      console.log("Welcome to the adomer-toolkit CLI \nAdomer version 1.0.0 \nUse command 'import --default' to install default component library")
      require("./AdomerCLI").run()
   }

   // importSCB method
   // Imports specified bundle into specified directory
   // 
   importSCB( /* args: [ <scb_pointer> : string, pathOut>{<scb_chunk>} : string ] */ args) {
      
   }

   // exportSCB method
   // Exports specified directory as an SCB under the specified name
   exportSCB( /*  args: [ pathIn>{<scb_chunk>} : string , <scb_pointer> : string ]*/ args) {
      
   }
}


module.exports = new AdomerToolkit