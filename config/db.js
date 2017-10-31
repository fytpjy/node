var mysql=require("mysql");  
var config = require('./../config/config');
var env = process.env.NODE_ENV;
config = config[env];

var pool = mysql.createPool({
    host     : config.mysql.host,
    user     : config.mysql.user,
    password : config.mysql.password,
    database:  config.mysql.database
});  

module.exports = {
    exec: function(sqlObject, sqlValues, callback){
        pool.getConnection(function(err,conn){  
            if(err){  
                callback(err,null,null);  
            }else{
                if(sqlValues){
                    conn.query(
                      sqlObject,  sqlValues,
                      function(qerr,vals,fields){
                        conn.release();  
                        callback(qerr,vals,fields);  
                    });
                }else{
                    conn.query(sqlObject, function(qerr,vals,fields){
                        conn.release();  
                        callback(qerr,vals,fields);  
                    });
                }
            }  
        });  
    }
}
