var express = require('express');
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    logs = require('./logs.js'),
    config = require('./../config/config');

module.exports = {

    init: function(app){
        app.set('port', config[process.env.NODE_ENV].logfile || 3000);
        app.set('views', path.join(__dirname, '../views/jade'));
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(cookieParser());
        // development only
        if ('dev' == env) {
            //app.use(express.errorHandler());
            logs(app)
        }else{
        }

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(app.router);
        var env = process.env.NODE_ENV

        // 静态文件配置使用
        app.use(express.static(path.join(__dirname, '../public')));

        return app;
    }
}