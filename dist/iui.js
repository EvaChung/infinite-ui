(function($, window, document, undefined) {
    var layerId = 0;
    var animateEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    var transitionEnd = 'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd';
    /**
    utils：通用方法
    */

    var utils = {
        toggleClass: function(className, target) {

            var el = target instanceof $ ? target : $(target);
            var toggleClass = el.hasClass(className) ? 'removeClass' : 'addClass';
            el[toggleClass](className);
        },
        isPlaceholder: function() {
            var input = document.createElement('input');
            return 'placeholder' in input;
        },
        throttle: function(func, wait, options) {
            var context, args, result;
            var timeout = null;
            // 上次执行时间点
            var previous = 0;
            if (!options) options = {};
            // 延迟执行函数
            var later = function() {
                // 若设定了开始边界不执行选项，上次执行时间始终为0
                previous = options.leading === false ? 0 : new Date().getTime();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function() {
                var now = new Date().getTime();
                // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
                if (!previous && options.leading === false) previous = now;
                // 延迟执行时间间隔
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
                // remaining大于时间窗口wait，表示客户端系统时间被调整过
                if (remaining <= 0 || remaining > wait) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                    //如果延迟执行不存在，且没有设定结尾边界不执行选项
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        debounce: function(func, wait, immediate) {
            var timeout, args, context, timestamp, result;

            var later = function() {
                var last = new Date().getTime() - timestamp;
                if (last < wait && last > 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    }
                }
            };

            return function() {
                context = this;
                args = arguments;
                timestamp = new Date().getTime();
                var callNow = immediate && !timeout;
                if (!timeout) timeout = setTimeout(later, wait);
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };
        }
    };

    var IUI = {};


    $.fn.IUI = function() {
        var arg = arguments;
        var method = arguments[0];
        if (IUI[method]) {
            method = IUI[method];
            arg = Array.prototype.slice.call(arg, 1);
            return method.apply(this, arg);
        } else if (typeof(method) == 'object' || !method) {
            for (var name in method) {
                IUI = $.extend(IUI, method);
                method = IUI[name];
                break;
            }
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.IUI Plugin');
            return this;
        }
    };

    /**
     * pub_sub
     * 发布/订阅模式
     */
    var o = $({});

    $.extend({
        sub: function() {

            o.on.apply(o, arguments);
        },
        unsub: function() {
            o.off.apply(o, arguments);
        },
        pub: function() {
            o.trigger.apply(o, arguments);
        }
    });

    /**
     * alert 组件
     * @param {String}      title 标题                   默认为空
     * @param {String}      content 内容                 默认为空
     * @param {String}      confirmText                 确定按钮文本
     * @param {String}      cancelText                  取消按钮文本
     * @param {Boolean}     closeBtn                    是否开启关闭按钮
     * @param {Boolean}     shadow                      是否开启点击阴影关闭
     * @param {String}      animateClass                动画类，默认fadeInDown
     * @param {String}      type                        可选择 alert 或 confirm，区别在于有无【取消按钮】
     * @param {String}      status                      状态类，如 success , error , warning , info
     * @param {Function}    before                      回调函数 - 弹出前
     * @param {Function}    confirm                     回调函数 - 点击确认按钮后触发
     * @param {Function}    cancel                      回调函数 - 点击取消按钮后触发
     *
     *
     * @param $.alert({options});
     */
    $.extend({
        alert: function(options) {

            var $body = $('body');

            var defaults = {
                title: '',
                content: '',
                confirmText: '确定',
                cancelText: '取消',
                closeBtn: false,
                shadow: true,
                animateClass: 'fadeInDown',
                type: 'confirm',
                status: 'default',
                before: function() {},
                confirm: function() {},
                cancel: function() {}
            };

            var config = $.extend({}, defaults, options);

            var container = create();
            /**
             * [deferred description]
             * @type {Object}
             * @description 在回调函数中使用
             */
            var deferred = {
                showAlert: function() {
                    show(container);
                },
                hideAlert: function() {
                    hide(container);
                },
                target: container
            };

            if (!$.alertBackdrop) {
                $.alertBackdrop = $('<div class="IUI-alert-backdrop hide"></div>');
                $body.append($.alertBackdrop);
            }


            if (config.shadow) {
                $body.on('touchstart.iui-alert click.iui-alert', '.IUI-alert-container', function(event) {
                    event.preventDefault();
                    hide(container);
                });
            }

            $body.on('touchstart.iui-alert click.iui-alert', '.IUI-alert-main', function(event) {
                event.stopPropagation();
            });

            container.on('touchstart.iui-alert click.iui-alert', '.IUI-alert-confirm', function(event) {

                if (config.type === 'alert') {

                    if (config.cancel.call(this, deferred) === false) {
                        return false;
                    }

                    hide(container);

                    return false;
                }

                if (config.confirm.call(this, deferred) === false) {
                    return false;
                }

            });

            container.on('touchstart.iui-alert click.iui-alert', '.IUI-alert-cancel,.IUI-alert-close', function(event) {

                if (config.cancel.call(this, deferred) === false) {
                    return false;
                }

                hide(container);
            });

            /**
             * [show description]
             * @param  {jQuery object} target 需要显示的对象
             */
            function show(target) {
                $.alertBackdrop.removeClass('hide');
                target.removeClass('hide');
                target.find('.IUI-alert-main').addClass(config.animateClass);
            }
            /**
             * [hide description]
             * @param  {jQuery object} target 需要隐藏的对象
             */
            function hide(target) {
                $body.off('touchstart.iui-alert click.iui-alert');
                target.off('touchstart.iui-alert click.iui-alert').remove();
                $.alertBackdrop.addClass('hide');
            }
            /**
             * [create description]
             * @return {string} 拼接html
             */
            function create() {
                var isConfirm = config.type === 'confirm';

                var _closeBtn = '<span class="IUI-alert-close"></span>';

                var _confirmBtn = '<a href="javascript:;" class="IUI-alert-confirm">' + config.confirmText + '</a>';

                var _cancelBtn = '<a href="javascript:;" class="IUI-alert-cancel">' + config.cancelText + '</a>';

                var _header = '<div class="IUI-alert-header">' + (config.title || '') + (config.closeBtn ? _closeBtn : '') + '</div>';

                var _content = '<div class="IUI-alert-content">' + (config.content || '') + '</div>';

                var _footer = '<div class="IUI-alert-footer">' + _confirmBtn + (isConfirm ? _cancelBtn : '') + '</div>';

                var _main = _header + _content + _footer;

                var $container = $('<div class="IUI-alert-container hide"><div class="IUI-alert-main ' + config.status + '">' + _main + '</div></div>');

                $body[0].appendChild($container[0]);

                return $container;
            }

            if (config.before.call(this, deferred) === false) {
                return false;
            }

            show(container);

        }
    });

    /*!
     * jQuery Cookie Plugin v1.4.1
     * https://github.com/carhartl/jquery-cookie
     *
     * Copyright 2006, 2014 Klaus Hartl
     * Released under the MIT license
     *
     * @example : $.cookie('name', 'value', { expires: 7, path: '' });
     */

    $.extend({
        cookie: function(key, value, options) {

            /**
             * cookie set
             */
            if (arguments.length > 1 && String(value) !== "[object Object]") {

                options = jQuery.extend({}, options);

                if (value === null || value === undefined) {
                    options.expires = -1;
                }

                if (typeof options.expires === 'number') {
                    var days = options.expires,
                        t = options.expires = new Date();
                    t.setDate(t.getDate() + days);
                }

                value = String(value);

                return (document.cookie = [
                    encodeURIComponent(key), '=',
                    options.raw ? value : encodeURIComponent(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '',
                    options.path ? '; path=' + options.path : '',
                    options.domain ? '; domain=' + options.domain : '',
                    options.secure ? '; secure' : ''
                ].join(''));
            }

            /**
             * cookie get
             */
            options = value || {};

            var result, decode = options.raw ? function(s) {
                return s;
            } : decodeURIComponent;

            return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
        }
    });

    /**
     * loading 组件
     * @param {Boolean} 		open  		显示或隐藏 true/false
     * @param {Boolean} 		mobile 		选择 css3 或 git
     * @param {jQuery Object} 	context     loading所在的上下文，
     *
     * @example
     *
     * $.loading(true)
     *
     */
    $.extend({
        loading: function(open, mobile, context) {
            // 当参数长度大于1，则使用CSS3 loading效果
            // context是执行环境
            var arg = arguments;
            var type = arg.length > 1;
            var display = arg[0];
            var $context = context || $('body');
            var loadingStr = '<div class="IUI-loading">' + (type ? '<div class="loader-inner ball-clip-rotate"><div></div></div>' : '<img src="http://img.yi114.com/201571121314_382.gif" width="32" height="32">') + '</div>';
            if (display) {
                $context.append('<div class="IUI-loading-backdrop"></div>' + loadingStr);
            } else {
                $context.find('.IUI-loading-backdrop,.IUI-loading').remove();
            }

        }
    });

    /**
     * tip 组件
     * @param {String,jQuery Object}		obj  		被提示的对象，可传 id 或 jQuery 对象
     * @param {String}						text 		文本
     * @param {Number}						timeout 	多少毫秒后隐藏提示
     * @param {Boolean}						status 		状态，success or error
     * @param {Boolean}						position 	自定义位置，当它为 true 时， obj 将成为tip的位置参照物
     * @param {Array}						offset 		自定义位置微调值，offset[0] = x, offset[1] = y
     * @param {Function}					callback    回调函数 - hide 时触发
     *
     */
    $.extend({
        tip: function(options) {
            var param = $.extend({
                obj: "#message",
                text: '',
                timeout: 3000,
                status: true,
                position: false,
                offset: [0, 5],
                callback: null
            }, options);

            var obj = param.obj instanceof $ ? param.obj : $(param.obj);
            var status = param.status ? 'success' : 'error';
            var count = obj.data('count') || 1;
            var id = new Date().getTime();
            var objWidth = obj.outerWidth();
            var objHeight = obj.outerHeight();
            var _x = obj.offset().left;
            var _y = obj.offset().top;
            var tip;

            clearTimeout(obj.data('count'));

            if (param.position) {
                if (typeof obj.attr('data-tip') === 'undefined') {

                    $('<div class="tips" id="tip_' + id + '" style="left:' + (_x + param.offset[0]) + 'px;top:' + (_y + objHeight + param.offset[1]) + 'px"></div>').appendTo('body');
                    obj.attr('data-tip', id);

                }
                tip = $('#tip_' + obj.attr('data-tip'));

            }

            var target = param.position === 'custom' ? tip : obj;

            target.html('<span class="' + status + '">' + param.text + '</span>').removeClass('hide');

            obj.data('count', setTimeout(function() {

                target.addClass('hide');

                if (param.callback) {
                    param.callback();
                }

            }, param.timeout));

        }
    });

    /**
     * layer 组件
     * @param  {String}            container                组件的执行上下文环境，默认是body
     * @param  {Boolean}           vertical            是否垂直居中，若 false ,则由 css 控制
     * @param  {Boolean}           cache               是否缓存 ajax 页面
     * @param  {Boolean}           shadow              是否开启阴影层关闭
     * @param  {String}            confirmHandle       确认按钮Class
     * @param  {String}            closeHandle         关闭按钮Class
     * @param  {String}            offsetWidth         layer 宽度
     * @param  {String}            offsetHeight        layer 高度
     * @param  {String}            animateClass        弹出动画Class
     * @param  {String}            url                 ajax url
     * @param  {String}            dataType            ajax dataType
     * @param  {Function}          successCall         ajax success callback
     * @param  {Function}          errorCall           ajax error callback
     * @param  {Function}          confirmCall         回调函数 - 确认触发
     * @param  {Function}          cancelCall          回调函数 - 关闭触发
     *
     * @method [showLayer]  显示层
     * @method [hideLayer]  隐藏层
     * @method [resize]     修正位置
     * @method [ajaxLoad]   ajax 弹层
     *
     * @example
     *
     * var layerId = $('#layerId').IUI('layer'); // 注意：layerId必须是唯一，当页面中没有div#layerId，将自动创建，并 append 到 container 中
     * layerId.showLayer();
     * layerId.hideLayer();
     * layerId.resize();
     * layerId.ajaxLoad();
     *
     * html基本结构
     * div.layer-box.hide#layerId>div.layer-content
     *
     *
     */
    $.fn.IUI({
        layer: function(options) {
            var defaults = {
                container: 'body',
                vertical: true,
                cache: false,
                shadow: true,
                confirmHandle: '.btn-confirm',
                closeHandle: '.btn-cancel,.btn-close',
                offsetWidth: 'auto',
                offsetHeight: 'auto',
                animateClass: 'fadeInDown',
                url: $(this).attr('data-url') || false,
                dataType: $(this).attr('data-dataType') || 'html',
                content: '',
                successCall: function() {},
                errorCall: function() {},
                confirmCall: function() {},
                cancelCall: function() {}
            };

            var config = $.extend({}, defaults, options);
            var template = '<div class="layer-box hide" id="{layerName}"><div class="layer-content">' + config.content + '</div></div>';
            var $this = this.length ? this : $(template.replace('{layerName}', this.selector.replace('#', ''))).appendTo(config.container);
            var $body = $('body');
            var $container = config.container === 'body' ? $body : $(config.container);
            var $content = $this.find('.layer-content');
            var $backdrop = $('<div class="layer-backdrop"></div>');
            var closeHandle = config.closeHandle;
            var screenH = document.documentElement.clientHeight;
            var _width = Number($this.attr('data-width')) || config.offsetWidth;
            var _height = Number($this.attr('data-height')) || config.offsetHeight;

            var deferred = {
                target: $this,
                content: $content,
                setting: config,
                id: layerId++,
                showLayer: function() {
                    $this.removeClass('hide');
                    $this.after($backdrop);
                    this.resize();
                    $content.addClass(config.animateClass);
                },
                hideLayer: function() {
                    $this.addClass('hide');
                    $content.removeClass(config.animateClass);
                    $body.removeClass('layer-open').find('.layer-backdrop').remove();
                },
                resize: function() {
                    var $content = $this.find('.layer-content');
                    var outerHeight = parseInt($content.css('margin-bottom')) * 2;
                    var _contentHeight = $content.outerHeight() + outerHeight;
                    if (config.vertical && _contentHeight < screenH) {
                        $body.removeClass('layer-open');
                        $content.css({
                            'top': '50%',
                            'margin-top': -(_contentHeight / 2)
                        });
                        return false;
                    }

                    $body.addClass('layer-open');
                    $content.removeAttr('style').css({
                        'width': _width,
                        'height': _height
                    });
                },
                ajaxLoad: function() {
                    var _url = config.url || '?';
                    var _method = $this.attr('data-method') || 'GET';
                    var _dataType = config.dataType;
                    var _this = this;

                    if (config.cache && $this.data('success')) {
                        _this.showLayer();
                        return false;
                    }

                    $.loading(true, true);
                    $this.data('success', 1);
                    $.ajax({
                        url: _url,
                        type: _method,
                        dataType: config.dataType,
                        data: config.data
                    }).then(function(res) {
                        $.loading(false);
                        config.successCall.apply($this, [res, this, deferred]);
                        _this.showLayer();
                    }, function(err) {
                        $.loading(false);
                        _this.hideLayer();
                        config.errorCall.apply($this, [err, this, deferred]);
                    });
                }
            };


            $content.css({
                'width': _width,
                'height': _height

            });


            //确认事件
            $this.on('click.iui-layer', config.confirmHandle, function(event) {
                event.preventDefault();
                config.confirmCall.apply($this, [event, this, deferred]);
                return false;
            });

            // 阴影层事件
            $this.on('click.iui-layer', function(event) {
                if (!config.shadow) {
                    return false;
                }
                if ($body.find('.layer-loading').length) {
                    return false;
                }
                deferred.hideLayer();
                config.cancelCall.apply($this, [event, this, deferred]);
                return false;
            });

            //阻止事件冒泡
            $this.on('click.iui-layer', '.layer-content', function(event) {
                event.stopPropagation();
            });

            //绑定关闭事件
            $this.on('click.iui-layer', config.close, function(event) {
                deferred.hideLayer();
                config.cancelCall.apply($this, [event, this, deferred]);
                return false;
            });

            return deferred;
        }
    });

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
            var $this = $(this);
            var $window = $(window);
            var config = $.extend({}, defaults, options);
            var $target = $this.find(config.target);
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

            $this.css({
                'bottom': config.bottom
            });

            $window.on('scroll', function(event) {
                scrollPosition($target, $(window).scrollTop());
            });

            $this.on('click', config.target, function(event) {
                $("body,html").stop().animate({
                    scrollTop: 0
                }, config.delay);
                return false;
            });

        }
    });

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

    /**
     * ajaxForm 组件
     * @param {String}  	url
     * @param {String}  	method
     * @param {String}  	type
     * @param {String}  	before
     * @param {String}  	success
     * @param {String}  	error
     * @param {String}  	pending
     */
    $.fn.IUI({
        ajaxForm: function(options) {
            return this.each(function() {
                var defaults = {
                    url: $(this).attr('action'),
                    method: $(this).attr('method') || 'POST',
                    type: $(this).attr('data-type') || 'json',
                    before: function() {},
                    success: function() {},
                    error: function() {},
                    pending: function() {}

                };

                var $this = $(this);
                var $fields = $this.find('input');
                var config = $.extend({}, defaults, options);

                $this.data('deferred', config);

                $this.on('submit', function(event) {
                    event.preventDefault();
                    if ($this.hasClass('disabled')) {

                        config.pending.call($this, config);

                        return false;
                    }

                    var beforeResult = config.before.call($this, event, config);

                    if (beforeResult === false) {
                        return false;
                    }
                    $this.addClass('disabled').prop('disabled', true);
                    $.ajax({
                        url: config.url,
                        type: config.method,
                        data: $this.serialize()
                    }).then(function(res) {
                        $this.removeClass('disabled').prop('disabled', false);
                        config.success.call($this, res, config);
                    }, function(err) {
                        $this.removeClass('disabled').prop('disabled', false);
                        config.error.call($this, err, config);
                    });
                });

            });
        }
    });

    /**
     * validate 组件
     *
     * *** options ***
     *
     * @param {Boolean}                      ajaxValidate        启动ajax验证
     * @param {Element selector}             globalMessage       全局提示id，若为false，则逐项提示
     * @param {Element selector}             errorClass          验证信息 - 错误 class
     * @param {Element selector}             infoClass           验证信息 - 提示 class  若为false，则无info提示
     * @param {Element selector}             successClass        验证信息 - 成功 class  若为false，则无info提示
     * @param {Array}                        collections         验证规则配置
     * @param {Object}                       strategy            新增验证规则
     *
     *
     * collections 语法：[{验证项},{验证项},{验证项},{验证项}]
     *
     * 验证项 语法：
     *
        {
            required: 'password',                                 // 对应 input[data-required]
            context: '.form-group',                               // data-required的执行上下文
            infoMsg: '请输入您的密码，字符长度为3-16位',             // 提示信息
            matches: {                                           // 组合验证
                isNonEmpty: {                                    // 对应 strategy 中存在的验证方法
                    errMsg: '密码不能为空'                        //  验证错误的返回信息
                },
                between: {
                    errMsg: '密码长度为6-16位',
                    range:[6,16]                                //可自定义字段
                }
            }
        }

     *
     *
     * *** events ***
     *
     * $('any element').on('validate.focus',function(event,matches){});
     *
     * $('any element').on('validate.blur',function(event,matches){});
     *
     *
     *
     * *** methods ***
     *
     *  batch           详情请查阅源码部分
     *  message         详情请查阅源码部分
     *  verify          详情请查阅源码部分
     *
     */
    $.fn.IUI({
        validate: function(options) {
            /**
             *
             * GLOB_STRATEGY    默认验证策略集合
             *
             */
            var GLOB_STRATEGY = {
                isNonEmpty: function(params) {
                    var $target = this.self;
                    if ($target[0].value.length === 0) {
                        return false;
                    }
                },
                minLength: function(params) {
                    //大于
                    if (this.self[0].value.length < params.minLength) {
                        return false;
                    }
                },
                maxLength: function(params) {
                    //小于
                    if (this.self[0].value.length < params.maxLength) {
                        return errorMsg;
                    }
                },
                isMobile: function(params) {
                    //是否为手机号码
                    if (!/(^1[3|5|8][0-9]{9}$)/.test(this.self[0].value)) {
                        return false;
                    }
                },
                isEmail: function(params) {
                    //是否为邮箱
                    if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.self[0].value)) {
                        return false;
                    }
                },
                between: function(params) {
                    var $target = this.self;
                    var length = this.self[0].value.length;
                    var min = params.range[0];
                    var max = params.range[1];
                    if (length < min || length > max) {
                        return false;
                    }

                },
                //纯英文
                onlyEn: function(params) {
                    if (!/^[A-Za-z]+$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //纯中文
                onlyZh: function(params) {
                    if (!/^[\u4e00-\u9fa5]+$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //非整数
                notInt: function(params) {
                    if (/^[0-9]*$/.test(this.self[0].value)) {
                        return false;
                    }
                },
                //数字包含小数
                onlyNum: function(params) {
                    if (!/^[0-9]+([.][0-9]+){0,1}$/.test(value)) {
                        return false;
                    }
                },
                //整数
                onlyInt: function(params) {
                    if (!/^[0-9]*$/.test(value)) {
                        return false;
                    }
                },
                //至少选中一项 radio || checkbox
                isChecked: function(params) {
                    var result = void(0);
                    this.self.each(function(index, el) {
                        result = el.checked;
                        return result ? false : true;
                    });
                    return result ? void(0) : false;
                },
                //昵称
                isNickname: function(params) {
                    if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,20}$/i.test(this.self[0].value)) {
                        return false;
                    }
                }
            };
            var defaults = {
                ajaxValidate: false,
                globalMessage: false,
                errorClass: '.validate-error',
                infoClass: '.validate-info',
                successClass: '.validate-success',
                collections: null,
                strategy: GLOB_STRATEGY
            };

            var selector = this;

            function Validate(options) {
                this.container = 'body';
                this.options = $.extend(true, {}, defaults, options);
                this.$selector = selector;
                this.cache = {};
                this.init();
            }


            /**
             * init方法     初始化
             */
            Validate.prototype.init = function() {
                var _this = this;
                var collections = _this.options.collections;
                var statusArr = ['info', 'success', 'error'];
                for (var i = 0; i < collections.length; i++) {
                    _this.add(collections[i]);
                }
                _this.behavior();
                $.each(_this.cache, function(name, fields) {
                    var contextClassName = /validate-context-(info|success|error)/.exec(fields.context[0].className);
                    var initStatus;
                    if (contextClassName) {
                        initStatus = contextClassName[1];
                        fields.self.data('validateStatus', $.inArray(initStatus, statusArr));
                    }
                });
            };

            /**
             * add方法      参数修正，将传入进来的数据转化另一种格式，并插入到cache中
             * @param {Object} options      每一项需要验证的配置参数
             *
             */
            Validate.prototype.add = function(options) {
                var $dom = this.$selector.find('[data-required=' + options.required + ']');
                var $context = $dom.parents(options.context);
                $.extend(true, this.cache, (function() {
                    var item = {};
                    var target = item[options.required] = {};
                    target.matches = {};
                    target.self = $dom;
                    target.context = $context;
                    target.infoMsg = options.infoMsg || '';
                    $.extend(true, target.matches, options.matches);
                    return item;
                }()));
            };


            /**
             * behavior     行为方法，如：focus、blur、change
             */
            Validate.prototype.behavior = function() {
                var _this = this;
                var _handle = handler(this.options.collections);

                this.$selector.on('focus', _handle, function(event) {
                    var $this = $(this);
                    var _name = $this.data('required');
                    var collections = _this.cache[_name];
                    if (_this.options.infoClass) {
                        _this.message(0, collections);
                    }
                    $this.trigger('validate.focus', collections);
                });

                this.$selector.on('blur', _handle, function(event) {
                    _this.verify.call(this, _this, 'blur');
                });

                this.$selector.on('change', 'input[type=radio][data-required],input[type=checkbox][data-required]', function(event) {
                    _this.verify.call(this, _this, 'change');
                });

            };

            /**
             * verify  行为触发验证
             * @param  {Object} glob      全局对象 Validate
             * @param  {String} eventName 事件名
             */
            Validate.prototype.verify = function(glob, eventName) {
                var $this = $(this);
                var collections = glob.cache[$this.data('required')];
                var matches = collections.matches;
                var status = false;

                /**
                 * @param {String}      name        验证函数名
                 * @param {Object}      params      验证字段（自定义字段）：errMsg、range
                 */
                $.each(matches, function(name, params) {
                    var result = glob.options.strategy[name].call(collections, params);
                    status = result === void(0) ? 1 : 2;
                    $this.data('validateStatus', result);
                    glob.message(status, collections, name);

                    return status === 2 ? false : true;

                });

                $this.trigger('validate.' + eventName, collections);

                return status;
            };

            /**
             * [message description]
             * @param  {Number} status      验证状态：0 未验证状态，1 验证且通过，2 验证且不通过
             * @param  {Object} options     被转化后的验证参数
             * @param  {String} matchesName 验证函数名
             *
             */
            Validate.prototype.message = function(status, options, matchesName) {

                var _className, _status, _contextClass, _msg, $target, $msg;

                _contextClass = ['info', 'success', 'error'];

                $msg = this.options.globalMessage ? $(this.options.globalMessage) : options.context;


                if (status === 0) {
                    _className = this.options.infoClass;
                    _msg = options.infoMsg;
                } else if (status === 1) {
                    _className = this.options.successClass;
                    _msg = '';
                } else if (status === 2) {
                    _className = this.options.errorClass;
                    _msg = options.matches[matchesName].errMsg;
                } else {
                    // 后期再考虑 status === anything ...
                }

                _className = _className.replace(/\./g, ' ').slice(1);
                $msg.removeClass('validate-context-info validate-context-success validate-context-error')
                    .addClass('validate-context-' + _contextClass[status]).find('.validate-message').remove();
                $target = $('<div class="validate-message ' + _className + '" >' + _msg + '</div>');
                $msg.append($target);

            };

            /**
             * batch    批量验证
             * @param  {Boolean}            circulation       强制循环，true：将全部验证，false：其中一个验证不通过将返回false并中断循环
             * @return {Number,Boolean}                       若circulation为true，将返回boolean，否则返回状态码 1 或 2 。
             *
             */
            Validate.prototype.batch = function(circulation) {
                var _this = this;
                $.each(this.cache, function(name, target) {
                    var initStatus = target.self.data('validateStatus');
                    var _result = initStatus === void(0) ? _this.verify.call(target.self, _this, 'batch') : initStatus;

                    if (circulation) {
                        return _result === 2 ? false : true;
                    }

                    return _result;
                });
            };
            /**
             * handler 生成事件代理对象
             * @param  {Array}      collections       验证集合
             * @return {String}     事件委托目标
             */
            function handler(collections) {
                var _str = '';
                for (var i = 0; i < collections.length; i++) {
                    if (/checkbox|radio/.test(collections[i].type)) {
                        continue;
                    }
                    _str += '[data-required=' + collections[i].required + '],';
                }
                return _str.slice(0, _str.length - 1);

            }

            return new Validate(options);
        }
    });

    /**
     * tooltip 组件
     * @param {String}  target          需要绑定的元素，支持css选择器语法
     * @param {String}  animateClass    动画类
     * @param {String}  event           事件，支持符合逻辑的鼠标类事件，如 click,dblclick,hover
     * @param {String}  template        html模板
     *
     *
     * @example
     * $(context).IUI('tooltip',{options...});
     */
    $.fn.IUI({
        tooltip: function(options) {

            var defaults = {
                target: '[data-tooltip]',
                animateClass: 'fadeIn',
                event: 'hover',
                template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-body"></div></div>'
            };

            var config = $.extend(defaults, options);
            var showHandle = config.event === 'hover' ? 'mouseenter' : 'click';
            var hideHandle = config.event === 'hover' ? 'mouseleave' : 'click';

            return this.each(function(index, ele) {
                var target = config.target;
                var animateClass = config.animateClass;
                $(ele).on(showHandle, target, function() {
                    $('.tooltip').remove();
                    var $ele = $(this);
                    var _ele = this;
                    var _elePosi = _ele.getBoundingClientRect();
                    var _eleLeft = _elePosi.left;
                    var _eleTop = _elePosi.top;
                    var _eleWidth = _ele.offsetWidth;
                    var _eleHeight = _ele.offsetHeight;

                    var _tipDirec = $ele.attr('data-direction') || 'top',
                        distance = $ele.attr('data-distance') * 1 || 5,
                        title = $ele.attr('data-title');
                    var $tip = $ele.after($(config.template)).next('.tooltip').addClass(_tipDirec + ' ' + animateClass);
                    $tip.find('.tooltip-body').text(title);
                    var _tipWidth = $tip[0].offsetWidth;
                    var _tipHeight = $tip[0].offsetHeight;


                    var left, top;

                    if (_tipDirec == 'top') {
                        left = _eleLeft + (_eleWidth - _tipWidth) / 2;
                        top = _eleTop - _tipHeight - distance;
                    } else if (_tipDirec == 'right') {
                        left = _eleLeft + _eleWidth + distance;
                        top = _eleTop + (_eleHeight - _tipHeight) / 2;
                    } else if (_tipDirec == 'bottom') {
                        left = _eleLeft + (_eleWidth - _tipWidth) / 2;
                        top = _eleTop + _eleHeight + distance;
                    } else if (_tipDirec == 'left') {
                        left = _eleLeft - _tipWidth - distance;
                        top = _eleTop + (_eleHeight - _tipHeight) / 2;
                    }

                    $tip.css({
                        'top': top,
                        'left': left
                    });

                    return false;
                });


                if (config.event === 'hover') {
                    $(ele).on(hideHandle, target, function() {
                        $(this).next('.tooltip').remove();
                    });
                } else {
                    $(document).on(hideHandle, function(event) {
                        $('.tooltip').remove();
                    });
                }

            });
        }
    });

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

    /**
     * placeholder 组件
     * @param {String}      target           被侦听的目标，className、ID ...
     * @param {String}      cloneClass       针对 name=password 进行 css 微调
     *
     * @example
     * $('form').IUI({target:'.form-control'});
     */
    $.fn.IUI({
        placeholder: function(options) {
            return this.each(function() {
                var isSupport = common.isPlaceholder();
                if (isSupport) {
                    return false;
                }

                var defaults = {
                    target: '.form-control',
                    cloneClass: 'clone-password'
                };
                var $this = $(this);
                var $window = $(window);
                var config = $.extend({}, defaults, options);



                $this.find(config.target).each(function(index, el) {
                    var _placeholder = $(el).attr('placeholder');
                    var $el = $(el);
                    if (el.type === 'password') {

                        var $clone = $('<input class="' + config.target.slice(1) + '" type="text">');

                        $el.css({
                            'display': 'none'
                        });

                        $clone.addClass(config.cloneClass).val(_placeholder);
                        $el.parent().append($clone);
                    } else {
                        el.value = _placeholder;
                    }
                });

                $this.find(config.target).on({
                    focus: function(event) {
                        if ($(this).hasClass('clone-password')) {
                            $(this).css({
                                'display': 'none'
                            });
                            $(this).parent().find('input[type=password]').css({ 'display': 'block' }).focus();
                            return false;
                        }

                        if (this.value === $(this).attr('placeholder')) {
                            this.value = '';
                        }
                    },
                    blur: function(event) {
                        if ($(this).attr('type') === 'password' && !this.value) {
                            $(this).css({
                                'display': 'none'
                            });
                            $(this).parent().find('.clone-password').css({
                                'display': 'block'
                            });
                            return false;
                        }

                        if (!this.value) {
                            this.value = $(this).attr('placeholder');
                        }
                    }
                });
            });
        }
    });

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

    /**
     * typeCount 组件
     * @description     字数统计，侦听input[type=text],textarea
     * @example
     * html    div.J-typeCount>input+span.count
     * js      $('.J-typeCount').IUI('typeCount');
     */
    $.fn.IUI({
        typeCount: function(options) {
            return this.each(function() {
                $(this).on('keyup', 'input[type=text],textarea', function(event) {
                    event.preventDefault();
                    var $this = $(this);
                    var $target = $this.parent().find('span.count');
                    var initCount = parseInt($target.text().split('/')[1]);
                    var length = this.value.length;
                    if (length > initCount) {
                        $target.addClass('error');
                    } else {
                        $target.removeClass('error');
                    }
                    $target.html(length + '/' + initCount);
                });

                $(this).find('input,textarea').trigger('keyup');
            });
        }
    });

    /**
     * hideNavbar 组件
     * @description  滚动隐藏导航
     */
    $.fn.IUI({
        hideNavbar: function(options) {


            var $this = this;

            var $navbar = $(".navbar");

            var height = $navbar.outerHeight() / 2;

            var hideNavbar = this.hasClass('hide-navbar-on-scroll');

            var previousScroll, currentScroll, scrollHeight, offsetHeight, reachEnd, action, navbarHidden, direction, wait;

            if (!hideNavbar && !$navbar.length) {
                return false;
            }


            previousScroll = currentScroll = Math.abs($this.scrollTop());

            wait = common.throttle(handleScroll, 100);

            $this.on('scroll', wait);


            function handleScroll(event) {
                currentScroll = $this.scrollTop();

                scrollHeight = this.scrollHeight;

                offsetHeight = this.offsetHeight;

                navbarHidden = $navbar.hasClass('navbar-hidden');
                //direction : true => up
                direction = previousScroll <= currentScroll;

                previousScroll = currentScroll;


                if (currentScroll < height || previousScroll > currentScroll) {
                    behavior(false);
                    return false;
                }

                // //reachEnd : true => 滚动条到底部
                // reachEnd = currentScroll + offsetHeight >= scrollHeight - 20;

                behavior(direction);



                return false;
            }

            function behavior(direction) {
                var _direction = direction;

                //_direction => hide
                if (_direction) {
                    if ($navbar.hasClass('navbar-hidden')) {
                        return false;
                    }
                    $navbar.addClass('navbar-hidden');
                } else {

                    if (!$navbar.hasClass('navbar-hidden')) {
                        return false;
                    }

                    $navbar.removeClass('navbar-hidden');
                }

            }
        }
    });

    /**
     * panel 组件
     * @param {Number}		delay 		动画时间，单位毫秒
     */
    $.fn.IUI({
        panel: function(options) {
            var $this = this;
            var $body = $('body');
            var $overlay = $('<div class="panel-overlay hide"></div>');
            var $sidebar = $this.data('target') ? $($this.data('target')) : $('.panel').eq(0);
            var _direction, $target;
            var defaults = {
                delay: 300
            };

            var config = $.extend({}, defaults, options);

            if ($this.find('.panel-overlay').length) {
                $overlay = $('.panel-overlay');
            } else {
                $this.append($overlay);
            }

            if (!$this.hasClass('panel-viewport')) {
                $this = $('.panel-viewport');
            }

            $this.on('touchstart.IUI-panel click.IUI-panel', '.panel-open', function(event) {
                event.preventDefault();
                openPanel($(this));
            });

            $this.on('touchstart.IUI-panel click.IUI-panel', '.panel-overlay', function(event) {
                event.preventDefault();
                closePanel();
            });

            $this.on(transitionEnd, function(event) {
                event.preventDefault();
                if (!$this.hasClass('panel-move')) {
                    $sidebar.addClass('hide');
                }
            });

            function openPanel(handle) {
                var $handle = handle;
                _direction = 'panel-' + $handle.attr('data-direction');
                $target = $('.' + _direction);
                $overlay.removeClass('hide');
                $this.addClass(_direction + ' panel-move');
                $sidebar.removeClass('hide');
            }

            function closePanel() {
                $this.removeClass('panel-left panel-move');
                $overlay.addClass('hide');

            }
        }
    });
}(jQuery, window, document, undefined));
