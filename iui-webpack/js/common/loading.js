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

function Loading(options, type, init) {
    // 默认配置
    var defaults = {
        display: false,
        type: 1,
        animateHtml: '<div class="ball-clip-rotate"><div></div></div>',
        src: 'http://img.yi114.com/201571121314_382.gif',
        shadow: true,
        template: '<div class="IUI-loading">{{hook}}</div>'
    };
    // 是否全局模式
    var isGlobal = this instanceof $;
    // 作用域元素
    var $context = isGlobal ? this : $('body');

    // 若非全局模式，给作用域元素相对定位
    if (isGlobal) {
        $context.css('position', 'relative');
    }
    // 判断是临时配置还是自定义配置
    var isTempConfig = typeof options === 'object';
    // 使用自定义配置还是默认配置
    if(!init){
        $.extend(defaults, isTempConfig ? options : $.loadingConfig);
    }
    // 若options不为
    if (!isTempConfig && typeof options !== void 0) {
        defaults.display = options;
    }
    // 快捷切换css3 or image
    if (type !== undefined) {
        defaults.type = type;
    }
    // loading 模板
    var loadingStr = defaults.template;
    loadingStr = loadingStr.replace('{{hook}}', defaults.type ? defaults.animateHtml : '<img src="' + defaults.src + '" />');
    // 是否需要遮罩
    if (defaults.shadow) {
        loadingStr = '<div class="IUI-loading-backdrop" ' + (isGlobal ? 'style="position:absolute;"' : '') + '></div>' + loadingStr;
    }
    var $loading = $context.data('loading') || $(loadingStr);
    // 显示loading的时候，将 $loading存入作用域元素中
    if(!$context.data('loading')){
        $context.data('loading', $loading);
    }
    // 显示 or 隐藏
    if (defaults.display) {
        $context.append($loading);
    } else {
        $context.data('loading').remove();
    }
};

$.fn.loading = Loading;

module.exports = {loading:Loading};
