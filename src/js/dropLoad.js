/**
 * fresh 组件
 * @param {Function}		startTouch		回调函数
 * @param {Function}		endTouch		回调函数
 */
$.fn.IUI({
    fresh: function(options) {
        var defaults = {};

        var config = $.extend({

            startTouch: function() {},

            endTouch: function() {}

        }, defaults, options);

        var $this = $(this);

        var $item = $('.slide-list');

        //touch事件的坐标值
        var _startY;
        var _curY;
        var _moveY;

        //获取的translateY值
        var _posBegin;

        //锁
        var _lock;

        var fresh;

        //获取父元素的值
        var _height = $this.outerHeight();

        //获取子元素的值
        var _childHeight = $item.height();

        var u = navigator.userAgent,
            app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端


        //上拉刷新是禁止页面滚动
        document.body.addEventListener('touchmove', function(event) {
            if (_lock) {
                event.preventDefault();
                event.stopPropagation();
            }

        }, false);

        $this.on({

            touchstart: function(e) {

                fnTouches(e);

                _startY = e.touches[0].pageY;

                changeTime(0);

                config.startTouch();

                _childHeight = $item.height();

                fresh = config.direction ? freshBottom : fresh;

            },
            touchmove: function(e) {

                fnTouches(e);

                var _translate;

                _curY = e.touches[0].pageY;

                fresh();


            },

            touchend: function(e) {

                if (_lock) {

                    changeTime(300);

                    _translateY($this, 0);

                    _posBegin = 0;

                    _lock = 0;

                    setTimeout(config.afertFresh, 200);
                }
            }
        });

        function freshBottom() {
            //向上
            if (_curY > _startY) {

                _lock = 0;
            }

            //向下且滚动到底部了
            if (_curY < _startY && $this.scrollTop() + _height >= _childHeight) {

                if (!_lock) {

                    _lock = 1;
                }

                _moveY = _curY - _startY;

                _translate = Math.round(_moveY * 0.5);

                if (_moveY < -10) {

                    _translate = Math.round((_moveY * 0.5 + 10) * 0.3 - 10);

                }

                _translateY($this, _translate);
            }
        }

        function freshTop() {
            //向下
            if (_curY < _startY) {

                _lock = 0;
            }

            //向上且到顶部
            if (_curY > _startY && $this.scrollTop() <= 0) {

                if (!_lock) {

                    _lock = 1;
                }

                _moveY = _curY - _startY;

                _translate = Math.round(_moveY * 0.5);

                if (_moveY > 10) {

                    _translate = Math.round((_moveY * 0.5 + 10) * 0.3 - 10);

                }

                _translateY($this, _translate);
            }
        }
        // touches
        function fnTouches(e) {

            if (!e.touches) {
                e.touches = e.originalEvent.touches;
            }
        };

        function _translateY(obj, y) {
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
            $this.css({
                '-webkit-transition-duration': times + 'ms',
                'transition-duration': times + 'ms'
            });
        };

    }
});
