/**
 * tab 组件
 * @param {String}			item 			项 class
 * @param {String}  		content 		内容 class
 * @param {String}			current 		当前状态 className
 * @param {String}			handle 			事件类型
 * @param {Function}		afterShow       回调函数 - handle后触发
 * @param {Function} 		beforeShow 		回调函数 - handle前触发
 */
$.fn.IUI({
    tab: function(options) {
        return this.each(function() {
            var defaults = {
                item: '.tab-item',
                content: '.tab-content',
                current: 'active',
                handle: 'click',
                afterShow: function() {},
                beforeShow: function() {}
            };

            var $selector = $(this);
            var config = $.extend({}, defaults, options);
            var $items = $selector.find(config.item);
            var $contents = $selector.find(config.content);
            var time = null;
            var index = 0;
            if (!$items.length) {
                return;
            }


            init($items.eq(0));

            $selector.on(config.handle, config.item, function(event) {
                event.preventDefault();
                var _this = $(this);
                config.beforeShow.apply(_this, [event, config]);
                init(_this);
                config.afterShow.apply(_this, [event, config]);
            });


            function init(current, isLoop) {
                var _items = $selector.find(config.item);
                _contents = $selector.find(config.content);
                index = _items.index(current);
                _items.removeClass(config.current);
                _contents.removeClass(config.current);
                _items.eq(index).addClass(config.current);
                _contents.eq(index).addClass(config.current);

            }

        });
    }
});
