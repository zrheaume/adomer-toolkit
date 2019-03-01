const axios = require("axios")
const utils = require("./utils")
const getServiceID = function (creds) {
   console.log(creds)
   axios.put("http://localhost:8080/act/addClient", creds)
      .then((res) => {
         // console.log(res.data)
         if (res.data) {
            utils.writeClientConfig(res.data)
         }
      }).catch(err => {
         throw new Error("ServiceErr: Could not verify credentials\n" + err)
      })

}

module.exports = {
   getServiceID
}