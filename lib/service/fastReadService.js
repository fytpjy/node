var moment = require('moment');
var promise=require("bluebird");
var bodyParser = require('body-parser');
// var promise = require('../../config/promise');
var jsonResult = require('../../lib/common/json_result');
var dbFastReadModel = require('../../lib/model/dbFastReadModel');

module.exports = {

    /*列表页*/
    getlist: function(tag, callback){
        return new promise(function(resolve, reject){
            dbFastReadModel.getFastList(tag, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    resolve(data)
                }
            })
        })
    },

    /*标签*/
    // tagList: function(type,callback){
    //     return new promise(function(resolve, reject){
    //         dbFastReadModel.tagList(type,function(err, data){
    //             if(err){
    //                 reject(jsonResult.CODE_ACTIVE_ERROR)
    //             }else{
    //                 resolve(data)
    //             }
    //         })
    //     })
    // },

    /*详情页--书籍详情*/
    getDetailByRequest: function(type, id){
        return new promise(function(resolve, reject){
            dbFastReadModel.getFastReadDetails(id, type, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    if(data){
                        var json = data;
                        json.create_time = moment(data.create_time).format('YYYY-MM-DD HH:mm:ss');
                        json.update_time = moment(data.update_time).format('YYYY-MM-DD HH:mm:ss');
                        resolve(data)
                    }else{
                        resolve(null)
                    }
                }
            })
        })
    },

    /*详情页--浏览量加1*/
    updataBookDetailsCA: function(result){
        return new promise(function(resolve, reject){
            dbFastReadModel.updataBookDetailsConutAdd(result.details.id, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    resolve(result)
                }
            })
        })
    },

    /*详情页--随机选择两个*/
    getFastRandTwo: function(result){
        return new promise(function(resolve, reject){
            dbFastReadModel.getFastRandT(result.id, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    var json = data;
                    for(var i in data){
                        json[i].create_time = moment(data[i].create_time).format('YYYY-MM-DD HH:mm:ss');
                        json[i].update_time = moment(data[i].update_time).format('YYYY-MM-DD HH:mm:ss');
                    }
                    resolve({
                        details: result,
                        rand: json
                    })
                }
            })
        })
    },

    /*详情页--获取评论总数量*/
    getFastBookCommentCount: function(result){
        return new promise(function(resolve, reject){
            dbFastReadModel.getFastBookCommentTotal(result.details.id, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    var json = result;
                    json.details.total = data;
                    resolve(json)
                }
            })
        })
    },

    /*评论列表*/
    commentList: function(fastreadid, page, count, userid){
        return new promise(function(resolve, reject){
            dbFastReadModel.getCommentList(fastreadid,page,count,userid, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    var resalt = new Array();
                    for(var i in data){
                        var dat = data[i];
                        dat.create_time = moment(data[i].create_time).format('YYYY-MM-DD HH:mm:ss');
                        if(data[i].avatar && data[i].avatar.indexOf("http")<0){
                            dat.avatar = "http://avatar.youshu.cc/" + data[i].avatar + "@120h_120w"
                        }
                        dat.dig = data[i].dig?1:0;
                        resalt.push(dat)
                    }
                    resolve(resalt)
                }
            });
        })
    },

    /*新增评论*/
    addComment: function(fastReadId, userId, content, reply_comment_id, reply_user_id, reply_user_name){
        return new promise(function(resolve, reject){
            dbFastReadModel.addComment(fastReadId, userId, content, reply_comment_id, reply_user_id, reply_user_name, function(err,data){
                if(err)
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                resolve(data.insertId)
            });
        });
    },

    /*删除评论*/
    delComment: function(comment_id, userid){
        return new promise(function(resolve, reject){
            dbFastReadModel.delComment(comment_id, userid, function(err, data){
                if(err)
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                resolve()
            });
        });
    },

    /*查询用户是否点赞*/
    point: function(fast_read_id, userid, comment_id, digg_type){
        return new promise(function(resolve, reject){
            if(digg_type == 1){
                dbFastReadModel.commentIsDigg(fast_read_id, userid, comment_id, digg_type, function(err1, data1){
                    if(err1){
                        reject(jsonResult.CODE_ACTIVE_ERROR)
                    }else{
                        if(data1.length<=0){
                            dbFastReadModel.commentAddDigg(fast_read_id, userid, comment_id, digg_type, function(err2, data2){
                                if(err2)
                                    reject(jsonResult.CODE_ACTIVE_ERROR)
                                resolve(data2.insertId)
                            });
                        }else{
                            reject(jsonResult.CODE_HAVE_DIG)
                        }
                    }
                });
            }else{
                dbFastReadModel.commentDelDigg(fast_read_id, userid, comment_id, digg_type, function(err,data){
                    if(err)
                        reject(jsonResult.CODE_ACTIVE_ERROR)
                    resolve()
                });
            }
        });
    }

}