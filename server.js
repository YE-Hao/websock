var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
const detector = require('detect-port');
const inquirer = require('inquirer');
const ip = require('ip');
const module1 = require('./test.js');
const wsClient = require('./wsClient.js');
const PORT = 8802;
const hostName = ip.address() || '127.0.0.1';
async function start() {
  const port = await detector(PORT);
  if(port !== PORT) {
    const result = await inquirer.prompt([
      {
        type:'confirm',
        name: 'confirm',
        message: `端口${PORT}已被占据，是否使用${port}?`,
      }
    ]);
    if(!result.confirm) {
      return;
    }
    const host = `${hostName}:${result.confirm ? port : PORT}`;
    console.log(host);
    app.use(function (req, res, next) {
      console.log('middleware');
      req.testing = 'testing';
      return next();
    });
     
    app.get('/', function(req, res, next){
      console.log('get route', req.testing);
      res.end();
    });
     
    app.ws('/', function(ws, req) {
      wsClient(ws,req);
      // ws.on('message', function(msg) {
      //   console.log(msg);
      // });
      console.log('socket', req.testing);
    });
    app.listen(port, hostName,() => {
      console.log(`服务运行在http://${host}`)
    })
  }
}
start();