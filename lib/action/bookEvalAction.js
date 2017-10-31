var path = require('path'),
    // multipart = require('connect-multiparty'),
    PHP = require('../../config/php'),
    config = require('../../config/config'),
    promise=require("bluebird"),
    comment = require('../../lib/common/index'),
    jsonResult = require('../../lib/common/json_result'),
    bookEvalService = require('../../lib/service/bookEvalService'),
    webhost = process.env.NODE_WEBHOST,
    env = process.env.NODE_ENV,
    // siteHost = config[env]['webhost'],
    siteHost = "https://m.youshu.cc/",
    bookeval = "/bookeval";
    // multipartMiddleware = multipart();

module.exports = function(app) {


    /* 有书众测  */
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


    // 列表首页
    app.get(bookeval+'/index', function(req, res){
        comment.setAppCookie(res);
        res.redirect(siteHost+'/bookeval/');
        res.render('bookeval');
    });


    // 详情页
    app.get(bookeval+'/detail', function(req, res){
        comment.setAppCookie(res);
        var fastreadid = req.query.id;
        if(fastreadid && fastreadid != undefined){
            res.redirect(siteHost+'/bookeval/#/bookdetail?id='+fastreadid);
        }else{
            res.redirect(siteHost+'/bookeval/');
        }
        res.render('bookeval');
    });


    // 列表
    app.post(bookeval+'/list', function(req, res){
        var page = req.body.page?req.body.page:1,
            count = req.body.count?req.body.count:10;
        bookEvalService.bookEvalList(page, count)
        .then(function(data){
            res.send(jsonResult.getSuccessResult({"rows":data}))
        })
        .catch(function(fail){
            res.send(jsonResult.getErrorResult(fail))
        });
    })


    // 详情
    app.post(bookeval+'/detail', function(req, res){
        var id = req.body.id,
            user_id = req.body.user_id;
        if(id && user_id){
            bookEvalService.bookEvalDetail(id, user_id)
            .then(function(data){
                if(data){
                    res.send(jsonResult.getSuccessResult(data))
                }else{
                    res.send(jsonResult.getErrorResult(jsonResult.CODE_NO_DATA))
                }
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    })


    // 报名（保存信息）
    app.post(bookeval+'/save_enroll', function(req, res){
        var eval_id = req.body.eval_id,
            user_id = req.body.user_id,
            user_name = req.body.user_name,
            content = req.body.content,
            user_mobile = req.body.user_mobile;
        if(eval_id && user_id && user_name && user_mobile && content){
            bookEvalService.saveEnroll(eval_id, user_id, user_name, user_mobile, content)
            .then(function(data){
                console.log(data)
                if(data){
                    res.send(jsonResult.getSuccessResult({id: data}))
                }else{
                    res.send(jsonResult.getErrorResult(jsonResult.CODE_NO_DATA))
                }
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    })


    // 用户报名信息
    app.post(bookeval+'/user_enroll', function(req, res){
        var user_id = req.body.user_id;
        if(user_id){
            bookEvalService.userEnroll(user_id)
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


    // 获取验证码
    app.post(bookeval+'/getcode', function(req, res){
        var mobile = req.body.mobile,
            params = {
                host: "http://readooapi.youshu.cc",
                url: '/Sms/sendMsg',
                method: 'post',
                data: {phone: mobile},
                type: "form"
            };
        if(mobile && mobile.length==11){
            PHP.exec(params,
            function(err, response, body){
                if(body.code==1){
                    res.send(jsonResult.getSuccessResult(null))
                }else{
                    res.send(jsonResult.getErrorResult(jsonResult.CODE_ACTIVE_ERROR))
                }
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    })


    // 核对验证码
    app.post(bookeval+'/checkcode', function(req, res){
        var mobile = req.body.mobile,
            code = req.body.code,
            params = {
                host: "http://readooapi.youshu.cc",
                url: '/MobileLogin/checkCode',
                method: 'post',
                data: {phone: mobile,code: code},
                type: "form"
            };
        if(mobile && mobile.length==11 && code && code.length==6){
            PHP.exec(params,
            function(err, response, body){
                console.log(body)
                if(body.code==1){
                    res.send(jsonResult.getSuccessResult(null))
                }else{
                    res.send(jsonResult.getErrorResult(jsonResult.CODE_CHECK_CODE_FAIL))
                }
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    })

    return app;

}