const chalk = require("chalk")
const uuid = require("uuid/v4")
const reduceWhiteSpace = function (str) {
   return str.replace(/\s+/g, ' ');
}
module.exports = {
   grab: (componentObj, lineArr, pathLike) => {
      let extracted = []
      for (let p = 0; p < componentObj.func.length; p++) {
         let grabStat = {
            name: null,
            CID: null,
            path: pathLike,
            start: null,
            end: null,
            content: [],
            matched: null,
            open: 0
         }
         let cRange = [componentObj.func[p], null]
         let cStart = cRange[0]
         // console.log(c)
         for (let k = cStart; k < lineArr.length; k++) {
            if (grabStat.end === null) {
               let line = lineArr[k]
               for (let u = 0; u < line.length; u++) {
                  let char = line[u]
                  if (char === "{" && grabStat.start === null) {
                     // console.log("Open bracket -> cStart")
                     grabStat.start = { line: k, at: u }
                     // grabStat.open 
                     if (grabStat.content.indexOf(lineArr[k]) === -1) {
                        grabStat.content.push(lineArr[k])
                     }
                     if (grabStat.name === null) {
                        let tempLine = reduceWhiteSpace(line).split(" ")
                        grabStat.name = tempLine[1].split(("("))[0]
                        grabStat.CID = uuid()

                        console.log(chalk.blue(grabStat.name))
                        console.log(grabStat.CID)
                        console.log(grabStat.path)
                     }
                  } else if ((char === "{" || char === "(") && grabStat.start !== null) {
                     grabStat.open++
                     if (grabStat.content.indexOf(lineArr[k]) === -1) {
                        grabStat.content.push(lineArr[k])
                     }
                  } else if ((char === "}" || char === ")") && grabStat.open > 0) {
                     grabStat.open--
                     if (grabStat.content.indexOf(lineArr[k]) === -1) {
                        grabStat.content.push(lineArr[k])
                     }
                  } else if (char === "}" && grabStat.open === 0) {
                     grabStat.end = { line: k, at: u }
                     if (grabStat.content.indexOf(lineArr[k]) === -1) {
                        grabStat.content.push(lineArr[k])
                     }
                  } else if (char && grabStat.open > 0 && grabStat.content.indexOf(lineArr[k]) === -1) {
                     grabStat.content.push(lineArr[k])
                  }
               }
            }
         }
         grabStat.content = grabStat.content.join("\n")
         // grabStat.content = grabStat.content.replace(new RegExp(`(${grabStat.name})`, "gmi"), `%%${grabStat.name}%%${grabStat.CID}%%`)
         console.log(chalk.green.bgWhite(JSON.stringify(grabStat.start)))
         console.log(chalk.magenta(grabStat.content))
         extracted.push(grabStat)
      }
      return (extracted)
   }
}