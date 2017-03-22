/**
 * emailSuffix 组件
 * @param {String}      container               组件的执行上下文
 * @param {String}      style                   组件被 append 的位置，若为global，则 append to container，否则将插入到和被调用元素的同一级节点中
 * @param {String}      item                    邮箱后缀列表 li 的 class
 * @param {String}      current                 邮箱后缀列表 li 的选中 class
 * @param {Array}       emails                  常用邮箱后缀，若要增加新邮箱后缀，需要复写原有默认的邮箱，否则数组将会被覆盖
 * @param {Number}      delay                   delay 毫秒后隐藏列表
 * @param {Number}      offsetLeft              组件定位 - left
 * @param {Number}      offsetTop               组件定位 - top
 * @param {Number}      offsetWidth             组件宽度 - width
 * @param {Number}      offsetHeight            组件高度 - height
 * @param {Function}    checkedCall             回调函数，选中后触发
 */


module.exports = {
    emailSuffix: function(options) {
        return this.each(function() {
            var defaults = {
                container: 'body',
                style: 'global',
                item: 'email-item',
                current: 'checked',
                emails: ['163.com', '126.com', 'qq.com', 'gmail.com', 'sina.com', '139.com', '189.com', 'sohu.com'],
                delay: 300,
                offsetLeft: $(this).offset().left,
                offsetTop: $(this).offset().top,
                offsetWidth: $(this).outerWidth(),
                offsetHeight: $(this).outerHeight(),
                checkedCall: function() {}
            };
            var $selector = $(this);
            var config = $.extend({}, defaults, options);
            var $list = $('<ul class="email-list hide"></ul>');
            var $body = $(config.container);
            var time = null;
            var listHtml = function(arr, input) {

                var str = '';
                var val = input.value || null;
                var prefix = val ? val.split('@')[0] : false;
                var suffix = val ? val.split('@')[1] : false;
                var email;
                for (var i = 0; i < arr.length; i++) {
                     email = arr[i];
                    if ((prefix && !suffix) || suffix && email.indexOf(suffix) !== -1) {
                        str += '<li class="' + config.item + '" data-value="' + prefix + '@' + email + '">' + prefix + '@' + email + '</li>';
                    }

                }
                return str;
            };

            var keyEvent = function(keyCode, target, obj) {
                var tmp = [38, 40];
                if ($.inArray(keyCode, tmp) === -1 || target.hasClass('hide')) {
                    return false;
                }
                var direction = $.inArray(keyCode, tmp) >= 1 ? true : false;
                var $target = target;
                var len = $target.find('li').length;
                var $targetCurrent = $target.find('li.checked');
                $target.find('li').removeClass('checked');

                if (direction) {
                    //down
                    if ($targetCurrent.length && $targetCurrent.index() !== len - 1) {
                        $targetCurrent.next().addClass('checked');
                    } else {
                        $target.find('li').eq(0).addClass('checked');
                    }
                } else {
                    //up
                    if ($targetCurrent.index() > 0) {
                        $targetCurrent.prev().addClass('checked');
                    } else {
                        $target.find('li').eq(len - 1).addClass('checked');
                    }
                }

                obj.val($.trim($target.find('li.checked').text()));

                config.checkedCall.apply($selector, [event, config]);
            };
            var resize = function() {
                var left = config.offsetLeft;
                var top = config.offsetTop;
                var width = config.offsetWidth;
                $list.css({
                    left: left,
                    top: top + config.offsetHeight,
                    width: width
                });
            };

            resize();

            if (config.style === 'global') {
                $body.append($list);
                $(window).on('resize.emailSuffix', resize);
            } else {
                $selector.parent().css('position','relative').append($list);
            }

            $selector.on('keyup.emailSuffix', function(event) {
                var val = this.value;
                if (val.charAt(0) !== '@' && val.split('@').length === 2 && $.inArray(event.keyCode, [40, 38, 13]) === -1) {
                    var str = listHtml(config.emails, this);
                    $list.html(str).removeClass('hide').find('li').eq(0).addClass('checked');

                } else if ($.inArray(event.keyCode, [40, 38, 13]) === -1) {
                    $list.html('').addClass('hide');
                }
            });

            $selector.on('keydown.emailSuffix', function(event) {
                var $selected = $list.find('li.checked');
                keyEvent(event.keyCode, $list, $selector);
                if (event.keyCode === 13) {
                    event.preventDefault();
                    if ($selected.length) {
                        $selector.val($.trim($selected.text()));
                    }
                    $list.addClass('hide');
                }
            });

            $selector.on('blur.emailSuffix', function(event) {
                time = setTimeout(function() {
                    $list.addClass('hide');
                }, config.delay);
            });

            $list.on('click', '.'+config.item, function(event) {
                event.preventDefault();
                clearTimeout(time);
                $selector.val($(this).attr('data-value')).focus();
                $list.addClass('hide');
                config.checkedCall.apply($selector, [event, config]);
                return false;
            });
        });


    }
};
