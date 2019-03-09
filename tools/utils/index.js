const fs = require("fs")
const chalk = require("chalk")
class Timer {
   constructor(label, color="magenta") {
      this.start = (msg = `starting ${label}`) => {
         console.time(label)
         console.log(chalk.blue.bold(msg))
      }
      this.end = (msg = "Done.") => {
         console.log(chalk.green.bold(`${label} completed with no issues.`))
         console.timeEnd(label)
         console.log(chalk.green.bold(msg))
      }
      this.log = (msg) => {
         console.timeLog(label, chalk[color].bold(msg))
      }
   }
}
module.exports = {
   err : str=> console.error(chalk.white.bgRed("atkERR: " + str)),
   isPathlike: str => /(.*\/)*/g.test(str),
   isScript: str => /.*\.js/.test(str),
   isFunctionComponent: str => /.*function.*\(.*props.*\).*{/gi.test(str),
   isClassComponent: str => /.*class\s+([A-Za-z]+)\s+extends/gi.test(str),
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
   Timer : Timer

}