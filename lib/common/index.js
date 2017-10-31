var request = require('request');
var config = require('../../config/config');
var jsonResult = require('../../lib/common/json_result');
var env = process.env.NODE_ENV
config = config[env];

module.exports = {


    /*
        接口跨域配置
    */
    setCrossDomain: function(res){
        if(env == "dev"){
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        }
    },


    /*
        获取cookies对应key值
    */
    getCookieKeyValue: function(name, cookie){
        var value = "";
        if(cookie){
            var cookies = cookie.split(";");
            for(var i in cookies){
                if(cookies[i].split("=")[0].trim()==name){
                    value = cookies[i].split("=")[1]
                }
            }
        }
        return value
    },


    /*
        设置cookies数据
    */
    setAppCookie: function(options){
        var user_id = options.req.headers['x-ys-uid'],
            user_token = options.req.headers['x-ys-user-token'],
            soft = options.req.headers['x-ys-soft'],
            os = options.req.headers['x-ys-os'],
            setval = {domain: '.youshu.cc', path: '/', maxAge: 60 * 1000};
        var u_id = this.getCookieKeyValue("user_id",options.req.headers.cookie)
        var u_token = this.getCookieKeyValue("user_token",options.req.headers.cookie)
        if(user_id && user_token && !u_id && !u_token){
            options.cookie('user_id', user_id, setval);
            options.cookie('user_token', user_token, setval);
            options.cookie('soft', soft, setval);
            options.cookie('os', os, setval);
        }
    },


    /*
        返回数据处理
    */
    updata: function(data){
        // changedRows  改变行数
        // affectedRows  影响行数
        if(data.changedRows>0 && data.affectedRows>0){
            return 1
        }else if(data.affectedRows>0 && data.changedRows<=0){
            return jsonResult.CODE_UPDATA_REPEAT
        }else{
            return jsonResult.CODE_ACTIVE_ERROR
        }
    }
    
}