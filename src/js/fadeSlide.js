/**
 * fadeSlide 组件
 * @param {String}      interval        轮播时间，单位毫秒
 *
 * @example : http://jeep.vrm.cn/index.html
 */
$.fn.IUI({
    fadeSlide: function(options) {
        return this.each(function() {
            var $this = $(this),
                settings = $.extend({
                    interval: 5000
                }, options),
                time = null,
                current = 0,
                $ul = $this.find('ul');

            if ($ul.find('li').length <= 1) {
                return false;
            }
            $this.append(createSerialNumber($ul.find('li').length, '●'));

            $ul.find('li').eq(0).addClass('current');

            $this.on({
                mouseenter: function(event) {
                    $this.find('.ficon').removeClass('none');
                },
                mouseleave: function(event) {
                    $this.find('.ficon').addClass('none');
                }
            });

            $this.find('.next').on('click', function(event) {
                event.preventDefault();

                var li = $this.find('ol li');

                if (!$this.data('animate')) {

                    $this.data('animate', 1);

                    if (current < li.length - 1) {
                        current++;
                    } else {
                        current = 0;
                    }

                    li.removeClass('current');

                    li.eq(current).addClass('current');

                    $ul.find('li').fadeOut(500).eq(current).fadeIn(500, function() {
                        $this.data('animate', 0);
                    });

                    $ul.find('li').eq(current).addClass('current').siblings('.current').removeClass('current');
                }
            });


            $this.find('.prev').on('click', function(event) {

                event.preventDefault();

                var li = $this.find('ol li');

                if (!$this.data('animate')) {

                    $this.data('animate', 1);

                    if (current > 0) {

                        current--;

                    } else {

                        current = li.length - 1;
                    }

                    li.removeClass('current');

                    li.eq(current).addClass('current');

                    $ul.find('li').fadeOut(500).eq(current).fadeIn(500, function() {
                        $this.data('animate', 0);
                    });
                    $ul.find('li').eq(current).addClass('current').siblings('.current').removeClass('current');
                }
            });


            $this.on({
                mouseenter: function(event) {
                    clearTimeout(time);
                },
                mouseleave: function(event) {
                    time = setTimeout(autoPlay, settings.interval);
                }
            }, '.prev,.next');

            $this.find('ol').on({
                mouseenter: function(event) {
                    clearTimeout(time);
                    current = $(this).index();
                    if ($(this).hasClass('current')) {
                        return false;
                    }

                    $(this).addClass('current').siblings('.current').removeClass('current');

                    $ul.find('li').fadeOut(500).eq(current).fadeIn(500);

                    $ul.find('li').eq(current).addClass('current').siblings('.current').removeClass('current');
                },
                mouseleave: function(event) {
                    time = setTimeout(autoPlay, settings.interval);
                }
            }, 'li');

            time = setTimeout(autoPlay, settings.interval);

            function autoPlay() {
                clearTimeout(time);
                var li = $this.find('ol li');

                if (current < li.length - 1) {
                    current++;
                } else {
                    current = 0;
                }

                li.removeClass('current');
                li.eq(current).addClass('current');
                $ul.find('li').fadeOut(500).eq(current).fadeIn(500);
                $ul.find('li').eq(current).addClass('current').siblings('.current').removeClass('current');

                time = setTimeout(autoPlay, settings.interval);
            }

            function createSerialNumber(len, placeholder) {
                var i, _len = len,
                    str = '',
                    text = placeholder || '&nbsp;';
                str += "<ol>";
                for (i = 0; i < _len; i++) {
                    if (i === 0) {
                        str += '<li class="current">' + text + '</li>';
                    } else {
                        str += '<li>' + text + '</li>';
                    }
                }
                str += "</ol>";
                return str;
            }

        });

    }
});
