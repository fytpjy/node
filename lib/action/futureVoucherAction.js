var path = require('path'),
    PHP = require('../../config/php'),
    config = require('../../config/config'),
    promise=require("bluebird"),
    comment = require('../../lib/common/index'),
    jsonResult = require('../../lib/common/json_result'),
    webhost = process.env.NODE_WEBHOST,
    env = process.env.NODE_ENV,
    siteHost = "http://m.youshu.cc/",
    futurevoucher = "/futurevoucher";

module.exports = function(app) {


    /* 优惠券  */
    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

        if (req.method == 'OPTIONS') {
            res.send(200);
        }else {
            next();
        }
    });
    
    /*
    **优惠券列表
    */
    app.get(futurevoucher+'/list',function(req, res){
        res.render('../FutureVoucher/VoucherList')
        
    })
    
    /*
    **领取卡券
    */
    app.get(futurevoucher+'/shade',function(req, res){
        res.render('../FutureVoucher/Shade')
    })
    
    /*
    **领取成功
    */
    app.get(futurevoucher+'/success',function(req, res){
        res.render('../FutureVoucher/GetSuccess')
    })
    
    /*
    **兑换规则
    */
    app.get(futurevoucher+'/cashrule',function(req, res){
        res.render('../FutureVoucher/CashRule')
    })
    
    /*
    **激活兑换码
    */
    app.get(futurevoucher+'/activecash',function(req, res){
        res.render('../FutureVoucher/ActiveCash')
    })
    
    /*
    **我的账户
    */
    app.get(futurevoucher+'/account',function(req, res){
        res.render('../FutureVoucher/Account')
    })



    return app;

}