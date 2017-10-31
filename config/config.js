module.exports = {

    /*  
        DEV环境配置参数
    */
    dev: {
        host         : '',    // 请求PHP接口地址
        port         : '3000',                         // 程序运行接口
        webhost      : '',
        redis        : {                               // redis 配置参数
            host     : '127.0.0.1',
            port     : '6379',
            password : ''
        },
        mysql        : {                               // mysql 配置参数
            host     : '',
            user     : '',
            password : '',
            database : ''
        },
        logfile      : './logs/log.log'
    },

    /*
        QA环境配置参数
    */
    qa : {
        host         : '',
        port         : '3000',
        webhost      : '',
        redis: {
            host     : '127.0.0.1',
            port     : '6379',
            password : ''
        },
        mysql: {
            host     : '127.0.0.1',
            user     : 'root',
            password : 'root',
            database : 'yunying'
        },
        logfile      : './logs/log.log'
    },


    /*
        PROD环境配置参数
    */
    prod : {
        host         : '',
        port         : '3000',
        webhost      : '',
        redis: {
            host     : '',
            port     : '',
            password : ''
        },
        mysql: {
            host     : '',
            user     : '',
            password : '',
            database : ''
        },
        logfile      : './logs/log.log'
    }

}