/**
 * loading 组件
 * @param {Boolean}     display  	    显示或隐藏 true/false
 * @param {String} 	    type 		    选择 css 或 img
 * @param {String}      animateHtml     穿入的css动画,type为css有效
 * @param {String}      src             图片地址，type不为css有效
 * @param {Boolean} 	shadow          是否显示阴影
 *
 * @example
 *
 * $.loading(true,'css')或$(selector).loading(true,'css')或
 *
 */

$.loading = $.fn.loading = function(options, type) {
    var defaults = {
        display: false,
        type: 1,
        animateHtml: '<div class="ball-clip-rotate"><div></div></div>',
        src: 'http://img.yi114.com/201571121314_382.gif',
        shadow: true
    };

    var $context;
    var callType = this instanceof $;
    if(callType){
        $context = this;
        $context.css('position','relative');
    }else{
        $context =  $('body');
    }



    var loadingStr = '<div class="IUI-loading">{{hook}}</div>';

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

    loadingStr = loadingStr.replace('{{hook}}', defaults.type ? defaults.animateHtml : '<img src="'+defaults.src+'" />');

    if (defaults.shadow) {
        loadingStr = '<div class="IUI-loading-backdrop" ' + (callType ? 'style="position:absolute;"':'') + '></div>' + loadingStr;
    }


    if (defaults.display) {
        $context.append(loadingStr);
    } else {
        $context.find('>.IUI-loading-backdrop,>.IUI-loading').remove();
    }

};
