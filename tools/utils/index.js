const fs = require("fs")
module.exports = {
   isPathlike: str => /(.*\/)*/g.test(str),
   isScript: str => /.*\.js/.test(str),
   isFunctionComponent: str => /.*function.*\(.*props.*\).*{/gi.test(str),
   isClassComponent: str => /.*class.*extends.*{.*Component.*}/.test(str),
   includes: {
      React: str => /.*import React.*/gmi.test(str),
      Express: str => /.*import express.*/gmi.test(str),
      HTTPlistener: str => /.*\.listen/gmi.test(str),
      importTag: str => /.*import.*/g.test(str),
      importItem: (str, item) => {
         let qStr = `import .*${item}.*`
         let qReg = new RegExp(qStr, "g")
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
            fs.readFile("/usr/local/bin/.atk", {encoding: "utf8"}, (err, data) => {
               if (err) throw new Error("atk ERR: Could not read .atk conig\n" + err)
               return resolve(data)
            })
         } catch (err) {
            return reject(err)
         }
      })


   }

}