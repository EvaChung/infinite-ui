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
$.fn.IUI({
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
            var $this = $(this);
            var config = $.extend({}, defaults, options);
            var $list = $('<ul class="email-list hide"></ul>');
            var $body = $(config.container);
            var time = null;
            var listHtml = function(arr, input) {

                var _str = '';
                var _val = input.value || null;
                var _prefix = _val ? _val.split('@')[0] : false;
                var _suffix = _val ? _val.split('@')[1] : false;

                for (var i = 0, email; email < arr.length; i++) {

                    if ((_prefix && !_suffix) || _suffix && email.indexOf(_suffix) !== -1) {
                        _str += '<li class="' + config.item + '" data-value="' + _prefix + '@' + email + '">' + _prefix + '@' + email + '</li>';
                    }

                }
                return _str;
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

                config.checkedCall.apply($this, [event, config]);
            };
            var resize = function() {
                var _left = config.offsetLeft;
                var _top = config.offsetTop;
                var _width = config.offsetWidth;
                $list.css({
                    left: _left,
                    top: _top + config.offsetHeight,
                    width: _width
                });
            };

            resize();

            if (config.style === 'global') {
                $body.append($list);
                $(window).on('resize.emailSuffix', resize);
            } else {
                $this.parent().append($list);
            }

            $this.on('keyup.emailSuffix', function(event) {
                var _val = this.value;
                if (_val.charAt(0) !== '@' && _val.split('@').length === 2 && $.inArray(event.keyCode, [40, 38, 13]) === -1) {
                    var _str = listHtml(config.emails, this);

                    $list.html(_str).removeClass('hide').find('li').eq(0).addClass('checked');

                } else if ($.inArray(event.keyCode, [40, 38, 13]) === -1) {
                    $list.html('').addClass('hide');
                }
            });

            $this.on('keydown.emailSuffix', function(event) {
                var $selected = $list.find('li.checked');
                keyEvent(event.keyCode, $list, $this);
                if (event.keyCode === 13) {
                    event.preventDefault();
                    if ($selected.length) {
                        $this.val($.trim($selected.text()));
                    }
                    $list.addClass('hide');
                }
            });

            $this.on('blur.emailSuffix', function(event) {
                time = setTimeout(function() {
                    $list.addClass('hide');
                }, config.delay);
            });

            $list.on('click', config.item, function(event) {
                event.preventDefault();
                clearTimeout(time);
                $this.val($(this).attr('data-value')).focus();
                $list.addClass('hide');
                config.checkedCall.apply($this, [event, config]);
                return false;
            });
        });


    }
});
