var fs = require("fs");

module.exports = function(app) {

    var filessss = fs.readdirSync("./lib/action/");
    filessss.forEach(function(thi){
        var routeslist = require('../lib/action/'+thi.split(".")[0]);
        routeslist(app);
    })

}