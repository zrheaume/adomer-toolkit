const fs = require("fs")
const chalk = require("chalk")
class Timer {
   constructor(label, verbose, color = "magenta") {
      this.start = (msg = `starting ${label}`) => {
         if (verbose === true) {
            console.time(label)
            console.log(chalk.blue.bold(msg))
         } else {
            return true
         }
      }
      this.end = (msg = "Done.") => {
         if (verbose === true) {
            console.log(chalk.green.bold(`${label} completed with no issues.`))
            console.timeEnd(label)
            console.log(chalk.green.bold(msg))
         } else {
            return true
         }
      }
      this.log = (msg) => {
         if (verbose === true) {
            console.timeLog(label, chalk[color].bold(msg))
         } else {
            return true
         }
      }
   }
}
const isIgnoredFileType = filename => {
   const ignoredExtentsions = [".md", ".txt", ".lock", ".json"]
   let shouldIgnore = null
   for (let b = 0; b < ignoredExtentsions.length; b++) {
      if (String(filename).endsWith(ignoredExtentsions[b])) {
         if (b === ignoredExtentsions.indexOf(".json") && String(filename).includes("package")) {
            return false
         } else {
            return true
         }
      } else {
         shouldIgnore = false
      }
   }
   return shouldIgnore
}
module.exports = {
   err: str => console.error(chalk.white.bgRed(`"atkERR: " + ${str} + ${ str.stack ? str.stack : "" }`)),
   isPathlike: str => /(.*\/)*/g.test(str),
   isScript: str => /.*\.js/.test(str),
   isFunctionComponent: str => /.*function.*\(.*props.*\).*{/gi.test(str),
   isClassComponent: str => /.*class\s+([A-Za-z]+)\s+extends/gi.test(str),
   importsExpressModule: str => /\s*import\s+([A-Za-z]+?)\s+from\s+\"express\"/.exec(str),
   establishesExpressInstance: str => /\s*([a-zA-Z]+?)\s+([A-Za-z]+?)\s*=\s*express\s*\(.*\)/.exec(str),
   addsMiddleware: (str, expInstance) => {
      // If middleware is configured via express instance .use()
      let patternUseStr = ()=> `${expInstance}\.use\((.*?)\)`
      // If middleware is configured by calling a function on express instance
      let patternFunStr = () => `(.*?)\(${expInstance}\)`
      let patternUseReg = new RegExp(patternUseStr(), "gi")
      let patternFunReg = new RegExp(patternFunStr(), "gi")
      return (patternUseReg.exec(str) || patternFunReg.exec(str))
   },
   ignore: filename => {
      const ignoredFilenames = ["node_modules", "build", ".gitignore", ".DS_Store", ".git"]
      let shouldIgnore = null
      for (let q = 0; q < ignoredFilenames.length; q++) {
         if (ignoredFilenames.indexOf(filename) !== -1) {
            return true
         } else if (isIgnoredFileType(filename)) {
            return true
         } else {
            shouldIgnore = false
         }
      }
      return shouldIgnore
   },
   reduceWhiteSpace: function (str) {
      return str.replace(/\s+/g, ' ');
   },
   killWhiteSpace: function (str) {
      return str.replace(/\s+/g, '');
   },
   includes: {
      React: str => /.*import React.*/gmi.test(str),
      Express: str => /.*import express.*/gmi.test(str),
      HTTPlistener: str => /.*\.listen/gmi.test(str),
      importTag: str => /.*import.*/g.test(str),
      rootRender: str => /((.*)\n)*reactdom\.render/gi.test(str),
      importItem: (str, item) => {
         let qStr = `import .*${item}.*`
         let qReg = new RegExp(qStr, "gmi")
         return qReg.test(str)
      },
      exportItem: (str, item) => {
         let qStr = `export .*${item}.*`
         let qReg = new RegExp(qStr, "g")
         return qReg.test(str)
      },
   },
   writeClientConfig: clientID => {
      return new Promise(function (resolve, reject) {
         try {
            fs.writeFile("/usr/local/bin/.atk", clientID, (err) => {
               if (err) throw new Error("atk ERR: Could not write .atk config\n" + err)
               return resolve(1)
            })
         } catch (err) {
            return reject(err)
         }
      })
   },
   getClientCred: () => {
      return new Promise(function (resolve, reject) {
         try {
            fs.readFile("/usr/local/bin/.atk", { encoding: "utf8" }, (err, data) => {
               if (err) throw new Error("atk ERR: Could not read .atk conig\n" + err)
               return resolve(data)
            })
         } catch (err) {
            return reject(err)
         }
      })
   },
   Timer: Timer

}