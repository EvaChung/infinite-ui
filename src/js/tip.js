/**
 * tip 组件
 * @param {String,jQuery Object}		obj  		被提示的对象，可传 id 或 jQuery 对象
 * @param {String}						text 		文本
 * @param {Number}						timeout 	多少毫秒后隐藏提示
 * @param {Boolean}						status 		状态，success or error
 * @param {Boolean}						position 	自定义位置，当它为 true 时， obj 将成为tip的位置参照物
 * @param {Array}						offset 		自定义位置微调值，offset[0] = x, offset[1] = y
 * @param {Function}					callback    回调函数 - hide 时触发
 *
 */
$.extend({
    tip: function(options) {
        var param = $.extend({
            obj: "#message",
            text: '',
            timeout: 3000,
            status: true,
            position: false,
            offset: [0, 5],
            callback: null
        }, options);

        var obj = param.obj instanceof $ ? param.obj : $(param.obj);
        var status = param.status ? 'success' : 'error';
        var count = obj.data('count') || 1;
        var id = new Date().getTime();
        var objWidth = obj.outerWidth();
        var objHeight = obj.outerHeight();
        var _x = obj.offset().left;
        var _y = obj.offset().top;
        var tip;

        clearTimeout(obj.data('count'));

        if (param.position) {
            if (typeof obj.attr('data-tip') === 'undefined') {

                $('<div class="tips" id="tip_' + id + '" style="left:' + (_x + param.offset[0]) + 'px;top:' + (_y + objHeight + param.offset[1]) + 'px"></div>').appendTo('body');
                obj.attr('data-tip', id);

            }
            tip = $('#tip_' + obj.attr('data-tip'));

        }

        var target = param.position === 'custom' ? tip : obj;

        target.html('<span class="' + status + '">' + param.text + '</span>').removeClass('hide');

        obj.data('count', setTimeout(function() {

            target.addClass('hide');

            if(param.callback){
                param.callback();
            }

        }, param.timeout));

    }
});
