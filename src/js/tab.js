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

            var $this = $(this);
            var config = $.extend({}, defaults, options);
            var $items = $this.find(config.item);
            var $contents = $this.find(config.content);
            var time = null;
            var _index = 0;
            var _len = $items.length;
            if (!$items.length) {
                return;
            }


            init($items.eq(0));

            $this.on(config.handle, config.item, function(event) {
                event.preventDefault();
                var _this = $(this);
                config.beforeShow.apply(_this, [event, config]);
                init(_this);
                config.afterShow.apply(_this, [event, config]);
            });


            function init(current, isLoop) {
                _items = $this.find(config.item);
                _contents = $this.find(config.content);
                _index = _items.index(current);
                _items.removeClass(config.current);
                _contents.removeClass(config.current);
                _items.eq(_index).addClass(config.current);
                _contents.eq(_index).addClass(config.current);

            }

        });
    }
});
