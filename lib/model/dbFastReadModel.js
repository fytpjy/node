var mysql = require('mysql');
var DB = require('../../config/db');

// 有书快看
module.exports = {

    /*
        列表页数据
        fastreadid: 对应快看ID
        page：分页
        count：每页显示数量
    */
    getFastList: function(tag, callback){
        var sql = ''
        if (tag) {
            sql = 'SELECT a.*,count(b.id) as comment_count FROM rw_fast_read a LEFT JOIN rw_fast_read_comment b ON a.id = b.fast_read_id WHERE a.status = 100 and a.id in (?) GROUP BY a.id'
            DB.exec(sql,[tag],function(err,result){ 
                callback(err,result)
            }); 
        } else {
            sql = 'SELECT a.*,count(b.id) as comment_count FROM rw_fast_read a LEFT JOIN rw_fast_read_comment b ON a.id = b.fast_read_id WHERE a.status = 100 GROUP BY a.id'
            DB.exec(sql,null,function(err,result){ 
                callback(err,result)
            }); 
        }
        
         
    },

    /*
        标签数据
    */
    // tagList: function(type,callback){
    //     var sql = 'SELECT id,tag,name FROM rw_tag_list where type = ? '
    //     DB.exec(sql,[type],function(err,result){  
    //         callback(err,result)
    //     });  
    // },


    /*
        详情页数据
        fastreadid: 对应快看ID
        type：查询字段book fastreadid
    */
    getFastReadDetails: function(fastreadid, type, callback){
        if(type=="fastread"){
            var sql = 'SELECT * FROM rw_fast_read where id= ? and status = 100';
        }else{
            var sql = 'SELECT * FROM rw_fast_read where book_id= ? and status = 100';
        }
        DB.exec(sql,[fastreadid],function(err,result){  
            if(result.length>0){
                callback(err,result[0])
            }else{
                callback(err,null)
            }
        });
    },

    /*
        详情页评论总数
        fastreadid: 对应快看ID
    */
    getFastBookCommentTotal: function(fastreadid, callback){
        var sql = 'SELECT count(1) FROM rw_fast_read_comment WHERE fast_read_id = ? AND status = 100'
        DB.exec(sql,[fastreadid],function(err,result){  
            callback(err,result[0]['count(1)'])
        });
    },


    /*
        详情页浏览数量增加
        fastreadid: 对应快看ID
    */
    updataBookDetailsConutAdd: function(fastreadid, callback){
        var sql = 'UPDATE rw_fast_read SET count = count+1 WHERE id = ?'
        DB.exec(sql,[fastreadid],function(err,result){
            callback(err,result)
        });
    },



    /*
        详情页随机两本书籍
        fastreadid: 对应快看ID
    */
    getFastRandT: function(fastreadid,callback){
        var sql = 'SELECT * FROM rw_fast_read where id <> ? and status = 100 ORDER BY RAND() LIMIT 2'
        DB.exec(sql,[fastreadid],function(err,result){  
            callback(err,result)
        });
    },


    /*
        新增评论
        fastreadid: 对应快看ID
        userid：用户ID
        content：评论内容
        replycommentid：回复评论ID
        replyuserid：回复评论ID
        replyusername： 回复评论人名称
    */
    addComment: function(fastreadid, userid, content, replycommentid, replyuserid, replyusername, callback){
        var sql = 'INSERT INTO rw_fast_read_comment (fast_read_id, user_id, content, reply_comment_id, reply_user_id, reply_user_name ) values (?,?,?,?,?,?)';
        DB.exec(sql,[fastreadid, userid, content, replycommentid, replyuserid, replyusername], function(err,result){  
            callback(err,result)
        }); 
    },

    /*
        删除评论
        commentid: 评论ID
        userid：操作用户ID
    */
    delComment: function(commentid, userid, callback){
        var sql = 'DELETE FROM rw_fast_read_comment WHERE id = ? AND user_id= ?'
        DB.exec(sql,[commentid,userid], function(err,result){  
            callback(err,result)
        }); 
    },


    /*
        评论列表
        fastreadid：对应快看ID
        userid：用户ID
        page： 页数
        count：每页条数
    */
    getCommentList: function(fastreadid, page, count,userid, callback){
        var sql = 'SELECT a.*, user.name as user_name, user.avatar as avatar, b.id as dig from rw_fast_read_comment a ' + 
                    ' LEFT JOIN rw_fast_read_digg b ON a.id=b.comment_id and b.user_id = ?' +
                    ' LEFT JOIN rw_user_info user ON a.user_id = user.user_id ' +
                    ' WHERE a.fast_read_id= ? AND status = 100 ' +
                    ' ORDER BY a.id DESC limit '+count*(page-1)+','+count
        DB.exec(sql, [userid, fastreadid], function(err,result){  
            callback(err,result)
        }); 
    },

    /*
        查询当前用户是否已点赞
        fastreadid: 对应快看ID
        userid：用户ID
        commentid：评论ID
        diggtype：点赞类型
    */
    commentIsDigg: function(fastreadid, userid, commentid, diggtype, callback){
        var sql = 'SELECT * FROM rw_fast_read_digg where comment_id = ? && user_id = ?'
        DB.exec(sql,[commentid,userid],function(err,result){
            callback(err,result)
        }); 
    },

    /*
        取消赞
        fastreadid: 对应快看ID
        userid：用户ID
        commentid：评论ID
        diggtype：点赞类型
    */
    commentDelDigg: function(fastreadid, userid, commentid, diggtype, callback){
        var sql = 'DELETE FROM rw_fast_read_digg WHERE comment_id = ?'
        DB.exec(sql,[commentid], function(err,result){  
            callback(err,result)
        });
    },


    /*
        点赞
        fastreadid: 对应快看ID
        userid：用户ID
        commentid：评论ID
        diggtype：点赞类型
    */
    commentAddDigg: function(fastreadid, userid, commentid, diggtype, callback){
        var sql = 'INSERT INTO rw_fast_read_digg (fast_read_id, user_id, comment_id ) values (?,?,?)';
        DB.exec(sql,[fastreadid, userid, commentid], function(err,result){
            callback(err,result)
        })
    },

}