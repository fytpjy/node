var path = require('path'),
    PHP = require('../../config/php'),
    config = require('../../config/config'),
    promise=require("bluebird"),
    comment = require('../../lib/common/index'),
    routes = require('../../routes/index'),
    jsonResult = require('../../lib/common/json_result'),
    eBookDataService = require('../../lib/service/eBookDataService'),
    webhost = process.env.NODE_WEBHOST,
    env = process.env.NODE_ENV,
    ebook = "/ebook";

module.exports = function(app) {

    /* 电子书数据统计 */
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

    // 查询出版社信息
    app.post(ebook+'/publisher', function(req, res){
        var code = req.body.code?req.body.code:"";
        if(code){
            eBookDataService.publisher(code)
            .then(function(data){
                res.send(jsonResult.getSuccessResult(data))
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    })

    // 查询接口
    app.post(ebook+'/search', function(req, res){
        var page = req.body.page?req.body.page:1,
            count = req.body.count?req.body.count:10,
            code = req.body.code?req.body.code:"",
            starttime = req.body.starttime?req.body.starttime:"",
            endtime = req.body.endtime?req.body.endtime:"";
        if(code){
            eBookDataService.search(code, page, count, starttime, endtime)
            .then(function(data){
                res.send(jsonResult.getSuccessResult({"rows":data}))
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    })

    return app;
}