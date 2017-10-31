var mysql = require('mysql'),
    promise=require("bluebird"),
    join = promise.join,
    DB = require('../../config/db');

// 课程活动
module.exports = {

    /*
        列表
        page：分页
        count：每页显示数量
    */
    bookEvalList: function(page, count, callback){
        var sql = 'SELECT a.*,count(b.id) as joinnum FROM rw_book_eval a LEFT JOIN rw_book_eval_user b ON a.id = b.eval_id WHERE a.status>0 GROUP BY a.id DESC limit '+count*(page-1)+','+count
        DB.exec(sql,[null],function(err,result){  
            callback(err,result)
        });  
    },


    /*
        详情
        id：众测ID
        注：查询随笔对应内容，参与总人数（老众测的兼容）
    */
    bookEvalDetail: function(id, callback){
        return new promise(function(resolve, reject){
            var sql = 'SELECT * FROM rw_book_eval where status>=0 AND id=?'
            DB.exec(sql,[id],function(err,result){  
            if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })  
    },


    /*
        判断用户是否报名
        eval_id：众测ID 
        user_id：用户ID
    */
    isReportEnroll: function(eval_id, user_id, callback){
        return new promise(function(resolve, reject){
            var sql = 'SELECT count(1) FROM rw_book_eval_user WHERE eval_id = ? AND user_id=?'
            DB.exec(sql,[eval_id, user_id],function(err,result){  
            if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        }) 
    },


    /*
        查询活动是否存在
        eval_id：众测ID 
    */
    isHaveEnroll: function(eval_id){
        return new promise(function(resolve, reject){
            var sql = 'SELECT count(1) FROM rw_book_eval WHERE id = ?'
            DB.exec(sql,[eval_id],function(err,result){  
            if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        }) 
    },


    /*
        查询活动报名人数
        eval_id：众测ID 
    */
    reportEnrollNum: function(eval_id){
        return new promise(function(resolve, reject){
            var sql = 'SELECT count(1) FROM rw_book_eval_user WHERE eval_id = ?'
            DB.exec(sql,[eval_id],function(err,result){  
            if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        }) 
    },


    /*
        查询随笔内容
        note_id: 随笔ID组
    */
    searchNote: function(note_id){
        return new promise(function(resolve, reject){
            var sql = 'SELECT a.id,a.title,a.img_str,a.user_id,`user`.`name` as user_name FROM rw_note a '+
                ' LEFT JOIN rw_user_info user ON a.user_id = `user`.user_id'+
                ' WHERE a.id in ('+note_id+')'
            DB.exec(sql,[null],function(err,result){  
            if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        }) 
    },

    /*
        查询中奖用户信息
        user_id: 用户ID组 
    */
    searchUserMsg: function(user_id, eval_id){
        return new promise(function(resolve, reject){
            var sql = 'SELECT id,user_id,user_name,user_mobile FROM rw_book_eval_user WHERE user_id in ('+user_id+') AND eval_id='+eval_id
            DB.exec(sql,[null],function(err,result){  
            if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        }) 
    },


    /*
        报名详情
        eval_id：众测ID 
        user_id：用户ID
        user_name：用户姓名
        user_mobile：用户手机号码
    */
    saveEnroll: function(eval_id, user_id, user_name, user_mobile, content, callback){
        return new promise(function(resolve, reject){
            var sql = 'INSERT INTO rw_book_eval_user (user_id, user_name, user_mobile, eval_id, content) values (?,?,?,?,?)';
            DB.exec(sql,[user_id, user_name, user_mobile, eval_id, content],function(err,result){  
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        }) 
    },

    
    /*
        查询用户报名信息
        eval_id：众测ID 
        user_id：用户ID
    */
    userEnroll: function(user_id, callback){
        var sql = 'SELECT * FROM rw_book_eval_user where user_id=? GROUP BY id DESC'
        DB.exec(sql,[user_id],function(err,result){  
            callback(err,result)
        })
    },

}