module.exports = {
   grab: function (componentObj, lineArr) {
      let extracted = []
      for (let p = 0; p < componentObj.func.length; p++) {
         let grabStat = {
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
                     console.log("Open bracket -> cStart")
                     grabStat.start = { line: k, at: u }
                     if (grabStat.content.indexOf(lineArr[k]) === -1) {
                        grabStat.content.push(lineArr[k])
                     }
                  } else if (char === "{" && grabStat.start !== null) {
                     grabStat.open++
                     if (grabStat.content.indexOf(lineArr[k]) === -1) {
                        grabStat.content.push(lineArr[k])
                     }
                  } else if (char === "}" && grabStat.open > 0) {
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
         extracted.push(grabStat)
      }
      return (extracted)
   }
}