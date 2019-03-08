const utils = require("./utils")
const timer = new utils.Timer("mapper")


const fs = require("fs")
const chalk = require("chalk")
const uuid = require("uuid/v4")
// const good = str => console.log(chalk.bold.magenta(str))
const findChildren = (parent, usrDef) => {
   let theLines = parent.content.split("\n")
   let results = []
   let openTag = /<\s*([a-z]+)\w*>/i
   let closeTag = /<\s*\/\s*([a-z]+)\s*>/i
   let selfClosingTag = /<\s*([a-z]+).*\/>/i
   let routerTag = /component={([a-z]+)}/i
   let count = {
      open: 0,
      all: 0
   }
   let tags = {
      open: []
   }
   for (let h = 0; h < theLines.length; h++) {
      let line = theLines[h]
      let lineContainsOpenTag = openTag.test(line)
      let lineContainsCloseTag = closeTag.test(line)
      let lineContainsSelfClosingTag = selfClosingTag.test(line)
      let ind = `${h} -> `
      if (lineContainsOpenTag) {
         ind = chalk.green(ind)
         let someTag = openTag.exec(line)[1]
         // console.log(`${someTag} just opened`)
         if ((usrDef.indexOf(someTag) > -1)) {
            // console.log(chalk.bold.green("found user defined component"))
            results.push(someTag)
         }
         count.open++
         tags.open.push(someTag)
      } else if (lineContainsCloseTag) {
         ind = chalk.yellow(ind)
         let someTag = closeTag.exec(line)[1]
         if ((usrDef.indexOf(someTag) > -1)) {
            // console.log(chalk.bold.green("found user defined component"))
            results.push(someTag)
         }
         if (tags.open.lastIndexOf(someTag) === tags.open.length - 1) {
            // console.log(someTag + " closed ")
            count.open--
            tags.open.pop()
            if (count.open > 0) {
               // console.log(`${tags.open} tags still open`)
            } else {
               // console.log("All non-self-closing tags have been closed")
            }
         }
      } else if (lineContainsSelfClosingTag) {
         ind = chalk.magenta(ind)
         let someTag = selfClosingTag.exec(line)[1]
         if ((usrDef.indexOf(someTag) > -1)) {
            // console.log(chalk.bold.green("found user defined component"))
            results.push(someTag)
         }
         // console.log(`${someTag} is self closing`)
         if (someTag.toLowerCase() === "route") {
            if (routerTag.test(line)) {
               let ref = routerTag.exec(line)[1]
               if ((usrDef.indexOf(ref) > -1)) {
                  // console.log(chalk.bold.green("found user defined ref in Route"))
                  results.push(ref)
               }
               // console.log(`Route refrences ${ref}`)
            } else {
               utils.err("Couldn't resolve router reference")
            }
         }
      } else {
         ind = chalk.red(ind)
      }
      // console.log(ind + line)
   }
   return results
}

class Tree {
   constructor(extracted, origin) {
      timer.start()
      timer.log("Planting seeds")
      this.origin = origin
      this.list = extracted
      this.names = this.list.map((item, n) => {
         return item.name
      })
      this.ids = this.list.map((item, n) => {
         return item.CID
      })
      this.nodes = []
      this.links = []
      this.POE = this.locateTreeRoot()
      // console.log(this.names)
      // console.log(this.ids)
      this.root = this.names.indexOf(this.POE["render"]["component"])
      if (this.root !== -1) {
         timer.log("Feeling treetops")
         this.trace(this.names[this.root])
      } else {
         utils.err("Root component is not a member of user defined components array")
      }
      // good(this.nodes)
      // good(this.links)
   }

   trace(parent, parentID = uuid()) {
      // let thisCompo
      let thisComponent = parent
      let thisTreeID = parentID
      // good("Tracing " + thisComponent)
      if (this.names.indexOf(parent) !== -1) {
         this.nodes.push({ id: parentID, component: parent })
         let children = findChildren(this.list[this.names.indexOf(parent)], this.names)
         // console.log(children)
         if (children.length > 0) {
            for (let h = 0; h < children.length; h++) {
               let childID = uuid()
               this.nodes.push({ id: childID, component: children[h] })
               this.links.push({ source: thisTreeID, target: childID })
               this.trace(children[h], childID)
            }
         }
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
