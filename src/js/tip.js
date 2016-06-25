/**
 * tip 组件
 * @param {String}                 obj                 被提示的对象，可传 id 或 jQuery 对象
 * @param {String}                 text                文本信息
 * @param {Number}                 timeout             多少毫秒后隐藏提示
 * @param {Boolean}                status              状态，success or error
 * @param {Array}                  offset              自定义位置微调值，offset[0] = x, offset[1] = y
 * @param {Function}               callback            回调函数 - hide 时触发
 *
 */
$.extend({
    tip: function(options) {
        var param = $.extend({
            container:'body',
            obj: "#message",
            text: '',
            timeout: 1000,
            status: true,
            offset: false,
            customClass:'tip-part'
            callback: null
        }, options);
        // 判断传入的是id还是class
        var callerStyle = param.obj.charAt(0) === '#' ? 'id' : 'class';
        //初始化jQuery对象
        var obj = $(param.obj).length === 0 ? $('<div '+callerStyle+'="'+param.obj.slice(1)+'" />').appendTo('body') : $(param.obj);
        //判断状态
        var status = param.status ? 'success' : 'error';
        //定时器进程id与dom对象的count绑定，用于一对一清除
        var count = obj.data('count') || 1;
        //自定义位置id标识
        var id = new Date().getTime();
        //自定义位置时，caller的宽度
        var objWidth = obj.outerWidth();
        //自定义位置时，caller的高度
        var objHeight = obj.outerHeight();
        //自定义位置时，caller的x位置
        var x = obj.offset().left;
        //自定义位置时，caller的y位置
        var y = obj.offset().top;
        var tip;

        clearTimeout(obj.data('count'));

        //判断是否为局部提示
        if (param.offset) {
            //判断局部提示的caller是否第一次调用
            if (typeof obj.attr('data-tip') === 'undefined') {

                $('<div class="'+param.customClass+'" id="tip_' + id + '" style="left:' + (x + param.offset[0]) + 'px;top:' + (y + objHeight + param.offset[1]) + 'px"></div>').appendTo(param.container);
                obj.attr('data-tip', id);

            }
            //获取局部提示元素
            tip = $('#tip_' + obj.attr('data-tip'));

        }

        // 根据不同tip类型选择dom来做显示/隐藏的行为
        var target = param.offset ? tip : obj;

        target.html('<span class="' + status + '">' + param.text + '</span>').removeClass('hide');

        // 计时器隐藏提示
        obj.data('count', setTimeout(function() {

            target.addClass('hide');

            if(param.callback){
                param.callback();
            }

        }, param.timeout));

    }
});
