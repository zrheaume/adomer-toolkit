// Project: adomer-toolkit / atk
// Filename: AdomerCLI.js
// Author: Zach Rheaume 
// Version: 1.0.0


// AdomerCLI class should provide us with :
// Methods to create an interface with the console using readline
// A series of switch statements to determine what action to take

class AdomerCLI {

   // establishIO method
   // returns a readline Interface that gives control of the  to the CLI
   establishIO() {
      try {
         const readline = require("readline")
         return readline.createInterface({ input: process.stdin, output: process.stdout })
      } catch {
         console.error("adomer-err: could not create command line interface")
      }
   }

   constructor() {
      this.io = this.establishIO()
   }

   // prompt method 
   // takes in an optional message and returns
   prompt(on_strIn = (strIn => { return console.log(strIn) }), message = false) {
      let inputInstance = this.io.question(`${message ? `${message}\nadomer~ ` : "adomer~ "}`, (strIn) => {
         on_strIn(strIn)
      })
   }

   // Here we'll add functions that our CLI will use to
   // process individual commands
   
   // atk import function will parse a command line
   // "import" command
   // atk import command syntax:
      // import < options > < component library >
   atk_import(args) {
   
      switch (args) {
         
         default:
            console.log("err in cmd")
      }
      
   }

   atk_bundle(args) {
      
   }

   // run method
   // main initialization function of the CLI
   run() {
      this.prompt((strIn) => {
         let cmd = strIn.split(" ")
         switch (cmd[0]) {
            case "import" || "-i":
               console.log("Import component library")
               atk_import(cmd.slice(1))
               break;
            case "bundle" || "-i":
               console.log("Bundle custom component library")
               atk_bundle(cmd.slice(1))
               break;
            default:
               console.log("Command not recognized")
               break;
         }
      })

   }

}

module.exports = new AdomerCLI