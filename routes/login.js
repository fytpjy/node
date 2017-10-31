var path = require('path');

module.exports = function(app) {

    app.get('*', function(req, res ,next){

        var Cookies ={};
        if (req.headers.cookie != null) {
            req.headers.cookie.split(';').forEach(l => {
                var parts = l.split('=');
                Cookies[parts[0].trim()] = (parts[1] || '').trim();
            });
        }
        if(Cookies.id){
            next()
            // res.redirect('/');
        }else{         
            res.render('jade/login', {
                from: req.query.from
            });
            //console.warn("路由加载警告,",path);
            //return;
        }
    })

    return app;

}