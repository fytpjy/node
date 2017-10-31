var getData = require('./../lib/common/index');

/*返回redis口数据*/
exports.getredis = function(req, res){

    getData.redis({
        num: 1,
        type: "get",
        from: "test",
        key: "a",
        success: function(json){
            res.setHeader('Content-Type', 'application/json;charset=utf-8');  
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(json);
        },
        fail: function(error){
            console.log(error)
        }
    })

};