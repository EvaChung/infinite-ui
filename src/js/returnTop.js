/**
 * returnTop 组件
 * @param {String}          target              需绑定点击事件的对象
 * @param {Number}          showTop             滚动 showTop 后出现
 * @param {Number}          bottom              距离窗口底部 bottom px
 * @param {Number}          delay               动画时长
 */
$.fn.IUI({
    returnTop: function(options) {
        var defaults = {
            target: '.returnTop-btn',
            showTop: 100,
            bottom: 50,
            delay: 300
        };
        var $selector = $(this);
        var $window = $(window);
        var config = $.extend({}, defaults, options);
        var $target = $selector.find(config.target);
        var scrollPosition = function(obj, target) {

            if (target > config.showTop && obj.hasClass('hide')) {
                obj.removeClass('hide');
            }

            if (target < config.showTop && !obj.hasClass('hide')) {
                obj.addClass('hide');
            }

            return false;

        };

        scrollPosition($target, $window.scrollTop());

        $selector.css({
            'bottom': config.bottom
        });

        $window.on('scroll', function(event) {
            scrollPosition($target, $(window).scrollTop());
        });

        $selector.on('click', config.target, function(event) {
            $("body,html").stop().animate({
                scrollTop: 0
            }, config.delay);
            return false;
        });

    }
});
