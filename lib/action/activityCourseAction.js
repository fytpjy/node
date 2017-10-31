var path = require('path'),
    PHP = require('../../config/php'),
    config = require('../../config/config'),
    promise=require("bluebird"),
    routes = require('../../routes/index'),
    jsonResult = require('../../lib/common/json_result'),
    activityCourseService = require('../../lib/service/activityCourseService'),
    webhost = process.env.NODE_WEBHOST,
    env = process.env.NODE_ENV,
    activity = "/activity/course";

module.exports = function(app) {

    /* 课程活动 */
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


    // 课程列表
    app.post(activity+'/list', function(req, res){
        var page = req.body.page?req.body.page:1,
            count = req.body.count?req.body.count:10,
            type = req.body.type;
        if(type){
            activityCourseService.courseList(type, page, count)
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


    // 创建课程
    app.post(activity+'/create', function(req, res){
        var title = req.body.title,
            cover = req.body.cover,
            type = req.body.type;
        if(title && cover && type){
            activityCourseService.courseCreate(title, cover, type)
            .then(function(data){
                res.send(jsonResult.getSuccessResult({id: data}))
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });


    // 编辑课程
    app.post(activity+'/edit', function(req, res){
        var course_id = req.body.course_id,
            title = req.body.title,
            cover = req.body.cover,
            description = req.body.description,
            author_intro = req.body.author_intro,
            course_intro = req.body.course_intro,
            link_type = req.body.link_type,
            link_text = req.body.link_text,
            link_url = req.body.link_url,
            sharecontent = req.body.sharecontent,
            link_img = req.body.link_img,
            status = req.body.status;
        if(course_id && title && cover){
            activityCourseService.courseEdit(course_id, title, cover, description, author_intro, course_intro, link_type, link_text, link_url, link_img, status, sharecontent)
            .then(function(data){
                res.send(jsonResult.getSuccessResult(data))
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });


    // 查询课程
    app.post(activity+'/detail', function(req, res){
        var id = req.body.id;
        if(id){
            activityCourseService.courseSearch(id)
            .then(function(data){
                if(data){
                    res.send(jsonResult.getSuccessResult(data))
                }else{
                    res.send(jsonResult.getErrorResult(jsonResult.CODE_NO_PACK_ID))
                }
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });


    // 拆书包列表
    app.post(activity+'/packlist', function(req, res){
        var page = req.body.page?req.body.page:1,
            count = req.body.count?req.body.count:10,
            course_id = req.body.course_id;
        if(course_id){
            activityCourseService.packList(page, count, course_id)
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


    // 创建拆书包
    app.post(activity+'/packcreate', function(req, res){
        var title = req.body.title,
            cover = req.body.cover,
            course_id = req.body.course_id,
            pack_id = req.body.pack_id;
        if(title && cover && pack_id && course_id){
            activityCourseService.packCreate(title, cover, pack_id, course_id)
            .then(function(data){
                res.send(jsonResult.getSuccessResult({id: data}))
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });


    // 查询拆书包
    app.post(activity+'/packdetail', function(req, res){
        var id = req.body.id;
        if(id){
            activityCourseService.packSearch(id)
            .then(function(data){
                res.send(jsonResult.getSuccessResult(data))
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });

    // 修改拆书包状态
    app.post(activity+'/packstatus', function(req, res){
        var id = req.body.id,
            type = req.body.type,
            status = req.body.status;
        if(type && id && (status ==0 || status ==-1 || status ==100)){
            activityCourseService.packStatus(id, status, type)
            .then(function(data){
                if(comment.updata(data)!=1){
                    res.send(jsonResult.getErrorResult(comment.updata(data)))
                }else{
                    res.send(jsonResult.getSuccessResult(null))
                }
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });


    // 编辑拆书包
    app.post(activity+'/packedit', function(req, res){
        var pack_id = req.body.pack_id,
            title = req.body.title,
            id = req.body.id,
            cover = req.body.cover,
            video = req.body.video,
            media = req.body.media,
            media_name = req.body.media_name,
            group_img = req.body.group_img,
            group_url = req.body.group_url,
            sort = req.body.sort,
            status = req.body.status,
            sharecontent = req.body.sharecontent,
            banner_list = req.body.banner_list;
        if(id && title && cover){
            activityCourseService.packEdit(id, title, cover, video, media, media_name, group_img, group_url, sort, status, banner_list, sharecontent)
            .then(function(data){
                res.send(jsonResult.getSuccessResult(null))
            })
            .catch(function(fail){
                res.send(jsonResult.getErrorResult(fail))
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });

    // 获取微信配置信息
    app.post(activity+'/wxconfig', function(req, res){
        var type = req.body.type,
            referer = req.body.referer;
        if(type && referer){
            PHP.exec({
                host: "http://readooapi.youshu.cc/",
                url: '/WeChatRelevant/Common/WechatConfig',
                method: 'post',
                data: {type: type, referer: referer}
            },
            function(err, response, body){
                if(body){
                    res.send(jsonResult.getSuccessResult(body.data))
                }else{
                    res.send(jsonResult.getErrorResult(jsonResult.CODE_ACTIVE_ERROR))
                }
            });
        }else{
            res.send(jsonResult.getErrorResult(jsonResult.CODE_INVALID_PARAM))
        }
    });

    return app;

}