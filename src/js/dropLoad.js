/**
 * fresh 组件
 * @param {Function}        startTouch      回调函数
 * @param {Function}        endTouch        回调函数
 */
$.fn.IUI({
    fresh: function(options) {
        var defaults = {};

        var config = $.extend({

            startTouch: function() {},

            endTouch: function() {}

        }, defaults, options);

        var $selector = $(this);

        var $item = $('.slide-list');

        //touch事件的坐标值
        var startY;
        var curY;
        var moveY;

        //获取的translateY值
        var posBegin;

        //锁
        var lock;

        var fresh;

        //获取父元素的值
        var height = $selector.outerHeight();

        //获取子元素的值
        var childHeight = $item.height();
        var translate;

        var u = navigator.userAgent;
        var app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端


        //上拉刷新是禁止页面滚动
        document.body.addEventListener('touchmove', function(event) {
            if (lock) {
                event.preventDefault();
                event.stopPropagation();
            }

        }, false);

        $selector.on({

            touchstart: function(e) {

                fnTouches(e);

                startY = e.touches[0].pageY;

                changeTime(0);

                config.startTouch();

                childHeight = $item.height();

                fresh = config.direction ? freshBottom : fresh;

            },
            touchmove: function(e) {

                fnTouches(e);


                curY = e.touches[0].pageY;

                fresh();


            },

            touchend: function(e) {

                if (lock) {

                    changeTime(300);

                    translateY($selector, 0);

                    posBegin = 0;

                    lock = 0;

                    setTimeout(config.afertFresh, 200);
                }
            }
        });

        function freshBottom() {
            //向上
            if (curY > startY) {

                lock = 0;
            }

            //向下且滚动到底部了
            if (curY < startY && $selector.scrollTop() + height >= childHeight) {

                if (!lock) {

                    lock = 1;
                }

                moveY = curY - startY;

                translate = Math.round(moveY * 0.5);

                if (moveY < -10) {

                    translate = Math.round((moveY * 0.5 + 10) * 0.3 - 10);

                }

                translateY($selector, translate);
            }
        }

        function freshTop() {
            //向下
            if (curY < startY) {

                lock = 0;
            }

            //向上且到顶部
            if (curY > startY && $selector.scrollTop() <= 0) {

                if (!lock) {

                    lock = 1;
                }

                moveY = curY - startY;

                translate = Math.round(moveY * 0.5);

                if (moveY > 10) {

                    translate = Math.round((moveY * 0.5 + 10) * 0.3 - 10);

                }

                translateY($selector, translate);
            }
        }
        // touches
        function fnTouches(e) {

            if (!e.touches) {
                e.touches = e.originalEvent.touches;
            }
        };

        function translateY(obj, y) {
            obj.css({
                "-webkit-transform": 'translateY(' + y + 'px)',
                transform: 'translateY(' + y + 'px)'
            });
        };

        function getTranslateY(obj) {
            var transZRegex = /\.*translateY\((.*)px\)/i;
            var result;
            if (obj[0].style.WebkitTransform) {
                result = parseInt(transZRegex.exec(obj[0].style.WebkitTransform)[1]);
            } else if (obj[0].style.transform) {
                result = parseInt(transZRegex.exec(obj[0].style.transforms)[1]);
            }
            return result;
        };

        function changeTime(times) {
            $selector.css({
                '-webkit-transition-duration': times + 'ms',
                'transition-duration': times + 'ms'
            });
        };

    }
});
