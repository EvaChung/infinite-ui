/**
 * loading 组件
 * @param {Boolean} 		display  		显示或隐藏 true/false
 * @param {Boolean} 		type 		选择 css3 或 git
 * @param {jQuery Object} 	context     loading所在的上下文，
 *
 * @example
 *
 * $.loading(true)
 *
 */

$.loading = $.fn.loading = function(options, type) {
    var defaults = {
        display: false,
        type: 'css',
        animateHtml: '<div class="ball-clip-rotate"><div></div></div>',
        src: 'http://img.yi114.com/201571121314_382.gif',
        shadow: true
    };

    var $context = this instanceof $ ? this : $('body');



    var loadingStr = '<div class="IUI-loading">';

    if (typeof options === 'object') {
        $.extend(defaults, options);
    }else{
        if (options !== undefined) {
            defaults.display = options;
        }
        if(type !== undefined){
             defaults.type = type;
        }
    }

    if (defaults.type === 'css') {
        loadingStr += '{{animateHtml}}</div>'.replace('{{animateHtml}}', defaults.animateHtml);
    }else{
        loadingStr += '<img src="{{src}}" ></div>'.replace('{{src}}', defaults.src);
    }

    if (defaults.display) {
        if (defaults.shadow) {
            loadingStr = '<div class="IUI-loading-backdrop"></div>' + loadingStr;
        }
        $context.append(loadingStr);
    } else {
        $context.find('>.IUI-loading-backdrop,>.IUI-loading').remove();
    }

};
