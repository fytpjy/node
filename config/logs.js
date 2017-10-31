var log4js = require('log4js'),
    config = require('./../config/config'),
    env = process.env.NODE_ENV;

module.exports = function(app) {

    // log日志
    log4js.configure({
        appenders: [
            { type: 'console' },{
                type: 'file', 
                filename: config[env].logfile, 
                maxLogSize: 1024000,
                backups: 1000,
                category: 'normal' 
            }
        ],
        replaceConsole: true
    });

    var logger = log4js.getLogger('normal');
    logger.setLevel('INFO');
    app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

    return app;
}