var html2jade = require('html2jade');
var fs = require("fs");
var path = require('path');

module.exports = {

    init: function(app){
        var filesname = fs.readdirSync("./html/");
        for(var i in filesname){
            var file = filesname[i];
            var filename = fs.readdirSync("./html/"+filesname[i]);
            this.isExists(filename,file)
        }
    },

    isExists: function(filename, file) {
        var self = this;
        fs.exists("./views/"+file, function(exists){
            if (exists) {
                self.htmltojade(filename, file)
            } else {
                fs.mkdir("./views/"+file, function (err) {
                    if (err) throw err;
                    self.htmltojade(filename, file)
                })
            }
        })
    },

    htmltojade: function(filename,file){
        
        filename.forEach(function(thi){
            if(thi.indexOf(".html")>0)
                fs.readFile("./html/"+file+"/"+thi,'utf-8',function(err,data){
                    html2jade.convertHtml(data,{},function(err,jade){
                        fs.writeFile(path.join(__dirname, '../views/'+file+'/'+thi.replace(/.html/g,"")+'.jade'), jade, function (err) {
                                if (err) throw err;
                                console.log(thi.replace(/.html/g,'')+".jade Export Account Success!");
                            });
                    })
                })
        })
        
    }

}