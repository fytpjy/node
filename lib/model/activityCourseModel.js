var mysql = require('mysql'),
    DB = require('../../config/db');

// 课程活动
module.exports = {

    /*
        课程列表
        type: 类型 1：H5类型，2：course类型
        page：分页
        count：每页显示数量
    */
    courseList: function(type, page, count, callback){
        var sql = 'SELECT * FROM rw_activity_course where status>=0 AND type = ? limit '+count*(page-1)+','+count
        DB.exec(sql,[type],function(err,result){  
            callback(err,result)
        });  
    },


    /*
        创建课程
        title: 课程名称
        cover: 课程封面
        type：类型 1：H5类型，2：course类型
    */
    courseCreate: function(title, cover, type, callback){
        var sql = 'INSERT INTO rw_activity_course (title, cover, type) values (?,?,?)';
        DB.exec(sql,[title, cover, type],function(err,result){  
            callback(err,result)
        });
    },


    /*
        编辑课程
        course_id: 课程ID
        title: 课程标题
        cover: 课程封面
        description: 课程简介
        author_intro: 讲师介绍
        course_intro: 课程详情
        link_type: 链接类型1：链接，2：图片
        link_text: 链接文本
        link_url: 链接url
        link_img: 链接点击显示图片
        status: 课程状态0初始,100上线，-1删除
    */
    courseEdit: function(course_id, title, cover, description, author_intro, course_intro, link_type, link_text, link_url, link_img, status, sharecontent, callback){
        if(description || author_intro || course_intro || link_url){
            var sql = 'UPDATE rw_activity_course '+
            ' SET status=100, title=?,cover=?,description=?, author_intro=?, course_intro=?, link_type=?, link_text=?, link_url=?, link_img=?, sharecontent=?'+
            ' WHERE id = ?'
            DB.exec(sql,[title, cover, description, author_intro, course_intro, link_type, link_text, link_url, link_img, sharecontent, course_id],function(err,result){  
                callback(err,result)
            });
        }else{
            var sql = 'UPDATE rw_activity_course '+
            ' SET status=100, title=?,cover=?'+
            ' WHERE id = ?'
            DB.exec(sql,[title, cover, course_id],function(err,result){  
                callback(err,result)
            });
        }
    },


    /*
        查询课程
        id: 课程ID
    */
    courseSearch: function(id, callback){
        var sql = 'SELECT * FROM rw_activity_course where status>=0 AND id = ?'
        DB.exec(sql,[id],function(err,result){  
            callback(err,result)
        });
    },


    /*
        拆书包列表
        page: 分页默认1
        count: 分页显示个数 默认10
    */
    packList: function(page, count, course_id, callback){
        var sql = 'SELECT * FROM rw_activity_course_pack where status>=0 AND course_id = ? limit '+count*(page-1)+','+count
        DB.exec(sql,[course_id],function(err,result){
            callback(err,result)
        });
    },


    /*
        判断拆书包是否存在
        pack_id：拆书包ID
    */
    isPack: function(pack_id, callback){
        var sql = 'SELECT count(1) FROM rw_book_pack where id = ?';
        DB.exec(sql,[pack_id],function(err,result){
            callback(err,result)
        });
        
    },

    /*
        查询拆书包内容
        id：拆书包ID
    */
    searchPackCont: function(id, callback){
        var sql = 'SELECT id,content FROM rw_pack_content where id = ?';
        DB.exec(sql,[id],function(err,result){
            callback(err,result)
        });
        
    },


    /*
        创建拆书包
        title: 拆书包名称
        cover: 拆书包封面
        course_id：课程ID
        pack_id：拆书包ID
    */
    packCreate: function(title, cover, pack_id, course_id, callback){
        var packSql = " select '" + title + "' as title, '" + cover + "' as cover, " + course_id + " as course_id, pack.id as source_pack_id, pack.pack_content_id as source_content_id, content.oss_video as video, content.media, content.media_time from rw_book_pack pack left join rw_pack_content content on pack.pack_content_id = content.id where pack.id = " + pack_id ;
        var sql = 'INSERT INTO rw_activity_course_pack (title, cover, course_id, source_pack_id, source_content_id, video, media, media_time) ' 
        + "(" + packSql + ")";
        DB.exec(sql,[null],function(err,result){  
            callback(err,result)
        });
    },


    /*
        查询拆书包
        pack_id: 课程ID
    */
    packSearch: function(pack_id, callback){
        var sql = 'SELECT * FROM rw_activity_course_pack where status>=0 AND id = ?'
        DB.exec(sql,[pack_id],function(err,result){  
            callback(err,result)
        });
    },

    /*
        修改拆书包状态
        拆书包ID: 课程ID
        status: 拆书包状态0初始,100上线，-1删除
    */
    packStatus: function(id, status, callback){
        var sql = 'UPDATE rw_activity_course_pack SET status=? WHERE id = ?'
        DB.exec(sql,[status, id],function(err,result){  
            callback(err,result)
        });
    },


    /*
        修改课程状态
        拆书包ID: 课程ID
        status: 拆书包状态0初始,100上线，-1删除
    */
    packCourseStatus: function(id, status, callback){
        var sql = 'UPDATE rw_activity_course SET status=? WHERE id = ?'
        DB.exec(sql,[status, id],function(err,result){  
            callback(err,result)
        });
    },


    /*
        编辑拆书包
        pack_id: 拆书包ID
        title: 拆书包标题
        cover: 拆书包封面
        video: 拆书包视频
        media: 拆书包音频
        media_name: 拆书包音频名称
        group_img: 拆书包群裂变图
        group_url: 拆书包群裂变图跳转URL
        sort: 排序
        status: 拆书包状态0初始,100上线，-1删除
        banner_list:  课程广告图片（json）
    */
    packEdit: function(id, title, cover, video, media, media_name, group_img, group_url, sort, status, banner_list, sharecontent, callback){
        
        if(video || media || media_name || group_img || group_url || banner_list){
            var sql = 'UPDATE rw_activity_course_pack '+
            ' SET status=100, title=?,cover=?, group_img=?, group_url=?, banner_list=?, sharecontent=?'+
            ' WHERE id = ?'
            DB.exec(sql,[title, cover, group_img, group_url, banner_list, sharecontent, id],function(err,result){  
                callback(err,result)
            });
        }else{
            var sql = 'UPDATE rw_activity_course_pack '+
            ' SET status=100, title=?,cover=?'+
            ' WHERE id = ?'
            DB.exec(sql,[title, cover, id],function(err,result){  
                callback(err,result)
            });
        }
    }
}