var mysql = require('mysql'),
    DB = require('../../config/db');

// 电子书数据统计
module.exports = {

    /*
        出版社查询
        code: 出版社code
    */
    getSearchPublisher: function(code, callback){
        var sql = 'SELECT * FROM rw_publisher WHERE code = ?'
        DB.exec(sql,[code],function(err,result){  
            callback(err,result)
        });  
    },

    /*
        sql语句管理
    */
    sqlStatements: function(id, code, start, end){
        var conditions = (id==1)?" AND not(ut.`pay_source`= 'account_pay' AND ut.`pay_os`= 'ios') ":"",
            starttime = start?" AND e.`create_time` > '"+ start +"' ":" ",
            endtime = end?" AND e.`create_time` < '"+ end +"' ":" ",
            sql = "SELECT ut.`goods_id` id, "+
                " wb.`title` title, "+
                " wb.`author` author, "+
                " wb.`isbn13` isbn, "+
                " p.`name` publisher, "+
                " p.`code` code, "+
                " ut.`total_money` money, "+
                " e.`create_time` createtime, "+
                " COUNT(*) count "+
                " FROM `rw_user_trade` ut "+
                " INNER JOIN `rw_wish_book` wb on ut.`goods_id`= wb.`id` "+
                " INNER JOIN `rw_ebook` e on wb.`id`= e.`wish_book_id` "+
                " LEFT JOIN `rw_publisher` p on p.id= e.`publisher_id` "+
                " WHERE ut.`status`= 100 "+
                starttime + endtime +
                " AND p.`code` = '"+ code +"'"+
                " and ut.`goods_type`= 'ebook' "+
                " AND ut.`total_money`> 0 "+
                " AND ut.`user_id` NOT IN(7298, 259850, 1970, 3552131, 3512541, 511326, 939087, 3028225, 3470481, 211288, 1820093, 3866497, 283738, 6636799, 6976582) "+
                conditions+
                // " AND ut.`pay_source`= 'account_pay' "+
                // " AND ut.`pay_os`= 'ios' "+
                " GROUP BY ut.`goods_id`";
        return sql
    },
    

    /*
        电子书数据统计(总数)
        booktitle: 书籍名称（选填）
        bookisbn： 书籍豆瓣ISBN（选填）
        bookontime：上线时间（选填）
    */
    getSearchResultAll: function(code, starttime, endtime, callback){
        DB.exec(this.sqlStatements(1, code, starttime, endtime),null,function(err,result){  
            callback(err,result)
        });  
    },

    /*
        电子书数据统计（带分成数据ios）
        booktitle: 书籍名称（选填）
        bookisbn： 书籍豆瓣ISBN（选填）
        bookontime：上线时间（选填）
    */
    getSearchResultIos: function(code, starttime, endtime, callback){
        DB.exec(this.sqlStatements(2, code, starttime, endtime),null,function(err,result){  
            callback(err,result)
        });  
    }

}