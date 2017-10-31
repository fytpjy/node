SUCCESS = 1;
ERROR = 0;

module.exports = {

    CODE_NO_DATA: 1001,
    CODE_INVALID_DATA: 1002,
    CODE_INVALID_PARAM: 1003,
    CODE_ACTIVE_ERROR: 1004,
    CODE_HAVE_DIG: 1005,
    CODE_NO_PACK_ID: 1006,
    CODE_UPDATA_REPEAT: 1007,
    CODE_HAVE_JOIN_EVAL: 1008,
    CODE_CHECK_CODE_FAIL: 1009,

    ERR_MSG: {
        1001: '没有数据',
        1002: '非法数据',
        1003: '参数错误',
        1004: '操作失败',
        1005: '已点过赞',
        1006: '不存在的ID',
        1007: '请勿重复操作',
        1008: '活动已报名',
        1009: '验证失败',
    },

    getSuccessResult: function(data, msg){
        return {code:SUCCESS, data:data, msg: msg ? msg:"success"};
    },

    getErrorResult: function(code, msg){
        return {code: code, msg: msg ? msg: this.ERR_MSG[code]};
    }

}