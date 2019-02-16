const fs = require("fs")
const onWriteFail = function (err) {
   if (err) {
      throw err
   }
}
module.exports = function (installPath) {
   if (!fs.existsSync(`${installPath}/adomer`)) {
      console.log("adomer: creating install")
      try {
         fs.mkdirSync(`${installPath}/adomer`)
         console.log("adomer: created adomer dir")
         fs.writeFile(`${installPath}/adomer/config.json`,`{ "adomerEnabled" : "true" }`, onWriteFail)
         fs.writeFile(`${installPath}/adomer/README.md`, null, onWriteFail)
      } catch (err){
         console.error("adomer err: could not create adomer directory.", err)
      }
   } else {
      console.log("Adomer has already been created...")
   }
}