module.exports = function ( /* String */ cmd) {
   switch (cmd[0]) {
      case "init":
         switch (cmd[1]) {
            case "new": case "-n":
               require("../core/configureNewInstance")(process.cwd())
               break
            case "connect": case "-c":
               console.log("Connect to adomer?")
               break
            default:
               console.error("adomer err: 'init' requires an argument")
               break
         }
         break
      
      case "pull": case "--p":
         switch (cmd[1]) {
            case "bundle": case "-b":
               console.log(`pull bundle ${cmd[2]}`)
               break
            case "chunk": case "-c":
               console.log(`pull chunk ${cmd[2]}`)
               break
            case "default": case "-d":
               console.log("pull default")
               break
            default:
               return console.error("adomer err: 'pull' requires a modifier\nuse 'pull -d' to pull default bootstrap bundle")
         }
         break
      
      case "import": case "--i":
         switch (cmd[2]) {
            default:
               return console.error("adomer err: 'import' requires a modifier")
         }
         break

      case "bundle": case "--b":
         console.log("bundle")
         break
      
      case "config":
         console.log("config")
         break
      
      case "version": case "--v": 
         console.log("adomer-toolkit version 1.0.0")
         break
      
      case "help": case "--h":
         console.log("help? pfft.")
         break
      
      default:
         return console.log("atk err: not a valid command")
   }
}

