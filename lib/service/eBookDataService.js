var moment = require('moment');
var promise=require("bluebird");
var bodyParser = require('body-parser');
var jsonResult = require('../../lib/common/json_result');
var eBookDataModel = require('../../lib/model/eBookDataModel');

module.exports = {

    
    /*查询出版社信息*/
    publisher: function(code){
        return new promise(function(resolve, reject){
            eBookDataModel.getSearchPublisher(code, function(err, data){
                if(err){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    if(data.length>0){
                        resolve(data[0])
                    }else{
                        resolve(data)
                    }
                }
            })
        })
    },

    /*电子书数据统计*/
    search: function(code, page, count, starttime, endtime){
        var page = page?page:1,
            count = count?count:10;
        return new promise(function(resolve, reject){
            eBookDataModel.getSearchResultAll(code, starttime, endtime, function(err1, data1){
                if(err1){
                    reject(jsonResult.CODE_ACTIVE_ERROR)
                }else{
                    eBookDataModel.getSearchResultIos(code, starttime, endtime, function(err2, data2){
                        if(err2){
                            reject(jsonResult.CODE_ACTIVE_ERROR)
                        }else{
                            var resultdata = new Array();
                            data1.forEach(function(dat){
                                var tdata = dat;
                                tdata.ioscount = 0;
                                tdata.poundage = 0;
                                data2.forEach(function(dat2){
                                    if(dat.id == dat2.id){
                                        tdata.ioscount = dat2.count;
                                        tdata.poundage = dat2.count*dat2.money*0.3;
                                    }
                                })
                                tdata.createtime = moment(dat.createtime).format('YYYY-MM-DD HH:mm:ss');

                                resultdata.push(tdata)
                            })
                            resolve(resultdata.slice((page-1)*count,count))
                        }
                    })
                }
            })
        })
    }

}