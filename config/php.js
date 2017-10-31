var request = require('request'),
    env = process.env.NODE_ENV,
    config = require('../config/config');

module.exports = {
    exec: function(options, callback){
        var host = (options.host && options.host != undefined)?options.host:config[env]['host'];
        var params = {  
            url: host + options.url,
            method: options.method,
            json: true,
            headers: {
                "content-type": "application/json",
            },
        }
        options.type=="form"?params.form = options.data:params.body = options.data;
        request(params,
        function (error, response, body) {
            callback(error, response, body)
        })
    },

}