/**
 * 判断是否显示/隐藏邮箱、手机
 * @param  [description]             obj             传body进来;  $('body')
 * @param  [description]             parents         input的父级，用于隐藏/显示
 * @param  [description]             type            判断的类型，邮箱还是手机; 传name
 */
module.exports = {
    exist: function(options) {
        var param = $.extend({
            obj: $('body'),                 //传body进来;  $('body')
            parents: '.form-container',     //input的父级，用于隐藏/显示
            type: 'email',                  //判断的类型，邮箱还是手机; 传name
            success: null                   //成功的回调函数
        }, options);

        var obj = param.obj instanceof $ ? param.obj : $(param.obj);
        var $parents = obj.find('#'+param.type).parents(param.parents);
        var activityId = obj.find('input[name="activityId"]').val();
        var _val = obj.find('#'+param.type).val();
        var csrf = $('meta[name="csrf-param"]').prop('content');
        var csrf_val = $('meta[name="csrf-token"]').prop('content');
        var isemail = _val ? '&email='+_val : '';

        $.post('/index/init-activity', csrf+'='+csrf_val+'&activityId='+activityId+isemail, function(res) {
            if(res.status) {
                if(_val) {
                    if(res.register) {
                        $parents.find('#'+param.type).val('');
                        $parents.removeClass('none');
                    }else {
                        $parents.addClass('none');
                    }
                }
                if(param.success) {
                    param.success(res.region);
                }
            }
        });
    }
};
