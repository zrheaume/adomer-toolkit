const axios = require("axios")
const utils = require("./utils")
const chalk = require("chalk")
const Profiler = require("./profiler").Profiler
const Validator = require("./validator").Validator
// Function to "login" to online account and obtain a service ID
const getServiceID = function (creds) {
   return new Promise(function (resolve, reject) {
      try {
         axios.put("https://adomer.herokuapp.com/act/addClient", creds)
            .then((res) => {
               if (res.data) {
                  utils.writeClientConfig(res.data).then(status => {
                     if (status === 1) {
                        console.log(chalk.bold.green("atk: client configuration successful"))
                        return resolve(status)
                     } else {
                        utils.err("Could not write client config")
                     }
                  })
               } else {
                  utils.err("Could not GET client config")
               }
            }).catch(err => {
               utils.err("ServiceErr  !   Could not verify credentials\n" + err)
            })
      } catch (err) {
         return reject(err)
      }
   })
}
const hook = function (appDir, appName, options) {
   return new Promise(async function (resolve, reject) {
      try {
         let profiler = new Profiler(new Validator(appDir, options), options)
         let cred = await utils.getClientCred()
         const toSvr = {
            name: appName,
            cred: cred,
            content: JSON.stringify(profiler)
         }
         axios.post("https://adomer.herokuapp.com/api/apps", toSvr).then(res => {
            // console.log(res.data)
            return resolve(res.data)
         }).catch(err => {
            utils.err("ServiceErr  !   Could not hook application\n" + err)
         })
      } catch (err) {
         return reject(err)
      }
   })
}

const compareDiff = function (appData) {
   console.log(appData)
   if (appData.content._src) {
      let priorVersion = appData.content
      try {
         let updatedProfiler = new Profiler(appData.content._src)
         if (Object.keys(updatedProfiler).length === Object.keys(priorVersion).length) {
            appData.content = JSON.stringify(updatedProfiler)
            axios.put(`https://adomer.herokuapp.com/api/apps/reel/`)
         }

      } catch (err) {

      }

   }
}
const reel = function (appName) {
   return new Promise(async function (resolve, reject) {
      try {
         let cred = await utils.getClientCred()
         const toSvr = {
            name: appName,
            cred: cred
         }
         axios.get(`https://adomer.herokuapp.com/api/apps/reel/${toSvr.name}`, { headers: { cred: toSvr.cred } }).then(res => {
            compareDiff(res.data)
         })
      } catch (err) {
         return reject(err)
      }
   })
}


module.exports = {
   getServiceID,
   hook,
   reel
}