var path = require('path'),
    PHP = require('../../config/php'),
    config = require('../../config/config'),
    promise=require("bluebird"),
    comment = require('../../lib/common/index'),
    routes = require('../../routes/index'),
    jsonResult = require('../../lib/common/json_result'),
    fastReadService = require('../../lib/service/fastReadService'),
    webhost = process.env.NODE_WEBHOST,
    env = process.env.NODE_ENV,
    fastread = "/fastread",
    siteHost = "http://m.youshu.cc/";
    // siteHost = (config[env]['webhost'][webhost] && config[env]['webhost'][webhost] != undefined)?config[env]['webhost'][webhost]:"ys";

module.exports = function(app) {

    /* 有书快看 */
    app.all('*', function(req, res, next) {

        comment.setCrossDomain(res)

        if (req.method == 'OPTIONS') {
            res.send(200);
        }else {
            next();
        }
    });

    // 列表首页
    app.get(fastread+'/index', function(req, res){
        comment.setAppCookie(res);
        res.redirect(siteHost+'/fast_know/');
        res.render('fastread');
    });

    // 详情页
    app.get(fastread+'/detail', function(req, res){
        comment.setAppCookie(res);
        var fastreadid = req.query.id;
        if(fastreadid && fastreadid != undefined){
            res.redirect(siteHost+'/fast_know/#/kuaikanDetail?id='+fastreadid);
        }else{
            res.redirect(siteHost+'/fast_know/');
        }
        res.render('fastread');
    });

    // 有书快看获取用户信息
    app.post(fastread+'/userinfo', function(req, res){
        var user_id = req.body.user_id,
            user_token = req.body.user_token;
        if(user_token && user_id && user_id>0){
            PHP.exec({
                host: "http://gongdu.youshu.cc/",
                url: 'VKclass/Classroom/myInfo',
                method: 'post',
                data: {user_id:user_id,token:user_token},
                type: "form"
            },
            function(err, response, body){
                var userinfo = {user_info:body.user_data};
                res.send(jsonResult.getSuccessResult(userinfo))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    })

    // 有书快看标签
    app.post(fastread+'/tag', function(req, res){
        var type = req.body.type;
        if (type) {
            PHP.exec({
                host: "http://gongdu.youshu.cc",
                url: '/TagByFastRead/getFastList',
                method: 'post',
                data: {type:type},
                type: "form"
            },
            function(err, response, body){
                res.send(jsonResult.getSuccessResult(body.data))
            });
        } else {
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
        
        
    })

    /*
        有书快看列表页接口
    */
    app.post(fastread+'/getlist', function(req, res){
        var page = req.body.page?req.body.page:1,
            count = req.body.count?req.body.count:10,
            tag = req.body.tag?req.body.tag:null;

        PHP.exec({
            host: "http://gongdu.youshu.cc",
            url: '/TagByFastRead/getContentIdByTag',
            method: 'post',
            data: {page:page, limit: count, tag: tag},
            type: "form"
        },
        function(err, response, body){
            var ids = [];
            body.data.forEach( function(ele, index) {
                ids.push(ele.content_id)
            });

            if (ids.length == 0) {     //此标签下没有数据
                res.send(jsonResult.getSuccessResult({"rows":[]}))
            } else {
                fastReadService.getlist(ids)
                .then(function(data){
                    res.send(jsonResult.getSuccessResult({"rows":data}))
                })
                .catch(function(fail){
                    console.log(fail)
                    res.send(jsonResult.getErrorResult(fail))
                });
            }

        });
    })

    // 有书快看详情接口
    app.post(fastread+'/detail', function(req, res){
        var fast_read_id = req.body.fast_read_id,
            book_id = req.body.book_id,
            type = (fast_read_id && fast_read_id != 0)?"fastread":"book";
        if((fast_read_id || book_id) && (fast_read_id>0 || book_id>0)){
            fastReadService.getDetailByRequest(type, type == "fastread" ? fast_read_id : book_id)
            .then(fastReadService.getFastRandTwo)
            .then(fastReadService.getFastBookCommentCount)
            .then(fastReadService.updataBookDetailsCA)
            .then(function(data){
                res.send(jsonResult.getSuccessResult(data))
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(jsonResult.CODE_NO_DATA))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });

    // 有书快看评论列表接口
    app.post(fastread+'/comment_list', function(req, res){
        var page = req.body.page?req.body.page:1,
            count = req.body.count?req.body.count:10,
            fastreadid = req.body.fast_read_id,
            userid = req.body.user_id;
        if(fastreadid && userid){
            fastReadService.commentList(fastreadid,page,count,userid)
            .then(function(data){
                res.send(jsonResult.getSuccessResult({"rows":data}))
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });

    // 有书快看新增评论接口
    app.post(fastread+'/addcomment', function(req, res){
        var fast_read_id = req.body.fast_read_id,
            content = req.body.content,
            reply_comment_id = req.body.reply_comment_id,
            reply_user_id = req.body.reply_user_id,
            reply_user_name = req.body.reply_user_name,
            user_id = req.body.user_id,
            userName = req.body.user_name;
        if(fast_read_id && content && user_id && userName){
            fastReadService.addComment(fast_read_id, user_id, content, reply_comment_id, reply_user_id, reply_user_name)
            .then(function(data){
                res.send(jsonResult.getSuccessResult({"comment_id":data}))
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });

    // 有书快看删除评论接口
    app.post(fastread+'/delcomment', function(req, res){
        var comment_id = req.body.comment_id,
            userid = req.body.user_id;
        if(userid && comment_id){
            fastReadService.delComment(comment_id, userid)
            .then(function(data){
                res.send(jsonResult.getSuccessResult())
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });

    // 有书快看点赞接口
    app.post(fastread+'/digg', function(req, res){
        var fast_read_id = req.body.fast_read_id,
            comment_id = req.body.comment_id,
            digg_type = req.body.digg_type,
            userid = req.body.user_id;
        if(fast_read_id && comment_id && digg_type && userid){
            fastReadService.point(fast_read_id, userid, comment_id, digg_type)
            .then(function(data){
                res.send({"digg_id":data})
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }
    })

    return app;
}