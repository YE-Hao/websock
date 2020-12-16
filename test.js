var express = require('express');
var expressWs = require('express-ws');

var router = express.Router();
expressWs(router);

router
  .ws('/user', function (ws, req){
    console.log('oksss')
      ws.on('message', function (msg) {
        ws.send(msg);
      })
   })
  

module.exports = router;