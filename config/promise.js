var promise=require("bluebird");
var dbFastReadModel = require('./../lib/model/dbFastReadModel');
var jsonResult = require('./../lib/common/json_result');
//arguments

module.exports = function(options){

    return new promise(function(resolve,reject){
        dbFastReadModel[options.url](options.data.page, options.data.count, function(err,data){
            if(err){
                console.log('err')
                reject(jsonResult.CODE_ACTIVE_ERROR)
            }else{
                console.log('ok')
                resolve(data)
            }
        })
    })

}