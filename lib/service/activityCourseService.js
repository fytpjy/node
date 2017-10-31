var moment = require('moment');
    promise=require("bluebird"),
    bodyParser = require('body-parser'),
    jsonResult = require('../../lib/common/json_result'),
//  comment = require('../../lib/common/index'),
    activityCourseModel = require('../../lib/model/activityCourseModel');

/*课程活动*/
module.exports = {



    /*课程列表*/
    courseList: function(type, page, count){
        return new promise(function(resolve, reject){
            activityCourseModel.courseList(type, page, count, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    var json = data;
                    for(var i in data){
                        json[i].create_time = moment(data[i].create_time).format('YYYY-MM-DD HH:mm:ss');
                        json[i].update_time = moment(data[i].update_time).format('YYYY-MM-DD HH:mm:ss');
                    }
                    resolve(json)
                }
            })
        })
    },


    /*创建课程*/
    courseCreate: function(title, cover, type){
        return new promise(function(resolve, reject){
            activityCourseModel.courseCreate(title, cover, type, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    resolve(data.insertId)
                }
            })
        })
    },


    /*编辑课程*/
    courseEdit: function(course_id, title, cover, description, author_intro, course_intro, link_type, link_text, link_url, link_img, status, sharecontent){
        return new promise(function(resolve, reject){
            activityCourseModel.courseEdit(course_id, title, cover, description, author_intro, course_intro, link_type, link_text, link_url, link_img, status, sharecontent, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    resolve(null)
                }
            })
        })
    },


    /*查询课程*/
    courseSearch: function(course_id){
        return new promise(function(resolve, reject){
            activityCourseModel.courseSearch(course_id, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    var json = data;
                    if(json.length>0){
                        for(var i in data){
                            json[i].create_time = moment(data[i].create_time).format('YYYY-MM-DD HH:mm:ss');
                            json[i].update_time = moment(data[i].update_time).format('YYYY-MM-DD HH:mm:ss');
                        }
                        resolve(json[0])
                    }else{
                        resolve(null)
                    }
                }
            })
        })
    },


    /*拆书包列表*/
    packList: function(page, count, course_id){
        return new promise(function(resolve, reject){
            activityCourseModel.packList(page, count, course_id, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    var json = data;
                    for(var i in data){
                        json[i].create_time = moment(data[i].create_time).format('YYYY-MM-DD HH:mm:ss');
                        json[i].update_time = moment(data[i].update_time).format('YYYY-MM-DD HH:mm:ss');
                    }
                    resolve(json)
                }
            })
        })
    },


    /*创建拆书包*/
    packCreate: function(title, cover, pack_id, course_id){
        return new promise(function(resolve, reject){
            activityCourseModel.isPack(pack_id, function(err1, data1){
                if(err1){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    if(data1[0]['count(1)']>0){
                        activityCourseModel.packCreate(title, cover, pack_id, course_id, function(err2, data2){
                            if(err2){
                                reject(jsonResult.CODE_ACTIVE_ERROR)
                            }else{
                                resolve(data2.insertId)
                            }
                        })
                    }else{
                        reject(jsonResult.CODE_NO_PACK_ID)
                    }
                }
            })
        })
    },


    /*查询拆书包*/
    packSearch: function(pack_id){
        return new promise(function(resolve, reject){
            activityCourseModel.packSearch(pack_id, function(err1, data1){
                if(err1){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    if(data1.length>0 && data1[0] && data1[0].source_content_id){
                        activityCourseModel.searchPackCont(data1[0].source_content_id, function(err2, data2){
                            if(err2){
                                reject(jsonResult.CODE_ACTIVE_ERROR)
                            }else{
                                var json = data1;
                                json[0].content = data2[0].content
                                for(var i in data1){
                                    json[i].create_time = moment(data1[i].create_time).format('YYYY-MM-DD HH:mm:ss');
                                    json[i].update_time = moment(data1[i].update_time).format('YYYY-MM-DD HH:mm:ss');
                                }
                                resolve(json[0])
                            }
                        })
                    }else{
                        reject(jsonResult.CODE_NO_PACK_ID)
                    }
                }
            })
        })
    },

    /*修改拆书包状态*/
    packStatus: function(id, status, type){
        return new promise(function(resolve, reject){
            if(type==1){
                activityCourseModel.packCourseStatus(id, status, function(err, data){
                    if(err){
                        reject(jsonResult.CODE_ACTIVE_ERROR)
                    }else{
                        resolve(data)
                    }
                })
            }else{
                activityCourseModel.packStatus(id, status, function(err, data){
                    if(err){
                        reject(jsonResult.CODE_ACTIVE_ERROR)
                    }else{
                        resolve(data)
                    }
                })
            }
        })
    },


    /*编辑拆书包*/
    packEdit: function(id, title, cover, video, media, media_name, group_img, group_url, sort, status, banner_list, sharecontent){
        return new promise(function(resolve, reject){
            activityCourseModel.packEdit(id, title, cover, video, media, media_name, group_img, group_url, sort, status, banner_list, sharecontent, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    resolve(null)
                }
            })
        })
    }

}