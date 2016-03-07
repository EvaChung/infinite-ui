/**
 * loading 组件
 * @param {Boolean} 		open  		显示或隐藏 true/false
 * @param {Boolean} 		mobile 		选择 css3 或 git
 * @param {jQuery Object} 	context     loading所在的上下文，
 *
 * @example
 *
 * $.loading(true)
 *
 */
$.extend({
    loading: function(open, mobile, context) {
        // 当参数长度大于1，则使用CSS3 loading效果
        // context是执行环境
        var arg = arguments;
        var type = arg.length > 1;
        var display = arg[0];
        var $context = context || $('body');
        var loadingStr = '<div class="IUI-loading">' + (type ? '<div class="loader-inner ball-clip-rotate"><div></div></div>' : '<img src="http://img.yi114.com/201571121314_382.gif" width="32" height="32">') + '</div>';
        if (display) {
            $context.append('<div class="IUI-loading-backdrop"></div>' + loadingStr);
        } else {
            $context.find('.IUI-loading-backdrop,.IUI-loading').remove();
        }

    }
});
