// Project: adomer-toolkit / atk
// Filename: index.js
// Author: Zach Rheaume 
// Version: 1.0.0

class AdomerToolkit {
   // The Adomer Toolkit class is the top level class of the 
   // adomer-toolkit package. It is responsible for a host of 
   // tasks related to parsing, executing, and validating
   // atk commands ( atk <=> adomer-toolkit CLI )

   resolveCommand(cmd) {
      return require("./tools/resolveToolkitCommand")(cmd)
   } 

   run(cmd) {
      let atk_process = this.resolveCommand(cmd)
   }

   // importSCB method
   // Imports specified bundle into specified directory
   importSCB( /* args: [ <scb_pointer> : string, pathOut>{<scb_chunk>} : string ] */ args) {
      
   }

   // exportSCB method
   // Exports specified directory as an SCB under the specified name
   exportSCB( /*  args: [ pathIn>{<scb_chunk>} : string , <scb_pointer> : string ]*/ args) {
      
   }
}


module.exports = new AdomerToolkit