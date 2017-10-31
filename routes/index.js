/*首页*/
// exports.index = function(req, res){
//     res.render('Jade/index', { title: 'test' });
// };

/*列表页display数据到页面*/
exports.list = function(req, res){
    res.render('jade/test', {
        title: '有书共读',
        name: '最具影响力的终身学习服务提供商'
    }); 
};

/*详情页*/
// exports.details = function(req, res){
//     res.send('详情'+req.query.id);
// };

