var moment = require('moment');
    promise=require("bluebird"),
    bodyParser = require('body-parser'),
    jsonResult = require('../../lib/common/json_result'),
//  comment = require('../../lib/common/index'),
    join = promise.join,
    bookEvalModel = require('../../lib/model/bookEvalModel');

/* 有书众测 */
module.exports = {


    /* 列表 */
    bookEvalList: function(page, count){
        return new promise(function(resolve, reject){
            bookEvalModel.bookEvalList(page, count, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    if(data.length>0){
                        var json = data;
                        for(var i in data){
                            json[i].create_time = moment(data[i].create_time).format('YYYY-MM-DD HH:mm:ss');
                            json[i].update_time = moment(data[i].update_time).format('YYYY-MM-DD HH:mm:ss');
                            json[i].joinnum = json[i].joinnum+1209;
                        }
                        resolve(json)
                    }else{
                        resolve(null)
                    }
                }
            })
        })
    },


    /* 详情 */
    bookEvalDetail: function(id, user_id){
        return new promise(function(resolve, reject){
            join(bookEvalModel.bookEvalDetail(id), bookEvalModel.isReportEnroll(id, user_id), bookEvalModel.reportEnrollNum(id),
            function(bookEvalDetail, isReportEnroll, reportEnrollNum) {
                var data = null;
                if(bookEvalDetail.length>0){
                    data = bookEvalDetail[0]
                    data.jionnum = reportEnrollNum[0]['count(1)']+1209
                    data.isreprot = isReportEnroll[0]['count(1)']>0
                    data.create_time = moment(bookEvalDetail[0].create_time).format('YYYY-MM-DD HH:mm:ss');
                    data.update_time = moment(bookEvalDetail[0].update_time).format('YYYY-MM-DD HH:mm:ss');
                    data.start_time = moment(bookEvalDetail[0].start_time).format('YYYY-MM-DD HH:mm:ss');
                    data.end_time = moment(bookEvalDetail[0].end_time).format('YYYY-MM-DD HH:mm:ss');
                }
                return data
            })
            .then(function(data) {
                if (data.notes == "") {
                    data.notes = null;
                }
                var noteid = JSON.parse(data.notes),
                    notedata = "";
                for(var i in noteid){
                    notedata += noteid[i].id+","
                }
                var notedatat = notedata?notedata.substring(0,notedata.length-1):"0";
                var prizelist = data.prizelist?JSON.parse(data.prizelist).join():"0";
                join(bookEvalModel.searchNote(notedatat), bookEvalModel.searchUserMsg(prizelist, id),
                function(searchNote, searchUserMsg) {
                    for(var i = 0; i < searchNote.length; i++){
                        for(var j = 0; j < noteid.length; j++){
                            if(searchNote[i].id == noteid[j].id){
                                searchNote[i].count = noteid[j].count
                            }
                        }
                    }
                    for(var i = 0; i < searchNote.length; i++){
                        if(searchNote[i].img_str && searchNote[i].img_str != undefined){
                            searchNote[i].img_str = "http://img.youshu.cc/" + searchNote[i].img_str.split(',')[0]
                        }
                    }
                    data.notes = searchNote
                    var usermsg =new Array();
                    for(var i in searchUserMsg){
                        var Userdetail = searchUserMsg[i];
                        Userdetail.user_mobile = searchUserMsg[i].user_mobile.substring(0,3)+"****"+searchUserMsg[i].user_mobile.substring(7)
                        usermsg.push(Userdetail)
                    }
                    data.users = usermsg
                    return data
                })
                .then(function(data) {
                    resolve(data)
                })
                .catch(function(fail){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                })
                
            })
            .catch(function(fail){
                reject(jsonResult.CODE_ACTIVE_ERROR)
            })
        })
    },


    /* 报名（保存信息） */
    saveEnroll: function(eval_id, user_id, user_name, user_mobile, content){
        return new promise(function(resolve, reject){
            bookEvalModel.isHaveEnroll(eval_id)
            .then(function(data){
                if(data[0]['count(1)']>0){
                    bookEvalModel.isReportEnroll(eval_id, user_id)
                    .then(function(data1) {
                        if(data1[0]['count(1)']==0){
                            bookEvalModel.saveEnroll(eval_id, user_id, user_name, user_mobile, content)
                            .then(function(data2){
                                resolve(data2.insertId)
                            })
                            .catch(function(fail){
                                reject(jsonResult.CODE_ACTIVE_ERROR)
                            })
                        }else{
                            reject(jsonResult.CODE_HAVE_JOIN_EVAL)
                        }
                    })
                    .catch(function(fail){
                        reject(jsonResult.CODE_ACTIVE_ERROR)
                    })
                }else{
                    reject(jsonResult.CODE_NO_PACK_ID)
                }
            })
            .catch(function(fail){
                reject(jsonResult.CODE_ACTIVE_ERROR)
            })
        })
    },
    

    /* 查询用户报名信息 */
    userEnroll: function(user_id){
        return new promise(function(resolve, reject){
            bookEvalModel.userEnroll(user_id, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    if(data.length>0){
                        resolve(data[0])
                    }else{
                        resolve(null)
                    }
                }
            })
        })
    },


}