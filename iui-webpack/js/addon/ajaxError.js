/**
 * 错误提示组件
 * @param {String,jQuery Object}        obj         被提示的对象，可传 id 或 jQuery 对象
 * @param {String}                      data        后台返回的data数据
 * @param {Number}                      timeout     多少毫秒后隐藏提示
 * @param {Boolean}                     status      状态，success or error 默认true
 */
module.exports = {
    ajaxError: function(options) {
        var _selt = this;
        var item_arr = []; //存页面要验证的字段
        var param = $.extend({
            obj: '#message',
            data: null, //插入后台的data数据
            timeout: 3000, //设置多少时间隐藏提示
            status: false,
            hideCall: function() {}
        }, options);
        var obj = param.obj instanceof $ ? param.obj : $(param.obj);
        var status = param.status ? 'success' : 'error';
        var msg = ''; //提示信息

        if (param.data.error.constructor !== Object) {
            //'验证已经全部通过，不再执行往下方法'
            if (param.data.info !== '新增成功' || param.data.info !== '修改成功') {
                msg = param.data.info;
                $.alert({
                    obj: obj,
                    text: msg,
                    timeout: param.timeout,
                    status: param.status
                });
            }
            return false;
        }

        $.each(_selt.find('.val-error'), function(index, title) { //循环页面的字段，拿到字段名存在item_arr数组里
            var _aname = $(title).attr('name');
            var _dname = $(title).attr('data-name');
            var _sname = _dname ? _dname : _aname;
            item_arr.push(_sname);
        });

        if (item_arr) {
            $.each(item_arr, function(key, value) {
                $.each(param.data.error, function(item, val) {
                    if (value === item) {
                        msg = val;
                        return msg;
                    }
                });
                if (msg) {
                    $.alert({
                        obj: obj,
                        text: msg,
                        timeout: param.timeout,
                        status: param.status,
                        callback: param.hideCall
                    });
                    return false;
                }
            });
        }
    }
};
