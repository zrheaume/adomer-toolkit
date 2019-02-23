module.exports = {
   isPathlike: str => /(.*\/)*/g.test(str),
   includesReact: str => /.*import React.*/gmi.test(str),
   includesExpress: str => /.*import express.*/gmi.test(str),
   includesHTTPlistener: str => /.*\.listen/gmi.test(str)
}