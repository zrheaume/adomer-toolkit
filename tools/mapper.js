const fs = require("fs")
const chalk = require("chalk")
const utils = require("./utils")
const uuid = require("uuid/v4")
const good = str => console.log(chalk.bold.bgGreen.magenta(str))

const findChildren = (parent) => {
   let theLines = parent.split("\n")
   // good("Split lines")
   let results = []
   // good("Declared empty brk")
   for (let h = 0; h < theLines.length; h++) {
      // good(h)
      let testExp = new RegExp("<([a-z]+)\ ?([a-z]+=\".*?\"\ ?)?>([.\n\sa-z]*)(<\/\1>)?", "i")
      let exists = {
         "?": testExp.test(theLines[h]),
         "!": testExp.exec(theLines[h])
      }
      if (exists["?"]) {
         if (exists["!"][1].toLowerCase() === "route") {
            exists["!"][1] = /component={(.*)}/i.exec(exists["!"][0])[1]
         }
         results.push(exists["!"])
      }
      // results.push((/<([a-zA-Z1-6]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)/).test(lineArr[h]))
   }
   return results
}

class Layer {
   constructor(obj) {
      this.leaves = obj.leaves
      this.branches = obj.branches
   }
}

class Tree {
   constructor(extracted, origin) {
      this.origin = origin
      this.list = extracted
      this.names = this.list.map((item, n) => {
         return item.name
      })
      this.ids = this.list.map((item, n) => {
         return item.CID
      })
      this.nodes = []
      this.edges = []
      this.POE = this.locateTreeRoot()
      console.log(this.names)
      console.log(this.ids)
      this.root = this.names.indexOf(this.POE["render"]["component"])
      this.trace(this.names[this.root])

      good(this.nodes)
      good(this.edges)
      // good(JSON.stringify(this.root))
   }

   trace(parent, parentID = uuid()) {
      // let thisCompo
      let thisComponent = parent
      let thisTreeID = parentID
      good("Tracing " + thisComponent)
      if (this.names.indexOf(parent) !== -1) {
         let children = findChildren(this.list[this.names.indexOf(parent)].content)
         good(children)
         this.nodes.push({ id: thisTreeID, component: thisComponent })
         children.forEach((item, n) => {
            good("Pushing child")
            let childID = uuid()
            this.nodes.push({ id: childID, component: item })
            this.edges.push({ source: thisTreeID, target: childID })
            good("Tracing child")
            this.trace(item, parentID)
         })
      }
   }

   locateTreeRoot() {
      let parseRoot = function (line, file) {
         let newline = utils.killWhiteSpace(line)
         newline = newline.replace(/\.render\(/g, " \"render\" : { ")
         newline = newline.replace(/reactdom/gi, "{")
         newline = newline.replace(/\</gi, "\"component\" : \"")
         newline = newline.replace(/\/\>/gi, "\"")
         newline = newline.replace(/\,/gi, ", ")
         newline = newline.replace(/document\.getelementbyid/gi, "\"target\": ")
         newline = newline.replace(/\(/gi, "")
         newline = newline.replace(/\)\)/gi, "}")
         newline = newline.replace(/'/gi, "\"")
         newline = newline.replace(/;/gi, "")
         newline = newline + "}"

         // console.log(newline)
         let rootObj = eval(new Object(JSON.parse(newline)))
         let importComp = `.*import.*${rootObj["render"]["component"]}.*"(.*)"`
         let importCompRE = new RegExp(importComp, "i")
         for (let j = 0; j < file.length; j++) {
            let thisLine = file[j].replace(/'/gi, "\"")
            let testChk = importCompRE.test(thisLine)
            if (testChk) {
               let execChk = thisLine.match(importCompRE)
               // console.log(execChk[1])
               rootObj["render"]["source"] = execChk[1]
            }
         }
         return rootObj
      }
      try {
         let data = fs.readFileSync(this.origin, { encoding: "utf8" })
         if (data) {
            let lineArr = data.split("\n")
            for (let l = 0; l < lineArr.length; l++) {
               if (utils.includes.rootRender(lineArr[l])) {
                  // let parsedRoot = parseRoot(lineArr[l])
                  // console.log(parsedRoot)
                  return parseRoot(lineArr[l], lineArr)
               }
            }
         }

      } catch (err) {
         throw new Error("atkERR: Could not read POE file\n" + err)
      }
   }
}

module.exports = {
   Tree
}
