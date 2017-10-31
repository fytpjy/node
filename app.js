var express = require('express');
var http = require('http');
require('shelljs/global');
env.NODE_ENV = "prod";
env.NODE_WEBHOST = "ys";
process.argv.forEach(function (val, index, array) {
    switch(index){
        case 2:
            env.NODE_ENV = val
        break;
        case 3:
            env.NODE_WEBHOST = val
        break;
    }
});

var config = require('./config/index');
var routes = require('./config/reqroutes');
var conf = require('./config/config');
var jade = require('./config/htmljade');
var app = express();

config.init(app)
routes.init(app)
jade.init()

http.createServer(app).listen(conf[env.NODE_ENV].port, function(){
    console.log('启动端口' + conf[env.NODE_ENV].port);
});
