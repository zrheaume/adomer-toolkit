let toolkitLoaded = false

try {
   const atk = require("./lib")
   toolkitLoaded = true
   switch (process.argv[2]) {
      case "init" || "-i":
         // console.log("open adomer-toolkit interface")
         atk.initializeCLIapp()
         break;
      case "help" || "-h":
         console.log("open adomer-toolkit command list")
         break;
      default: 
         console.log(`err: could not find arg. \ntry -help or -h to see a list of adomer commands`)
         break;
   }
} catch (err) {
   console.log(err.stack)
}
