const axios = require("axios")
const utils = require("./utils")
const chalk = require("chalk")
const Profiler = require("./profiler").Profiler
const Validator = require("./validator").Validator
const getServiceID = function (creds) {
   // console.log(creds)
   axios.put("https://adomer.herokuapp.com/act/addClient", creds)
      .then((res) => {
         // console.log(res.data)
         if (res.data) {
            utils.writeClientConfig(res.data).then(status => {
               if (status === 1) {
                  console.log(chalk.bold.green("atk client configuration successful"))
               }
            })
         }
      }).catch(err => {
         utils.err("ServiceErr: Could not verify credentials\n" + err)
      })
}
const hook = function (appDir, appName) {
   return new Promise(async function (resolve, reject) {
      try {
         let profiler = new Profiler(new Validator(appDir))
         let cred = await utils.getClientCred()
         const toSvr = {
            name: appName,
            cred: cred,
            content: JSON.stringify(profiler)
         }
         axios.post("https://adomer.herokuapp.com/api/apps", toSvr).then(res => {
            console.log(res.data)
         }).catch(err => {
            utils.err("ServiceErr: Could not hook application\n" + err)
         })

      } catch (err) {
         return reject(err)
      }
   })
}

module.exports = {
   getServiceID,
   hook
}