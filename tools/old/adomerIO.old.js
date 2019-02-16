// Project: adomer-toolkit / atk
// Filename: AdomerCLI.js
// Author: Zach Rheaume 
// Version: 1.0.0


// AdomerCLI class should provide us with :
// Methods to create an interface with the console using readline
// A series of switch statements to determine what action to take

class AdomerIO {

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
      this.wire = this.establishIO()
   }

   // prompt method 
   // takes in an optional message and returns
   prompt(/* callback: strIn =>{}  */ on_strIn = (strIn => { return console.log(strIn) }), /* str: message? */ message = false) {
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
   atk_import( /* args: [ atk import command, --opt, ... ] */ args) {
   }

   atk_bundle(args) {
   }

   // run method
   // main initialization function of the CLI
   run() {
   }

}

module.exports =  AdomerIO