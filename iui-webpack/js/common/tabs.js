/**
 * tabs 组件
 *
 * @Options
 *
 * @param {[String]}         [event]                        事件名称
 * @param {[String]}         [animateBefore]                前动画，因transition动画需要两个class支持，因此区分before和after
 * @param {[String]}         [animateAfter]                 后动画，具体参考bootstrap tab的动画效果 fade & in
 * @param {[Boolean]}        [isCache]                      是否缓存，ajax请求内容时使用，默认缓存
 * @param {[Object]}         [ajaxSetup]                    ajax 请求配置
 *
 *
 * @Events
 *
 * $('selctor').on('tabsAjaxBefore',function(){});
 * $('selctor').on('tabsAjaxSuccess',function(){});
 *
 *
 * @Usage
 *
 * $('selector').IUI('tabs',{
 *    event:'mouseenter',
 *    animateBefore:'fade',
 *    animateAfter:'in'
 * });
 *
 */

/**
 * [show description]
 * @param  {[jQuery Object]}            target              目标元素
 * @param  {[Object]}                   config              配置
 */

function show(config) {
    var el = this;
    el.addClass('active').css('opacity',0).addClass('animate');
    setTimeout(function() {
        el.addClass(config.animateAfter);
    }, 100);
}
module.exports = {
    tabs: function(options) {
        return this.each(function() {
            var defaults = {
                event: 'click',
                isCache: true,
                ajaxSetup: null
            };

            var $selector = $(this);
            //避免与tabs嵌套tabs时冲突
            var config = $.extend({}, defaults, options);

            $selector.on(config.event + '.iui-tabs', '.tabs-item', function(event) {
                event.preventDefault();
                var $this = $(this);
                var $parent = $this.parent();
                var $target = $($this.attr('href'));
                $target.trigger('tabsAjaxBefore', [config]);
                // switch tabs-item class
                $parent.addClass('active').siblings('.active').removeClass('active animate');
                // switch tabs-content class
                $target.siblings('.tabs-content').removeClass('active');

                show.call($target, config);

                if ($this.data('loaded') && config.isCache) {
                    return false;
                }

                if ($this.data('ajax')) {
                    $.ajax($.extend({
                        url: $this.data('ajax'),
                        type: 'GET',
                        dataType: 'html'
                    }, config.ajaxSetup)).then(function(res) {
                        $this.data('loaded', true);
                        $target.trigger('tabsAjaxSuccess', [res]);
                    }, function(err) {
                        console.log(err);
                    });
                }

                show.call($target, config);

            });

        });
    }
};
