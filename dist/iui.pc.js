/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	__webpack_require__(1);

	window.IUI_UTILS = __webpack_require__(11);

	var IUI = {};

	// 注入到jQuery原型对象
	$.each([__webpack_require__(12), __webpack_require__(13), __webpack_require__(14), __webpack_require__(15), __webpack_require__(16), __webpack_require__(17), __webpack_require__(18), __webpack_require__(19), __webpack_require__(20), __webpack_require__(21), __webpack_require__(22), __webpack_require__(27), __webpack_require__(33)], function (index, component) {
	    if ((typeof component === 'undefined' ? 'undefined' : _typeof(component)) === 'object' && !IUI[component]) {
	        $.extend(IUI, component);
	    }
	});

	// 注入到jQuery全局对象
	$.each([__webpack_require__(34), __webpack_require__(35), __webpack_require__(36), __webpack_require__(37), __webpack_require__(38), __webpack_require__(39), __webpack_require__(40), __webpack_require__(41), __webpack_require__(42)], function (index, component) {
	    $.extend(component);
	});

	// 调用插件
	$.fn.IUI = function () {
	    var arg = arguments;
	    var component = IUI[arguments[0]];
	    if (component) {
	        arg = Array.prototype.slice.call(arg, 1);
	        return component.apply(this, arg);
	    } else {
	        $.error('Method ' + arguments[0] + ' does not exist on jQuery.IUI Plugin');
	        return this;
	    }
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	module.exports = {
	    isIE: (document.all && !window.atob) === true,
	    ievs: function getInternetExplorerVersion() {
	        var rv = null;
	        if (navigator.appName == 'Microsoft Internet Explorer') {
	            var ua = navigator.userAgent;
	            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	            if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
	        } else if (navigator.appName == 'Netscape') {
	            var ua = navigator.userAgent;
	            var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
	            if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
	        }
	        return rv;
	    }(),
	    animateEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
	    transitionEnd: 'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd',
	    isPlaceholder: function isPlaceholder() {
	        var input = document.createElement('input');
	        return 'placeholder' in input;
	    },
	    throttle: function throttle(func, wait, options) {
	        var context, args, result;
	        var timeout = null;
	        // 上次执行时间点
	        var previous = 0;
	        if (!options) options = {};
	        // 延迟执行函数
	        var later = function later() {
	            // 若设定了开始边界不执行选项，上次执行时间始终为0
	            previous = options.leading === false ? 0 : new Date().getTime();
	            timeout = null;
	            result = func.apply(context, args);
	            if (!timeout) context = args = null;
	        };
	        return function () {
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
	    debounce: function debounce(func, wait, immediate) {
	        var timeout, args, context, timestamp, result;

	        var later = function later() {
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

	        return function () {
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
	    },
	    scrollBarWidth: function () {
	        var scrollbarWidth;
	        var $scrollDiv = $('<div/>');
	        $scrollDiv.css({
	            'width': 100,
	            'height': 100,
	            'overflow': 'scroll',
	            'position': 'absolute',
	            'top': -9999
	        });
	        $('html').append($scrollDiv);
	        scrollbarWidth = $scrollDiv[0].offsetWidth - $scrollDiv[0].clientWidth;
	        $scrollDiv.remove();
	        return scrollbarWidth;
	    }(),
	    animateEndShim: function animateEndShim(el, fn, animateDisable) {
	        if (this.isIE || animateDisable) {
	            fn();
	        } else {
	            el.on(IUI_UTILS.animateEnd, fn);
	        }
	    },
	    transitionEndShim: function transitionEndShim(el, fn, animateDisable) {
	        if (this.isIE || animateDisable) {
	            fn();
	        } else {
	            el.on(IUI_UTILS.transitionEnd, fn);
	        }
	    },
	    extend: function extend(out) {
	        out = out || {};

	        for (var i = 1; i < arguments.length; i++) {
	            var obj = arguments[i];

	            if (!obj) {
	                continue;
	            }
	            obj.hasOwnProperty = obj.hasOwnProperty || Object.prototype.hasOwnProperty;
	            //Object.prototype.hasOwnProperty.call(window, key)
	            for (var key in obj) {

	                if (obj.hasOwnProperty(key)) {
	                    if (_typeof(obj[key]) === 'object') {
	                        out[key] = deepExtend(out[key], obj[key]);
	                    } else {
	                        out[key] = obj[key];
	                    }
	                }
	            }
	        }

	        return out;
	    }
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * ajaxForm 组件
	 * @param {String}  	url
	 * @param {String}  	method
	 * @param {String}  	type
	 * @param {Function}  	before
	 * @param {Function}  	success
	 * @param {Function}  	error
	 * @param {Function}    pending
	 * @param {Function}  	always
	 */
	module.exports = {
	    ajaxForm: function ajaxForm(options) {
	        return this.each(function () {
	            var $selector = $(this);
	            var defaults = {
	                url: $selector.attr('action'),
	                method: $selector.attr('method') || 'POST',
	                type: $selector.attr('data-type') || 'json',
	                timeout: 3000,
	                data: null,
	                ajax2: false,
	                before: function before() {},
	                success: function success() {},
	                error: function error() {},
	                pending: function pending() {},
	                always: function always() {}
	            };

	            var config = $.extend({}, defaults, options);

	            $selector.data('deferred', config);

	            $selector.on('submit', function (event) {
	                event.preventDefault();
	                if ($selector.hasClass('disabled')) {

	                    config.pending.call($selector, config);

	                    return false;
	                }

	                var beforeResult = config.before.call($selector, event, config);

	                var args = {
	                    url: config.url,
	                    type: config.method,
	                    data: config.data || $selector.serialize(),
	                    timeout: config.timeout
	                };

	                // ajax2
	                if (config.ajax2) {
	                    args.data = new FormData($selector[0]);
	                    args.cache = false;
	                    args.contentType = false;
	                    args.processData = false;
	                }

	                if (beforeResult === false) {
	                    return false;
	                }
	                $selector.addClass('disabled').prop('disabled', true);
	                $.ajax(args).then(function (res) {
	                    $selector.removeClass('disabled').prop('disabled', false);
	                    config.success.call($selector, res, config);
	                }, function (err) {
	                    $selector.removeClass('disabled').prop('disabled', false);
	                    config.error.call($selector, err, config);
	                }).always(function (res) {
	                    config.always.call($selector, res, config);
	                });
	            });
	        });
	    }
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * validate 组件
	 *
	 * *** options ***
	 *
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

	module.exports = {
	    validate: function validate(options) {
	        /**
	         *
	         * GLOB_STRATEGY    默认验证策略集合
	         *
	         */
	        var GLOB_STRATEGY = {
	            isNonEmpty: function isNonEmpty(params) {
	                var $target = this.self;
	                var value = $target[0].value;
	                if ($.trim(value).length === 0) {
	                    return false;
	                }
	            },
	            minLength: function minLength(params) {
	                //大于
	                if (this.self[0].value.length < params.minLength) {
	                    return false;
	                }
	            },
	            maxLength: function maxLength(params) {
	                //小于
	                if (this.self[0].value.length > params.maxLength) {
	                    return false;
	                }
	            },
	            birthdayRange: function birthdayRange(params) {
	                //生日范围
	                var val = this.self[0].value;
	                var min = params.range[0];
	                var max = params.range[1];
	                if (val < min || val > max) {
	                    return false;
	                }
	            },
	            isBirthday: function isBirthday(params) {
	                //是否为生日
	                if (!/^[1-9]\d{3}([-|\/|\.])?((0\d)|([1-9])|(1[0-2]))\1(([0|1|2]\d)|([1-9])|3[0-1])$/.test(this.self[0].value)) {
	                    return false;
	                }
	            },
	            isMobile: function isMobile(params) {
	                //是否为手机号码
	                if (!/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.self[0].value)) {
	                    return false;
	                }
	            },
	            isEmail: function isEmail(params) {
	                //是否为邮箱
	                if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.self[0].value)) {
	                    return false;
	                }
	            },
	            between: function between(params) {
	                var length = this.self[0].value.length;
	                var min = params.range[0];
	                var max = params.range[1];
	                if (length < min || length > max) {
	                    return false;
	                }
	            },
	            //纯英文
	            onlyEn: function onlyEn(params) {
	                if (!/^[A-Za-z]+$/.test(this.self[0].value)) {
	                    return false;
	                }
	            },
	            //纯中文
	            onlyZh: function onlyZh(params) {
	                if (!/^[\u4e00-\u9fa5]+$/.test(this.self[0].value)) {
	                    return false;
	                }
	            },
	            //非整数
	            notInt: function notInt(params) {
	                if (/^[0-9]*$/.test(this.self[0].value)) {
	                    return false;
	                }
	            },
	            //数字包含小数
	            onlyNum: function onlyNum(params) {
	                if (!/^[0-9]+([.][0-9]+){0,1}$/.test(this.self[0].value)) {
	                    return false;
	                }
	            },
	            //整数
	            onlyInt: function onlyInt(params) {
	                if (!/^[0-9]*$/.test(this.self[0].value)) {
	                    return false;
	                }
	            },
	            //至少选中一项 radio || checkbox
	            isChecked: function isChecked(params) {
	                var result = void 0;
	                this.self.each(function (index, el) {
	                    result = el.checked;
	                    return result ? false : true;
	                });
	                return result ? void 0 : false;
	            },
	            //昵称
	            isNickname: function isNickname(params) {
	                if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,20}$/i.test(this.self[0].value)) {
	                    return false;
	                }
	            }
	        };
	        var defaults = {
	            globalMessage: false,
	            errorClass: '.validate-error',
	            infoClass: '.validate-info',
	            successClass: '.validate-success',
	            collections: [],
	            strategy: GLOB_STRATEGY
	        };

	        var selector = this;

	        function Validate(options) {
	            this.container = 'body';
	            this.options = $.extend(true, {}, defaults, options);
	            this.$selector = selector;
	            this.cache = {};
	            this.errors = {};
	            this.init();
	        }

	        /**
	         * init方法     初始化
	         */
	        Validate.prototype.init = function () {
	            var _this = this;
	            var statusArr = ['info', 'success', 'error'];

	            if (_this.options.collections.length === 0) {
	                return false;
	            }

	            _this.add();
	            $.each(_this.cache, function (name, fields) {
	                if (fields.context.length === 0) {
	                    return;
	                }
	                var contextClassName = /validate-context-(info|success|error)/.exec(fields.context[0].className);
	                var initStatus;
	                if (contextClassName) {
	                    initStatus = contextClassName[1];
	                    fields.self.data('validateStatus', $.inArray(initStatus, statusArr));
	                }
	            });
	        };

	        /**
	         * mapping方法      参数修正，将传入进来的数据转化另一种格式，并插入到cache中
	         * @param {Object} options      每一项需要验证的配置参数
	         *
	         */
	        Validate.prototype.mapping = function (options) {
	            var $dom = this.$selector.find('[data-required=' + options.required + ']');
	            var $context = $dom.parents(options.context).eq(0);
	            var msg;
	            if ($context.length === 0) {
	                msg = '{context:' + options.context + '} is invalid , it may prevent the triggering event';
	                if (window.console) {
	                    console.warn(msg);
	                } else {
	                    throw msg;
	                }
	            }
	            //防止重复
	            if (this.cache[options.required]) {
	                return false;
	            }

	            $.extend(true, this.cache, function () {
	                var item = {};
	                var target = item[options.required] = {};
	                target.matches = {};
	                target.self = $dom;
	                target.context = $context;
	                target.infoMsg = options.infoMsg || '';
	                target.options = options;
	                $.extend(true, target.matches, options.matches);
	                return item;
	            }());
	        };

	        /**
	         * remove方法                  传入 data-required 的值，删除对应的验证
	         * @param {String}  target     data-required值
	         *
	         */
	        Validate.prototype.remove = function (target) {
	            var _this = this;
	            var cache = _this.cache;
	            var queue, len, name, src, required, type, $target;

	            if (typeof target !== 'string') {
	                return false;
	            }

	            queue = target.split(' ');

	            len = queue.length;

	            for (name in cache) {
	                src = cache[name].self;
	                required = src.data('required');
	                type = src[0] ? src[0].type : '';
	                $target = _this.$selector.find('[data-required=' + required + ']');

	                if ($.inArray(required, queue) !== -1) {
	                    if ($.inArray(type, ['checkbox', 'file', 'radio']) !== -1) {
	                        $target.off('change.iui-validate');
	                    } else {
	                        $target.off('focus.iui-validate blur.iui-validate');
	                    }
	                    $target.data('event.iui-validate', false);
	                    delete cache[name];
	                }
	            }
	            _this.bindEvent();
	        };

	        Validate.prototype.add = function (options) {
	            var _this = this;
	            var collections = options || _this.options.collections;

	            for (var i = 0; i < collections.length; i++) {
	                var target = _this.$selector.find('[data-required="' + collections[i].required + '"]');
	                var msg = "iui-validate:cannot find element by data-required=\"" + collections[i].required + "\"";

	                if (target.length) {
	                    _this.mapping(collections[i]);
	                } else {
	                    if (window.console) {
	                        console.warn(msg);
	                    } else {
	                        throw msg;
	                    }
	                }
	            }
	            if (options) {
	                $.merge(_this.options.collections, options);
	            }
	            _this.bindEvent();
	        };

	        /**
	         * bindEvent     行为方法，如：focus、blur、change
	         */
	        Validate.prototype.bindEvent = function () {
	            var _this = this;
	            var handleArr = handler.call(this);
	            var $selector = _this.$selector;
	            var changeHandleArr = ['select-one', 'select-multiple', 'radio', 'checkbox', 'file'];

	            $.each(handleArr, function (key, value) {
	                var $target = $selector.find(value);
	                var type, requiredName;

	                if ($target[0] === void 0) {
	                    return;
	                }

	                type = $target[0].type;

	                requiredName = value.replace('[', '').replace(']', '').split('=')[1];

	                if ($target.data('event.iui-validate')) {
	                    return;
	                }

	                if ($.inArray(type, changeHandleArr) !== -1) {
	                    $target.on('change.iui-validate', { self: _this }, changeEmitter);
	                    $target.data('event.iui-validate', true);
	                    return;
	                }

	                $target.on('focus.iui-validate', { self: _this }, focusEmitter);

	                if (_this.cache[requiredName].options.unblur !== true) {
	                    $target.on('blur.iui-validate', { self: _this }, blurEmitter);
	                }

	                $target.data('event.iui-validate', true);
	            });
	        };

	        /**
	         * verify  行为触发验证
	         * @param  {Object} glob      全局对象 Validate
	         * @param  {String} eventName 事件名
	         */
	        Validate.prototype.verify = function (glob, eventName) {
	            var $this = $(this);
	            var collections = glob.cache[$this.data('required')];
	            var matches = collections.matches;
	            var status = false;
	            /**
	             * @param {String}      name        验证函数名
	             * @param {Object}      params      验证字段（自定义字段）：errMsg、range
	             */
	            $.each(matches, function (name, params) {
	                var result = glob.options.strategy[name].call(collections, params);
	                status = result === void 0 ? 1 : 2;
	                $this.data('validateStatus', status);
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
	        Validate.prototype.message = function (status, cache, matchesName) {
	            var className,
	                contextClass,
	                msg,
	                $target,
	                $msgEl,
	                errors = this.errors;

	            if (status === 0) {
	                className = this.options.infoClass;
	                msg = cache.infoMsg;
	            } else if (status === 1) {
	                className = this.options.successClass;
	                msg = '';
	            } else if (status === 2) {
	                className = this.options.errorClass;
	                msg = cache.matches[matchesName].errMsg;
	            } else {
	                // 后期再考虑 status === anything ...
	            }

	            if (status === 2) {
	                errors[cache.options.required] = msg;
	            }

	            if (!this.options.errorClass) {
	                return false;
	            }
	            contextClass = ['info', 'success', 'error'];
	            $msgEl = this.options.globalMessage ? $(this.options.globalMessage) : cache.context;
	            className = className.replace(/\./g, ' ').slice(1);
	            $msgEl.removeClass('validate-context-info validate-context-success validate-context-error').addClass('validate-context-' + contextClass[status]).find('.validate-message').remove();
	            $target = $('<div class="validate-message ' + className + '" >' + msg + '</div>');
	            $msgEl.append($target);
	        };

	        /**
	         * batch    批量验证
	         * @param  {Boolean}            circulation       强制循环，true：将全部验证，false：其中一个验证不通过将返回false并中断循环
	         * @return {Boolean}
	         *
	         */
	        Validate.prototype.batch = function (circulation) {
	            var _this = this;
	            var status = [];
	            $.each(this.cache, function (name, target) {
	                if (target.self[0].disabled) {
	                    return;
	                }
	                var result = _this.verify.call(target.self, _this, 'batch');

	                if (circulation && result === 2) {
	                    status.push(result);
	                    return false;
	                }

	                status.push(result);
	            });
	            return $.inArray(2, status) === -1 ? true : false;
	        };
	        /**
	         * handler 生成事件代理对象
	         * @return {String}     事件委托目标
	         */
	        function handler() {
	            var queue = [];
	            var collections = this.cache;
	            for (var name in collections) {
	                queue.push('[data-required=' + name + ']');
	            }
	            return queue;
	        }

	        function focusEmitter(event) {
	            var self = event.data.self;
	            var $this = $(this);
	            var _name = $this.data('required');
	            var collections = self.cache[_name];
	            if (self.options.infoClass) {
	                self.message(0, collections);
	            }
	            $this.trigger('validate.focus', collections);
	        }

	        function blurEmitter(event) {
	            var $this = $(this);
	            var _self = event.data.self;
	            var requiredName = $this.data('required');
	            var config = _self.cache[requiredName];
	            var delay = config.options.delay;
	            var _this = this;

	            if (delay) {
	                clearTimeout($this.data('delay'));
	                $this.data('delay', setTimeout(function () {
	                    _self.verify.call(_this, _self, 'blur');
	                }, delay));
	                return false;
	            }

	            _self.verify.call(this, _self, 'blur');
	        }

	        function changeEmitter(event) {
	            var _this = event.data.self;
	            _this.verify.call(this, _this, 'change');
	        }

	        return new Validate(options);
	    }
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(11);
	var scrollBarWidth = utils.scrollBarWidth;
	var $body = $('body');
	var defaults = {
	    container: 'body',
	    cache: false,
	    shadow: true,
	    confirmHandle: '.btn-confirm',
	    closeHandle: '.btn-cancel,.btn-close',
	    offsetWidth: 'auto',
	    offsetHeight: 'auto',
	    url: $(undefined).attr('data-url') || false,
	    dataType: $(undefined).attr('data-dataType') || 'html',
	    data: '',
	    method: 'GET',
	    content: '',
	    animateDisable: false,
	    zIndex: 0,
	    trigger: 'click',
	    dynamic: false,
	    showCall: function showCall() {},
	    hideCall: function hideCall() {},
	    successCall: function successCall() {},
	    errorCall: function errorCall() {},
	    confirmCall: function confirmCall() {},
	    cancelCall: function cancelCall() {}
	};

	function Layer(config, selector) {
	    this.$selector = selector;
	    this.config = $.extend(defaults, config);
	    //创建遮罩层
	    this.$backdrop = $('<div class="layer-backdrop"></div>');
	    this.init();
	}

	Layer.prototype.init = function () {
	    var _this = this;
	    var config = _this.config;
	    var template = '<div class="layer-box hide" id="{{layerName}}" tabindex="1"><div class="layer-content">' + config.content + '</div></div>';
	    var $selector = this.$selector = _this.$selector.length ? _this.$selector : $(template.replace('{{layerName}}', _this.$selector.selector.replace('#', '')));
	    var $content = this.$content = $selector.find('.layer-content');
	    var layerWidth = Number($selector.attr('data-width')) || config.offsetWidth;
	    var layerHeight = Number($selector.attr('data-height')) || config.offsetHeight;

	    if (!config.dynamic) {
	        $selector.appendTo(config.container);
	    }

	    if (config.zIndex) {
	        _this.$backdrop.css('z-index', config.zIndex);
	        $selector.css('z-index', config.zIndex + 10);
	    }

	    $content.css({
	        width: layerWidth,
	        height: layerHeight
	    });

	    $selector.data('layer', _this);
	};

	Layer.prototype.ajaxLoad = function () {
	    var _this = this;
	    var config = _this.config;
	    var $selector = _this.$selector;
	    var requestUrl = config.url || '?';
	    var method = ($selector.attr('data-method') || config.method).toUpperCase();
	    var dataType = config.dataType;

	    if (config.cache && $selector.data('success')) {
	        _this.showLayer();
	        return false;
	    }

	    $.loading(true, true);
	    $selector.data('success', 1);

	    $.ajax({
	        url: requestUrl,
	        type: method,
	        dataType: dataType,
	        data: config.data
	    }).then(function (res) {
	        $.loading(false);
	        config.successCall.apply($selector, [res, this, _this]);
	        _this.showLayer();
	    }, function (err) {
	        $.loading(false);
	        _this.hideLayer();
	        config.errorCall.apply($selector, [err, this, _this]);
	    });

	    return _this;
	};

	Layer.prototype.event = function () {
	    var _this = this;
	    var config = _this.config;
	    var $selector = _this.$selector;

	    //确认事件
	    $selector.on(config.trigger + '.iui-layer', config.confirmHandle, function (event) {
	        event.preventDefault();
	        config.confirmCall.apply($selector, [event, _this]);
	        return false;
	    });

	    // 阴影层事件
	    $selector.on(config.trigger + '.iui-layer', function (event) {
	        if ($(event.target).is($selector)) {

	            if (!config.shadow) {
	                return false;
	            }
	            if ($body.find('.layer-loading').length) {
	                return false;
	            }
	            _this.hideLayer();
	            config.cancelCall.apply($selector, [event, _this]);
	        }
	    });

	    //绑定关闭事件
	    $selector.on(config.trigger + '.iui-layer', config.closeHandle, function (event) {
	        _this.hideLayer();
	        config.cancelCall.apply($selector, [event, _this]);
	        return false;
	    });
	};

	Layer.prototype.showLayer = function (cutto) {
	    var _this = this;
	    var config = _this.config;
	    var $backdrop = _this.$backdrop;
	    var $body = $('body');
	    var screenH = document.documentElement.clientHeight;
	    var gtIE10 = document.body.style.msTouchAction === undefined;
	    var isCutto = cutto;
	    var Q = $.Deferred();
	    _this.$selector.appendTo(config.container);
	    _this.event();
	    // 当body高度大于可视高度，修正滚动条跳动
	    // >=ie10的滚动条不需要做此修正,tmd :(
	    if ($body.height() > screenH & gtIE10) {
	        $body.data('initstyle', $body.attr('style') || '');
	        $body.css({
	            'border-right': scrollBarWidth + 'px transparent solid',
	            'overflow': 'hidden'
	        });
	    }
	    //显示层
	    _this.$selector.removeClass('hide').focus();
	    _this.$content.off(utils.animateEnd);

	    if (isCutto) {
	        _this.$content.removeClass('layer-opening');
	    } else {
	        //插入-遮罩-dom
	        _this.$selector.after($backdrop);
	        //插入-遮罩-显示动画
	        $backdrop.attr('style', 'opacity: 1;visibility: visible;');
	    }

	    //插入-弹层-css3显示动画
	    _this.$content.addClass('layer-opening');

	    utils.animateEndShim(_this.$content, function (event) {
	        _this.$content.removeClass('layer-opening');
	        //触发show事件
	        _this.$selector.trigger('layer.show', [_this]);
	        //触发showCall回调
	        config.showCall.apply(_this.$selector, [_this]);

	        Q.resolve();
	    }, config.animateDisable);

	    // 绑定 esc 键盘控制
	    $(document).on('keyup.iui-layer', function (event) {
	        if (event.keyCode === 27) {
	            _this.$selector.trigger('click.iui-layer', config.closeHandle);
	        }
	    });

	    //返回Layer对象
	    return Q;
	};

	Layer.prototype.hideLayer = function (cutto) {
	    var _this = this;
	    var config = _this.config;
	    var isCutto = cutto;
	    var Q = $.Deferred();
	    //插入-弹层-隐藏动画
	    _this.$content.off(utils.animateEnd);
	    _this.$content.addClass('layer-closing');
	    if (!isCutto) {
	        _this.$backdrop.removeAttr('style');
	        utils.transitionEndShim(_this.$backdrop, function () {
	            _this.$backdrop.remove();
	        }, config.animateDisable);
	    }
	    utils.animateEndShim(_this.$content, function (event) {
	        //插入-遮罩-隐藏动画
	        _this.$content.removeClass('layer-closing');
	        //隐藏弹层
	        _this.$selector.addClass('hide');

	        //触发hide事件
	        _this.$selector.trigger('layer.hide', [this]);
	        //触发hideCall回调
	        config.hideCall.apply(_this.$selector, [_this]);
	        _this.$selector.remove();
	        Q.resolve();
	    }, config.animateDisable);

	    //恢复 body 滚动条
	    $body.attr('style', $body.data('initstyle'));

	    // 绑定 esc 键盘控制
	    $(document).off('keyup.iui-layer');
	    return Q;
	};

	Layer.prototype.cutTo = function (nextId, currentId) {
	    if (!$(nextId).length) {
	        console.warn('Can\'t find layer \'' + nextId + '\',the config.dynamic must set false');
	        return false;
	    }
	    var nextLayer = $(nextId).data('layer');
	    var currentLayer = (currentId ? $(currentId) : this.$selector).data('layer');

	    if (nextLayer.$backdrop.width() === 0) {
	        nextLayer.$backdrop = currentLayer.$backdrop;
	    }
	    currentLayer.hideLayer(true).done(function () {
	        nextLayer.showLayer(true);
	    });
	};

	Layer.prototype.destroy = function () {
	    var _this = this;
	    var $selector = _this.$selector;
	    //确认事件
	    $selector.remove();
	};

	module.exports = {
	    layer: function layer(config) {
	        return new Layer(config, this);
	    }
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

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
	    el.addClass('active').css('opacity', 0).addClass('animate');
	    setTimeout(function () {
	        el.addClass(config.animateAfter);
	    }, 100);
	}
	module.exports = {
	    tabs: function tabs(options) {
	        return this.each(function () {
	            var defaults = {
	                event: 'click',
	                isCache: true,
	                ajaxSetup: null
	            };

	            var $selector = $(this);
	            //避免与tabs嵌套tabs时冲突
	            var config = $.extend({}, defaults, options);

	            $selector.on(config.event + '.iui-tabs', '.tabs-item', function (event) {
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
	                    }, config.ajaxSetup)).then(function (res) {
	                        $this.data('loaded', true);
	                        $target.trigger('tabsAjaxSuccess', [res]);
	                    }, function (err) {
	                        console.log(err);
	                    });
	                }

	                show.call($target, config);
	            });
	        });
	    }
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * placeholder 组件
	 * @param {color}     color           placeholder color
	 * @param {String}    zIndex          placeholder z-index 需高于input
	 * @param {Number}    top             placeholder 相对input父元素定位top值
	 * @param {Number}    left            placeholder 相对input父元素定位top值
	 *
	 * @example
	 * $('body').IUI('placeholder',{color:'#999',zIndex:1});
	 */
	function Placeholder(options) {
	    if ('placeholder' in document.createElement('input')) {
	        return;
	    }

	    var defaults = {
	        color: '#999', //placeholder color
	        zIndex: 1, //针对position:absolute的input元素，label覆盖在input之上
	        top: 0, //placeholder相对父元素绝对定位
	        left: 0 //placeholder相对父元素绝对定位
	    },
	        param = $.extend({}, defaults, options || {}),
	        $eles = $(this).find('input[type="text"],input[type="password"],input[type="tel"],input[type="email"]');

	    return $eles.each(function (i, n) {
	        var $ele = $(n),
	            ele = n,
	            //ele供原生事件onpropertychange调用
	        placeholder = $ele.attr('placeholder');

	        var $elel = $('<label></label>').css({
	            position: 'absolute',
	            top: param.top,
	            left: param.left,
	            color: param.color,
	            zIndex: param.zIndex,
	            height: 0,
	            lineHeight: $ele.css('height'),
	            fontSize: $ele.css('fontSize'),
	            paddingLeft: $ele.css('textIndent') ? $ele.css('textIndent') : $ele.css('paddingLeft'),
	            background: 'none',
	            cursor: 'text'

	        }).text(placeholder).insertBefore($ele);

	        $ele.parent().css({ 'position': 'relative' });

	        if ($ele.val()) {
	            $elel.hide();
	        }

	        //事件绑定
	        $elel.on({
	            click: function click() {
	                $elel.hide();
	                $ele.focus();
	            }
	        });
	        $ele.on({
	            focus: function focus() {
	                $elel.hide();
	            },
	            blur: function blur() {
	                if (!$ele.val()) {
	                    $elel.show();
	                }
	            },
	            input: function input() {
	                if ($ele.val()) {
	                    $elel.hide();
	                } else {
	                    $elel.show();
	                }
	            }
	        });
	        //IE6-8不支持input事件，另行绑定
	        ele.onpropertychange = function (event) {
	            event = event || window.event;
	            if (event.propertyName === 'value') {
	                var $this = $(this);
	                if ($this.val()) {
	                    $(this).prev('label').hide();
	                } else {
	                    $(this).prev('label').show();
	                }
	            }
	        };
	    });
	}

	module.exports = {
	    placeholder: Placeholder
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

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
	    emailSuffix: function emailSuffix(options) {
	        return this.each(function () {
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
	                checkedCall: function checkedCall() {}
	            };
	            var $selector = $(this);
	            var config = $.extend({}, defaults, options);
	            var $list = $('<ul class="email-list hide"></ul>');
	            var $body = $(config.container);
	            var time = null;
	            var listHtml = function listHtml(arr, input) {

	                var str = '';
	                var val = input.value || null;
	                var prefix = val ? val.split('@')[0] : false;
	                var suffix = val ? val.split('@')[1] : false;
	                var email;
	                for (var i = 0; i < arr.length; i++) {
	                    email = arr[i];
	                    if (prefix && !suffix || suffix && email.indexOf(suffix) !== -1) {
	                        str += '<li class="' + config.item + '" data-value="' + prefix + '@' + email + '">' + prefix + '@' + email + '</li>';
	                    }
	                }
	                return str;
	            };

	            var keyEvent = function keyEvent(keyCode, target, obj) {
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
	            var resize = function resize() {
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
	                $selector.parent().css('position', 'relative').append($list);
	            }

	            $selector.on('keyup.emailSuffix', function (event) {
	                var val = this.value;
	                if (val.charAt(0) !== '@' && val.split('@').length === 2 && $.inArray(event.keyCode, [40, 38, 13]) === -1) {
	                    var str = listHtml(config.emails, this);
	                    $list.html(str).removeClass('hide').find('li').eq(0).addClass('checked');
	                } else if ($.inArray(event.keyCode, [40, 38, 13]) === -1) {
	                    $list.html('').addClass('hide');
	                }
	            });

	            $selector.on('keydown.emailSuffix', function (event) {
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

	            $selector.on('blur.emailSuffix', function (event) {
	                time = setTimeout(function () {
	                    $list.addClass('hide');
	                }, config.delay);
	            });

	            $list.on('click', '.' + config.item, function (event) {
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

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * typeCount 组件
	 * @description     字数统计，侦听input[type=text],textarea
	 * @example
	 * html    div.J-typeCount>input+span.count
	 * js      $('.J-typeCount').IUI('typeCount');
	 */
	module.exports = {
	    typeCount: function typeCount(options) {
	        return this.each(function () {
	            var $this = $(this);
	            var config = $.extend({
	                separator: '/'
	            }, options);

	            $this.on('keyup', 'input[type=text],textarea', function (event) {
	                var _$this = $(this);
	                var $target = _$this.parent().find('span.count');
	                var initCount = parseInt($target.text().split(config.separator)[1]);
	                var length = this.value.length;
	                if (length > initCount) {
	                    $target.addClass('error');
	                } else {
	                    $target.removeClass('error');
	                }
	                $target.html(length + config.separator + initCount);
	            });

	            $this.on('input propertychange', 'input[type=text],textarea', function (event) {
	                $(this).trigger('keyup');
	            });

	            $this.find('input,textarea').trigger('keyup');
	        });
	    }
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * pageSize : 当前显示条数
	 * total : 总计数值
	 *
	 */

	var tpl_pagesize = '每页<input type="text" class="pagesize" role="text" maxlength="2"  value="{{pageSize}}" >';

	var tpl_goto = '跳转至<input type="text" class="goto"  role="text" maxlength="2" data-maxpage="{{maxpage}}">';

	var template = '<div class="pagination-wrap clearfix">共{{total}}条&nbsp;&nbsp;{{size}}{{goto}}<ul class="pagination">{{queue}}</ul></div>';

	var URLToArray = function URLToArray(url) {
	    var request = {},
	        pairs = url.substring(url.indexOf('?') + 1).split('&');
	    for (var i = 0; i < pairs.length; i++) {
	        var pair = pairs[i].split('=');
	        request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	    }
	    return request;
	};

	var ArrayToURL = function ArrayToURL(array) {
	    var pairs = [];
	    for (var key in array) {
	        if (array.hasOwnProperty(key)) pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(array[key]));
	    }return pairs.join('&');
	};

	var defaults = {
	    url: './demo.json',
	    param: {
	        curPage: 1,
	        pageSize: 20
	    },
	    type: 'POST',
	    maxQueue: 5,
	    goTo: true,
	    pageSize: true,
	    cache: false, //是否开启缓存
	    static: false,
	    click: function click(pagination) {
	        var $this = $(this);
	        var _this = pagination;
	        var response = _this.response;
	        var paramsArr = URLToArray(_this.config.param);

	        if ($this.hasClass('prev')) {
	            paramsArr.curPage = response.curPage - 1;
	            $('[name="curPage"]').val(paramsArr.curPage);
	        } else if ($this.hasClass('next')) {
	            paramsArr.curPage = response.curPage + 1;
	            $('[name="curPage"]').val(paramsArr.curPage);
	        } else if ($this.hasClass('pagesize')) {
	            $('[name="pageSize"]').val(this.value);
	            paramsArr.pageSize = this.value;
	        } else if ($this.hasClass('goto')) {
	            var pageCount = this.value;
	            if (parseInt(pageCount) > response.pageCount) {
	                pageCount = response.pageCount;
	            }
	            $('[name="curPage"]').val(pageCount);
	            paramsArr.curPage = pageCount;
	        } else {

	            paramsArr.curPage = $this.data('page');
	            $('[name="curPage"]').val(paramsArr.curPage);
	        }
	        return ArrayToURL(paramsArr);
	    }

	};

	function Pagination(config, selector) {
	    this.staticData = [];
	    this.config = $.extend({}, defaults, config);
	    this.$selector = selector;
	    this.response = null;
	    this._cache = {};
	    this._sortInitData = null;
	    this.init();
	}

	Pagination.prototype.init = function () {
	    var _this = this;

	    this.$selector.on('click', '.prev', function (event) {
	        if ($(this).hasClass('disabled')) {
	            return false;
	        }
	        _this.trigger(this);
	        return false;
	    });

	    this.$selector.on('click', '.next', function (event) {
	        if ($(this).hasClass('disabled')) {
	            return false;
	        }
	        _this.trigger(this);
	        return false;
	    });

	    this.$selector.on('click', 'li[data-page]', function (event) {
	        event.preventDefault();
	        if ($(this).hasClass('active')) {
	            return false;
	        }
	        _this.trigger(this);
	        return false;
	    });

	    this.$selector.on('keyup', '.pagesize,.goto', function (event) {
	        if (event.keyCode === 13) {
	            _this.trigger(this);
	        }
	    });
	};

	Pagination.prototype.trigger = function (emitter) {
	    var _this = this;
	    var $emitter = $(emitter);
	    var params = _this.config.click.call(emitter, _this);

	    if (!_this.config.static) {
	        _this.get(params);
	    } else {
	        _this.getStatic(params, _this.staticData);
	    }
	};

	Pagination.prototype.get = function (param, refresh) {
	    var _this = this;
	    var config = _this.config;
	    var data = param ? config.param = param : config.param;

	    if (config.cache && _this._cache[param] && !refresh) {
	        _this.$selector.trigger('get.success', [_this._cache[param], _this]);
	        return false;
	    }

	    $.ajax({
	        url: config.url,
	        type: config.type,
	        dataType: 'json',
	        data: data
	    }).then(function (res) {
	        if (config.cache) {
	            _this._cache[param] = res;
	        }
	        _this.$selector.trigger('get.success', [res, _this]);
	    }, function (err) {
	        _this.$selector.trigger('get.error', [err, _this]);
	    });
	};

	Pagination.prototype.render = function (response) {
	    var result = '';
	    var tpl = template;
	    var data = this.response = response;
	    var config = this.config;

	    tpl = tpl.replace('{{size}}', config.pageSize ? tpl_pagesize : '').replace('{{goto}}', config.goTo ? tpl_goto : '');

	    $.each(data, function (name, value) {
	        var reg = new RegExp('\{\{' + name + '\}\}', 'gmi');
	        tpl = tpl.replace(reg, value);
	    });

	    var queueItem = '';

	    var queuePrev = '<li class="prev ' + (data.curPage === 1 ? 'disabled' : '') + '"><a href="javascript:;">«</a></li>';

	    var queueNext = '<li class="next ' + (data.pageCount === 0 || data.curPage === data.pageCount ? 'disabled' : '') + '"><a href="javascript:;">»</a></li>';

	    var queueLength = data.pageCount > config.maxQueue ? config.maxQueue : data.pageCount;

	    var step = Math.ceil(config.maxQueue / 2);

	    var i = 1;

	    if (data.pageCount > config.maxQueue && data.curPage > step) {
	        i = data.curPage - (step - 1);
	        queueLength = data.curPage + step > data.pageCount ? data.pageCount : data.curPage + step - 1;

	        //当页数接近末尾，且小于默认尺寸
	        if (queueLength - (i - 1) < config.maxQueue) {
	            i = data.pageCount - (config.maxQueue - 1);
	        }
	    }

	    for (; i <= queueLength; i++) {
	        queueItem += '<li ' + (data.curPage === i ? 'class="active"' : '') + ' data-page="' + i + '"><a href="javascript:;">' + i + '</a></li>';
	    }

	    var queueHtml = queuePrev + queueItem + queueNext;

	    tpl = tpl.replace('{{queue}}', queueHtml);

	    this.$selector.html(tpl);
	};

	module.exports = {
	    pagination: function pagination(config) {
	        return new Pagination(config, this);
	    }
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	/**
	* tokenize 组件
	* @param  {boolean} readOnly 为true的时候，其他所有option失效
	* @param  {number} limitCount 限制选择个数，默认 Infinity
	* @param  {string} input 搜索的 input
	* @param  {array} data 默认 []
	* @param  {function} overLimitCount 选择超过限制个数触发
	* @return {function}   beforeChoice 选择前回调函数
	* @return {function}   choiceCallback 选择token回调
	* @return {function}   removeCallback 移除token回调
	*/
	var settings = {
	    readOnly: false,
	    limitCount: Infinity,
	    input: '<input type="text" maxLength="20">',
	    data: [],
	    overLimitCount: function overLimitCount() {},
	    beforeChoice: function beforeChoice() {},
	    choice: function choice() {},
	    remove: function remove() {}
	};

	var KEY_CODE = {
	    left: 37,
	    top: 38,
	    right: 39,
	    bottom: 40,
	    enter: 13,
	    back: 9
	};

	var template = {
	    spanTemplate: ['<span class="selected-item">', '<span>{{text}}</span><span value="{{value}}" class="tokenize-close" remove="{{remove}}">×</span>', '</span>'].join(''),
	    optionTemplate: '<option selected="selected" value="{value}">{value}</option>',
	    liTemplate: '<li class="hidden tokenize-level-item" value="{value}">{value}</li>',
	    selectTp: '<div class="tokenize-select"> <div class="tokenize-choiced"></div><span class="tokenize-inp">{{input}}</span> </div>'
	};

	// 选择
	function setToken($$, _config, _this) {
	    var $this = $(this);
	    var value = $this.attr('value');
	    var text = $this.text();
	    var remove = $this.attr('remove');
	    var type = 'append';
	    var $choiced = $$.find('.tokenize-choiced');

	    // 已经选择的不能选择
	    if ($this.hasClass('tokenize-selected') || $this.hasClass('disabled')) {
	        if (_config.limitCount === 1) {
	            $$.find('.tokenize-main').addClass('hide');
	        }
	        return;
	    }

	    if (_config.beforeChoice.call(_this, $$) === false) {
	        return;
	    }

	    if (_config.limitCount === 1) {
	        type = 'html';
	        $this.closest('ul').find('li.tokenize-selected').removeClass('tokenize-selected');
	        $choiced.addClass('has-token');
	        $this.addClass('active');
	    }
	    $this.addClass('tokenize-selected');
	    $choiced[type](template.spanTemplate.replace('{{value}}', value).replace('{{text}}', text).replace('{{remove}}', remove));

	    $$.find('select option[value="' + value + '"]').attr('selected', 'selected');

	    _config.choice.call(_this, $$);
	    $$.find('.tokenize-main').addClass('hide');
	}

	$(document).on('click.tokenize', function (event) {
	    $('.tokenize-main').addClass('hide');
	});

	function Tokenize(options, el) {
	    this.$el = $(el);
	    this.$select = this.$el.find('select');
	    this.config = options;
	    this.init();
	}

	Tokenize.prototype = {
	    init: function init() {
	        this.comcatSelect();
	        this.renderSelect();
	        this.setEvent();

	        // 初始选中
	        this.$el.find('li[uled]').trigger('click');
	    },

	    // json 拼接 select
	    comcatSelect: function comcatSelect() {
	        var _this = this;
	        var config = _this.config;
	        var data = config.data;
	        var str = '';
	        var isClose = true;
	        var groupName = '';
	        var optionClass = '';

	        if (data && data.length) {
	            $.each(data, function (index, val) {
	                if (!val.group || val.group === groupName) {
	                    str += '<option remove="' + val.remove + '" class="tokenize-option ' + optionClass + ' ' + val.disabled + '" value="' + val.value + '" ' + val.selected + '>' + val.text + '</option>';
	                } else {
	                    if (isClose) {
	                        isClose = false;
	                        optionClass = 'group-option';
	                    } else {
	                        str += '</optgroup>';
	                    }
	                    str += '<optgroup label="' + val.text + '">';
	                    groupName = val.group;
	                }

	                // if (!val.group) {
	                //     str += '<option remove="'+val.remove+'" class="tokenize-option '+optionClass +' ' +val.disabled+'" value="'+val.value+'" '+val.selected+'>'+val.text+'</option>';
	                // }else{
	                //     if (isClose) {
	                //         str += '<optgroup label="'+val.text+'">';
	                //         optionClass = 'group-option';
	                //         isClose = false;
	                //     }else{
	                //         str += '</optgroup>';
	                //         str += '<optgroup label="'+val.text+'">';
	                //     }
	                // }
	            });
	            if (!isClose) {
	                str += '</optgroup>';
	            }
	            _this.$select.append(str);
	        }
	    },

	    // 渲染 select 为 tokenize
	    renderSelect: function renderSelect() {
	        var _config = this.config;
	        var $$ = this.$el;
	        var $select = this.$select;
	        var htmlStr = '<div class="tokenize-main hide">' + $select.prop('outerHTML') + '</div>';

	        htmlStr = (htmlStr + '').replace(/<optgroup label="([^"]*)">/g, '<li class="tokenize-group">$1</li>');
	        htmlStr = htmlStr.replace(/<\/optgroup>/g, '');
	        htmlStr = htmlStr.replace(/select/gi, 'ul').replace(/<option/gi, '<li').replace(/option>/gi, 'li>');

	        // 自定义搜索框
	        $$.append(template.selectTp.replace('{{input}}', this.config.input));
	        // 给 li 添加类名
	        $$.append(htmlStr).find('ul').removeClass('hide').find('li').not('.tokenize-group').addClass('tokenize-option');

	        // 移动搜索框位置，并且虚拟placeholder
	        if (_config.limitCount === 1) {
	            $$.find('.tokenize-main').prepend($$.find('input').parent());
	            $('<div class="ph"></div>').insertAfter($$.find('.tokenize-choiced')).text($select.attr('placeholder'));
	        }
	    },

	    // 交互事件
	    setEvent: function setEvent() {
	        var _this = this;
	        var _config = _this.config;
	        var $$ = _this.$el;
	        var $select = _this.$select;

	        $$.addClass('tokenize');

	        if (_config.limitCount === 1) {
	            $$.addClass('tokenize-single');
	        }

	        $$.on('click', function (event) {
	            event.stopPropagation();
	        });

	        // 选择
	        $$.on('click', '.tokenize-option', function (event) {
	            // 多选
	            if (_config.limitCount !== 1) {
	                if ($$.find('li.tokenize-selected').length >= _config.limitCount) {
	                    _config.overLimitCount.call(_this, $$);
	                    return;
	                }
	            }

	            setToken.call(this, $$, _config, _this);
	        });

	        if (this.config.readOnly) {
	            return;
	        }

	        // 聚焦显示下拉
	        $$.on('click', '.tokenize-select', function (event) {
	            event.stopPropagation();
	            $('.tokenize-main').addClass('hide');

	            var $lis = $$.find('.tokenize-main').removeClass('hide').find('.tokenize-option:not(.disabled)').removeClass('active');
	            var $lisTemp;

	            if (_config.limitCount !== 1) {
	                $lis = $lis.not('.tokenize-selected');
	            } else {
	                $lisTemp = $lis.filter('[value="' + $select.val() + '"]');
	                $lis = $lisTemp.length ? $lisTemp : $lis;
	            }

	            $lis.eq(0).addClass('active');
	            $$.find('input').focus();
	        });

	        // 去除
	        $$.on('click', '.tokenize-close', function (event) {
	            event.stopPropagation();
	            var $this = $(this);
	            var value = $this.attr('value');
	            var selector = 'li[value="' + value + '"],option[value="' + value + '"]';

	            $$.find(selector).removeAttr('selected').removeClass('tokenize-selected');
	            $this.parent().remove();

	            // 单选清除已选标志
	            $$.find('.tokenize-choiced').removeClass('has-token');

	            _config.remove.call(_this, $$);
	        });

	        // 搜索
	        $$.on('keyup.tokenize-search', 'input', function (event) {
	            if (event.keyCode === KEY_CODE.enter) {
	                return;
	            }

	            clearTimeout(window.tokenizeSearchTo);
	            var txt = $(this).val();

	            window.tokenizeSearchTo = setTimeout(function () {
	                $$.find('.tokenize-option').each(function (index, el) {
	                    var $el = $(el);

	                    if ($el.text().indexOf(txt) > -1) {
	                        $el.removeClass('hide');
	                    } else {
	                        $el.addClass('hide');
	                    }
	                });

	                // 如果是多选，则还需要隐藏没有符合项的标题
	                $$.find('.tokenize-group').each(function (index, el) {
	                    var $el = $(el);

	                    if ($el.nextUntil('.tokenize-group').filter(':visible').length) {
	                        $el.removeClass('hide');
	                    } else {
	                        $el.addClass('hide');
	                    }
	                });
	            }, 0);
	        });

	        // 按下enter键设置token
	        $$.on('keyup.tokenize-set', function (event) {
	            var keyCode = event.keyCode;
	            var KC = KEY_CODE;
	            if (keyCode === KC.enter) {
	                setToken.call($$.find('.active')[0], $$, _config, _this);
	            }
	        });

	        // 按下上下键切换token
	        $$.on('keyup.tokenize-turn', function (event) {
	            var keyCode = event.keyCode;
	            var KC = KEY_CODE;
	            var $lis;
	            var direc = 1;
	            var $curLi;
	            var index;
	            var $ul;
	            var st = 0;

	            if (keyCode === KC.bottom || keyCode === KC.top) {
	                $lis = $$.find('li.tokenize-option:not(.disabled):visible');

	                if (_config.limitCount !== 1) {
	                    $lis = $lis.not('.tokenize-selected');
	                }

	                if (keyCode === KC.top) {
	                    direc = -1;
	                }

	                $curLi = $lis.filter('.active').removeClass('active');
	                index = $lis.index($curLi) + direc;

	                if (direc === 1 && index >= $lis.length) {
	                    index--;
	                } else if (direc === -1 && index <= 0) {
	                    index = 0;
	                }

	                $lis.eq(index).addClass('active');
	                $ul = $curLi.closest('ul');

	                if (direc === 1 && index < $lis.length) {
	                    $ul.scrollTop($ul.scrollTop() + $curLi.height());
	                } else if (direc === -1 && index >= 0) {
	                    st = $ul.scrollTop() - $curLi.height();
	                    $ul.scrollTop(st < 0 ? 0 : st);
	                }
	            }
	        });

	        //鼠标样式
	        $$.on('mouseenter.tokenize', '.tokenize-option', function (event) {
	            var $this = $(this);

	            if ($this.hasClass('disabled')) {
	                return false;
	            }

	            if (_config.limitCount !== 1 && $this.hasClass('tokenize-selected')) {
	                return;
	            }

	            $$.find('.tokenize-option.active').removeClass('active');
	            $this.addClass('active');
	        });

	        // 显示下拉的时候禁止页面滚动
	        $$.find('.tokenize-main').hover(function () {
	            var $body = $('body');
	            var top = $body.scrollTop();
	            $(document).on('scroll.tokenize', function (event) {
	                $body.scrollTop(top);
	            });
	        }, function () {
	            $(document).off('scroll.tokenize');
	        });
	    }
	};

	$.fn.tokenize = function (options) {
	    this.each(function (index, el) {
	        new Tokenize($.extend(true, {}, settings, options), el);
	    });
	};

	module.exports = {
	    tokenize: function tokenize(config) {
	        this.tokenize(config);
	    }
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	/**
	 * intercept 组件
	 * @param  {boolean} fixedWidth 为true的时候，支持多个选框，默认default
	 * @param  {number} rangeWidth 选框宽度，默认80
	 * @param  {number} rangeHeight 选框高度，默认80
	 * @param  {number} maxRangeWidth 选框最大宽度
	 * @param  {number} minRangeWidth 选框最小宽度
	 * @param  {number} maxRangeHeight 选框最大高度
	 * @return {number}   minRangeHeight 选框最小高度
	 * @return {object}   $preview 预览目标元素
	 * @return {function}   intercept 选择后回调
	 */
	var settings = {
	    fixedWidth: false,
	    rangeWidth: 80,
	    rangeHeight: 80,
	    maxRangeWidth: Infinity,
	    minRangeWidth: 40,
	    maxRangeHeight: Infinity,
	    minRangeHeight: 40,
	    $preview: null,
	    intercept: function intercept() {}
	};

	var control = {
	    wrapWidth: 0, // 容易宽度
	    wrapHeight: 0, // 容易高度
	    // 选择框模板
	    rangeTemplate: '<div class="intercept-filter"><div class="intercept-bg bg-top"></div>' + '<div class="intercept-bg bg-right"></div>' + '<div class="intercept-bg bg-bottom"></div>' + '<div class="intercept-bg bg-left"></div>' + '<div class="intercept-range">' + '<span class="range range-1"></span>' + '<span class="range range-2"></span>' + '<span class="range range-3"></span>' + '<span class="range range-4"></span>' + '<span class="range range-5"></span>' + '<span class="range range-6"></span>' + '<span class="range range-7"></span>' + '<span class="range range-8"></span>' + '<span class="range-b range-b1"></span>' + '<span class="range-b range-b2"></span>' + '<span class="range-b range-b3"></span>' + '<span class="range-b range-b4"></span>' + '</div></div>',
	    // 预览遮罩模板
	    previewTemplate: '<div class="intercept-bg bg-top"></div>' + '<div class="intercept-bg bg-right"></div>' + '<div class="intercept-bg bg-bottom"></div>' + '<div class="intercept-bg bg-left"></div>',
	    info: { current: {} }, // 记录选择框对应的实际图片信息
	    prevHtml: {}, // 当前选择框的上一个位置
	    factor: 1, // 图片的缩放比率
	    imgWidth: 0, // 图片没有缩放的时候的高和宽
	    imgHeight: 0, // 图片没有缩放的时候的高和宽
	    imgTop: 0, // 图片初始位置偏移值
	    imgLeft: 0, // 图片初始位置偏移值
	    cursor: '' };

	function Intercept(options, $el) {
	    this.config = $.extend(true, {}, settings, options);
	    this.control = $.extend(true, {}, control);
	    this.$ = $el;
	    this.$img = $el.find('img');
	    this.init(options);
	}

	Intercept.prototype = {
	    init: function init() {
	        var _this = this;
	        var $$ = this.$;
	        var $img = $$.find('img');

	        $$.append(this.control.rangeTemplate);

	        // 预览需要添加预览滤镜
	        if (this.config.$preview) {
	            this.config.$preview.append(this.control.previewTemplate).append($img.clone());
	        }

	        this.setEvent();

	        // 图片换了需要重新渲染
	        $img.on('load', function (event) {
	            reInit.call(_this, $img);
	        });

	        // 第一次图片的 load 可能没有执行
	        if ($img[0].readyState == "complete" || $img[0].readyState == "loaded") {
	            reInit.call(_this, $img);
	        }
	    },

	    // 图片自适应到容器中
	    imgResponse: function imgResponse(wrapW, wrapH, imgW, imgH, $img, preview) {
	        // 图片宽高大于容易才需要缩放
	        // 预览除外，都需要缩放
	        if (preview) {
	            if (imgW / wrapW > imgH / wrapH) {
	                $img.width(wrapW);
	                $img.height(wrapW / imgW * imgH); // 这是需要的，因为 new Image()生成的图片无法自动改变高度（宽度）
	            } else {
	                $img.height(wrapH);
	                $img.width(wrapH / imgH * imgW); // 这是需要的，因为 new Image()生成的图片无法自动改变高度（宽度）
	            }
	        } else if (imgW > wrapW || imgH > wrapH) {
	            if (imgW / imgH > wrapW / wrapH) {
	                $img.width(wrapW);
	                //$img.height(wrapW/imgW*imgH);
	            } else {
	                $img.height(wrapH);
	                //$img.width(wrapH/imgH*imgW);
	            }
	        }
	    },

	    // 图片位置和选框位置初始化
	    setTargetSize: function setTargetSize() {
	        var _this = this;
	        var _config = _this.config;
	        var _control = _this.control;
	        var $$ = _this.$;
	        var _ref = [$$.width(), $$.height()],
	            wrapW = _ref[0],
	            wrapH = _ref[1];

	        var $target = this.$.find('.intercept-target');
	        //let img = new Image();
	        var _ref2 = [_config.rangeHeight, _config.rangeWidth],
	            rangeHeight = _ref2[0],
	            rangeWidth = _ref2[1];
	        var marginTop = -rangeHeight / 2,
	            marginLeft = -rangeWidth / 2;

	        var $range = void 0;

	        // 记录图片原始宽高，不然比例不正确
	        if (!$target.data('wh')) {
	            $target.data('wh', [$target.width(), $target.height()]);
	        }

	        var _$target$data = $target.data('wh'),
	            _$target$data2 = _slicedToArray(_$target$data, 2),
	            tarW = _$target$data2[0],
	            tarH = _$target$data2[1];

	        var left = void 0,
	            top = void 0;

	        _this.imgResponse(wrapW, wrapH, tarW, tarH, $target);
	        _control.factor = tarW / $target.width();
	        tarW = $target.width();
	        tarH = $target.height();

	        left = (wrapW - tarW) / 2;
	        top = (wrapH - tarH) / 2;


	        $target.css({
	            'margin-top': top,
	            'margin-left': left
	        });

	        // 记录图片适应后的值
	        _control.imgLeft = left;
	        _control.imgTop = top;
	        _control.imgWidth = tarW;
	        _control.imgHeight = tarH;

	        // 记录容器大小
	        _control.wrapWidth = wrapW;
	        _control.wrapHeight = wrapH;

	        // 初始化选择框的位置
	        $range = $$.find('.intercept-range');
	        $range.css({
	            width: _config.rangeWidth,
	            height: rangeHeight,
	            left: parseFloat($range.css('left')) + marginLeft,
	            top: parseFloat($range.css('top')) + marginTop
	        });

	        _this.createFilter();
	    },

	    // 生成截图时的滤镜
	    createFilter: function createFilter() {
	        var _this = this;
	        var _config = _this.config;
	        var _control = _this.control;
	        var $$ = _this.$;
	        var _ref3 = [_config.rangeHeight, _config.rangeWidth],
	            rangeHeight = _ref3[0],
	            rangeWidth = _ref3[1];

	        var $range = void 0;
	        var top = void 0,
	            left = void 0,
	            bottom = void 0;

	        $range = $$.find('.intercept-range');
	        top = parseFloat($range.css('top'));
	        left = parseFloat($range.css('left'));
	        bottom = _control.wrapHeight - rangeHeight - top;

	        $$.find('.bg-top').css({ height: top });
	        $$.find('.bg-right').css({
	            width: _control.wrapWidth - rangeWidth - left,
	            top: top,
	            bottom: bottom
	        });
	        $$.find('.bg-bottom').css({ height: bottom });
	        $$.find('.bg-left').css({
	            width: left,
	            top: top,
	            bottom: bottom
	        });
	    },
	    setEvent: function setEvent() {
	        var _this = this;
	        var $$ = _this.$;
	        var _config = _this.config;
	        var _control = _this.control;
	        var moveRange = false;
	        var changeRange = false;
	        var starX = void 0,
	            starY = void 0,
	            starTop = void 0,
	            starLeft = void 0,
	            starWidth = void 0,
	            starHeight = void 0;

	        function changeRangeSize(event) {
	            var diffX = event.clientX - starX,
	                diffY = event.clientY - starY,
	                left = 0,
	                top = 0,
	                width = 0,
	                height = 0;

	            var $this = $(this);
	            var cursor = $this.css('cursor').match(/.*(?=-)/)[0];
	            var $range = $this.parent();

	            if (cursor !== _control.cursor) {
	                return;
	            }

	            // json[cursor],等比缩放
	            // 大小方向变化
	            switch (cursor) {
	                case 'n':
	                    left = 0;
	                    top = diffY;
	                    height = -diffY;
	                    break;
	                case 's':
	                    left = 0;
	                    top = 0;
	                    height = diffY;
	                    break;
	                case 'w':
	                    left = diffX;
	                    top = 0;
	                    width = -diffX;
	                    break;
	                case 'e':
	                    left = 0;
	                    top = 0;
	                    width = diffX;
	                    break;
	                case 'nw':
	                    left = diffX;
	                    top = diffY;
	                    height = -diffY;
	                    width = -diffX;
	                    break;
	                case 'ne':
	                    left = 0;
	                    top = diffY;
	                    height = -diffY;
	                    width = diffX;
	                    break;
	                case 'se':
	                    left = 0;
	                    top = 0;
	                    height = diffY;
	                    width = diffX;
	                    break;
	                case 'sw':
	                    left = diffX;
	                    top = 0;
	                    height = diffY;
	                    width = -diffX;
	                    break;
	            }

	            width = starWidth + width;
	            height = starHeight + height;
	            left = starLeft + left;
	            top = starTop + top;

	            if (left < 0 || top < 0 || left + width > _control.wrapWidth || top + height > _control.wrapHeight) {
	                return;
	            }

	            if (width > _config.maxRangeWidth || height > _config.maxRangeHeight || width < _config.minRangeWidth || height < _config.minRangeHeight) {
	                return;
	            }

	            $range.css({
	                width: width,
	                height: height,
	                left: left,
	                top: top
	            });

	            _config.rangeWidth = width;
	            _config.rangeHeight = height;

	            _this.createFilter();

	            if (_config.$preview) {
	                var type = _config.fixedWidth ? _config.rangeWidth + '' + _config.rangeHeight : 'current';
	                _this.setInfo(type);
	                _this.preview(type);
	            }
	        }

	        $$.on('mousedown', '.intercept-range', function (event) {
	            event.preventDefault(); // 这一句特别重要，如果没有就会导致 mouseup 无法触发的情况
	            var $this = $(this);

	            moveRange = true;
	            starX = event.clientX;
	            starY = event.clientY;
	            starTop = parseFloat($this.css('top'));
	            starLeft = parseFloat($this.css('left'));
	        });

	        $$.on('mousemove', '.intercept-range', function (event) {
	            if (moveRange) {
	                var $this = $(this);
	                var diffX = event.clientX - starX,
	                    diffY = event.clientY - starY;
	                var maxLeft = _control.wrapWidth - _config.rangeWidth,
	                    maxTop = _control.wrapHeight - _config.rangeHeight;
	                var _ref4 = [starLeft + diffX, starTop + diffY];
	                diffX = _ref4[0];
	                diffY = _ref4[1];


	                if (diffX < 0) {
	                    diffX = 0;
	                } else if (diffX >= maxLeft) {
	                    diffX = maxLeft;
	                }

	                if (diffY < 0) {
	                    diffY = 0;
	                } else if (diffY >= maxTop) {
	                    diffY = maxTop;
	                }

	                $this.css({
	                    top: diffY,
	                    left: diffX
	                });
	                _this.createFilter();

	                if (_config.$preview) {
	                    var type = _config.fixedWidth ? _config.rangeWidth + '' + _config.rangeHeight : 'current';
	                    _this.setInfo(type);
	                    _this.preview(type);
	                }
	            }
	        });

	        // 没有固定宽高，可以缩放选择框
	        if (!_config.fixedWidth) {
	            $$.on('mousedown', '.intercept-range>span', function (event) {
	                event.preventDefault(); // 这一句特别重要，如果没有就会导致 mouseup 无法触发的情况
	                event.stopPropagation();
	                var $this = $(this);
	                var $range = $this.parent();

	                changeRange = true;
	                _control.cursor = $this.css('cursor').match(/.*(?=-)/)[0];
	                starX = event.clientX;
	                starY = event.clientY;
	                starTop = parseFloat($range.css('top'));
	                starLeft = parseFloat($range.css('left'));
	                starWidth = parseFloat($range.css('width'));
	                starHeight = parseFloat($range.css('height'));
	            });

	            $$.on('mousemove', '.intercept-range>span', function (event) {
	                var _this2 = this;

	                event.stopPropagation();

	                if (changeRange) {
	                    (function () {
	                        var _this = _this2;
	                        $$.on('mousemove.intercept-changeSize', function (event) {
	                            changeRangeSize.call(_this, event);
	                        });
	                        changeRangeSize.call(_this, event);
	                    })();
	                }
	            });
	        }

	        $$.on('mouseleave mouseup', function (event) {
	            var type = _config.rangeWidth + '' + _config.rangeHeight;
	            $$.off('mousemove.intercept-changeSize');
	            _control.cursor = '';

	            if (moveRange && _config.fixedWidth) {
	                // 保留当前html副本
	                _control.prevHtml[type] = $$.find('.intercept-filter').html();
	                moveRange = false;
	                _this.setInfo(type);
	                _config.intercept.call(_this, _control.info);
	            }

	            if (!_config.fixedWidth && (changeRange || moveRange)) {
	                changeRange = false;
	                moveRange = false;
	                type = 'current';
	                _this.setInfo(type);
	                _config.intercept.call(_this, _control.info);
	            }
	        });
	    },

	    // 返回当前选择对应的图片信息
	    setInfo: function setInfo(type) {
	        var _this = this;
	        var $$ = _this.$;
	        var _config = _this.config;
	        var _control = _this.control;
	        var item = _control.info[type];
	        var fl = Math.floor;
	        var $range = $$.find('.intercept-range');
	        var _ref5 = [parseFloat($range.css('left')), parseFloat($range.css('top'))],
	            left = _ref5[0],
	            top = _ref5[1];

	        var top2 = void 0,
	            height = void 0,
	            left2 = void 0,
	            width = void 0;
	        var factor = _control.factor;

	        if (!item) {
	            item = _control.info[type] = {};
	        }

	        // 获取所截区域的top、height
	        if (top + _config.rangeHeight < _control.imgTop || top > _control.imgTop + _control.imgHeight) {
	            item.tip = '选择框没有在图片上';
	            item.left = item.top = item.width = item.height = '';
	            return false;
	        } else {
	            top2 = top - _control.imgTop;
	            top2 = top2 > 0 ? top2 : 0;
	            height = Math.min(top + _config.rangeHeight, _control.imgTop + _control.imgHeight) - _control.imgTop - top2;
	        }

	        // 实际top、height
	        item.top = fl(top2 * factor);
	        item.height = fl(height * factor);

	        //
	        if (left + _config.rangeWidth < _control.imgLeft || left > _control.imgLeft + _control.imgWidth) {
	            item.left = item.top = item.width = item.height = '';
	            item.tip = '选择框没有在图片上';
	            return false;
	        } else {
	            left2 = left - _control.imgLeft;
	            left2 = left2 > 0 ? left2 : 0;
	            width = Math.min(left + _config.rangeWidth, _control.imgLeft + _control.imgWidth) - _control.imgLeft - left2;
	        }

	        item.left = fl(left2 * factor);
	        item.width = fl(width * factor);

	        item.tip = '';
	    },

	    // 重新初始化，比如改变选择框大小的时候
	    reInit: function reInit(changeImage) {
	        var _control = this.control;
	        var _config = this.config;
	        var item = _control.prevHtml[_config.rangeWidth + '' + _config.rangeHeight];

	        if (changeImage || !item) {
	            this.$.find('.intercept-range').css({
	                left: '50%',
	                top: '50%'
	            });
	            this.setTargetSize();

	            // 如果有预览
	            if (_config.$preview) {
	                var type = _config.fixedWidth ? _config.rangeWidth + '' + _config.rangeHeight : 'current';
	                this.setInfo(type);
	                this.preview(type);
	            }
	        } else {
	            this.$.find('.intercept-filter').html(item);
	        }
	    },

	    // 创建预览的滤镜
	    createPreviewFilter: function createPreviewFilter(wrapW, wrapH, imgW, imgH, $$) {
	        var left = (wrapW - imgW) / 2,
	            top = (wrapH - imgH) / 2;

	        $$.find('.bg-top,.bg-bottom').css({ height: top });
	        $$.find('.bg-right,.bg-left').css({
	            width: left,
	            top: top,
	            bottom: top
	        });
	        return [left, top];
	    },

	    // 预览
	    preview: function preview(type) {
	        var _this = this;
	        var _control = _this.control;
	        var item = $.extend(true, {}, _control.info[type]);

	        if (item) {
	            if (item.tip) {
	                item.left = item.top = item.width = item.height = 0;
	            }

	            this.config.$preview.each(function (index, el) {
	                var $el = $(el);
	                var $img = $el.find('img');
	                var $imgTemp = $(new Image());
	                var _ref6 = [$el.width(), $el.height()],
	                    wrapW = _ref6[0],
	                    wrapH = _ref6[1];


	                _this.imgResponse(wrapW, wrapH, item.width, item.height, $imgTemp, true);

	                var _this$createPreviewFi = _this.createPreviewFilter(wrapW, wrapH, $imgTemp.width(), $imgTemp.height(), $el),
	                    _this$createPreviewFi2 = _slicedToArray(_this$createPreviewFi, 2),
	                    left = _this$createPreviewFi2[0],
	                    top = _this$createPreviewFi2[1];

	                var factor = $imgTemp.width() / item.width;
	                var width = factor * _this.$img.data('wh')[0];

	                $img.css({
	                    width: width,
	                    top: -factor * item.top + top,
	                    left: -factor * item.left + left
	                });
	            });
	        }
	    }
	};

	$.fn.intercept = function (options) {
	    return this.each(function (index, el) {
	        var $el = $(el);

	        if (!$el.data('intercept')) {
	            $el.data('intercept', new Intercept(options, $el));
	        }
	    });
	};

	function reInit($img) {
	    $img.data('wh', false).removeAttr('style');
	    this.reInit(true);
	    //this.control.info = {};
	    this.config.intercept.call(this, this.control.info);
	}

	module.exports = {
	    intercept: function intercept(config) {
	        this.intercept(config);
	    }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/*
	    idate
	    @version  1.1
	    @author   janking
	 */
	var moment = __webpack_require__(23);
	var templateEngine = function templateEngine(html, options) {
	    var re = /<%([^%>]+)?%>/g,
	        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
	        code = 'var r=[];\n',
	        cursor = 0,
	        match;
	    var add = function add(line, js) {
	        code += js ? line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n' : line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '';
	        return add;
	    };

	    while (match = re.exec(html)) {
	        add(html.slice(cursor, match.index))(match[1], true);
	        cursor = match.index + match[0].length;
	    }
	    add(html.substr(cursor, html.length - cursor));
	    code += 'return r.join("");';
	    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
	};

	var template = '<%if(!this[\'idate\'].config.singleDatePicker){%>' + '<div class="range-time-show">' + '<i class="fa fa-calendar glyphicon glyphicon-calendar"></i>' + '<span class="time-text">' + '<%if(this[\'witchCalendar\'] === 0){%>' + '<%this[\'idate\'].startDate%>' + '<%}else{%>' + '<%this[\'idate\'].endDate%>' + '<%}%>' + '</span>' + '</div>' + '<%}%>' + '<table class="idate-table-condensed">' + '<thead>' + '<tr>' + '<th class="btn-prev" data-num="<%this[\'prev\']%>"><i class="glyphicon glyphicon-chevron-left"></i></th>' + '<%this["title"]%>' + '<th class="btn-next" data-num="<%this[\'next\']%>"><i class="glyphicon glyphicon-chevron-right"></i></th>' + '</tr>' + '<%if(this["weeklist"]){%>' + '<tr class="idate-week">' + '<%for(var i = 0;i < this["weeklist"].length ; i++){%>' + '<th><%this["weeklist"][i]%></th>' + '<%}%>' + '</tr>' + '<%}%>' + '</thead>' + '<%this["tbody"]%>' + '</table>';

	var dateBox = '<div class="idate-container">' + '<div class="idate-content clearfix">' + '<div class="idate-calendar left">' + '<div class="idate-calendar-table"></div>' + '</div>{{right-calendar}}{{sidebar}}' + '</div>' + '</div>';

	var sidebar = '<div class="idate-side">' + '<label class="calendar-type"><input name="idate-type" value="0" type="radio" checked>自定义</label>' + '<label class="calendar-type"><input name="idate-type" value="1" type="radio" >自然日</label>' + '<label class="calendar-type"><input name="idate-type" value="2" type="radio">自然周</label>' + '<label class="calendar-type"><input name="idate-type" value="3" type="radio">自然月</label>' + '</div>';

	var rightCalendar = '<div class="idate-calendar right"><div class="idate-calendar-table"></div></div>';

	var YYYYMMDD = 'YYYY-MM-DD';
	var statusClassName = 'range-in from to';

	/**
	 * [isValidDate 是否为有效时间对象]
	 * @param  {String/Number}  time [格式化时间或时间戳]
	 * @return {Boolean}      [true or false]
	 */
	function isValidDate(time) {
	    var d = time ? new Date(time) : null;
	    if (Object.prototype.toString.call(d) === "[object Date]") {
	        if (isNaN(d.getTime())) {
	            return false;
	        } else {
	            return true;
	        }
	    } else {
	        return false;
	    }
	}

	/**
	 * [getCalendarIndex 获取当前操作日历的序号]
	 * @param  {[jQ dom]} src [当前操作日历中的某一元素]
	 * @return {[Number]}     [0:左边日历，1:右边日历]
	 */
	function getCalendarIndex(src) {
	    return src.parents('div.idate-calendar').hasClass('left') ? 0 : 1;
	}

	/**
	 * [detectRangeIn 判断当前td是否为当前所选时间范围内]
	 * @param  {[String]}   curDate     [当前格式化时间]
	 * @param  {[String]}   offStyle    [当前td的class是否有off]
	 * @return {[String]}               [返回 range-in 或空字符串]
	 */
	function detectRangeIn(curDate, offStyle) {
	    var curDateTimestamp = +moment(curDate);
	    return this.rangeStatus === 2 && this.startDate && curDateTimestamp > +moment(this.startDate) && curDateTimestamp < +moment(this.endDate) && !offStyle ? ' range-in' : '';
	}

	/**
	 * [detectRangeFrom 判断当前td是否为起始时间]
	 * @param  {[String]}   curDate     [当前格式化时间]
	 * @param  {[String]}   offStyle    [当前td的class是否有off]
	 * @return {[String]}               [返回 from 或空字符串]
	 */
	function detectRangeFrom(curDate, offStyle) {
	    return this.rangeStatus && curDate === moment(this.startDate).format(YYYYMMDD) && !offStyle ? ' from' : '';
	}

	/**
	 * [detectRangeFrom 判断当前td是否为结束时间]
	 * @param  {[String]}   curDate     [当前格式化时间]
	 * @param  {[String]}   offStyle    [当前td的class是否有off]
	 * @return {[String]}               [返回 to 或空字符串]
	 */
	function detectRangeTo(curDate, offStyle) {
	    return this.rangeStatus === 2 && curDate === moment(this.endDate).format(YYYYMMDD) && !offStyle ? ' to' : '';
	}

	/**
	 * [inputDate 向input插入所选时间]
	 */
	function inputDate() {
	    var self = this;
	    var fmt = self.config.format;
	    var separator = self.config.separator;
	    var value = self.startDate && self.endDate ? moment(self.startDate).format(fmt) + separator + moment(self.endDate).format(fmt) : '';
	    if (self.$el.val() !== value) {
	        self.$el.data('prevDate', self.$el.val());
	        self.$el.val(value);
	        if (self.checkType !== 2) {
	            self.$el.data('prevDate', value);
	        }
	        self.$el.trigger('idate.change', [self]);
	    }
	}

	/**
	 * [statusReset 组件状态重置]
	 * rangeStatus : 范围选取状态
	 * startDate   : 开始时间
	 * endDate     : 结束时间
	 * rangeStep   : 选取步骤
	 */
	function statusReset() {
	    this.rangeStatus = 0;
	    this.startDate = null;
	    this.endDate = null;
	    this.rangeStep = 0;
	    this.$dateBox.find('td').removeClass('range-in from to');
	    this.$el.val('');
	}

	/**
	 * [getValue 获取input的value值]
	 * @return {[Array]} [返回时间数组]
	 */
	function getValue() {
	    var input = this.$el[0];
	    var value = input.value ? input.value.split(this.config.separator) : [];
	    if (!isValidDate(value[0]) || !isValidDate(value[1])) {
	        this.value = '';
	        value = [null, null];
	    }
	    return value;
	}

	/**
	 * [isValidValue 判断input的值是否符合时间格式]
	 * @param  {[String]}  value [input value]
	 * @return {Boolean}
	 */
	function isValidValue(value) {
	    return value && isValidDate(value[0]) && isValidDate(value[1]) && +new Date(value[0]) <= +new Date(value[1]);
	}

	/**
	 * [saveStatus 组件状态保存]
	 * 根据checkType进行分类存储
	 * checkType : 0 自定义，1 自然日，2 自然周，3 自然月
	 */
	function saveStatus() {
	    var self = this;
	    var checkType = self.checkType;
	    self._cache[checkType] = {
	        startDate: self.startDate,
	        endDate: self.endDate,
	        rangeStatus: self.rangeStatus,
	        rangeStep: self.rangeStep,
	        html: self.$dateBox.html()
	    };
	}

	/**
	 * [loadStatus 读取缓存]
	 */
	function loadStatus(cache) {
	    this.startDate = cache.startDate;
	    this.endDate = cache.endDate;
	    this.rangeStatus = cache.rangeStatus;
	    this.rangeStep = cache.rangeStep;
	}

	$(window).on('resize', function (event) {
	    $('.idate-container.open').each(function (index, el) {
	        var idate = $(el).data('idate');
	        idate.showCalendar(idate.$el[0]);
	    });
	});

	// 隐藏组件
	$('body').on('click', function (event) {
	    $('.idate-container.open').each(function (index, el) {
	        var $target = $(event.target);
	        var idate = $(el).data('idate');
	        if ($target.is(idate.$el) || $target.closest('.idate-container').length || $target.is(idate.$dateBox) || $target.parents('table.idate-table-condensed').length || $target.is($(idate.config.iconClick))) {
	            return;
	        }
	        idate.hideCalendar();
	    });
	});

	if ((typeof moment === 'undefined' ? 'undefined' : _typeof(moment)) === void 0) {
	    throw 'can not found moment.js';
	}

	var selector = undefined;

	var defaults = {
	    container: 'body',
	    format: YYYYMMDD,
	    singleDatePicker: false,
	    separator: ' to ',
	    minDate: '',
	    maxDate: moment(),
	    maxDateLength: Number.MAX_VALUE,
	    sidebar: true,
	    shortcut: {
	        today: [moment(), moment()],
	        yesterday: [moment().subtract(1, 'd'), moment().subtract(1, 'd')],
	        lastWeek: [moment().subtract(6, 'd'), moment()],
	        lastMonth: [moment().subtract(29, 'd'), moment()]
	    }
	};

	function Idate(options) {
	    this.$el = selector;
	    this.config = $.extend({}, defaults, options);
	    var isRangePicker = !this.config.singleDatePicker;
	    this.$container = $(this.config.container);
	    this.containerPos = this.$container[0].getBoundingClientRect();
	    this.template = dateBox.replace('{{right-calendar}}', isRangePicker ? rightCalendar : '');
	    this.template = this.template.replace('{{sidebar}}', isRangePicker && this.config.sidebar ? sidebar : '');
	    this.$dateBox = $(this.template);
	    this.$dateTableContext = this.$dateBox.find('.idate-calendar-table');
	    this.screenWidth = $(document).width();
	    this.screenHeight = $(document).height();
	    this._cache = [];
	    this.startDate = null;
	    this.endDate = null;
	    this.piking = null;
	    this.checkType = 0;
	    this.rangeStep = 0;
	    this.rangeStatus = 0; // 0 初始化，1 起始，2 结束
	    this.minDate = this.config.minDate ? moment(this.config.minDate) : null;
	    this.maxDate = this.config.maxDate ? moment(this.config.maxDate) : null;
	    this.init();
	}

	Idate.prototype.init = function () {
	    var self = this;
	    var type = ['singleEvent', 'rangeEvent'][self.config.singleDatePicker ? 0 : 1];
	    self[type]();
	    self.$dateBox.data('idate', self);
	};

	Idate.prototype.setStartTime = function (time, caller) {
	    var self = this;
	    var $tds = self.$dateBox.find('td');
	    var $text = self.$dateBox.find('.time-text');
	    var $ltext = $text.eq(0);
	    var $caller = caller || $({});
	    $tds.removeClass(statusClassName);
	    $caller.addClass('from');
	    self.rangeStep = self.rangeStatus = 1;
	    self.startDate = time;
	    $ltext.text(time);
	};

	Idate.prototype.setEndTime = function (time, caller, reset) {
	    var self = this;
	    var $text = self.$dateBox.find('.time-text');
	    var $rtext = $text.eq(1);
	    var $caller = caller || $({});
	    $caller.addClass('to');
	    self.rangeStep = 0;
	    self.endDate = time;
	    self.rangeStatus = 2;
	    $rtext.text(time);

	    if (reset) {
	        self.checkType = 0;
	        self.$dateBox.find('.btn-shortcut').removeClass('active');
	        self.$dateBox.find('[name="idate-type"]').removeAttr('checked').eq(0).attr('checked', true).prop('checked', true);
	        self.$dateBox.find('.idate-content').removeClass('mode-week mode-month');
	        self._cache = [];
	    }
	    inputDate.call(self);
	};

	Idate.prototype.rangeEvent = function () {
	    var self = this;
	    // 调用控件
	    self.$el.on('focus.iui-idate', function (event) {
	        var value = getValue.call(self);
	        var cacheObj = self._cache[self.checkType];
	        var html;
	        if (self._cache.length !== 0) {
	            loadStatus.call(self, cacheObj);
	            self.$dateBox.html(cacheObj.html);
	            self.$dateTableContext = self.$dateBox.find('.idate-calendar-table');
	            self.$dateBox.find('.idate-content');
	        } else {
	            html = self.renderRangeDates(value, value.slice());
	            self.$dateTableContext.each(function (index, el) {
	                el.innerHTML = html[index];
	            });
	        }
	        // self.$dateBox.find('.idate-calendar-table').removeClass('disabled');
	        self.showCalendar(this);
	    });

	    if (self.config.iconClick) {
	        $(self.config.iconClick).on('click', function (event) {
	            self.$el.trigger('focus.iui-idate');
	        });
	    }
	    // 上一页,下一页
	    self.$dateBox.on('click.iui-idate', '.btn-prev,.btn-next', function (event) {
	        var $this = $(this);
	        var index = getCalendarIndex($this);
	        var curTime = $this.data('num');
	        var prevTime = moment(curTime).subtract(1, 'M').format(YYYYMMDD);
	        var nextTime = moment(curTime).add(1, 'M').format(YYYYMMDD);
	        var value = index ? [prevTime, curTime] : [curTime, nextTime];
	        var html;

	        if (self.mode === 0) {
	            html = self.renderRangeDates(value, getValue.call(self));
	        } else if (self.mode === 1) {
	            html = self.renderMonths($this.data('num'));
	        } else {
	            html = self.renderYears($this.data('num'));
	        }

	        if (typeof html === 'string') {
	            self.$dateTableContext.eq(index).html(html);
	        } else {
	            self.$dateTableContext.each(function (index, el) {
	                el.innerHTML = html[index];
	            });
	        }
	    });

	    // 开始，结束选取时间
	    self.$dateBox.on('click.iui-idate', 'td.date', function (event) {
	        var $this = $(this);
	        var curTime = $this.data('num');
	        var startDate = moment(self.startDate);
	        var endDate = moment(curTime);
	        var diffInDays = endDate.diff(startDate, 'days') + 1;
	        var index = getCalendarIndex($this);
	        var curDate, html, weekStart, weekEnd;
	        if (self.checkType) {
	            if (self.checkType === 1) {
	                if ($this.hasClass('off') || $this.hasClass('disabled')) {
	                    return false;
	                }
	                weekStart = weekEnd = curTime;
	            } else if (self.checkType === 2 && $this.parent().find('td.disabled').length === 0) {
	                weekStart = moment(curTime).weekday(0).format(YYYYMMDD);
	                weekEnd = moment(curTime).weekday(6).format(YYYYMMDD);
	            } else {
	                return false;
	            }

	            self.setStartTime(weekStart, self.$dateBox.find('[data-num="' + weekStart + '"]'));
	            self.setEndTime(weekEnd, self.$dateBox.find('[data-num="' + weekEnd + '"]'));
	            curDate = index ? moment(self.startDate).subtract(1, 'M') : self.startDate;
	            html = self.renderRangeDates([curDate, null]);
	            self.$dateTableContext.each(function (key, el) {
	                el.innerHTML = html[key];
	            });
	            inputDate.call(self);
	            self.hideCalendar();
	        } else {
	            if ($this.hasClass('off') || $this.hasClass('disabled') || diffInDays > self.config.maxDateLength && self.rangeStatus === 1) {
	                return;
	            }
	            self.rangePicker(curTime, this);
	        }
	    });

	    // 开始选取范围
	    self.$dateBox.on('mouseenter', 'td', function (event) {
	        var $this = $(this);
	        var tdList = self.$dateBox.find('td');
	        var curTdIndex = tdList.index($this);
	        var startTdIndex = tdList.index(self.$dateBox.find('td[data-num="' + self.startDate + '"]'));
	        var startDate = +new Date(self.startDate);
	        var fromDate = moment(self.startDate);
	        var data;
	        if (startTdIndex === -1 && +new Date(tdList.eq(0).data('num')) > startDate) {
	            startTdIndex = 0;
	        }

	        data = tdList.slice(startTdIndex, curTdIndex);
	        if (self.rangeStep) {
	            tdList.slice(curTdIndex).removeClass('range-in');
	            $.each(data, function (index, el) {
	                var $el = $(el);
	                var curTimeStr = $el.data('num');
	                var time = +new Date(curTimeStr);
	                var diffInDays = moment(curTimeStr).diff(fromDate, 'days');
	                if (time > startDate && !$el.hasClass('off') && diffInDays < self.config.maxDateLength) {
	                    $el.addClass('range-in');
	                }
	            });
	        }
	    });

	    // 进入月份
	    self.$dateBox.on('click.iui-idate', '.btn-month', function (event) {
	        var $this = $(this);
	        var index = getCalendarIndex($this);
	        var html = self.renderMonths($(this).data('num'));
	        self.$dateTableContext.eq(index).html(html);
	        self.$dateBox.find('.idate-calendar-table').eq(index ? 0 : 1).addClass('disabled');
	    });

	    // 进入年份
	    self.$dateBox.on('click.iui-idate', '.btn-year', function (event) {
	        var $this = $(this);
	        var index = getCalendarIndex($this);
	        var html = self.renderYears($(this).data('num'));
	        self.$dateTableContext.eq(index).html(html);
	        self.$dateBox.find('.idate-calendar-table').eq(index ? 0 : 1).addClass('disabled');
	    });

	    // 选择月份
	    self.$dateBox.on('click.iui-idate', 'span.month', function (event) {
	        var $this = $(this);
	        var index = getCalendarIndex($this);
	        var curDateStr = $(this).data('num');
	        var weekStart, weekEnd;

	        if ($this.hasClass('disabled')) {
	            return false;
	        }
	        if (self.checkType === 3) {
	            weekStart = moment(curDateStr).startOf('month').format(YYYYMMDD);
	            weekEnd = moment(curDateStr).endOf('month').format(YYYYMMDD);
	            self.setStartTime(weekStart, null);
	            self.setEndTime(weekEnd, null);
	            self.hideCalendar();
	        } else {
	            var curDate = index ? moment(curDateStr).subtract(1, 'M') : curDateStr;
	            var html = self.renderRangeDates([curDate, null], false);
	            self.$dateBox.find('.idate-calendar-table').removeClass('disabled');
	            self.$dateTableContext.each(function (index, el) {
	                el.innerHTML = html[index];
	            });
	        }
	    });

	    // 选择年份
	    self.$dateBox.on('click.iui-idate', 'span.year', function (event) {
	        var $this = $(this);
	        var index = getCalendarIndex($this);
	        if ($this.hasClass('disabled')) {
	            return false;
	        }
	        var html = self.renderMonths($this.data('num'));
	        self.$dateTableContext.eq(index).html(html);
	    });

	    // // 快捷选择
	    // self.$dateBox.on('click.iui-idate', '.btn-shortcut', function(event) {
	    //     event.preventDefault();
	    //     var $this = $(this);
	    //     var timeRange = self.config.shortcut[$this.data('type')];
	    //     var startDate = timeRange[0];
	    //     var endDate = timeRange[1];
	    //     var typeClassName = 'mode-week mode-month';
	    //     var html;
	    //     self.$dateBox.find('.idate-content').removeClass(typeClassName);
	    //     self.$dateBox.find('[name="idate-type"]').removeAttr('checked').eq(0).attr('checked','checked').prop('checked',true);
	    //     $this.addClass('active').siblings('.active').removeClass('active');
	    //     self.setStartTime(startDate.format(YYYYMMDD),null);
	    //     self.setEndTime(endDate.format(YYYYMMDD),null);
	    //     html = self.renderRangeDates([self.startDate,null],false);
	    //     self.$dateTableContext.each(function(index, el) {
	    //             el.innerHTML = html[index];
	    //     });
	    //     self.hideCalendar();
	    // });

	    // 自然模式
	    self.$dateBox.on('change.iui-idate', '.calendar-type input', function (event) {
	        saveStatus.call(self);
	        var $this = $(this);
	        var type = self.checkType = parseInt($this.val(), 10);
	        var cacheObj = self._cache[type];
	        var typeClassName = 'mode-week mode-month';
	        var $content = self.$dateBox.find('.idate-content');
	        var $shortcuts = self.$dateBox.find('.btn-shortcut');
	        var $radios = self.$dateBox.find('[name="idate-type"]');
	        var html = cacheObj ? cacheObj.html : self.renderRangeDates([moment(), null], false);
	        var mode = { 2: 'mode-week', 3: 'mode-month' };
	        $shortcuts.removeClass('active');
	        $radios.not($this).removeAttr('checked');
	        $this.attr('checked', 'checked').prop('checked', true);
	        if (cacheObj) {
	            loadStatus.call(self, cacheObj);
	            self.$dateBox.html(html);
	            self.$dateTableContext = self.$dateBox.find('.idate-calendar-table');
	        } else {
	            self.$dateTableContext.each(function (index, el) {
	                el.innerHTML = html[index];
	            });
	            statusReset.call(self);
	        }
	        if (type) {
	            $content.removeClass(typeClassName).addClass(mode[type]);
	            self.$dateBox.find('.idate-calendar-table').removeClass('disabled');
	            if (type === 3) {
	                self.$dateTableContext.eq(0).html(self.renderMonths(moment()));
	            }
	        } else {
	            $content.removeClass(typeClassName);
	        }
	        self.showCalendar(self.$el[0]);
	        self.$el.trigger('idate.checkTypeChange', [self]);
	    });
	};

	Idate.prototype.singleEvent = function () {
	    var self = this;
	    // 调用控件
	    self.$el.on('focus.iui-idate', function (event) {
	        var value = isValidDate(this.value) ? this.value : +new Date();
	        var html = self.renderDates(value, this.value);
	        self.$dateTableContext.html(html);
	        self.showCalendar(this);
	    });

	    // 上一页 or 下一页
	    self.$dateBox.on('click.iui-idate', '.btn-prev,.btn-next', function (event) {
	        var $this = $(this);
	        var curDateStr = $this.data('num');
	        var mode = self.mode;
	        var html = mode ? mode === 1 ? self.renderMonths(curDateStr) : self.renderYears(curDateStr) : self.renderDates(curDateStr, self.$el.val());
	        self.$dateTableContext.html(html);
	    });

	    // 进入月份 or 进入年份
	    self.$dateBox.on('click.iui-idate', '.btn-month,.btn-year', function (event) {
	        var $this = $(this);
	        var curDateStr = $this.data('num');
	        var type = ['renderMonths', 'renderYears'][$this.hasClass('btn-month') ? 0 : 1];
	        var html = self[type](curDateStr);
	        self.$dateTableContext.html(html);
	    });

	    // 选择日期
	    self.$dateBox.on('click.iui-idate', 'td.date', function (event) {
	        var $this = $(this);
	        self.singlePicker($this.data('num'));
	    });

	    // 选择月份 or 选择年份
	    self.$dateBox.on('click.iui-idate', 'span.month,span.year', function (event) {
	        var $this = $(this);
	        var curDateStr = $this.data('num');
	        var type = ['renderDates', 'renderMonths'][$this.hasClass('month') ? 0 : 1];
	        var html = self[type]($this.data('num'), self.$el.val());
	        self.$dateTableContext.html(html);
	    });
	};

	Idate.prototype.showCalendar = function (caller) {
	    var self = this;
	    var offsetCaller = caller.getBoundingClientRect();
	    var offsetX = offsetCaller.left;
	    var offsetY = offsetCaller.top;
	    var offsetWidth = offsetCaller.width;
	    var offsetHeight = offsetCaller.height;
	    var dateBoxWidth;
	    self.$dateBox.removeAttr('style').addClass('open').css('opacity', 0).appendTo(self.$container);
	    dateBoxWidth = self.$dateBox.outerWidth();
	    self.$dateBox.css({
	        left: offsetX,
	        top: offsetY + offsetHeight + 10,
	        opacity: 1
	    });
	};

	Idate.prototype.hideCalendar = function (caller) {
	    var self = this;
	    if (!self.config.singleDatePicker) {
	        saveStatus.call(self);
	        inputDate.call(self);
	    }
	    self.$dateBox.removeClass('open');
	};

	Idate.prototype.renderDates = function (time, value, calendarIndex) {
	    var self = this;
	    // 待渲染UI的当前时间
	    var curTime = moment(time);
	    // 待渲染UI的当前月份对象
	    var curTimeM = curTime.format('M');
	    // 待渲染UI的当前月份格式 YYYY-MM-DD
	    var curTimeYYYYMMDD = curTime.format(YYYYMMDD);
	    // 待渲染UI的当前月第一天所在周的星期一的对象
	    var startDate = moment(time).date(1).weekday(0);
	    // 现实当前时间
	    var nowTimeYYYYMMDD = moment().format(YYYYMMDD);
	    // value时间对象
	    var valueTime = moment(isValidDate(value) ? value : time);
	    // value时间的格式化 YYYY-MM-DD
	    var valueTimeYYYYMMDD = valueTime.format(YYYYMMDD);
	    // 是否单选时间模式
	    var pickerType = self.config.singleDatePicker;

	    var html = templateEngine(template, {
	        witchCalendar: calendarIndex, //渲染header部分的开始，结束时间
	        idate: self,
	        title: '<th colspan="3" class="btn-month" data-num="' + curTimeYYYYMMDD + '">' + curTime.format('MMMM') + '</th><th colspan="2" class="btn-year" data-num="' + curTimeYYYYMMDD + '">' + curTime.format('YYYY') + '</th>',
	        prev: moment(time).subtract(1, 'M').format(YYYYMMDD),
	        next: moment(time).add(1, 'M').format(YYYYMMDD),
	        weeklist: function () {
	            var arr = [];
	            for (var i = 1; i < 8; i++) {
	                arr.push(curTime.isoWeekday(i).format('dd'));
	            }
	            return arr;
	        }(),
	        tbody: function () {
	            var html = '<tbody class="idate-dateList"><tr class="">';
	            var rowHasDisabled = '';
	            for (var i = 1; i < 43; i++) {
	                // 当前循环的时间对象
	                var curDate = startDate.add(i === 1 ? 0 : 1, 'days');
	                var curDateYYYYMMDD = curDate.format(YYYYMMDD);
	                // 当前循环的日期所属月是否等于待渲染UI的月份，若不是，则class="off"
	                var isCurMonth = curDate.format('M') === curTimeM;
	                var offStyle = isCurMonth ? '' : ' off';
	                // 当前循环的日期是否现实中的今天；若是，则class="cur-date"
	                var isNowDate = curDateYYYYMMDD === nowTimeYYYYMMDD && !offStyle ? ' cur-date' : '';
	                // 当前循环的日期是否上一次所选中的，若是，则class="active"，仅当单选时间模式有效
	                var isChecked = pickerType && value && curDateYYYYMMDD === valueTimeYYYYMMDD ? ' active' : '';
	                // 当前循环的日期是否在被选中的开始时间与结束时间之中
	                var rangIn = detectRangeIn.call(self, curDateYYYYMMDD, offStyle);
	                // 当前循环的日期是否是被选中的开始时间
	                var fromDate = detectRangeFrom.call(self, curDateYYYYMMDD, offStyle);
	                // 当前循环的日期是否是被选中的结束时间
	                var toDate = detectRangeTo.call(self, curDateYYYYMMDD, offStyle);

	                var maxDate = self.maxDate && +curDate > +self.maxDate ? ' disabled' : '';

	                var statusClass = offStyle + isNowDate + isChecked + rangIn + fromDate + toDate + maxDate;

	                rowHasDisabled += maxDate ? '1' : '0';

	                html += '<td class="date' + statusClass + '" data-num="' + curDateYYYYMMDD + '">' + curDate.format('D') + '</td>';

	                if (i != 1 && i % 7 === 0) {
	                    html = html.replace('class=""', rowHasDisabled.indexOf('1') !== -1 ? '' : 'class="has-not-disabled"');
	                    html += '</tr><tr class="">';
	                }
	            }

	            return html + '</tr></tbody>';
	        }()
	    });
	    self.mode = 0;
	    return html;
	};

	Idate.prototype.renderRangeDates = function (time, value) {
	    var self = this;
	    var isValidStartDate = isValidDate(time[0]);
	    var leftTime = isValidStartDate ? time[0] : moment();
	    var rightTime = moment(isValidStartDate ? time[0] : +new Date()).add(1, 'M');
	    var lHtml, rHtml;

	    if (isValidValue(value)) {
	        self.rangeStatus = 2;
	        self.startDate = moment(+new Date(value[0])).format(YYYYMMDD);
	        self.endDate = moment(+new Date(value[1])).format(YYYYMMDD);
	    }

	    lHtml = self.renderDates(leftTime, false, 0);
	    rHtml = self.renderDates(rightTime, false, 1);

	    return [lHtml, rHtml];
	};

	Idate.prototype.renderMonths = function (time) {
	    var self = this;
	    var curTime = moment(time);
	    var curTimeYYYY = curTime.format('YYYY');
	    var curMonth = parseInt(curTime.format('M'), 10) - 1;
	    var nowTime = moment();
	    var nowTimeYYYY = nowTime.format('YYYY');
	    var html = templateEngine(template, {
	        idate: self,
	        title: '<th colspan="5" class="btn-year" data-num="' + curTime.format(YYYYMMDD) + '">' + curTimeYYYY + '</th>',
	        prev: moment(time).subtract(1, 'y').format(YYYYMMDD),
	        next: moment(time).add(1, 'y').format(YYYYMMDD),
	        tbody: function () {
	            var months = moment.monthsShort();
	            var html = '<tbody class="idate-monthList"><tr><td colspan="7">';
	            for (var i = 0; i < months.length; i++) {
	                var isThisMonth = i === curMonth && curTimeYYYY === nowTimeYYYY ? ' cur-month' : '';
	                var maxDate = self.maxDate && +curTime.month(i) > +self.maxDate ? ' disabled' : '';
	                var statusClassName = isThisMonth + maxDate;

	                html += '<span class="month' + statusClassName + '" data-num="' + curTime.month(i).format(YYYYMMDD) + '">' + months[i] + '</span>';
	            }
	            return html + '</td></tr></tbody>';
	        }()
	    });
	    self.mode = 1;
	    return html;
	};

	Idate.prototype.renderYears = function (time) {
	    var self = this;
	    var startYear = moment(time).subtract(5, 'y');
	    var endYear = moment(time).add(6, 'y');
	    var startYearYYYY = parseInt(startYear.format('YYYY'), 10);
	    var curYear = moment().format('YYYY');
	    var html = templateEngine(template, {
	        idate: self,
	        title: '<th colspan="5" data-num="' + startYear.format(YYYYMMDD) + '">' + startYearYYYY + '-' + endYear.format('YYYY') + '</th>',
	        prev: moment(time).subtract(12, 'y').format(YYYYMMDD),
	        next: moment(time).add(12, 'y').format(YYYYMMDD),
	        tbody: function () {
	            var html = '<tbody class="idate-yearList"><tr><td colspan="7">';
	            for (var i = 0; i < 12; i++) {
	                var isCurYear = parseInt(curYear, 10) === parseInt(startYearYYYY, 10) + i ? ' cur-year' : '';
	                var year = startYearYYYY + i;
	                var yearYYYYMMDD = startYear.add(i === 0 ? 0 : 1, 'y').format(YYYYMMDD);
	                var maxDate = self.maxDate && +new Date(yearYYYYMMDD) > +self.maxDate ? ' disabled' : '';
	                html += '<span class="year' + isCurYear + maxDate + '" data-num="' + yearYYYYMMDD + '">' + year + '</span>';
	            }
	            return html + '</td></tr></tbody>';
	        }()
	    });
	    self.mode = 2;
	    return html;
	};

	Idate.prototype.singlePicker = function (time) {
	    var self = this;
	    self.$el.val(moment($(this).data('num')).format(self.config.format));
	    self.hideCalendar();
	};

	Idate.prototype.rangePicker = function (time, caller) {
	    var self = this;
	    var $caller = $(caller);
	    var fromDate = moment(time);
	    var $tds = self.$dateBox.find('td');
	    self.$dateBox.find('.btn-shortcut').removeClass('active');

	    if (+new Date(time) < +new Date(self.startDate)) {
	        self.rangeStep = 0;
	        $tds.remove(statusClassName);
	    }

	    if (self.rangeStep === 0) {
	        self.setStartTime(time, $caller);
	    } else {
	        self.setEndTime(time, $caller);
	        self.hideCalendar();
	    }
	};

	module.exports = {
	    idate: function idate(options) {
	        return new Idate(options);
	    }
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	//! moment.js
	//! version : 2.10.6
	//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
	//! license : MIT
	//! momentjs.com

	(function (global, factory) {
	    ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.moment = factory();
	})(undefined, function () {
	    'use strict';

	    var hookCallback;

	    function utils_hooks__hooks() {
	        return hookCallback.apply(null, arguments);
	    }

	    // This is done to register the method called with moment()
	    // without creating circular dependencies.
	    function setHookCallback(callback) {
	        hookCallback = callback;
	    }

	    function isArray(input) {
	        return Object.prototype.toString.call(input) === '[object Array]';
	    }

	    function isDate(input) {
	        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
	    }

	    function map(arr, fn) {
	        var res = [],
	            i;
	        for (i = 0; i < arr.length; ++i) {
	            res.push(fn(arr[i], i));
	        }
	        return res;
	    }

	    function hasOwnProp(a, b) {
	        return Object.prototype.hasOwnProperty.call(a, b);
	    }

	    function extend(a, b) {
	        for (var i in b) {
	            if (hasOwnProp(b, i)) {
	                a[i] = b[i];
	            }
	        }

	        if (hasOwnProp(b, 'toString')) {
	            a.toString = b.toString;
	        }

	        if (hasOwnProp(b, 'valueOf')) {
	            a.valueOf = b.valueOf;
	        }

	        return a;
	    }

	    function create_utc__createUTC(input, format, locale, strict) {
	        return createLocalOrUTC(input, format, locale, strict, true).utc();
	    }

	    function defaultParsingFlags() {
	        // We need to deep clone this object.
	        return {
	            empty: false,
	            unusedTokens: [],
	            unusedInput: [],
	            overflow: -2,
	            charsLeftOver: 0,
	            nullInput: false,
	            invalidMonth: null,
	            invalidFormat: false,
	            userInvalidated: false,
	            iso: false
	        };
	    }

	    function getParsingFlags(m) {
	        if (m._pf == null) {
	            m._pf = defaultParsingFlags();
	        }
	        return m._pf;
	    }

	    function valid__isValid(m) {
	        if (m._isValid == null) {
	            var flags = getParsingFlags(m);
	            m._isValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidMonth && !flags.invalidWeekday && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated;

	            if (m._strict) {
	                m._isValid = m._isValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === undefined;
	            }
	        }
	        return m._isValid;
	    }

	    function valid__createInvalid(flags) {
	        var m = create_utc__createUTC(NaN);
	        if (flags != null) {
	            extend(getParsingFlags(m), flags);
	        } else {
	            getParsingFlags(m).userInvalidated = true;
	        }

	        return m;
	    }

	    var momentProperties = utils_hooks__hooks.momentProperties = [];

	    function copyConfig(to, from) {
	        var i, prop, val;

	        if (typeof from._isAMomentObject !== 'undefined') {
	            to._isAMomentObject = from._isAMomentObject;
	        }
	        if (typeof from._i !== 'undefined') {
	            to._i = from._i;
	        }
	        if (typeof from._f !== 'undefined') {
	            to._f = from._f;
	        }
	        if (typeof from._l !== 'undefined') {
	            to._l = from._l;
	        }
	        if (typeof from._strict !== 'undefined') {
	            to._strict = from._strict;
	        }
	        if (typeof from._tzm !== 'undefined') {
	            to._tzm = from._tzm;
	        }
	        if (typeof from._isUTC !== 'undefined') {
	            to._isUTC = from._isUTC;
	        }
	        if (typeof from._offset !== 'undefined') {
	            to._offset = from._offset;
	        }
	        if (typeof from._pf !== 'undefined') {
	            to._pf = getParsingFlags(from);
	        }
	        if (typeof from._locale !== 'undefined') {
	            to._locale = from._locale;
	        }

	        if (momentProperties.length > 0) {
	            for (i in momentProperties) {
	                prop = momentProperties[i];
	                val = from[prop];
	                if (typeof val !== 'undefined') {
	                    to[prop] = val;
	                }
	            }
	        }

	        return to;
	    }

	    var updateInProgress = false;

	    // Moment prototype object
	    function Moment(config) {
	        copyConfig(this, config);
	        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
	        // Prevent infinite loop in case updateOffset creates new moment
	        // objects.
	        if (updateInProgress === false) {
	            updateInProgress = true;
	            utils_hooks__hooks.updateOffset(this);
	            updateInProgress = false;
	        }
	    }

	    function isMoment(obj) {
	        return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
	    }

	    function absFloor(number) {
	        if (number < 0) {
	            return Math.ceil(number);
	        } else {
	            return Math.floor(number);
	        }
	    }

	    function toInt(argumentForCoercion) {
	        var coercedNumber = +argumentForCoercion,
	            value = 0;

	        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
	            value = absFloor(coercedNumber);
	        }

	        return value;
	    }

	    function compareArrays(array1, array2, dontConvert) {
	        var len = Math.min(array1.length, array2.length),
	            lengthDiff = Math.abs(array1.length - array2.length),
	            diffs = 0,
	            i;
	        for (i = 0; i < len; i++) {
	            if (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) {
	                diffs++;
	            }
	        }
	        return diffs + lengthDiff;
	    }

	    function Locale() {}

	    var locales = {};
	    var globalLocale;

	    function normalizeLocale(key) {
	        return key ? key.toLowerCase().replace('_', '-') : key;
	    }

	    // pick the locale from the array
	    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	    function chooseLocale(names) {
	        var i = 0,
	            j,
	            next,
	            locale,
	            split;

	        while (i < names.length) {
	            split = normalizeLocale(names[i]).split('-');
	            j = split.length;
	            next = normalizeLocale(names[i + 1]);
	            next = next ? next.split('-') : null;
	            while (j > 0) {
	                locale = loadLocale(split.slice(0, j).join('-'));
	                if (locale) {
	                    return locale;
	                }
	                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
	                    //the next array item is better than a shallower substring of this one
	                    break;
	                }
	                j--;
	            }
	            i++;
	        }
	        return null;
	    }

	    function loadLocale(name) {
	        var oldLocale = null;
	        // TODO: Find a better way to register and load all the locales in Node
	        if (!locales[name] && typeof module !== 'undefined' && module && module.exports) {
	            try {
	                oldLocale = globalLocale._abbr;
	                __webpack_require__(25)("./" + name);
	                // because defineLocale currently also sets the global locale, we
	                // want to undo that for lazy loaded locales
	                locale_locales__getSetGlobalLocale(oldLocale);
	            } catch (e) {}
	        }
	        return locales[name];
	    }

	    // This function will load locale and then set the global locale.  If
	    // no arguments are passed in, it will simply return the current global
	    // locale key.
	    function locale_locales__getSetGlobalLocale(key, values) {
	        var data;
	        if (key) {
	            if (typeof values === 'undefined') {
	                data = locale_locales__getLocale(key);
	            } else {
	                data = defineLocale(key, values);
	            }

	            if (data) {
	                // moment.duration._locale = moment._locale = data;
	                globalLocale = data;
	            }
	        }

	        return globalLocale._abbr;
	    }

	    function defineLocale(name, values) {
	        if (values !== null) {
	            values.abbr = name;
	            locales[name] = locales[name] || new Locale();
	            locales[name].set(values);

	            // backwards compat for now: also set the locale
	            locale_locales__getSetGlobalLocale(name);

	            return locales[name];
	        } else {
	            // useful for testing
	            delete locales[name];
	            return null;
	        }
	    }

	    // returns locale data
	    function locale_locales__getLocale(key) {
	        var locale;

	        if (key && key._locale && key._locale._abbr) {
	            key = key._locale._abbr;
	        }

	        if (!key) {
	            return globalLocale;
	        }

	        if (!isArray(key)) {
	            //short-circuit everything else
	            locale = loadLocale(key);
	            if (locale) {
	                return locale;
	            }
	            key = [key];
	        }

	        return chooseLocale(key);
	    }

	    var aliases = {};

	    function addUnitAlias(unit, shorthand) {
	        var lowerCase = unit.toLowerCase();
	        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
	    }

	    function normalizeUnits(units) {
	        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
	    }

	    function normalizeObjectUnits(inputObject) {
	        var normalizedInput = {},
	            normalizedProp,
	            prop;

	        for (prop in inputObject) {
	            if (hasOwnProp(inputObject, prop)) {
	                normalizedProp = normalizeUnits(prop);
	                if (normalizedProp) {
	                    normalizedInput[normalizedProp] = inputObject[prop];
	                }
	            }
	        }

	        return normalizedInput;
	    }

	    function makeGetSet(unit, keepTime) {
	        return function (value) {
	            if (value != null) {
	                get_set__set(this, unit, value);
	                utils_hooks__hooks.updateOffset(this, keepTime);
	                return this;
	            } else {
	                return get_set__get(this, unit);
	            }
	        };
	    }

	    function get_set__get(mom, unit) {
	        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
	    }

	    function get_set__set(mom, unit, value) {
	        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
	    }

	    // MOMENTS

	    function getSet(units, value) {
	        var unit;
	        if ((typeof units === 'undefined' ? 'undefined' : _typeof(units)) === 'object') {
	            for (unit in units) {
	                this.set(unit, units[unit]);
	            }
	        } else {
	            units = normalizeUnits(units);
	            if (typeof this[units] === 'function') {
	                return this[units](value);
	            }
	        }
	        return this;
	    }

	    function zeroFill(number, targetLength, forceSign) {
	        var absNumber = '' + Math.abs(number),
	            zerosToFill = targetLength - absNumber.length,
	            sign = number >= 0;
	        return (sign ? forceSign ? '+' : '' : '-') + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
	    }

	    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

	    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

	    var formatFunctions = {};

	    var formatTokenFunctions = {};

	    // token:    'M'
	    // padded:   ['MM', 2]
	    // ordinal:  'Mo'
	    // callback: function () { this.month() + 1 }
	    function addFormatToken(token, padded, ordinal, callback) {
	        var func = callback;
	        if (typeof callback === 'string') {
	            func = function func() {
	                return this[callback]();
	            };
	        }
	        if (token) {
	            formatTokenFunctions[token] = func;
	        }
	        if (padded) {
	            formatTokenFunctions[padded[0]] = function () {
	                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
	            };
	        }
	        if (ordinal) {
	            formatTokenFunctions[ordinal] = function () {
	                return this.localeData().ordinal(func.apply(this, arguments), token);
	            };
	        }
	    }

	    function removeFormattingTokens(input) {
	        if (input.match(/\[[\s\S]/)) {
	            return input.replace(/^\[|\]$/g, '');
	        }
	        return input.replace(/\\/g, '');
	    }

	    function makeFormatFunction(format) {
	        var array = format.match(formattingTokens),
	            i,
	            length;

	        for (i = 0, length = array.length; i < length; i++) {
	            if (formatTokenFunctions[array[i]]) {
	                array[i] = formatTokenFunctions[array[i]];
	            } else {
	                array[i] = removeFormattingTokens(array[i]);
	            }
	        }

	        return function (mom) {
	            var output = '';
	            for (i = 0; i < length; i++) {
	                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
	            }
	            return output;
	        };
	    }

	    // format date using native date object
	    function formatMoment(m, format) {
	        if (!m.isValid()) {
	            return m.localeData().invalidDate();
	        }

	        format = expandFormat(format, m.localeData());
	        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

	        return formatFunctions[format](m);
	    }

	    function expandFormat(format, locale) {
	        var i = 5;

	        function replaceLongDateFormatTokens(input) {
	            return locale.longDateFormat(input) || input;
	        }

	        localFormattingTokens.lastIndex = 0;
	        while (i >= 0 && localFormattingTokens.test(format)) {
	            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
	            localFormattingTokens.lastIndex = 0;
	            i -= 1;
	        }

	        return format;
	    }

	    var match1 = /\d/; //       0 - 9
	    var match2 = /\d\d/; //      00 - 99
	    var match3 = /\d{3}/; //     000 - 999
	    var match4 = /\d{4}/; //    0000 - 9999
	    var match6 = /[+-]?\d{6}/; // -999999 - 999999
	    var match1to2 = /\d\d?/; //       0 - 99
	    var match1to3 = /\d{1,3}/; //       0 - 999
	    var match1to4 = /\d{1,4}/; //       0 - 9999
	    var match1to6 = /[+-]?\d{1,6}/; // -999999 - 999999

	    var matchUnsigned = /\d+/; //       0 - inf
	    var matchSigned = /[+-]?\d+/; //    -inf - inf

	    var matchOffset = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

	    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

	    // any word (or two) characters or numbers including two/three word month in arabic.
	    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

	    var regexes = {};

	    function isFunction(sth) {
	        // https://github.com/moment/moment/issues/2325
	        return typeof sth === 'function' && Object.prototype.toString.call(sth) === '[object Function]';
	    }

	    function addRegexToken(token, regex, strictRegex) {
	        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
	            return isStrict && strictRegex ? strictRegex : regex;
	        };
	    }

	    function getParseRegexForToken(token, config) {
	        if (!hasOwnProp(regexes, token)) {
	            return new RegExp(unescapeFormat(token));
	        }

	        return regexes[token](config._strict, config._locale);
	    }

	    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	    function unescapeFormat(s) {
	        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
	            return p1 || p2 || p3 || p4;
	        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	    }

	    var tokens = {};

	    function addParseToken(token, callback) {
	        var i,
	            func = callback;
	        if (typeof token === 'string') {
	            token = [token];
	        }
	        if (typeof callback === 'number') {
	            func = function func(input, array) {
	                array[callback] = toInt(input);
	            };
	        }
	        for (i = 0; i < token.length; i++) {
	            tokens[token[i]] = func;
	        }
	    }

	    function addWeekParseToken(token, callback) {
	        addParseToken(token, function (input, array, config, token) {
	            config._w = config._w || {};
	            callback(input, config._w, config, token);
	        });
	    }

	    function addTimeToArrayFromToken(token, input, config) {
	        if (input != null && hasOwnProp(tokens, token)) {
	            tokens[token](input, config._a, config, token);
	        }
	    }

	    var YEAR = 0;
	    var MONTH = 1;
	    var DATE = 2;
	    var HOUR = 3;
	    var MINUTE = 4;
	    var SECOND = 5;
	    var MILLISECOND = 6;

	    function daysInMonth(year, month) {
	        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	    }

	    // FORMATTING

	    addFormatToken('M', ['MM', 2], 'Mo', function () {
	        return this.month() + 1;
	    });

	    addFormatToken('MMM', 0, 0, function (format) {
	        return this.localeData().monthsShort(this, format);
	    });

	    addFormatToken('MMMM', 0, 0, function (format) {
	        return this.localeData().months(this, format);
	    });

	    // ALIASES

	    addUnitAlias('month', 'M');

	    // PARSING

	    addRegexToken('M', match1to2);
	    addRegexToken('MM', match1to2, match2);
	    addRegexToken('MMM', matchWord);
	    addRegexToken('MMMM', matchWord);

	    addParseToken(['M', 'MM'], function (input, array) {
	        array[MONTH] = toInt(input) - 1;
	    });

	    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
	        var month = config._locale.monthsParse(input, token, config._strict);
	        // if we didn't find a month name, mark the date as invalid.
	        if (month != null) {
	            array[MONTH] = month;
	        } else {
	            getParsingFlags(config).invalidMonth = input;
	        }
	    });

	    // LOCALES

	    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
	    function localeMonths(m) {
	        return this._months[m.month()];
	    }

	    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	    function localeMonthsShort(m) {
	        return this._monthsShort[m.month()];
	    }

	    function localeMonthsParse(monthName, format, strict) {
	        var i, mom, regex;

	        if (!this._monthsParse) {
	            this._monthsParse = [];
	            this._longMonthsParse = [];
	            this._shortMonthsParse = [];
	        }

	        for (i = 0; i < 12; i++) {
	            // make the regex if we don't have it already
	            mom = create_utc__createUTC([2000, i]);
	            if (strict && !this._longMonthsParse[i]) {
	                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
	                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
	            }
	            if (!strict && !this._monthsParse[i]) {
	                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
	                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
	            }
	            // test the regex
	            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
	                return i;
	            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
	                return i;
	            } else if (!strict && this._monthsParse[i].test(monthName)) {
	                return i;
	            }
	        }
	    }

	    // MOMENTS

	    function setMonth(mom, value) {
	        var dayOfMonth;

	        // TODO: Move this out of here!
	        if (typeof value === 'string') {
	            value = mom.localeData().monthsParse(value);
	            // TODO: Another silent failure?
	            if (typeof value !== 'number') {
	                return mom;
	            }
	        }

	        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
	        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
	        return mom;
	    }

	    function getSetMonth(value) {
	        if (value != null) {
	            setMonth(this, value);
	            utils_hooks__hooks.updateOffset(this, true);
	            return this;
	        } else {
	            return get_set__get(this, 'Month');
	        }
	    }

	    function getDaysInMonth() {
	        return daysInMonth(this.year(), this.month());
	    }

	    function checkOverflow(m) {
	        var overflow;
	        var a = m._a;

	        if (a && getParsingFlags(m).overflow === -2) {
	            overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;

	            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
	                overflow = DATE;
	            }

	            getParsingFlags(m).overflow = overflow;
	        }

	        return m;
	    }

	    function warn(msg) {
	        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
	            console.warn('Deprecation warning: ' + msg);
	        }
	    }

	    function deprecate(msg, fn) {
	        var firstTime = true;

	        return extend(function () {
	            if (firstTime) {
	                warn(msg + '\n' + new Error().stack);
	                firstTime = false;
	            }
	            return fn.apply(this, arguments);
	        }, fn);
	    }

	    var deprecations = {};

	    function deprecateSimple(name, msg) {
	        if (!deprecations[name]) {
	            warn(msg);
	            deprecations[name] = true;
	        }
	    }

	    utils_hooks__hooks.suppressDeprecationWarnings = false;

	    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

	    var isoDates = [['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/], ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/], ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/], ['GGGG-[W]WW', /\d{4}-W\d{2}/], ['YYYY-DDD', /\d{4}-\d{3}/]];

	    // iso time formats and regexes
	    var isoTimes = [['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/], ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/], ['HH:mm', /(T| )\d\d:\d\d/], ['HH', /(T| )\d\d/]];

	    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

	    // date from iso format
	    function configFromISO(config) {
	        var i,
	            l,
	            string = config._i,
	            match = from_string__isoRegex.exec(string);

	        if (match) {
	            getParsingFlags(config).iso = true;
	            for (i = 0, l = isoDates.length; i < l; i++) {
	                if (isoDates[i][1].exec(string)) {
	                    config._f = isoDates[i][0];
	                    break;
	                }
	            }
	            for (i = 0, l = isoTimes.length; i < l; i++) {
	                if (isoTimes[i][1].exec(string)) {
	                    // match[6] should be 'T' or space
	                    config._f += (match[6] || ' ') + isoTimes[i][0];
	                    break;
	                }
	            }
	            if (string.match(matchOffset)) {
	                config._f += 'Z';
	            }
	            configFromStringAndFormat(config);
	        } else {
	            config._isValid = false;
	        }
	    }

	    // date from iso format or fallback
	    function configFromString(config) {
	        var matched = aspNetJsonRegex.exec(config._i);

	        if (matched !== null) {
	            config._d = new Date(+matched[1]);
	            return;
	        }

	        configFromISO(config);
	        if (config._isValid === false) {
	            delete config._isValid;
	            utils_hooks__hooks.createFromInputFallback(config);
	        }
	    }

	    utils_hooks__hooks.createFromInputFallback = deprecate('moment construction falls back to js Date. This is ' + 'discouraged and will be removed in upcoming major ' + 'release. Please refer to ' + 'https://github.com/moment/moment/issues/1407 for more info.', function (config) {
	        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
	    });

	    function createDate(y, m, d, h, M, s, ms) {
	        //can't just apply() to create a date:
	        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
	        var date = new Date(y, m, d, h, M, s, ms);

	        //the date constructor doesn't accept years < 1970
	        if (y < 1970) {
	            date.setFullYear(y);
	        }
	        return date;
	    }

	    function createUTCDate(y) {
	        var date = new Date(Date.UTC.apply(null, arguments));
	        if (y < 1970) {
	            date.setUTCFullYear(y);
	        }
	        return date;
	    }

	    addFormatToken(0, ['YY', 2], 0, function () {
	        return this.year() % 100;
	    });

	    addFormatToken(0, ['YYYY', 4], 0, 'year');
	    addFormatToken(0, ['YYYYY', 5], 0, 'year');
	    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

	    // ALIASES

	    addUnitAlias('year', 'y');

	    // PARSING

	    addRegexToken('Y', matchSigned);
	    addRegexToken('YY', match1to2, match2);
	    addRegexToken('YYYY', match1to4, match4);
	    addRegexToken('YYYYY', match1to6, match6);
	    addRegexToken('YYYYYY', match1to6, match6);

	    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
	    addParseToken('YYYY', function (input, array) {
	        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
	    });
	    addParseToken('YY', function (input, array) {
	        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
	    });

	    // HELPERS

	    function daysInYear(year) {
	        return isLeapYear(year) ? 366 : 365;
	    }

	    function isLeapYear(year) {
	        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
	    }

	    // HOOKS

	    utils_hooks__hooks.parseTwoDigitYear = function (input) {
	        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
	    };

	    // MOMENTS

	    var getSetYear = makeGetSet('FullYear', false);

	    function getIsLeapYear() {
	        return isLeapYear(this.year());
	    }

	    addFormatToken('w', ['ww', 2], 'wo', 'week');
	    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

	    // ALIASES

	    addUnitAlias('week', 'w');
	    addUnitAlias('isoWeek', 'W');

	    // PARSING

	    addRegexToken('w', match1to2);
	    addRegexToken('ww', match1to2, match2);
	    addRegexToken('W', match1to2);
	    addRegexToken('WW', match1to2, match2);

	    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
	        week[token.substr(0, 1)] = toInt(input);
	    });

	    // HELPERS

	    // firstDayOfWeek       0 = sun, 6 = sat
	    //                      the day of the week that starts the week
	    //                      (usually sunday or monday)
	    // firstDayOfWeekOfYear 0 = sun, 6 = sat
	    //                      the first week is the week that contains the first
	    //                      of this day of the week
	    //                      (eg. ISO weeks use thursday (4))
	    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
	        var end = firstDayOfWeekOfYear - firstDayOfWeek,
	            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
	            adjustedMoment;

	        if (daysToDayOfWeek > end) {
	            daysToDayOfWeek -= 7;
	        }

	        if (daysToDayOfWeek < end - 7) {
	            daysToDayOfWeek += 7;
	        }

	        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
	        return {
	            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
	            year: adjustedMoment.year()
	        };
	    }

	    // LOCALES

	    function localeWeek(mom) {
	        return weekOfYear(mom, this._week.dow, this._week.doy).week;
	    }

	    var defaultLocaleWeek = {
	        dow: 0, // Sunday is the first day of the week.
	        doy: 6 // The week that contains Jan 1st is the first week of the year.
	    };

	    function localeFirstDayOfWeek() {
	        return this._week.dow;
	    }

	    function localeFirstDayOfYear() {
	        return this._week.doy;
	    }

	    // MOMENTS

	    function getSetWeek(input) {
	        var week = this.localeData().week(this);
	        return input == null ? week : this.add((input - week) * 7, 'd');
	    }

	    function getSetISOWeek(input) {
	        var week = weekOfYear(this, 1, 4).week;
	        return input == null ? week : this.add((input - week) * 7, 'd');
	    }

	    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

	    // ALIASES

	    addUnitAlias('dayOfYear', 'DDD');

	    // PARSING

	    addRegexToken('DDD', match1to3);
	    addRegexToken('DDDD', match3);
	    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
	        config._dayOfYear = toInt(input);
	    });

	    // HELPERS

	    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
	        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear,
	            janX = createUTCDate(year, 0, 1 + week1Jan),
	            d = janX.getUTCDay(),
	            dayOfYear;
	        if (d < firstDayOfWeek) {
	            d += 7;
	        }

	        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

	        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

	        return {
	            year: dayOfYear > 0 ? year : year - 1,
	            dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear(year - 1) + dayOfYear
	        };
	    }

	    // MOMENTS

	    function getSetDayOfYear(input) {
	        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
	        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
	    }

	    // Pick the first defined of two or three arguments.
	    function defaults(a, b, c) {
	        if (a != null) {
	            return a;
	        }
	        if (b != null) {
	            return b;
	        }
	        return c;
	    }

	    function currentDateArray(config) {
	        var now = new Date();
	        if (config._useUTC) {
	            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
	        }
	        return [now.getFullYear(), now.getMonth(), now.getDate()];
	    }

	    // convert an array to a date.
	    // the array should mirror the parameters below
	    // note: all values past the year are optional and will default to the lowest possible value.
	    // [year, month, day , hour, minute, second, millisecond]
	    function configFromArray(config) {
	        var i,
	            date,
	            input = [],
	            currentDate,
	            yearToUse;

	        if (config._d) {
	            return;
	        }

	        currentDate = currentDateArray(config);

	        //compute day of the year from weeks and weekdays
	        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
	            dayOfYearFromWeekInfo(config);
	        }

	        //if the day of the year is set, figure out what it is
	        if (config._dayOfYear) {
	            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

	            if (config._dayOfYear > daysInYear(yearToUse)) {
	                getParsingFlags(config)._overflowDayOfYear = true;
	            }

	            date = createUTCDate(yearToUse, 0, config._dayOfYear);
	            config._a[MONTH] = date.getUTCMonth();
	            config._a[DATE] = date.getUTCDate();
	        }

	        // Default to current date.
	        // * if no year, month, day of month are given, default to today
	        // * if day of month is given, default month and year
	        // * if month is given, default only year
	        // * if year is given, don't default anything
	        for (i = 0; i < 3 && config._a[i] == null; ++i) {
	            config._a[i] = input[i] = currentDate[i];
	        }

	        // Zero out whatever was not defaulted, including time
	        for (; i < 7; i++) {
	            config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
	        }

	        // Check for 24:00:00.000
	        if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
	            config._nextDay = true;
	            config._a[HOUR] = 0;
	        }

	        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
	        // Apply timezone offset from input. The actual utcOffset can be changed
	        // with parseZone.
	        if (config._tzm != null) {
	            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
	        }

	        if (config._nextDay) {
	            config._a[HOUR] = 24;
	        }
	    }

	    function dayOfYearFromWeekInfo(config) {
	        var w, weekYear, week, weekday, dow, doy, temp;

	        w = config._w;
	        if (w.GG != null || w.W != null || w.E != null) {
	            dow = 1;
	            doy = 4;

	            // TODO: We need to take the current isoWeekYear, but that depends on
	            // how we interpret now (local, utc, fixed offset). So create
	            // a now version of current config (take local/utc/offset flags, and
	            // create now).
	            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
	            week = defaults(w.W, 1);
	            weekday = defaults(w.E, 1);
	        } else {
	            dow = config._locale._week.dow;
	            doy = config._locale._week.doy;

	            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
	            week = defaults(w.w, 1);

	            if (w.d != null) {
	                // weekday -- low day numbers are considered next week
	                weekday = w.d;
	                if (weekday < dow) {
	                    ++week;
	                }
	            } else if (w.e != null) {
	                // local weekday -- counting starts from begining of week
	                weekday = w.e + dow;
	            } else {
	                // default to begining of week
	                weekday = dow;
	            }
	        }
	        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

	        config._a[YEAR] = temp.year;
	        config._dayOfYear = temp.dayOfYear;
	    }

	    utils_hooks__hooks.ISO_8601 = function () {};

	    // date from string and format string
	    function configFromStringAndFormat(config) {
	        // TODO: Move this to another part of the creation flow to prevent circular deps
	        if (config._f === utils_hooks__hooks.ISO_8601) {
	            configFromISO(config);
	            return;
	        }

	        config._a = [];
	        getParsingFlags(config).empty = true;

	        // This array is used to make a Date, either with `new Date` or `Date.UTC`
	        var string = '' + config._i,
	            i,
	            parsedInput,
	            tokens,
	            token,
	            skipped,
	            stringLength = string.length,
	            totalParsedInputLength = 0;

	        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

	        for (i = 0; i < tokens.length; i++) {
	            token = tokens[i];
	            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
	            if (parsedInput) {
	                skipped = string.substr(0, string.indexOf(parsedInput));
	                if (skipped.length > 0) {
	                    getParsingFlags(config).unusedInput.push(skipped);
	                }
	                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
	                totalParsedInputLength += parsedInput.length;
	            }
	            // don't parse if it's not a known token
	            if (formatTokenFunctions[token]) {
	                if (parsedInput) {
	                    getParsingFlags(config).empty = false;
	                } else {
	                    getParsingFlags(config).unusedTokens.push(token);
	                }
	                addTimeToArrayFromToken(token, parsedInput, config);
	            } else if (config._strict && !parsedInput) {
	                getParsingFlags(config).unusedTokens.push(token);
	            }
	        }

	        // add remaining unparsed input length to the string
	        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
	        if (string.length > 0) {
	            getParsingFlags(config).unusedInput.push(string);
	        }

	        // clear _12h flag if hour is <= 12
	        if (getParsingFlags(config).bigHour === true && config._a[HOUR] <= 12 && config._a[HOUR] > 0) {
	            getParsingFlags(config).bigHour = undefined;
	        }
	        // handle meridiem
	        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

	        configFromArray(config);
	        checkOverflow(config);
	    }

	    function meridiemFixWrap(locale, hour, meridiem) {
	        var isPm;

	        if (meridiem == null) {
	            // nothing to do
	            return hour;
	        }
	        if (locale.meridiemHour != null) {
	            return locale.meridiemHour(hour, meridiem);
	        } else if (locale.isPM != null) {
	            // Fallback
	            isPm = locale.isPM(meridiem);
	            if (isPm && hour < 12) {
	                hour += 12;
	            }
	            if (!isPm && hour === 12) {
	                hour = 0;
	            }
	            return hour;
	        } else {
	            // this is not supposed to happen
	            return hour;
	        }
	    }

	    function configFromStringAndArray(config) {
	        var tempConfig, bestMoment, scoreToBeat, i, currentScore;

	        if (config._f.length === 0) {
	            getParsingFlags(config).invalidFormat = true;
	            config._d = new Date(NaN);
	            return;
	        }

	        for (i = 0; i < config._f.length; i++) {
	            currentScore = 0;
	            tempConfig = copyConfig({}, config);
	            if (config._useUTC != null) {
	                tempConfig._useUTC = config._useUTC;
	            }
	            tempConfig._f = config._f[i];
	            configFromStringAndFormat(tempConfig);

	            if (!valid__isValid(tempConfig)) {
	                continue;
	            }

	            // if there is any input that was not parsed add a penalty for that format
	            currentScore += getParsingFlags(tempConfig).charsLeftOver;

	            //or tokens
	            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

	            getParsingFlags(tempConfig).score = currentScore;

	            if (scoreToBeat == null || currentScore < scoreToBeat) {
	                scoreToBeat = currentScore;
	                bestMoment = tempConfig;
	            }
	        }

	        extend(config, bestMoment || tempConfig);
	    }

	    function configFromObject(config) {
	        if (config._d) {
	            return;
	        }

	        var i = normalizeObjectUnits(config._i);
	        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

	        configFromArray(config);
	    }

	    function createFromConfig(config) {
	        var res = new Moment(checkOverflow(prepareConfig(config)));
	        if (res._nextDay) {
	            // Adding is smart enough around DST
	            res.add(1, 'd');
	            res._nextDay = undefined;
	        }

	        return res;
	    }

	    function prepareConfig(config) {
	        var input = config._i,
	            format = config._f;

	        config._locale = config._locale || locale_locales__getLocale(config._l);

	        if (input === null || format === undefined && input === '') {
	            return valid__createInvalid({ nullInput: true });
	        }

	        if (typeof input === 'string') {
	            config._i = input = config._locale.preparse(input);
	        }

	        if (isMoment(input)) {
	            return new Moment(checkOverflow(input));
	        } else if (isArray(format)) {
	            configFromStringAndArray(config);
	        } else if (format) {
	            configFromStringAndFormat(config);
	        } else if (isDate(input)) {
	            config._d = input;
	        } else {
	            configFromInput(config);
	        }

	        return config;
	    }

	    function configFromInput(config) {
	        var input = config._i;
	        if (input === undefined) {
	            config._d = new Date();
	        } else if (isDate(input)) {
	            config._d = new Date(+input);
	        } else if (typeof input === 'string') {
	            configFromString(config);
	        } else if (isArray(input)) {
	            config._a = map(input.slice(0), function (obj) {
	                return parseInt(obj, 10);
	            });
	            configFromArray(config);
	        } else if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
	            configFromObject(config);
	        } else if (typeof input === 'number') {
	            // from milliseconds
	            config._d = new Date(input);
	        } else {
	            utils_hooks__hooks.createFromInputFallback(config);
	        }
	    }

	    function createLocalOrUTC(input, format, locale, strict, isUTC) {
	        var c = {};

	        if (typeof locale === 'boolean') {
	            strict = locale;
	            locale = undefined;
	        }
	        // object construction must be done this way.
	        // https://github.com/moment/moment/issues/1423
	        c._isAMomentObject = true;
	        c._useUTC = c._isUTC = isUTC;
	        c._l = locale;
	        c._i = input;
	        c._f = format;
	        c._strict = strict;

	        return createFromConfig(c);
	    }

	    function local__createLocal(input, format, locale, strict) {
	        return createLocalOrUTC(input, format, locale, strict, false);
	    }

	    var prototypeMin = deprecate('moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548', function () {
	        var other = local__createLocal.apply(null, arguments);
	        return other < this ? this : other;
	    });

	    var prototypeMax = deprecate('moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548', function () {
	        var other = local__createLocal.apply(null, arguments);
	        return other > this ? this : other;
	    });

	    // Pick a moment m from moments so that m[fn](other) is true for all
	    // other. This relies on the function fn to be transitive.
	    //
	    // moments should either be an array of moment objects or an array, whose
	    // first element is an array of moment objects.
	    function pickBy(fn, moments) {
	        var res, i;
	        if (moments.length === 1 && isArray(moments[0])) {
	            moments = moments[0];
	        }
	        if (!moments.length) {
	            return local__createLocal();
	        }
	        res = moments[0];
	        for (i = 1; i < moments.length; ++i) {
	            if (!moments[i].isValid() || moments[i][fn](res)) {
	                res = moments[i];
	            }
	        }
	        return res;
	    }

	    // TODO: Use [].sort instead?
	    function min() {
	        var args = [].slice.call(arguments, 0);

	        return pickBy('isBefore', args);
	    }

	    function max() {
	        var args = [].slice.call(arguments, 0);

	        return pickBy('isAfter', args);
	    }

	    function Duration(duration) {
	        var normalizedInput = normalizeObjectUnits(duration),
	            years = normalizedInput.year || 0,
	            quarters = normalizedInput.quarter || 0,
	            months = normalizedInput.month || 0,
	            weeks = normalizedInput.week || 0,
	            days = normalizedInput.day || 0,
	            hours = normalizedInput.hour || 0,
	            minutes = normalizedInput.minute || 0,
	            seconds = normalizedInput.second || 0,
	            milliseconds = normalizedInput.millisecond || 0;

	        // representation for dateAddRemove
	        this._milliseconds = +milliseconds + seconds * 1e3 + // 1000
	        minutes * 6e4 + // 1000 * 60
	        hours * 36e5; // 1000 * 60 * 60
	        // Because of dateAddRemove treats 24 hours as different from a
	        // day when working around DST, we need to store them separately
	        this._days = +days + weeks * 7;
	        // It is impossible translate months into days without knowing
	        // which months you are are talking about, so we have to store
	        // it separately.
	        this._months = +months + quarters * 3 + years * 12;

	        this._data = {};

	        this._locale = locale_locales__getLocale();

	        this._bubble();
	    }

	    function isDuration(obj) {
	        return obj instanceof Duration;
	    }

	    function offset(token, separator) {
	        addFormatToken(token, 0, 0, function () {
	            var offset = this.utcOffset();
	            var sign = '+';
	            if (offset < 0) {
	                offset = -offset;
	                sign = '-';
	            }
	            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~offset % 60, 2);
	        });
	    }

	    offset('Z', ':');
	    offset('ZZ', '');

	    // PARSING

	    addRegexToken('Z', matchOffset);
	    addRegexToken('ZZ', matchOffset);
	    addParseToken(['Z', 'ZZ'], function (input, array, config) {
	        config._useUTC = true;
	        config._tzm = offsetFromString(input);
	    });

	    // HELPERS

	    // timezone chunker
	    // '+10:00' > ['10',  '00']
	    // '-1530'  > ['-15', '30']
	    var chunkOffset = /([\+\-]|\d\d)/gi;

	    function offsetFromString(string) {
	        var matches = (string || '').match(matchOffset) || [];
	        var chunk = matches[matches.length - 1] || [];
	        var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
	        var minutes = +(parts[1] * 60) + toInt(parts[2]);

	        return parts[0] === '+' ? minutes : -minutes;
	    }

	    // Return a moment from input, that is local/utc/zone equivalent to model.
	    function cloneWithOffset(input, model) {
	        var res, diff;
	        if (model._isUTC) {
	            res = model.clone();
	            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - +res;
	            // Use low-level api, because this fn is low-level api.
	            res._d.setTime(+res._d + diff);
	            utils_hooks__hooks.updateOffset(res, false);
	            return res;
	        } else {
	            return local__createLocal(input).local();
	        }
	    }

	    function getDateOffset(m) {
	        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
	        // https://github.com/moment/moment/pull/1871
	        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
	    }

	    // HOOKS

	    // This function will be called whenever a moment is mutated.
	    // It is intended to keep the offset in sync with the timezone.
	    utils_hooks__hooks.updateOffset = function () {};

	    // MOMENTS

	    // keepLocalTime = true means only change the timezone, without
	    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	    // +0200, so we adjust the time as needed, to be valid.
	    //
	    // Keeping the time actually adds/subtracts (one hour)
	    // from the actual represented time. That is why we call updateOffset
	    // a second time. In case it wants us to change the offset again
	    // _changeInProgress == true case, then we have to adjust, because
	    // there is no such time in the given timezone.
	    function getSetOffset(input, keepLocalTime) {
	        var offset = this._offset || 0,
	            localAdjust;
	        if (input != null) {
	            if (typeof input === 'string') {
	                input = offsetFromString(input);
	            }
	            if (Math.abs(input) < 16) {
	                input = input * 60;
	            }
	            if (!this._isUTC && keepLocalTime) {
	                localAdjust = getDateOffset(this);
	            }
	            this._offset = input;
	            this._isUTC = true;
	            if (localAdjust != null) {
	                this.add(localAdjust, 'm');
	            }
	            if (offset !== input) {
	                if (!keepLocalTime || this._changeInProgress) {
	                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
	                } else if (!this._changeInProgress) {
	                    this._changeInProgress = true;
	                    utils_hooks__hooks.updateOffset(this, true);
	                    this._changeInProgress = null;
	                }
	            }
	            return this;
	        } else {
	            return this._isUTC ? offset : getDateOffset(this);
	        }
	    }

	    function getSetZone(input, keepLocalTime) {
	        if (input != null) {
	            if (typeof input !== 'string') {
	                input = -input;
	            }

	            this.utcOffset(input, keepLocalTime);

	            return this;
	        } else {
	            return -this.utcOffset();
	        }
	    }

	    function setOffsetToUTC(keepLocalTime) {
	        return this.utcOffset(0, keepLocalTime);
	    }

	    function setOffsetToLocal(keepLocalTime) {
	        if (this._isUTC) {
	            this.utcOffset(0, keepLocalTime);
	            this._isUTC = false;

	            if (keepLocalTime) {
	                this.subtract(getDateOffset(this), 'm');
	            }
	        }
	        return this;
	    }

	    function setOffsetToParsedOffset() {
	        if (this._tzm) {
	            this.utcOffset(this._tzm);
	        } else if (typeof this._i === 'string') {
	            this.utcOffset(offsetFromString(this._i));
	        }
	        return this;
	    }

	    function hasAlignedHourOffset(input) {
	        input = input ? local__createLocal(input).utcOffset() : 0;

	        return (this.utcOffset() - input) % 60 === 0;
	    }

	    function isDaylightSavingTime() {
	        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
	    }

	    function isDaylightSavingTimeShifted() {
	        if (typeof this._isDSTShifted !== 'undefined') {
	            return this._isDSTShifted;
	        }

	        var c = {};

	        copyConfig(c, this);
	        c = prepareConfig(c);

	        if (c._a) {
	            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
	            this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
	        } else {
	            this._isDSTShifted = false;
	        }

	        return this._isDSTShifted;
	    }

	    function isLocal() {
	        return !this._isUTC;
	    }

	    function isUtcOffset() {
	        return this._isUTC;
	    }

	    function isUtc() {
	        return this._isUTC && this._offset === 0;
	    }

	    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

	    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

	    function create__createDuration(input, key) {
	        var duration = input,

	        // matching against regexp is expensive, do it on demand
	        match = null,
	            sign,
	            ret,
	            diffRes;

	        if (isDuration(input)) {
	            duration = {
	                ms: input._milliseconds,
	                d: input._days,
	                M: input._months
	            };
	        } else if (typeof input === 'number') {
	            duration = {};
	            if (key) {
	                duration[key] = input;
	            } else {
	                duration.milliseconds = input;
	            }
	        } else if (!!(match = aspNetRegex.exec(input))) {
	            sign = match[1] === '-' ? -1 : 1;
	            duration = {
	                y: 0,
	                d: toInt(match[DATE]) * sign,
	                h: toInt(match[HOUR]) * sign,
	                m: toInt(match[MINUTE]) * sign,
	                s: toInt(match[SECOND]) * sign,
	                ms: toInt(match[MILLISECOND]) * sign
	            };
	        } else if (!!(match = create__isoRegex.exec(input))) {
	            sign = match[1] === '-' ? -1 : 1;
	            duration = {
	                y: parseIso(match[2], sign),
	                M: parseIso(match[3], sign),
	                d: parseIso(match[4], sign),
	                h: parseIso(match[5], sign),
	                m: parseIso(match[6], sign),
	                s: parseIso(match[7], sign),
	                w: parseIso(match[8], sign)
	            };
	        } else if (duration == null) {
	            // checks for null or undefined
	            duration = {};
	        } else if ((typeof duration === 'undefined' ? 'undefined' : _typeof(duration)) === 'object' && ('from' in duration || 'to' in duration)) {
	            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

	            duration = {};
	            duration.ms = diffRes.milliseconds;
	            duration.M = diffRes.months;
	        }

	        ret = new Duration(duration);

	        if (isDuration(input) && hasOwnProp(input, '_locale')) {
	            ret._locale = input._locale;
	        }

	        return ret;
	    }

	    create__createDuration.fn = Duration.prototype;

	    function parseIso(inp, sign) {
	        // We'd normally use ~~inp for this, but unfortunately it also
	        // converts floats to ints.
	        // inp may be undefined, so careful calling replace on it.
	        var res = inp && parseFloat(inp.replace(',', '.'));
	        // apply sign while we're at it
	        return (isNaN(res) ? 0 : res) * sign;
	    }

	    function positiveMomentsDifference(base, other) {
	        var res = { milliseconds: 0, months: 0 };

	        res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
	        if (base.clone().add(res.months, 'M').isAfter(other)) {
	            --res.months;
	        }

	        res.milliseconds = +other - +base.clone().add(res.months, 'M');

	        return res;
	    }

	    function momentsDifference(base, other) {
	        var res;
	        other = cloneWithOffset(other, base);
	        if (base.isBefore(other)) {
	            res = positiveMomentsDifference(base, other);
	        } else {
	            res = positiveMomentsDifference(other, base);
	            res.milliseconds = -res.milliseconds;
	            res.months = -res.months;
	        }

	        return res;
	    }

	    function createAdder(direction, name) {
	        return function (val, period) {
	            var dur, tmp;
	            //invert the arguments, but complain about it
	            if (period !== null && !isNaN(+period)) {
	                deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
	                tmp = val;val = period;period = tmp;
	            }

	            val = typeof val === 'string' ? +val : val;
	            dur = create__createDuration(val, period);
	            add_subtract__addSubtract(this, dur, direction);
	            return this;
	        };
	    }

	    function add_subtract__addSubtract(mom, duration, isAdding, updateOffset) {
	        var milliseconds = duration._milliseconds,
	            days = duration._days,
	            months = duration._months;
	        updateOffset = updateOffset == null ? true : updateOffset;

	        if (milliseconds) {
	            mom._d.setTime(+mom._d + milliseconds * isAdding);
	        }
	        if (days) {
	            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
	        }
	        if (months) {
	            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
	        }
	        if (updateOffset) {
	            utils_hooks__hooks.updateOffset(mom, days || months);
	        }
	    }

	    var add_subtract__add = createAdder(1, 'add');
	    var add_subtract__subtract = createAdder(-1, 'subtract');

	    function moment_calendar__calendar(time, formats) {
	        // We want to compare the start of today, vs this.
	        // Getting start-of-today depends on whether we're local/utc/offset or not.
	        var now = time || local__createLocal(),
	            sod = cloneWithOffset(now, this).startOf('day'),
	            diff = this.diff(sod, 'days', true),
	            format = diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
	        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
	    }

	    function clone() {
	        return new Moment(this);
	    }

	    function isAfter(input, units) {
	        var inputMs;
	        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
	        if (units === 'millisecond') {
	            input = isMoment(input) ? input : local__createLocal(input);
	            return +this > +input;
	        } else {
	            inputMs = isMoment(input) ? +input : +local__createLocal(input);
	            return inputMs < +this.clone().startOf(units);
	        }
	    }

	    function isBefore(input, units) {
	        var inputMs;
	        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
	        if (units === 'millisecond') {
	            input = isMoment(input) ? input : local__createLocal(input);
	            return +this < +input;
	        } else {
	            inputMs = isMoment(input) ? +input : +local__createLocal(input);
	            return +this.clone().endOf(units) < inputMs;
	        }
	    }

	    function isBetween(from, to, units) {
	        return this.isAfter(from, units) && this.isBefore(to, units);
	    }

	    function isSame(input, units) {
	        var inputMs;
	        units = normalizeUnits(units || 'millisecond');
	        if (units === 'millisecond') {
	            input = isMoment(input) ? input : local__createLocal(input);
	            return +this === +input;
	        } else {
	            inputMs = +local__createLocal(input);
	            return +this.clone().startOf(units) <= inputMs && inputMs <= +this.clone().endOf(units);
	        }
	    }

	    function diff(input, units, asFloat) {
	        var that = cloneWithOffset(input, this),
	            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
	            delta,
	            output;

	        units = normalizeUnits(units);

	        if (units === 'year' || units === 'month' || units === 'quarter') {
	            output = monthDiff(this, that);
	            if (units === 'quarter') {
	                output = output / 3;
	            } else if (units === 'year') {
	                output = output / 12;
	            }
	        } else {
	            delta = this - that;
	            output = units === 'second' ? delta / 1e3 : // 1000
	            units === 'minute' ? delta / 6e4 : // 1000 * 60
	            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
	            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
	            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
	            delta;
	        }
	        return asFloat ? output : absFloor(output);
	    }

	    function monthDiff(a, b) {
	        // difference in months
	        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),

	        // b is in (anchor - 1 month, anchor + 1 month)
	        anchor = a.clone().add(wholeMonthDiff, 'months'),
	            anchor2,
	            adjust;

	        if (b - anchor < 0) {
	            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
	            // linear across the month
	            adjust = (b - anchor) / (anchor - anchor2);
	        } else {
	            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
	            // linear across the month
	            adjust = (b - anchor) / (anchor2 - anchor);
	        }

	        return -(wholeMonthDiff + adjust);
	    }

	    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

	    function toString() {
	        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
	    }

	    function moment_format__toISOString() {
	        var m = this.clone().utc();
	        if (0 < m.year() && m.year() <= 9999) {
	            if ('function' === typeof Date.prototype.toISOString) {
	                // native implementation is ~50x faster, use it when we can
	                return this.toDate().toISOString();
	            } else {
	                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	            }
	        } else {
	            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	        }
	    }

	    function format(inputString) {
	        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
	        return this.localeData().postformat(output);
	    }

	    function from(time, withoutSuffix) {
	        if (!this.isValid()) {
	            return this.localeData().invalidDate();
	        }
	        return create__createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
	    }

	    function fromNow(withoutSuffix) {
	        return this.from(local__createLocal(), withoutSuffix);
	    }

	    function to(time, withoutSuffix) {
	        if (!this.isValid()) {
	            return this.localeData().invalidDate();
	        }
	        return create__createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
	    }

	    function toNow(withoutSuffix) {
	        return this.to(local__createLocal(), withoutSuffix);
	    }

	    function locale(key) {
	        var newLocaleData;

	        if (key === undefined) {
	            return this._locale._abbr;
	        } else {
	            newLocaleData = locale_locales__getLocale(key);
	            if (newLocaleData != null) {
	                this._locale = newLocaleData;
	            }
	            return this;
	        }
	    }

	    var lang = deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function (key) {
	        if (key === undefined) {
	            return this.localeData();
	        } else {
	            return this.locale(key);
	        }
	    });

	    function localeData() {
	        return this._locale;
	    }

	    function startOf(units) {
	        units = normalizeUnits(units);
	        // the following switch intentionally omits break keywords
	        // to utilize falling through the cases.
	        switch (units) {
	            case 'year':
	                this.month(0);
	            /* falls through */
	            case 'quarter':
	            case 'month':
	                this.date(1);
	            /* falls through */
	            case 'week':
	            case 'isoWeek':
	            case 'day':
	                this.hours(0);
	            /* falls through */
	            case 'hour':
	                this.minutes(0);
	            /* falls through */
	            case 'minute':
	                this.seconds(0);
	            /* falls through */
	            case 'second':
	                this.milliseconds(0);
	        }

	        // weeks are a special case
	        if (units === 'week') {
	            this.weekday(0);
	        }
	        if (units === 'isoWeek') {
	            this.isoWeekday(1);
	        }

	        // quarters are also special
	        if (units === 'quarter') {
	            this.month(Math.floor(this.month() / 3) * 3);
	        }

	        return this;
	    }

	    function endOf(units) {
	        units = normalizeUnits(units);
	        if (units === undefined || units === 'millisecond') {
	            return this;
	        }
	        return this.startOf(units).add(1, units === 'isoWeek' ? 'week' : units).subtract(1, 'ms');
	    }

	    function to_type__valueOf() {
	        return +this._d - (this._offset || 0) * 60000;
	    }

	    function unix() {
	        return Math.floor(+this / 1000);
	    }

	    function toDate() {
	        return this._offset ? new Date(+this) : this._d;
	    }

	    function toArray() {
	        var m = this;
	        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
	    }

	    function toObject() {
	        var m = this;
	        return {
	            years: m.year(),
	            months: m.month(),
	            date: m.date(),
	            hours: m.hours(),
	            minutes: m.minutes(),
	            seconds: m.seconds(),
	            milliseconds: m.milliseconds()
	        };
	    }

	    function moment_valid__isValid() {
	        return valid__isValid(this);
	    }

	    function parsingFlags() {
	        return extend({}, getParsingFlags(this));
	    }

	    function invalidAt() {
	        return getParsingFlags(this).overflow;
	    }

	    addFormatToken(0, ['gg', 2], 0, function () {
	        return this.weekYear() % 100;
	    });

	    addFormatToken(0, ['GG', 2], 0, function () {
	        return this.isoWeekYear() % 100;
	    });

	    function addWeekYearFormatToken(token, getter) {
	        addFormatToken(0, [token, token.length], 0, getter);
	    }

	    addWeekYearFormatToken('gggg', 'weekYear');
	    addWeekYearFormatToken('ggggg', 'weekYear');
	    addWeekYearFormatToken('GGGG', 'isoWeekYear');
	    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

	    // ALIASES

	    addUnitAlias('weekYear', 'gg');
	    addUnitAlias('isoWeekYear', 'GG');

	    // PARSING

	    addRegexToken('G', matchSigned);
	    addRegexToken('g', matchSigned);
	    addRegexToken('GG', match1to2, match2);
	    addRegexToken('gg', match1to2, match2);
	    addRegexToken('GGGG', match1to4, match4);
	    addRegexToken('gggg', match1to4, match4);
	    addRegexToken('GGGGG', match1to6, match6);
	    addRegexToken('ggggg', match1to6, match6);

	    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
	        week[token.substr(0, 2)] = toInt(input);
	    });

	    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
	        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
	    });

	    // HELPERS

	    function weeksInYear(year, dow, doy) {
	        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
	    }

	    // MOMENTS

	    function getSetWeekYear(input) {
	        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
	        return input == null ? year : this.add(input - year, 'y');
	    }

	    function getSetISOWeekYear(input) {
	        var year = weekOfYear(this, 1, 4).year;
	        return input == null ? year : this.add(input - year, 'y');
	    }

	    function getISOWeeksInYear() {
	        return weeksInYear(this.year(), 1, 4);
	    }

	    function getWeeksInYear() {
	        var weekInfo = this.localeData()._week;
	        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
	    }

	    addFormatToken('Q', 0, 0, 'quarter');

	    // ALIASES

	    addUnitAlias('quarter', 'Q');

	    // PARSING

	    addRegexToken('Q', match1);
	    addParseToken('Q', function (input, array) {
	        array[MONTH] = (toInt(input) - 1) * 3;
	    });

	    // MOMENTS

	    function getSetQuarter(input) {
	        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
	    }

	    addFormatToken('D', ['DD', 2], 'Do', 'date');

	    // ALIASES

	    addUnitAlias('date', 'D');

	    // PARSING

	    addRegexToken('D', match1to2);
	    addRegexToken('DD', match1to2, match2);
	    addRegexToken('Do', function (isStrict, locale) {
	        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
	    });

	    addParseToken(['D', 'DD'], DATE);
	    addParseToken('Do', function (input, array) {
	        array[DATE] = toInt(input.match(match1to2)[0], 10);
	    });

	    // MOMENTS

	    var getSetDayOfMonth = makeGetSet('Date', true);

	    addFormatToken('d', 0, 'do', 'day');

	    addFormatToken('dd', 0, 0, function (format) {
	        return this.localeData().weekdaysMin(this, format);
	    });

	    addFormatToken('ddd', 0, 0, function (format) {
	        return this.localeData().weekdaysShort(this, format);
	    });

	    addFormatToken('dddd', 0, 0, function (format) {
	        return this.localeData().weekdays(this, format);
	    });

	    addFormatToken('e', 0, 0, 'weekday');
	    addFormatToken('E', 0, 0, 'isoWeekday');

	    // ALIASES

	    addUnitAlias('day', 'd');
	    addUnitAlias('weekday', 'e');
	    addUnitAlias('isoWeekday', 'E');

	    // PARSING

	    addRegexToken('d', match1to2);
	    addRegexToken('e', match1to2);
	    addRegexToken('E', match1to2);
	    addRegexToken('dd', matchWord);
	    addRegexToken('ddd', matchWord);
	    addRegexToken('dddd', matchWord);

	    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
	        var weekday = config._locale.weekdaysParse(input);
	        // if we didn't get a weekday name, mark the date as invalid
	        if (weekday != null) {
	            week.d = weekday;
	        } else {
	            getParsingFlags(config).invalidWeekday = input;
	        }
	    });

	    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
	        week[token] = toInt(input);
	    });

	    // HELPERS

	    function parseWeekday(input, locale) {
	        if (typeof input !== 'string') {
	            return input;
	        }

	        if (!isNaN(input)) {
	            return parseInt(input, 10);
	        }

	        input = locale.weekdaysParse(input);
	        if (typeof input === 'number') {
	            return input;
	        }

	        return null;
	    }

	    // LOCALES

	    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
	    function localeWeekdays(m) {
	        return this._weekdays[m.day()];
	    }

	    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
	    function localeWeekdaysShort(m) {
	        return this._weekdaysShort[m.day()];
	    }

	    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
	    function localeWeekdaysMin(m) {
	        return this._weekdaysMin[m.day()];
	    }

	    function localeWeekdaysParse(weekdayName) {
	        var i, mom, regex;

	        this._weekdaysParse = this._weekdaysParse || [];

	        for (i = 0; i < 7; i++) {
	            // make the regex if we don't have it already
	            if (!this._weekdaysParse[i]) {
	                mom = local__createLocal([2000, 1]).day(i);
	                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
	                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
	            }
	            // test the regex
	            if (this._weekdaysParse[i].test(weekdayName)) {
	                return i;
	            }
	        }
	    }

	    // MOMENTS

	    function getSetDayOfWeek(input) {
	        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
	        if (input != null) {
	            input = parseWeekday(input, this.localeData());
	            return this.add(input - day, 'd');
	        } else {
	            return day;
	        }
	    }

	    function getSetLocaleDayOfWeek(input) {
	        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
	        return input == null ? weekday : this.add(input - weekday, 'd');
	    }

	    function getSetISODayOfWeek(input) {
	        // behaves the same as moment#day except
	        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	        // as a setter, sunday should belong to the previous week.
	        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
	    }

	    addFormatToken('H', ['HH', 2], 0, 'hour');
	    addFormatToken('h', ['hh', 2], 0, function () {
	        return this.hours() % 12 || 12;
	    });

	    function meridiem(token, lowercase) {
	        addFormatToken(token, 0, 0, function () {
	            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
	        });
	    }

	    meridiem('a', true);
	    meridiem('A', false);

	    // ALIASES

	    addUnitAlias('hour', 'h');

	    // PARSING

	    function matchMeridiem(isStrict, locale) {
	        return locale._meridiemParse;
	    }

	    addRegexToken('a', matchMeridiem);
	    addRegexToken('A', matchMeridiem);
	    addRegexToken('H', match1to2);
	    addRegexToken('h', match1to2);
	    addRegexToken('HH', match1to2, match2);
	    addRegexToken('hh', match1to2, match2);

	    addParseToken(['H', 'HH'], HOUR);
	    addParseToken(['a', 'A'], function (input, array, config) {
	        config._isPm = config._locale.isPM(input);
	        config._meridiem = input;
	    });
	    addParseToken(['h', 'hh'], function (input, array, config) {
	        array[HOUR] = toInt(input);
	        getParsingFlags(config).bigHour = true;
	    });

	    // LOCALES

	    function localeIsPM(input) {
	        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	        // Using charAt should be more compatible.
	        return (input + '').toLowerCase().charAt(0) === 'p';
	    }

	    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
	    function localeMeridiem(hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'pm' : 'PM';
	        } else {
	            return isLower ? 'am' : 'AM';
	        }
	    }

	    // MOMENTS

	    // Setting the hour should keep the time, because the user explicitly
	    // specified which hour he wants. So trying to maintain the same hour (in
	    // a new timezone) makes sense. Adding/subtracting hours does not follow
	    // this rule.
	    var getSetHour = makeGetSet('Hours', true);

	    addFormatToken('m', ['mm', 2], 0, 'minute');

	    // ALIASES

	    addUnitAlias('minute', 'm');

	    // PARSING

	    addRegexToken('m', match1to2);
	    addRegexToken('mm', match1to2, match2);
	    addParseToken(['m', 'mm'], MINUTE);

	    // MOMENTS

	    var getSetMinute = makeGetSet('Minutes', false);

	    addFormatToken('s', ['ss', 2], 0, 'second');

	    // ALIASES

	    addUnitAlias('second', 's');

	    // PARSING

	    addRegexToken('s', match1to2);
	    addRegexToken('ss', match1to2, match2);
	    addParseToken(['s', 'ss'], SECOND);

	    // MOMENTS

	    var getSetSecond = makeGetSet('Seconds', false);

	    addFormatToken('S', 0, 0, function () {
	        return ~~(this.millisecond() / 100);
	    });

	    addFormatToken(0, ['SS', 2], 0, function () {
	        return ~~(this.millisecond() / 10);
	    });

	    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
	    addFormatToken(0, ['SSSS', 4], 0, function () {
	        return this.millisecond() * 10;
	    });
	    addFormatToken(0, ['SSSSS', 5], 0, function () {
	        return this.millisecond() * 100;
	    });
	    addFormatToken(0, ['SSSSSS', 6], 0, function () {
	        return this.millisecond() * 1000;
	    });
	    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
	        return this.millisecond() * 10000;
	    });
	    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
	        return this.millisecond() * 100000;
	    });
	    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
	        return this.millisecond() * 1000000;
	    });

	    // ALIASES

	    addUnitAlias('millisecond', 'ms');

	    // PARSING

	    addRegexToken('S', match1to3, match1);
	    addRegexToken('SS', match1to3, match2);
	    addRegexToken('SSS', match1to3, match3);

	    var token;
	    for (token = 'SSSS'; token.length <= 9; token += 'S') {
	        addRegexToken(token, matchUnsigned);
	    }

	    function parseMs(input, array) {
	        array[MILLISECOND] = toInt(('0.' + input) * 1000);
	    }

	    for (token = 'S'; token.length <= 9; token += 'S') {
	        addParseToken(token, parseMs);
	    }
	    // MOMENTS

	    var getSetMillisecond = makeGetSet('Milliseconds', false);

	    addFormatToken('z', 0, 0, 'zoneAbbr');
	    addFormatToken('zz', 0, 0, 'zoneName');

	    // MOMENTS

	    function getZoneAbbr() {
	        return this._isUTC ? 'UTC' : '';
	    }

	    function getZoneName() {
	        return this._isUTC ? 'Coordinated Universal Time' : '';
	    }

	    var momentPrototype__proto = Moment.prototype;

	    momentPrototype__proto.add = add_subtract__add;
	    momentPrototype__proto.calendar = moment_calendar__calendar;
	    momentPrototype__proto.clone = clone;
	    momentPrototype__proto.diff = diff;
	    momentPrototype__proto.endOf = endOf;
	    momentPrototype__proto.format = format;
	    momentPrototype__proto.from = from;
	    momentPrototype__proto.fromNow = fromNow;
	    momentPrototype__proto.to = to;
	    momentPrototype__proto.toNow = toNow;
	    momentPrototype__proto.get = getSet;
	    momentPrototype__proto.invalidAt = invalidAt;
	    momentPrototype__proto.isAfter = isAfter;
	    momentPrototype__proto.isBefore = isBefore;
	    momentPrototype__proto.isBetween = isBetween;
	    momentPrototype__proto.isSame = isSame;
	    momentPrototype__proto.isValid = moment_valid__isValid;
	    momentPrototype__proto.lang = lang;
	    momentPrototype__proto.locale = locale;
	    momentPrototype__proto.localeData = localeData;
	    momentPrototype__proto.max = prototypeMax;
	    momentPrototype__proto.min = prototypeMin;
	    momentPrototype__proto.parsingFlags = parsingFlags;
	    momentPrototype__proto.set = getSet;
	    momentPrototype__proto.startOf = startOf;
	    momentPrototype__proto.subtract = add_subtract__subtract;
	    momentPrototype__proto.toArray = toArray;
	    momentPrototype__proto.toObject = toObject;
	    momentPrototype__proto.toDate = toDate;
	    momentPrototype__proto.toISOString = moment_format__toISOString;
	    momentPrototype__proto.toJSON = moment_format__toISOString;
	    momentPrototype__proto.toString = toString;
	    momentPrototype__proto.unix = unix;
	    momentPrototype__proto.valueOf = to_type__valueOf;

	    // Year
	    momentPrototype__proto.year = getSetYear;
	    momentPrototype__proto.isLeapYear = getIsLeapYear;

	    // Week Year
	    momentPrototype__proto.weekYear = getSetWeekYear;
	    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

	    // Quarter
	    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

	    // Month
	    momentPrototype__proto.month = getSetMonth;
	    momentPrototype__proto.daysInMonth = getDaysInMonth;

	    // Week
	    momentPrototype__proto.week = momentPrototype__proto.weeks = getSetWeek;
	    momentPrototype__proto.isoWeek = momentPrototype__proto.isoWeeks = getSetISOWeek;
	    momentPrototype__proto.weeksInYear = getWeeksInYear;
	    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

	    // Day
	    momentPrototype__proto.date = getSetDayOfMonth;
	    momentPrototype__proto.day = momentPrototype__proto.days = getSetDayOfWeek;
	    momentPrototype__proto.weekday = getSetLocaleDayOfWeek;
	    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
	    momentPrototype__proto.dayOfYear = getSetDayOfYear;

	    // Hour
	    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

	    // Minute
	    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

	    // Second
	    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

	    // Millisecond
	    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

	    // Offset
	    momentPrototype__proto.utcOffset = getSetOffset;
	    momentPrototype__proto.utc = setOffsetToUTC;
	    momentPrototype__proto.local = setOffsetToLocal;
	    momentPrototype__proto.parseZone = setOffsetToParsedOffset;
	    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
	    momentPrototype__proto.isDST = isDaylightSavingTime;
	    momentPrototype__proto.isDSTShifted = isDaylightSavingTimeShifted;
	    momentPrototype__proto.isLocal = isLocal;
	    momentPrototype__proto.isUtcOffset = isUtcOffset;
	    momentPrototype__proto.isUtc = isUtc;
	    momentPrototype__proto.isUTC = isUtc;

	    // Timezone
	    momentPrototype__proto.zoneAbbr = getZoneAbbr;
	    momentPrototype__proto.zoneName = getZoneName;

	    // Deprecations
	    momentPrototype__proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
	    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
	    momentPrototype__proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
	    momentPrototype__proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

	    var momentPrototype = momentPrototype__proto;

	    function moment__createUnix(input) {
	        return local__createLocal(input * 1000);
	    }

	    function moment__createInZone() {
	        return local__createLocal.apply(null, arguments).parseZone();
	    }

	    var defaultCalendar = {
	        sameDay: '[Today at] LT',
	        nextDay: '[Tomorrow at] LT',
	        nextWeek: 'dddd [at] LT',
	        lastDay: '[Yesterday at] LT',
	        lastWeek: '[Last] dddd [at] LT',
	        sameElse: 'L'
	    };

	    function locale_calendar__calendar(key, mom, now) {
	        var output = this._calendar[key];
	        return typeof output === 'function' ? output.call(mom, now) : output;
	    }

	    var defaultLongDateFormat = {
	        LTS: 'h:mm:ss A',
	        LT: 'h:mm A',
	        L: 'MM/DD/YYYY',
	        LL: 'MMMM D, YYYY',
	        LLL: 'MMMM D, YYYY h:mm A',
	        LLLL: 'dddd, MMMM D, YYYY h:mm A'
	    };

	    function longDateFormat(key) {
	        var format = this._longDateFormat[key],
	            formatUpper = this._longDateFormat[key.toUpperCase()];

	        if (format || !formatUpper) {
	            return format;
	        }

	        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
	            return val.slice(1);
	        });

	        return this._longDateFormat[key];
	    }

	    var defaultInvalidDate = 'Invalid date';

	    function invalidDate() {
	        return this._invalidDate;
	    }

	    var defaultOrdinal = '%d';
	    var defaultOrdinalParse = /\d{1,2}/;

	    function ordinal(number) {
	        return this._ordinal.replace('%d', number);
	    }

	    function preParsePostFormat(string) {
	        return string;
	    }

	    var defaultRelativeTime = {
	        future: 'in %s',
	        past: '%s ago',
	        s: 'a few seconds',
	        m: 'a minute',
	        mm: '%d minutes',
	        h: 'an hour',
	        hh: '%d hours',
	        d: 'a day',
	        dd: '%d days',
	        M: 'a month',
	        MM: '%d months',
	        y: 'a year',
	        yy: '%d years'
	    };

	    function relative__relativeTime(number, withoutSuffix, string, isFuture) {
	        var output = this._relativeTime[string];
	        return typeof output === 'function' ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
	    }

	    function pastFuture(diff, output) {
	        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
	        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
	    }

	    function locale_set__set(config) {
	        var prop, i;
	        for (i in config) {
	            prop = config[i];
	            if (typeof prop === 'function') {
	                this[i] = prop;
	            } else {
	                this['_' + i] = prop;
	            }
	        }
	        // Lenient ordinal parsing accepts just a number in addition to
	        // number + (possibly) stuff coming from _ordinalParseLenient.
	        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
	    }

	    var prototype__proto = Locale.prototype;

	    prototype__proto._calendar = defaultCalendar;
	    prototype__proto.calendar = locale_calendar__calendar;
	    prototype__proto._longDateFormat = defaultLongDateFormat;
	    prototype__proto.longDateFormat = longDateFormat;
	    prototype__proto._invalidDate = defaultInvalidDate;
	    prototype__proto.invalidDate = invalidDate;
	    prototype__proto._ordinal = defaultOrdinal;
	    prototype__proto.ordinal = ordinal;
	    prototype__proto._ordinalParse = defaultOrdinalParse;
	    prototype__proto.preparse = preParsePostFormat;
	    prototype__proto.postformat = preParsePostFormat;
	    prototype__proto._relativeTime = defaultRelativeTime;
	    prototype__proto.relativeTime = relative__relativeTime;
	    prototype__proto.pastFuture = pastFuture;
	    prototype__proto.set = locale_set__set;

	    // Month
	    prototype__proto.months = localeMonths;
	    prototype__proto._months = defaultLocaleMonths;
	    prototype__proto.monthsShort = localeMonthsShort;
	    prototype__proto._monthsShort = defaultLocaleMonthsShort;
	    prototype__proto.monthsParse = localeMonthsParse;

	    // Week
	    prototype__proto.week = localeWeek;
	    prototype__proto._week = defaultLocaleWeek;
	    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
	    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

	    // Day of Week
	    prototype__proto.weekdays = localeWeekdays;
	    prototype__proto._weekdays = defaultLocaleWeekdays;
	    prototype__proto.weekdaysMin = localeWeekdaysMin;
	    prototype__proto._weekdaysMin = defaultLocaleWeekdaysMin;
	    prototype__proto.weekdaysShort = localeWeekdaysShort;
	    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
	    prototype__proto.weekdaysParse = localeWeekdaysParse;

	    // Hours
	    prototype__proto.isPM = localeIsPM;
	    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
	    prototype__proto.meridiem = localeMeridiem;

	    function lists__get(format, index, field, setter) {
	        var locale = locale_locales__getLocale();
	        var utc = create_utc__createUTC().set(setter, index);
	        return locale[field](utc, format);
	    }

	    function list(format, index, field, count, setter) {
	        if (typeof format === 'number') {
	            index = format;
	            format = undefined;
	        }

	        format = format || '';

	        if (index != null) {
	            return lists__get(format, index, field, setter);
	        }

	        var i;
	        var out = [];
	        for (i = 0; i < count; i++) {
	            out[i] = lists__get(format, i, field, setter);
	        }
	        return out;
	    }

	    function lists__listMonths(format, index) {
	        return list(format, index, 'months', 12, 'month');
	    }

	    function lists__listMonthsShort(format, index) {
	        return list(format, index, 'monthsShort', 12, 'month');
	    }

	    function lists__listWeekdays(format, index) {
	        return list(format, index, 'weekdays', 7, 'day');
	    }

	    function lists__listWeekdaysShort(format, index) {
	        return list(format, index, 'weekdaysShort', 7, 'day');
	    }

	    function lists__listWeekdaysMin(format, index) {
	        return list(format, index, 'weekdaysMin', 7, 'day');
	    }

	    locale_locales__getSetGlobalLocale('en', {
	        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
	        ordinal: function ordinal(number) {
	            var b = number % 10,
	                output = toInt(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
	            return number + output;
	        }
	    });

	    // Side effect imports
	    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
	    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

	    var mathAbs = Math.abs;

	    function duration_abs__abs() {
	        var data = this._data;

	        this._milliseconds = mathAbs(this._milliseconds);
	        this._days = mathAbs(this._days);
	        this._months = mathAbs(this._months);

	        data.milliseconds = mathAbs(data.milliseconds);
	        data.seconds = mathAbs(data.seconds);
	        data.minutes = mathAbs(data.minutes);
	        data.hours = mathAbs(data.hours);
	        data.months = mathAbs(data.months);
	        data.years = mathAbs(data.years);

	        return this;
	    }

	    function duration_add_subtract__addSubtract(duration, input, value, direction) {
	        var other = create__createDuration(input, value);

	        duration._milliseconds += direction * other._milliseconds;
	        duration._days += direction * other._days;
	        duration._months += direction * other._months;

	        return duration._bubble();
	    }

	    // supports only 2.0-style add(1, 's') or add(duration)
	    function duration_add_subtract__add(input, value) {
	        return duration_add_subtract__addSubtract(this, input, value, 1);
	    }

	    // supports only 2.0-style subtract(1, 's') or subtract(duration)
	    function duration_add_subtract__subtract(input, value) {
	        return duration_add_subtract__addSubtract(this, input, value, -1);
	    }

	    function absCeil(number) {
	        if (number < 0) {
	            return Math.floor(number);
	        } else {
	            return Math.ceil(number);
	        }
	    }

	    function bubble() {
	        var milliseconds = this._milliseconds;
	        var days = this._days;
	        var months = this._months;
	        var data = this._data;
	        var seconds, minutes, hours, years, monthsFromDays;

	        // if we have a mix of positive and negative values, bubble down first
	        // check: https://github.com/moment/moment/issues/2166
	        if (!(milliseconds >= 0 && days >= 0 && months >= 0 || milliseconds <= 0 && days <= 0 && months <= 0)) {
	            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
	            days = 0;
	            months = 0;
	        }

	        // The following code bubbles up values, see the tests for
	        // examples of what that means.
	        data.milliseconds = milliseconds % 1000;

	        seconds = absFloor(milliseconds / 1000);
	        data.seconds = seconds % 60;

	        minutes = absFloor(seconds / 60);
	        data.minutes = minutes % 60;

	        hours = absFloor(minutes / 60);
	        data.hours = hours % 24;

	        days += absFloor(hours / 24);

	        // convert days to months
	        monthsFromDays = absFloor(daysToMonths(days));
	        months += monthsFromDays;
	        days -= absCeil(monthsToDays(monthsFromDays));

	        // 12 months -> 1 year
	        years = absFloor(months / 12);
	        months %= 12;

	        data.days = days;
	        data.months = months;
	        data.years = years;

	        return this;
	    }

	    function daysToMonths(days) {
	        // 400 years have 146097 days (taking into account leap year rules)
	        // 400 years have 12 months === 4800
	        return days * 4800 / 146097;
	    }

	    function monthsToDays(months) {
	        // the reverse of daysToMonths
	        return months * 146097 / 4800;
	    }

	    function as(units) {
	        var days;
	        var months;
	        var milliseconds = this._milliseconds;

	        units = normalizeUnits(units);

	        if (units === 'month' || units === 'year') {
	            days = this._days + milliseconds / 864e5;
	            months = this._months + daysToMonths(days);
	            return units === 'month' ? months : months / 12;
	        } else {
	            // handle milliseconds separately because of floating point math errors (issue #1867)
	            days = this._days + Math.round(monthsToDays(this._months));
	            switch (units) {
	                case 'week':
	                    return days / 7 + milliseconds / 6048e5;
	                case 'day':
	                    return days + milliseconds / 864e5;
	                case 'hour':
	                    return days * 24 + milliseconds / 36e5;
	                case 'minute':
	                    return days * 1440 + milliseconds / 6e4;
	                case 'second':
	                    return days * 86400 + milliseconds / 1000;
	                // Math.floor prevents floating point math errors here
	                case 'millisecond':
	                    return Math.floor(days * 864e5) + milliseconds;
	                default:
	                    throw new Error('Unknown unit ' + units);
	            }
	        }
	    }

	    // TODO: Use this.as('ms')?
	    function duration_as__valueOf() {
	        return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + toInt(this._months / 12) * 31536e6;
	    }

	    function makeAs(alias) {
	        return function () {
	            return this.as(alias);
	        };
	    }

	    var asMilliseconds = makeAs('ms');
	    var asSeconds = makeAs('s');
	    var asMinutes = makeAs('m');
	    var asHours = makeAs('h');
	    var asDays = makeAs('d');
	    var asWeeks = makeAs('w');
	    var asMonths = makeAs('M');
	    var asYears = makeAs('y');

	    function duration_get__get(units) {
	        units = normalizeUnits(units);
	        return this[units + 's']();
	    }

	    function makeGetter(name) {
	        return function () {
	            return this._data[name];
	        };
	    }

	    var milliseconds = makeGetter('milliseconds');
	    var seconds = makeGetter('seconds');
	    var minutes = makeGetter('minutes');
	    var hours = makeGetter('hours');
	    var days = makeGetter('days');
	    var months = makeGetter('months');
	    var years = makeGetter('years');

	    function weeks() {
	        return absFloor(this.days() / 7);
	    }

	    var round = Math.round;
	    var thresholds = {
	        s: 45, // seconds to minute
	        m: 45, // minutes to hour
	        h: 22, // hours to day
	        d: 26, // days to month
	        M: 11 // months to year
	    };

	    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
	        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	    }

	    function duration_humanize__relativeTime(posNegDuration, withoutSuffix, locale) {
	        var duration = create__createDuration(posNegDuration).abs();
	        var seconds = round(duration.as('s'));
	        var minutes = round(duration.as('m'));
	        var hours = round(duration.as('h'));
	        var days = round(duration.as('d'));
	        var months = round(duration.as('M'));
	        var years = round(duration.as('y'));

	        var a = seconds < thresholds.s && ['s', seconds] || minutes === 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours === 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days === 1 && ['d'] || days < thresholds.d && ['dd', days] || months === 1 && ['M'] || months < thresholds.M && ['MM', months] || years === 1 && ['y'] || ['yy', years];

	        a[2] = withoutSuffix;
	        a[3] = +posNegDuration > 0;
	        a[4] = locale;
	        return substituteTimeAgo.apply(null, a);
	    }

	    // This function allows you to set a threshold for relative time strings
	    function duration_humanize__getSetRelativeTimeThreshold(threshold, limit) {
	        if (thresholds[threshold] === undefined) {
	            return false;
	        }
	        if (limit === undefined) {
	            return thresholds[threshold];
	        }
	        thresholds[threshold] = limit;
	        return true;
	    }

	    function humanize(withSuffix) {
	        var locale = this.localeData();
	        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

	        if (withSuffix) {
	            output = locale.pastFuture(+this, output);
	        }

	        return locale.postformat(output);
	    }

	    var iso_string__abs = Math.abs;

	    function iso_string__toISOString() {
	        // for ISO strings we do not use the normal bubbling rules:
	        //  * milliseconds bubble up until they become hours
	        //  * days do not bubble at all
	        //  * months bubble up until they become years
	        // This is because there is no context-free conversion between hours and days
	        // (think of clock changes)
	        // and also not between days and months (28-31 days per month)
	        var seconds = iso_string__abs(this._milliseconds) / 1000;
	        var days = iso_string__abs(this._days);
	        var months = iso_string__abs(this._months);
	        var minutes, hours, years;

	        // 3600 seconds -> 60 minutes -> 1 hour
	        minutes = absFloor(seconds / 60);
	        hours = absFloor(minutes / 60);
	        seconds %= 60;
	        minutes %= 60;

	        // 12 months -> 1 year
	        years = absFloor(months / 12);
	        months %= 12;

	        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	        var Y = years;
	        var M = months;
	        var D = days;
	        var h = hours;
	        var m = minutes;
	        var s = seconds;
	        var total = this.asSeconds();

	        if (!total) {
	            // this is the same as C#'s (Noda) and python (isodate)...
	            // but not other JS (goog.date)
	            return 'P0D';
	        }

	        return (total < 0 ? '-' : '') + 'P' + (Y ? Y + 'Y' : '') + (M ? M + 'M' : '') + (D ? D + 'D' : '') + (h || m || s ? 'T' : '') + (h ? h + 'H' : '') + (m ? m + 'M' : '') + (s ? s + 'S' : '');
	    }

	    var duration_prototype__proto = Duration.prototype;

	    duration_prototype__proto.abs = duration_abs__abs;
	    duration_prototype__proto.add = duration_add_subtract__add;
	    duration_prototype__proto.subtract = duration_add_subtract__subtract;
	    duration_prototype__proto.as = as;
	    duration_prototype__proto.asMilliseconds = asMilliseconds;
	    duration_prototype__proto.asSeconds = asSeconds;
	    duration_prototype__proto.asMinutes = asMinutes;
	    duration_prototype__proto.asHours = asHours;
	    duration_prototype__proto.asDays = asDays;
	    duration_prototype__proto.asWeeks = asWeeks;
	    duration_prototype__proto.asMonths = asMonths;
	    duration_prototype__proto.asYears = asYears;
	    duration_prototype__proto.valueOf = duration_as__valueOf;
	    duration_prototype__proto._bubble = bubble;
	    duration_prototype__proto.get = duration_get__get;
	    duration_prototype__proto.milliseconds = milliseconds;
	    duration_prototype__proto.seconds = seconds;
	    duration_prototype__proto.minutes = minutes;
	    duration_prototype__proto.hours = hours;
	    duration_prototype__proto.days = days;
	    duration_prototype__proto.weeks = weeks;
	    duration_prototype__proto.months = months;
	    duration_prototype__proto.years = years;
	    duration_prototype__proto.humanize = humanize;
	    duration_prototype__proto.toISOString = iso_string__toISOString;
	    duration_prototype__proto.toString = iso_string__toISOString;
	    duration_prototype__proto.toJSON = iso_string__toISOString;
	    duration_prototype__proto.locale = locale;
	    duration_prototype__proto.localeData = localeData;

	    // Deprecations
	    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
	    duration_prototype__proto.lang = lang;

	    // Side effect imports

	    addFormatToken('X', 0, 0, 'unix');
	    addFormatToken('x', 0, 0, 'valueOf');

	    // PARSING

	    addRegexToken('x', matchSigned);
	    addRegexToken('X', matchTimestamp);
	    addParseToken('X', function (input, array, config) {
	        config._d = new Date(parseFloat(input, 10) * 1000);
	    });
	    addParseToken('x', function (input, array, config) {
	        config._d = new Date(toInt(input));
	    });

	    // Side effect imports


	    utils_hooks__hooks.version = '2.10.6';

	    setHookCallback(local__createLocal);

	    utils_hooks__hooks.fn = momentPrototype;
	    utils_hooks__hooks.min = min;
	    utils_hooks__hooks.max = max;
	    utils_hooks__hooks.utc = create_utc__createUTC;
	    utils_hooks__hooks.unix = moment__createUnix;
	    utils_hooks__hooks.months = lists__listMonths;
	    utils_hooks__hooks.isDate = isDate;
	    utils_hooks__hooks.locale = locale_locales__getSetGlobalLocale;
	    utils_hooks__hooks.invalid = valid__createInvalid;
	    utils_hooks__hooks.duration = create__createDuration;
	    utils_hooks__hooks.isMoment = isMoment;
	    utils_hooks__hooks.weekdays = lists__listWeekdays;
	    utils_hooks__hooks.parseZone = moment__createInZone;
	    utils_hooks__hooks.localeData = locale_locales__getLocale;
	    utils_hooks__hooks.isDuration = isDuration;
	    utils_hooks__hooks.monthsShort = lists__listMonthsShort;
	    utils_hooks__hooks.weekdaysMin = lists__listWeekdaysMin;
	    utils_hooks__hooks.defineLocale = defineLocale;
	    utils_hooks__hooks.weekdaysShort = lists__listWeekdaysShort;
	    utils_hooks__hooks.normalizeUnits = normalizeUnits;
	    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

	    var _moment = utils_hooks__hooks;

	    return _moment;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)(module)))

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./zh-cn": 26,
		"./zh-cn.js": 26
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 25;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	//! moment.js locale configuration
	//! locale : Chinese (China) [zh-cn]
	//! author : suupic : https://github.com/suupic
	//! author : Zeno Zeng : https://github.com/zenozeng

	;(function (global, factory) {
	    ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' && "function" === 'function' ? factory(__webpack_require__(23)) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(23)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory(global.moment);
	})(undefined, function (moment) {
	    'use strict';

	    var zhCn = moment.defineLocale('zh-cn', {
	        months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
	        monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
	        weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
	        weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
	        weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
	        longDateFormat: {
	            LT: 'Ah点mm分',
	            LTS: 'Ah点m分s秒',
	            L: 'YYYY-MM-DD',
	            LL: 'YYYY年MMMD日',
	            LLL: 'YYYY年MMMD日Ah点mm分',
	            LLLL: 'YYYY年MMMD日ddddAh点mm分',
	            l: 'YYYY-MM-DD',
	            ll: 'YYYY年MMMD日',
	            lll: 'YYYY年MMMD日Ah点mm分',
	            llll: 'YYYY年MMMD日ddddAh点mm分'
	        },
	        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
	        meridiemHour: function meridiemHour(hour, meridiem) {
	            if (hour === 12) {
	                hour = 0;
	            }
	            if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
	                return hour;
	            } else if (meridiem === '下午' || meridiem === '晚上') {
	                return hour + 12;
	            } else {
	                // '中午'
	                return hour >= 11 ? hour : hour + 12;
	            }
	        },
	        meridiem: function meridiem(hour, minute, isLower) {
	            var hm = hour * 100 + minute;
	            if (hm < 600) {
	                return '凌晨';
	            } else if (hm < 900) {
	                return '早上';
	            } else if (hm < 1130) {
	                return '上午';
	            } else if (hm < 1230) {
	                return '中午';
	            } else if (hm < 1800) {
	                return '下午';
	            } else {
	                return '晚上';
	            }
	        },
	        calendar: {
	            sameDay: function sameDay() {
	                return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
	            },
	            nextDay: function nextDay() {
	                return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
	            },
	            lastDay: function lastDay() {
	                return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
	            },
	            nextWeek: function nextWeek() {
	                var startOfWeek, prefix;
	                startOfWeek = moment().startOf('week');
	                prefix = this.diff(startOfWeek, 'days') >= 7 ? '[下]' : '[本]';
	                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
	            },
	            lastWeek: function lastWeek() {
	                var startOfWeek, prefix;
	                startOfWeek = moment().startOf('week');
	                prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]';
	                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
	            },
	            sameElse: 'LL'
	        },
	        ordinalParse: /\d{1,2}(日|月|周)/,
	        ordinal: function ordinal(number, period) {
	            switch (period) {
	                case 'd':
	                case 'D':
	                case 'DDD':
	                    return number + '日';
	                case 'M':
	                    return number + '月';
	                case 'w':
	                case 'W':
	                    return number + '周';
	                default:
	                    return number;
	            }
	        },
	        relativeTime: {
	            future: '%s内',
	            past: '%s前',
	            s: '几秒',
	            m: '1 分钟',
	            mm: '%d 分钟',
	            h: '1 小时',
	            hh: '%d 小时',
	            d: '1 天',
	            dd: '%d 天',
	            M: '1 个月',
	            MM: '%d 个月',
	            y: '1 年',
	            yy: '%d 年'
	        },
	        week: {
	            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
	            dow: 1, // Monday is the first day of the week.
	            doy: 4 // The week that contains Jan 4th is the first week of the year.
	        }
	    });

	    return zhCn;
	});

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// 使用 Mock
	var Mock = __webpack_require__(28);
	var Random = Mock.Random;
	Random.cname();
	var data = Mock.mock(
	// 属性 list 的值是一个数组，其中含有 1 到 10 个元素
	[{
	    // 属性 id 是一个自增数，起始值为 1，每次增 1
	    'id|+1': 1,
	    'value|+1': 1,
	    name: '@cname',
	    child: [{
	        'id|+1': 10,
	        'value|+1': 10,
	        name: '@cname',
	        child: [{
	            'id|+1': 100,
	            'value|+1': 100,
	            name: '@cname',
	            child: [{
	                'id|+1': 200,
	                'value|+1': 200,
	                name: '@cname'
	            }, {
	                'id|+1': 300,
	                'value|+1': 300,
	                name: '@cname',
	                child: [{
	                    'id|+1': 500,
	                    'value|+1': 500,
	                    name: '@cname'
	                }, {
	                    'id|+1': 600,
	                    'value|+1': 600,
	                    name: '@cname'
	                }]
	            }]
	        }, {
	            'id|+1': 400,
	            'value|+1': 400,
	            name: '@cname'
	        }]
	    }]
	}, {
	    // 属性 id 是一个自增数，起始值为 1，每次增 1
	    'id|+1': 5,
	    'value|+1': 5,
	    name: '@cname',
	    child: [{
	        'id|+1': 50,
	        'value|+1': 50,
	        name: '@cname'
	    }]
	}]);

	//使用中文转拼音
	var pinyin = __webpack_require__(29);

	var jsonData = data;
	//隐藏原型链的值
	/*
	this.clickTarget(当前点击item),this.jsonDataChild(可点击元素json)
	*/
	// 输出结果
	//console.log(JSON.stringify(data, null, 2))
	//>cotainer>content>title+list>content>title+list/item>name+1
	//一个列表
	//title下一定有list,list下一定有item,list上一定有content.
	//content和item并行，上面一定有list,list并行一定有title
	//tree-list下可以是content＋item,或者纯item

	var template = {
	    item: '<div class="tree-item" data-value="{{value}}"> \n                <i class="tree-icon fa {{itemIcon}}" aria-hidden="true"></i>&nbsp; \n                <div class="tree-name">{{name}}</div> \n            </div>',
	    title: '<div class="tree-title">\n                <i class="tree-icon fa {{titleIcon}}" aria-hidden="true"></i>&nbsp;\n                <div class="tree-name" data-value="{{value}}" data-level="{{level}}" data-id="{{id}}">{{name}}</div>\n            </div>',
	    wrap: '<div class="tree-wrap"></div>',
	    span: '<span class="tree-value" data-value="{{value}}">\n                {{name}}\n                <span class="tree-remove">\xD7</span>\n            </span>',
	    search: '<div class="tree-search-content">\n                <input type="text" placeholder="\u8BF7\u641C\u7D22" class="tree-search">\n            </div>',
	    container: '<div class="tree-container">\n                </div>'
	};
	template.content = '<div class="tree-content">' + template.title + '<div class="tree-list">\n                    </div>\n                </div>';

	var $body = $('body');

	// let containerTpl=`<div class="tree-container">
	// </div>`;
	var defaults = {
	    jsonData: jsonData,
	    //可配置的json key
	    value: 'value',
	    child: 'child',
	    name: 'name',
	    //是否多选
	    multiple: true,
	    //icon 配置
	    itemIcon: ['fa-file-text-o', 'fa-file-text-o'],
	    titleIcon: ['fa-folder-o', 'fa-folder-open-o'],
	    //是否排序：asc,des,false
	    order: 'asc',
	    //排序属性
	    orderProp: 'name',
	    //是否多选
	    isMulti: true,
	    //分割字符串
	    splitStr: '<br>',
	    //是否显示完整路径
	    showPath: true,
	    //是否开启搜索
	    search: true,
	    //选中回调
	    afterSelected: function afterSelected() {},
	    //删除回调
	    afterRemove: function afterRemove() {}

	};
	$body.click(function (event) {
	    var $container = $('.tree-container');
	    $container.length ? $('.tree-container').remove() : false;
	});

	var Tree = function () {
	    function Tree($target, options) {
	        _classCallCheck(this, Tree);

	        this.target = $target;
	        this.options = options;
	        this.init();
	    }

	    _createClass(Tree, [{
	        key: 'init',
	        value: function init() {
	            //添加外围标签
	            var $wrap = $(template.wrap);
	            this.target.after($wrap);
	            this.wrap = $wrap.append(this.target);

	            //处理json排序，添加字段
	            this.jsonDataHandle();

	            this.event();
	            // this.render();
	        }
	        // 渲染结构    

	    }, {
	        key: 'render',
	        value: function render() {
	            var self = this;
	            var html = '';
	            //添加container
	            self.wrap.append(template.container);
	            self.container = $('.tree-container');

	            var top = getcontainerTop.call(self);
	            self.container.css({
	                top: top
	            });

	            var data = self.options.jsonData;
	            //渲染html
	            data === false ? false : self.iteratorAppendHtml();
	            self.renderActive();
	            //增加父元素路径
	            if (self.options.showPath) {
	                self.addParentPath();
	            }
	            //增加父元素路径
	            if (self.options.search) {
	                self.addSearch();
	            }
	        }
	        //渲染默认值

	    }, {
	        key: 'renderActive',
	        value: function renderActive() {
	            var self = this;
	            var vals = valToArray.call(self);
	            if (!vals) {
	                return;
	            }
	            for (var i = 0, len = vals.length; i < len; i++) {
	                console.info(self.container.find('.tree-item[data-value="' + vals[i] + '"]'));
	                self.container.find('.tree-item[data-value="' + vals[i] + '"]').addClass('active');
	            }
	        }
	    }, {
	        key: 'event',
	        value: function event() {
	            var self = this;
	            //点击打开选择框
	            this.target.off('click.tree').on('click.tree', function (e) {
	                if (!$('.tree-container').length) {
	                    self.show();
	                }
	                return false;
	            });

	            //点击展开收起子选项
	            $body.on('off.tree').on('click.tree', '.tree-container .tree-title', function (e) {
	                var $this = $(this);
	                $this.toggleClass('active');
	                var i = $this.hasClass('active') ? 1 : 0;
	                $this.find('.tree-icon').removeClass(self.options.titleIcon[1 - i]).addClass(self.options.titleIcon[i]);
	            });

	            // item选择
	            if (self.options.isMulti) {
	                self.multiEvent();
	            } else {
	                self.singleEvent();
	            }

	            //删除
	            this.target.on('click', '.tree-value', function (event) {
	                var $this = $(this);
	                var val = $this.data('value');
	                self.remove(val);
	                $this.remove();
	            });

	            $body.on('off.tree').on('click.tree', '.tree-container', function (e) {
	                e.stopPropagation();
	            });
	        }
	        // 多选

	    }, {
	        key: 'multiEvent',
	        value: function multiEvent() {
	            var self = this;
	            $body.on('off.tree').on('click.tree', '.tree-container .tree-item', function (e) {
	                var $this = $(this);
	                $this.toggleClass('active');
	                self.setValue($this);
	            });
	        }
	        // 单选

	    }, {
	        key: 'singleEvent',
	        value: function singleEvent() {
	            var self = this;
	            $body.on('off.tree').on('click.tree', '.tree-container .tree-item', function (e) {
	                var $this = $(this);
	                $this.addClass('active');
	                self.container.find('.tree-item').not($this).removeClass('active');
	                self.setValue($this);
	                self.hide();
	            });
	        }
	        // 显示

	    }, {
	        key: 'show',
	        value: function show() {
	            this.render();
	            // this.container.removeClass('hide');
	        }
	        // 隐藏

	    }, {
	        key: 'hide',
	        value: function hide() {
	            this.container.remove();
	        }
	        // 更新数据

	    }, {
	        key: 'update',
	        value: function update(data) {
	            this.options.jsonData = data;
	            this.jsonDataHandle();
	        }
	        // 删除

	    }, {
	        key: 'remove',
	        value: function remove(val) {
	            var self = this;
	            var vals = self.target.data('value');
	            self.removeValue(val, vals);
	            if (self.container.length) {
	                self.container.find('.tree-item[data-value="' + val + '"]').removeClass('active');
	            }
	        }
	        // 设置选中值（$target：tree-item）

	    }, {
	        key: 'setValue',
	        value: function setValue($target) {
	            var self = this;
	            var val = $target.data('value');
	            self.clickTarget = $target;
	            if ($target.hasClass('active')) {
	                self.addValue(val);
	                self.options.afterSelected.call(self, val);
	            } else {
	                self.removeValue(val);
	                self.options.afterRemove.call(self, val);
	            }
	        }
	        // 移除选中值

	    }, {
	        key: 'removeValue',
	        value: function removeValue(val) {
	            var self = this;
	            //移除val
	            var vals = remove.call(self, val);
	            self.target.data('value', vals);
	            return vals;
	        }
	        // 添加

	    }, {
	        key: 'addValue',
	        value: function addValue(val) {
	            var self = this;
	            var vals = self.target.data('value');
	            //添加val
	            vals = add.call(self, val);
	            self.target.data('value', vals);
	            return vals;
	        }

	        // 拼接name值

	    }, {
	        key: 'getName',
	        value: function getName(vals) {
	            var self = this;
	            var result = _getName.call(self, vals);
	            self.target.html(result);
	            return result;
	        }
	        //添加搜索

	    }, {
	        key: 'addSearch',
	        value: function addSearch() {
	            var self = this;
	            self.container.prepend(template.search);
	            self.container.on('keyup.tree', '.tree-search', function (e) {
	                if (e.which === 13) {
	                    self.search();
	                }
	            });
	        }
	    }, {
	        key: 'search',
	        value: function search() {
	            var self = this;
	            var $search = self.container.find('.tree-search');
	            var val = $search.val();
	            var options = self.options;
	            var jsonData = options.jsonData;
	            if (!jsonData || !jsonData.length) {
	                return;
	            }
	            var stack = [];
	            var child = options.child;
	            var name = options.name;
	            var $container = self.container;
	            self.container.find('.tree-content').remove();
	            //先将第一层节点放入栈
	            for (var i = 0, len = jsonData.length; i < len; i++) {
	                stack.push(jsonData[i]);
	            }

	            var item = void 0,
	                isChild = void 0;
	            while (stack.length) {
	                item = stack.shift();
	                isChild = hasChild(item, child);
	                if (item.jqTreeParentVal === -1) {
	                    //第一级父元素
	                    $container.append(item.jqTreeCode);
	                } else if (hasChild(item, child) || item[name].indexOf(val) != -1) {
	                    //当前匹配搜索或有子元素
	                    $container.find('[data-value="' + item.jqTreeParentVal + '"]').closest('.tree-content').find('.tree-list').first().append(item.jqTreeCode);
	                }

	                //如果该节点有子节点，继续添加进入栈顶
	                if (hasChild(item, child)) {
	                    stack = item[child].concat(stack);
	                }
	            }
	            //遍历去除无子元素的部分
	            var $list = self.container.find('.tree-list');
	            $.each($list, function (index, list) {
	                if (!$(list).find('.tree-item').length) {
	                    $(list).parents('.tree-content').first().remove();
	                }
	            });
	        }
	        // 添加父元素路径到子元素，避免读取元素获得路径影响性能

	    }, {
	        key: 'addParentPath',
	        value: function addParentPath() {
	            var self = this;
	            var $item = self.container.find('.tree-item');
	            var $parent = void 0,
	                namePath = void 0,
	                valuePath = void 0,
	                val = void 0,
	                jsonChild = void 0;
	            //添加父元素路径到子元素：jsonDataChild
	            $.each($item, function (index, el) {
	                namePath = [];
	                valuePath = [];
	                $parent = $(el).parents('.tree-content');
	                val = $(el).data('value');
	                jsonChild = self.jsonDataChild[val];
	                for (var i = $parent.length - 1; i >= 0; i--) {
	                    var $name = $parent.eq(i).find('.tree-name').first();
	                    namePath.push($name.text());
	                    valuePath.push($name.data('value'));
	                }
	                namePath.push(jsonChild.name);
	                valuePath.push(val);
	                jsonChild.namePath = namePath.join('/');
	                jsonChild.valuePath = valuePath.join('/');
	            });
	        }
	        //处理json排序，添加字段

	    }, {
	        key: 'jsonDataHandle',
	        value: function jsonDataHandle() {
	            var self = this;
	            if (!(self.options.jsonData && self.options.jsonData.length)) {
	                return false;
	            }
	            //排序
	            if (self.options.order !== false) {
	                self.order();
	            }
	            self.jsonDataExtend();
	        }
	        //jsonData增加属性（jqTreeParentVal：父元素值，jqTreeLevel：当前层级，treeId：当前层级index）   

	    }, {
	        key: 'jsonDataExtend',
	        value: function jsonDataExtend() {
	            var self = this;
	            var options = self.options;
	            var jsonData = options.jsonData;
	            if (!jsonData || !jsonData.length) {
	                return;
	            }
	            var stack = [];
	            var child = options.child;
	            var oname = options.name;
	            var ovalue = options.value;
	            self.jsonDataChild = {};
	            //非递归广度优先
	            //先将第一层节点放入栈
	            for (var i = 0, len = jsonData.length; i < len; i++) {
	                jsonData[i].jqTreeLevel = 0;
	                jsonData[i].treeId = i;
	                jsonData[i].jqTreeParentVal = -1;
	                stack.push(jsonData[i]);
	            }

	            var item = void 0,
	                level = void 0,
	                parentId = void 0;
	            //stack是所有的一级数组
	            while (stack.length) {
	                item = stack.shift();
	                //如果该节点有子节点，继续添加进入栈底
	                if (hasChild(item, child)) {
	                    //有子元素标志
	                    item.jqTreeHasChild = true;
	                    //元素层级标志
	                    level = item.jqTreeLevel + 1;
	                    //对用的html
	                    item.jqTreeCode = template.content.replace(/{{value}}/g, item[ovalue]).replace(/{{name}}/g, item[oname]).replace(/{{level}}/g, item.jqTreeLevel).replace(/{{id}}/g, item.treeId).replace(/{{titleIcon}}/g, options.titleIcon[0]);
	                    //父元素id
	                    parentId = item[ovalue];
	                    //长度
	                    for (var _i = 0, _len = item[child].length; _i < _len; _i++) {
	                        item[child][_i].jqTreeLevel = level;
	                        item[child][_i].jqTreeParentVal = parentId;
	                        item[child][_i].treeId = _i;
	                    }
	                    stack = stack.concat(item[child]);
	                } else {
	                    //无子元素
	                    item.jqTreeHasChild = false;
	                    //tree-item html
	                    item.jqTreeCode = template.item.replace(/{{name}}/g, item[oname]).replace(/{{itemIcon}}/g, options.itemIcon[0]).replace(/{{value}}/g, item[ovalue]);

	                    self.jsonDataChild[item[ovalue]] = $.extend({}, {}, item);
	                }
	            }
	            return jsonData;
	        }
	        //非递归广度优先实现

	    }, {
	        key: 'iteratorAppendHtml',
	        value: function iteratorAppendHtml() {
	            var self = this;
	            var options = self.options;
	            var jsonData = options.jsonData;
	            if (!jsonData || !jsonData.length) {
	                return;
	            }
	            var stack = [];
	            var child = options.child;
	            var $container = self.container;

	            //先将第一层节点放入栈
	            for (var i = 0, len = jsonData.length; i < len; i++) {
	                stack.push(jsonData[i]);
	            }

	            var item = void 0;
	            while (stack.length) {
	                item = stack.shift();
	                if (item.jqTreeParentVal === -1) {
	                    $container.append(item.jqTreeCode);
	                } else {
	                    $container.find('[data-value="' + item.jqTreeParentVal + '"]').closest('.tree-content').find('.tree-list').first().append(item.jqTreeCode);
	                }

	                //如果该节点有子节点，继续添加进入栈底
	                if (hasChild(item, child)) {
	                    stack = stack.concat(item[child]);
	                }
	            }
	            return jsonData;
	        }
	        //排序：深度优先算法

	    }, {
	        key: 'order',
	        value: function order() {
	            var self = this;
	            var options = self.options;
	            var child = options.child;
	            var jsonData = options.jsonData;
	            if (!jsonData || !jsonData.length) return;
	            var stack = [];

	            //先将第一层节点放入栈
	            jsonData = sortResults.call(self, jsonData);
	            for (var i = 0, len = jsonData.length; i < len; i++) {
	                stack.push(jsonData[i]);
	            }
	            var item = void 0;

	            while (stack.length) {
	                item = stack.shift();
	                //如果该节点有子节点，继续添加进入栈顶
	                if (item[child] && item[child].length) {
	                    item[child] = sortResults.call(self, item[child]);
	                    stack = item[child].concat(stack);
	                }
	            }
	            return jsonData;
	        }
	        //获取选中值的名字，值全路径

	    }, {
	        key: 'getPath',
	        value: function getPath() {
	            var self = this;
	            var options = self.options;
	            var child = self.jsonDataChild;
	            var vals = self.target.data('value');
	            var valuePath = '';
	            var namePath = '';
	            var childVal = void 0;
	            if (vals) {
	                valuePath = [];
	                namePath = [];
	                vals = vals.toString().split(',');
	                for (var i = 0; i < vals.length; i++) {
	                    childVal = child[vals[i]];
	                    valuePath.push(childVal.valuePath);
	                    namePath.push(childVal.namePath);
	                }
	                valuePath = valuePath.join(options.split);
	                namePath = namePath.join(options.split);
	            }
	            return {
	                valuePath: valuePath,
	                namePath: namePath
	            };
	        }
	    }]);

	    return Tree;
	}();

	//根据val值拼接name


	function _getName(vals) {
	    var self = this;
	    var $target = self.clickTarget;
	    var temp = [];
	    var name = self.options.showPath ? 'namePath' : 'name';
	    for (var i = 0, len = vals.length; i < len; i++) {
	        temp.push(template.span.replace(/{{name}}/, self.jsonDataChild[vals[i]][name]).replace(/{{value}}/, vals[i]));
	    }

	    return temp.join(self.options.splitStr);
	}
	//添加val
	function add(val) {
	    var vals = this.target.data('value');
	    //单选
	    if (!this.options.isMulti) {
	        vals = '';
	    }
	    if (vals) {
	        var temp = [];
	        vals = vals.toString().split(',');
	        vals.push(val);
	        //拼接name值
	        this.getName(vals);
	        vals = vals.join(',');
	    } else {
	        //this.target.html(this.jsonDataChild[val].name);
	        vals = val;
	        this.getName([vals]);
	    }
	    return vals;
	}
	//移除val
	function remove(val) {
	    var vals = this.target.data('value');
	    //多选，有值
	    if (this.options.isMulti && vals) {
	        vals = vals.toString().split(',');
	        var temp = [];
	        for (var i = 0, len = vals.length; i < len; i++) {
	            if (vals[i] != val) {
	                temp.push(vals[i]);
	            }
	        }
	        this.getName(temp);
	        vals = temp.join(',');
	    } else {
	        vals = '';
	        this.target.html('');
	    }
	    return vals;
	}

	//vals转为数组
	function valToArray() {
	    var vals = this.target.data('value');
	    if (vals) {
	        vals = vals.toString().split(',');
	    } else {
	        vals = false;
	    }
	    return vals;
	}
	//排序
	function sortResults(data) {
	    var options = this.options;
	    var order = options.order;
	    var prop = options.orderProp;

	    data = data.sort(function (a, b) {
	        var tempA = pinyin(a[prop]).join('');
	        var tempB = pinyin(b[prop]).join('');
	        if (order === 'asc') {
	            return tempA > tempB ? 1 : tempA < tempB ? -1 : 0;
	        } else if (order === 'des') {
	            return tempB > tempA ? 1 : tempB < tempA ? -1 : 0;
	        }
	    });
	    //console.info('sortResults',data)
	    return data;
	}

	//判断是否有属性－－未兼容ie
	function hasProp(data, prop) {
	    // self.options.child
	    return {}.hasOwnProperty.call(data, prop);
	}

	//获取container top
	function getcontainerTop() {
	    var targetH = this.target.outerHeight();
	    var targetW = this.target.outerWidth();
	    var cHeight = this.container.outerHeight();
	    var targetT = this.target.offset().top;
	    var top = '100%';
	    // 大于最底部，小于最顶部
	    if ($body.outerHeight < targetH + cHeight && targetT - cHeight > 0) {
	        top = -cHeight;
	    }
	    return top;
	}

	function hasChild(item, child) {
	    return hasProp(item, child) && item[child] && item[child].length;
	}

	module.exports = {
	    tree: function tree(config) {
	        return new Tree($(this), $.extend({}, defaults, config));
	    }
	};

	// <div class="J-label-attr hide">
	//     <div class="tree-container">
	//         <div class="tree-content">
	//             <div class="tree-title active" data-id="03">
	//                 <i class="fa fa-folder-o" aria-hidden="true"></i>&nbsp;
	//                 <div class="tree-name" data-id="030">1111</div>
	//             </div>
	//             <div class="tree-list" data-level="1">
	//                 <div class="tree-content">
	//                     <div class="tree-title active" data-id="03">
	//                         <i class="fa fa-folder-o" aria-hidden="true"></i>&nbsp;
	//                         <div class="tree-name" data-id="030">1111</div>
	//                     </div>
	//                     <div class="tree-list">
	//                         <div class="tree-item active" data-id="03">
	//                             <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
	//                             <div class="tree-name" data-id="030">1111</div>
	//                         </div>
	//                         <div class="tree-item">
	//                             <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
	//                             <div class="tree-name" data-id="0301">常驻地</div>
	//                         </div>
	//                         <div class="tree-item">
	//                             <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
	//                             <div class="tree-name" data-id="0301">常驻地</div>
	//                         </div>
	//                     </div>
	//                 </div>
	//                 <div class="tree-item">
	//                     <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
	//                     <div class="tree-name" data-id="0301">常驻地</div>
	//                 </div>
	//                 <div class="tree-item">
	//                     <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
	//                     <div class="tree-name" data-id="0302">常去场所</div>
	//                 </div>
	//             </div>
	//         </div>
	//         <div class="tree-content">
	//             <div class="tree-title active" data-id="04">
	//               <i class="fa fa-folder-o" aria-hidden="true"></i>&nbsp;
	//               视频偏好
	//             </div>
	//             <div class="tree-list" data-level="1">
	//                 <div class="tree-item">
	//                     <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
	//                     <div class="tree-name" data-id="0401">视频来源</div>
	//                 </div>
	//                 <div class="tree-item">
	//                     <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
	//                     <div class="tree-name" data-id="0402">观看时段</div>
	//                 </div>
	//                 <div class="tree-item">
	//                     <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
	//                     <div class="tree-name" data-id="0403">观看设备</div>
	//                 </div>
	//             </div>
	//         </div>
	//     </div>
	// </div>

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	(function webpackUniversalModuleDefinition(root, factory) {
		if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') exports["Mock"] = factory();else root["Mock"] = factory();
	})(undefined, function () {
		return (/******/function (modules) {
				// webpackBootstrap
				/******/ // The module cache
				/******/var installedModules = {};

				/******/ // The require function
				/******/function __webpack_require__(moduleId) {

					/******/ // Check if module is in cache
					/******/if (installedModules[moduleId])
						/******/return installedModules[moduleId].exports;

					/******/ // Create a new module (and put it into the cache)
					/******/var module = installedModules[moduleId] = {
						/******/exports: {},
						/******/id: moduleId,
						/******/loaded: false
						/******/ };

					/******/ // Execute the module function
					/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

					/******/ // Flag the module as loaded
					/******/module.loaded = true;

					/******/ // Return the exports of the module
					/******/return module.exports;
					/******/
				}

				/******/ // expose the modules object (__webpack_modules__)
				/******/__webpack_require__.m = modules;

				/******/ // expose the module cache
				/******/__webpack_require__.c = installedModules;

				/******/ // __webpack_public_path__
				/******/__webpack_require__.p = "";

				/******/ // Load entry module and return exports
				/******/return __webpack_require__(0);
				/******/
			}(
			/************************************************************************/
			/******/[
			/* 0 */
			/***/function (module, exports, __webpack_require__) {

				/* global require, module, window */
				var Handler = __webpack_require__(1);
				var Util = __webpack_require__(3);
				var Random = __webpack_require__(5);
				var RE = __webpack_require__(20);
				var toJSONSchema = __webpack_require__(23);
				var valid = __webpack_require__(25);

				var XHR;
				if (typeof window !== 'undefined') XHR = __webpack_require__(27);

				/*!
	       Mock - 模拟请求 & 模拟数据
	       https://github.com/nuysoft/Mock
	       墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
	   */
				var Mock = {
					Handler: Handler,
					Random: Random,
					Util: Util,
					XHR: XHR,
					RE: RE,
					toJSONSchema: toJSONSchema,
					valid: valid,
					heredoc: Util.heredoc,
					setup: function setup(settings) {
						return XHR.setup(settings);
					},
					_mocked: {}
				};

				Mock.version = '1.0.1-beta3';

				// 避免循环依赖
				if (XHR) XHR.Mock = Mock;

				/*
	       * Mock.mock( template )
	       * Mock.mock( function() )
	       * Mock.mock( rurl, template )
	       * Mock.mock( rurl, function(options) )
	       * Mock.mock( rurl, rtype, template )
	       * Mock.mock( rurl, rtype, function(options) )
	   	    根据数据模板生成模拟数据。
	   */
				Mock.mock = function (rurl, rtype, template) {
					// Mock.mock(template)
					if (arguments.length === 1) {
						return Handler.gen(rurl);
					}
					// Mock.mock(rurl, template)
					if (arguments.length === 2) {
						template = rtype;
						rtype = undefined;
					}
					// 拦截 XHR
					if (XHR) window.XMLHttpRequest = XHR;
					Mock._mocked[rurl + (rtype || '')] = {
						rurl: rurl,
						rtype: rtype,
						template: template
					};
					return Mock;
				};

				module.exports = Mock;

				/***/
			},
			/* 1 */
			/***/function (module, exports, __webpack_require__) {

				/* 
	       ## Handler
	   	    处理数据模板。
	       
	       * Handler.gen( template, name?, context? )
	   	        入口方法。
	   	    * Data Template Definition, DTD
	           
	           处理数据模板定义。
	   	        * Handler.array( options )
	           * Handler.object( options )
	           * Handler.number( options )
	           * Handler.boolean( options )
	           * Handler.string( options )
	           * Handler.function( options )
	           * Handler.regexp( options )
	           
	           处理路径（相对和绝对）。
	   	        * Handler.getValueByKeyPath( key, options )
	   	    * Data Placeholder Definition, DPD
	   	        处理数据占位符定义
	   	        * Handler.placeholder( placeholder, context, templateContext, options )
	   	*/

				var Constant = __webpack_require__(2);
				var Util = __webpack_require__(3);
				var Parser = __webpack_require__(4);
				var Random = __webpack_require__(5);
				var RE = __webpack_require__(20);

				var Handler = {
					extend: Util.extend
				};

				/*
	       template        属性值（即数据模板）
	       name            属性名
	       context         数据上下文，生成后的数据
	       templateContext 模板上下文，
	   	    Handle.gen(template, name, options)
	       context
	           currentContext, templateCurrentContext, 
	           path, templatePath
	           root, templateRoot
	   */
				Handler.gen = function (template, name, context) {
					/* jshint -W041 */
					name = name == undefined ? '' : name + '';

					context = context || {};
					context = {
						// 当前访问路径，只有属性名，不包括生成规则
						path: context.path || [Constant.GUID],
						templatePath: context.templatePath || [Constant.GUID++],
						// 最终属性值的上下文
						currentContext: context.currentContext,
						// 属性值模板的上下文
						templateCurrentContext: context.templateCurrentContext || template,
						// 最终值的根
						root: context.root || context.currentContext,
						// 模板的根
						templateRoot: context.templateRoot || context.templateCurrentContext || template
					};
					// console.log('path:', context.path.join('.'), template)

					var rule = Parser.parse(name);
					var type = Util.type(template);
					var data;

					if (Handler[type]) {
						data = Handler[type]({
							// 属性值类型
							type: type,
							// 属性值模板
							template: template,
							// 属性名 + 生成规则
							name: name,
							// 属性名
							parsedName: name ? name.replace(Constant.RE_KEY, '$1') : name,

							// 解析后的生成规则
							rule: rule,
							// 相关上下文
							context: context
						});

						if (!context.root) context.root = data;
						return data;
					}

					return template;
				};

				Handler.extend({
					array: function array(options) {
						var result = [],
						    i,
						    ii;

						// 'name|1': []
						// 'name|count': []
						// 'name|min-max': []
						if (options.template.length === 0) return result;

						// 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
						if (!options.rule.parameters) {
							for (i = 0; i < options.template.length; i++) {
								options.context.path.push(i);
								options.context.templatePath.push(i);
								result.push(Handler.gen(options.template[i], i, {
									path: options.context.path,
									templatePath: options.context.templatePath,
									currentContext: result,
									templateCurrentContext: options.template,
									root: options.context.root || result,
									templateRoot: options.context.templateRoot || options.template
								}));
								options.context.path.pop();
								options.context.templatePath.pop();
							}
						} else {
							// 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
							if (options.rule.min === 1 && options.rule.max === undefined) {
								// fix #17
								options.context.path.push(options.name);
								options.context.templatePath.push(options.name);
								result = Random.pick(Handler.gen(options.template, undefined, {
									path: options.context.path,
									templatePath: options.context.templatePath,
									currentContext: result,
									templateCurrentContext: options.template,
									root: options.context.root || result,
									templateRoot: options.context.templateRoot || options.template
								}));
								options.context.path.pop();
								options.context.templatePath.pop();
							} else {
								// 'data|+1': [{}, {}]
								if (options.rule.parameters[2]) {
									options.template.__order_index = options.template.__order_index || 0;

									options.context.path.push(options.name);
									options.context.templatePath.push(options.name);
									result = Handler.gen(options.template, undefined, {
										path: options.context.path,
										templatePath: options.context.templatePath,
										currentContext: result,
										templateCurrentContext: options.template,
										root: options.context.root || result,
										templateRoot: options.context.templateRoot || options.template
									})[options.template.__order_index % options.template.length];

									options.template.__order_index += +options.rule.parameters[2];

									options.context.path.pop();
									options.context.templatePath.pop();
								} else {
									// 'data|1-10': [{}]
									for (i = 0; i < options.rule.count; i++) {
										// 'data|1-10': [{}, {}]
										for (ii = 0; ii < options.template.length; ii++) {
											options.context.path.push(result.length);
											options.context.templatePath.push(ii);
											result.push(Handler.gen(options.template[ii], result.length, {
												path: options.context.path,
												templatePath: options.context.templatePath,
												currentContext: result,
												templateCurrentContext: options.template,
												root: options.context.root || result,
												templateRoot: options.context.templateRoot || options.template
											}));
											options.context.path.pop();
											options.context.templatePath.pop();
										}
									}
								}
							}
						}
						return result;
					},
					object: function object(options) {
						var result = {},
						    keys,
						    fnKeys,
						    key,
						    parsedKey,
						    inc,
						    i;

						// 'obj|min-max': {}
						/* jshint -W041 */
						if (options.rule.min != undefined) {
							keys = Util.keys(options.template);
							keys = Random.shuffle(keys);
							keys = keys.slice(0, options.rule.count);
							for (i = 0; i < keys.length; i++) {
								key = keys[i];
								parsedKey = key.replace(Constant.RE_KEY, '$1');
								options.context.path.push(parsedKey);
								options.context.templatePath.push(key);
								result[parsedKey] = Handler.gen(options.template[key], key, {
									path: options.context.path,
									templatePath: options.context.templatePath,
									currentContext: result,
									templateCurrentContext: options.template,
									root: options.context.root || result,
									templateRoot: options.context.templateRoot || options.template
								});
								options.context.path.pop();
								options.context.templatePath.pop();
							}
						} else {
							// 'obj': {}
							keys = [];
							fnKeys = []; // #25 改变了非函数属性的顺序，查找起来不方便
							for (key in options.template) {
								(typeof options.template[key] === 'function' ? fnKeys : keys).push(key);
							}
							keys = keys.concat(fnKeys);

							/*
	          会改变非函数属性的顺序
	          keys = Util.keys(options.template)
	          keys.sort(function(a, b) {
	              var afn = typeof options.template[a] === 'function'
	              var bfn = typeof options.template[b] === 'function'
	              if (afn === bfn) return 0
	              if (afn && !bfn) return 1
	              if (!afn && bfn) return -1
	          })
	      */

							for (i = 0; i < keys.length; i++) {
								key = keys[i];
								parsedKey = key.replace(Constant.RE_KEY, '$1');
								options.context.path.push(parsedKey);
								options.context.templatePath.push(key);
								result[parsedKey] = Handler.gen(options.template[key], key, {
									path: options.context.path,
									templatePath: options.context.templatePath,
									currentContext: result,
									templateCurrentContext: options.template,
									root: options.context.root || result,
									templateRoot: options.context.templateRoot || options.template
								});
								options.context.path.pop();
								options.context.templatePath.pop();
								// 'id|+1': 1
								inc = key.match(Constant.RE_KEY);
								if (inc && inc[2] && Util.type(options.template[key]) === 'number') {
									options.template[key] += parseInt(inc[2], 10);
								}
							}
						}
						return result;
					},
					number: function number(options) {
						var result, parts;
						if (options.rule.decimal) {
							// float
							options.template += '';
							parts = options.template.split('.');
							// 'float1|.1-10': 10,
							// 'float2|1-100.1-10': 1,
							// 'float3|999.1-10': 1,
							// 'float4|.3-10': 123.123,
							parts[0] = options.rule.range ? options.rule.count : parts[0];
							parts[1] = (parts[1] || '').slice(0, options.rule.dcount);
							while (parts[1].length < options.rule.dcount) {
								parts[1] +=
								// 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
								parts[1].length < options.rule.dcount - 1 ? Random.character('number') : Random.character('123456789');
							}
							result = parseFloat(parts.join('.'), 10);
						} else {
							// integer
							// 'grade1|1-100': 1,
							result = options.rule.range && !options.rule.parameters[2] ? options.rule.count : options.template;
						}
						return result;
					},
					boolean: function boolean(options) {
						var result;
						// 'prop|multiple': false, 当前值是相反值的概率倍数
						// 'prop|probability-probability': false, 当前值与相反值的概率
						result = options.rule.parameters ? Random.bool(options.rule.min, options.rule.max, options.template) : options.template;
						return result;
					},
					string: function string(options) {
						var result = '',
						    i,
						    placeholders,
						    ph,
						    phed;
						if (options.template.length) {

							//  'foo': '★',
							/* jshint -W041 */
							if (options.rule.count == undefined) {
								result += options.template;
							}

							// 'star|1-5': '★',
							for (i = 0; i < options.rule.count; i++) {
								result += options.template;
							}
							// 'email|1-10': '@EMAIL, ',
							placeholders = result.match(Constant.RE_PLACEHOLDER) || []; // A-Z_0-9 > \w_
							for (i = 0; i < placeholders.length; i++) {
								ph = placeholders[i];

								// 遇到转义斜杠，不需要解析占位符
								if (/^\\/.test(ph)) {
									placeholders.splice(i--, 1);
									continue;
								}

								phed = Handler.placeholder(ph, options.context.currentContext, options.context.templateCurrentContext, options);

								// 只有一个占位符，并且没有其他字符
								if (placeholders.length === 1 && ph === result && (typeof phed === 'undefined' ? 'undefined' : _typeof(phed)) !== (typeof result === 'undefined' ? 'undefined' : _typeof(result))) {
									// 
									result = phed;
									break;

									if (Util.isNumeric(phed)) {
										result = parseFloat(phed, 10);
										break;
									}
									if (/^(true|false)$/.test(phed)) {
										result = phed === 'true' ? true : phed === 'false' ? false : phed; // 已经是布尔值
										break;
									}
								}
								result = result.replace(ph, phed);
							}
						} else {
							// 'ASCII|1-10': '',
							// 'ASCII': '',
							result = options.rule.range ? Random.string(options.rule.count) : options.template;
						}
						return result;
					},
					'function': function _function(options) {
						// ( context, options )
						return options.template.call(options.context.currentContext, options);
					},
					'regexp': function regexp(options) {
						var source = '';

						// 'name': /regexp/,
						/* jshint -W041 */
						if (options.rule.count == undefined) {
							source += options.template.source; // regexp.source
						}

						// 'name|1-5': /regexp/,
						for (var i = 0; i < options.rule.count; i++) {
							source += options.template.source;
						}

						return RE.Handler.gen(RE.Parser.parse(source));
					}
				});

				Handler.extend({
					_all: function _all() {
						var re = {};
						for (var key in Random) {
							re[key.toLowerCase()] = key;
						}return re;
					},
					// 处理占位符，转换为最终值
					placeholder: function placeholder(_placeholder, obj, templateContext, options) {
						// console.log(options.context.path)
						// 1 key, 2 params
						Constant.RE_PLACEHOLDER.exec('');
						var parts = Constant.RE_PLACEHOLDER.exec(_placeholder),
						    key = parts && parts[1],
						    lkey = key && key.toLowerCase(),
						    okey = this._all()[lkey],
						    params = parts && parts[2] || '';
						var pathParts = this.splitPathToArray(key);

						// 解析占位符的参数
						try {
							// 1. 尝试保持参数的类型
							/*
	          #24 [Window Firefox 30.0 引用 占位符 抛错](https://github.com/nuysoft/Mock/issues/24)
	          [BX9056: 各浏览器下 window.eval 方法的执行上下文存在差异](http://www.w3help.org/zh-cn/causes/BX9056)
	          应该属于 Window Firefox 30.0 的 BUG
	      */
							/* jshint -W061 */
							params = eval('(function(){ return [].splice.call(arguments, 0 ) })(' + params + ')');
						} catch (error) {
							// 2. 如果失败，只能解析为字符串
							// console.error(error)
							// if (error instanceof ReferenceError) params = parts[2].split(/,\s*/);
							// else throw error
							params = parts[2].split(/,\s*/);
						}

						// 占位符优先引用数据模板中的属性
						if (obj && key in obj) return obj[key];

						// @index @key
						// if (Constant.RE_INDEX.test(key)) return +options.name
						// if (Constant.RE_KEY.test(key)) return options.name

						// 绝对路径 or 相对路径
						if (key.charAt(0) === '/' || pathParts.length > 1) return this.getValueByKeyPath(key, options);

						// 递归引用数据模板中的属性
						if (templateContext && (typeof templateContext === 'undefined' ? 'undefined' : _typeof(templateContext)) === 'object' && key in templateContext && _placeholder !== templateContext[key] // fix #15 避免自己依赖自己
						) {
								// 先计算被引用的属性值
								templateContext[key] = Handler.gen(templateContext[key], key, {
									currentContext: obj,
									templateCurrentContext: templateContext
								});
								return templateContext[key];
							}

						// 如果未找到，则原样返回
						if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return _placeholder;

						// 递归解析参数中的占位符
						for (var i = 0; i < params.length; i++) {
							Constant.RE_PLACEHOLDER.exec('');
							if (Constant.RE_PLACEHOLDER.test(params[i])) {
								params[i] = Handler.placeholder(params[i], obj, templateContext, options);
							}
						}

						var handle = Random[key] || Random[lkey] || Random[okey];
						switch (Util.type(handle)) {
							case 'array':
								// 自动从数组中取一个，例如 @areas
								return Random.pick(handle);
							case 'function':
								// 执行占位符方法（大多数情况）
								handle.options = options;
								var re = handle.apply(Random, params);
								if (re === undefined) re = ''; // 因为是在字符串中，所以默认为空字符串。
								delete handle.options;
								return re;
						}
					},
					getValueByKeyPath: function getValueByKeyPath(key, options) {
						var originalKey = key;
						var keyPathParts = this.splitPathToArray(key);
						var absolutePathParts = [];

						// 绝对路径
						if (key.charAt(0) === '/') {
							absolutePathParts = [options.context.path[0]].concat(this.normalizePath(keyPathParts));
						} else {
							// 相对路径
							if (keyPathParts.length > 1) {
								absolutePathParts = options.context.path.slice(0);
								absolutePathParts.pop();
								absolutePathParts = this.normalizePath(absolutePathParts.concat(keyPathParts));
							}
						}

						key = keyPathParts[keyPathParts.length - 1];
						var currentContext = options.context.root;
						var templateCurrentContext = options.context.templateRoot;
						for (var i = 1; i < absolutePathParts.length - 1; i++) {
							currentContext = currentContext[absolutePathParts[i]];
							templateCurrentContext = templateCurrentContext[absolutePathParts[i]];
						}
						// 引用的值已经计算好
						if (currentContext && key in currentContext) return currentContext[key];

						// 尚未计算，递归引用数据模板中的属性
						if (templateCurrentContext && (typeof templateCurrentContext === 'undefined' ? 'undefined' : _typeof(templateCurrentContext)) === 'object' && key in templateCurrentContext && originalKey !== templateCurrentContext[key] // fix #15 避免自己依赖自己
						) {
								// 先计算被引用的属性值
								templateCurrentContext[key] = Handler.gen(templateCurrentContext[key], key, {
									currentContext: currentContext,
									templateCurrentContext: templateCurrentContext
								});
								return templateCurrentContext[key];
							}
					},
					// https://github.com/kissyteam/kissy/blob/master/src/path/src/path.js
					normalizePath: function normalizePath(pathParts) {
						var newPathParts = [];
						for (var i = 0; i < pathParts.length; i++) {
							switch (pathParts[i]) {
								case '..':
									newPathParts.pop();
									break;
								case '.':
									break;
								default:
									newPathParts.push(pathParts[i]);
							}
						}
						return newPathParts;
					},
					splitPathToArray: function splitPathToArray(path) {
						var parts = path.split(/\/+/);
						if (!parts[parts.length - 1]) parts = parts.slice(0, -1);
						if (!parts[0]) parts = parts.slice(1);
						return parts;
					}
				});

				module.exports = Handler;

				/***/
			},
			/* 2 */
			/***/function (module, exports) {

				/*
	       ## Constant
	   	    常量集合。
	    */
				/*
	       RE_KEY
	           'name|min-max': value
	           'name|count': value
	           'name|min-max.dmin-dmax': value
	           'name|min-max.dcount': value
	           'name|count.dmin-dmax': value
	           'name|count.dcount': value
	           'name|+step': value
	   	        1 name, 2 step, 3 range [ min, max ], 4 drange [ dmin, dmax ]
	   	    RE_PLACEHOLDER
	           placeholder(*)
	   	    [正则查看工具](http://www.regexper.com/)
	   	    #26 生成规则 支持 负数，例如 number|-100-100
	   */
				module.exports = {
					GUID: 1,
					RE_KEY: /(.+)\|(?:\+(\d+)|([\+\-]?\d+-?[\+\-]?\d*)?(?:\.(\d+-?\d*))?)/,
					RE_RANGE: /([\+\-]?\d+)-?([\+\-]?\d+)?/,
					RE_PLACEHOLDER: /\\*@([^@#%&()\?\s]+)(?:\((.*?)\))?/g
					// /\\*@([^@#%&()\?\s\/\.]+)(?:\((.*?)\))?/g
					// RE_INDEX: /^index$/,
					// RE_KEY: /^key$/
				};

				/***/
			},
			/* 3 */
			/***/function (module, exports) {

				/*
	       ## Utilities
	   */
				var Util = {};

				Util.extend = function extend() {
					var target = arguments[0] || {},
					    i = 1,
					    length = arguments.length,
					    options,
					    name,
					    src,
					    copy,
					    clone;

					if (length === 1) {
						target = this;
						i = 0;
					}

					for (; i < length; i++) {
						options = arguments[i];
						if (!options) continue;

						for (name in options) {
							src = target[name];
							copy = options[name];

							if (target === copy) continue;
							if (copy === undefined) continue;

							if (Util.isArray(copy) || Util.isObject(copy)) {
								if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : [];
								if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {};

								target[name] = Util.extend(clone, copy);
							} else {
								target[name] = copy;
							}
						}
					}

					return target;
				};

				Util.each = function each(obj, iterator, context) {
					var i, key;
					if (this.type(obj) === 'number') {
						for (i = 0; i < obj; i++) {
							iterator(i, i);
						}
					} else if (obj.length === +obj.length) {
						for (i = 0; i < obj.length; i++) {
							if (iterator.call(context, obj[i], i, obj) === false) break;
						}
					} else {
						for (key in obj) {
							if (iterator.call(context, obj[key], key, obj) === false) break;
						}
					}
				};

				Util.type = function type(obj) {
					return obj === null || obj === undefined ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase();
				};

				Util.each('String Object Array RegExp Function'.split(' '), function (value) {
					Util['is' + value] = function (obj) {
						return Util.type(obj) === value.toLowerCase();
					};
				});

				Util.isObjectOrArray = function (value) {
					return Util.isObject(value) || Util.isArray(value);
				};

				Util.isNumeric = function (value) {
					return !isNaN(parseFloat(value)) && isFinite(value);
				};

				Util.keys = function (obj) {
					var keys = [];
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) keys.push(key);
					}
					return keys;
				};
				Util.values = function (obj) {
					var values = [];
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) values.push(obj[key]);
					}
					return values;
				};

				/*
	       ### Mock.heredoc(fn)
	   	    * Mock.heredoc(fn)
	   	    以直观、安全的方式书写（多行）HTML 模板。
	   	    **使用示例**如下所示：
	   	        var tpl = Mock.heredoc(function() {
	               /*!
	           {{email}}{{age}}
	           <!-- Mock { 
	               email: '@EMAIL',
	               age: '@INT(1,100)'
	           } -->
	               *\/
	           })
	       
	       **相关阅读**
	       * [Creating multiline strings in JavaScript](http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript)、
	   */
				Util.heredoc = function heredoc(fn) {
					// 1. 移除起始的 function(){ /*!
					// 2. 移除末尾的 */ }
					// 3. 移除起始和末尾的空格
					return fn.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '').replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, ''); // .trim()
				};

				Util.noop = function () {};

				module.exports = Util;

				/***/
			},
			/* 4 */
			/***/function (module, exports, __webpack_require__) {

				/*
	   	## Parser
	   		解析数据模板（属性名部分）。
	   		* Parser.parse( name )
	   		
	   		```json
	   		{
	   			parameters: [ name, inc, range, decimal ],
	   			rnage: [ min , max ],
	   				min: min,
	   			max: max,
	   			count : count,
	   				decimal: decimal,
	   			dmin: dmin,
	   			dmax: dmax,
	   			dcount: dcount
	   		}
	   		```
	    */

				var Constant = __webpack_require__(2);
				var Random = __webpack_require__(5);

				/* jshint -W041 */
				module.exports = {
					parse: function parse(name) {
						name = name == undefined ? '' : name + '';

						var parameters = (name || '').match(Constant.RE_KEY);

						var range = parameters && parameters[3] && parameters[3].match(Constant.RE_RANGE);
						var min = range && range[1] && parseInt(range[1], 10); // || 1
						var max = range && range[2] && parseInt(range[2], 10); // || 1
						// repeat || min-max || 1
						// var count = range ? !range[2] && parseInt(range[1], 10) || Random.integer(min, max) : 1
						var count = range ? !range[2] ? parseInt(range[1], 10) : Random.integer(min, max) : undefined;

						var decimal = parameters && parameters[4] && parameters[4].match(Constant.RE_RANGE);
						var dmin = decimal && decimal[1] && parseInt(decimal[1], 10); // || 0,
						var dmax = decimal && decimal[2] && parseInt(decimal[2], 10); // || 0,
						// int || dmin-dmax || 0
						var dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Random.integer(dmin, dmax) : undefined;

						var result = {
							// 1 name, 2 inc, 3 range, 4 decimal
							parameters: parameters,
							// 1 min, 2 max
							range: range,
							min: min,
							max: max,
							// min-max
							count: count,
							// 是否有 decimal
							decimal: decimal,
							dmin: dmin,
							dmax: dmax,
							// dmin-dimax
							dcount: dcount
						};

						for (var r in result) {
							if (result[r] != undefined) return result;
						}

						return {};
					}
				};

				/***/
			},
			/* 5 */
			/***/function (module, exports, __webpack_require__) {

				/*
	       ## Mock.Random
	       
	       工具类，用于生成各种随机数据。
	   */

				var Util = __webpack_require__(3);

				var Random = {
					extend: Util.extend
				};

				Random.extend(__webpack_require__(6));
				Random.extend(__webpack_require__(7));
				Random.extend(__webpack_require__(8));
				Random.extend(__webpack_require__(10));
				Random.extend(__webpack_require__(13));
				Random.extend(__webpack_require__(15));
				Random.extend(__webpack_require__(16));
				Random.extend(__webpack_require__(17));
				Random.extend(__webpack_require__(14));
				Random.extend(__webpack_require__(19));

				module.exports = Random;

				/***/
			},
			/* 6 */
			/***/function (module, exports) {

				/*
	       ## Basics
	   */
				module.exports = {
					// 返回一个随机的布尔值。
					boolean: function boolean(min, max, cur) {
						if (cur !== undefined) {
							min = typeof min !== 'undefined' && !isNaN(min) ? parseInt(min, 10) : 1;
							max = typeof max !== 'undefined' && !isNaN(max) ? parseInt(max, 10) : 1;
							return Math.random() > 1.0 / (min + max) * min ? !cur : cur;
						}

						return Math.random() >= 0.5;
					},
					bool: function bool(min, max, cur) {
						return this.boolean(min, max, cur);
					},
					// 返回一个随机的自然数（大于等于 0 的整数）。
					natural: function natural(min, max) {
						min = typeof min !== 'undefined' ? parseInt(min, 10) : 0;
						max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992; // 2^53
						return Math.round(Math.random() * (max - min)) + min;
					},
					// 返回一个随机的整数。
					integer: function integer(min, max) {
						min = typeof min !== 'undefined' ? parseInt(min, 10) : -9007199254740992;
						max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992; // 2^53
						return Math.round(Math.random() * (max - min)) + min;
					},
					int: function int(min, max) {
						return this.integer(min, max);
					},
					// 返回一个随机的浮点数。
					float: function float(min, max, dmin, dmax) {
						dmin = dmin === undefined ? 0 : dmin;
						dmin = Math.max(Math.min(dmin, 17), 0);
						dmax = dmax === undefined ? 17 : dmax;
						dmax = Math.max(Math.min(dmax, 17), 0);
						var ret = this.integer(min, max) + '.';
						for (var i = 0, dcount = this.natural(dmin, dmax); i < dcount; i++) {
							ret +=
							// 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
							i < dcount - 1 ? this.character('number') : this.character('123456789');
						}
						return parseFloat(ret, 10);
					},
					// 返回一个随机字符。
					character: function character(pool) {
						var pools = {
							lower: 'abcdefghijklmnopqrstuvwxyz',
							upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
							number: '0123456789',
							symbol: '!@#$%^&*()[]'
						};
						pools.alpha = pools.lower + pools.upper;
						pools['undefined'] = pools.lower + pools.upper + pools.number + pools.symbol;

						pool = pools[('' + pool).toLowerCase()] || pool;
						return pool.charAt(this.natural(0, pool.length - 1));
					},
					char: function char(pool) {
						return this.character(pool);
					},
					// 返回一个随机字符串。
					string: function string(pool, min, max) {
						var len;
						switch (arguments.length) {
							case 0:
								// ()
								len = this.natural(3, 7);
								break;
							case 1:
								// ( length )
								len = pool;
								pool = undefined;
								break;
							case 2:
								// ( pool, length )
								if (typeof arguments[0] === 'string') {
									len = min;
								} else {
									// ( min, max )
									len = this.natural(pool, min);
									pool = undefined;
								}
								break;
							case 3:
								len = this.natural(min, max);
								break;
						}

						var text = '';
						for (var i = 0; i < len; i++) {
							text += this.character(pool);
						}

						return text;
					},
					str: function str() /*pool, min, max*/{
						return this.string.apply(this, arguments);
					},
					// 返回一个整型数组。
					range: function range(start, stop, step) {
						// range( stop )
						if (arguments.length <= 1) {
							stop = start || 0;
							start = 0;
						}
						// range( start, stop )
						step = arguments[2] || 1;

						start = +start;
						stop = +stop;
						step = +step;

						var len = Math.max(Math.ceil((stop - start) / step), 0);
						var idx = 0;
						var range = new Array(len);

						while (idx < len) {
							range[idx++] = start;
							start += step;
						}

						return range;
					}
				};

				/***/
			},
			/* 7 */
			/***/function (module, exports) {

				/*
	       ## Date
	   */
				var patternLetters = {
					yyyy: 'getFullYear',
					yy: function yy(date) {
						return ('' + date.getFullYear()).slice(2);
					},
					y: 'yy',

					MM: function MM(date) {
						var m = date.getMonth() + 1;
						return m < 10 ? '0' + m : m;
					},
					M: function M(date) {
						return date.getMonth() + 1;
					},

					dd: function dd(date) {
						var d = date.getDate();
						return d < 10 ? '0' + d : d;
					},
					d: 'getDate',

					HH: function HH(date) {
						var h = date.getHours();
						return h < 10 ? '0' + h : h;
					},
					H: 'getHours',
					hh: function hh(date) {
						var h = date.getHours() % 12;
						return h < 10 ? '0' + h : h;
					},
					h: function h(date) {
						return date.getHours() % 12;
					},

					mm: function mm(date) {
						var m = date.getMinutes();
						return m < 10 ? '0' + m : m;
					},
					m: 'getMinutes',

					ss: function ss(date) {
						var s = date.getSeconds();
						return s < 10 ? '0' + s : s;
					},
					s: 'getSeconds',

					SS: function SS(date) {
						var ms = date.getMilliseconds();
						return ms < 10 && '00' + ms || ms < 100 && '0' + ms || ms;
					},
					S: 'getMilliseconds',

					A: function A(date) {
						return date.getHours() < 12 ? 'AM' : 'PM';
					},
					a: function a(date) {
						return date.getHours() < 12 ? 'am' : 'pm';
					},
					T: 'getTime'
				};
				module.exports = {
					// 日期占位符集合。
					_patternLetters: patternLetters,
					// 日期占位符正则。
					_rformat: new RegExp(function () {
						var re = [];
						for (var i in patternLetters) {
							re.push(i);
						}return '(' + re.join('|') + ')';
					}(), 'g'),
					// 格式化日期。
					_formatDate: function _formatDate(date, format) {
						return format.replace(this._rformat, function creatNewSubString($0, flag) {
							return typeof patternLetters[flag] === 'function' ? patternLetters[flag](date) : patternLetters[flag] in patternLetters ? creatNewSubString($0, patternLetters[flag]) : date[patternLetters[flag]]();
						});
					},
					// 生成一个随机的 Date 对象。
					_randomDate: function _randomDate(min, max) {
						// min, max
						min = min === undefined ? new Date(0) : min;
						max = max === undefined ? new Date() : max;
						return new Date(Math.random() * (max.getTime() - min.getTime()));
					},
					// 返回一个随机的日期字符串。
					date: function date(format) {
						format = format || 'yyyy-MM-dd';
						return this._formatDate(this._randomDate(), format);
					},
					// 返回一个随机的时间字符串。
					time: function time(format) {
						format = format || 'HH:mm:ss';
						return this._formatDate(this._randomDate(), format);
					},
					// 返回一个随机的日期和时间字符串。
					datetime: function datetime(format) {
						format = format || 'yyyy-MM-dd HH:mm:ss';
						return this._formatDate(this._randomDate(), format);
					},
					// 返回当前的日期和时间字符串。
					now: function now(unit, format) {
						// now(unit) now(format)
						if (arguments.length === 1) {
							// now(format)
							if (!/year|month|day|hour|minute|second|week/.test(unit)) {
								format = unit;
								unit = '';
							}
						}
						unit = (unit || '').toLowerCase();
						format = format || 'yyyy-MM-dd HH:mm:ss';

						var date = new Date();

						/* jshint -W086 */
						// 参考自 http://momentjs.cn/docs/#/manipulating/start-of/
						switch (unit) {
							case 'year':
								date.setMonth(0);
							case 'month':
								date.setDate(1);
							case 'week':
							case 'day':
								date.setHours(0);
							case 'hour':
								date.setMinutes(0);
							case 'minute':
								date.setSeconds(0);
							case 'second':
								date.setMilliseconds(0);
						}
						switch (unit) {
							case 'week':
								date.setDate(date.getDate() - date.getDay());
						}

						return this._formatDate(date, format);
					}
				};

				/***/
			},
			/* 8 */
			/***/function (module, exports, __webpack_require__) {

				/* WEBPACK VAR INJECTION */(function (module) {
					/* global document  */
					/*
	        ## Image
	    */
					module.exports = {
						// 常见的广告宽高
						_adSize: ['300x250', '250x250', '240x400', '336x280', '180x150', '720x300', '468x60', '234x60', '88x31', '120x90', '120x60', '120x240', '125x125', '728x90', '160x600', '120x600', '300x600'],
						// 常见的屏幕宽高
						_screenSize: ['320x200', '320x240', '640x480', '800x480', '800x480', '1024x600', '1024x768', '1280x800', '1440x900', '1920x1200', '2560x1600'],
						// 常见的视频宽高
						_videoSize: ['720x480', '768x576', '1280x720', '1920x1080'],
						/*
	         生成一个随机的图片地址。
	          替代图片源
	             http://fpoimg.com/
	         参考自 
	             http://rensanning.iteye.com/blog/1933310
	             http://code.tutsplus.com/articles/the-top-8-placeholders-for-web-designers--net-19485
	     */
						image: function image(size, background, foreground, format, text) {
							// Random.image( size, background, foreground, text )
							if (arguments.length === 4) {
								text = format;
								format = undefined;
							}
							// Random.image( size, background, text )
							if (arguments.length === 3) {
								text = foreground;
								foreground = undefined;
							}
							// Random.image()
							if (!size) size = this.pick(this._adSize);

							if (background && ~background.indexOf('#')) background = background.slice(1);
							if (foreground && ~foreground.indexOf('#')) foreground = foreground.slice(1);

							// http://dummyimage.com/600x400/cc00cc/470047.png&text=hello
							return 'http://dummyimage.com/' + size + (background ? '/' + background : '') + (foreground ? '/' + foreground : '') + (format ? '.' + format : '') + (text ? '&text=' + text : '');
						},
						img: function img() {
							return this.image.apply(this, arguments);
						},

						/*
	         BrandColors
	         http://brandcolors.net/
	         A collection of major brand color codes curated by Galen Gidman.
	         大牌公司的颜色集合
	          // 获取品牌和颜色
	         $('h2').each(function(index, item){
	             item = $(item)
	             console.log('\'' + item.text() + '\'', ':', '\'' + item.next().text() + '\'', ',')
	         })
	     */
						_brandColors: {
							'4ormat': '#fb0a2a',
							'500px': '#02adea',
							'About.me (blue)': '#00405d',
							'About.me (yellow)': '#ffcc33',
							'Addvocate': '#ff6138',
							'Adobe': '#ff0000',
							'Aim': '#fcd20b',
							'Amazon': '#e47911',
							'Android': '#a4c639',
							'Angie\'s List': '#7fbb00',
							'AOL': '#0060a3',
							'Atlassian': '#003366',
							'Behance': '#053eff',
							'Big Cartel': '#97b538',
							'bitly': '#ee6123',
							'Blogger': '#fc4f08',
							'Boeing': '#0039a6',
							'Booking.com': '#003580',
							'Carbonmade': '#613854',
							'Cheddar': '#ff7243',
							'Code School': '#3d4944',
							'Delicious': '#205cc0',
							'Dell': '#3287c1',
							'Designmoo': '#e54a4f',
							'Deviantart': '#4e6252',
							'Designer News': '#2d72da',
							'Devour': '#fd0001',
							'DEWALT': '#febd17',
							'Disqus (blue)': '#59a3fc',
							'Disqus (orange)': '#db7132',
							'Dribbble': '#ea4c89',
							'Dropbox': '#3d9ae8',
							'Drupal': '#0c76ab',
							'Dunked': '#2a323a',
							'eBay': '#89c507',
							'Ember': '#f05e1b',
							'Engadget': '#00bdf6',
							'Envato': '#528036',
							'Etsy': '#eb6d20',
							'Evernote': '#5ba525',
							'Fab.com': '#dd0017',
							'Facebook': '#3b5998',
							'Firefox': '#e66000',
							'Flickr (blue)': '#0063dc',
							'Flickr (pink)': '#ff0084',
							'Forrst': '#5b9a68',
							'Foursquare': '#25a0ca',
							'Garmin': '#007cc3',
							'GetGlue': '#2d75a2',
							'Gimmebar': '#f70078',
							'GitHub': '#171515',
							'Google Blue': '#0140ca',
							'Google Green': '#16a61e',
							'Google Red': '#dd1812',
							'Google Yellow': '#fcca03',
							'Google+': '#dd4b39',
							'Grooveshark': '#f77f00',
							'Groupon': '#82b548',
							'Hacker News': '#ff6600',
							'HelloWallet': '#0085ca',
							'Heroku (light)': '#c7c5e6',
							'Heroku (dark)': '#6567a5',
							'HootSuite': '#003366',
							'Houzz': '#73ba37',
							'HTML5': '#ec6231',
							'IKEA': '#ffcc33',
							'IMDb': '#f3ce13',
							'Instagram': '#3f729b',
							'Intel': '#0071c5',
							'Intuit': '#365ebf',
							'Kickstarter': '#76cc1e',
							'kippt': '#e03500',
							'Kodery': '#00af81',
							'LastFM': '#c3000d',
							'LinkedIn': '#0e76a8',
							'Livestream': '#cf0005',
							'Lumo': '#576396',
							'Mixpanel': '#a086d3',
							'Meetup': '#e51937',
							'Nokia': '#183693',
							'NVIDIA': '#76b900',
							'Opera': '#cc0f16',
							'Path': '#e41f11',
							'PayPal (dark)': '#1e477a',
							'PayPal (light)': '#3b7bbf',
							'Pinboard': '#0000e6',
							'Pinterest': '#c8232c',
							'PlayStation': '#665cbe',
							'Pocket': '#ee4056',
							'Prezi': '#318bff',
							'Pusha': '#0f71b4',
							'Quora': '#a82400',
							'QUOTE.fm': '#66ceff',
							'Rdio': '#008fd5',
							'Readability': '#9c0000',
							'Red Hat': '#cc0000',
							'Resource': '#7eb400',
							'Rockpack': '#0ba6ab',
							'Roon': '#62b0d9',
							'RSS': '#ee802f',
							'Salesforce': '#1798c1',
							'Samsung': '#0c4da2',
							'Shopify': '#96bf48',
							'Skype': '#00aff0',
							'Snagajob': '#f47a20',
							'Softonic': '#008ace',
							'SoundCloud': '#ff7700',
							'Space Box': '#f86960',
							'Spotify': '#81b71a',
							'Sprint': '#fee100',
							'Squarespace': '#121212',
							'StackOverflow': '#ef8236',
							'Staples': '#cc0000',
							'Status Chart': '#d7584f',
							'Stripe': '#008cdd',
							'StudyBlue': '#00afe1',
							'StumbleUpon': '#f74425',
							'T-Mobile': '#ea0a8e',
							'Technorati': '#40a800',
							'The Next Web': '#ef4423',
							'Treehouse': '#5cb868',
							'Trulia': '#5eab1f',
							'Tumblr': '#34526f',
							'Twitch.tv': '#6441a5',
							'Twitter': '#00acee',
							'TYPO3': '#ff8700',
							'Ubuntu': '#dd4814',
							'Ustream': '#3388ff',
							'Verizon': '#ef1d1d',
							'Vimeo': '#86c9ef',
							'Vine': '#00a478',
							'Virb': '#06afd8',
							'Virgin Media': '#cc0000',
							'Wooga': '#5b009c',
							'WordPress (blue)': '#21759b',
							'WordPress (orange)': '#d54e21',
							'WordPress (grey)': '#464646',
							'Wunderlist': '#2b88d9',
							'XBOX': '#9bc848',
							'XING': '#126567',
							'Yahoo!': '#720e9e',
							'Yandex': '#ffcc00',
							'Yelp': '#c41200',
							'YouTube': '#c4302b',
							'Zalongo': '#5498dc',
							'Zendesk': '#78a300',
							'Zerply': '#9dcc7a',
							'Zootool': '#5e8b1d'
						},
						_brandNames: function _brandNames() {
							var brands = [];
							for (var b in this._brandColors) {
								brands.push(b);
							}
							return brands;
						},
						/*
	         生成一段随机的 Base64 图片编码。
	          https://github.com/imsky/holder
	         Holder renders image placeholders entirely on the client side.
	          dataImageHolder: function(size) {
	             return 'holder.js/' + size
	         },
	     */
						dataImage: function dataImage(size, text) {
							var canvas;
							if (typeof document !== 'undefined') {
								canvas = document.createElement('canvas');
							} else {
								/*
	           https://github.com/Automattic/node-canvas
	               npm install canvas --save
	           安装问题：
	           * http://stackoverflow.com/questions/22953206/gulp-issues-with-cario-install-command-not-found-when-trying-to-installing-canva
	           * https://github.com/Automattic/node-canvas/issues/415
	           * https://github.com/Automattic/node-canvas/wiki/_pages
	            PS：node-canvas 的安装过程实在是太繁琐了，所以不放入 package.json 的 dependencies。
	        */
								var Canvas = module.require('canvas');
								canvas = new Canvas();
							}

							var ctx = canvas && canvas.getContext && canvas.getContext("2d");
							if (!canvas || !ctx) return '';

							if (!size) size = this.pick(this._adSize);
							text = text !== undefined ? text : size;

							size = size.split('x');

							var width = parseInt(size[0], 10),
							    height = parseInt(size[1], 10),
							    background = this._brandColors[this.pick(this._brandNames())],
							    foreground = '#FFF',
							    text_height = 14,
							    font = 'sans-serif';

							canvas.width = width;
							canvas.height = height;
							ctx.textAlign = 'center';
							ctx.textBaseline = 'middle';
							ctx.fillStyle = background;
							ctx.fillRect(0, 0, width, height);
							ctx.fillStyle = foreground;
							ctx.font = 'bold ' + text_height + 'px ' + font;
							ctx.fillText(text, width / 2, height / 2, width);
							return canvas.toDataURL('image/png');
						}
					};
					/* WEBPACK VAR INJECTION */
				}).call(exports, __webpack_require__(9)(module));

				/***/
			},
			/* 9 */
			/***/function (module, exports) {

				module.exports = function (module) {
					if (!module.webpackPolyfill) {
						module.deprecate = function () {};
						module.paths = [];
						// module.parent = undefined by default
						module.children = [];
						module.webpackPolyfill = 1;
					}
					return module;
				};

				/***/
			},
			/* 10 */
			/***/function (module, exports, __webpack_require__) {

				/*
	       ## Color
	   	    http://llllll.li/randomColor/
	           A color generator for JavaScript.
	           randomColor generates attractive colors by default. More specifically, randomColor produces bright colors with a reasonably high saturation. This makes randomColor particularly useful for data visualizations and generative art.
	   	    http://randomcolour.com/
	           var bg_colour = Math.floor(Math.random() * 16777215).toString(16);
	           bg_colour = "#" + ("000000" + bg_colour).slice(-6);
	           document.bgColor = bg_colour;
	       
	       http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
	           Creating random colors is actually more difficult than it seems. The randomness itself is easy, but aesthetically pleasing randomness is more difficult.
	           https://github.com/devongovett/color-generator
	   	    http://www.paulirish.com/2009/random-hex-color-code-snippets/
	           Random Hex Color Code Generator in JavaScript
	   	    http://chancejs.com/#color
	           chance.color()
	           // => '#79c157'
	           chance.color({format: 'hex'})
	           // => '#d67118'
	           chance.color({format: 'shorthex'})
	           // => '#60f'
	           chance.color({format: 'rgb'})
	           // => 'rgb(110,52,164)'
	   	    http://tool.c7sky.com/webcolor
	           网页设计常用色彩搭配表
	       
	       https://github.com/One-com/one-color
	           An OO-based JavaScript color parser/computation toolkit with support for RGB, HSV, HSL, CMYK, and alpha channels.
	           API 很赞
	   	    https://github.com/harthur/color
	           JavaScript color conversion and manipulation library
	   	    https://github.com/leaverou/css-colors
	           Share & convert CSS colors
	       http://leaverou.github.io/css-colors/#slategray
	           Type a CSS color keyword, #hex, hsl(), rgba(), whatever:
	   	    色调 hue
	           http://baike.baidu.com/view/23368.htm
	           色调指的是一幅画中画面色彩的总体倾向，是大的色彩效果。
	       饱和度 saturation
	           http://baike.baidu.com/view/189644.htm
	           饱和度是指色彩的鲜艳程度，也称色彩的纯度。饱和度取决于该色中含色成分和消色成分（灰色）的比例。含色成分越大，饱和度越大；消色成分越大，饱和度越小。
	       亮度 brightness
	           http://baike.baidu.com/view/34773.htm
	           亮度是指发光体（反光体）表面发光（反光）强弱的物理量。
	       照度 luminosity
	           物体被照亮的程度,采用单位面积所接受的光通量来表示,表示单位为勒[克斯](Lux,lx) ,即 1m / m2 。
	   	    http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
	           var letters = '0123456789ABCDEF'.split('')
	           var color = '#'
	           for (var i = 0; i < 6; i++) {
	               color += letters[Math.floor(Math.random() * 16)]
	           }
	           return color
	       
	           // 随机生成一个无脑的颜色，格式为 '#RRGGBB'。
	           // _brainlessColor()
	           var color = Math.floor(
	               Math.random() *
	               (16 * 16 * 16 * 16 * 16 * 16 - 1)
	           ).toString(16)
	           color = "#" + ("000000" + color).slice(-6)
	           return color.toUpperCase()
	   */

				var Convert = __webpack_require__(11);
				var DICT = __webpack_require__(12);

				module.exports = {
					// 随机生成一个有吸引力的颜色，格式为 '#RRGGBB'。
					color: function color(name) {
						if (name || DICT[name]) return DICT[name].nicer;
						return this.hex();
					},
					// #DAC0DE
					hex: function hex() {
						var hsv = this._goldenRatioColor();
						var rgb = Convert.hsv2rgb(hsv);
						var hex = Convert.rgb2hex(rgb[0], rgb[1], rgb[2]);
						return hex;
					},
					// rgb(128,255,255)
					rgb: function rgb() {
						var hsv = this._goldenRatioColor();
						var rgb = Convert.hsv2rgb(hsv);
						return 'rgb(' + parseInt(rgb[0], 10) + ', ' + parseInt(rgb[1], 10) + ', ' + parseInt(rgb[2], 10) + ')';
					},
					// rgba(128,255,255,0.3)
					rgba: function rgba() {
						var hsv = this._goldenRatioColor();
						var rgb = Convert.hsv2rgb(hsv);
						return 'rgba(' + parseInt(rgb[0], 10) + ', ' + parseInt(rgb[1], 10) + ', ' + parseInt(rgb[2], 10) + ', ' + Math.random().toFixed(2) + ')';
					},
					// hsl(300,80%,90%)
					hsl: function hsl() {
						var hsv = this._goldenRatioColor();
						var hsl = Convert.hsv2hsl(hsv);
						return 'hsl(' + parseInt(hsl[0], 10) + ', ' + parseInt(hsl[1], 10) + ', ' + parseInt(hsl[2], 10) + ')';
					},
					// http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
					// https://github.com/devongovett/color-generator/blob/master/index.js
					// 随机生成一个有吸引力的颜色。
					_goldenRatioColor: function _goldenRatioColor(saturation, value) {
						this._goldenRatio = 0.618033988749895;
						this._hue = this._hue || Math.random();
						this._hue += this._goldenRatio;
						this._hue %= 1;

						if (typeof saturation !== "number") saturation = 0.5;
						if (typeof value !== "number") value = 0.95;

						return [this._hue * 360, saturation * 100, value * 100];
					}
				};

				/***/
			},
			/* 11 */
			/***/function (module, exports) {

				/*
	       ## Color Convert
	   	    http://blog.csdn.net/idfaya/article/details/6770414
	           颜色空间RGB与HSV(HSL)的转换
	   */
				// https://github.com/harthur/color-convert/blob/master/conversions.js
				module.exports = {
					rgb2hsl: function rgb2hsl(rgb) {
						var r = rgb[0] / 255,
						    g = rgb[1] / 255,
						    b = rgb[2] / 255,
						    min = Math.min(r, g, b),
						    max = Math.max(r, g, b),
						    delta = max - min,
						    h,
						    s,
						    l;

						if (max == min) h = 0;else if (r == max) h = (g - b) / delta;else if (g == max) h = 2 + (b - r) / delta;else if (b == max) h = 4 + (r - g) / delta;

						h = Math.min(h * 60, 360);

						if (h < 0) h += 360;

						l = (min + max) / 2;

						if (max == min) s = 0;else if (l <= 0.5) s = delta / (max + min);else s = delta / (2 - max - min);

						return [h, s * 100, l * 100];
					},
					rgb2hsv: function rgb2hsv(rgb) {
						var r = rgb[0],
						    g = rgb[1],
						    b = rgb[2],
						    min = Math.min(r, g, b),
						    max = Math.max(r, g, b),
						    delta = max - min,
						    h,
						    s,
						    v;

						if (max === 0) s = 0;else s = delta / max * 1000 / 10;

						if (max == min) h = 0;else if (r == max) h = (g - b) / delta;else if (g == max) h = 2 + (b - r) / delta;else if (b == max) h = 4 + (r - g) / delta;

						h = Math.min(h * 60, 360);

						if (h < 0) h += 360;

						v = max / 255 * 1000 / 10;

						return [h, s, v];
					},
					hsl2rgb: function hsl2rgb(hsl) {
						var h = hsl[0] / 360,
						    s = hsl[1] / 100,
						    l = hsl[2] / 100,
						    t1,
						    t2,
						    t3,
						    rgb,
						    val;

						if (s === 0) {
							val = l * 255;
							return [val, val, val];
						}

						if (l < 0.5) t2 = l * (1 + s);else t2 = l + s - l * s;
						t1 = 2 * l - t2;

						rgb = [0, 0, 0];
						for (var i = 0; i < 3; i++) {
							t3 = h + 1 / 3 * -(i - 1);
							if (t3 < 0) t3++;
							if (t3 > 1) t3--;

							if (6 * t3 < 1) val = t1 + (t2 - t1) * 6 * t3;else if (2 * t3 < 1) val = t2;else if (3 * t3 < 2) val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;else val = t1;

							rgb[i] = val * 255;
						}

						return rgb;
					},
					hsl2hsv: function hsl2hsv(hsl) {
						var h = hsl[0],
						    s = hsl[1] / 100,
						    l = hsl[2] / 100,
						    sv,
						    v;
						l *= 2;
						s *= l <= 1 ? l : 2 - l;
						v = (l + s) / 2;
						sv = 2 * s / (l + s);
						return [h, sv * 100, v * 100];
					},
					hsv2rgb: function hsv2rgb(hsv) {
						var h = hsv[0] / 60;
						var s = hsv[1] / 100;
						var v = hsv[2] / 100;
						var hi = Math.floor(h) % 6;

						var f = h - Math.floor(h);
						var p = 255 * v * (1 - s);
						var q = 255 * v * (1 - s * f);
						var t = 255 * v * (1 - s * (1 - f));

						v = 255 * v;

						switch (hi) {
							case 0:
								return [v, t, p];
							case 1:
								return [q, v, p];
							case 2:
								return [p, v, t];
							case 3:
								return [p, q, v];
							case 4:
								return [t, p, v];
							case 5:
								return [v, p, q];
						}
					},
					hsv2hsl: function hsv2hsl(hsv) {
						var h = hsv[0],
						    s = hsv[1] / 100,
						    v = hsv[2] / 100,
						    sl,
						    l;

						l = (2 - s) * v;
						sl = s * v;
						sl /= l <= 1 ? l : 2 - l;
						l /= 2;
						return [h, sl * 100, l * 100];
					},
					// http://www.140byt.es/keywords/color
					rgb2hex: function rgb2hex(a, // red, as a number from 0 to 255
					b, // green, as a number from 0 to 255
					c // blue, as a number from 0 to 255
					) {
						return "#" + ((256 + a << 8 | b) << 8 | c).toString(16).slice(1);
					},
					hex2rgb: function hex2rgb(a // take a "#xxxxxx" hex string,
					) {
						a = '0x' + a.slice(1).replace(a.length > 4 ? a : /./g, '$&$&') | 0;
						return [a >> 16, a >> 8 & 255, a & 255];
					}
				};

				/***/
			},
			/* 12 */
			/***/function (module, exports) {

				/*
	       ## Color 字典数据
	   	    字典数据来源 [A nicer color palette for the web](http://clrs.cc/)
	   */
				module.exports = {
					// name value nicer
					navy: {
						value: '#000080',
						nicer: '#001F3F'
					},
					blue: {
						value: '#0000ff',
						nicer: '#0074D9'
					},
					aqua: {
						value: '#00ffff',
						nicer: '#7FDBFF'
					},
					teal: {
						value: '#008080',
						nicer: '#39CCCC'
					},
					olive: {
						value: '#008000',
						nicer: '#3D9970'
					},
					green: {
						value: '#008000',
						nicer: '#2ECC40'
					},
					lime: {
						value: '#00ff00',
						nicer: '#01FF70'
					},
					yellow: {
						value: '#ffff00',
						nicer: '#FFDC00'
					},
					orange: {
						value: '#ffa500',
						nicer: '#FF851B'
					},
					red: {
						value: '#ff0000',
						nicer: '#FF4136'
					},
					maroon: {
						value: '#800000',
						nicer: '#85144B'
					},
					fuchsia: {
						value: '#ff00ff',
						nicer: '#F012BE'
					},
					purple: {
						value: '#800080',
						nicer: '#B10DC9'
					},
					silver: {
						value: '#c0c0c0',
						nicer: '#DDDDDD'
					},
					gray: {
						value: '#808080',
						nicer: '#AAAAAA'
					},
					black: {
						value: '#000000',
						nicer: '#111111'
					},
					white: {
						value: '#FFFFFF',
						nicer: '#FFFFFF'
					}
				};

				/***/
			},
			/* 13 */
			/***/function (module, exports, __webpack_require__) {

				/*
	       ## Text
	   	    http://www.lipsum.com/
	   */
				var Basic = __webpack_require__(6);
				var Helper = __webpack_require__(14);

				function range(defaultMin, defaultMax, min, max) {
					return min === undefined ? Basic.natural(defaultMin, defaultMax) : // ()
					max === undefined ? min : // ( len )
					Basic.natural(parseInt(min, 10), parseInt(max, 10)); // ( min, max )
				}

				module.exports = {
					// 随机生成一段文本。
					paragraph: function paragraph(min, max) {
						var len = range(3, 7, min, max);
						var result = [];
						for (var i = 0; i < len; i++) {
							result.push(this.sentence());
						}
						return result.join(' ');
					},
					// 
					cparagraph: function cparagraph(min, max) {
						var len = range(3, 7, min, max);
						var result = [];
						for (var i = 0; i < len; i++) {
							result.push(this.csentence());
						}
						return result.join('');
					},
					// 随机生成一个句子，第一个单词的首字母大写。
					sentence: function sentence(min, max) {
						var len = range(12, 18, min, max);
						var result = [];
						for (var i = 0; i < len; i++) {
							result.push(this.word());
						}
						return Helper.capitalize(result.join(' ')) + '.';
					},
					// 随机生成一个中文句子。
					csentence: function csentence(min, max) {
						var len = range(12, 18, min, max);
						var result = [];
						for (var i = 0; i < len; i++) {
							result.push(this.cword());
						}

						return result.join('') + '。';
					},
					// 随机生成一个单词。
					word: function word(min, max) {
						var len = range(3, 10, min, max);
						var result = '';
						for (var i = 0; i < len; i++) {
							result += Basic.character('lower');
						}
						return result;
					},
					// 随机生成一个或多个汉字。
					cword: function cword(pool, min, max) {
						// 最常用的 500 个汉字 http://baike.baidu.com/view/568436.htm
						var DICT_KANZI = '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞';

						var len;
						switch (arguments.length) {
							case 0:
								// ()
								pool = DICT_KANZI;
								len = 1;
								break;
							case 1:
								// ( pool )
								if (typeof arguments[0] === 'string') {
									len = 1;
								} else {
									// ( length )
									len = pool;
									pool = DICT_KANZI;
								}
								break;
							case 2:
								// ( pool, length )
								if (typeof arguments[0] === 'string') {
									len = min;
								} else {
									// ( min, max )
									len = this.natural(pool, min);
									pool = DICT_KANZI;
								}
								break;
							case 3:
								len = this.natural(min, max);
								break;
						}

						var result = '';
						for (var i = 0; i < len; i++) {
							result += pool.charAt(this.natural(0, pool.length - 1));
						}
						return result;
					},
					// 随机生成一句标题，其中每个单词的首字母大写。
					title: function title(min, max) {
						var len = range(3, 7, min, max);
						var result = [];
						for (var i = 0; i < len; i++) {
							result.push(this.capitalize(this.word()));
						}
						return result.join(' ');
					},
					// 随机生成一句中文标题。
					ctitle: function ctitle(min, max) {
						var len = range(3, 7, min, max);
						var result = [];
						for (var i = 0; i < len; i++) {
							result.push(this.cword());
						}
						return result.join('');
					}
				};

				/***/
			},
			/* 14 */
			/***/function (module, exports, __webpack_require__) {

				/*
	       ## Helpers
	   */

				var Util = __webpack_require__(3);

				module.exports = {
					// 把字符串的第一个字母转换为大写。
					capitalize: function capitalize(word) {
						return (word + '').charAt(0).toUpperCase() + (word + '').substr(1);
					},
					// 把字符串转换为大写。
					upper: function upper(str) {
						return (str + '').toUpperCase();
					},
					// 把字符串转换为小写。
					lower: function lower(str) {
						return (str + '').toLowerCase();
					},
					// 从数组中随机选取一个元素，并返回。
					pick: function pick(arr, min, max) {
						// pick( item1, item2 ... )
						if (!Util.isArray(arr)) {
							arr = [].slice.call(arguments);
							min = 1;
							max = 1;
						} else {
							// pick( [ item1, item2 ... ] )
							if (min === undefined) min = 1;

							// pick( [ item1, item2 ... ], count )
							if (max === undefined) max = min;
						}

						if (min === 1 && max === 1) return arr[this.natural(0, arr.length - 1)];

						// pick( [ item1, item2 ... ], min, max )
						return this.shuffle(arr, min, max);

						// 通过参数个数判断方法签名，扩展性太差！#90
						// switch (arguments.length) {
						// 	case 1:
						// 		// pick( [ item1, item2 ... ] )
						// 		return arr[this.natural(0, arr.length - 1)]
						// 	case 2:
						// 		// pick( [ item1, item2 ... ], count )
						// 		max = min
						// 			/* falls through */
						// 	case 3:
						// 		// pick( [ item1, item2 ... ], min, max )
						// 		return this.shuffle(arr, min, max)
						// }
					},
					/*
	        打乱数组中元素的顺序，并返回。
	        Given an array, scramble the order and return it.
	    	    其他的实现思路：
	            // https://code.google.com/p/jslibs/wiki/JavascriptTips
	            result = result.sort(function() {
	                return Math.random() - 0.5
	            })
	    */
					shuffle: function shuffle(arr, min, max) {
						arr = arr || [];
						var old = arr.slice(0),
						    result = [],
						    index = 0,
						    length = old.length;
						for (var i = 0; i < length; i++) {
							index = this.natural(0, old.length - 1);
							result.push(old[index]);
							old.splice(index, 1);
						}
						switch (arguments.length) {
							case 0:
							case 1:
								return result;
							case 2:
								max = min;
							/* falls through */
							case 3:
								min = parseInt(min, 10);
								max = parseInt(max, 10);
								return result.slice(0, this.natural(min, max));
						}
					},
					/*
	        * Random.order(item, item)
	        * Random.order([item, item ...])
	    	    顺序获取数组中的元素
	    	    [JSON导入数组支持数组数据录入](https://github.com/thx/RAP/issues/22)
	    	    不支持单独调用！
	    */
					order: function order(array) {
						order.cache = order.cache || {};

						if (arguments.length > 1) array = [].slice.call(arguments, 0);

						// options.context.path/templatePath
						var options = order.options;
						var templatePath = options.context.templatePath.join('.');

						var cache = order.cache[templatePath] = order.cache[templatePath] || {
							index: 0,
							array: array
						};

						return cache.array[cache.index++ % cache.array.length];
					}
				};

				/***/
			},
			/* 15 */
			/***/function (module, exports) {

				/*
	       ## Name
	   	    [Beyond the Top 1000 Names](http://www.ssa.gov/oact/babynames/limits.html)
	   */
				module.exports = {
					// 随机生成一个常见的英文名。
					first: function first() {
						var names = [
						// male
						"James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel", "Paul", "Mark", "Donald", "George", "Kenneth", "Steven", "Edward", "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Matthew", "Gary", "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric"].concat([
						// female
						"Mary", "Patricia", "Linda", "Barbara", "Elizabeth", "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy", "Karen", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon", "Michelle", "Laura", "Sarah", "Kimberly", "Deborah", "Jessica", "Shirley", "Cynthia", "Angela", "Melissa", "Brenda", "Amy", "Anna"]);
						return this.pick(names);
						// or this.capitalize(this.word())
					},
					// 随机生成一个常见的英文姓。
					last: function last() {
						var names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen"];
						return this.pick(names);
						// or this.capitalize(this.word())
					},
					// 随机生成一个常见的英文姓名。
					name: function name(middle) {
						return this.first() + ' ' + (middle ? this.first() + ' ' : '') + this.last();
					},
					/*
	        随机生成一个常见的中文姓。
	        [世界常用姓氏排行](http://baike.baidu.com/view/1719115.htm)
	        [玄派网 - 网络小说创作辅助平台](http://xuanpai.sinaapp.com/)
	     */
					cfirst: function cfirst() {
						var names = ('王 李 张 刘 陈 杨 赵 黄 周 吴 ' + '徐 孙 胡 朱 高 林 何 郭 马 罗 ' + '梁 宋 郑 谢 韩 唐 冯 于 董 萧 ' + '程 曹 袁 邓 许 傅 沈 曾 彭 吕 ' + '苏 卢 蒋 蔡 贾 丁 魏 薛 叶 阎 ' + '余 潘 杜 戴 夏 锺 汪 田 任 姜 ' + '范 方 石 姚 谭 廖 邹 熊 金 陆 ' + '郝 孔 白 崔 康 毛 邱 秦 江 史 ' + '顾 侯 邵 孟 龙 万 段 雷 钱 汤 ' + '尹 黎 易 常 武 乔 贺 赖 龚 文').split(' ');
						return this.pick(names);
					},
					/*
	        随机生成一个常见的中文名。
	        [中国最常见名字前50名_三九算命网](http://www.name999.net/xingming/xingshi/20131004/48.html)
	     */
					clast: function clast() {
						var names = ('伟 芳 娜 秀英 敏 静 丽 强 磊 军 ' + '洋 勇 艳 杰 娟 涛 明 超 秀兰 霞 ' + '平 刚 桂英').split(' ');
						return this.pick(names);
					},
					// 随机生成一个常见的中文姓名。
					cname: function cname() {
						return this.cfirst() + this.clast();
					}
				};

				/***/
			},
			/* 16 */
			/***/function (module, exports) {

				/*
	       ## Web
	   */
				module.exports = {
					/*
	        随机生成一个 URL。
	         [URL 规范](http://www.w3.org/Addressing/URL/url-spec.txt)
	            http                    Hypertext Transfer Protocol 
	            ftp                     File Transfer protocol 
	            gopher                  The Gopher protocol 
	            mailto                  Electronic mail address 
	            mid                     Message identifiers for electronic mail 
	            cid                     Content identifiers for MIME body part 
	            news                    Usenet news 
	            nntp                    Usenet news for local NNTP access only 
	            prospero                Access using the prospero protocols 
	            telnet rlogin tn3270    Reference to interactive sessions
	            wais                    Wide Area Information Servers 
	    */
					url: function url(protocol, host) {
						return (protocol || this.protocol()) + '://' + ( // protocol?
						host || this.domain()) + // host?
						'/' + this.word();
					},
					// 随机生成一个 URL 协议。
					protocol: function protocol() {
						return this.pick(
						// 协议簇
						'http ftp gopher mailto mid cid news nntp prospero telnet rlogin tn3270 wais'.split(' '));
					},
					// 随机生成一个域名。
					domain: function domain(tld) {
						return this.word() + '.' + (tld || this.tld());
					},
					/*
	        随机生成一个顶级域名。
	        国际顶级域名 international top-level domain-names, iTLDs
	        国家顶级域名 national top-level domainnames, nTLDs
	        [域名后缀大全](http://www.163ns.com/zixun/post/4417.html)
	    */
					tld: function tld() {
						// Top Level Domain
						return this.pick((
						// 域名后缀
						'com net org edu gov int mil cn ' +
						// 国内域名
						'com.cn net.cn gov.cn org.cn ' +
						// 中文国内域名
						'中国 中国互联.公司 中国互联.网络 ' +
						// 新国际域名
						'tel biz cc tv info name hk mobi asia cd travel pro museum coop aero ' +
						// 世界各国域名后缀
						'ad ae af ag ai al am an ao aq ar as at au aw az ba bb bd be bf bg bh bi bj bm bn bo br bs bt bv bw by bz ca cc cf cg ch ci ck cl cm cn co cq cr cu cv cx cy cz de dj dk dm do dz ec ee eg eh es et ev fi fj fk fm fo fr ga gb gd ge gf gh gi gl gm gn gp gr gt gu gw gy hk hm hn hr ht hu id ie il in io iq ir is it jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md mg mh ml mm mn mo mp mq mr ms mt mv mw mx my mz na nc ne nf ng ni nl no np nr nt nu nz om qa pa pe pf pg ph pk pl pm pn pr pt pw py re ro ru rw sa sb sc sd se sg sh si sj sk sl sm sn so sr st su sy sz tc td tf tg th tj tk tm tn to tp tr tt tv tw tz ua ug uk us uy va vc ve vg vn vu wf ws ye yu za zm zr zw').split(' '));
					},
					// 随机生成一个邮件地址。
					email: function email(domain) {
						return this.character('lower') + '.' + this.word() + '@' + (domain || this.word() + '.' + this.tld());
						// return this.character('lower') + '.' + this.last().toLowerCase() + '@' + this.last().toLowerCase() + '.' + this.tld()
						// return this.word() + '@' + (domain || this.domain())
					},
					// 随机生成一个 IP 地址。
					ip: function ip() {
						return this.natural(0, 255) + '.' + this.natural(0, 255) + '.' + this.natural(0, 255) + '.' + this.natural(0, 255);
					}
				};

				/***/
			},
			/* 17 */
			/***/function (module, exports, __webpack_require__) {

				/*
	       ## Address
	   */

				var DICT = __webpack_require__(18);
				var REGION = ['东北', '华北', '华东', '华中', '华南', '西南', '西北'];

				module.exports = {
					// 随机生成一个大区。
					region: function region() {
						return this.pick(REGION);
					},
					// 随机生成一个（中国）省（或直辖市、自治区、特别行政区）。
					province: function province() {
						return this.pick(DICT).name;
					},
					// 随机生成一个（中国）市。
					city: function city(prefix) {
						var province = this.pick(DICT);
						var city = this.pick(province.children);
						return prefix ? [province.name, city.name].join(' ') : city.name;
					},
					// 随机生成一个（中国）县。
					county: function county(prefix) {
						var province = this.pick(DICT);
						var city = this.pick(province.children);
						var county = this.pick(city.children) || {
							name: '-'
						};
						return prefix ? [province.name, city.name, county.name].join(' ') : county.name;
					},
					// 随机生成一个邮政编码（六位数字）。
					zip: function zip(len) {
						var zip = '';
						for (var i = 0; i < (len || 6); i++) {
							zip += this.natural(0, 9);
						}return zip;
					}

					// address: function() {},
					// phone: function() {},
					// areacode: function() {},
					// street: function() {},
					// street_suffixes: function() {},
					// street_suffix: function() {},
					// states: function() {},
					// state: function() {},
				};

				/***/
			},
			/* 18 */
			/***/function (module, exports) {

				/*
	       ## Address 字典数据
	   	    字典数据来源 http://www.atatech.org/articles/30028?rnd=254259856
	   	    国标 省（市）级行政区划码表
	   	    华北   北京市 天津市 河北省 山西省 内蒙古自治区
	       东北   辽宁省 吉林省 黑龙江省
	       华东   上海市 江苏省 浙江省 安徽省 福建省 江西省 山东省
	       华南   广东省 广西壮族自治区 海南省
	       华中   河南省 湖北省 湖南省
	       西南   重庆市 四川省 贵州省 云南省 西藏自治区
	       西北   陕西省 甘肃省 青海省 宁夏回族自治区 新疆维吾尔自治区
	       港澳台 香港特别行政区 澳门特别行政区 台湾省
	       
	       **排序**
	       
	       ```js
	       var map = {}
	       _.each(_.keys(REGIONS),function(id){
	         map[id] = REGIONS[ID]
	       })
	       JSON.stringify(map)
	       ```
	   */
				var DICT = {
					"110000": "北京",
					"110100": "北京市",
					"110101": "东城区",
					"110102": "西城区",
					"110105": "朝阳区",
					"110106": "丰台区",
					"110107": "石景山区",
					"110108": "海淀区",
					"110109": "门头沟区",
					"110111": "房山区",
					"110112": "通州区",
					"110113": "顺义区",
					"110114": "昌平区",
					"110115": "大兴区",
					"110116": "怀柔区",
					"110117": "平谷区",
					"110228": "密云县",
					"110229": "延庆县",
					"110230": "其它区",
					"120000": "天津",
					"120100": "天津市",
					"120101": "和平区",
					"120102": "河东区",
					"120103": "河西区",
					"120104": "南开区",
					"120105": "河北区",
					"120106": "红桥区",
					"120110": "东丽区",
					"120111": "西青区",
					"120112": "津南区",
					"120113": "北辰区",
					"120114": "武清区",
					"120115": "宝坻区",
					"120116": "滨海新区",
					"120221": "宁河县",
					"120223": "静海县",
					"120225": "蓟县",
					"120226": "其它区",
					"130000": "河北省",
					"130100": "石家庄市",
					"130102": "长安区",
					"130103": "桥东区",
					"130104": "桥西区",
					"130105": "新华区",
					"130107": "井陉矿区",
					"130108": "裕华区",
					"130121": "井陉县",
					"130123": "正定县",
					"130124": "栾城县",
					"130125": "行唐县",
					"130126": "灵寿县",
					"130127": "高邑县",
					"130128": "深泽县",
					"130129": "赞皇县",
					"130130": "无极县",
					"130131": "平山县",
					"130132": "元氏县",
					"130133": "赵县",
					"130181": "辛集市",
					"130182": "藁城市",
					"130183": "晋州市",
					"130184": "新乐市",
					"130185": "鹿泉市",
					"130186": "其它区",
					"130200": "唐山市",
					"130202": "路南区",
					"130203": "路北区",
					"130204": "古冶区",
					"130205": "开平区",
					"130207": "丰南区",
					"130208": "丰润区",
					"130223": "滦县",
					"130224": "滦南县",
					"130225": "乐亭县",
					"130227": "迁西县",
					"130229": "玉田县",
					"130230": "曹妃甸区",
					"130281": "遵化市",
					"130283": "迁安市",
					"130284": "其它区",
					"130300": "秦皇岛市",
					"130302": "海港区",
					"130303": "山海关区",
					"130304": "北戴河区",
					"130321": "青龙满族自治县",
					"130322": "昌黎县",
					"130323": "抚宁县",
					"130324": "卢龙县",
					"130398": "其它区",
					"130400": "邯郸市",
					"130402": "邯山区",
					"130403": "丛台区",
					"130404": "复兴区",
					"130406": "峰峰矿区",
					"130421": "邯郸县",
					"130423": "临漳县",
					"130424": "成安县",
					"130425": "大名县",
					"130426": "涉县",
					"130427": "磁县",
					"130428": "肥乡县",
					"130429": "永年县",
					"130430": "邱县",
					"130431": "鸡泽县",
					"130432": "广平县",
					"130433": "馆陶县",
					"130434": "魏县",
					"130435": "曲周县",
					"130481": "武安市",
					"130482": "其它区",
					"130500": "邢台市",
					"130502": "桥东区",
					"130503": "桥西区",
					"130521": "邢台县",
					"130522": "临城县",
					"130523": "内丘县",
					"130524": "柏乡县",
					"130525": "隆尧县",
					"130526": "任县",
					"130527": "南和县",
					"130528": "宁晋县",
					"130529": "巨鹿县",
					"130530": "新河县",
					"130531": "广宗县",
					"130532": "平乡县",
					"130533": "威县",
					"130534": "清河县",
					"130535": "临西县",
					"130581": "南宫市",
					"130582": "沙河市",
					"130583": "其它区",
					"130600": "保定市",
					"130602": "新市区",
					"130603": "北市区",
					"130604": "南市区",
					"130621": "满城县",
					"130622": "清苑县",
					"130623": "涞水县",
					"130624": "阜平县",
					"130625": "徐水县",
					"130626": "定兴县",
					"130627": "唐县",
					"130628": "高阳县",
					"130629": "容城县",
					"130630": "涞源县",
					"130631": "望都县",
					"130632": "安新县",
					"130633": "易县",
					"130634": "曲阳县",
					"130635": "蠡县",
					"130636": "顺平县",
					"130637": "博野县",
					"130638": "雄县",
					"130681": "涿州市",
					"130682": "定州市",
					"130683": "安国市",
					"130684": "高碑店市",
					"130699": "其它区",
					"130700": "张家口市",
					"130702": "桥东区",
					"130703": "桥西区",
					"130705": "宣化区",
					"130706": "下花园区",
					"130721": "宣化县",
					"130722": "张北县",
					"130723": "康保县",
					"130724": "沽源县",
					"130725": "尚义县",
					"130726": "蔚县",
					"130727": "阳原县",
					"130728": "怀安县",
					"130729": "万全县",
					"130730": "怀来县",
					"130731": "涿鹿县",
					"130732": "赤城县",
					"130733": "崇礼县",
					"130734": "其它区",
					"130800": "承德市",
					"130802": "双桥区",
					"130803": "双滦区",
					"130804": "鹰手营子矿区",
					"130821": "承德县",
					"130822": "兴隆县",
					"130823": "平泉县",
					"130824": "滦平县",
					"130825": "隆化县",
					"130826": "丰宁满族自治县",
					"130827": "宽城满族自治县",
					"130828": "围场满族蒙古族自治县",
					"130829": "其它区",
					"130900": "沧州市",
					"130902": "新华区",
					"130903": "运河区",
					"130921": "沧县",
					"130922": "青县",
					"130923": "东光县",
					"130924": "海兴县",
					"130925": "盐山县",
					"130926": "肃宁县",
					"130927": "南皮县",
					"130928": "吴桥县",
					"130929": "献县",
					"130930": "孟村回族自治县",
					"130981": "泊头市",
					"130982": "任丘市",
					"130983": "黄骅市",
					"130984": "河间市",
					"130985": "其它区",
					"131000": "廊坊市",
					"131002": "安次区",
					"131003": "广阳区",
					"131022": "固安县",
					"131023": "永清县",
					"131024": "香河县",
					"131025": "大城县",
					"131026": "文安县",
					"131028": "大厂回族自治县",
					"131081": "霸州市",
					"131082": "三河市",
					"131083": "其它区",
					"131100": "衡水市",
					"131102": "桃城区",
					"131121": "枣强县",
					"131122": "武邑县",
					"131123": "武强县",
					"131124": "饶阳县",
					"131125": "安平县",
					"131126": "故城县",
					"131127": "景县",
					"131128": "阜城县",
					"131181": "冀州市",
					"131182": "深州市",
					"131183": "其它区",
					"140000": "山西省",
					"140100": "太原市",
					"140105": "小店区",
					"140106": "迎泽区",
					"140107": "杏花岭区",
					"140108": "尖草坪区",
					"140109": "万柏林区",
					"140110": "晋源区",
					"140121": "清徐县",
					"140122": "阳曲县",
					"140123": "娄烦县",
					"140181": "古交市",
					"140182": "其它区",
					"140200": "大同市",
					"140202": "城区",
					"140203": "矿区",
					"140211": "南郊区",
					"140212": "新荣区",
					"140221": "阳高县",
					"140222": "天镇县",
					"140223": "广灵县",
					"140224": "灵丘县",
					"140225": "浑源县",
					"140226": "左云县",
					"140227": "大同县",
					"140228": "其它区",
					"140300": "阳泉市",
					"140302": "城区",
					"140303": "矿区",
					"140311": "郊区",
					"140321": "平定县",
					"140322": "盂县",
					"140323": "其它区",
					"140400": "长治市",
					"140421": "长治县",
					"140423": "襄垣县",
					"140424": "屯留县",
					"140425": "平顺县",
					"140426": "黎城县",
					"140427": "壶关县",
					"140428": "长子县",
					"140429": "武乡县",
					"140430": "沁县",
					"140431": "沁源县",
					"140481": "潞城市",
					"140482": "城区",
					"140483": "郊区",
					"140485": "其它区",
					"140500": "晋城市",
					"140502": "城区",
					"140521": "沁水县",
					"140522": "阳城县",
					"140524": "陵川县",
					"140525": "泽州县",
					"140581": "高平市",
					"140582": "其它区",
					"140600": "朔州市",
					"140602": "朔城区",
					"140603": "平鲁区",
					"140621": "山阴县",
					"140622": "应县",
					"140623": "右玉县",
					"140624": "怀仁县",
					"140625": "其它区",
					"140700": "晋中市",
					"140702": "榆次区",
					"140721": "榆社县",
					"140722": "左权县",
					"140723": "和顺县",
					"140724": "昔阳县",
					"140725": "寿阳县",
					"140726": "太谷县",
					"140727": "祁县",
					"140728": "平遥县",
					"140729": "灵石县",
					"140781": "介休市",
					"140782": "其它区",
					"140800": "运城市",
					"140802": "盐湖区",
					"140821": "临猗县",
					"140822": "万荣县",
					"140823": "闻喜县",
					"140824": "稷山县",
					"140825": "新绛县",
					"140826": "绛县",
					"140827": "垣曲县",
					"140828": "夏县",
					"140829": "平陆县",
					"140830": "芮城县",
					"140881": "永济市",
					"140882": "河津市",
					"140883": "其它区",
					"140900": "忻州市",
					"140902": "忻府区",
					"140921": "定襄县",
					"140922": "五台县",
					"140923": "代县",
					"140924": "繁峙县",
					"140925": "宁武县",
					"140926": "静乐县",
					"140927": "神池县",
					"140928": "五寨县",
					"140929": "岢岚县",
					"140930": "河曲县",
					"140931": "保德县",
					"140932": "偏关县",
					"140981": "原平市",
					"140982": "其它区",
					"141000": "临汾市",
					"141002": "尧都区",
					"141021": "曲沃县",
					"141022": "翼城县",
					"141023": "襄汾县",
					"141024": "洪洞县",
					"141025": "古县",
					"141026": "安泽县",
					"141027": "浮山县",
					"141028": "吉县",
					"141029": "乡宁县",
					"141030": "大宁县",
					"141031": "隰县",
					"141032": "永和县",
					"141033": "蒲县",
					"141034": "汾西县",
					"141081": "侯马市",
					"141082": "霍州市",
					"141083": "其它区",
					"141100": "吕梁市",
					"141102": "离石区",
					"141121": "文水县",
					"141122": "交城县",
					"141123": "兴县",
					"141124": "临县",
					"141125": "柳林县",
					"141126": "石楼县",
					"141127": "岚县",
					"141128": "方山县",
					"141129": "中阳县",
					"141130": "交口县",
					"141181": "孝义市",
					"141182": "汾阳市",
					"141183": "其它区",
					"150000": "内蒙古自治区",
					"150100": "呼和浩特市",
					"150102": "新城区",
					"150103": "回民区",
					"150104": "玉泉区",
					"150105": "赛罕区",
					"150121": "土默特左旗",
					"150122": "托克托县",
					"150123": "和林格尔县",
					"150124": "清水河县",
					"150125": "武川县",
					"150126": "其它区",
					"150200": "包头市",
					"150202": "东河区",
					"150203": "昆都仑区",
					"150204": "青山区",
					"150205": "石拐区",
					"150206": "白云鄂博矿区",
					"150207": "九原区",
					"150221": "土默特右旗",
					"150222": "固阳县",
					"150223": "达尔罕茂明安联合旗",
					"150224": "其它区",
					"150300": "乌海市",
					"150302": "海勃湾区",
					"150303": "海南区",
					"150304": "乌达区",
					"150305": "其它区",
					"150400": "赤峰市",
					"150402": "红山区",
					"150403": "元宝山区",
					"150404": "松山区",
					"150421": "阿鲁科尔沁旗",
					"150422": "巴林左旗",
					"150423": "巴林右旗",
					"150424": "林西县",
					"150425": "克什克腾旗",
					"150426": "翁牛特旗",
					"150428": "喀喇沁旗",
					"150429": "宁城县",
					"150430": "敖汉旗",
					"150431": "其它区",
					"150500": "通辽市",
					"150502": "科尔沁区",
					"150521": "科尔沁左翼中旗",
					"150522": "科尔沁左翼后旗",
					"150523": "开鲁县",
					"150524": "库伦旗",
					"150525": "奈曼旗",
					"150526": "扎鲁特旗",
					"150581": "霍林郭勒市",
					"150582": "其它区",
					"150600": "鄂尔多斯市",
					"150602": "东胜区",
					"150621": "达拉特旗",
					"150622": "准格尔旗",
					"150623": "鄂托克前旗",
					"150624": "鄂托克旗",
					"150625": "杭锦旗",
					"150626": "乌审旗",
					"150627": "伊金霍洛旗",
					"150628": "其它区",
					"150700": "呼伦贝尔市",
					"150702": "海拉尔区",
					"150703": "扎赉诺尔区",
					"150721": "阿荣旗",
					"150722": "莫力达瓦达斡尔族自治旗",
					"150723": "鄂伦春自治旗",
					"150724": "鄂温克族自治旗",
					"150725": "陈巴尔虎旗",
					"150726": "新巴尔虎左旗",
					"150727": "新巴尔虎右旗",
					"150781": "满洲里市",
					"150782": "牙克石市",
					"150783": "扎兰屯市",
					"150784": "额尔古纳市",
					"150785": "根河市",
					"150786": "其它区",
					"150800": "巴彦淖尔市",
					"150802": "临河区",
					"150821": "五原县",
					"150822": "磴口县",
					"150823": "乌拉特前旗",
					"150824": "乌拉特中旗",
					"150825": "乌拉特后旗",
					"150826": "杭锦后旗",
					"150827": "其它区",
					"150900": "乌兰察布市",
					"150902": "集宁区",
					"150921": "卓资县",
					"150922": "化德县",
					"150923": "商都县",
					"150924": "兴和县",
					"150925": "凉城县",
					"150926": "察哈尔右翼前旗",
					"150927": "察哈尔右翼中旗",
					"150928": "察哈尔右翼后旗",
					"150929": "四子王旗",
					"150981": "丰镇市",
					"150982": "其它区",
					"152200": "兴安盟",
					"152201": "乌兰浩特市",
					"152202": "阿尔山市",
					"152221": "科尔沁右翼前旗",
					"152222": "科尔沁右翼中旗",
					"152223": "扎赉特旗",
					"152224": "突泉县",
					"152225": "其它区",
					"152500": "锡林郭勒盟",
					"152501": "二连浩特市",
					"152502": "锡林浩特市",
					"152522": "阿巴嘎旗",
					"152523": "苏尼特左旗",
					"152524": "苏尼特右旗",
					"152525": "东乌珠穆沁旗",
					"152526": "西乌珠穆沁旗",
					"152527": "太仆寺旗",
					"152528": "镶黄旗",
					"152529": "正镶白旗",
					"152530": "正蓝旗",
					"152531": "多伦县",
					"152532": "其它区",
					"152900": "阿拉善盟",
					"152921": "阿拉善左旗",
					"152922": "阿拉善右旗",
					"152923": "额济纳旗",
					"152924": "其它区",
					"210000": "辽宁省",
					"210100": "沈阳市",
					"210102": "和平区",
					"210103": "沈河区",
					"210104": "大东区",
					"210105": "皇姑区",
					"210106": "铁西区",
					"210111": "苏家屯区",
					"210112": "东陵区",
					"210113": "新城子区",
					"210114": "于洪区",
					"210122": "辽中县",
					"210123": "康平县",
					"210124": "法库县",
					"210181": "新民市",
					"210184": "沈北新区",
					"210185": "其它区",
					"210200": "大连市",
					"210202": "中山区",
					"210203": "西岗区",
					"210204": "沙河口区",
					"210211": "甘井子区",
					"210212": "旅顺口区",
					"210213": "金州区",
					"210224": "长海县",
					"210281": "瓦房店市",
					"210282": "普兰店市",
					"210283": "庄河市",
					"210298": "其它区",
					"210300": "鞍山市",
					"210302": "铁东区",
					"210303": "铁西区",
					"210304": "立山区",
					"210311": "千山区",
					"210321": "台安县",
					"210323": "岫岩满族自治县",
					"210381": "海城市",
					"210382": "其它区",
					"210400": "抚顺市",
					"210402": "新抚区",
					"210403": "东洲区",
					"210404": "望花区",
					"210411": "顺城区",
					"210421": "抚顺县",
					"210422": "新宾满族自治县",
					"210423": "清原满族自治县",
					"210424": "其它区",
					"210500": "本溪市",
					"210502": "平山区",
					"210503": "溪湖区",
					"210504": "明山区",
					"210505": "南芬区",
					"210521": "本溪满族自治县",
					"210522": "桓仁满族自治县",
					"210523": "其它区",
					"210600": "丹东市",
					"210602": "元宝区",
					"210603": "振兴区",
					"210604": "振安区",
					"210624": "宽甸满族自治县",
					"210681": "东港市",
					"210682": "凤城市",
					"210683": "其它区",
					"210700": "锦州市",
					"210702": "古塔区",
					"210703": "凌河区",
					"210711": "太和区",
					"210726": "黑山县",
					"210727": "义县",
					"210781": "凌海市",
					"210782": "北镇市",
					"210783": "其它区",
					"210800": "营口市",
					"210802": "站前区",
					"210803": "西市区",
					"210804": "鲅鱼圈区",
					"210811": "老边区",
					"210881": "盖州市",
					"210882": "大石桥市",
					"210883": "其它区",
					"210900": "阜新市",
					"210902": "海州区",
					"210903": "新邱区",
					"210904": "太平区",
					"210905": "清河门区",
					"210911": "细河区",
					"210921": "阜新蒙古族自治县",
					"210922": "彰武县",
					"210923": "其它区",
					"211000": "辽阳市",
					"211002": "白塔区",
					"211003": "文圣区",
					"211004": "宏伟区",
					"211005": "弓长岭区",
					"211011": "太子河区",
					"211021": "辽阳县",
					"211081": "灯塔市",
					"211082": "其它区",
					"211100": "盘锦市",
					"211102": "双台子区",
					"211103": "兴隆台区",
					"211121": "大洼县",
					"211122": "盘山县",
					"211123": "其它区",
					"211200": "铁岭市",
					"211202": "银州区",
					"211204": "清河区",
					"211221": "铁岭县",
					"211223": "西丰县",
					"211224": "昌图县",
					"211281": "调兵山市",
					"211282": "开原市",
					"211283": "其它区",
					"211300": "朝阳市",
					"211302": "双塔区",
					"211303": "龙城区",
					"211321": "朝阳县",
					"211322": "建平县",
					"211324": "喀喇沁左翼蒙古族自治县",
					"211381": "北票市",
					"211382": "凌源市",
					"211383": "其它区",
					"211400": "葫芦岛市",
					"211402": "连山区",
					"211403": "龙港区",
					"211404": "南票区",
					"211421": "绥中县",
					"211422": "建昌县",
					"211481": "兴城市",
					"211482": "其它区",
					"220000": "吉林省",
					"220100": "长春市",
					"220102": "南关区",
					"220103": "宽城区",
					"220104": "朝阳区",
					"220105": "二道区",
					"220106": "绿园区",
					"220112": "双阳区",
					"220122": "农安县",
					"220181": "九台市",
					"220182": "榆树市",
					"220183": "德惠市",
					"220188": "其它区",
					"220200": "吉林市",
					"220202": "昌邑区",
					"220203": "龙潭区",
					"220204": "船营区",
					"220211": "丰满区",
					"220221": "永吉县",
					"220281": "蛟河市",
					"220282": "桦甸市",
					"220283": "舒兰市",
					"220284": "磐石市",
					"220285": "其它区",
					"220300": "四平市",
					"220302": "铁西区",
					"220303": "铁东区",
					"220322": "梨树县",
					"220323": "伊通满族自治县",
					"220381": "公主岭市",
					"220382": "双辽市",
					"220383": "其它区",
					"220400": "辽源市",
					"220402": "龙山区",
					"220403": "西安区",
					"220421": "东丰县",
					"220422": "东辽县",
					"220423": "其它区",
					"220500": "通化市",
					"220502": "东昌区",
					"220503": "二道江区",
					"220521": "通化县",
					"220523": "辉南县",
					"220524": "柳河县",
					"220581": "梅河口市",
					"220582": "集安市",
					"220583": "其它区",
					"220600": "白山市",
					"220602": "浑江区",
					"220621": "抚松县",
					"220622": "靖宇县",
					"220623": "长白朝鲜族自治县",
					"220625": "江源区",
					"220681": "临江市",
					"220682": "其它区",
					"220700": "松原市",
					"220702": "宁江区",
					"220721": "前郭尔罗斯蒙古族自治县",
					"220722": "长岭县",
					"220723": "乾安县",
					"220724": "扶余市",
					"220725": "其它区",
					"220800": "白城市",
					"220802": "洮北区",
					"220821": "镇赉县",
					"220822": "通榆县",
					"220881": "洮南市",
					"220882": "大安市",
					"220883": "其它区",
					"222400": "延边朝鲜族自治州",
					"222401": "延吉市",
					"222402": "图们市",
					"222403": "敦化市",
					"222404": "珲春市",
					"222405": "龙井市",
					"222406": "和龙市",
					"222424": "汪清县",
					"222426": "安图县",
					"222427": "其它区",
					"230000": "黑龙江省",
					"230100": "哈尔滨市",
					"230102": "道里区",
					"230103": "南岗区",
					"230104": "道外区",
					"230106": "香坊区",
					"230108": "平房区",
					"230109": "松北区",
					"230111": "呼兰区",
					"230123": "依兰县",
					"230124": "方正县",
					"230125": "宾县",
					"230126": "巴彦县",
					"230127": "木兰县",
					"230128": "通河县",
					"230129": "延寿县",
					"230181": "阿城区",
					"230182": "双城市",
					"230183": "尚志市",
					"230184": "五常市",
					"230186": "其它区",
					"230200": "齐齐哈尔市",
					"230202": "龙沙区",
					"230203": "建华区",
					"230204": "铁锋区",
					"230205": "昂昂溪区",
					"230206": "富拉尔基区",
					"230207": "碾子山区",
					"230208": "梅里斯达斡尔族区",
					"230221": "龙江县",
					"230223": "依安县",
					"230224": "泰来县",
					"230225": "甘南县",
					"230227": "富裕县",
					"230229": "克山县",
					"230230": "克东县",
					"230231": "拜泉县",
					"230281": "讷河市",
					"230282": "其它区",
					"230300": "鸡西市",
					"230302": "鸡冠区",
					"230303": "恒山区",
					"230304": "滴道区",
					"230305": "梨树区",
					"230306": "城子河区",
					"230307": "麻山区",
					"230321": "鸡东县",
					"230381": "虎林市",
					"230382": "密山市",
					"230383": "其它区",
					"230400": "鹤岗市",
					"230402": "向阳区",
					"230403": "工农区",
					"230404": "南山区",
					"230405": "兴安区",
					"230406": "东山区",
					"230407": "兴山区",
					"230421": "萝北县",
					"230422": "绥滨县",
					"230423": "其它区",
					"230500": "双鸭山市",
					"230502": "尖山区",
					"230503": "岭东区",
					"230505": "四方台区",
					"230506": "宝山区",
					"230521": "集贤县",
					"230522": "友谊县",
					"230523": "宝清县",
					"230524": "饶河县",
					"230525": "其它区",
					"230600": "大庆市",
					"230602": "萨尔图区",
					"230603": "龙凤区",
					"230604": "让胡路区",
					"230605": "红岗区",
					"230606": "大同区",
					"230621": "肇州县",
					"230622": "肇源县",
					"230623": "林甸县",
					"230624": "杜尔伯特蒙古族自治县",
					"230625": "其它区",
					"230700": "伊春市",
					"230702": "伊春区",
					"230703": "南岔区",
					"230704": "友好区",
					"230705": "西林区",
					"230706": "翠峦区",
					"230707": "新青区",
					"230708": "美溪区",
					"230709": "金山屯区",
					"230710": "五营区",
					"230711": "乌马河区",
					"230712": "汤旺河区",
					"230713": "带岭区",
					"230714": "乌伊岭区",
					"230715": "红星区",
					"230716": "上甘岭区",
					"230722": "嘉荫县",
					"230781": "铁力市",
					"230782": "其它区",
					"230800": "佳木斯市",
					"230803": "向阳区",
					"230804": "前进区",
					"230805": "东风区",
					"230811": "郊区",
					"230822": "桦南县",
					"230826": "桦川县",
					"230828": "汤原县",
					"230833": "抚远县",
					"230881": "同江市",
					"230882": "富锦市",
					"230883": "其它区",
					"230900": "七台河市",
					"230902": "新兴区",
					"230903": "桃山区",
					"230904": "茄子河区",
					"230921": "勃利县",
					"230922": "其它区",
					"231000": "牡丹江市",
					"231002": "东安区",
					"231003": "阳明区",
					"231004": "爱民区",
					"231005": "西安区",
					"231024": "东宁县",
					"231025": "林口县",
					"231081": "绥芬河市",
					"231083": "海林市",
					"231084": "宁安市",
					"231085": "穆棱市",
					"231086": "其它区",
					"231100": "黑河市",
					"231102": "爱辉区",
					"231121": "嫩江县",
					"231123": "逊克县",
					"231124": "孙吴县",
					"231181": "北安市",
					"231182": "五大连池市",
					"231183": "其它区",
					"231200": "绥化市",
					"231202": "北林区",
					"231221": "望奎县",
					"231222": "兰西县",
					"231223": "青冈县",
					"231224": "庆安县",
					"231225": "明水县",
					"231226": "绥棱县",
					"231281": "安达市",
					"231282": "肇东市",
					"231283": "海伦市",
					"231284": "其它区",
					"232700": "大兴安岭地区",
					"232702": "松岭区",
					"232703": "新林区",
					"232704": "呼中区",
					"232721": "呼玛县",
					"232722": "塔河县",
					"232723": "漠河县",
					"232724": "加格达奇区",
					"232725": "其它区",
					"310000": "上海",
					"310100": "上海市",
					"310101": "黄浦区",
					"310104": "徐汇区",
					"310105": "长宁区",
					"310106": "静安区",
					"310107": "普陀区",
					"310108": "闸北区",
					"310109": "虹口区",
					"310110": "杨浦区",
					"310112": "闵行区",
					"310113": "宝山区",
					"310114": "嘉定区",
					"310115": "浦东新区",
					"310116": "金山区",
					"310117": "松江区",
					"310118": "青浦区",
					"310120": "奉贤区",
					"310230": "崇明县",
					"310231": "其它区",
					"320000": "江苏省",
					"320100": "南京市",
					"320102": "玄武区",
					"320104": "秦淮区",
					"320105": "建邺区",
					"320106": "鼓楼区",
					"320111": "浦口区",
					"320113": "栖霞区",
					"320114": "雨花台区",
					"320115": "江宁区",
					"320116": "六合区",
					"320124": "溧水区",
					"320125": "高淳区",
					"320126": "其它区",
					"320200": "无锡市",
					"320202": "崇安区",
					"320203": "南长区",
					"320204": "北塘区",
					"320205": "锡山区",
					"320206": "惠山区",
					"320211": "滨湖区",
					"320281": "江阴市",
					"320282": "宜兴市",
					"320297": "其它区",
					"320300": "徐州市",
					"320302": "鼓楼区",
					"320303": "云龙区",
					"320305": "贾汪区",
					"320311": "泉山区",
					"320321": "丰县",
					"320322": "沛县",
					"320323": "铜山区",
					"320324": "睢宁县",
					"320381": "新沂市",
					"320382": "邳州市",
					"320383": "其它区",
					"320400": "常州市",
					"320402": "天宁区",
					"320404": "钟楼区",
					"320405": "戚墅堰区",
					"320411": "新北区",
					"320412": "武进区",
					"320481": "溧阳市",
					"320482": "金坛市",
					"320483": "其它区",
					"320500": "苏州市",
					"320505": "虎丘区",
					"320506": "吴中区",
					"320507": "相城区",
					"320508": "姑苏区",
					"320581": "常熟市",
					"320582": "张家港市",
					"320583": "昆山市",
					"320584": "吴江区",
					"320585": "太仓市",
					"320596": "其它区",
					"320600": "南通市",
					"320602": "崇川区",
					"320611": "港闸区",
					"320612": "通州区",
					"320621": "海安县",
					"320623": "如东县",
					"320681": "启东市",
					"320682": "如皋市",
					"320684": "海门市",
					"320694": "其它区",
					"320700": "连云港市",
					"320703": "连云区",
					"320705": "新浦区",
					"320706": "海州区",
					"320721": "赣榆县",
					"320722": "东海县",
					"320723": "灌云县",
					"320724": "灌南县",
					"320725": "其它区",
					"320800": "淮安市",
					"320802": "清河区",
					"320803": "淮安区",
					"320804": "淮阴区",
					"320811": "清浦区",
					"320826": "涟水县",
					"320829": "洪泽县",
					"320830": "盱眙县",
					"320831": "金湖县",
					"320832": "其它区",
					"320900": "盐城市",
					"320902": "亭湖区",
					"320903": "盐都区",
					"320921": "响水县",
					"320922": "滨海县",
					"320923": "阜宁县",
					"320924": "射阳县",
					"320925": "建湖县",
					"320981": "东台市",
					"320982": "大丰市",
					"320983": "其它区",
					"321000": "扬州市",
					"321002": "广陵区",
					"321003": "邗江区",
					"321023": "宝应县",
					"321081": "仪征市",
					"321084": "高邮市",
					"321088": "江都区",
					"321093": "其它区",
					"321100": "镇江市",
					"321102": "京口区",
					"321111": "润州区",
					"321112": "丹徒区",
					"321181": "丹阳市",
					"321182": "扬中市",
					"321183": "句容市",
					"321184": "其它区",
					"321200": "泰州市",
					"321202": "海陵区",
					"321203": "高港区",
					"321281": "兴化市",
					"321282": "靖江市",
					"321283": "泰兴市",
					"321284": "姜堰区",
					"321285": "其它区",
					"321300": "宿迁市",
					"321302": "宿城区",
					"321311": "宿豫区",
					"321322": "沭阳县",
					"321323": "泗阳县",
					"321324": "泗洪县",
					"321325": "其它区",
					"330000": "浙江省",
					"330100": "杭州市",
					"330102": "上城区",
					"330103": "下城区",
					"330104": "江干区",
					"330105": "拱墅区",
					"330106": "西湖区",
					"330108": "滨江区",
					"330109": "萧山区",
					"330110": "余杭区",
					"330122": "桐庐县",
					"330127": "淳安县",
					"330182": "建德市",
					"330183": "富阳市",
					"330185": "临安市",
					"330186": "其它区",
					"330200": "宁波市",
					"330203": "海曙区",
					"330204": "江东区",
					"330205": "江北区",
					"330206": "北仑区",
					"330211": "镇海区",
					"330212": "鄞州区",
					"330225": "象山县",
					"330226": "宁海县",
					"330281": "余姚市",
					"330282": "慈溪市",
					"330283": "奉化市",
					"330284": "其它区",
					"330300": "温州市",
					"330302": "鹿城区",
					"330303": "龙湾区",
					"330304": "瓯海区",
					"330322": "洞头县",
					"330324": "永嘉县",
					"330326": "平阳县",
					"330327": "苍南县",
					"330328": "文成县",
					"330329": "泰顺县",
					"330381": "瑞安市",
					"330382": "乐清市",
					"330383": "其它区",
					"330400": "嘉兴市",
					"330402": "南湖区",
					"330411": "秀洲区",
					"330421": "嘉善县",
					"330424": "海盐县",
					"330481": "海宁市",
					"330482": "平湖市",
					"330483": "桐乡市",
					"330484": "其它区",
					"330500": "湖州市",
					"330502": "吴兴区",
					"330503": "南浔区",
					"330521": "德清县",
					"330522": "长兴县",
					"330523": "安吉县",
					"330524": "其它区",
					"330600": "绍兴市",
					"330602": "越城区",
					"330621": "绍兴县",
					"330624": "新昌县",
					"330681": "诸暨市",
					"330682": "上虞市",
					"330683": "嵊州市",
					"330684": "其它区",
					"330700": "金华市",
					"330702": "婺城区",
					"330703": "金东区",
					"330723": "武义县",
					"330726": "浦江县",
					"330727": "磐安县",
					"330781": "兰溪市",
					"330782": "义乌市",
					"330783": "东阳市",
					"330784": "永康市",
					"330785": "其它区",
					"330800": "衢州市",
					"330802": "柯城区",
					"330803": "衢江区",
					"330822": "常山县",
					"330824": "开化县",
					"330825": "龙游县",
					"330881": "江山市",
					"330882": "其它区",
					"330900": "舟山市",
					"330902": "定海区",
					"330903": "普陀区",
					"330921": "岱山县",
					"330922": "嵊泗县",
					"330923": "其它区",
					"331000": "台州市",
					"331002": "椒江区",
					"331003": "黄岩区",
					"331004": "路桥区",
					"331021": "玉环县",
					"331022": "三门县",
					"331023": "天台县",
					"331024": "仙居县",
					"331081": "温岭市",
					"331082": "临海市",
					"331083": "其它区",
					"331100": "丽水市",
					"331102": "莲都区",
					"331121": "青田县",
					"331122": "缙云县",
					"331123": "遂昌县",
					"331124": "松阳县",
					"331125": "云和县",
					"331126": "庆元县",
					"331127": "景宁畲族自治县",
					"331181": "龙泉市",
					"331182": "其它区",
					"340000": "安徽省",
					"340100": "合肥市",
					"340102": "瑶海区",
					"340103": "庐阳区",
					"340104": "蜀山区",
					"340111": "包河区",
					"340121": "长丰县",
					"340122": "肥东县",
					"340123": "肥西县",
					"340192": "其它区",
					"340200": "芜湖市",
					"340202": "镜湖区",
					"340203": "弋江区",
					"340207": "鸠江区",
					"340208": "三山区",
					"340221": "芜湖县",
					"340222": "繁昌县",
					"340223": "南陵县",
					"340224": "其它区",
					"340300": "蚌埠市",
					"340302": "龙子湖区",
					"340303": "蚌山区",
					"340304": "禹会区",
					"340311": "淮上区",
					"340321": "怀远县",
					"340322": "五河县",
					"340323": "固镇县",
					"340324": "其它区",
					"340400": "淮南市",
					"340402": "大通区",
					"340403": "田家庵区",
					"340404": "谢家集区",
					"340405": "八公山区",
					"340406": "潘集区",
					"340421": "凤台县",
					"340422": "其它区",
					"340500": "马鞍山市",
					"340503": "花山区",
					"340504": "雨山区",
					"340506": "博望区",
					"340521": "当涂县",
					"340522": "其它区",
					"340600": "淮北市",
					"340602": "杜集区",
					"340603": "相山区",
					"340604": "烈山区",
					"340621": "濉溪县",
					"340622": "其它区",
					"340700": "铜陵市",
					"340702": "铜官山区",
					"340703": "狮子山区",
					"340711": "郊区",
					"340721": "铜陵县",
					"340722": "其它区",
					"340800": "安庆市",
					"340802": "迎江区",
					"340803": "大观区",
					"340811": "宜秀区",
					"340822": "怀宁县",
					"340823": "枞阳县",
					"340824": "潜山县",
					"340825": "太湖县",
					"340826": "宿松县",
					"340827": "望江县",
					"340828": "岳西县",
					"340881": "桐城市",
					"340882": "其它区",
					"341000": "黄山市",
					"341002": "屯溪区",
					"341003": "黄山区",
					"341004": "徽州区",
					"341021": "歙县",
					"341022": "休宁县",
					"341023": "黟县",
					"341024": "祁门县",
					"341025": "其它区",
					"341100": "滁州市",
					"341102": "琅琊区",
					"341103": "南谯区",
					"341122": "来安县",
					"341124": "全椒县",
					"341125": "定远县",
					"341126": "凤阳县",
					"341181": "天长市",
					"341182": "明光市",
					"341183": "其它区",
					"341200": "阜阳市",
					"341202": "颍州区",
					"341203": "颍东区",
					"341204": "颍泉区",
					"341221": "临泉县",
					"341222": "太和县",
					"341225": "阜南县",
					"341226": "颍上县",
					"341282": "界首市",
					"341283": "其它区",
					"341300": "宿州市",
					"341302": "埇桥区",
					"341321": "砀山县",
					"341322": "萧县",
					"341323": "灵璧县",
					"341324": "泗县",
					"341325": "其它区",
					"341400": "巢湖市",
					"341421": "庐江县",
					"341422": "无为县",
					"341423": "含山县",
					"341424": "和县",
					"341500": "六安市",
					"341502": "金安区",
					"341503": "裕安区",
					"341521": "寿县",
					"341522": "霍邱县",
					"341523": "舒城县",
					"341524": "金寨县",
					"341525": "霍山县",
					"341526": "其它区",
					"341600": "亳州市",
					"341602": "谯城区",
					"341621": "涡阳县",
					"341622": "蒙城县",
					"341623": "利辛县",
					"341624": "其它区",
					"341700": "池州市",
					"341702": "贵池区",
					"341721": "东至县",
					"341722": "石台县",
					"341723": "青阳县",
					"341724": "其它区",
					"341800": "宣城市",
					"341802": "宣州区",
					"341821": "郎溪县",
					"341822": "广德县",
					"341823": "泾县",
					"341824": "绩溪县",
					"341825": "旌德县",
					"341881": "宁国市",
					"341882": "其它区",
					"350000": "福建省",
					"350100": "福州市",
					"350102": "鼓楼区",
					"350103": "台江区",
					"350104": "仓山区",
					"350105": "马尾区",
					"350111": "晋安区",
					"350121": "闽侯县",
					"350122": "连江县",
					"350123": "罗源县",
					"350124": "闽清县",
					"350125": "永泰县",
					"350128": "平潭县",
					"350181": "福清市",
					"350182": "长乐市",
					"350183": "其它区",
					"350200": "厦门市",
					"350203": "思明区",
					"350205": "海沧区",
					"350206": "湖里区",
					"350211": "集美区",
					"350212": "同安区",
					"350213": "翔安区",
					"350214": "其它区",
					"350300": "莆田市",
					"350302": "城厢区",
					"350303": "涵江区",
					"350304": "荔城区",
					"350305": "秀屿区",
					"350322": "仙游县",
					"350323": "其它区",
					"350400": "三明市",
					"350402": "梅列区",
					"350403": "三元区",
					"350421": "明溪县",
					"350423": "清流县",
					"350424": "宁化县",
					"350425": "大田县",
					"350426": "尤溪县",
					"350427": "沙县",
					"350428": "将乐县",
					"350429": "泰宁县",
					"350430": "建宁县",
					"350481": "永安市",
					"350482": "其它区",
					"350500": "泉州市",
					"350502": "鲤城区",
					"350503": "丰泽区",
					"350504": "洛江区",
					"350505": "泉港区",
					"350521": "惠安县",
					"350524": "安溪县",
					"350525": "永春县",
					"350526": "德化县",
					"350527": "金门县",
					"350581": "石狮市",
					"350582": "晋江市",
					"350583": "南安市",
					"350584": "其它区",
					"350600": "漳州市",
					"350602": "芗城区",
					"350603": "龙文区",
					"350622": "云霄县",
					"350623": "漳浦县",
					"350624": "诏安县",
					"350625": "长泰县",
					"350626": "东山县",
					"350627": "南靖县",
					"350628": "平和县",
					"350629": "华安县",
					"350681": "龙海市",
					"350682": "其它区",
					"350700": "南平市",
					"350702": "延平区",
					"350721": "顺昌县",
					"350722": "浦城县",
					"350723": "光泽县",
					"350724": "松溪县",
					"350725": "政和县",
					"350781": "邵武市",
					"350782": "武夷山市",
					"350783": "建瓯市",
					"350784": "建阳市",
					"350785": "其它区",
					"350800": "龙岩市",
					"350802": "新罗区",
					"350821": "长汀县",
					"350822": "永定县",
					"350823": "上杭县",
					"350824": "武平县",
					"350825": "连城县",
					"350881": "漳平市",
					"350882": "其它区",
					"350900": "宁德市",
					"350902": "蕉城区",
					"350921": "霞浦县",
					"350922": "古田县",
					"350923": "屏南县",
					"350924": "寿宁县",
					"350925": "周宁县",
					"350926": "柘荣县",
					"350981": "福安市",
					"350982": "福鼎市",
					"350983": "其它区",
					"360000": "江西省",
					"360100": "南昌市",
					"360102": "东湖区",
					"360103": "西湖区",
					"360104": "青云谱区",
					"360105": "湾里区",
					"360111": "青山湖区",
					"360121": "南昌县",
					"360122": "新建县",
					"360123": "安义县",
					"360124": "进贤县",
					"360128": "其它区",
					"360200": "景德镇市",
					"360202": "昌江区",
					"360203": "珠山区",
					"360222": "浮梁县",
					"360281": "乐平市",
					"360282": "其它区",
					"360300": "萍乡市",
					"360302": "安源区",
					"360313": "湘东区",
					"360321": "莲花县",
					"360322": "上栗县",
					"360323": "芦溪县",
					"360324": "其它区",
					"360400": "九江市",
					"360402": "庐山区",
					"360403": "浔阳区",
					"360421": "九江县",
					"360423": "武宁县",
					"360424": "修水县",
					"360425": "永修县",
					"360426": "德安县",
					"360427": "星子县",
					"360428": "都昌县",
					"360429": "湖口县",
					"360430": "彭泽县",
					"360481": "瑞昌市",
					"360482": "其它区",
					"360483": "共青城市",
					"360500": "新余市",
					"360502": "渝水区",
					"360521": "分宜县",
					"360522": "其它区",
					"360600": "鹰潭市",
					"360602": "月湖区",
					"360622": "余江县",
					"360681": "贵溪市",
					"360682": "其它区",
					"360700": "赣州市",
					"360702": "章贡区",
					"360721": "赣县",
					"360722": "信丰县",
					"360723": "大余县",
					"360724": "上犹县",
					"360725": "崇义县",
					"360726": "安远县",
					"360727": "龙南县",
					"360728": "定南县",
					"360729": "全南县",
					"360730": "宁都县",
					"360731": "于都县",
					"360732": "兴国县",
					"360733": "会昌县",
					"360734": "寻乌县",
					"360735": "石城县",
					"360781": "瑞金市",
					"360782": "南康市",
					"360783": "其它区",
					"360800": "吉安市",
					"360802": "吉州区",
					"360803": "青原区",
					"360821": "吉安县",
					"360822": "吉水县",
					"360823": "峡江县",
					"360824": "新干县",
					"360825": "永丰县",
					"360826": "泰和县",
					"360827": "遂川县",
					"360828": "万安县",
					"360829": "安福县",
					"360830": "永新县",
					"360881": "井冈山市",
					"360882": "其它区",
					"360900": "宜春市",
					"360902": "袁州区",
					"360921": "奉新县",
					"360922": "万载县",
					"360923": "上高县",
					"360924": "宜丰县",
					"360925": "靖安县",
					"360926": "铜鼓县",
					"360981": "丰城市",
					"360982": "樟树市",
					"360983": "高安市",
					"360984": "其它区",
					"361000": "抚州市",
					"361002": "临川区",
					"361021": "南城县",
					"361022": "黎川县",
					"361023": "南丰县",
					"361024": "崇仁县",
					"361025": "乐安县",
					"361026": "宜黄县",
					"361027": "金溪县",
					"361028": "资溪县",
					"361029": "东乡县",
					"361030": "广昌县",
					"361031": "其它区",
					"361100": "上饶市",
					"361102": "信州区",
					"361121": "上饶县",
					"361122": "广丰县",
					"361123": "玉山县",
					"361124": "铅山县",
					"361125": "横峰县",
					"361126": "弋阳县",
					"361127": "余干县",
					"361128": "鄱阳县",
					"361129": "万年县",
					"361130": "婺源县",
					"361181": "德兴市",
					"361182": "其它区",
					"370000": "山东省",
					"370100": "济南市",
					"370102": "历下区",
					"370103": "市中区",
					"370104": "槐荫区",
					"370105": "天桥区",
					"370112": "历城区",
					"370113": "长清区",
					"370124": "平阴县",
					"370125": "济阳县",
					"370126": "商河县",
					"370181": "章丘市",
					"370182": "其它区",
					"370200": "青岛市",
					"370202": "市南区",
					"370203": "市北区",
					"370211": "黄岛区",
					"370212": "崂山区",
					"370213": "李沧区",
					"370214": "城阳区",
					"370281": "胶州市",
					"370282": "即墨市",
					"370283": "平度市",
					"370285": "莱西市",
					"370286": "其它区",
					"370300": "淄博市",
					"370302": "淄川区",
					"370303": "张店区",
					"370304": "博山区",
					"370305": "临淄区",
					"370306": "周村区",
					"370321": "桓台县",
					"370322": "高青县",
					"370323": "沂源县",
					"370324": "其它区",
					"370400": "枣庄市",
					"370402": "市中区",
					"370403": "薛城区",
					"370404": "峄城区",
					"370405": "台儿庄区",
					"370406": "山亭区",
					"370481": "滕州市",
					"370482": "其它区",
					"370500": "东营市",
					"370502": "东营区",
					"370503": "河口区",
					"370521": "垦利县",
					"370522": "利津县",
					"370523": "广饶县",
					"370591": "其它区",
					"370600": "烟台市",
					"370602": "芝罘区",
					"370611": "福山区",
					"370612": "牟平区",
					"370613": "莱山区",
					"370634": "长岛县",
					"370681": "龙口市",
					"370682": "莱阳市",
					"370683": "莱州市",
					"370684": "蓬莱市",
					"370685": "招远市",
					"370686": "栖霞市",
					"370687": "海阳市",
					"370688": "其它区",
					"370700": "潍坊市",
					"370702": "潍城区",
					"370703": "寒亭区",
					"370704": "坊子区",
					"370705": "奎文区",
					"370724": "临朐县",
					"370725": "昌乐县",
					"370781": "青州市",
					"370782": "诸城市",
					"370783": "寿光市",
					"370784": "安丘市",
					"370785": "高密市",
					"370786": "昌邑市",
					"370787": "其它区",
					"370800": "济宁市",
					"370802": "市中区",
					"370811": "任城区",
					"370826": "微山县",
					"370827": "鱼台县",
					"370828": "金乡县",
					"370829": "嘉祥县",
					"370830": "汶上县",
					"370831": "泗水县",
					"370832": "梁山县",
					"370881": "曲阜市",
					"370882": "兖州市",
					"370883": "邹城市",
					"370884": "其它区",
					"370900": "泰安市",
					"370902": "泰山区",
					"370903": "岱岳区",
					"370921": "宁阳县",
					"370923": "东平县",
					"370982": "新泰市",
					"370983": "肥城市",
					"370984": "其它区",
					"371000": "威海市",
					"371002": "环翠区",
					"371081": "文登市",
					"371082": "荣成市",
					"371083": "乳山市",
					"371084": "其它区",
					"371100": "日照市",
					"371102": "东港区",
					"371103": "岚山区",
					"371121": "五莲县",
					"371122": "莒县",
					"371123": "其它区",
					"371200": "莱芜市",
					"371202": "莱城区",
					"371203": "钢城区",
					"371204": "其它区",
					"371300": "临沂市",
					"371302": "兰山区",
					"371311": "罗庄区",
					"371312": "河东区",
					"371321": "沂南县",
					"371322": "郯城县",
					"371323": "沂水县",
					"371324": "苍山县",
					"371325": "费县",
					"371326": "平邑县",
					"371327": "莒南县",
					"371328": "蒙阴县",
					"371329": "临沭县",
					"371330": "其它区",
					"371400": "德州市",
					"371402": "德城区",
					"371421": "陵县",
					"371422": "宁津县",
					"371423": "庆云县",
					"371424": "临邑县",
					"371425": "齐河县",
					"371426": "平原县",
					"371427": "夏津县",
					"371428": "武城县",
					"371481": "乐陵市",
					"371482": "禹城市",
					"371483": "其它区",
					"371500": "聊城市",
					"371502": "东昌府区",
					"371521": "阳谷县",
					"371522": "莘县",
					"371523": "茌平县",
					"371524": "东阿县",
					"371525": "冠县",
					"371526": "高唐县",
					"371581": "临清市",
					"371582": "其它区",
					"371600": "滨州市",
					"371602": "滨城区",
					"371621": "惠民县",
					"371622": "阳信县",
					"371623": "无棣县",
					"371624": "沾化县",
					"371625": "博兴县",
					"371626": "邹平县",
					"371627": "其它区",
					"371700": "菏泽市",
					"371702": "牡丹区",
					"371721": "曹县",
					"371722": "单县",
					"371723": "成武县",
					"371724": "巨野县",
					"371725": "郓城县",
					"371726": "鄄城县",
					"371727": "定陶县",
					"371728": "东明县",
					"371729": "其它区",
					"410000": "河南省",
					"410100": "郑州市",
					"410102": "中原区",
					"410103": "二七区",
					"410104": "管城回族区",
					"410105": "金水区",
					"410106": "上街区",
					"410108": "惠济区",
					"410122": "中牟县",
					"410181": "巩义市",
					"410182": "荥阳市",
					"410183": "新密市",
					"410184": "新郑市",
					"410185": "登封市",
					"410188": "其它区",
					"410200": "开封市",
					"410202": "龙亭区",
					"410203": "顺河回族区",
					"410204": "鼓楼区",
					"410205": "禹王台区",
					"410211": "金明区",
					"410221": "杞县",
					"410222": "通许县",
					"410223": "尉氏县",
					"410224": "开封县",
					"410225": "兰考县",
					"410226": "其它区",
					"410300": "洛阳市",
					"410302": "老城区",
					"410303": "西工区",
					"410304": "瀍河回族区",
					"410305": "涧西区",
					"410306": "吉利区",
					"410307": "洛龙区",
					"410322": "孟津县",
					"410323": "新安县",
					"410324": "栾川县",
					"410325": "嵩县",
					"410326": "汝阳县",
					"410327": "宜阳县",
					"410328": "洛宁县",
					"410329": "伊川县",
					"410381": "偃师市",
					"410400": "平顶山市",
					"410402": "新华区",
					"410403": "卫东区",
					"410404": "石龙区",
					"410411": "湛河区",
					"410421": "宝丰县",
					"410422": "叶县",
					"410423": "鲁山县",
					"410425": "郏县",
					"410481": "舞钢市",
					"410482": "汝州市",
					"410483": "其它区",
					"410500": "安阳市",
					"410502": "文峰区",
					"410503": "北关区",
					"410505": "殷都区",
					"410506": "龙安区",
					"410522": "安阳县",
					"410523": "汤阴县",
					"410526": "滑县",
					"410527": "内黄县",
					"410581": "林州市",
					"410582": "其它区",
					"410600": "鹤壁市",
					"410602": "鹤山区",
					"410603": "山城区",
					"410611": "淇滨区",
					"410621": "浚县",
					"410622": "淇县",
					"410623": "其它区",
					"410700": "新乡市",
					"410702": "红旗区",
					"410703": "卫滨区",
					"410704": "凤泉区",
					"410711": "牧野区",
					"410721": "新乡县",
					"410724": "获嘉县",
					"410725": "原阳县",
					"410726": "延津县",
					"410727": "封丘县",
					"410728": "长垣县",
					"410781": "卫辉市",
					"410782": "辉县市",
					"410783": "其它区",
					"410800": "焦作市",
					"410802": "解放区",
					"410803": "中站区",
					"410804": "马村区",
					"410811": "山阳区",
					"410821": "修武县",
					"410822": "博爱县",
					"410823": "武陟县",
					"410825": "温县",
					"410881": "济源市",
					"410882": "沁阳市",
					"410883": "孟州市",
					"410884": "其它区",
					"410900": "濮阳市",
					"410902": "华龙区",
					"410922": "清丰县",
					"410923": "南乐县",
					"410926": "范县",
					"410927": "台前县",
					"410928": "濮阳县",
					"410929": "其它区",
					"411000": "许昌市",
					"411002": "魏都区",
					"411023": "许昌县",
					"411024": "鄢陵县",
					"411025": "襄城县",
					"411081": "禹州市",
					"411082": "长葛市",
					"411083": "其它区",
					"411100": "漯河市",
					"411102": "源汇区",
					"411103": "郾城区",
					"411104": "召陵区",
					"411121": "舞阳县",
					"411122": "临颍县",
					"411123": "其它区",
					"411200": "三门峡市",
					"411202": "湖滨区",
					"411221": "渑池县",
					"411222": "陕县",
					"411224": "卢氏县",
					"411281": "义马市",
					"411282": "灵宝市",
					"411283": "其它区",
					"411300": "南阳市",
					"411302": "宛城区",
					"411303": "卧龙区",
					"411321": "南召县",
					"411322": "方城县",
					"411323": "西峡县",
					"411324": "镇平县",
					"411325": "内乡县",
					"411326": "淅川县",
					"411327": "社旗县",
					"411328": "唐河县",
					"411329": "新野县",
					"411330": "桐柏县",
					"411381": "邓州市",
					"411382": "其它区",
					"411400": "商丘市",
					"411402": "梁园区",
					"411403": "睢阳区",
					"411421": "民权县",
					"411422": "睢县",
					"411423": "宁陵县",
					"411424": "柘城县",
					"411425": "虞城县",
					"411426": "夏邑县",
					"411481": "永城市",
					"411482": "其它区",
					"411500": "信阳市",
					"411502": "浉河区",
					"411503": "平桥区",
					"411521": "罗山县",
					"411522": "光山县",
					"411523": "新县",
					"411524": "商城县",
					"411525": "固始县",
					"411526": "潢川县",
					"411527": "淮滨县",
					"411528": "息县",
					"411529": "其它区",
					"411600": "周口市",
					"411602": "川汇区",
					"411621": "扶沟县",
					"411622": "西华县",
					"411623": "商水县",
					"411624": "沈丘县",
					"411625": "郸城县",
					"411626": "淮阳县",
					"411627": "太康县",
					"411628": "鹿邑县",
					"411681": "项城市",
					"411682": "其它区",
					"411700": "驻马店市",
					"411702": "驿城区",
					"411721": "西平县",
					"411722": "上蔡县",
					"411723": "平舆县",
					"411724": "正阳县",
					"411725": "确山县",
					"411726": "泌阳县",
					"411727": "汝南县",
					"411728": "遂平县",
					"411729": "新蔡县",
					"411730": "其它区",
					"420000": "湖北省",
					"420100": "武汉市",
					"420102": "江岸区",
					"420103": "江汉区",
					"420104": "硚口区",
					"420105": "汉阳区",
					"420106": "武昌区",
					"420107": "青山区",
					"420111": "洪山区",
					"420112": "东西湖区",
					"420113": "汉南区",
					"420114": "蔡甸区",
					"420115": "江夏区",
					"420116": "黄陂区",
					"420117": "新洲区",
					"420118": "其它区",
					"420200": "黄石市",
					"420202": "黄石港区",
					"420203": "西塞山区",
					"420204": "下陆区",
					"420205": "铁山区",
					"420222": "阳新县",
					"420281": "大冶市",
					"420282": "其它区",
					"420300": "十堰市",
					"420302": "茅箭区",
					"420303": "张湾区",
					"420321": "郧县",
					"420322": "郧西县",
					"420323": "竹山县",
					"420324": "竹溪县",
					"420325": "房县",
					"420381": "丹江口市",
					"420383": "其它区",
					"420500": "宜昌市",
					"420502": "西陵区",
					"420503": "伍家岗区",
					"420504": "点军区",
					"420505": "猇亭区",
					"420506": "夷陵区",
					"420525": "远安县",
					"420526": "兴山县",
					"420527": "秭归县",
					"420528": "长阳土家族自治县",
					"420529": "五峰土家族自治县",
					"420581": "宜都市",
					"420582": "当阳市",
					"420583": "枝江市",
					"420584": "其它区",
					"420600": "襄阳市",
					"420602": "襄城区",
					"420606": "樊城区",
					"420607": "襄州区",
					"420624": "南漳县",
					"420625": "谷城县",
					"420626": "保康县",
					"420682": "老河口市",
					"420683": "枣阳市",
					"420684": "宜城市",
					"420685": "其它区",
					"420700": "鄂州市",
					"420702": "梁子湖区",
					"420703": "华容区",
					"420704": "鄂城区",
					"420705": "其它区",
					"420800": "荆门市",
					"420802": "东宝区",
					"420804": "掇刀区",
					"420821": "京山县",
					"420822": "沙洋县",
					"420881": "钟祥市",
					"420882": "其它区",
					"420900": "孝感市",
					"420902": "孝南区",
					"420921": "孝昌县",
					"420922": "大悟县",
					"420923": "云梦县",
					"420981": "应城市",
					"420982": "安陆市",
					"420984": "汉川市",
					"420985": "其它区",
					"421000": "荆州市",
					"421002": "沙市区",
					"421003": "荆州区",
					"421022": "公安县",
					"421023": "监利县",
					"421024": "江陵县",
					"421081": "石首市",
					"421083": "洪湖市",
					"421087": "松滋市",
					"421088": "其它区",
					"421100": "黄冈市",
					"421102": "黄州区",
					"421121": "团风县",
					"421122": "红安县",
					"421123": "罗田县",
					"421124": "英山县",
					"421125": "浠水县",
					"421126": "蕲春县",
					"421127": "黄梅县",
					"421181": "麻城市",
					"421182": "武穴市",
					"421183": "其它区",
					"421200": "咸宁市",
					"421202": "咸安区",
					"421221": "嘉鱼县",
					"421222": "通城县",
					"421223": "崇阳县",
					"421224": "通山县",
					"421281": "赤壁市",
					"421283": "其它区",
					"421300": "随州市",
					"421302": "曾都区",
					"421321": "随县",
					"421381": "广水市",
					"421382": "其它区",
					"422800": "恩施土家族苗族自治州",
					"422801": "恩施市",
					"422802": "利川市",
					"422822": "建始县",
					"422823": "巴东县",
					"422825": "宣恩县",
					"422826": "咸丰县",
					"422827": "来凤县",
					"422828": "鹤峰县",
					"422829": "其它区",
					"429004": "仙桃市",
					"429005": "潜江市",
					"429006": "天门市",
					"429021": "神农架林区",
					"430000": "湖南省",
					"430100": "长沙市",
					"430102": "芙蓉区",
					"430103": "天心区",
					"430104": "岳麓区",
					"430105": "开福区",
					"430111": "雨花区",
					"430121": "长沙县",
					"430122": "望城区",
					"430124": "宁乡县",
					"430181": "浏阳市",
					"430182": "其它区",
					"430200": "株洲市",
					"430202": "荷塘区",
					"430203": "芦淞区",
					"430204": "石峰区",
					"430211": "天元区",
					"430221": "株洲县",
					"430223": "攸县",
					"430224": "茶陵县",
					"430225": "炎陵县",
					"430281": "醴陵市",
					"430282": "其它区",
					"430300": "湘潭市",
					"430302": "雨湖区",
					"430304": "岳塘区",
					"430321": "湘潭县",
					"430381": "湘乡市",
					"430382": "韶山市",
					"430383": "其它区",
					"430400": "衡阳市",
					"430405": "珠晖区",
					"430406": "雁峰区",
					"430407": "石鼓区",
					"430408": "蒸湘区",
					"430412": "南岳区",
					"430421": "衡阳县",
					"430422": "衡南县",
					"430423": "衡山县",
					"430424": "衡东县",
					"430426": "祁东县",
					"430481": "耒阳市",
					"430482": "常宁市",
					"430483": "其它区",
					"430500": "邵阳市",
					"430502": "双清区",
					"430503": "大祥区",
					"430511": "北塔区",
					"430521": "邵东县",
					"430522": "新邵县",
					"430523": "邵阳县",
					"430524": "隆回县",
					"430525": "洞口县",
					"430527": "绥宁县",
					"430528": "新宁县",
					"430529": "城步苗族自治县",
					"430581": "武冈市",
					"430582": "其它区",
					"430600": "岳阳市",
					"430602": "岳阳楼区",
					"430603": "云溪区",
					"430611": "君山区",
					"430621": "岳阳县",
					"430623": "华容县",
					"430624": "湘阴县",
					"430626": "平江县",
					"430681": "汨罗市",
					"430682": "临湘市",
					"430683": "其它区",
					"430700": "常德市",
					"430702": "武陵区",
					"430703": "鼎城区",
					"430721": "安乡县",
					"430722": "汉寿县",
					"430723": "澧县",
					"430724": "临澧县",
					"430725": "桃源县",
					"430726": "石门县",
					"430781": "津市市",
					"430782": "其它区",
					"430800": "张家界市",
					"430802": "永定区",
					"430811": "武陵源区",
					"430821": "慈利县",
					"430822": "桑植县",
					"430823": "其它区",
					"430900": "益阳市",
					"430902": "资阳区",
					"430903": "赫山区",
					"430921": "南县",
					"430922": "桃江县",
					"430923": "安化县",
					"430981": "沅江市",
					"430982": "其它区",
					"431000": "郴州市",
					"431002": "北湖区",
					"431003": "苏仙区",
					"431021": "桂阳县",
					"431022": "宜章县",
					"431023": "永兴县",
					"431024": "嘉禾县",
					"431025": "临武县",
					"431026": "汝城县",
					"431027": "桂东县",
					"431028": "安仁县",
					"431081": "资兴市",
					"431082": "其它区",
					"431100": "永州市",
					"431102": "零陵区",
					"431103": "冷水滩区",
					"431121": "祁阳县",
					"431122": "东安县",
					"431123": "双牌县",
					"431124": "道县",
					"431125": "江永县",
					"431126": "宁远县",
					"431127": "蓝山县",
					"431128": "新田县",
					"431129": "江华瑶族自治县",
					"431130": "其它区",
					"431200": "怀化市",
					"431202": "鹤城区",
					"431221": "中方县",
					"431222": "沅陵县",
					"431223": "辰溪县",
					"431224": "溆浦县",
					"431225": "会同县",
					"431226": "麻阳苗族自治县",
					"431227": "新晃侗族自治县",
					"431228": "芷江侗族自治县",
					"431229": "靖州苗族侗族自治县",
					"431230": "通道侗族自治县",
					"431281": "洪江市",
					"431282": "其它区",
					"431300": "娄底市",
					"431302": "娄星区",
					"431321": "双峰县",
					"431322": "新化县",
					"431381": "冷水江市",
					"431382": "涟源市",
					"431383": "其它区",
					"433100": "湘西土家族苗族自治州",
					"433101": "吉首市",
					"433122": "泸溪县",
					"433123": "凤凰县",
					"433124": "花垣县",
					"433125": "保靖县",
					"433126": "古丈县",
					"433127": "永顺县",
					"433130": "龙山县",
					"433131": "其它区",
					"440000": "广东省",
					"440100": "广州市",
					"440103": "荔湾区",
					"440104": "越秀区",
					"440105": "海珠区",
					"440106": "天河区",
					"440111": "白云区",
					"440112": "黄埔区",
					"440113": "番禺区",
					"440114": "花都区",
					"440115": "南沙区",
					"440116": "萝岗区",
					"440183": "增城市",
					"440184": "从化市",
					"440189": "其它区",
					"440200": "韶关市",
					"440203": "武江区",
					"440204": "浈江区",
					"440205": "曲江区",
					"440222": "始兴县",
					"440224": "仁化县",
					"440229": "翁源县",
					"440232": "乳源瑶族自治县",
					"440233": "新丰县",
					"440281": "乐昌市",
					"440282": "南雄市",
					"440283": "其它区",
					"440300": "深圳市",
					"440303": "罗湖区",
					"440304": "福田区",
					"440305": "南山区",
					"440306": "宝安区",
					"440307": "龙岗区",
					"440308": "盐田区",
					"440309": "其它区",
					"440320": "光明新区",
					"440321": "坪山新区",
					"440322": "大鹏新区",
					"440323": "龙华新区",
					"440400": "珠海市",
					"440402": "香洲区",
					"440403": "斗门区",
					"440404": "金湾区",
					"440488": "其它区",
					"440500": "汕头市",
					"440507": "龙湖区",
					"440511": "金平区",
					"440512": "濠江区",
					"440513": "潮阳区",
					"440514": "潮南区",
					"440515": "澄海区",
					"440523": "南澳县",
					"440524": "其它区",
					"440600": "佛山市",
					"440604": "禅城区",
					"440605": "南海区",
					"440606": "顺德区",
					"440607": "三水区",
					"440608": "高明区",
					"440609": "其它区",
					"440700": "江门市",
					"440703": "蓬江区",
					"440704": "江海区",
					"440705": "新会区",
					"440781": "台山市",
					"440783": "开平市",
					"440784": "鹤山市",
					"440785": "恩平市",
					"440786": "其它区",
					"440800": "湛江市",
					"440802": "赤坎区",
					"440803": "霞山区",
					"440804": "坡头区",
					"440811": "麻章区",
					"440823": "遂溪县",
					"440825": "徐闻县",
					"440881": "廉江市",
					"440882": "雷州市",
					"440883": "吴川市",
					"440884": "其它区",
					"440900": "茂名市",
					"440902": "茂南区",
					"440903": "茂港区",
					"440923": "电白县",
					"440981": "高州市",
					"440982": "化州市",
					"440983": "信宜市",
					"440984": "其它区",
					"441200": "肇庆市",
					"441202": "端州区",
					"441203": "鼎湖区",
					"441223": "广宁县",
					"441224": "怀集县",
					"441225": "封开县",
					"441226": "德庆县",
					"441283": "高要市",
					"441284": "四会市",
					"441285": "其它区",
					"441300": "惠州市",
					"441302": "惠城区",
					"441303": "惠阳区",
					"441322": "博罗县",
					"441323": "惠东县",
					"441324": "龙门县",
					"441325": "其它区",
					"441400": "梅州市",
					"441402": "梅江区",
					"441421": "梅县",
					"441422": "大埔县",
					"441423": "丰顺县",
					"441424": "五华县",
					"441426": "平远县",
					"441427": "蕉岭县",
					"441481": "兴宁市",
					"441482": "其它区",
					"441500": "汕尾市",
					"441502": "城区",
					"441521": "海丰县",
					"441523": "陆河县",
					"441581": "陆丰市",
					"441582": "其它区",
					"441600": "河源市",
					"441602": "源城区",
					"441621": "紫金县",
					"441622": "龙川县",
					"441623": "连平县",
					"441624": "和平县",
					"441625": "东源县",
					"441626": "其它区",
					"441700": "阳江市",
					"441702": "江城区",
					"441721": "阳西县",
					"441723": "阳东县",
					"441781": "阳春市",
					"441782": "其它区",
					"441800": "清远市",
					"441802": "清城区",
					"441821": "佛冈县",
					"441823": "阳山县",
					"441825": "连山壮族瑶族自治县",
					"441826": "连南瑶族自治县",
					"441827": "清新区",
					"441881": "英德市",
					"441882": "连州市",
					"441883": "其它区",
					"441900": "东莞市",
					"442000": "中山市",
					"442101": "东沙群岛",
					"445100": "潮州市",
					"445102": "湘桥区",
					"445121": "潮安区",
					"445122": "饶平县",
					"445186": "其它区",
					"445200": "揭阳市",
					"445202": "榕城区",
					"445221": "揭东区",
					"445222": "揭西县",
					"445224": "惠来县",
					"445281": "普宁市",
					"445285": "其它区",
					"445300": "云浮市",
					"445302": "云城区",
					"445321": "新兴县",
					"445322": "郁南县",
					"445323": "云安县",
					"445381": "罗定市",
					"445382": "其它区",
					"450000": "广西壮族自治区",
					"450100": "南宁市",
					"450102": "兴宁区",
					"450103": "青秀区",
					"450105": "江南区",
					"450107": "西乡塘区",
					"450108": "良庆区",
					"450109": "邕宁区",
					"450122": "武鸣县",
					"450123": "隆安县",
					"450124": "马山县",
					"450125": "上林县",
					"450126": "宾阳县",
					"450127": "横县",
					"450128": "其它区",
					"450200": "柳州市",
					"450202": "城中区",
					"450203": "鱼峰区",
					"450204": "柳南区",
					"450205": "柳北区",
					"450221": "柳江县",
					"450222": "柳城县",
					"450223": "鹿寨县",
					"450224": "融安县",
					"450225": "融水苗族自治县",
					"450226": "三江侗族自治县",
					"450227": "其它区",
					"450300": "桂林市",
					"450302": "秀峰区",
					"450303": "叠彩区",
					"450304": "象山区",
					"450305": "七星区",
					"450311": "雁山区",
					"450321": "阳朔县",
					"450322": "临桂区",
					"450323": "灵川县",
					"450324": "全州县",
					"450325": "兴安县",
					"450326": "永福县",
					"450327": "灌阳县",
					"450328": "龙胜各族自治县",
					"450329": "资源县",
					"450330": "平乐县",
					"450331": "荔浦县",
					"450332": "恭城瑶族自治县",
					"450333": "其它区",
					"450400": "梧州市",
					"450403": "万秀区",
					"450405": "长洲区",
					"450406": "龙圩区",
					"450421": "苍梧县",
					"450422": "藤县",
					"450423": "蒙山县",
					"450481": "岑溪市",
					"450482": "其它区",
					"450500": "北海市",
					"450502": "海城区",
					"450503": "银海区",
					"450512": "铁山港区",
					"450521": "合浦县",
					"450522": "其它区",
					"450600": "防城港市",
					"450602": "港口区",
					"450603": "防城区",
					"450621": "上思县",
					"450681": "东兴市",
					"450682": "其它区",
					"450700": "钦州市",
					"450702": "钦南区",
					"450703": "钦北区",
					"450721": "灵山县",
					"450722": "浦北县",
					"450723": "其它区",
					"450800": "贵港市",
					"450802": "港北区",
					"450803": "港南区",
					"450804": "覃塘区",
					"450821": "平南县",
					"450881": "桂平市",
					"450882": "其它区",
					"450900": "玉林市",
					"450902": "玉州区",
					"450903": "福绵区",
					"450921": "容县",
					"450922": "陆川县",
					"450923": "博白县",
					"450924": "兴业县",
					"450981": "北流市",
					"450982": "其它区",
					"451000": "百色市",
					"451002": "右江区",
					"451021": "田阳县",
					"451022": "田东县",
					"451023": "平果县",
					"451024": "德保县",
					"451025": "靖西县",
					"451026": "那坡县",
					"451027": "凌云县",
					"451028": "乐业县",
					"451029": "田林县",
					"451030": "西林县",
					"451031": "隆林各族自治县",
					"451032": "其它区",
					"451100": "贺州市",
					"451102": "八步区",
					"451119": "平桂管理区",
					"451121": "昭平县",
					"451122": "钟山县",
					"451123": "富川瑶族自治县",
					"451124": "其它区",
					"451200": "河池市",
					"451202": "金城江区",
					"451221": "南丹县",
					"451222": "天峨县",
					"451223": "凤山县",
					"451224": "东兰县",
					"451225": "罗城仫佬族自治县",
					"451226": "环江毛南族自治县",
					"451227": "巴马瑶族自治县",
					"451228": "都安瑶族自治县",
					"451229": "大化瑶族自治县",
					"451281": "宜州市",
					"451282": "其它区",
					"451300": "来宾市",
					"451302": "兴宾区",
					"451321": "忻城县",
					"451322": "象州县",
					"451323": "武宣县",
					"451324": "金秀瑶族自治县",
					"451381": "合山市",
					"451382": "其它区",
					"451400": "崇左市",
					"451402": "江州区",
					"451421": "扶绥县",
					"451422": "宁明县",
					"451423": "龙州县",
					"451424": "大新县",
					"451425": "天等县",
					"451481": "凭祥市",
					"451482": "其它区",
					"460000": "海南省",
					"460100": "海口市",
					"460105": "秀英区",
					"460106": "龙华区",
					"460107": "琼山区",
					"460108": "美兰区",
					"460109": "其它区",
					"460200": "三亚市",
					"460300": "三沙市",
					"460321": "西沙群岛",
					"460322": "南沙群岛",
					"460323": "中沙群岛的岛礁及其海域",
					"469001": "五指山市",
					"469002": "琼海市",
					"469003": "儋州市",
					"469005": "文昌市",
					"469006": "万宁市",
					"469007": "东方市",
					"469025": "定安县",
					"469026": "屯昌县",
					"469027": "澄迈县",
					"469028": "临高县",
					"469030": "白沙黎族自治县",
					"469031": "昌江黎族自治县",
					"469033": "乐东黎族自治县",
					"469034": "陵水黎族自治县",
					"469035": "保亭黎族苗族自治县",
					"469036": "琼中黎族苗族自治县",
					"471005": "其它区",
					"500000": "重庆",
					"500100": "重庆市",
					"500101": "万州区",
					"500102": "涪陵区",
					"500103": "渝中区",
					"500104": "大渡口区",
					"500105": "江北区",
					"500106": "沙坪坝区",
					"500107": "九龙坡区",
					"500108": "南岸区",
					"500109": "北碚区",
					"500110": "万盛区",
					"500111": "双桥区",
					"500112": "渝北区",
					"500113": "巴南区",
					"500114": "黔江区",
					"500115": "长寿区",
					"500222": "綦江区",
					"500223": "潼南县",
					"500224": "铜梁县",
					"500225": "大足区",
					"500226": "荣昌县",
					"500227": "璧山县",
					"500228": "梁平县",
					"500229": "城口县",
					"500230": "丰都县",
					"500231": "垫江县",
					"500232": "武隆县",
					"500233": "忠县",
					"500234": "开县",
					"500235": "云阳县",
					"500236": "奉节县",
					"500237": "巫山县",
					"500238": "巫溪县",
					"500240": "石柱土家族自治县",
					"500241": "秀山土家族苗族自治县",
					"500242": "酉阳土家族苗族自治县",
					"500243": "彭水苗族土家族自治县",
					"500381": "江津区",
					"500382": "合川区",
					"500383": "永川区",
					"500384": "南川区",
					"500385": "其它区",
					"510000": "四川省",
					"510100": "成都市",
					"510104": "锦江区",
					"510105": "青羊区",
					"510106": "金牛区",
					"510107": "武侯区",
					"510108": "成华区",
					"510112": "龙泉驿区",
					"510113": "青白江区",
					"510114": "新都区",
					"510115": "温江区",
					"510121": "金堂县",
					"510122": "双流县",
					"510124": "郫县",
					"510129": "大邑县",
					"510131": "蒲江县",
					"510132": "新津县",
					"510181": "都江堰市",
					"510182": "彭州市",
					"510183": "邛崃市",
					"510184": "崇州市",
					"510185": "其它区",
					"510300": "自贡市",
					"510302": "自流井区",
					"510303": "贡井区",
					"510304": "大安区",
					"510311": "沿滩区",
					"510321": "荣县",
					"510322": "富顺县",
					"510323": "其它区",
					"510400": "攀枝花市",
					"510402": "东区",
					"510403": "西区",
					"510411": "仁和区",
					"510421": "米易县",
					"510422": "盐边县",
					"510423": "其它区",
					"510500": "泸州市",
					"510502": "江阳区",
					"510503": "纳溪区",
					"510504": "龙马潭区",
					"510521": "泸县",
					"510522": "合江县",
					"510524": "叙永县",
					"510525": "古蔺县",
					"510526": "其它区",
					"510600": "德阳市",
					"510603": "旌阳区",
					"510623": "中江县",
					"510626": "罗江县",
					"510681": "广汉市",
					"510682": "什邡市",
					"510683": "绵竹市",
					"510684": "其它区",
					"510700": "绵阳市",
					"510703": "涪城区",
					"510704": "游仙区",
					"510722": "三台县",
					"510723": "盐亭县",
					"510724": "安县",
					"510725": "梓潼县",
					"510726": "北川羌族自治县",
					"510727": "平武县",
					"510781": "江油市",
					"510782": "其它区",
					"510800": "广元市",
					"510802": "利州区",
					"510811": "昭化区",
					"510812": "朝天区",
					"510821": "旺苍县",
					"510822": "青川县",
					"510823": "剑阁县",
					"510824": "苍溪县",
					"510825": "其它区",
					"510900": "遂宁市",
					"510903": "船山区",
					"510904": "安居区",
					"510921": "蓬溪县",
					"510922": "射洪县",
					"510923": "大英县",
					"510924": "其它区",
					"511000": "内江市",
					"511002": "市中区",
					"511011": "东兴区",
					"511024": "威远县",
					"511025": "资中县",
					"511028": "隆昌县",
					"511029": "其它区",
					"511100": "乐山市",
					"511102": "市中区",
					"511111": "沙湾区",
					"511112": "五通桥区",
					"511113": "金口河区",
					"511123": "犍为县",
					"511124": "井研县",
					"511126": "夹江县",
					"511129": "沐川县",
					"511132": "峨边彝族自治县",
					"511133": "马边彝族自治县",
					"511181": "峨眉山市",
					"511182": "其它区",
					"511300": "南充市",
					"511302": "顺庆区",
					"511303": "高坪区",
					"511304": "嘉陵区",
					"511321": "南部县",
					"511322": "营山县",
					"511323": "蓬安县",
					"511324": "仪陇县",
					"511325": "西充县",
					"511381": "阆中市",
					"511382": "其它区",
					"511400": "眉山市",
					"511402": "东坡区",
					"511421": "仁寿县",
					"511422": "彭山县",
					"511423": "洪雅县",
					"511424": "丹棱县",
					"511425": "青神县",
					"511426": "其它区",
					"511500": "宜宾市",
					"511502": "翠屏区",
					"511521": "宜宾县",
					"511522": "南溪区",
					"511523": "江安县",
					"511524": "长宁县",
					"511525": "高县",
					"511526": "珙县",
					"511527": "筠连县",
					"511528": "兴文县",
					"511529": "屏山县",
					"511530": "其它区",
					"511600": "广安市",
					"511602": "广安区",
					"511603": "前锋区",
					"511621": "岳池县",
					"511622": "武胜县",
					"511623": "邻水县",
					"511681": "华蓥市",
					"511683": "其它区",
					"511700": "达州市",
					"511702": "通川区",
					"511721": "达川区",
					"511722": "宣汉县",
					"511723": "开江县",
					"511724": "大竹县",
					"511725": "渠县",
					"511781": "万源市",
					"511782": "其它区",
					"511800": "雅安市",
					"511802": "雨城区",
					"511821": "名山区",
					"511822": "荥经县",
					"511823": "汉源县",
					"511824": "石棉县",
					"511825": "天全县",
					"511826": "芦山县",
					"511827": "宝兴县",
					"511828": "其它区",
					"511900": "巴中市",
					"511902": "巴州区",
					"511903": "恩阳区",
					"511921": "通江县",
					"511922": "南江县",
					"511923": "平昌县",
					"511924": "其它区",
					"512000": "资阳市",
					"512002": "雁江区",
					"512021": "安岳县",
					"512022": "乐至县",
					"512081": "简阳市",
					"512082": "其它区",
					"513200": "阿坝藏族羌族自治州",
					"513221": "汶川县",
					"513222": "理县",
					"513223": "茂县",
					"513224": "松潘县",
					"513225": "九寨沟县",
					"513226": "金川县",
					"513227": "小金县",
					"513228": "黑水县",
					"513229": "马尔康县",
					"513230": "壤塘县",
					"513231": "阿坝县",
					"513232": "若尔盖县",
					"513233": "红原县",
					"513234": "其它区",
					"513300": "甘孜藏族自治州",
					"513321": "康定县",
					"513322": "泸定县",
					"513323": "丹巴县",
					"513324": "九龙县",
					"513325": "雅江县",
					"513326": "道孚县",
					"513327": "炉霍县",
					"513328": "甘孜县",
					"513329": "新龙县",
					"513330": "德格县",
					"513331": "白玉县",
					"513332": "石渠县",
					"513333": "色达县",
					"513334": "理塘县",
					"513335": "巴塘县",
					"513336": "乡城县",
					"513337": "稻城县",
					"513338": "得荣县",
					"513339": "其它区",
					"513400": "凉山彝族自治州",
					"513401": "西昌市",
					"513422": "木里藏族自治县",
					"513423": "盐源县",
					"513424": "德昌县",
					"513425": "会理县",
					"513426": "会东县",
					"513427": "宁南县",
					"513428": "普格县",
					"513429": "布拖县",
					"513430": "金阳县",
					"513431": "昭觉县",
					"513432": "喜德县",
					"513433": "冕宁县",
					"513434": "越西县",
					"513435": "甘洛县",
					"513436": "美姑县",
					"513437": "雷波县",
					"513438": "其它区",
					"520000": "贵州省",
					"520100": "贵阳市",
					"520102": "南明区",
					"520103": "云岩区",
					"520111": "花溪区",
					"520112": "乌当区",
					"520113": "白云区",
					"520121": "开阳县",
					"520122": "息烽县",
					"520123": "修文县",
					"520151": "观山湖区",
					"520181": "清镇市",
					"520182": "其它区",
					"520200": "六盘水市",
					"520201": "钟山区",
					"520203": "六枝特区",
					"520221": "水城县",
					"520222": "盘县",
					"520223": "其它区",
					"520300": "遵义市",
					"520302": "红花岗区",
					"520303": "汇川区",
					"520321": "遵义县",
					"520322": "桐梓县",
					"520323": "绥阳县",
					"520324": "正安县",
					"520325": "道真仡佬族苗族自治县",
					"520326": "务川仡佬族苗族自治县",
					"520327": "凤冈县",
					"520328": "湄潭县",
					"520329": "余庆县",
					"520330": "习水县",
					"520381": "赤水市",
					"520382": "仁怀市",
					"520383": "其它区",
					"520400": "安顺市",
					"520402": "西秀区",
					"520421": "平坝县",
					"520422": "普定县",
					"520423": "镇宁布依族苗族自治县",
					"520424": "关岭布依族苗族自治县",
					"520425": "紫云苗族布依族自治县",
					"520426": "其它区",
					"522200": "铜仁市",
					"522201": "碧江区",
					"522222": "江口县",
					"522223": "玉屏侗族自治县",
					"522224": "石阡县",
					"522225": "思南县",
					"522226": "印江土家族苗族自治县",
					"522227": "德江县",
					"522228": "沿河土家族自治县",
					"522229": "松桃苗族自治县",
					"522230": "万山区",
					"522231": "其它区",
					"522300": "黔西南布依族苗族自治州",
					"522301": "兴义市",
					"522322": "兴仁县",
					"522323": "普安县",
					"522324": "晴隆县",
					"522325": "贞丰县",
					"522326": "望谟县",
					"522327": "册亨县",
					"522328": "安龙县",
					"522329": "其它区",
					"522400": "毕节市",
					"522401": "七星关区",
					"522422": "大方县",
					"522423": "黔西县",
					"522424": "金沙县",
					"522425": "织金县",
					"522426": "纳雍县",
					"522427": "威宁彝族回族苗族自治县",
					"522428": "赫章县",
					"522429": "其它区",
					"522600": "黔东南苗族侗族自治州",
					"522601": "凯里市",
					"522622": "黄平县",
					"522623": "施秉县",
					"522624": "三穗县",
					"522625": "镇远县",
					"522626": "岑巩县",
					"522627": "天柱县",
					"522628": "锦屏县",
					"522629": "剑河县",
					"522630": "台江县",
					"522631": "黎平县",
					"522632": "榕江县",
					"522633": "从江县",
					"522634": "雷山县",
					"522635": "麻江县",
					"522636": "丹寨县",
					"522637": "其它区",
					"522700": "黔南布依族苗族自治州",
					"522701": "都匀市",
					"522702": "福泉市",
					"522722": "荔波县",
					"522723": "贵定县",
					"522725": "瓮安县",
					"522726": "独山县",
					"522727": "平塘县",
					"522728": "罗甸县",
					"522729": "长顺县",
					"522730": "龙里县",
					"522731": "惠水县",
					"522732": "三都水族自治县",
					"522733": "其它区",
					"530000": "云南省",
					"530100": "昆明市",
					"530102": "五华区",
					"530103": "盘龙区",
					"530111": "官渡区",
					"530112": "西山区",
					"530113": "东川区",
					"530121": "呈贡区",
					"530122": "晋宁县",
					"530124": "富民县",
					"530125": "宜良县",
					"530126": "石林彝族自治县",
					"530127": "嵩明县",
					"530128": "禄劝彝族苗族自治县",
					"530129": "寻甸回族彝族自治县",
					"530181": "安宁市",
					"530182": "其它区",
					"530300": "曲靖市",
					"530302": "麒麟区",
					"530321": "马龙县",
					"530322": "陆良县",
					"530323": "师宗县",
					"530324": "罗平县",
					"530325": "富源县",
					"530326": "会泽县",
					"530328": "沾益县",
					"530381": "宣威市",
					"530382": "其它区",
					"530400": "玉溪市",
					"530402": "红塔区",
					"530421": "江川县",
					"530422": "澄江县",
					"530423": "通海县",
					"530424": "华宁县",
					"530425": "易门县",
					"530426": "峨山彝族自治县",
					"530427": "新平彝族傣族自治县",
					"530428": "元江哈尼族彝族傣族自治县",
					"530429": "其它区",
					"530500": "保山市",
					"530502": "隆阳区",
					"530521": "施甸县",
					"530522": "腾冲县",
					"530523": "龙陵县",
					"530524": "昌宁县",
					"530525": "其它区",
					"530600": "昭通市",
					"530602": "昭阳区",
					"530621": "鲁甸县",
					"530622": "巧家县",
					"530623": "盐津县",
					"530624": "大关县",
					"530625": "永善县",
					"530626": "绥江县",
					"530627": "镇雄县",
					"530628": "彝良县",
					"530629": "威信县",
					"530630": "水富县",
					"530631": "其它区",
					"530700": "丽江市",
					"530702": "古城区",
					"530721": "玉龙纳西族自治县",
					"530722": "永胜县",
					"530723": "华坪县",
					"530724": "宁蒗彝族自治县",
					"530725": "其它区",
					"530800": "普洱市",
					"530802": "思茅区",
					"530821": "宁洱哈尼族彝族自治县",
					"530822": "墨江哈尼族自治县",
					"530823": "景东彝族自治县",
					"530824": "景谷傣族彝族自治县",
					"530825": "镇沅彝族哈尼族拉祜族自治县",
					"530826": "江城哈尼族彝族自治县",
					"530827": "孟连傣族拉祜族佤族自治县",
					"530828": "澜沧拉祜族自治县",
					"530829": "西盟佤族自治县",
					"530830": "其它区",
					"530900": "临沧市",
					"530902": "临翔区",
					"530921": "凤庆县",
					"530922": "云县",
					"530923": "永德县",
					"530924": "镇康县",
					"530925": "双江拉祜族佤族布朗族傣族自治县",
					"530926": "耿马傣族佤族自治县",
					"530927": "沧源佤族自治县",
					"530928": "其它区",
					"532300": "楚雄彝族自治州",
					"532301": "楚雄市",
					"532322": "双柏县",
					"532323": "牟定县",
					"532324": "南华县",
					"532325": "姚安县",
					"532326": "大姚县",
					"532327": "永仁县",
					"532328": "元谋县",
					"532329": "武定县",
					"532331": "禄丰县",
					"532332": "其它区",
					"532500": "红河哈尼族彝族自治州",
					"532501": "个旧市",
					"532502": "开远市",
					"532522": "蒙自市",
					"532523": "屏边苗族自治县",
					"532524": "建水县",
					"532525": "石屏县",
					"532526": "弥勒市",
					"532527": "泸西县",
					"532528": "元阳县",
					"532529": "红河县",
					"532530": "金平苗族瑶族傣族自治县",
					"532531": "绿春县",
					"532532": "河口瑶族自治县",
					"532533": "其它区",
					"532600": "文山壮族苗族自治州",
					"532621": "文山市",
					"532622": "砚山县",
					"532623": "西畴县",
					"532624": "麻栗坡县",
					"532625": "马关县",
					"532626": "丘北县",
					"532627": "广南县",
					"532628": "富宁县",
					"532629": "其它区",
					"532800": "西双版纳傣族自治州",
					"532801": "景洪市",
					"532822": "勐海县",
					"532823": "勐腊县",
					"532824": "其它区",
					"532900": "大理白族自治州",
					"532901": "大理市",
					"532922": "漾濞彝族自治县",
					"532923": "祥云县",
					"532924": "宾川县",
					"532925": "弥渡县",
					"532926": "南涧彝族自治县",
					"532927": "巍山彝族回族自治县",
					"532928": "永平县",
					"532929": "云龙县",
					"532930": "洱源县",
					"532931": "剑川县",
					"532932": "鹤庆县",
					"532933": "其它区",
					"533100": "德宏傣族景颇族自治州",
					"533102": "瑞丽市",
					"533103": "芒市",
					"533122": "梁河县",
					"533123": "盈江县",
					"533124": "陇川县",
					"533125": "其它区",
					"533300": "怒江傈僳族自治州",
					"533321": "泸水县",
					"533323": "福贡县",
					"533324": "贡山独龙族怒族自治县",
					"533325": "兰坪白族普米族自治县",
					"533326": "其它区",
					"533400": "迪庆藏族自治州",
					"533421": "香格里拉县",
					"533422": "德钦县",
					"533423": "维西傈僳族自治县",
					"533424": "其它区",
					"540000": "西藏自治区",
					"540100": "拉萨市",
					"540102": "城关区",
					"540121": "林周县",
					"540122": "当雄县",
					"540123": "尼木县",
					"540124": "曲水县",
					"540125": "堆龙德庆县",
					"540126": "达孜县",
					"540127": "墨竹工卡县",
					"540128": "其它区",
					"542100": "昌都地区",
					"542121": "昌都县",
					"542122": "江达县",
					"542123": "贡觉县",
					"542124": "类乌齐县",
					"542125": "丁青县",
					"542126": "察雅县",
					"542127": "八宿县",
					"542128": "左贡县",
					"542129": "芒康县",
					"542132": "洛隆县",
					"542133": "边坝县",
					"542134": "其它区",
					"542200": "山南地区",
					"542221": "乃东县",
					"542222": "扎囊县",
					"542223": "贡嘎县",
					"542224": "桑日县",
					"542225": "琼结县",
					"542226": "曲松县",
					"542227": "措美县",
					"542228": "洛扎县",
					"542229": "加查县",
					"542231": "隆子县",
					"542232": "错那县",
					"542233": "浪卡子县",
					"542234": "其它区",
					"542300": "日喀则地区",
					"542301": "日喀则市",
					"542322": "南木林县",
					"542323": "江孜县",
					"542324": "定日县",
					"542325": "萨迦县",
					"542326": "拉孜县",
					"542327": "昂仁县",
					"542328": "谢通门县",
					"542329": "白朗县",
					"542330": "仁布县",
					"542331": "康马县",
					"542332": "定结县",
					"542333": "仲巴县",
					"542334": "亚东县",
					"542335": "吉隆县",
					"542336": "聂拉木县",
					"542337": "萨嘎县",
					"542338": "岗巴县",
					"542339": "其它区",
					"542400": "那曲地区",
					"542421": "那曲县",
					"542422": "嘉黎县",
					"542423": "比如县",
					"542424": "聂荣县",
					"542425": "安多县",
					"542426": "申扎县",
					"542427": "索县",
					"542428": "班戈县",
					"542429": "巴青县",
					"542430": "尼玛县",
					"542431": "其它区",
					"542432": "双湖县",
					"542500": "阿里地区",
					"542521": "普兰县",
					"542522": "札达县",
					"542523": "噶尔县",
					"542524": "日土县",
					"542525": "革吉县",
					"542526": "改则县",
					"542527": "措勤县",
					"542528": "其它区",
					"542600": "林芝地区",
					"542621": "林芝县",
					"542622": "工布江达县",
					"542623": "米林县",
					"542624": "墨脱县",
					"542625": "波密县",
					"542626": "察隅县",
					"542627": "朗县",
					"542628": "其它区",
					"610000": "陕西省",
					"610100": "西安市",
					"610102": "新城区",
					"610103": "碑林区",
					"610104": "莲湖区",
					"610111": "灞桥区",
					"610112": "未央区",
					"610113": "雁塔区",
					"610114": "阎良区",
					"610115": "临潼区",
					"610116": "长安区",
					"610122": "蓝田县",
					"610124": "周至县",
					"610125": "户县",
					"610126": "高陵县",
					"610127": "其它区",
					"610200": "铜川市",
					"610202": "王益区",
					"610203": "印台区",
					"610204": "耀州区",
					"610222": "宜君县",
					"610223": "其它区",
					"610300": "宝鸡市",
					"610302": "渭滨区",
					"610303": "金台区",
					"610304": "陈仓区",
					"610322": "凤翔县",
					"610323": "岐山县",
					"610324": "扶风县",
					"610326": "眉县",
					"610327": "陇县",
					"610328": "千阳县",
					"610329": "麟游县",
					"610330": "凤县",
					"610331": "太白县",
					"610332": "其它区",
					"610400": "咸阳市",
					"610402": "秦都区",
					"610403": "杨陵区",
					"610404": "渭城区",
					"610422": "三原县",
					"610423": "泾阳县",
					"610424": "乾县",
					"610425": "礼泉县",
					"610426": "永寿县",
					"610427": "彬县",
					"610428": "长武县",
					"610429": "旬邑县",
					"610430": "淳化县",
					"610431": "武功县",
					"610481": "兴平市",
					"610482": "其它区",
					"610500": "渭南市",
					"610502": "临渭区",
					"610521": "华县",
					"610522": "潼关县",
					"610523": "大荔县",
					"610524": "合阳县",
					"610525": "澄城县",
					"610526": "蒲城县",
					"610527": "白水县",
					"610528": "富平县",
					"610581": "韩城市",
					"610582": "华阴市",
					"610583": "其它区",
					"610600": "延安市",
					"610602": "宝塔区",
					"610621": "延长县",
					"610622": "延川县",
					"610623": "子长县",
					"610624": "安塞县",
					"610625": "志丹县",
					"610626": "吴起县",
					"610627": "甘泉县",
					"610628": "富县",
					"610629": "洛川县",
					"610630": "宜川县",
					"610631": "黄龙县",
					"610632": "黄陵县",
					"610633": "其它区",
					"610700": "汉中市",
					"610702": "汉台区",
					"610721": "南郑县",
					"610722": "城固县",
					"610723": "洋县",
					"610724": "西乡县",
					"610725": "勉县",
					"610726": "宁强县",
					"610727": "略阳县",
					"610728": "镇巴县",
					"610729": "留坝县",
					"610730": "佛坪县",
					"610731": "其它区",
					"610800": "榆林市",
					"610802": "榆阳区",
					"610821": "神木县",
					"610822": "府谷县",
					"610823": "横山县",
					"610824": "靖边县",
					"610825": "定边县",
					"610826": "绥德县",
					"610827": "米脂县",
					"610828": "佳县",
					"610829": "吴堡县",
					"610830": "清涧县",
					"610831": "子洲县",
					"610832": "其它区",
					"610900": "安康市",
					"610902": "汉滨区",
					"610921": "汉阴县",
					"610922": "石泉县",
					"610923": "宁陕县",
					"610924": "紫阳县",
					"610925": "岚皋县",
					"610926": "平利县",
					"610927": "镇坪县",
					"610928": "旬阳县",
					"610929": "白河县",
					"610930": "其它区",
					"611000": "商洛市",
					"611002": "商州区",
					"611021": "洛南县",
					"611022": "丹凤县",
					"611023": "商南县",
					"611024": "山阳县",
					"611025": "镇安县",
					"611026": "柞水县",
					"611027": "其它区",
					"620000": "甘肃省",
					"620100": "兰州市",
					"620102": "城关区",
					"620103": "七里河区",
					"620104": "西固区",
					"620105": "安宁区",
					"620111": "红古区",
					"620121": "永登县",
					"620122": "皋兰县",
					"620123": "榆中县",
					"620124": "其它区",
					"620200": "嘉峪关市",
					"620300": "金昌市",
					"620302": "金川区",
					"620321": "永昌县",
					"620322": "其它区",
					"620400": "白银市",
					"620402": "白银区",
					"620403": "平川区",
					"620421": "靖远县",
					"620422": "会宁县",
					"620423": "景泰县",
					"620424": "其它区",
					"620500": "天水市",
					"620502": "秦州区",
					"620503": "麦积区",
					"620521": "清水县",
					"620522": "秦安县",
					"620523": "甘谷县",
					"620524": "武山县",
					"620525": "张家川回族自治县",
					"620526": "其它区",
					"620600": "武威市",
					"620602": "凉州区",
					"620621": "民勤县",
					"620622": "古浪县",
					"620623": "天祝藏族自治县",
					"620624": "其它区",
					"620700": "张掖市",
					"620702": "甘州区",
					"620721": "肃南裕固族自治县",
					"620722": "民乐县",
					"620723": "临泽县",
					"620724": "高台县",
					"620725": "山丹县",
					"620726": "其它区",
					"620800": "平凉市",
					"620802": "崆峒区",
					"620821": "泾川县",
					"620822": "灵台县",
					"620823": "崇信县",
					"620824": "华亭县",
					"620825": "庄浪县",
					"620826": "静宁县",
					"620827": "其它区",
					"620900": "酒泉市",
					"620902": "肃州区",
					"620921": "金塔县",
					"620922": "瓜州县",
					"620923": "肃北蒙古族自治县",
					"620924": "阿克塞哈萨克族自治县",
					"620981": "玉门市",
					"620982": "敦煌市",
					"620983": "其它区",
					"621000": "庆阳市",
					"621002": "西峰区",
					"621021": "庆城县",
					"621022": "环县",
					"621023": "华池县",
					"621024": "合水县",
					"621025": "正宁县",
					"621026": "宁县",
					"621027": "镇原县",
					"621028": "其它区",
					"621100": "定西市",
					"621102": "安定区",
					"621121": "通渭县",
					"621122": "陇西县",
					"621123": "渭源县",
					"621124": "临洮县",
					"621125": "漳县",
					"621126": "岷县",
					"621127": "其它区",
					"621200": "陇南市",
					"621202": "武都区",
					"621221": "成县",
					"621222": "文县",
					"621223": "宕昌县",
					"621224": "康县",
					"621225": "西和县",
					"621226": "礼县",
					"621227": "徽县",
					"621228": "两当县",
					"621229": "其它区",
					"622900": "临夏回族自治州",
					"622901": "临夏市",
					"622921": "临夏县",
					"622922": "康乐县",
					"622923": "永靖县",
					"622924": "广河县",
					"622925": "和政县",
					"622926": "东乡族自治县",
					"622927": "积石山保安族东乡族撒拉族自治县",
					"622928": "其它区",
					"623000": "甘南藏族自治州",
					"623001": "合作市",
					"623021": "临潭县",
					"623022": "卓尼县",
					"623023": "舟曲县",
					"623024": "迭部县",
					"623025": "玛曲县",
					"623026": "碌曲县",
					"623027": "夏河县",
					"623028": "其它区",
					"630000": "青海省",
					"630100": "西宁市",
					"630102": "城东区",
					"630103": "城中区",
					"630104": "城西区",
					"630105": "城北区",
					"630121": "大通回族土族自治县",
					"630122": "湟中县",
					"630123": "湟源县",
					"630124": "其它区",
					"632100": "海东市",
					"632121": "平安县",
					"632122": "民和回族土族自治县",
					"632123": "乐都区",
					"632126": "互助土族自治县",
					"632127": "化隆回族自治县",
					"632128": "循化撒拉族自治县",
					"632129": "其它区",
					"632200": "海北藏族自治州",
					"632221": "门源回族自治县",
					"632222": "祁连县",
					"632223": "海晏县",
					"632224": "刚察县",
					"632225": "其它区",
					"632300": "黄南藏族自治州",
					"632321": "同仁县",
					"632322": "尖扎县",
					"632323": "泽库县",
					"632324": "河南蒙古族自治县",
					"632325": "其它区",
					"632500": "海南藏族自治州",
					"632521": "共和县",
					"632522": "同德县",
					"632523": "贵德县",
					"632524": "兴海县",
					"632525": "贵南县",
					"632526": "其它区",
					"632600": "果洛藏族自治州",
					"632621": "玛沁县",
					"632622": "班玛县",
					"632623": "甘德县",
					"632624": "达日县",
					"632625": "久治县",
					"632626": "玛多县",
					"632627": "其它区",
					"632700": "玉树藏族自治州",
					"632721": "玉树市",
					"632722": "杂多县",
					"632723": "称多县",
					"632724": "治多县",
					"632725": "囊谦县",
					"632726": "曲麻莱县",
					"632727": "其它区",
					"632800": "海西蒙古族藏族自治州",
					"632801": "格尔木市",
					"632802": "德令哈市",
					"632821": "乌兰县",
					"632822": "都兰县",
					"632823": "天峻县",
					"632824": "其它区",
					"640000": "宁夏回族自治区",
					"640100": "银川市",
					"640104": "兴庆区",
					"640105": "西夏区",
					"640106": "金凤区",
					"640121": "永宁县",
					"640122": "贺兰县",
					"640181": "灵武市",
					"640182": "其它区",
					"640200": "石嘴山市",
					"640202": "大武口区",
					"640205": "惠农区",
					"640221": "平罗县",
					"640222": "其它区",
					"640300": "吴忠市",
					"640302": "利通区",
					"640303": "红寺堡区",
					"640323": "盐池县",
					"640324": "同心县",
					"640381": "青铜峡市",
					"640382": "其它区",
					"640400": "固原市",
					"640402": "原州区",
					"640422": "西吉县",
					"640423": "隆德县",
					"640424": "泾源县",
					"640425": "彭阳县",
					"640426": "其它区",
					"640500": "中卫市",
					"640502": "沙坡头区",
					"640521": "中宁县",
					"640522": "海原县",
					"640523": "其它区",
					"650000": "新疆维吾尔自治区",
					"650100": "乌鲁木齐市",
					"650102": "天山区",
					"650103": "沙依巴克区",
					"650104": "新市区",
					"650105": "水磨沟区",
					"650106": "头屯河区",
					"650107": "达坂城区",
					"650109": "米东区",
					"650121": "乌鲁木齐县",
					"650122": "其它区",
					"650200": "克拉玛依市",
					"650202": "独山子区",
					"650203": "克拉玛依区",
					"650204": "白碱滩区",
					"650205": "乌尔禾区",
					"650206": "其它区",
					"652100": "吐鲁番地区",
					"652101": "吐鲁番市",
					"652122": "鄯善县",
					"652123": "托克逊县",
					"652124": "其它区",
					"652200": "哈密地区",
					"652201": "哈密市",
					"652222": "巴里坤哈萨克自治县",
					"652223": "伊吾县",
					"652224": "其它区",
					"652300": "昌吉回族自治州",
					"652301": "昌吉市",
					"652302": "阜康市",
					"652323": "呼图壁县",
					"652324": "玛纳斯县",
					"652325": "奇台县",
					"652327": "吉木萨尔县",
					"652328": "木垒哈萨克自治县",
					"652329": "其它区",
					"652700": "博尔塔拉蒙古自治州",
					"652701": "博乐市",
					"652702": "阿拉山口市",
					"652722": "精河县",
					"652723": "温泉县",
					"652724": "其它区",
					"652800": "巴音郭楞蒙古自治州",
					"652801": "库尔勒市",
					"652822": "轮台县",
					"652823": "尉犁县",
					"652824": "若羌县",
					"652825": "且末县",
					"652826": "焉耆回族自治县",
					"652827": "和静县",
					"652828": "和硕县",
					"652829": "博湖县",
					"652830": "其它区",
					"652900": "阿克苏地区",
					"652901": "阿克苏市",
					"652922": "温宿县",
					"652923": "库车县",
					"652924": "沙雅县",
					"652925": "新和县",
					"652926": "拜城县",
					"652927": "乌什县",
					"652928": "阿瓦提县",
					"652929": "柯坪县",
					"652930": "其它区",
					"653000": "克孜勒苏柯尔克孜自治州",
					"653001": "阿图什市",
					"653022": "阿克陶县",
					"653023": "阿合奇县",
					"653024": "乌恰县",
					"653025": "其它区",
					"653100": "喀什地区",
					"653101": "喀什市",
					"653121": "疏附县",
					"653122": "疏勒县",
					"653123": "英吉沙县",
					"653124": "泽普县",
					"653125": "莎车县",
					"653126": "叶城县",
					"653127": "麦盖提县",
					"653128": "岳普湖县",
					"653129": "伽师县",
					"653130": "巴楚县",
					"653131": "塔什库尔干塔吉克自治县",
					"653132": "其它区",
					"653200": "和田地区",
					"653201": "和田市",
					"653221": "和田县",
					"653222": "墨玉县",
					"653223": "皮山县",
					"653224": "洛浦县",
					"653225": "策勒县",
					"653226": "于田县",
					"653227": "民丰县",
					"653228": "其它区",
					"654000": "伊犁哈萨克自治州",
					"654002": "伊宁市",
					"654003": "奎屯市",
					"654021": "伊宁县",
					"654022": "察布查尔锡伯自治县",
					"654023": "霍城县",
					"654024": "巩留县",
					"654025": "新源县",
					"654026": "昭苏县",
					"654027": "特克斯县",
					"654028": "尼勒克县",
					"654029": "其它区",
					"654200": "塔城地区",
					"654201": "塔城市",
					"654202": "乌苏市",
					"654221": "额敏县",
					"654223": "沙湾县",
					"654224": "托里县",
					"654225": "裕民县",
					"654226": "和布克赛尔蒙古自治县",
					"654227": "其它区",
					"654300": "阿勒泰地区",
					"654301": "阿勒泰市",
					"654321": "布尔津县",
					"654322": "富蕴县",
					"654323": "福海县",
					"654324": "哈巴河县",
					"654325": "青河县",
					"654326": "吉木乃县",
					"654327": "其它区",
					"659001": "石河子市",
					"659002": "阿拉尔市",
					"659003": "图木舒克市",
					"659004": "五家渠市",
					"710000": "台湾",
					"710100": "台北市",
					"710101": "中正区",
					"710102": "大同区",
					"710103": "中山区",
					"710104": "松山区",
					"710105": "大安区",
					"710106": "万华区",
					"710107": "信义区",
					"710108": "士林区",
					"710109": "北投区",
					"710110": "内湖区",
					"710111": "南港区",
					"710112": "文山区",
					"710113": "其它区",
					"710200": "高雄市",
					"710201": "新兴区",
					"710202": "前金区",
					"710203": "芩雅区",
					"710204": "盐埕区",
					"710205": "鼓山区",
					"710206": "旗津区",
					"710207": "前镇区",
					"710208": "三民区",
					"710209": "左营区",
					"710210": "楠梓区",
					"710211": "小港区",
					"710212": "其它区",
					"710241": "苓雅区",
					"710242": "仁武区",
					"710243": "大社区",
					"710244": "冈山区",
					"710245": "路竹区",
					"710246": "阿莲区",
					"710247": "田寮区",
					"710248": "燕巢区",
					"710249": "桥头区",
					"710250": "梓官区",
					"710251": "弥陀区",
					"710252": "永安区",
					"710253": "湖内区",
					"710254": "凤山区",
					"710255": "大寮区",
					"710256": "林园区",
					"710257": "鸟松区",
					"710258": "大树区",
					"710259": "旗山区",
					"710260": "美浓区",
					"710261": "六龟区",
					"710262": "内门区",
					"710263": "杉林区",
					"710264": "甲仙区",
					"710265": "桃源区",
					"710266": "那玛夏区",
					"710267": "茂林区",
					"710268": "茄萣区",
					"710300": "台南市",
					"710301": "中西区",
					"710302": "东区",
					"710303": "南区",
					"710304": "北区",
					"710305": "安平区",
					"710306": "安南区",
					"710307": "其它区",
					"710339": "永康区",
					"710340": "归仁区",
					"710341": "新化区",
					"710342": "左镇区",
					"710343": "玉井区",
					"710344": "楠西区",
					"710345": "南化区",
					"710346": "仁德区",
					"710347": "关庙区",
					"710348": "龙崎区",
					"710349": "官田区",
					"710350": "麻豆区",
					"710351": "佳里区",
					"710352": "西港区",
					"710353": "七股区",
					"710354": "将军区",
					"710355": "学甲区",
					"710356": "北门区",
					"710357": "新营区",
					"710358": "后壁区",
					"710359": "白河区",
					"710360": "东山区",
					"710361": "六甲区",
					"710362": "下营区",
					"710363": "柳营区",
					"710364": "盐水区",
					"710365": "善化区",
					"710366": "大内区",
					"710367": "山上区",
					"710368": "新市区",
					"710369": "安定区",
					"710400": "台中市",
					"710401": "中区",
					"710402": "东区",
					"710403": "南区",
					"710404": "西区",
					"710405": "北区",
					"710406": "北屯区",
					"710407": "西屯区",
					"710408": "南屯区",
					"710409": "其它区",
					"710431": "太平区",
					"710432": "大里区",
					"710433": "雾峰区",
					"710434": "乌日区",
					"710435": "丰原区",
					"710436": "后里区",
					"710437": "石冈区",
					"710438": "东势区",
					"710439": "和平区",
					"710440": "新社区",
					"710441": "潭子区",
					"710442": "大雅区",
					"710443": "神冈区",
					"710444": "大肚区",
					"710445": "沙鹿区",
					"710446": "龙井区",
					"710447": "梧栖区",
					"710448": "清水区",
					"710449": "大甲区",
					"710450": "外埔区",
					"710451": "大安区",
					"710500": "金门县",
					"710507": "金沙镇",
					"710508": "金湖镇",
					"710509": "金宁乡",
					"710510": "金城镇",
					"710511": "烈屿乡",
					"710512": "乌坵乡",
					"710600": "南投县",
					"710614": "南投市",
					"710615": "中寮乡",
					"710616": "草屯镇",
					"710617": "国姓乡",
					"710618": "埔里镇",
					"710619": "仁爱乡",
					"710620": "名间乡",
					"710621": "集集镇",
					"710622": "水里乡",
					"710623": "鱼池乡",
					"710624": "信义乡",
					"710625": "竹山镇",
					"710626": "鹿谷乡",
					"710700": "基隆市",
					"710701": "仁爱区",
					"710702": "信义区",
					"710703": "中正区",
					"710704": "中山区",
					"710705": "安乐区",
					"710706": "暖暖区",
					"710707": "七堵区",
					"710708": "其它区",
					"710800": "新竹市",
					"710801": "东区",
					"710802": "北区",
					"710803": "香山区",
					"710804": "其它区",
					"710900": "嘉义市",
					"710901": "东区",
					"710902": "西区",
					"710903": "其它区",
					"711100": "新北市",
					"711130": "万里区",
					"711131": "金山区",
					"711132": "板桥区",
					"711133": "汐止区",
					"711134": "深坑区",
					"711135": "石碇区",
					"711136": "瑞芳区",
					"711137": "平溪区",
					"711138": "双溪区",
					"711139": "贡寮区",
					"711140": "新店区",
					"711141": "坪林区",
					"711142": "乌来区",
					"711143": "永和区",
					"711144": "中和区",
					"711145": "土城区",
					"711146": "三峡区",
					"711147": "树林区",
					"711148": "莺歌区",
					"711149": "三重区",
					"711150": "新庄区",
					"711151": "泰山区",
					"711152": "林口区",
					"711153": "芦洲区",
					"711154": "五股区",
					"711155": "八里区",
					"711156": "淡水区",
					"711157": "三芝区",
					"711158": "石门区",
					"711200": "宜兰县",
					"711214": "宜兰市",
					"711215": "头城镇",
					"711216": "礁溪乡",
					"711217": "壮围乡",
					"711218": "员山乡",
					"711219": "罗东镇",
					"711220": "三星乡",
					"711221": "大同乡",
					"711222": "五结乡",
					"711223": "冬山乡",
					"711224": "苏澳镇",
					"711225": "南澳乡",
					"711226": "钓鱼台",
					"711300": "新竹县",
					"711314": "竹北市",
					"711315": "湖口乡",
					"711316": "新丰乡",
					"711317": "新埔镇",
					"711318": "关西镇",
					"711319": "芎林乡",
					"711320": "宝山乡",
					"711321": "竹东镇",
					"711322": "五峰乡",
					"711323": "横山乡",
					"711324": "尖石乡",
					"711325": "北埔乡",
					"711326": "峨眉乡",
					"711400": "桃园县",
					"711414": "中坜市",
					"711415": "平镇市",
					"711416": "龙潭乡",
					"711417": "杨梅市",
					"711418": "新屋乡",
					"711419": "观音乡",
					"711420": "桃园市",
					"711421": "龟山乡",
					"711422": "八德市",
					"711423": "大溪镇",
					"711424": "复兴乡",
					"711425": "大园乡",
					"711426": "芦竹乡",
					"711500": "苗栗县",
					"711519": "竹南镇",
					"711520": "头份镇",
					"711521": "三湾乡",
					"711522": "南庄乡",
					"711523": "狮潭乡",
					"711524": "后龙镇",
					"711525": "通霄镇",
					"711526": "苑里镇",
					"711527": "苗栗市",
					"711528": "造桥乡",
					"711529": "头屋乡",
					"711530": "公馆乡",
					"711531": "大湖乡",
					"711532": "泰安乡",
					"711533": "铜锣乡",
					"711534": "三义乡",
					"711535": "西湖乡",
					"711536": "卓兰镇",
					"711700": "彰化县",
					"711727": "彰化市",
					"711728": "芬园乡",
					"711729": "花坛乡",
					"711730": "秀水乡",
					"711731": "鹿港镇",
					"711732": "福兴乡",
					"711733": "线西乡",
					"711734": "和美镇",
					"711735": "伸港乡",
					"711736": "员林镇",
					"711737": "社头乡",
					"711738": "永靖乡",
					"711739": "埔心乡",
					"711740": "溪湖镇",
					"711741": "大村乡",
					"711742": "埔盐乡",
					"711743": "田中镇",
					"711744": "北斗镇",
					"711745": "田尾乡",
					"711746": "埤头乡",
					"711747": "溪州乡",
					"711748": "竹塘乡",
					"711749": "二林镇",
					"711750": "大城乡",
					"711751": "芳苑乡",
					"711752": "二水乡",
					"711900": "嘉义县",
					"711919": "番路乡",
					"711920": "梅山乡",
					"711921": "竹崎乡",
					"711922": "阿里山乡",
					"711923": "中埔乡",
					"711924": "大埔乡",
					"711925": "水上乡",
					"711926": "鹿草乡",
					"711927": "太保市",
					"711928": "朴子市",
					"711929": "东石乡",
					"711930": "六脚乡",
					"711931": "新港乡",
					"711932": "民雄乡",
					"711933": "大林镇",
					"711934": "溪口乡",
					"711935": "义竹乡",
					"711936": "布袋镇",
					"712100": "云林县",
					"712121": "斗南镇",
					"712122": "大埤乡",
					"712123": "虎尾镇",
					"712124": "土库镇",
					"712125": "褒忠乡",
					"712126": "东势乡",
					"712127": "台西乡",
					"712128": "仑背乡",
					"712129": "麦寮乡",
					"712130": "斗六市",
					"712131": "林内乡",
					"712132": "古坑乡",
					"712133": "莿桐乡",
					"712134": "西螺镇",
					"712135": "二仑乡",
					"712136": "北港镇",
					"712137": "水林乡",
					"712138": "口湖乡",
					"712139": "四湖乡",
					"712140": "元长乡",
					"712400": "屏东县",
					"712434": "屏东市",
					"712435": "三地门乡",
					"712436": "雾台乡",
					"712437": "玛家乡",
					"712438": "九如乡",
					"712439": "里港乡",
					"712440": "高树乡",
					"712441": "盐埔乡",
					"712442": "长治乡",
					"712443": "麟洛乡",
					"712444": "竹田乡",
					"712445": "内埔乡",
					"712446": "万丹乡",
					"712447": "潮州镇",
					"712448": "泰武乡",
					"712449": "来义乡",
					"712450": "万峦乡",
					"712451": "崁顶乡",
					"712452": "新埤乡",
					"712453": "南州乡",
					"712454": "林边乡",
					"712455": "东港镇",
					"712456": "琉球乡",
					"712457": "佳冬乡",
					"712458": "新园乡",
					"712459": "枋寮乡",
					"712460": "枋山乡",
					"712461": "春日乡",
					"712462": "狮子乡",
					"712463": "车城乡",
					"712464": "牡丹乡",
					"712465": "恒春镇",
					"712466": "满州乡",
					"712500": "台东县",
					"712517": "台东市",
					"712518": "绿岛乡",
					"712519": "兰屿乡",
					"712520": "延平乡",
					"712521": "卑南乡",
					"712522": "鹿野乡",
					"712523": "关山镇",
					"712524": "海端乡",
					"712525": "池上乡",
					"712526": "东河乡",
					"712527": "成功镇",
					"712528": "长滨乡",
					"712529": "金峰乡",
					"712530": "大武乡",
					"712531": "达仁乡",
					"712532": "太麻里乡",
					"712600": "花莲县",
					"712615": "花莲市",
					"712616": "新城乡",
					"712617": "太鲁阁",
					"712618": "秀林乡",
					"712619": "吉安乡",
					"712620": "寿丰乡",
					"712621": "凤林镇",
					"712622": "光复乡",
					"712623": "丰滨乡",
					"712624": "瑞穗乡",
					"712625": "万荣乡",
					"712626": "玉里镇",
					"712627": "卓溪乡",
					"712628": "富里乡",
					"712700": "澎湖县",
					"712707": "马公市",
					"712708": "西屿乡",
					"712709": "望安乡",
					"712710": "七美乡",
					"712711": "白沙乡",
					"712712": "湖西乡",
					"712800": "连江县",
					"712805": "南竿乡",
					"712806": "北竿乡",
					"712807": "莒光乡",
					"712808": "东引乡",
					"810000": "香港特别行政区",
					"810100": "香港岛",
					"810101": "中西区",
					"810102": "湾仔",
					"810103": "东区",
					"810104": "南区",
					"810200": "九龙",
					"810201": "九龙城区",
					"810202": "油尖旺区",
					"810203": "深水埗区",
					"810204": "黄大仙区",
					"810205": "观塘区",
					"810300": "新界",
					"810301": "北区",
					"810302": "大埔区",
					"810303": "沙田区",
					"810304": "西贡区",
					"810305": "元朗区",
					"810306": "屯门区",
					"810307": "荃湾区",
					"810308": "葵青区",
					"810309": "离岛区",
					"820000": "澳门特别行政区",
					"820100": "澳门半岛",
					"820200": "离岛",
					"990000": "海外",
					"990100": "海外"
				};

				// id pid/parentId name children
				function tree(list) {
					var mapped = {};
					for (var i = 0, item; i < list.length; i++) {
						item = list[i];
						if (!item || !item.id) continue;
						mapped[item.id] = item;
					}

					var result = [];
					for (var ii = 0; ii < list.length; ii++) {
						item = list[ii];

						if (!item) continue;
						/* jshint -W041 */
						if (item.pid == undefined && item.parentId == undefined) {
							result.push(item);
							continue;
						}
						var parent = mapped[item.pid] || mapped[item.parentId];
						if (!parent) continue;
						if (!parent.children) parent.children = [];
						parent.children.push(item);
					}
					return result;
				}

				var DICT_FIXED = function () {
					var fixed = [];
					for (var id in DICT) {
						var pid = id.slice(2, 6) === '0000' ? undefined : id.slice(4, 6) == '00' ? id.slice(0, 2) + '0000' : id.slice(0, 4) + '00';
						fixed.push({
							id: id,
							pid: pid,
							name: DICT[id]
						});
					}
					return tree(fixed);
				}();

				module.exports = DICT_FIXED;

				/***/
			},
			/* 19 */
			/***/function (module, exports, __webpack_require__) {

				/*
	       ## Miscellaneous
	   */
				var DICT = __webpack_require__(18);
				module.exports = {
					// Dice
					d4: function d4() {
						return this.natural(1, 4);
					},
					d6: function d6() {
						return this.natural(1, 6);
					},
					d8: function d8() {
						return this.natural(1, 8);
					},
					d12: function d12() {
						return this.natural(1, 12);
					},
					d20: function d20() {
						return this.natural(1, 20);
					},
					d100: function d100() {
						return this.natural(1, 100);
					},
					/*
	        随机生成一个 GUID。
	    	    http://www.broofa.com/2008/09/javascript-uuid-function/
	        [UUID 规范](http://www.ietf.org/rfc/rfc4122.txt)
	            UUIDs (Universally Unique IDentifier)
	            GUIDs (Globally Unique IDentifier)
	            The formal definition of the UUID string representation is provided by the following ABNF [7]:
	                UUID                   = time-low "-" time-mid "-"
	                                       time-high-and-version "-"
	                                       clock-seq-and-reserved
	                                       clock-seq-low "-" node
	                time-low               = 4hexOctet
	                time-mid               = 2hexOctet
	                time-high-and-version  = 2hexOctet
	                clock-seq-and-reserved = hexOctet
	                clock-seq-low          = hexOctet
	                node                   = 6hexOctet
	                hexOctet               = hexDigit hexDigit
	                hexDigit =
	                    "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
	                    "a" / "b" / "c" / "d" / "e" / "f" /
	                    "A" / "B" / "C" / "D" / "E" / "F"
	        
	        https://github.com/victorquinn/chancejs/blob/develop/chance.js#L1349
	    */
					guid: function guid() {
						var pool = "abcdefABCDEF1234567890",
						    guid = this.string(pool, 8) + '-' + this.string(pool, 4) + '-' + this.string(pool, 4) + '-' + this.string(pool, 4) + '-' + this.string(pool, 12);
						return guid;
					},
					uuid: function uuid() {
						return this.guid();
					},
					/*
	        随机生成一个 18 位身份证。
	    	    [身份证](http://baike.baidu.com/view/1697.htm#4)
	            地址码 6 + 出生日期码 8 + 顺序码 3 + 校验码 1
	        [《中华人民共和国行政区划代码》国家标准(GB/T2260)](http://zhidao.baidu.com/question/1954561.html)
	    */
					id: function id() {
						var id,
						    sum = 0,
						    rank = ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"],
						    last = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

						id = this.pick(DICT).id + this.date('yyyyMMdd') + this.string('number', 3);

						for (var i = 0; i < id.length; i++) {
							sum += id[i] * rank[i];
						}
						id += last[sum % 11];

						return id;
					},

					/*
	        生成一个全局的自增整数。
	        类似自增主键（auto increment primary key）。
	    */
					increment: function () {
						var key = 0;
						return function (step) {
							return key += +step || 1; // step?
						};
					}(),
					inc: function inc(step) {
						return this.increment(step);
					}
				};

				/***/
			},
			/* 20 */
			/***/function (module, exports, __webpack_require__) {

				var Parser = __webpack_require__(21);
				var Handler = __webpack_require__(22);
				module.exports = {
					Parser: Parser,
					Handler: Handler
				};

				/***/
			},
			/* 21 */
			/***/function (module, exports) {

				// https://github.com/nuysoft/regexp
				// forked from https://github.com/ForbesLindesay/regexp

				function parse(n) {
					if ("string" != typeof n) {
						var l = new TypeError("The regexp to parse must be represented as a string.");
						throw l;
					}
					return index = 1, cgs = {}, parser.parse(n);
				}

				function Token(n) {
					this.type = n, this.offset = Token.offset(), this.text = Token.text();
				}

				function Alternate(n, l) {
					Token.call(this, "alternate"), this.left = n, this.right = l;
				}

				function Match(n) {
					Token.call(this, "match"), this.body = n.filter(Boolean);
				}

				function Group(n, l) {
					Token.call(this, n), this.body = l;
				}

				function CaptureGroup(n) {
					Group.call(this, "capture-group"), this.index = cgs[this.offset] || (cgs[this.offset] = index++), this.body = n;
				}

				function Quantified(n, l) {
					Token.call(this, "quantified"), this.body = n, this.quantifier = l;
				}

				function Quantifier(n, l) {
					Token.call(this, "quantifier"), this.min = n, this.max = l, this.greedy = !0;
				}

				function CharSet(n, l) {
					Token.call(this, "charset"), this.invert = n, this.body = l;
				}

				function CharacterRange(n, l) {
					Token.call(this, "range"), this.start = n, this.end = l;
				}

				function Literal(n) {
					Token.call(this, "literal"), this.body = n, this.escaped = this.body != this.text;
				}

				function Unicode(n) {
					Token.call(this, "unicode"), this.code = n.toUpperCase();
				}

				function Hex(n) {
					Token.call(this, "hex"), this.code = n.toUpperCase();
				}

				function Octal(n) {
					Token.call(this, "octal"), this.code = n.toUpperCase();
				}

				function BackReference(n) {
					Token.call(this, "back-reference"), this.code = n.toUpperCase();
				}

				function ControlCharacter(n) {
					Token.call(this, "control-character"), this.code = n.toUpperCase();
				}

				var parser = function () {
					function n(n, l) {
						function u() {
							this.constructor = n;
						}
						u.prototype = l.prototype, n.prototype = new u();
					}
					function l(n, l, u, t, r) {
						function e(n, l) {
							function u(n) {
								function l(n) {
									return n.charCodeAt(0).toString(16).toUpperCase();
								}
								return n.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (n) {
									return "\\x0" + l(n);
								}).replace(/[\x10-\x1F\x80-\xFF]/g, function (n) {
									return "\\x" + l(n);
								}).replace(/[\u0180-\u0FFF]/g, function (n) {
									return '\\u0' + l(n);
								}).replace(/[\u1080-\uFFFF]/g, function (n) {
									return '\\u' + l(n);
								});
							}
							var t, r;
							switch (n.length) {
								case 0:
									t = "end of input";
									break;

								case 1:
									t = n[0];
									break;

								default:
									t = n.slice(0, -1).join(", ") + " or " + n[n.length - 1];
							}
							return r = l ? '"' + u(l) + '"' : "end of input", "Expected " + t + " but " + r + " found.";
						}
						this.expected = n, this.found = l, this.offset = u, this.line = t, this.column = r, this.name = "SyntaxError", this.message = e(n, l);
					}
					function u(n) {
						function u() {
							return n.substring(Lt, qt);
						}
						function t() {
							return Lt;
						}
						function r(l) {
							function u(l, u, t) {
								var r, e;
								for (r = u; t > r; r++) {
									e = n.charAt(r), "\n" === e ? (l.seenCR || l.line++, l.column = 1, l.seenCR = !1) : "\r" === e || '\u2028' === e || '\u2029' === e ? (l.line++, l.column = 1, l.seenCR = !0) : (l.column++, l.seenCR = !1);
								}
							}
							return Mt !== l && (Mt > l && (Mt = 0, Dt = {
								line: 1,
								column: 1,
								seenCR: !1
							}), u(Dt, Mt, l), Mt = l), Dt;
						}
						function e(n) {
							Ht > qt || (qt > Ht && (Ht = qt, Ot = []), Ot.push(n));
						}
						function o(n) {
							var l = 0;
							for (n.sort(); l < n.length;) {
								n[l - 1] === n[l] ? n.splice(l, 1) : l++;
							}
						}
						function c() {
							var l, u, t, r, o;
							return l = qt, u = i(), null !== u ? (t = qt, 124 === n.charCodeAt(qt) ? (r = fl, qt++) : (r = null, 0 === Wt && e(sl)), null !== r ? (o = c(), null !== o ? (r = [r, o], t = r) : (qt = t, t = il)) : (qt = t, t = il), null === t && (t = al), null !== t ? (Lt = l, u = hl(u, t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il), l;
						}
						function i() {
							var n, l, u, t, r;
							if (n = qt, l = f(), null === l && (l = al), null !== l) {
								if (u = qt, Wt++, t = d(), Wt--, null === t ? u = al : (qt = u, u = il), null !== u) {
									for (t = [], r = h(), null === r && (r = a()); null !== r;) {
										t.push(r), r = h(), null === r && (r = a());
									}null !== t ? (r = s(), null === r && (r = al), null !== r ? (Lt = n, l = dl(l, t, r), null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il);
								} else qt = n, n = il;
							} else qt = n, n = il;
							return n;
						}
						function a() {
							var n;
							return n = x(), null === n && (n = Q(), null === n && (n = B())), n;
						}
						function f() {
							var l, u;
							return l = qt, 94 === n.charCodeAt(qt) ? (u = pl, qt++) : (u = null, 0 === Wt && e(vl)), null !== u && (Lt = l, u = wl()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function s() {
							var l, u;
							return l = qt, 36 === n.charCodeAt(qt) ? (u = Al, qt++) : (u = null, 0 === Wt && e(Cl)), null !== u && (Lt = l, u = gl()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function h() {
							var n, l, u;
							return n = qt, l = a(), null !== l ? (u = d(), null !== u ? (Lt = n, l = bl(l, u), null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il), n;
						}
						function d() {
							var n, l, u;
							return Wt++, n = qt, l = p(), null !== l ? (u = k(), null === u && (u = al), null !== u ? (Lt = n, l = Tl(l, u), null === l ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il), Wt--, null === n && (l = null, 0 === Wt && e(kl)), n;
						}
						function p() {
							var n;
							return n = v(), null === n && (n = w(), null === n && (n = A(), null === n && (n = C(), null === n && (n = g(), null === n && (n = b()))))), n;
						}
						function v() {
							var l, u, t, r, o, c;
							return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), null !== u ? (t = T(), null !== t ? (44 === n.charCodeAt(qt) ? (r = ml, qt++) : (r = null, 0 === Wt && e(Rl)), null !== r ? (o = T(), null !== o ? (125 === n.charCodeAt(qt) ? (c = Fl, qt++) : (c = null, 0 === Wt && e(Ql)), null !== c ? (Lt = l, u = Sl(t, o), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
						}
						function w() {
							var l, u, t, r;
							return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), null !== u ? (t = T(), null !== t ? (n.substr(qt, 2) === Ul ? (r = Ul, qt += 2) : (r = null, 0 === Wt && e(El)), null !== r ? (Lt = l, u = Gl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
						}
						function A() {
							var l, u, t, r;
							return l = qt, 123 === n.charCodeAt(qt) ? (u = xl, qt++) : (u = null, 0 === Wt && e(yl)), null !== u ? (t = T(), null !== t ? (125 === n.charCodeAt(qt) ? (r = Fl, qt++) : (r = null, 0 === Wt && e(Ql)), null !== r ? (Lt = l, u = Bl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
						}
						function C() {
							var l, u;
							return l = qt, 43 === n.charCodeAt(qt) ? (u = jl, qt++) : (u = null, 0 === Wt && e($l)), null !== u && (Lt = l, u = ql()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function g() {
							var l, u;
							return l = qt, 42 === n.charCodeAt(qt) ? (u = Ll, qt++) : (u = null, 0 === Wt && e(Ml)), null !== u && (Lt = l, u = Dl()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function b() {
							var l, u;
							return l = qt, 63 === n.charCodeAt(qt) ? (u = Hl, qt++) : (u = null, 0 === Wt && e(Ol)), null !== u && (Lt = l, u = Wl()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function k() {
							var l;
							return 63 === n.charCodeAt(qt) ? (l = Hl, qt++) : (l = null, 0 === Wt && e(Ol)), l;
						}
						function T() {
							var l, u, t;
							if (l = qt, u = [], zl.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(Il)), null !== t) for (; null !== t;) {
								u.push(t), zl.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(Il));
							} else u = il;
							return null !== u && (Lt = l, u = Jl(u)), null === u ? (qt = l, l = u) : l = u, l;
						}
						function x() {
							var l, u, t, r;
							return l = qt, 40 === n.charCodeAt(qt) ? (u = Kl, qt++) : (u = null, 0 === Wt && e(Nl)), null !== u ? (t = R(), null === t && (t = F(), null === t && (t = m(), null === t && (t = y()))), null !== t ? (41 === n.charCodeAt(qt) ? (r = Pl, qt++) : (r = null, 0 === Wt && e(Vl)), null !== r ? (Lt = l, u = Xl(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il), l;
						}
						function y() {
							var n, l;
							return n = qt, l = c(), null !== l && (Lt = n, l = Yl(l)), null === l ? (qt = n, n = l) : n = l, n;
						}
						function m() {
							var l, u, t;
							return l = qt, n.substr(qt, 2) === Zl ? (u = Zl, qt += 2) : (u = null, 0 === Wt && e(_l)), null !== u ? (t = c(), null !== t ? (Lt = l, u = nu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il), l;
						}
						function R() {
							var l, u, t;
							return l = qt, n.substr(qt, 2) === lu ? (u = lu, qt += 2) : (u = null, 0 === Wt && e(uu)), null !== u ? (t = c(), null !== t ? (Lt = l, u = tu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il), l;
						}
						function F() {
							var l, u, t;
							return l = qt, n.substr(qt, 2) === ru ? (u = ru, qt += 2) : (u = null, 0 === Wt && e(eu)), null !== u ? (t = c(), null !== t ? (Lt = l, u = ou(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il), l;
						}
						function Q() {
							var l, u, t, r, o;
							if (Wt++, l = qt, 91 === n.charCodeAt(qt) ? (u = iu, qt++) : (u = null, 0 === Wt && e(au)), null !== u) {
								if (94 === n.charCodeAt(qt) ? (t = pl, qt++) : (t = null, 0 === Wt && e(vl)), null === t && (t = al), null !== t) {
									for (r = [], o = S(), null === o && (o = U()); null !== o;) {
										r.push(o), o = S(), null === o && (o = U());
									}null !== r ? (93 === n.charCodeAt(qt) ? (o = fu, qt++) : (o = null, 0 === Wt && e(su)), null !== o ? (Lt = l, u = hu(t, r), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il);
								} else qt = l, l = il;
							} else qt = l, l = il;
							return Wt--, null === l && (u = null, 0 === Wt && e(cu)), l;
						}
						function S() {
							var l, u, t, r;
							return Wt++, l = qt, u = U(), null !== u ? (45 === n.charCodeAt(qt) ? (t = pu, qt++) : (t = null, 0 === Wt && e(vu)), null !== t ? (r = U(), null !== r ? (Lt = l, u = wu(u, r), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il), Wt--, null === l && (u = null, 0 === Wt && e(du)), l;
						}
						function U() {
							var n, l;
							return Wt++, n = G(), null === n && (n = E()), Wt--, null === n && (l = null, 0 === Wt && e(Au)), n;
						}
						function E() {
							var l, u;
							return l = qt, Cu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null, 0 === Wt && e(gu)), null !== u && (Lt = l, u = bu(u)), null === u ? (qt = l, l = u) : l = u, l;
						}
						function G() {
							var n;
							return n = L(), null === n && (n = Y(), null === n && (n = H(), null === n && (n = O(), null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), null === n && (n = J(), null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), null === n && (n = V(), null === n && (n = X(), null === n && (n = _(), null === n && (n = nl(), null === n && (n = ll(), null === n && (n = ul(), null === n && (n = tl()))))))))))))))))), n;
						}
						function B() {
							var n;
							return n = j(), null === n && (n = q(), null === n && (n = $())), n;
						}
						function j() {
							var l, u;
							return l = qt, 46 === n.charCodeAt(qt) ? (u = ku, qt++) : (u = null, 0 === Wt && e(Tu)), null !== u && (Lt = l, u = xu()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function $() {
							var l, u;
							return Wt++, l = qt, mu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null, 0 === Wt && e(Ru)), null !== u && (Lt = l, u = bu(u)), null === u ? (qt = l, l = u) : l = u, Wt--, null === l && (u = null, 0 === Wt && e(yu)), l;
						}
						function q() {
							var n;
							return n = M(), null === n && (n = D(), null === n && (n = Y(), null === n && (n = H(), null === n && (n = O(), null === n && (n = W(), null === n && (n = z(), null === n && (n = I(), null === n && (n = J(), null === n && (n = K(), null === n && (n = N(), null === n && (n = P(), null === n && (n = V(), null === n && (n = X(), null === n && (n = Z(), null === n && (n = _(), null === n && (n = nl(), null === n && (n = ll(), null === n && (n = ul(), null === n && (n = tl()))))))))))))))))))), n;
						}
						function L() {
							var l, u;
							return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, 0 === Wt && e(Qu)), null !== u && (Lt = l, u = Su()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function M() {
							var l, u;
							return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, 0 === Wt && e(Qu)), null !== u && (Lt = l, u = Uu()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function D() {
							var l, u;
							return l = qt, n.substr(qt, 2) === Eu ? (u = Eu, qt += 2) : (u = null, 0 === Wt && e(Gu)), null !== u && (Lt = l, u = Bu()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function H() {
							var l, u;
							return l = qt, n.substr(qt, 2) === ju ? (u = ju, qt += 2) : (u = null, 0 === Wt && e($u)), null !== u && (Lt = l, u = qu()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function O() {
							var l, u;
							return l = qt, n.substr(qt, 2) === Lu ? (u = Lu, qt += 2) : (u = null, 0 === Wt && e(Mu)), null !== u && (Lt = l, u = Du()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function W() {
							var l, u;
							return l = qt, n.substr(qt, 2) === Hu ? (u = Hu, qt += 2) : (u = null, 0 === Wt && e(Ou)), null !== u && (Lt = l, u = Wu()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function z() {
							var l, u;
							return l = qt, n.substr(qt, 2) === zu ? (u = zu, qt += 2) : (u = null, 0 === Wt && e(Iu)), null !== u && (Lt = l, u = Ju()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function I() {
							var l, u;
							return l = qt, n.substr(qt, 2) === Ku ? (u = Ku, qt += 2) : (u = null, 0 === Wt && e(Nu)), null !== u && (Lt = l, u = Pu()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function J() {
							var l, u;
							return l = qt, n.substr(qt, 2) === Vu ? (u = Vu, qt += 2) : (u = null, 0 === Wt && e(Xu)), null !== u && (Lt = l, u = Yu()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function K() {
							var l, u;
							return l = qt, n.substr(qt, 2) === Zu ? (u = Zu, qt += 2) : (u = null, 0 === Wt && e(_u)), null !== u && (Lt = l, u = nt()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function N() {
							var l, u;
							return l = qt, n.substr(qt, 2) === lt ? (u = lt, qt += 2) : (u = null, 0 === Wt && e(ut)), null !== u && (Lt = l, u = tt()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function P() {
							var l, u;
							return l = qt, n.substr(qt, 2) === rt ? (u = rt, qt += 2) : (u = null, 0 === Wt && e(et)), null !== u && (Lt = l, u = ot()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function V() {
							var l, u;
							return l = qt, n.substr(qt, 2) === ct ? (u = ct, qt += 2) : (u = null, 0 === Wt && e(it)), null !== u && (Lt = l, u = at()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function X() {
							var l, u;
							return l = qt, n.substr(qt, 2) === ft ? (u = ft, qt += 2) : (u = null, 0 === Wt && e(st)), null !== u && (Lt = l, u = ht()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function Y() {
							var l, u, t;
							return l = qt, n.substr(qt, 2) === dt ? (u = dt, qt += 2) : (u = null, 0 === Wt && e(pt)), null !== u ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(vt)), null !== t ? (Lt = l, u = wt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il), l;
						}
						function Z() {
							var l, u, t;
							return l = qt, 92 === n.charCodeAt(qt) ? (u = At, qt++) : (u = null, 0 === Wt && e(Ct)), null !== u ? (gt.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(bt)), null !== t ? (Lt = l, u = kt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il), l;
						}
						function _() {
							var l, u, t, r;
							if (l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, 0 === Wt && e(xt)), null !== u) {
								if (t = [], yt.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(mt)), null !== r) for (; null !== r;) {
									t.push(r), yt.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(mt));
								} else t = il;
								null !== t ? (Lt = l, u = Rt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il);
							} else qt = l, l = il;
							return l;
						}
						function nl() {
							var l, u, t, r;
							if (l = qt, n.substr(qt, 2) === Ft ? (u = Ft, qt += 2) : (u = null, 0 === Wt && e(Qt)), null !== u) {
								if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut)), null !== r) for (; null !== r;) {
									t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut));
								} else t = il;
								null !== t ? (Lt = l, u = Et(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il);
							} else qt = l, l = il;
							return l;
						}
						function ll() {
							var l, u, t, r;
							if (l = qt, n.substr(qt, 2) === Gt ? (u = Gt, qt += 2) : (u = null, 0 === Wt && e(Bt)), null !== u) {
								if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut)), null !== r) for (; null !== r;) {
									t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, 0 === Wt && e(Ut));
								} else t = il;
								null !== t ? (Lt = l, u = jt(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il);
							} else qt = l, l = il;
							return l;
						}
						function ul() {
							var l, u;
							return l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, 0 === Wt && e(xt)), null !== u && (Lt = l, u = $t()), null === u ? (qt = l, l = u) : l = u, l;
						}
						function tl() {
							var l, u, t;
							return l = qt, 92 === n.charCodeAt(qt) ? (u = At, qt++) : (u = null, 0 === Wt && e(Ct)), null !== u ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, 0 === Wt && e(vt)), null !== t ? (Lt = l, u = bu(t), null === u ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il), l;
						}
						var rl,
						    el = arguments.length > 1 ? arguments[1] : {},
						    ol = {
							regexp: c
						},
						    cl = c,
						    il = null,
						    al = "",
						    fl = "|",
						    sl = '"|"',
						    hl = function hl(n, l) {
							return l ? new Alternate(n, l[1]) : n;
						},
						    dl = function dl(n, l, u) {
							return new Match([n].concat(l).concat([u]));
						},
						    pl = "^",
						    vl = '"^"',
						    wl = function wl() {
							return new Token("start");
						},
						    Al = "$",
						    Cl = '"$"',
						    gl = function gl() {
							return new Token("end");
						},
						    bl = function bl(n, l) {
							return new Quantified(n, l);
						},
						    kl = "Quantifier",
						    Tl = function Tl(n, l) {
							return l && (n.greedy = !1), n;
						},
						    xl = "{",
						    yl = '"{"',
						    ml = ",",
						    Rl = '","',
						    Fl = "}",
						    Ql = '"}"',
						    Sl = function Sl(n, l) {
							return new Quantifier(n, l);
						},
						    Ul = ",}",
						    El = '",}"',
						    Gl = function Gl(n) {
							return new Quantifier(n, 1 / 0);
						},
						    Bl = function Bl(n) {
							return new Quantifier(n, n);
						},
						    jl = "+",
						    $l = '"+"',
						    ql = function ql() {
							return new Quantifier(1, 1 / 0);
						},
						    Ll = "*",
						    Ml = '"*"',
						    Dl = function Dl() {
							return new Quantifier(0, 1 / 0);
						},
						    Hl = "?",
						    Ol = '"?"',
						    Wl = function Wl() {
							return new Quantifier(0, 1);
						},
						    zl = /^[0-9]/,
						    Il = "[0-9]",
						    Jl = function Jl(n) {
							return +n.join("");
						},
						    Kl = "(",
						    Nl = '"("',
						    Pl = ")",
						    Vl = '")"',
						    Xl = function Xl(n) {
							return n;
						},
						    Yl = function Yl(n) {
							return new CaptureGroup(n);
						},
						    Zl = "?:",
						    _l = '"?:"',
						    nu = function nu(n) {
							return new Group("non-capture-group", n);
						},
						    lu = "?=",
						    uu = '"?="',
						    tu = function tu(n) {
							return new Group("positive-lookahead", n);
						},
						    ru = "?!",
						    eu = '"?!"',
						    ou = function ou(n) {
							return new Group("negative-lookahead", n);
						},
						    cu = "CharacterSet",
						    iu = "[",
						    au = '"["',
						    fu = "]",
						    su = '"]"',
						    hu = function hu(n, l) {
							return new CharSet(!!n, l);
						},
						    du = "CharacterRange",
						    pu = "-",
						    vu = '"-"',
						    wu = function wu(n, l) {
							return new CharacterRange(n, l);
						},
						    Au = "Character",
						    Cu = /^[^\\\]]/,
						    gu = "[^\\\\\\]]",
						    bu = function bu(n) {
							return new Literal(n);
						},
						    ku = ".",
						    Tu = '"."',
						    xu = function xu() {
							return new Token("any-character");
						},
						    yu = "Literal",
						    mu = /^[^|\\\/.[()?+*$\^]/,
						    Ru = "[^|\\\\\\/.[()?+*$\\^]",
						    Fu = "\\b",
						    Qu = '"\\\\b"',
						    Su = function Su() {
							return new Token("backspace");
						},
						    Uu = function Uu() {
							return new Token("word-boundary");
						},
						    Eu = "\\B",
						    Gu = '"\\\\B"',
						    Bu = function Bu() {
							return new Token("non-word-boundary");
						},
						    ju = "\\d",
						    $u = '"\\\\d"',
						    qu = function qu() {
							return new Token("digit");
						},
						    Lu = "\\D",
						    Mu = '"\\\\D"',
						    Du = function Du() {
							return new Token("non-digit");
						},
						    Hu = "\\f",
						    Ou = '"\\\\f"',
						    Wu = function Wu() {
							return new Token("form-feed");
						},
						    zu = "\\n",
						    Iu = '"\\\\n"',
						    Ju = function Ju() {
							return new Token("line-feed");
						},
						    Ku = "\\r",
						    Nu = '"\\\\r"',
						    Pu = function Pu() {
							return new Token("carriage-return");
						},
						    Vu = "\\s",
						    Xu = '"\\\\s"',
						    Yu = function Yu() {
							return new Token("white-space");
						},
						    Zu = "\\S",
						    _u = '"\\\\S"',
						    nt = function nt() {
							return new Token("non-white-space");
						},
						    lt = "\\t",
						    ut = '"\\\\t"',
						    tt = function tt() {
							return new Token("tab");
						},
						    rt = "\\v",
						    et = '"\\\\v"',
						    ot = function ot() {
							return new Token("vertical-tab");
						},
						    ct = "\\w",
						    it = '"\\\\w"',
						    at = function at() {
							return new Token("word");
						},
						    ft = "\\W",
						    st = '"\\\\W"',
						    ht = function ht() {
							return new Token("non-word");
						},
						    dt = "\\c",
						    pt = '"\\\\c"',
						    vt = "any character",
						    wt = function wt(n) {
							return new ControlCharacter(n);
						},
						    At = "\\",
						    Ct = '"\\\\"',
						    gt = /^[1-9]/,
						    bt = "[1-9]",
						    kt = function kt(n) {
							return new BackReference(n);
						},
						    Tt = "\\0",
						    xt = '"\\\\0"',
						    yt = /^[0-7]/,
						    mt = "[0-7]",
						    Rt = function Rt(n) {
							return new Octal(n.join(""));
						},
						    Ft = "\\x",
						    Qt = '"\\\\x"',
						    St = /^[0-9a-fA-F]/,
						    Ut = "[0-9a-fA-F]",
						    Et = function Et(n) {
							return new Hex(n.join(""));
						},
						    Gt = '\\u',
						    Bt = '"\\\\u"',
						    jt = function jt(n) {
							return new Unicode(n.join(""));
						},
						    $t = function $t() {
							return new Token("null-character");
						},
						    qt = 0,
						    Lt = 0,
						    Mt = 0,
						    Dt = {
							line: 1,
							column: 1,
							seenCR: !1
						},
						    Ht = 0,
						    Ot = [],
						    Wt = 0;
						if ("startRule" in el) {
							if (!(el.startRule in ol)) throw new Error("Can't start parsing from rule \"" + el.startRule + '".');
							cl = ol[el.startRule];
						}
						if (Token.offset = t, Token.text = u, rl = cl(), null !== rl && qt === n.length) return rl;
						throw o(Ot), Lt = Math.max(qt, Ht), new l(Ot, Lt < n.length ? n.charAt(Lt) : null, Lt, r(Lt).line, r(Lt).column);
					}
					return n(l, Error), {
						SyntaxError: l,
						parse: u
					};
				}(),
				    index = 1,
				    cgs = {};

				module.exports = parser;

				/***/
			},
			/* 22 */
			/***/function (module, exports, __webpack_require__) {

				/*
	       ## RegExp Handler
	   	    https://github.com/ForbesLindesay/regexp
	       https://github.com/dmajda/pegjs
	       http://www.regexper.com/
	   	    每个节点的结构
	           {
	               type: '',
	               offset: number,
	               text: '',
	               body: {},
	               escaped: true/false
	           }
	   	    type 可选值
	           alternate             |         选择
	           match                 匹配
	           capture-group         ()        捕获组
	           non-capture-group     (?:...)   非捕获组
	           positive-lookahead    (?=p)     零宽正向先行断言
	           negative-lookahead    (?!p)     零宽负向先行断言
	           quantified            a*        重复节点
	           quantifier            *         量词
	           charset               []        字符集
	           range                 {m, n}    范围
	           literal               a         直接量字符
	           unicode               \uxxxx    Unicode
	           hex                   \x        十六进制
	           octal                 八进制
	           back-reference        \n        反向引用
	           control-character     \cX       控制字符
	   	        // Token
	           start               ^       开头
	           end                 $       结尾
	           any-character       .       任意字符
	           backspace           [\b]    退格直接量
	           word-boundary       \b      单词边界
	           non-word-boundary   \B      非单词边界
	           digit               \d      ASCII 数字，[0-9]
	           non-digit           \D      非 ASCII 数字，[^0-9]
	           form-feed           \f      换页符
	           line-feed           \n      换行符
	           carriage-return     \r      回车符
	           white-space         \s      空白符
	           non-white-space     \S      非空白符
	           tab                 \t      制表符
	           vertical-tab        \v      垂直制表符
	           word                \w      ASCII 字符，[a-zA-Z0-9]
	           non-word            \W      非 ASCII 字符，[^a-zA-Z0-9]
	           null-character      \o      NUL 字符
	    */

				var Util = __webpack_require__(3);
				var Random = __webpack_require__(5);
				/*
	       
	   */
				var Handler = {
					extend: Util.extend
				};

				// http://en.wikipedia.org/wiki/ASCII#ASCII_printable_code_chart
				/*var ASCII_CONTROL_CODE_CHART = {
	       '@': ['\u0000'],
	       A: ['\u0001'],
	       B: ['\u0002'],
	       C: ['\u0003'],
	       D: ['\u0004'],
	       E: ['\u0005'],
	       F: ['\u0006'],
	       G: ['\u0007', '\a'],
	       H: ['\u0008', '\b'],
	       I: ['\u0009', '\t'],
	       J: ['\u000A', '\n'],
	       K: ['\u000B', '\v'],
	       L: ['\u000C', '\f'],
	       M: ['\u000D', '\r'],
	       N: ['\u000E'],
	       O: ['\u000F'],
	       P: ['\u0010'],
	       Q: ['\u0011'],
	       R: ['\u0012'],
	       S: ['\u0013'],
	       T: ['\u0014'],
	       U: ['\u0015'],
	       V: ['\u0016'],
	       W: ['\u0017'],
	       X: ['\u0018'],
	       Y: ['\u0019'],
	       Z: ['\u001A'],
	       '[': ['\u001B', '\e'],
	       '\\': ['\u001C'],
	       ']': ['\u001D'],
	       '^': ['\u001E'],
	       '_': ['\u001F']
	   }*/

				// ASCII printable code chart
				// var LOWER = 'abcdefghijklmnopqrstuvwxyz'
				// var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
				// var NUMBER = '0123456789'
				// var SYMBOL = ' !"#$%&\'()*+,-./' + ':;<=>?@' + '[\\]^_`' + '{|}~'
				var LOWER = ascii(97, 122);
				var UPPER = ascii(65, 90);
				var NUMBER = ascii(48, 57);
				var OTHER = ascii(32, 47) + ascii(58, 64) + ascii(91, 96) + ascii(123, 126); // 排除 95 _ ascii(91, 94) + ascii(96, 96)
				var PRINTABLE = ascii(32, 126);
				var SPACE = ' \f\n\r\t\x0B\xA0\u2028\u2029';
				var CHARACTER_CLASSES = {
					'\\w': LOWER + UPPER + NUMBER + '_', // ascii(95, 95)
					'\\W': OTHER.replace('_', ''),
					'\\s': SPACE,
					'\\S': function () {
						var result = PRINTABLE;
						for (var i = 0; i < SPACE.length; i++) {
							result = result.replace(SPACE[i], '');
						}
						return result;
					}(),
					'\\d': NUMBER,
					'\\D': LOWER + UPPER + OTHER
				};

				function ascii(from, to) {
					var result = '';
					for (var i = from; i <= to; i++) {
						result += String.fromCharCode(i);
					}
					return result;
				}

				// var ast = RegExpParser.parse(regexp.source)
				Handler.gen = function (node, result, cache) {
					cache = cache || {
						guid: 1
					};
					return Handler[node.type] ? Handler[node.type](node, result, cache) : Handler.token(node, result, cache);
				};

				Handler.extend({
					/* jshint unused:false */
					token: function token(node, result, cache) {
						switch (node.type) {
							case 'start':
							case 'end':
								return '';
							case 'any-character':
								return Random.character();
							case 'backspace':
								return '';
							case 'word-boundary':
								// TODO
								return '';
							case 'non-word-boundary':
								// TODO
								break;
							case 'digit':
								return Random.pick(NUMBER.split(''));
							case 'non-digit':
								return Random.pick((LOWER + UPPER + OTHER).split(''));
							case 'form-feed':
								break;
							case 'line-feed':
								return node.body || node.text;
							case 'carriage-return':
								break;
							case 'white-space':
								return Random.pick(SPACE.split(''));
							case 'non-white-space':
								return Random.pick((LOWER + UPPER + NUMBER).split(''));
							case 'tab':
								break;
							case 'vertical-tab':
								break;
							case 'word':
								// \w [a-zA-Z0-9]
								return Random.pick((LOWER + UPPER + NUMBER).split(''));
							case 'non-word':
								// \W [^a-zA-Z0-9]
								return Random.pick(OTHER.replace('_', '').split(''));
							case 'null-character':
								break;
						}
						return node.body || node.text;
					},
					/*
	        {
	            type: 'alternate',
	            offset: 0,
	            text: '',
	            left: {
	                boyd: []
	            },
	            right: {
	                boyd: []
	            }
	        }
	    */
					alternate: function alternate(node, result, cache) {
						// node.left/right {}
						return this.gen(Random.boolean() ? node.left : node.right, result, cache);
					},
					/*
	        {
	            type: 'match',
	            offset: 0,
	            text: '',
	            body: []
	        }
	    */
					match: function match(node, result, cache) {
						result = '';
						// node.body []
						for (var i = 0; i < node.body.length; i++) {
							result += this.gen(node.body[i], result, cache);
						}
						return result;
					},
					// ()
					'capture-group': function captureGroup(node, result, cache) {
						// node.body {}
						result = this.gen(node.body, result, cache);
						cache[cache.guid++] = result;
						return result;
					},
					// (?:...)
					'non-capture-group': function nonCaptureGroup(node, result, cache) {
						// node.body {}
						return this.gen(node.body, result, cache);
					},
					// (?=p)
					'positive-lookahead': function positiveLookahead(node, result, cache) {
						// node.body
						return this.gen(node.body, result, cache);
					},
					// (?!p)
					'negative-lookahead': function negativeLookahead(node, result, cache) {
						// node.body
						return '';
					},
					/*
	        {
	            type: 'quantified',
	            offset: 3,
	            text: 'c*',
	            body: {
	                type: 'literal',
	                offset: 3,
	                text: 'c',
	                body: 'c',
	                escaped: false
	            },
	            quantifier: {
	                type: 'quantifier',
	                offset: 4,
	                text: '*',
	                min: 0,
	                max: Infinity,
	                greedy: true
	            }
	        }
	    */
					quantified: function quantified(node, result, cache) {
						result = '';
						// node.quantifier {}
						var count = this.quantifier(node.quantifier);
						// node.body {}
						for (var i = 0; i < count; i++) {
							result += this.gen(node.body, result, cache);
						}
						return result;
					},
					/*
	        quantifier: {
	            type: 'quantifier',
	            offset: 4,
	            text: '*',
	            min: 0,
	            max: Infinity,
	            greedy: true
	        }
	    */
					quantifier: function quantifier(node, result, cache) {
						var min = Math.max(node.min, 0);
						var max = isFinite(node.max) ? node.max : min + Random.integer(3, 7);
						return Random.integer(min, max);
					},
					/*
	        
	    */
					charset: function charset(node, result, cache) {
						// node.invert
						if (node.invert) return this['invert-charset'](node, result, cache);

						// node.body []
						var literal = Random.pick(node.body);
						return this.gen(literal, result, cache);
					},
					'invert-charset': function invertCharset(node, result, cache) {
						var pool = PRINTABLE;
						for (var i = 0, item; i < node.body.length; i++) {
							item = node.body[i];
							switch (item.type) {
								case 'literal':
									pool = pool.replace(item.body, '');
									break;
								case 'range':
									var min = this.gen(item.start, result, cache).charCodeAt();
									var max = this.gen(item.end, result, cache).charCodeAt();
									for (var ii = min; ii <= max; ii++) {
										pool = pool.replace(String.fromCharCode(ii), '');
									}
								/* falls through */
								default:
									var characters = CHARACTER_CLASSES[item.text];
									if (characters) {
										for (var iii = 0; iii <= characters.length; iii++) {
											pool = pool.replace(characters[iii], '');
										}
									}
							}
						}
						return Random.pick(pool.split(''));
					},
					range: function range(node, result, cache) {
						// node.start, node.end
						var min = this.gen(node.start, result, cache).charCodeAt();
						var max = this.gen(node.end, result, cache).charCodeAt();
						return String.fromCharCode(Random.integer(min, max));
					},
					literal: function literal(node, result, cache) {
						return node.escaped ? node.body : node.text;
					},
					// Unicode \u
					unicode: function unicode(node, result, cache) {
						return String.fromCharCode(parseInt(node.code, 16));
					},
					// 十六进制 \xFF
					hex: function hex(node, result, cache) {
						return String.fromCharCode(parseInt(node.code, 16));
					},
					// 八进制 \0
					octal: function octal(node, result, cache) {
						return String.fromCharCode(parseInt(node.code, 8));
					},
					// 反向引用
					'back-reference': function backReference(node, result, cache) {
						return cache[node.code] || '';
					},
					/*
	        http://en.wikipedia.org/wiki/C0_and_C1_control_codes
	    */
					CONTROL_CHARACTER_MAP: function () {
						var CONTROL_CHARACTER = '@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _'.split(' ');
						var CONTROL_CHARACTER_UNICODE = '\0 \x01 \x02 \x03 \x04 \x05 \x06 \x07 \b \t \n \x0B \f \r \x0E \x0F \x10 \x11 \x12 \x13 \x14 \x15 \x16 \x17 \x18 \x19 \x1A \x1B \x1C \x1D \x1E \x1F'.split(' ');
						var map = {};
						for (var i = 0; i < CONTROL_CHARACTER.length; i++) {
							map[CONTROL_CHARACTER[i]] = CONTROL_CHARACTER_UNICODE[i];
						}
						return map;
					}(),
					'control-character': function controlCharacter(node, result, cache) {
						return this.CONTROL_CHARACTER_MAP[node.code];
					}
				});

				module.exports = Handler;

				/***/
			},
			/* 23 */
			/***/function (module, exports, __webpack_require__) {

				module.exports = __webpack_require__(24);

				/***/
			},
			/* 24 */
			/***/function (module, exports, __webpack_require__) {

				/*
	       ## toJSONSchema
	   	    把 Mock.js 风格的数据模板转换成 JSON Schema。
	   	    > [JSON Schema](http://json-schema.org/)
	    */
				var Constant = __webpack_require__(2);
				var Util = __webpack_require__(3);
				var Parser = __webpack_require__(4);

				function toJSONSchema(template, name, path /* Internal Use Only */) {
					// type rule properties items
					path = path || [];
					var result = {
						name: typeof name === 'string' ? name.replace(Constant.RE_KEY, '$1') : name,
						template: template,
						type: Util.type(template), // 可能不准确，例如 { 'name|1': [{}, {} ...] }
						rule: Parser.parse(name)
					};
					result.path = path.slice(0);
					result.path.push(name === undefined ? 'ROOT' : result.name);

					switch (result.type) {
						case 'array':
							result.items = [];
							Util.each(template, function (value, index) {
								result.items.push(toJSONSchema(value, index, result.path));
							});
							break;
						case 'object':
							result.properties = [];
							Util.each(template, function (value, name) {
								result.properties.push(toJSONSchema(value, name, result.path));
							});
							break;
					}

					return result;
				}

				module.exports = toJSONSchema;

				/***/
			},
			/* 25 */
			/***/function (module, exports, __webpack_require__) {

				module.exports = __webpack_require__(26);

				/***/
			},
			/* 26 */
			/***/function (module, exports, __webpack_require__) {

				/*
	       ## valid(template, data)
	   	    校验真实数据 data 是否与数据模板 template 匹配。
	       
	       实现思路：
	       1. 解析规则。
	           先把数据模板 template 解析为更方便机器解析的 JSON-Schame
	           name               属性名 
	           type               属性值类型
	           template           属性值模板
	           properties         对象属性数组
	           items              数组元素数组
	           rule               属性值生成规则
	       2. 递归验证规则。
	           然后用 JSON-Schema 校验真实数据，校验项包括属性名、值类型、值、值生成规则。
	   	    提示信息 
	       https://github.com/fge/json-schema-validator/blob/master/src/main/resources/com/github/fge/jsonschema/validator/validation.properties
	       [JSON-Schama validator](http://json-schema-validator.herokuapp.com/)
	       [Regexp Demo](http://demos.forbeslindesay.co.uk/regexp/)
	   */
				var Constant = __webpack_require__(2);
				var Util = __webpack_require__(3);
				var toJSONSchema = __webpack_require__(23);

				function valid(template, data) {
					var schema = toJSONSchema(template);
					var result = Diff.diff(schema, data);
					for (var i = 0; i < result.length; i++) {
						// console.log(template, data)
						// console.warn(Assert.message(result[i]))
					}
					return result;
				}

				/*
	       ## name
	           有生成规则：比较解析后的 name
	           无生成规则：直接比较
	       ## type
	           无类型转换：直接比较
	           有类型转换：先试着解析 template，然后再检查？
	       ## value vs. template
	           基本类型
	               无生成规则：直接比较
	               有生成规则：
	                   number
	                       min-max.dmin-dmax
	                       min-max.dcount
	                       count.dmin-dmax
	                       count.dcount
	                       +step
	                       整数部分
	                       小数部分
	                   boolean 
	                   string  
	                       min-max
	                       count
	       ## properties
	           对象
	               有生成规则：检测期望的属性个数，继续递归
	               无生成规则：检测全部的属性个数，继续递归
	       ## items
	           数组
	               有生成规则：
	                   `'name|1': [{}, {} ...]`            其中之一，继续递归
	                   `'name|+1': [{}, {} ...]`           顺序检测，继续递归
	                   `'name|min-max': [{}, {} ...]`      检测个数，继续递归
	                   `'name|count': [{}, {} ...]`        检测个数，继续递归
	               无生成规则：检测全部的元素个数，继续递归
	   */
				var Diff = {
					diff: function diff(schema, data, name /* Internal Use Only */) {
						var result = [];

						// 先检测名称 name 和类型 type，如果匹配，才有必要继续检测
						if (this.name(schema, data, name, result) && this.type(schema, data, name, result)) {
							this.value(schema, data, name, result);
							this.properties(schema, data, name, result);
							this.items(schema, data, name, result);
						}

						return result;
					},
					/* jshint unused:false */
					name: function name(schema, data, _name, result) {
						var length = result.length;

						Assert.equal('name', schema.path, _name + '', schema.name + '', result);

						return result.length === length;
					},
					type: function type(schema, data, name, result) {
						var length = result.length;

						switch (schema.type) {
							case 'string':
								// 跳过含有『占位符』的属性值，因为『占位符』返回值的类型可能和模板不一致，例如 '@int' 会返回一个整形值
								if (schema.template.match(Constant.RE_PLACEHOLDER)) return true;
								break;
							case 'array':
								if (schema.rule.parameters) {
									// name|count: array
									if (schema.rule.min !== undefined && schema.rule.max === undefined) {
										// 跳过 name|1: array，因为最终值的类型（很可能）不是数组，也不一定与 `array` 中的类型一致
										if (schema.rule.count === 1) return true;
									}
									// 跳过 name|+inc: array
									if (schema.rule.parameters[2]) return true;
								}
								break;
							case 'function':
								// 跳过 `'name': function`，因为函数可以返回任何类型的值。
								return true;
						}

						Assert.equal('type', schema.path, Util.type(data), schema.type, result);

						return result.length === length;
					},
					value: function value(schema, data, name, result) {
						var length = result.length;

						var rule = schema.rule;
						var templateType = schema.type;
						if (templateType === 'object' || templateType === 'array' || templateType === 'function') return true;

						// 无生成规则
						if (!rule.parameters) {
							switch (templateType) {
								case 'regexp':
									Assert.match('value', schema.path, data, schema.template, result);
									return result.length === length;
								case 'string':
									// 同样跳过含有『占位符』的属性值，因为『占位符』的返回值会通常会与模板不一致
									if (schema.template.match(Constant.RE_PLACEHOLDER)) return result.length === length;
									break;
							}
							Assert.equal('value', schema.path, data, schema.template, result);
							return result.length === length;
						}

						// 有生成规则
						var actualRepeatCount;
						switch (templateType) {
							case 'number':
								var parts = (data + '').split('.');
								parts[0] = +parts[0];

								// 整数部分
								// |min-max
								if (rule.min !== undefined && rule.max !== undefined) {
									Assert.greaterThanOrEqualTo('value', schema.path, parts[0], Math.min(rule.min, rule.max), result);
									// , 'numeric instance is lower than the required minimum (minimum: {expected}, found: {actual})')
									Assert.lessThanOrEqualTo('value', schema.path, parts[0], Math.max(rule.min, rule.max), result);
								}
								// |count
								if (rule.min !== undefined && rule.max === undefined) {
									Assert.equal('value', schema.path, parts[0], rule.min, result, '[value] ' + name);
								}

								// 小数部分
								if (rule.decimal) {
									// |dmin-dmax
									if (rule.dmin !== undefined && rule.dmax !== undefined) {
										Assert.greaterThanOrEqualTo('value', schema.path, parts[1].length, rule.dmin, result);
										Assert.lessThanOrEqualTo('value', schema.path, parts[1].length, rule.dmax, result);
									}
									// |dcount
									if (rule.dmin !== undefined && rule.dmax === undefined) {
										Assert.equal('value', schema.path, parts[1].length, rule.dmin, result);
									}
								}

								break;

							case 'boolean':
								break;

							case 'string':
								// 'aaa'.match(/a/g)
								actualRepeatCount = data.match(new RegExp(schema.template, 'g'));
								actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0;

								// |min-max
								if (rule.min !== undefined && rule.max !== undefined) {
									Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result);
									Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result);
								}
								// |count
								if (rule.min !== undefined && rule.max === undefined) {
									Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result);
								}

								break;

							case 'regexp':
								actualRepeatCount = data.match(new RegExp(schema.template.source.replace(/^\^|\$$/g, ''), 'g'));
								actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0;

								// |min-max
								if (rule.min !== undefined && rule.max !== undefined) {
									Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result);
									Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result);
								}
								// |count
								if (rule.min !== undefined && rule.max === undefined) {
									Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result);
								}
								break;
						}

						return result.length === length;
					},
					properties: function properties(schema, data, name, result) {
						var length = result.length;

						var rule = schema.rule;
						var keys = Util.keys(data);
						if (!schema.properties) return;

						// 无生成规则
						if (!schema.rule.parameters) {
							Assert.equal('properties length', schema.path, keys.length, schema.properties.length, result);
						} else {
							// 有生成规则
							// |min-max
							if (rule.min !== undefined && rule.max !== undefined) {
								Assert.greaterThanOrEqualTo('properties length', schema.path, keys.length, Math.min(rule.min, rule.max), result);
								Assert.lessThanOrEqualTo('properties length', schema.path, keys.length, Math.max(rule.min, rule.max), result);
							}
							// |count
							if (rule.min !== undefined && rule.max === undefined) {
								// |1, |>1
								if (rule.count !== 1) Assert.equal('properties length', schema.path, keys.length, rule.min, result);
							}
						}

						if (result.length !== length) return false;

						for (var i = 0; i < keys.length; i++) {
							result.push.apply(result, this.diff(function () {
								var property;
								Util.each(schema.properties, function (item /*, index*/) {
									if (item.name === keys[i]) property = item;
								});
								return property || schema.properties[i];
							}(), data[keys[i]], keys[i]));
						}

						return result.length === length;
					},
					items: function items(schema, data, name, result) {
						var length = result.length;

						if (!schema.items) return;

						var rule = schema.rule;

						// 无生成规则
						if (!schema.rule.parameters) {
							Assert.equal('items length', schema.path, data.length, schema.items.length, result);
						} else {
							// 有生成规则
							// |min-max
							if (rule.min !== undefined && rule.max !== undefined) {
								Assert.greaterThanOrEqualTo('items', schema.path, data.length, Math.min(rule.min, rule.max) * schema.items.length, result, '[{utype}] array is too short: {path} must have at least {expected} elements but instance has {actual} elements');
								Assert.lessThanOrEqualTo('items', schema.path, data.length, Math.max(rule.min, rule.max) * schema.items.length, result, '[{utype}] array is too long: {path} must have at most {expected} elements but instance has {actual} elements');
							}
							// |count
							if (rule.min !== undefined && rule.max === undefined) {
								// |1, |>1
								if (rule.count === 1) return result.length === length;else Assert.equal('items length', schema.path, data.length, rule.min * schema.items.length, result);
							}
							// |+inc
							if (rule.parameters[2]) return result.length === length;
						}

						if (result.length !== length) return false;

						for (var i = 0; i < data.length; i++) {
							result.push.apply(result, this.diff(schema.items[i % schema.items.length], data[i], i % schema.items.length));
						}

						return result.length === length;
					}
				};

				/*
	       完善、友好的提示信息
	       
	       Equal, not equal to, greater than, less than, greater than or equal to, less than or equal to
	       路径 验证类型 描述 
	   	    Expect path.name is less than or equal to expected, but path.name is actual.
	   	    Expect path.name is less than or equal to expected, but path.name is actual.
	       Expect path.name is greater than or equal to expected, but path.name is actual.
	   	*/
				var Assert = {
					message: function message(item) {
						return (item.message || '[{utype}] Expect {path}\'{ltype} {action} {expected}, but is {actual}').replace('{utype}', item.type.toUpperCase()).replace('{ltype}', item.type.toLowerCase()).replace('{path}', Util.isArray(item.path) && item.path.join('.') || item.path).replace('{action}', item.action).replace('{expected}', item.expected).replace('{actual}', item.actual);
					},
					equal: function equal(type, path, actual, expected, result, message) {
						if (actual === expected) return true;
						switch (type) {
							case 'type':
								// 正则模板 === 字符串最终值
								if (expected === 'regexp' && actual === 'string') return true;
								break;
						}

						var item = {
							path: path,
							type: type,
							actual: actual,
							expected: expected,
							action: 'is equal to',
							message: message
						};
						item.message = Assert.message(item);
						result.push(item);
						return false;
					},
					// actual matches expected
					match: function match(type, path, actual, expected, result, message) {
						if (expected.test(actual)) return true;

						var item = {
							path: path,
							type: type,
							actual: actual,
							expected: expected,
							action: 'matches',
							message: message
						};
						item.message = Assert.message(item);
						result.push(item);
						return false;
					},
					notEqual: function notEqual(type, path, actual, expected, result, message) {
						if (actual !== expected) return true;
						var item = {
							path: path,
							type: type,
							actual: actual,
							expected: expected,
							action: 'is not equal to',
							message: message
						};
						item.message = Assert.message(item);
						result.push(item);
						return false;
					},
					greaterThan: function greaterThan(type, path, actual, expected, result, message) {
						if (actual > expected) return true;
						var item = {
							path: path,
							type: type,
							actual: actual,
							expected: expected,
							action: 'is greater than',
							message: message
						};
						item.message = Assert.message(item);
						result.push(item);
						return false;
					},
					lessThan: function lessThan(type, path, actual, expected, result, message) {
						if (actual < expected) return true;
						var item = {
							path: path,
							type: type,
							actual: actual,
							expected: expected,
							action: 'is less to',
							message: message
						};
						item.message = Assert.message(item);
						result.push(item);
						return false;
					},
					greaterThanOrEqualTo: function greaterThanOrEqualTo(type, path, actual, expected, result, message) {
						if (actual >= expected) return true;
						var item = {
							path: path,
							type: type,
							actual: actual,
							expected: expected,
							action: 'is greater than or equal to',
							message: message
						};
						item.message = Assert.message(item);
						result.push(item);
						return false;
					},
					lessThanOrEqualTo: function lessThanOrEqualTo(type, path, actual, expected, result, message) {
						if (actual <= expected) return true;
						var item = {
							path: path,
							type: type,
							actual: actual,
							expected: expected,
							action: 'is less than or equal to',
							message: message
						};
						item.message = Assert.message(item);
						result.push(item);
						return false;
					}
				};

				valid.Diff = Diff;
				valid.Assert = Assert;

				module.exports = valid;

				/***/
			},
			/* 27 */
			/***/function (module, exports, __webpack_require__) {

				module.exports = __webpack_require__(28);

				/***/
			},
			/* 28 */
			/***/function (module, exports, __webpack_require__) {

				/* global window, document, location, Event, setTimeout */
				/*
	       ## MockXMLHttpRequest
	   	    期望的功能：
	       1. 完整地覆盖原生 XHR 的行为
	       2. 完整地模拟原生 XHR 的行为
	       3. 在发起请求时，自动检测是否需要拦截
	       4. 如果不必拦截，则执行原生 XHR 的行为
	       5. 如果需要拦截，则执行虚拟 XHR 的行为
	       6. 兼容 XMLHttpRequest 和 ActiveXObject
	           new window.XMLHttpRequest()
	           new window.ActiveXObject("Microsoft.XMLHTTP")
	   	    关键方法的逻辑：
	       * new   此时尚无法确定是否需要拦截，所以创建原生 XHR 对象是必须的。
	       * open  此时可以取到 URL，可以决定是否进行拦截。
	       * send  此时已经确定了请求方式。
	   	    规范：
	       http://xhr.spec.whatwg.org/
	       http://www.w3.org/TR/XMLHttpRequest2/
	   	    参考实现：
	       https://github.com/philikon/MockHttpRequest/blob/master/lib/mock.js
	       https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js
	       https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js
	       https://github.com/firebug/firebug-lite/blob/master/content/lite/xhr.js
	       https://github.com/thx/RAP/blob/master/lab/rap.plugin.xinglie.js
	   	    **需不需要全面重写 XMLHttpRequest？**
	           http://xhr.spec.whatwg.org/#interface-xmlhttprequest
	           关键属性 readyState、status、statusText、response、responseText、responseXML 是 readonly，所以，试图通过修改这些状态，来模拟响应是不可行的。
	           因此，唯一的办法是模拟整个 XMLHttpRequest，就像 jQuery 对事件模型的封装。
	   	    // Event handlers
	       onloadstart         loadstart
	       onprogress          progress
	       onabort             abort
	       onerror             error
	       onload              load
	       ontimeout           timeout
	       onloadend           loadend
	       onreadystatechange  readystatechange
	    */

				var Util = __webpack_require__(3);

				// 备份原生 XMLHttpRequest
				window._XMLHttpRequest = window.XMLHttpRequest;
				window._ActiveXObject = window.ActiveXObject;

				/*
	       PhantomJS
	       TypeError: '[object EventConstructor]' is not a constructor (evaluating 'new Event("readystatechange")')
	   	    https://github.com/bluerail/twitter-bootstrap-rails-confirm/issues/18
	       https://github.com/ariya/phantomjs/issues/11289
	   */
				try {
					new window.Event('custom');
				} catch (exception) {
					window.Event = function (type, bubbles, cancelable, detail) {
						var event = document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
						event.initCustomEvent(type, bubbles, cancelable, detail);
						return event;
					};
				}

				var XHR_STATES = {
					// The object has been constructed.
					UNSENT: 0,
					// The open() method has been successfully invoked.
					OPENED: 1,
					// All redirects (if any) have been followed and all HTTP headers of the response have been received.
					HEADERS_RECEIVED: 2,
					// The response's body is being received.
					LOADING: 3,
					// The data transfer has been completed or something went wrong during the transfer (e.g. infinite redirects).
					DONE: 4
				};

				var XHR_EVENTS = 'readystatechange loadstart progress abort error load timeout loadend'.split(' ');
				var XHR_REQUEST_PROPERTIES = 'timeout withCredentials'.split(' ');
				var XHR_RESPONSE_PROPERTIES = 'readyState responseURL status statusText responseType response responseText responseXML'.split(' ');

				// https://github.com/trek/FakeXMLHttpRequest/blob/master/fake_xml_http_request.js#L32
				var HTTP_STATUS_CODES = {
					100: "Continue",
					101: "Switching Protocols",
					200: "OK",
					201: "Created",
					202: "Accepted",
					203: "Non-Authoritative Information",
					204: "No Content",
					205: "Reset Content",
					206: "Partial Content",
					300: "Multiple Choice",
					301: "Moved Permanently",
					302: "Found",
					303: "See Other",
					304: "Not Modified",
					305: "Use Proxy",
					307: "Temporary Redirect",
					400: "Bad Request",
					401: "Unauthorized",
					402: "Payment Required",
					403: "Forbidden",
					404: "Not Found",
					405: "Method Not Allowed",
					406: "Not Acceptable",
					407: "Proxy Authentication Required",
					408: "Request Timeout",
					409: "Conflict",
					410: "Gone",
					411: "Length Required",
					412: "Precondition Failed",
					413: "Request Entity Too Large",
					414: "Request-URI Too Long",
					415: "Unsupported Media Type",
					416: "Requested Range Not Satisfiable",
					417: "Expectation Failed",
					422: "Unprocessable Entity",
					500: "Internal Server Error",
					501: "Not Implemented",
					502: "Bad Gateway",
					503: "Service Unavailable",
					504: "Gateway Timeout",
					505: "HTTP Version Not Supported"
				};

				/*
	       MockXMLHttpRequest
	   */

				function MockXMLHttpRequest() {
					// 初始化 custom 对象，用于存储自定义属性
					this.custom = {
						events: {},
						requestHeaders: {},
						responseHeaders: {}
					};
				}

				MockXMLHttpRequest._settings = {
					timeout: '10-100'
				};

				MockXMLHttpRequest.setup = function (settings) {
					Util.extend(MockXMLHttpRequest._settings, settings);
					return MockXMLHttpRequest._settings;
				};

				Util.extend(MockXMLHttpRequest, XHR_STATES);
				Util.extend(MockXMLHttpRequest.prototype, XHR_STATES);

				// 标记当前对象为 MockXMLHttpRequest
				MockXMLHttpRequest.prototype.mock = true;

				// 是否拦截 Ajax 请求
				MockXMLHttpRequest.prototype.match = false;

				// 初始化 Request 相关的属性和方法
				Util.extend(MockXMLHttpRequest.prototype, {
					// https://xhr.spec.whatwg.org/#the-open()-method
					// Sets the request method, request URL, and synchronous flag.
					open: function open(method, url, async, username, password) {
						var that = this;

						Util.extend(this.custom, {
							method: method,
							url: url,
							async: typeof async === 'boolean' ? async : true,
							username: username,
							password: password,
							options: {
								url: url,
								type: method
							}
						});

						this.custom.timeout = function (timeout) {
							if (typeof timeout === 'number') return timeout;
							if (typeof timeout === 'string' && !~timeout.indexOf('-')) return parseInt(timeout, 10);
							if (typeof timeout === 'string' && ~timeout.indexOf('-')) {
								var tmp = timeout.split('-');
								var min = parseInt(tmp[0], 10);
								var max = parseInt(tmp[1], 10);
								return Math.round(Math.random() * (max - min)) + min;
							}
						}(MockXMLHttpRequest._settings.timeout);

						// 查找与请求参数匹配的数据模板
						var item = find(this.custom.options);

						function handle(event) {
							// 同步属性 NativeXMLHttpRequest => MockXMLHttpRequest
							for (var i = 0; i < XHR_RESPONSE_PROPERTIES.length; i++) {
								try {
									that[XHR_RESPONSE_PROPERTIES[i]] = xhr[XHR_RESPONSE_PROPERTIES[i]];
								} catch (e) {}
							}
							// 触发 MockXMLHttpRequest 上的同名事件
							that.dispatchEvent(new Event(event.type /*, false, false, that*/));
						}

						// 如果未找到匹配的数据模板，则采用原生 XHR 发送请求。
						if (!item) {
							// 创建原生 XHR 对象，调用原生 open()，监听所有原生事件
							var xhr = createNativeXMLHttpRequest();
							this.custom.xhr = xhr;

							// 初始化所有事件，用于监听原生 XHR 对象的事件
							for (var i = 0; i < XHR_EVENTS.length; i++) {
								xhr.addEventListener(XHR_EVENTS[i], handle);
							}

							// xhr.open()
							if (username) xhr.open(method, url, async, username, password);else xhr.open(method, url, async);

							// 同步属性 MockXMLHttpRequest => NativeXMLHttpRequest
							for (var j = 0; j < XHR_REQUEST_PROPERTIES.length; j++) {
								try {
									xhr[XHR_REQUEST_PROPERTIES[j]] = that[XHR_REQUEST_PROPERTIES[j]];
								} catch (e) {}
							}

							return;
						}

						// 找到了匹配的数据模板，开始拦截 XHR 请求
						this.match = true;
						this.custom.template = item;
						this.readyState = MockXMLHttpRequest.OPENED;
						this.dispatchEvent(new Event('readystatechange' /*, false, false, this*/));
					},
					// https://xhr.spec.whatwg.org/#the-setrequestheader()-method
					// Combines a header in author request headers.
					setRequestHeader: function setRequestHeader(name, value) {
						// 原生 XHR
						if (!this.match) {
							this.custom.xhr.setRequestHeader(name, value);
							return;
						}

						// 拦截 XHR
						var requestHeaders = this.custom.requestHeaders;
						if (requestHeaders[name]) requestHeaders[name] += ',' + value;else requestHeaders[name] = value;
					},
					timeout: 0,
					withCredentials: false,
					upload: {},
					// https://xhr.spec.whatwg.org/#the-send()-method
					// Initiates the request.
					send: function send(data) {
						var that = this;
						this.custom.options.body = data;

						// 原生 XHR
						if (!this.match) {
							this.custom.xhr.send(data);
							return;
						}

						// 拦截 XHR

						// X-Requested-With header
						this.setRequestHeader('X-Requested-With', 'MockXMLHttpRequest');

						// loadstart The fetch initiates.
						this.dispatchEvent(new Event('loadstart' /*, false, false, this*/));

						if (this.custom.async) setTimeout(done, this.custom.timeout); // 异步
						else done(); // 同步

						function done() {
							that.readyState = MockXMLHttpRequest.HEADERS_RECEIVED;
							that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/));
							that.readyState = MockXMLHttpRequest.LOADING;
							that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/));

							that.status = 200;
							that.statusText = HTTP_STATUS_CODES[200];

							// fix #92 #93 by @qddegtya
							that.response = that.responseText = JSON.stringify(convert(that.custom.template, that.custom.options), null, 4);

							that.readyState = MockXMLHttpRequest.DONE;
							that.dispatchEvent(new Event('readystatechange' /*, false, false, that*/));
							that.dispatchEvent(new Event('load' /*, false, false, that*/));
							that.dispatchEvent(new Event('loadend' /*, false, false, that*/));
						}
					},
					// https://xhr.spec.whatwg.org/#the-abort()-method
					// Cancels any network activity.
					abort: function abort() {
						// 原生 XHR
						if (!this.match) {
							this.custom.xhr.abort();
							return;
						}

						// 拦截 XHR
						this.readyState = MockXMLHttpRequest.UNSENT;
						this.dispatchEvent(new Event('abort', false, false, this));
						this.dispatchEvent(new Event('error', false, false, this));
					}
				});

				// 初始化 Response 相关的属性和方法
				Util.extend(MockXMLHttpRequest.prototype, {
					responseURL: '',
					status: MockXMLHttpRequest.UNSENT,
					statusText: '',
					// https://xhr.spec.whatwg.org/#the-getresponseheader()-method
					getResponseHeader: function getResponseHeader(name) {
						// 原生 XHR
						if (!this.match) {
							return this.custom.xhr.getResponseHeader(name);
						}

						// 拦截 XHR
						return this.custom.responseHeaders[name.toLowerCase()];
					},
					// https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method
					// http://www.utf8-chartable.de/
					getAllResponseHeaders: function getAllResponseHeaders() {
						// 原生 XHR
						if (!this.match) {
							return this.custom.xhr.getAllResponseHeaders();
						}

						// 拦截 XHR
						var responseHeaders = this.custom.responseHeaders;
						var headers = '';
						for (var h in responseHeaders) {
							if (!responseHeaders.hasOwnProperty(h)) continue;
							headers += h + ': ' + responseHeaders[h] + '\r\n';
						}
						return headers;
					},
					overrideMimeType: function overrideMimeType() /*mime*/{},
					responseType: '', // '', 'text', 'arraybuffer', 'blob', 'document', 'json'
					response: null,
					responseText: '',
					responseXML: null
				});

				// EventTarget
				Util.extend(MockXMLHttpRequest.prototype, {
					addEventListener: function addEventListener(type, handle) {
						var events = this.custom.events;
						if (!events[type]) events[type] = [];
						events[type].push(handle);
					},
					removeEventListener: function removeEventListener(type, handle) {
						var handles = this.custom.events[type] || [];
						for (var i = 0; i < handles.length; i++) {
							if (handles[i] === handle) {
								handles.splice(i--, 1);
							}
						}
					},
					dispatchEvent: function dispatchEvent(event) {
						var handles = this.custom.events[event.type] || [];
						for (var i = 0; i < handles.length; i++) {
							handles[i].call(this, event);
						}

						var ontype = 'on' + event.type;
						if (this[ontype]) this[ontype](event);
					}
				});

				// Inspired by jQuery
				function createNativeXMLHttpRequest() {
					var isLocal = function () {
						var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
						var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
						var ajaxLocation = location.href;
						var ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
						return rlocalProtocol.test(ajaxLocParts[1]);
					}();

					return window.ActiveXObject ? !isLocal && createStandardXHR() || createActiveXHR() : createStandardXHR();

					function createStandardXHR() {
						try {
							return new window._XMLHttpRequest();
						} catch (e) {}
					}

					function createActiveXHR() {
						try {
							return new window._ActiveXObject("Microsoft.XMLHTTP");
						} catch (e) {}
					}
				}

				// 查找与请求参数匹配的数据模板：URL，Type
				function find(options) {

					for (var sUrlType in MockXMLHttpRequest.Mock._mocked) {
						var item = MockXMLHttpRequest.Mock._mocked[sUrlType];
						if ((!item.rurl || match(item.rurl, options.url)) && (!item.rtype || match(item.rtype, options.type.toLowerCase()))) {
							// console.log('[mock]', options.url, '>', item.rurl)
							return item;
						}
					}

					function match(expected, actual) {
						if (Util.type(expected) === 'string') {
							return expected === actual;
						}
						if (Util.type(expected) === 'regexp') {
							return expected.test(actual);
						}
					}
				}

				// 数据模板 ＝> 响应数据
				function convert(item, options) {
					return Util.isFunction(item.template) ? item.template(options) : MockXMLHttpRequest.Mock.mock(item.template);
				}

				module.exports = MockXMLHttpRequest;

				/***/
			}
			/******/])
		);
	});
	;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(24)(module)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// 解压拼音库。
	// @param {Object} dict_combo, 压缩的拼音库。
	// @param {Object} 解压的拼音库。

	function buildPinyinCache(dict_combo) {
	  var hans = void 0;
	  var uncomboed = {};

	  for (var py in dict_combo) {
	    hans = dict_combo[py];
	    for (var i = 0, han, l = hans.length; i < l; i++) {
	      han = hans.charCodeAt(i);
	      if (!uncomboed.hasOwnProperty(han)) {
	        uncomboed[han] = py;
	      } else {
	        uncomboed[han] += "," + py;
	      }
	    }
	  }

	  return uncomboed;
	}

	var PINYIN_DICT = buildPinyinCache(__webpack_require__(30));
	var Pinyin = __webpack_require__(31);
	var pinyin = new Pinyin(PINYIN_DICT);

	module.exports = pinyin.convert.bind(pinyin);
	module.exports.compare = pinyin.compare.bind(pinyin);
	module.exports.STYLE_NORMAL = Pinyin.STYLE_NORMAL;
	module.exports.STYLE_TONE = Pinyin.STYLE_TONE;
	module.exports.STYLE_TONE2 = Pinyin.STYLE_TONE2;
	module.exports.STYLE_TO3NE = Pinyin.STYLE_TO3NE;
	module.exports.STYLE_INITIALS = Pinyin.STYLE_INITIALS;
	module.exports.STYLE_FIRST_LETTER = Pinyin.STYLE_FIRST_LETTER;

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  "èr": "二贰",
	  "shí": "十时实蚀",
	  "yǐ": "乙已以蚁倚",
	  "yī": "一衣医依伊揖壹",
	  "chǎng,ān,hàn": "厂",
	  "dīng,zhēng": "丁",
	  "qī": "七戚欺漆柒凄嘁",
	  "bǔ,bo": "卜",
	  "rén": "人仁",
	  "rù": "入褥",
	  "jiǔ": "九久酒玖灸韭",
	  "ér": "儿而",
	  "bā": "八巴疤叭芭捌笆",
	  "jǐ,jī": "几",
	  "le,liǎo": "了",
	  "lì": "力历厉立励利例栗粒吏沥荔俐莉砾雳痢",
	  "dāo": "刀",
	  "nǎi": "乃奶",
	  "sān": "三叁",
	  "yòu": "又右幼诱佑",
	  "yú": "于余鱼娱渔榆愚隅逾舆",
	  "shì": "士示世市式势事侍饰试视柿是适室逝释誓拭恃嗜",
	  "gān,gàn": "干",
	  "gōng": "工弓公功攻宫恭躬",
	  "kuī": "亏盔窥",
	  "tǔ": "土",
	  "cùn": "寸",
	  "dà,dài,tài": "大",
	  "cái": "才材财裁",
	  "xià": "下夏",
	  "zhàng": "丈仗帐胀障杖账",
	  "yǔ,yù,yú": "与",
	  "shàng,shǎng": "上",
	  "wàn,mò": "万",
	  "kǒu": "口",
	  "xiǎo": "小晓",
	  "jīn": "巾斤今金津筋襟",
	  "shān": "山删衫珊",
	  "qiān": "千迁牵谦签",
	  "qǐ": "乞企启起",
	  "chuān": "川穿",
	  "gè,gě": "个各",
	  "sháo": "勺芍",
	  "yì": "亿义艺忆议亦异役译易疫益谊意毅翼屹抑邑绎奕逸肄溢",
	  "jí": "及吉级极即急疾集籍棘辑嫉",
	  "fán": "凡烦矾樊",
	  "xī": "夕西吸希析牺息悉惜稀锡溪熄膝昔晰犀熙嬉蟋",
	  "wán": "丸完玩顽",
	  "me,mó,ma,yāo": "么",
	  "guǎng,ān": "广",
	  "wáng,wú": "亡",
	  "mén": "门们",
	  "shī": "尸失师诗狮施湿虱",
	  "zhī": "之支汁芝肢脂蜘",
	  "jǐ": "己挤脊",
	  "zǐ": "子紫姊籽滓",
	  "wèi": "卫未位味畏胃喂慰谓猬蔚魏",
	  "yě": "也冶野",
	  "nǚ,rǔ": "女",
	  "rèn": "刃认韧纫",
	  "fēi": "飞非啡",
	  "xí": "习席袭媳",
	  "mǎ": "马码玛",
	  "chā,chá,chǎ": "叉",
	  "fēng": "丰封疯峰锋蜂枫",
	  "xiāng": "乡香箱厢湘镶",
	  "jǐng": "井警阱",
	  "wáng,wàng": "王",
	  "kāi": "开揩",
	  "tiān": "天添",
	  "wú": "无吴芜梧蜈",
	  "fū,fú": "夫",
	  "zhuān": "专砖",
	  "yuán": "元园原圆援缘源袁猿辕",
	  "yún": "云匀耘",
	  "zhā,zā,zhá": "扎",
	  "mù": "木目牧墓幕暮慕沐募睦穆",
	  "wǔ": "五午伍武侮舞捂鹉",
	  "tīng": "厅听",
	  "bù,fǒu": "不",
	  "qū,ōu": "区",
	  "quǎn": "犬",
	  "tài": "太态泰汰",
	  "yǒu": "友",
	  "chē,jū": "车",
	  "pǐ": "匹",
	  "yóu": "尤由邮犹油游",
	  "jù": "巨拒具俱剧距惧锯聚炬",
	  "yá": "牙芽崖蚜涯衙",
	  "bǐ": "比彼笔鄙匕秕",
	  "jiē": "皆阶接街秸",
	  "hù": "互户护沪",
	  "qiè,qiē": "切",
	  "wǎ,wà": "瓦",
	  "zhǐ": "止旨址纸指趾",
	  "tún,zhūn": "屯",
	  "shǎo,shào": "少",
	  "rì": "日",
	  "zhōng,zhòng": "中",
	  "gāng": "冈刚纲缸肛",
	  "nèi,nà": "内",
	  "bèi": "贝备倍辈狈惫焙",
	  "shuǐ": "水",
	  "jiàn,xiàn": "见",
	  "niú": "牛",
	  "shǒu": "手守首",
	  "máo": "毛矛茅锚",
	  "qì": "气弃汽器迄泣",
	  "shēng": "升生声牲笙甥",
	  "cháng,zhǎng": "长",
	  "shén,shí": "什",
	  "piàn,piān": "片",
	  "pú,pū": "仆",
	  "huà,huā": "化",
	  "bì": "币必毕闭毙碧蔽弊避壁庇蓖痹璧",
	  "chóu,qiú": "仇",
	  "zhuǎ,zhǎo": "爪",
	  "jǐn,jìn": "仅",
	  "réng": "仍",
	  "fù,fǔ": "父",
	  "cóng,zòng": "从",
	  "fǎn": "反返",
	  "jiè": "介戒届界借诫",
	  "xiōng": "凶兄胸匈汹",
	  "fēn,fèn": "分",
	  "fá": "乏伐罚阀筏",
	  "cāng": "仓苍舱沧",
	  "yuè": "月阅悦跃越岳粤",
	  "shì,zhī": "氏",
	  "wù": "勿务物误悟雾坞晤",
	  "qiàn": "欠歉",
	  "fēng,fěng": "风",
	  "dān": "丹耽",
	  "wū": "乌污呜屋巫诬",
	  "fèng": "凤奉",
	  "gōu,gòu": "勾",
	  "wén": "文闻蚊",
	  "liù,lù": "六",
	  "huǒ": "火伙",
	  "fāng": "方芳",
	  "dǒu,dòu": "斗",
	  "wèi,wéi": "为",
	  "dìng": "订定锭",
	  "jì": "计记技忌际季剂迹既继寄绩妓荠寂鲫冀",
	  "xīn": "心辛欣新薪锌",
	  "chǐ,chě": "尺",
	  "yǐn": "引饮蚓瘾",
	  "chǒu": "丑",
	  "kǒng": "孔恐",
	  "duì": "队对",
	  "bàn": "办半扮伴瓣绊",
	  "yǔ,yú": "予",
	  "yǔn": "允陨",
	  "quàn": "劝",
	  "shū": "书叔殊梳舒疏输蔬抒枢淑",
	  "shuāng": "双霜",
	  "yù": "玉育狱浴预域欲遇御裕愈誉芋郁喻寓豫",
	  "huàn": "幻换唤患宦涣焕痪",
	  "kān": "刊堪勘",
	  "mò": "末沫漠墨默茉陌寞",
	  "jī": "击饥圾机肌鸡积基激讥叽唧畸箕",
	  "dǎ,dá": "打",
	  "qiǎo": "巧",
	  "zhèng,zhēng": "正症挣",
	  "pū": "扑",
	  "bā,pá": "扒",
	  "gān": "甘肝竿柑",
	  "qù": "去",
	  "rēng": "扔",
	  "gǔ": "古谷股鼓",
	  "běn": "本",
	  "jié,jiē": "节结",
	  "shù,shú,zhú": "术",
	  "bǐng": "丙柄饼秉禀",
	  "kě,kè": "可",
	  "zuǒ": "左",
	  "bù": "布步怖部埠",
	  "shí,dàn": "石",
	  "lóng": "龙聋隆咙胧窿",
	  "yà": "轧亚讶",
	  "miè": "灭蔑",
	  "píng": "平评凭瓶萍坪",
	  "dōng": "东冬",
	  "kǎ,qiǎ": "卡",
	  "běi,bèi": "北",
	  "yè": "业页夜液谒腋",
	  "jiù": "旧救就舅臼疚",
	  "shuài": "帅蟀",
	  "guī": "归规闺硅瑰",
	  "zhàn,zhān": "占",
	  "dàn": "旦但诞淡蛋氮",
	  "qiě,jū": "且",
	  "yè,xié": "叶",
	  "jiǎ": "甲钾",
	  "dīng": "叮盯",
	  "shēn": "申伸身深呻绅",
	  "hào,háo": "号",
	  "diàn": "电店垫殿玷淀惦奠",
	  "tián": "田甜恬",
	  "shǐ": "史使始驶矢屎",
	  "zhī,zhǐ": "只",
	  "yāng": "央殃秧鸯",
	  "diāo": "叼雕刁碉",
	  "jiào": "叫轿较窖酵",
	  "lìng": "另",
	  "dāo,tāo": "叨",
	  "sì": "四寺饲肆",
	  "tàn": "叹炭探碳",
	  "qiū": "丘秋蚯",
	  "hé": "禾河荷盒",
	  "fù": "付负妇附咐赴复傅富腹覆赋缚",
	  "dài": "代带贷怠袋逮戴",
	  "xiān": "仙先掀锨",
	  "yí": "仪宜姨移遗夷胰",
	  "bái": "白",
	  "zǎi,zǐ,zī": "仔",
	  "chì": "斥赤翅",
	  "tā": "他它塌",
	  "guā": "瓜刮",
	  "hū": "乎呼忽",
	  "cóng": "丛",
	  "lìng,líng,lǐng": "令",
	  "yòng": "用",
	  "shuǎi": "甩",
	  "yìn": "印",
	  "lè,yuè": "乐",
	  "jù,gōu": "句",
	  "cōng": "匆葱聪囱",
	  "fàn": "犯饭泛范贩",
	  "cè": "册厕测策",
	  "wài": "外",
	  "chù,chǔ": "处",
	  "niǎo": "鸟",
	  "bāo": "包胞苞褒",
	  "zhǔ": "主煮嘱拄",
	  "shǎn": "闪陕",
	  "lán": "兰拦栏蓝篮澜",
	  "tóu,tou": "头",
	  "huì": "汇绘贿惠慧讳诲晦秽",
	  "hàn": "汉旱捍悍焊撼翰憾",
	  "tǎo": "讨",
	  "xué": "穴学",
	  "xiě": "写",
	  "níng,nìng,zhù": "宁",
	  "ràng": "让",
	  "lǐ": "礼李里理鲤",
	  "xùn": "训讯迅汛驯逊殉",
	  "yǒng": "永咏泳勇蛹踊",
	  "mín": "民",
	  "chū": "出初",
	  "ní": "尼",
	  "sī": "司丝私斯撕嘶",
	  "liáo": "辽疗僚聊寥嘹缭",
	  "jiā": "加佳嘉枷",
	  "nú": "奴",
	  "zhào,shào": "召",
	  "biān": "边编鞭蝙",
	  "pí": "皮疲脾啤",
	  "yùn": "孕运韵酝蕴",
	  "fā,fà": "发",
	  "shèng": "圣胜剩",
	  "tái,tāi": "台苔",
	  "jiū": "纠究揪鸠",
	  "mǔ": "母亩牡拇姆",
	  "káng,gāng": "扛",
	  "xíng": "刑形型邢",
	  "dòng": "动冻栋洞",
	  "kǎo": "考烤拷",
	  "kòu": "扣寇",
	  "tuō": "托拖脱",
	  "lǎo": "老",
	  "gǒng": "巩汞拱",
	  "zhí": "执直侄值职植",
	  "kuò": "扩阔廓",
	  "yáng": "扬阳杨洋",
	  "dì,de": "地",
	  "sǎo,sào": "扫",
	  "chǎng,cháng": "场",
	  "ěr": "耳尔饵",
	  "máng": "芒忙盲茫",
	  "xiǔ": "朽",
	  "pǔ,pò,pō,piáo": "朴",
	  "quán": "权全泉拳痊",
	  "guò,guo,guō": "过",
	  "chén": "臣尘辰沉陈晨忱",
	  "zài": "再在",
	  "xié": "协胁斜携鞋谐",
	  "yā,yà": "压",
	  "yàn": "厌艳宴验雁焰砚唁谚堰",
	  "yǒu,yòu": "有",
	  "cún": "存",
	  "bǎi": "百摆",
	  "kuā,kuà": "夸",
	  "jiàng": "匠酱",
	  "duó": "夺踱",
	  "huī": "灰挥恢辉徽",
	  "dá": "达",
	  "sǐ": "死",
	  "liè": "列劣烈猎",
	  "guǐ": "轨鬼诡",
	  "xié,yá,yé,yú,xú": "邪",
	  "jiá,jiā,gā,xiá": "夹",
	  "chéng": "成呈诚承城程惩橙",
	  "mài": "迈麦卖",
	  "huà,huá": "划",
	  "zhì": "至志帜制质治致秩智置挚掷窒滞稚",
	  "cǐ": "此",
	  "zhēn": "贞针侦珍真斟榛",
	  "jiān": "尖奸歼坚肩艰兼煎",
	  "guāng": "光",
	  "dāng,dàng": "当",
	  "zǎo": "早枣澡蚤藻",
	  "tù,tǔ": "吐",
	  "xià,hè": "吓",
	  "chóng": "虫崇",
	  "tuán": "团",
	  "tóng,tòng": "同",
	  "qū,qǔ": "曲",
	  "diào": "吊钓掉",
	  "yīn": "因阴音姻茵",
	  "chī": "吃嗤痴",
	  "ma,má,mǎ": "吗",
	  "yǔ": "屿宇羽",
	  "fān": "帆翻",
	  "huí": "回茴蛔",
	  "qǐ,kǎi": "岂",
	  "zé": "则责",
	  "suì": "岁碎穗祟遂隧",
	  "ròu": "肉",
	  "zhū,shú": "朱",
	  "wǎng": "网往枉",
	  "nián": "年",
	  "diū": "丢",
	  "shé": "舌",
	  "zhú": "竹逐烛",
	  "qiáo": "乔侨桥瞧荞憔",
	  "wěi": "伟伪苇纬萎",
	  "chuán,zhuàn": "传",
	  "pāng": "乓",
	  "pīng": "乒",
	  "xiū,xǔ": "休",
	  "fú": "伏扶俘浮符幅福凫芙袱辐蝠",
	  "yōu": "优忧悠幽",
	  "yán": "延严言岩炎沿盐颜阎蜒檐",
	  "jiàn": "件建荐贱剑健舰践鉴键箭涧",
	  "rèn,rén": "任",
	  "huá,huà,huā": "华",
	  "jià,jiè,jie": "价",
	  "shāng": "伤商",
	  "fèn,bīn": "份",
	  "fǎng": "仿访纺",
	  "yǎng,áng": "仰",
	  "zì": "自字",
	  "xiě,xuè": "血",
	  "xiàng": "向项象像橡",
	  "sì,shì": "似",
	  "hòu": "后厚候",
	  "zhōu": "舟州周洲",
	  "háng,xíng": "行",
	  "huì,kuài": "会",
	  "shā": "杀纱杉砂",
	  "hé,gě": "合",
	  "zhào": "兆赵照罩",
	  "zhòng": "众仲",
	  "yé": "爷",
	  "sǎn": "伞",
	  "chuàng,chuāng": "创",
	  "duǒ": "朵躲",
	  "wēi": "危威微偎薇巍",
	  "xún": "旬寻巡询循",
	  "zá": "杂砸",
	  "míng": "名明鸣铭螟",
	  "duō": "多哆",
	  "zhēng": "争征睁筝蒸怔狰",
	  "sè": "色涩瑟",
	  "zhuàng": "壮状撞",
	  "chōng,chòng": "冲",
	  "bīng": "冰兵",
	  "zhuāng": "庄装妆桩",
	  "qìng": "庆",
	  "liú": "刘留流榴琉硫瘤",
	  "qí,jì,zī,zhāi": "齐",
	  "cì": "次赐",
	  "jiāo": "交郊浇娇骄胶椒焦蕉礁",
	  "chǎn": "产铲阐",
	  "wàng": "妄忘旺望",
	  "chōng": "充",
	  "wèn": "问",
	  "chuǎng": "闯",
	  "yáng,xiáng": "羊",
	  "bìng,bīng": "并",
	  "dēng": "灯登蹬",
	  "mǐ": "米",
	  "guān": "关官棺",
	  "hàn,hán": "汗",
	  "jué": "决绝掘诀爵",
	  "jiāng": "江姜僵缰",
	  "tāng,shāng": "汤",
	  "chí": "池驰迟持弛",
	  "xīng,xìng": "兴",
	  "zhái": "宅",
	  "ān": "安氨庵鞍",
	  "jiǎng": "讲奖桨蒋",
	  "jūn": "军均君钧",
	  "xǔ,hǔ": "许",
	  "fěng": "讽",
	  "lùn,lún": "论",
	  "nóng": "农浓脓",
	  "shè": "设社舍涉赦",
	  "nà,nǎ,nèi,nā": "那",
	  "jìn,jǐn": "尽",
	  "dǎo": "导岛蹈捣祷",
	  "sūn,xùn": "孙",
	  "zhèn": "阵振震镇",
	  "shōu": "收",
	  "fáng": "防妨房肪",
	  "rú": "如儒蠕",
	  "mā": "妈",
	  "xì,hū": "戏",
	  "hǎo,hào": "好",
	  "tā,jiě": "她",
	  "guān,guàn": "观冠",
	  "huān": "欢",
	  "hóng,gōng": "红",
	  "mǎi": "买",
	  "xiān,qiàn": "纤",
	  "jì,jǐ": "纪济",
	  "yuē,yāo": "约",
	  "shòu": "寿受授售兽瘦",
	  "nòng,lòng": "弄",
	  "jìn": "进近晋浸",
	  "wéi": "违围唯维桅",
	  "yuǎn,yuàn": "远",
	  "tūn": "吞",
	  "tán": "坛谈痰昙谭潭檀",
	  "fǔ": "抚斧府俯辅腐甫脯",
	  "huài,pēi,pī,péi": "坏",
	  "rǎo": "扰",
	  "pī": "批披坯霹",
	  "zhǎo": "找沼",
	  "chě": "扯",
	  "zǒu": "走",
	  "chāo": "抄钞超",
	  "bà": "坝爸霸",
	  "gòng": "贡",
	  "zhé,shé,zhē": "折",
	  "qiǎng,qiāng,chēng": "抢",
	  "zhuā": "抓",
	  "xiào": "孝笑效哮啸",
	  "pāo": "抛",
	  "tóu": "投",
	  "kàng": "抗炕",
	  "fén": "坟焚",
	  "kēng": "坑",
	  "dǒu": "抖陡蚪",
	  "ké,qiào": "壳",
	  "fāng,fáng": "坊",
	  "niǔ": "扭纽钮",
	  "kuài": "块快筷",
	  "bǎ,bà": "把",
	  "bào": "报抱爆豹",
	  "jié": "劫杰洁捷截竭",
	  "què": "却确鹊",
	  "huā": "花",
	  "fēn": "芬吩纷氛",
	  "qín": "芹琴禽勤秦擒",
	  "láo": "劳牢",
	  "lú": "芦炉卢庐颅",
	  "gān,gǎn": "杆",
	  "kè": "克刻客课",
	  "sū,sù": "苏",
	  "dù": "杜渡妒镀",
	  "gàng,gāng": "杠",
	  "cūn": "村",
	  "qiú": "求球囚",
	  "xìng": "杏幸性姓",
	  "gèng,gēng": "更",
	  "liǎng": "两",
	  "lì,lí": "丽",
	  "shù": "束述树竖恕庶墅漱",
	  "dòu": "豆逗痘",
	  "hái,huán": "还",
	  "fǒu,pǐ": "否",
	  "lái": "来莱",
	  "lián": "连怜帘莲联廉镰",
	  "xiàn,xuán": "县",
	  "zhù,chú": "助",
	  "dāi": "呆",
	  "kuàng": "旷况矿框眶",
	  "ya,yā": "呀",
	  "zú": "足族",
	  "dūn": "吨蹲墩",
	  "kùn": "困",
	  "nán": "男",
	  "chǎo,chāo": "吵",
	  "yuán,yún,yùn": "员",
	  "chuàn": "串",
	  "chuī": "吹炊",
	  "ba,bā": "吧",
	  "hǒu": "吼",
	  "gǎng": "岗",
	  "bié,biè": "别",
	  "dīng,dìng": "钉",
	  "gào": "告",
	  "wǒ": "我",
	  "luàn": "乱",
	  "tū": "秃突凸",
	  "xiù": "秀袖绣锈嗅",
	  "gū,gù": "估",
	  "měi": "每美",
	  "hé,hē,hè": "何",
	  "tǐ,tī,bèn": "体",
	  "bó,bǎi,bà": "伯",
	  "zuò": "作坐座做",
	  "líng": "伶灵铃陵零龄玲凌菱蛉翎",
	  "dī": "低堤滴",
	  "yòng,yōng": "佣",
	  "nǐ": "你拟",
	  "zhù": "住注驻柱祝铸贮蛀",
	  "zào": "皂灶造燥躁噪",
	  "fó,fú,bì,bó": "佛",
	  "chè": "彻撤澈",
	  "tuǒ": "妥椭",
	  "lín": "邻林临琳磷鳞",
	  "hán": "含寒函涵韩",
	  "chà": "岔衩",
	  "cháng": "肠尝常偿",
	  "dù,dǔ": "肚",
	  "guī,jūn,qiū": "龟",
	  "miǎn": "免勉娩冕缅",
	  "jiǎo,jué": "角",
	  "kuáng": "狂",
	  "tiáo,tiāo": "条",
	  "luǎn": "卵",
	  "yíng": "迎盈营蝇赢荧莹萤",
	  "xì,jì": "系",
	  "chuáng": "床",
	  "kù": "库裤酷",
	  "yìng,yīng": "应",
	  "lěng": "冷",
	  "zhè,zhèi": "这",
	  "xù": "序叙绪续絮蓄旭恤酗婿",
	  "xián": "闲贤弦咸衔嫌涎舷",
	  "jiān,jiàn": "间监",
	  "pàn": "判盼叛畔",
	  "mēn,mèn": "闷",
	  "wāng": "汪",
	  "dì,tì,tuí": "弟",
	  "shā,shà": "沙",
	  "shà,shā": "煞",
	  "càn": "灿",
	  "wò": "沃卧握",
	  "méi,mò": "没",
	  "gōu": "沟钩",
	  "shěn,chén": "沈",
	  "huái": "怀槐徊淮",
	  "sòng": "宋送诵颂讼",
	  "hóng": "宏虹洪鸿",
	  "qióng": "穷琼",
	  "zāi": "灾栽",
	  "liáng": "良梁粮粱",
	  "zhèng": "证郑政",
	  "bǔ": "补捕哺",
	  "sù": "诉肃素速塑粟溯",
	  "shí,zhì": "识",
	  "cí": "词辞慈磁祠瓷雌",
	  "zhěn": "诊枕疹",
	  "niào,suī": "尿",
	  "céng": "层",
	  "jú": "局菊橘",
	  "wěi,yǐ": "尾",
	  "zhāng": "张章彰樟",
	  "gǎi": "改",
	  "lù": "陆录鹿路赂",
	  "ē,ā": "阿",
	  "zǔ": "阻组祖诅",
	  "miào": "妙庙",
	  "yāo": "妖腰邀夭吆",
	  "nǔ": "努",
	  "jìn,jìng": "劲",
	  "rěn": "忍",
	  "qū": "驱屈岖蛆躯",
	  "chún": "纯唇醇",
	  "nà": "纳钠捺",
	  "bó": "驳脖博搏膊舶渤",
	  "zòng,zǒng": "纵",
	  "wén,wèn": "纹",
	  "lǘ": "驴",
	  "huán": "环",
	  "qīng": "青轻倾清蜻氢卿",
	  "xiàn": "现限线宪陷馅羡献腺",
	  "biǎo": "表",
	  "mǒ,mò,mā": "抹",
	  "lǒng": "拢垄",
	  "dān,dàn,dǎn": "担",
	  "bá": "拔跋",
	  "jiǎn": "拣茧俭捡检减剪简柬碱",
	  "tǎn": "坦毯袒",
	  "chōu": "抽",
	  "yā": "押鸦鸭",
	  "guǎi": "拐",
	  "pāi": "拍",
	  "zhě": "者",
	  "dǐng": "顶鼎",
	  "yōng": "拥庸",
	  "chāi,cā": "拆",
	  "dǐ": "抵",
	  "jū,gōu": "拘",
	  "lā": "垃",
	  "lā,lá": "拉",
	  "bàn,pàn": "拌",
	  "zhāo": "招昭",
	  "pō": "坡泼颇",
	  "bō": "拨波玻菠播",
	  "zé,zhái": "择",
	  "tái": "抬",
	  "qí,jī": "其奇",
	  "qǔ": "取娶",
	  "kǔ": "苦",
	  "mào": "茂贸帽貌",
	  "ruò,rě": "若",
	  "miáo": "苗描瞄",
	  "píng,pēng": "苹",
	  "yīng": "英樱鹰莺婴缨鹦",
	  "qié": "茄",
	  "jīng": "茎京经惊晶睛精荆兢鲸",
	  "zhī,qí": "枝",
	  "bēi": "杯悲碑卑",
	  "guì,jǔ": "柜",
	  "bǎn": "板版",
	  "sōng": "松",
	  "qiāng": "枪腔",
	  "gòu": "构购够垢",
	  "sàng,sāng": "丧",
	  "huà": "画话桦",
	  "huò": "或货获祸惑霍",
	  "cì,cī": "刺",
	  "yǔ,yù": "雨语",
	  "bēn,bèn": "奔",
	  "fèn": "奋粪愤忿",
	  "hōng": "轰烘",
	  "qī,qì": "妻",
	  "ōu": "欧殴鸥",
	  "qǐng": "顷请",
	  "zhuǎn,zhuàn,zhuǎi": "转",
	  "zhǎn": "斩盏展",
	  "ruǎn": "软",
	  "lún": "轮仑伦沦",
	  "dào": "到盗悼道稻",
	  "chǐ": "齿耻侈",
	  "kěn": "肯垦恳啃",
	  "hǔ": "虎",
	  "xiē,suò": "些",
	  "lǔ": "虏鲁卤",
	  "shèn": "肾渗慎",
	  "shàng": "尚",
	  "guǒ": "果裹",
	  "kūn": "昆坤",
	  "guó": "国",
	  "chāng": "昌猖",
	  "chàng": "畅唱",
	  "diǎn": "典点碘",
	  "gù": "固故顾雇",
	  "áng": "昂",
	  "zhōng": "忠终钟盅衷",
	  "ne,ní": "呢",
	  "àn": "岸按案暗",
	  "tiě,tiē,tiè,": "帖",
	  "luó": "罗萝锣箩骡螺逻",
	  "kǎi": "凯慨",
	  "lǐng,líng": "岭",
	  "bài": "败拜",
	  "tú": "图徒途涂屠",
	  "chuí": "垂锤捶",
	  "zhī,zhì": "知织",
	  "guāi": "乖",
	  "gǎn": "秆赶敢感橄",
	  "hé,hè,huó,huò,hú": "和",
	  "gòng,gōng": "供共",
	  "wěi,wēi": "委",
	  "cè,zè,zhāi": "侧",
	  "pèi": "佩配沛",
	  "pò,pǎi": "迫",
	  "de,dì,dí": "的",
	  "pá": "爬",
	  "suǒ": "所索锁琐",
	  "jìng": "径竞竟敬静境镜靖",
	  "mìng": "命",
	  "cǎi,cài": "采",
	  "niàn": "念",
	  "tān": "贪摊滩瘫",
	  "rǔ": "乳辱",
	  "pín": "贫",
	  "fū": "肤麸孵敷",
	  "fèi": "肺废沸费吠",
	  "zhǒng": "肿",
	  "péng": "朋棚蓬膨硼鹏澎篷",
	  "fú,fù": "服",
	  "féi": "肥",
	  "hūn": "昏婚荤",
	  "tù": "兔",
	  "hú": "狐胡壶湖蝴弧葫",
	  "gǒu": "狗苟",
	  "bǎo": "饱宝保",
	  "xiǎng": "享响想",
	  "biàn": "变遍辨辩辫",
	  "dǐ,de": "底",
	  "jìng,chēng": "净",
	  "fàng": "放",
	  "nào": "闹",
	  "zhá": "闸铡",
	  "juàn,juǎn": "卷",
	  "quàn,xuàn": "券",
	  "dān,shàn,chán": "单",
	  "chǎo": "炒",
	  "qiǎn,jiān": "浅",
	  "fǎ": "法",
	  "xiè,yì": "泄",
	  "lèi": "泪类",
	  "zhān": "沾粘毡瞻",
	  "pō,bó": "泊",
	  "pào,pāo": "泡",
	  "xiè": "泻卸屑械谢懈蟹",
	  "ní,nì": "泥",
	  "zé,shì": "泽",
	  "pà": "怕帕",
	  "guài": "怪",
	  "zōng": "宗棕踪",
	  "shěn": "审婶",
	  "zhòu": "宙昼皱骤咒",
	  "kōng,kòng,kǒng": "空",
	  "láng,làng": "郎",
	  "chèn": "衬趁",
	  "gāi": "该",
	  "xiáng,yáng": "详",
	  "lì,dài": "隶",
	  "jū": "居鞠驹",
	  "shuā,shuà": "刷",
	  "mèng": "孟梦",
	  "gū": "孤姑辜咕沽菇箍",
	  "jiàng,xiáng": "降",
	  "mèi": "妹昧媚",
	  "jiě": "姐",
	  "jià": "驾架嫁稼",
	  "cān,shēn,cēn,sān": "参",
	  "liàn": "练炼恋链",
	  "xì": "细隙",
	  "shào": "绍哨",
	  "tuó": "驼驮鸵",
	  "guàn": "贯惯灌罐",
	  "zòu": "奏揍",
	  "chūn": "春椿",
	  "bāng": "帮邦梆",
	  "dú,dài": "毒",
	  "guà": "挂卦褂",
	  "kuǎ": "垮",
	  "kuà,kū": "挎",
	  "náo": "挠",
	  "dǎng,dàng": "挡",
	  "shuān": "拴栓",
	  "tǐng": "挺艇",
	  "kuò,guā": "括",
	  "shí,shè": "拾",
	  "tiāo,tiǎo": "挑",
	  "wā": "挖蛙洼",
	  "pīn": "拼",
	  "shèn,shén": "甚",
	  "mǒu": "某",
	  "nuó": "挪",
	  "gé": "革阁格隔",
	  "xiàng,hàng": "巷",
	  "cǎo": "草",
	  "chá": "茶察茬",
	  "dàng": "荡档",
	  "huāng": "荒慌",
	  "róng": "荣绒容熔融茸蓉溶榕",
	  "nán,nā": "南",
	  "biāo": "标彪膘",
	  "yào": "药耀",
	  "kū": "枯哭窟",
	  "xiāng,xiàng": "相",
	  "chá,zhā": "查",
	  "liǔ": "柳",
	  "bǎi,bó,bò": "柏",
	  "yào,yāo": "要",
	  "wāi": "歪",
	  "yán,yàn": "研",
	  "lí": "厘狸离犁梨璃黎漓篱",
	  "qì,qiè": "砌",
	  "miàn": "面",
	  "kǎn": "砍坎",
	  "shuǎ": "耍",
	  "nài": "耐奈",
	  "cán": "残蚕惭",
	  "zhàn": "战站栈绽蘸",
	  "bèi,bēi": "背",
	  "lǎn": "览懒揽缆榄",
	  "shěng,xǐng": "省",
	  "xiāo,xuē": "削",
	  "zhǎ": "眨",
	  "hǒng,hōng,hòng": "哄",
	  "xiǎn": "显险",
	  "mào,mò": "冒",
	  "yǎ,yā": "哑",
	  "yìng": "映硬",
	  "zuó": "昨",
	  "xīng": "星腥猩",
	  "pā": "趴",
	  "guì": "贵桂跪刽",
	  "sī,sāi": "思",
	  "xiā": "虾瞎",
	  "mǎ,mā,mà": "蚂",
	  "suī": "虽",
	  "pǐn": "品",
	  "mà": "骂",
	  "huá,huā": "哗",
	  "yè,yàn,yān": "咽",
	  "zán,zǎ": "咱",
	  "hā,hǎ,hà": "哈",
	  "yǎo": "咬舀",
	  "nǎ,něi,na,né": "哪",
	  "hāi,ké": "咳",
	  "xiá": "峡狭霞匣侠暇辖",
	  "gǔ,gū": "骨",
	  "gāng,gàng": "钢",
	  "tiē": "贴",
	  "yào,yuè": "钥",
	  "kàn,kān": "看",
	  "jǔ": "矩举",
	  "zěn": "怎",
	  "xuǎn": "选癣",
	  "zhòng,zhǒng,chóng": "种",
	  "miǎo": "秒渺藐",
	  "kē": "科棵颗磕蝌",
	  "biàn,pián": "便",
	  "zhòng,chóng": "重",
	  "liǎ": "俩",
	  "duàn": "段断缎锻",
	  "cù": "促醋簇",
	  "shùn": "顺瞬",
	  "xiū": "修羞",
	  "sú": "俗",
	  "qīn": "侵钦",
	  "xìn,shēn": "信",
	  "huáng": "皇黄煌凰惶蝗蟥",
	  "zhuī,duī": "追",
	  "jùn": "俊峻骏竣",
	  "dài,dāi": "待",
	  "xū": "须虚需",
	  "hěn": "很狠",
	  "dùn": "盾顿钝",
	  "lǜ": "律虑滤氯",
	  "pén": "盆",
	  "shí,sì,yì": "食",
	  "dǎn": "胆",
	  "táo": "逃桃陶萄淘",
	  "pàng": "胖",
	  "mài,mò": "脉",
	  "dú": "独牍",
	  "jiǎo": "狡饺绞脚搅",
	  "yuàn": "怨院愿",
	  "ráo": "饶",
	  "wān": "弯湾豌",
	  "āi": "哀哎埃",
	  "jiāng,jiàng": "将浆",
	  "tíng": "亭庭停蜓廷",
	  "liàng": "亮谅辆晾",
	  "dù,duó": "度",
	  "chuāng": "疮窗",
	  "qīn,qìng": "亲",
	  "zī": "姿资滋咨",
	  "dì": "帝递第蒂缔",
	  "chà,chā,chāi,cī": "差",
	  "yǎng": "养氧痒",
	  "qián": "前钱钳潜黔",
	  "mí": "迷谜靡",
	  "nì": "逆昵匿腻",
	  "zhà,zhá": "炸",
	  "zǒng": "总",
	  "làn": "烂滥",
	  "pào,páo,bāo": "炮",
	  "tì": "剃惕替屉涕",
	  "sǎ,xǐ": "洒",
	  "zhuó": "浊啄灼茁卓酌",
	  "xǐ,xiǎn": "洗",
	  "qià": "洽恰",
	  "pài": "派湃",
	  "huó": "活",
	  "rǎn": "染",
	  "héng": "恒衡",
	  "hún": "浑魂",
	  "nǎo": "恼脑",
	  "jué,jiào": "觉",
	  "hèn": "恨",
	  "xuān": "宣轩喧",
	  "qiè": "窃怯",
	  "biǎn,piān": "扁",
	  "ǎo": "袄",
	  "shén": "神",
	  "shuō,shuì,yuè": "说",
	  "tuì": "退蜕",
	  "chú": "除厨锄雏橱",
	  "méi": "眉梅煤霉玫枚媒楣",
	  "hái": "孩",
	  "wá": "娃",
	  "lǎo,mǔ": "姥",
	  "nù": "怒",
	  "hè": "贺赫褐鹤",
	  "róu": "柔揉蹂",
	  "bǎng": "绑膀",
	  "lěi": "垒蕾儡",
	  "rào": "绕",
	  "gěi,jǐ": "给",
	  "luò": "骆洛",
	  "luò,lào": "络",
	  "tǒng": "统桶筒捅",
	  "gēng": "耕羹",
	  "hào": "耗浩",
	  "bān": "班般斑搬扳颁",
	  "zhū": "珠株诸猪蛛",
	  "lāo": "捞",
	  "fěi": "匪诽",
	  "zǎi,zài": "载",
	  "mái,mán": "埋",
	  "shāo,shào": "捎稍",
	  "zhuō": "捉桌拙",
	  "niē": "捏",
	  "kǔn": "捆",
	  "dū,dōu": "都",
	  "sǔn": "损笋",
	  "juān": "捐鹃",
	  "zhé": "哲辙",
	  "rè": "热",
	  "wǎn": "挽晚碗惋婉",
	  "ái,āi": "挨",
	  "mò,mù": "莫",
	  "è,wù,ě,wū": "恶",
	  "tóng": "桐铜童彤瞳",
	  "xiào,jiào": "校",
	  "hé,hú": "核",
	  "yàng": "样漾",
	  "gēn": "根跟",
	  "gē": "哥鸽割歌戈",
	  "chǔ": "础储楚",
	  "pò": "破魄",
	  "tào": "套",
	  "chái": "柴豺",
	  "dǎng": "党",
	  "mián": "眠绵棉",
	  "shài": "晒",
	  "jǐn": "紧锦谨",
	  "yūn,yùn": "晕",
	  "huàng,huǎng": "晃",
	  "shǎng": "晌赏",
	  "ēn": "恩",
	  "ài,āi": "唉",
	  "ā,á,ǎ,à,a": "啊",
	  "bà,ba,pí": "罢",
	  "zéi": "贼",
	  "tiě": "铁",
	  "zuàn,zuān": "钻",
	  "qiān,yán": "铅",
	  "quē": "缺",
	  "tè": "特",
	  "chéng,shèng": "乘",
	  "dí": "敌笛涤嘀嫡",
	  "zū": "租",
	  "chèng": "秤",
	  "mì,bì": "秘泌",
	  "chēng,chèn,chèng": "称",
	  "tòu": "透",
	  "zhài": "债寨",
	  "dào,dǎo": "倒",
	  "tǎng,cháng": "倘",
	  "chàng,chāng": "倡",
	  "juàn": "倦绢眷",
	  "chòu,xiù": "臭",
	  "shè,yè,yì": "射",
	  "xú": "徐",
	  "háng": "航杭",
	  "ná": "拿",
	  "wēng": "翁嗡",
	  "diē": "爹跌",
	  "ài": "爱碍艾隘",
	  "gē,gé": "胳搁",
	  "cuì": "脆翠悴粹",
	  "zàng": "脏葬",
	  "láng": "狼廊琅榔",
	  "féng": "逢",
	  "è": "饿扼遏愕噩鳄",
	  "shuāi,cuī": "衰",
	  "gāo": "高糕羔篙",
	  "zhǔn": "准",
	  "bìng": "病",
	  "téng": "疼腾誊藤",
	  "liáng,liàng": "凉量",
	  "táng": "唐堂塘膛糖棠搪",
	  "pōu": "剖",
	  "chù,xù": "畜",
	  "páng,bàng": "旁磅",
	  "lǚ": "旅屡吕侣铝缕履",
	  "fěn": "粉",
	  "liào": "料镣",
	  "shāo": "烧",
	  "yān": "烟淹",
	  "tāo": "涛掏滔",
	  "lào": "涝酪",
	  "zhè": "浙蔗",
	  "xiāo": "消宵销萧硝箫嚣",
	  "hǎi": "海",
	  "zhǎng,zhàng": "涨",
	  "làng": "浪",
	  "rùn": "润闰",
	  "tàng": "烫",
	  "yǒng,chōng": "涌",
	  "huǐ": "悔毁",
	  "qiāo,qiǎo": "悄",
	  "hài": "害亥骇",
	  "jiā,jia,jie": "家",
	  "kuān": "宽",
	  "bīn": "宾滨彬缤濒",
	  "zhǎi": "窄",
	  "lǎng": "朗",
	  "dú,dòu": "读",
	  "zǎi": "宰",
	  "shàn,shān": "扇",
	  "shān,shàn": "苫",
	  "wà": "袜",
	  "xiáng": "祥翔",
	  "shuí": "谁",
	  "páo": "袍咆",
	  "bèi,pī": "被",
	  "tiáo,diào,zhōu": "调",
	  "yuān": "冤鸳渊",
	  "bō,bāo": "剥",
	  "ruò": "弱",
	  "péi": "陪培赔",
	  "niáng": "娘",
	  "tōng": "通",
	  "néng,nài": "能",
	  "nán,nàn,nuó": "难",
	  "sāng": "桑",
	  "pěng": "捧",
	  "dǔ": "堵赌睹",
	  "yǎn": "掩眼演衍",
	  "duī": "堆",
	  "pái,pǎi": "排",
	  "tuī": "推",
	  "jiào,jiāo": "教",
	  "lüè": "掠略",
	  "jù,jū": "据",
	  "kòng": "控",
	  "zhù,zhuó,zhe": "著",
	  "jūn,jùn": "菌",
	  "lè,lēi": "勒",
	  "méng": "萌盟檬朦",
	  "cài": "菜",
	  "tī": "梯踢剔",
	  "shāo,sào": "梢",
	  "fù,pì": "副",
	  "piào,piāo": "票",
	  "shuǎng": "爽",
	  "shèng,chéng": "盛",
	  "què,qiāo,qiǎo": "雀",
	  "xuě": "雪",
	  "chí,shi": "匙",
	  "xuán": "悬玄漩",
	  "mī,mí": "眯",
	  "la,lā": "啦",
	  "shé,yí": "蛇",
	  "lèi,léi,lěi": "累",
	  "zhǎn,chán": "崭",
	  "quān,juàn,juān": "圈",
	  "yín": "银吟淫",
	  "bèn": "笨",
	  "lóng,lǒng": "笼",
	  "mǐn": "敏皿闽悯",
	  "nín": "您",
	  "ǒu": "偶藕",
	  "tōu": "偷",
	  "piān": "偏篇翩",
	  "dé,děi,de": "得",
	  "jiǎ,jià": "假",
	  "pán": "盘",
	  "chuán": "船",
	  "cǎi": "彩睬踩",
	  "lǐng": "领",
	  "liǎn": "脸敛",
	  "māo,máo": "猫",
	  "měng": "猛锰",
	  "cāi": "猜",
	  "háo": "毫豪壕嚎",
	  "má": "麻",
	  "guǎn": "馆管",
	  "còu": "凑",
	  "hén": "痕",
	  "kāng": "康糠慷",
	  "xuán,xuàn": "旋",
	  "zhe,zhuó,zháo,zhāo": "着",
	  "lǜ,shuài": "率",
	  "gài,gě,hé": "盖",
	  "cū": "粗",
	  "lín,lìn": "淋",
	  "qú,jù": "渠",
	  "jiàn,jiān": "渐溅",
	  "hùn,hún": "混",
	  "pó": "婆",
	  "qíng": "情晴擎",
	  "cǎn": "惨",
	  "sù,xiǔ,xiù": "宿",
	  "yáo": "窑谣摇遥肴姚",
	  "móu": "谋",
	  "mì": "密蜜觅",
	  "huǎng": "谎恍幌",
	  "tán,dàn": "弹",
	  "suí": "随",
	  "yǐn,yìn": "隐",
	  "jǐng,gěng": "颈",
	  "shéng": "绳",
	  "qí": "骑棋旗歧祈脐畦崎鳍",
	  "chóu": "绸酬筹稠愁畴",
	  "lǜ,lù": "绿",
	  "dā": "搭",
	  "kuǎn": "款",
	  "tǎ": "塔",
	  "qū,cù": "趋",
	  "tí,dī,dǐ": "提",
	  "jiē,qì": "揭",
	  "xǐ": "喜徙",
	  "sōu": "搜艘",
	  "chā": "插",
	  "lǒu,lōu": "搂",
	  "qī,jī": "期",
	  "rě": "惹",
	  "sàn,sǎn": "散",
	  "dǒng": "董懂",
	  "gě,gé": "葛",
	  "pú": "葡菩蒲",
	  "zhāo,cháo": "朝",
	  "luò,là,lào": "落",
	  "kuí": "葵魁",
	  "bàng": "棒傍谤",
	  "yǐ,yī": "椅",
	  "sēn": "森",
	  "gùn,hùn": "棍",
	  "bī": "逼",
	  "zhí,shi": "殖",
	  "xià,shà": "厦",
	  "liè,liě": "裂",
	  "xióng": "雄熊",
	  "zàn": "暂赞",
	  "yǎ": "雅",
	  "chǎng": "敞",
	  "zhǎng": "掌",
	  "shǔ": "暑鼠薯黍蜀署曙",
	  "zuì": "最罪醉",
	  "hǎn": "喊罕",
	  "jǐng,yǐng": "景",
	  "lǎ": "喇",
	  "pēn,pèn": "喷",
	  "pǎo,páo": "跑",
	  "chuǎn": "喘",
	  "hē,hè,yè": "喝",
	  "hóu": "喉猴",
	  "pù,pū": "铺",
	  "hēi": "黑",
	  "guō": "锅郭",
	  "ruì": "锐瑞",
	  "duǎn": "短",
	  "é": "鹅额讹俄",
	  "děng": "等",
	  "kuāng": "筐",
	  "shuì": "税睡",
	  "zhù,zhú": "筑",
	  "shāi": "筛",
	  "dá,dā": "答",
	  "ào": "傲澳懊",
	  "pái": "牌徘",
	  "bǎo,bǔ,pù": "堡",
	  "ào,yù": "奥",
	  "fān,pān": "番",
	  "là,xī": "腊",
	  "huá": "猾滑",
	  "rán": "然燃",
	  "chán": "馋缠蝉",
	  "mán": "蛮馒",
	  "tòng": "痛",
	  "shàn": "善擅膳赡",
	  "zūn": "尊遵",
	  "pǔ": "普谱圃浦",
	  "gǎng,jiǎng": "港",
	  "céng,zēng": "曾",
	  "wēn": "温瘟",
	  "kě": "渴",
	  "zhā": "渣",
	  "duò": "惰舵跺",
	  "gài": "溉概丐钙",
	  "kuì": "愧",
	  "yú,tōu": "愉",
	  "wō": "窝蜗",
	  "cuàn": "窜篡",
	  "qún": "裙群",
	  "qiáng,qiǎng,jiàng": "强",
	  "shǔ,zhǔ": "属",
	  "zhōu,yù": "粥",
	  "sǎo": "嫂",
	  "huǎn": "缓",
	  "piàn": "骗",
	  "mō": "摸",
	  "shè,niè": "摄",
	  "tián,zhèn": "填",
	  "gǎo": "搞稿镐",
	  "suàn": "蒜算",
	  "méng,mēng,měng": "蒙",
	  "jìn,jīn": "禁",
	  "lóu": "楼娄",
	  "lài": "赖癞",
	  "lù,liù": "碌",
	  "pèng": "碰",
	  "léi": "雷",
	  "báo": "雹",
	  "dū": "督",
	  "nuǎn": "暖",
	  "xiē": "歇楔蝎",
	  "kuà": "跨胯",
	  "tiào,táo": "跳",
	  "é,yǐ": "蛾",
	  "sǎng": "嗓",
	  "qiǎn": "遣谴",
	  "cuò": "错挫措锉",
	  "ǎi": "矮蔼",
	  "shǎ": "傻",
	  "cuī": "催摧崔",
	  "tuǐ": "腿",
	  "chù": "触矗",
	  "jiě,jiè,xiè": "解",
	  "shù,shǔ,shuò": "数",
	  "mǎn": "满",
	  "liū,liù": "溜",
	  "gǔn": "滚",
	  "sāi,sài,sè": "塞",
	  "pì,bì": "辟",
	  "dié": "叠蝶谍碟",
	  "fèng,féng": "缝",
	  "qiáng": "墙",
	  "piě,piē": "撇",
	  "zhāi": "摘斋",
	  "shuāi": "摔",
	  "mó,mú": "模",
	  "bǎng,bàng": "榜",
	  "zhà": "榨乍诈",
	  "niàng": "酿",
	  "zāo": "遭糟",
	  "suān": "酸",
	  "shang,cháng": "裳",
	  "sòu": "嗽",
	  "là": "蜡辣",
	  "qiāo": "锹敲跷",
	  "zhuàn": "赚撰",
	  "wěn": "稳吻紊",
	  "bí": "鼻荸",
	  "mó": "膜魔馍摹蘑",
	  "xiān,xiǎn": "鲜",
	  "yí,nǐ": "疑",
	  "gāo,gào": "膏",
	  "zhē": "遮",
	  "duān": "端",
	  "màn": "漫慢曼幔",
	  "piāo,piào,piǎo": "漂",
	  "lòu": "漏陋",
	  "sài": "赛",
	  "nèn": "嫩",
	  "dèng": "凳邓瞪",
	  "suō,sù": "缩",
	  "qù,cù": "趣",
	  "sā,sǎ": "撒",
	  "tàng,tāng": "趟",
	  "chēng": "撑",
	  "zēng": "增憎",
	  "cáo": "槽曹",
	  "héng,hèng": "横",
	  "piāo": "飘",
	  "mán,mén": "瞒",
	  "tí": "题蹄啼",
	  "yǐng": "影颖",
	  "bào,pù": "暴",
	  "tà": "踏蹋",
	  "kào": "靠铐",
	  "pì": "僻屁譬",
	  "tǎng": "躺",
	  "dé": "德",
	  "mó,mā": "摩",
	  "shú": "熟秫赎",
	  "hú,hū,hù": "糊",
	  "pī,pǐ": "劈",
	  "cháo": "潮巢",
	  "cāo": "操糙",
	  "yàn,yān": "燕",
	  "diān": "颠掂",
	  "báo,bó,bò": "薄",
	  "cān": "餐",
	  "xǐng": "醒",
	  "zhěng": "整拯",
	  "zuǐ": "嘴",
	  "zèng": "赠",
	  "mó,mò": "磨",
	  "níng": "凝狞柠",
	  "jiǎo,zhuó": "缴",
	  "cā": "擦",
	  "cáng,zàng": "藏",
	  "fán,pó": "繁",
	  "bì,bei": "臂",
	  "bèng": "蹦泵",
	  "pān": "攀潘",
	  "chàn,zhàn": "颤",
	  "jiāng,qiáng": "疆",
	  "rǎng": "壤攘",
	  "jiáo,jué,jiào": "嚼",
	  "rǎng,rāng": "嚷",
	  "chǔn": "蠢",
	  "lù,lòu": "露",
	  "náng,nāng": "囊",
	  "dǎi": "歹",
	  "rǒng": "冗",
	  "hāng,bèn": "夯",
	  "āo,wā": "凹",
	  "féng,píng": "冯",
	  "yū": "迂淤",
	  "xū,yù": "吁",
	  "lèi,lē": "肋",
	  "kōu": "抠",
	  "lūn,lún": "抡",
	  "jiè,gài": "芥",
	  "xīn,xìn": "芯",
	  "chā,chà": "杈",
	  "xiāo,xiào": "肖",
	  "zhī,zī": "吱",
	  "ǒu,ōu,òu": "呕",
	  "nà,nè": "呐",
	  "qiàng,qiāng": "呛",
	  "tún,dùn": "囤",
	  "kēng,háng": "吭",
	  "shǔn": "吮",
	  "diàn,tián": "佃",
	  "sì,cì": "伺",
	  "zhǒu": "肘帚",
	  "diàn,tián,shèng": "甸",
	  "páo,bào": "刨",
	  "lìn": "吝赁躏",
	  "duì,ruì,yuè": "兑",
	  "zhuì": "坠缀赘",
	  "kē,kě": "坷",
	  "tuò,tà,zhí": "拓",
	  "fú,bì": "拂",
	  "nǐng,níng,nìng": "拧",
	  "ào,ǎo,niù": "拗",
	  "kē,hē": "苛",
	  "yān,yǎn": "奄",
	  "hē,a,kē": "呵",
	  "gā,kā": "咖",
	  "biǎn": "贬匾",
	  "jiǎo,yáo": "侥",
	  "chà,shā": "刹",
	  "āng": "肮",
	  "wèng": "瓮",
	  "nüè,yào": "疟",
	  "páng": "庞螃",
	  "máng,méng": "氓",
	  "gē,yì": "疙",
	  "jǔ,jù": "沮",
	  "zú,cù": "卒",
	  "nìng": "泞",
	  "chǒng": "宠",
	  "wǎn,yuān": "宛",
	  "mí,mǐ": "弥",
	  "qì,qiè,xiè": "契",
	  "xié,jiā": "挟",
	  "duò,duǒ": "垛",
	  "jiá": "荚颊",
	  "zhà,shān,shi,cè": "栅",
	  "bó,bèi": "勃",
	  "zhóu,zhòu": "轴",
	  "nüè": "虐",
	  "liē,liě,lié,lie": "咧",
	  "dǔn": "盹",
	  "xūn": "勋",
	  "yo,yō": "哟",
	  "mī": "咪",
	  "qiào,xiào": "俏",
	  "hóu,hòu": "侯",
	  "pēi": "胚",
	  "tāi": "胎",
	  "luán": "峦",
	  "sà": "飒萨",
	  "shuò": "烁",
	  "xuàn": "炫",
	  "píng,bǐng": "屏",
	  "nà,nuó": "娜",
	  "pá,bà": "耙",
	  "gěng": "埂耿梗",
	  "niè": "聂镊孽",
	  "mǎng": "莽",
	  "qī,xī": "栖",
	  "jiǎ,gǔ": "贾",
	  "chěng": "逞",
	  "pēng": "砰烹",
	  "láo,lào": "唠",
	  "bàng,bèng": "蚌",
	  "gōng,zhōng": "蚣",
	  "li,lǐ,lī": "哩",
	  "suō": "唆梭嗦",
	  "hēng": "哼",
	  "zāng": "赃",
	  "qiào": "峭窍撬",
	  "mǎo": "铆",
	  "ǎn": "俺",
	  "sǒng": "耸",
	  "juè,jué": "倔",
	  "yīn,yān,yǐn": "殷",
	  "guàng": "逛",
	  "něi": "馁",
	  "wō,guō": "涡",
	  "lào,luò": "烙",
	  "nuò": "诺懦糯",
	  "zhūn": "谆",
	  "niǎn,niē": "捻",
	  "qiā": "掐",
	  "yè,yē": "掖",
	  "chān,xiān,càn,shǎn": "掺",
	  "dǎn,shàn": "掸",
	  "fēi,fěi": "菲",
	  "qián,gān": "乾",
	  "shē": "奢赊",
	  "shuò,shí": "硕",
	  "luō,luó,luo": "啰",
	  "shá": "啥",
	  "hǔ,xià": "唬",
	  "tuò": "唾",
	  "bēng": "崩",
	  "dāng,chēng": "铛",
	  "xiǎn,xǐ": "铣",
	  "jiǎo,jiáo": "矫",
	  "tiáo": "笤",
	  "kuǐ,guī": "傀",
	  "xìn": "衅",
	  "dōu": "兜",
	  "jì,zhài": "祭",
	  "xiáo": "淆",
	  "tǎng,chǎng": "淌",
	  "chún,zhūn": "淳",
	  "shuàn": "涮",
	  "dāng": "裆",
	  "wèi,yù": "尉",
	  "duò,huī": "堕",
	  "chuò,chāo": "绰",
	  "bēng,běng,bèng": "绷",
	  "zōng,zèng": "综",
	  "zhuó,zuó": "琢",
	  "chuǎi,chuài,chuāi,tuán,zhuī": "揣",
	  "péng,bāng": "彭",
	  "chān": "搀",
	  "cuō": "搓",
	  "sāo": "搔",
	  "yē": "椰",
	  "zhuī,chuí": "椎",
	  "léng,lēng,líng": "棱",
	  "hān": "酣憨",
	  "sū": "酥",
	  "záo": "凿",
	  "qiào,qiáo": "翘",
	  "zhā,chā": "喳",
	  "bǒ": "跛",
	  "há,gé": "蛤",
	  "qiàn,kàn": "嵌",
	  "bāi": "掰",
	  "yān,ā": "腌",
	  "wàn": "腕",
	  "dūn,duì": "敦",
	  "kuì,huì": "溃",
	  "jiǒng": "窘",
	  "sāo,sǎo": "骚",
	  "pìn": "聘",
	  "bǎ": "靶",
	  "xuē": "靴薛",
	  "hāo": "蒿",
	  "léng": "楞",
	  "kǎi,jiē": "楷",
	  "pín,bīn": "频",
	  "zhuī": "锥",
	  "tuí": "颓",
	  "sāi": "腮",
	  "liú,liù": "馏",
	  "nì,niào": "溺",
	  "qǐn": "寝",
	  "luǒ": "裸",
	  "miù": "谬",
	  "jiǎo,chāo": "剿",
	  "áo,āo": "熬",
	  "niān": "蔫",
	  "màn,wàn": "蔓",
	  "chá,chā": "碴",
	  "xūn,xùn": "熏",
	  "tiǎn": "舔",
	  "sēng": "僧",
	  "da,dá": "瘩",
	  "guǎ": "寡",
	  "tuì,tùn": "褪",
	  "niǎn": "撵碾",
	  "liáo,liāo": "撩",
	  "cuō,zuǒ": "撮",
	  "ruǐ": "蕊",
	  "cháo,zhāo": "嘲",
	  "biē": "憋鳖",
	  "hēi,mò": "嘿",
	  "zhuàng,chuáng": "幢",
	  "jī,qǐ": "稽",
	  "lǒu": "篓",
	  "lǐn": "凛檩",
	  "biě,biē": "瘪",
	  "liáo,lào,lǎo": "潦",
	  "chéng,dèng": "澄",
	  "lèi,léi": "擂",
	  "piáo": "瓢",
	  "shà": "霎",
	  "mò,má": "蟆",
	  "qué": "瘸",
	  "liáo,liǎo": "燎",
	  "liào,liǎo": "瞭",
	  "sào,sāo": "臊",
	  "mí,méi": "糜",
	  "ái": "癌",
	  "tún": "臀",
	  "huò,huō,huá": "豁",
	  "pù,bào": "瀑",
	  "chuō": "戳",
	  "zǎn,cuán": "攒",
	  "cèng": "蹭",
	  "bò,bǒ": "簸",
	  "bó,bù": "簿",
	  "bìn": "鬓",
	  "suǐ": "髓",
	  "ráng": "瓤"
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// const assign = require("object-assign");
	// XXX: Symbol when web support.

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PINYIN_STYLE = {
	  NORMAL: 0, // 普通风格，不带音标。
	  TONE: 1, // 标准风格，音标在韵母的第一个字母上。
	  TONE2: 2, // 声调以数字形式在拼音之后，使用数字 0~4 标识。
	  TO3NE: 5, // 声调以数字形式在声母之后，使用数字 0~4 标识。
	  INITIALS: 3, // 仅需要声母部分。
	  FIRST_LETTER: 4 };
	var DEFAULT_OPTIONS = {
	  style: PINYIN_STYLE.TONE, // 风格
	  segment: false, // 分词。
	  heteronym: false };

	// 声母表。
	var INITIALS = "b,p,m,f,d,t,n,l,g,k,h,j,q,x,r,zh,ch,sh,z,c,s".split(",");
	// 韵母表。
	//const FINALS = "ang,eng,ing,ong,an,en,in,un,er,ai,ei,ui,ao,ou,iu,ie,ve,a,o,e,i,u,v".split(",");
	// 带音标字符。
	var PHONETIC_SYMBOL = __webpack_require__(32);
	var RE_PHONETIC_SYMBOL = new RegExp("([" + Object.keys(PHONETIC_SYMBOL).join("") + "])", "g");
	var RE_TONE2 = /([aeoiuvnm])([0-4])$/;

	/*
	 * 格式化拼音为声母（Initials）形式。
	 * @param {String}
	 * @return {String}
	 */
	function initials(pinyin) {
	  for (var i = 0, l = INITIALS.length; i < l; i++) {
	    if (pinyin.indexOf(INITIALS[i]) === 0) {
	      return INITIALS[i];
	    }
	  }
	  return "";
	}

	var Pinyin = function () {
	  function Pinyin(dict) {
	    _classCallCheck(this, Pinyin);

	    this._dict = dict;
	  }

	  // @param {String} hans 要转为拼音的目标字符串（汉字）。
	  // @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
	  // @return {Array} 返回的拼音列表。


	  _createClass(Pinyin, [{
	    key: "convert",
	    value: function convert(hans, options) {

	      if (typeof hans !== "string") {
	        return [];
	      }

	      options = window.IUI_UTILS.extend({}, DEFAULT_OPTIONS, options);

	      var pys = [];
	      var nohans = "";

	      for (var i = 0, firstCharCode, words, l = hans.length; i < l; i++) {

	        words = hans[i];
	        firstCharCode = words.charCodeAt(0);

	        if (this._dict[firstCharCode]) {

	          // ends of non-chinese words.
	          if (nohans.length > 0) {
	            pys.push([nohans]);
	            nohans = ""; // reset non-chinese words.
	          }

	          pys.push(this.single_pinyin(words, options));
	        } else {
	          nohans += words;
	        }
	      }

	      // 清理最后的非中文字符串。
	      if (nohans.length > 0) {
	        pys.push([nohans]);
	        nohans = ""; // reset non-chinese words.
	      }
	      return pys;
	    }

	    // 单字拼音转换。
	    // @param {String} han, 单个汉字
	    // @return {Array} 返回拼音列表，多音字会有多个拼音项。

	  }, {
	    key: "single_pinyin",
	    value: function single_pinyin(han, options) {

	      if (typeof han !== "string") {
	        return [];
	      }
	      if (han.length !== 1) {
	        return this.single_pinyin(han.charAt(0), options);
	      }

	      var hanCode = han.charCodeAt(0);

	      if (!this._dict[hanCode]) {
	        return [han];
	      }

	      var pys = this._dict[hanCode].split(",");
	      if (!options.heteronym) {
	        return [Pinyin.toFixed(pys[0], options.style)];
	      }

	      // 临时存储已存在的拼音，避免多音字拼音转换为非注音风格出现重复。
	      var py_cached = {};
	      var pinyins = [];
	      for (var i = 0, py, l = pys.length; i < l; i++) {
	        py = Pinyin.toFixed(pys[i], options.style);
	        if (py_cached.hasOwnProperty(py)) {
	          continue;
	        }
	        py_cached[py] = py;

	        pinyins.push(py);
	      }
	      return pinyins;
	    }

	    /**
	     * 格式化拼音风格。
	     *
	     * @param {String} pinyin TONE 风格的拼音。
	     * @param {ENUM} style 目标转换的拼音风格。
	     * @return {String} 转换后的拼音。
	     */

	  }, {
	    key: "compare",


	    /**
	     * 比较两个汉字转成拼音后的排序顺序，可以用作默认的拼音排序算法。
	     *
	     * @param {String} hanA 汉字字符串 A。
	     * @return {String} hanB 汉字字符串 B。
	     * @return {Number} 返回 -1，0，或 1。
	     */
	    value: function compare(hanA, hanB) {
	      var pinyinA = this.convert(hanA, DEFAULT_OPTIONS);
	      var pinyinB = this.convert(hanB, DEFAULT_OPTIONS);
	      return String(pinyinA).localeCompare(pinyinB);
	    }
	  }], [{
	    key: "toFixed",
	    value: function toFixed(pinyin, style) {
	      var tone = ""; // 声调。
	      var first_letter = void 0;
	      var py = void 0;
	      switch (style) {
	        case PINYIN_STYLE.INITIALS:
	          return initials(pinyin);

	        case PINYIN_STYLE.FIRST_LETTER:
	          first_letter = pinyin.charAt(0);
	          if (PHONETIC_SYMBOL.hasOwnProperty(first_letter)) {
	            first_letter = PHONETIC_SYMBOL[first_letter].charAt(0);
	          }
	          return first_letter;

	        case PINYIN_STYLE.NORMAL:
	          return pinyin.replace(RE_PHONETIC_SYMBOL, function ($0, $1_phonetic) {
	            return PHONETIC_SYMBOL[$1_phonetic].replace(RE_TONE2, "$1");
	          });

	        case PINYIN_STYLE.TO3NE:
	          return pinyin.replace(RE_PHONETIC_SYMBOL, function ($0, $1_phonetic) {
	            return PHONETIC_SYMBOL[$1_phonetic];
	          });

	        case PINYIN_STYLE.TONE2:
	          py = pinyin.replace(RE_PHONETIC_SYMBOL, function ($0, $1) {
	            // 声调数值。
	            tone = PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$2");

	            return PHONETIC_SYMBOL[$1].replace(RE_TONE2, "$1");
	          });
	          return py + tone;

	        case PINYIN_STYLE.TONE:
	        default:
	          return pinyin;
	      }
	    }
	  }, {
	    key: "STYLE_NORMAL",
	    get: function get() {
	      return PINYIN_STYLE.NORMAL;
	    }
	  }, {
	    key: "STYLE_TONE",
	    get: function get() {
	      return PINYIN_STYLE.TONE;
	    }
	  }, {
	    key: "STYLE_TONE2",
	    get: function get() {
	      return PINYIN_STYLE.TONE2;
	    }
	  }, {
	    key: "STYLE_TO3NE",
	    get: function get() {
	      return PINYIN_STYLE.TO3NE;
	    }
	  }, {
	    key: "STYLE_INITIALS",
	    get: function get() {
	      return PINYIN_STYLE.INITIALS;
	    }
	  }, {
	    key: "STYLE_FIRST_LETTER",
	    get: function get() {
	      return PINYIN_STYLE.FIRST_LETTER;
	    }
	  }, {
	    key: "DEFAULT_OPTIONS",
	    get: function get() {
	      return DEFAULT_OPTIONS;
	    }
	  }]);

	  return Pinyin;
	}();

	module.exports = Pinyin;

/***/ },
/* 32 */
/***/ function(module, exports) {

	"use strict";

	// 带音标字符。
	module.exports = {
	  "ā": "a1",
	  "á": "a2",
	  "ǎ": "a3",
	  "à": "a4",
	  "ē": "e1",
	  "é": "e2",
	  "ě": "e3",
	  "è": "e4",
	  "ō": "o1",
	  "ó": "o2",
	  "ǒ": "o3",
	  "ò": "o4",
	  "ī": "i1",
	  "í": "i2",
	  "ǐ": "i3",
	  "ì": "i4",
	  "ū": "u1",
	  "ú": "u2",
	  "ǔ": "u3",
	  "ù": "u4",
	  "ü": "v0",
	  "ǘ": "v2",
	  "ǚ": "v3",
	  "ǜ": "v4",
	  "ń": "n2",
	  "ň": "n3",
	  "": "m2"
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(11);
	var defaults = {
	    form: '.form-inline'
	};

	var store = [];
	var scrollBarWidth = utils.scrollBarWidth;

	function Table(options, el) {
	    var self = this;
	    self.config = $.extend({}, defaults, options);
	    self.$el = el;
	    self.$container = el.addClass('table-container');
	    self.$table = self.$container.find('table').wrap('<div class="table-content"><div class="table-main"></div></div>');
	    self.$content = self.$container.find('.table-content');
	    self.$main = self.$container.find('.table-main');
	    self.$fixedTable = $('<div class="table-header-fixed"><table class="' + (self.$table.attr('class') || '') + '"><thead>' + self.$table.find('thead').html() + '</thead></table></div>');

	    self.init();
	};

	Table.prototype = {
	    init: function init() {
	        var self = this;
	        var config = self.config;
	        self.bindEvent();
	        self.updateFixHeader();
	        self.$content.prepend(self.$fixedTable);
	        self.$main.find('table').css({ 'marginTop': -self.$fixedTable.find('thead')[0].getBoundingClientRect().height });
	    },
	    updateFixHeader: function updateFixHeader() {
	        var self = this;
	        var $srcTh = self.$table.find('thead th');
	        var $descTh = self.$fixedTable.find('thead th');

	        $.each($srcTh, function (index, el) {
	            var $el = $(el);
	            var $desc = $descTh.eq(index).find('.fill-cell');
	            var lastTh = index === $descTh.length - 1 ? scrollBarWidth : 0;
	            var paddingWidth = parseInt($el.css('padding-right')) * 2;
	            var width = el.getBoundingClientRect().width - paddingWidth + lastTh - 1;

	            if ($desc.length) {
	                $desc.css('width', width);
	            } else {
	                $descTh.eq(index).append('<div class="fill-cell" style="width:' + width + '"></div>');
	            }
	        });

	        var headWidth = self.$fixedTable.find('table')[0].getBoundingClientRect().width - 2;

	        self.$main.css({ 'width': headWidth });
	        // self.$fixedTable.find('table').css({'width':headWidth});
	    },
	    bindEvent: function bindEvent() {
	        var self = this;
	        self.$el.on('change', '.table-checkedall', function (event) {
	            self.$el.find('.item-checked').prop('checked', this.checked);
	        });
	        self.$el.on('click', '.btn-table-edit', function (event) {
	            // self.$el.find('.item-checked').prop('checked',this.checked);
	        });
	    }
	};

	$(window).on('resize', function () {
	    $.each(store, function (key, obj) {
	        obj.updateFixHeader();
	    });
	});

	module.exports = {
	    table: function table(options) {
	        store.push(new Table(options, this));
	        return store[store.length - 1];
	    }
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * alert 组件
	 * @param {String}                 obj                 被提示的对象，可传 id 或 jQuery 对象
	 * @param {String}                 text                文本信息
	 * @param {Number}                 timeout             多少毫秒后隐藏提示
	 * @param {Boolean}                status              状态，success or error
	 * @param {Array}                  offset              自定义位置微调值，offset[0] = x, offset[1] = y
	 * @param {Function}               callback            回调函数 - hide 时触发
	 *
	 */
	module.exports = {
	    alert: function alert(options) {
	        var param = $.extend({
	            container: 'body',
	            obj: "#message",
	            text: '',
	            timeout: 1000,
	            status: true,
	            callback: null
	        }, options);

	        // 判断传入的是id还是class
	        var callerStyle = param.obj.charAt(0) === '#' ? 'id' : 'class';
	        //初始化jQuery对象
	        var obj = $(param.obj).length === 0 ? $('<div ' + callerStyle + '="' + param.obj.slice(1) + '" />').appendTo('body') : $(param.obj);
	        //判断状态
	        var status = param.status ? 'success' : 'error';
	        //自定义位置id标识
	        var id = new Date().getTime();

	        clearTimeout(obj.data('count'));

	        obj.html('<span class="' + status + '">' + param.text + '</span>').removeClass('hide');

	        // 计时器隐藏提示
	        obj.data('count', setTimeout(function () {

	            obj.addClass('hide');

	            if (param.callback) {
	                param.callback();
	            }
	        }, param.timeout));
	    }
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * dialog 组件
	 * @version 3.0.1
	 * @param {String}      title 标题                   默认为空
	 * @param {String}      content 内容                 默认为空
	 * @param {String}      confirmText                 确定按钮文本
	 * @param {String}      cancelText                  取消按钮文本
	 * @param {Boolean}     closeBtn                    是否开启关闭按钮
	 * @param {Boolean}     shadow                      是否开启点击阴影关闭
	 * @param {String}      type                        可选择 dialog 或 confirm，区别在于有无【取消按钮】
	 * @param {String}      status                      状态类，如 success , error , warning , info
	 * @param {Function}    before                      回调函数 - 弹出前
	 * @param {Function}    confirm                     回调函数 - 点击确认按钮后触发
	 * @param {Function}    cancel                      回调函数 - 点击取消按钮后触发
	 *
	 *
	 * @param $.dialog({options});
	 */

	module.exports = {
	  dialog: function dialog(options) {
	    var scrollBarWidth = IUI_UTILS.scrollBarWidth;
	    var $body = $('body');

	    var defaults = {
	      title: '',
	      content: '',
	      confirmText: '确定',
	      cancelText: '取消',
	      closeBtn: false,
	      shadow: true,
	      type: 'confirm',
	      status: 'default',
	      keyboard: true,
	      before: function before() {},
	      confirm: function confirm() {},
	      cancel: function cancel() {}
	    };

	    var config = $.extend({}, defaults, options);

	    var container = create();
	    /**
	     * [deferred description]
	     * @type {Object}
	     * @description 在回调函数中使用
	     */
	    var deferred = {
	      showDialog: function showDialog() {
	        show(container);
	      },
	      hideDialog: function hideDialog() {
	        hide(container);
	      },
	      target: container
	    };

	    if (!$.dialogBackdrop) {
	      $.dialogBackdrop = $('<div class="IUI-dialog-backdrop"></div>');
	      $body.append($.dialogBackdrop);
	    }

	    if (config.shadow) {
	      $body.on('touchstart.iui-dialog click.iui-dialog', '.IUI-dialog-container', function (event) {
	        event.preventDefault();
	        hide(container);
	      });
	    }

	    $body.on('touchstart.iui-dialog click.iui-dialog', '.IUI-dialog-main', function (event) {
	      event.stopPropagation();
	    });

	    container.on('touchstart.iui-dialog click.iui-dialog', '.IUI-dialog-confirm', function (event) {

	      if (config.type === 'dialog') {

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

	    container.on('touchstart.iui-dialog click.iui-dialog', '.IUI-dialog-cancel,.IUI-dialog-close', function (event) {
	      if (config.cancel.call(this, deferred) === false) {
	        return false;
	      }

	      hide(container);
	    });

	    if (config.keyboard) {

	      $(document).off('keyup.iui-dialog').on('keyup.iui-dialog', function (event) {
	        // keyCode => esc
	        if (event.keyCode === 27) {
	          container.find('.IUI-dialog-cancel,.IUI-dialog-close').trigger('click.iui-dialog');
	        }
	        // keyCode => enter
	        if (event.keyCode === 13) {
	          container.find('.IUI-dialog-confirm').trigger('click.iui-dialog');
	        }
	      });
	    }

	    /**
	     * [show description]
	     * @param  {jQuery object} target 需要显示的对象
	     */
	    function show(target) {
	      var screenH = document.documentElement.clientHeight;
	      var GtIE10 = document.body.style.msTouchAction === undefined;
	      target.find('.IUI-dialog-main').off(IUI_UTILS.animateEnd);
	      $.dialogBackdrop.off(IUI_UTILS.transitionEnd);
	      //当body高度大于可视高度，修正滚动条跳动
	      //tmd,>=ie10的滚动条不需要做此修正
	      if ($('body').height() > screenH & GtIE10) {
	        $body.css({ 'border-right': scrollBarWidth + 'px transparent solid', 'overflow': 'hidden' });
	      }

	      target.removeClass('hide');
	      $.dialogBackdrop.attr('style', 'opacity: 1;visibility: visible;');
	      target.find('.IUI-dialog-main').addClass('dialog-opening');
	      target.focus();
	      IUI_UTILS.animateEndShim(target.find('.IUI-dialog-main'), function (event) {
	        target.find('.IUI-dialog-main').removeClass('dialog-opening');
	      });
	    }
	    /**
	     * [hide description]
	     * @param  {jQuery object} target 需要隐藏的对象
	     */
	    function hide(target) {
	      $([$body, target]).off('touchstart.iui-dialog click.iui-dialog');
	      target.addClass('dialog-closing');
	      $.dialogBackdrop.removeAttr('style');
	      IUI_UTILS.transitionEndShim($.dialogBackdrop, function (event) {
	        target.remove();
	        $body.removeAttr('style');
	      });
	    }
	    /**
	     * [create description]
	     * @return {string} 拼接html
	     */
	    function create() {
	      var isConfirm = config.type === 'confirm';

	      var _closeBtn = '<span class="IUI-dialog-close"></span>';

	      var _confirmBtn = '<a href="javascript:;" class="IUI-dialog-confirm">' + config.confirmText + '</a>';

	      var _cancelBtn = '<a href="javascript:;" class="IUI-dialog-cancel">' + config.cancelText + '</a>';

	      var _header = '<div class="IUI-dialog-header">' + (config.title || '') + (config.closeBtn ? _closeBtn : '') + '</div>';

	      var _content = '<div class="IUI-dialog-content">' + (config.content || '') + '</div>';

	      var _footer = '<div class="IUI-dialog-footer">' + (isConfirm ? _confirmBtn + _cancelBtn : _confirmBtn.replace('IUI-dialog-confirm', 'IUI-dialog-cancel')) + '</div>';

	      var _main = _header + _content + _footer;

	      var $container = $('<div class="IUI-dialog-container hide" tabindex="10"><div class="IUI-dialog-main ' + config.status + '">' + _main + '</div></div>');

	      $body[0].appendChild($container[0]);

	      return $container;
	    }

	    if (config.before.call(this, deferred) === false) {
	      return false;
	    }

	    show(container);
	  }
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * loading 组件
	 * @param {Boolean}     display  	    显示或隐藏 true/false
	 * @param {String} 	    type 		    选择 css 或 img
	 * @param {String}      animateHtml     穿入的css动画,type为css有效
	 * @param {String}      src             图片地址，type不为css有效
	 * @param {Boolean} 	shadow          是否显示阴影
	 *
	 * @example
	 *
	 * $.loading(true,'css')或$(selector).loading(true,'css')或
	 *
	 */

	function Loading(options, type, init) {
	    // 默认配置
	    var defaults = {
	        display: false,
	        type: 1,
	        animateHtml: '<div class="ball-clip-rotate"><div></div></div>',
	        src: 'http://img.yi114.com/201571121314_382.gif',
	        shadow: true,
	        template: '<div class="IUI-loading">{{hook}}</div>'
	    };
	    // 是否全局模式
	    var isGlobal = this instanceof $;
	    // 作用域元素
	    var $context = isGlobal ? this : $('body');

	    // 若非全局模式，给作用域元素相对定位
	    if (isGlobal) {
	        $context.css('position', 'relative');
	    }
	    // 判断是临时配置还是自定义配置
	    var isTempConfig = (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object';
	    // 使用自定义配置还是默认配置
	    if (!init) {
	        $.extend(defaults, isTempConfig ? options : $.loadingConfig);
	    }
	    // 若options不为
	    if (!isTempConfig && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== void 0) {
	        defaults.display = options;
	    }
	    // 快捷切换css3 or image
	    if (type !== undefined) {
	        defaults.type = type;
	    }
	    // loading 模板
	    var loadingStr = defaults.template;
	    loadingStr = loadingStr.replace('{{hook}}', defaults.type ? defaults.animateHtml : '<img src="' + defaults.src + '" />');
	    // 是否需要遮罩
	    if (defaults.shadow) {
	        loadingStr = '<div class="IUI-loading-backdrop" ' + (isGlobal ? 'style="position:absolute;"' : '') + '></div>' + loadingStr;
	    }
	    var $loading = $context.data('loading') || $(loadingStr);
	    // 显示loading的时候，将 $loading存入作用域元素中
	    if (!$context.data('loading')) {
	        $context.data('loading', $loading);
	    }
	    // 显示 or 隐藏
	    if (defaults.display) {
	        $context.append($loading);
	    } else {
	        $context.data('loading').remove();
	    }
	};

	$.fn.loading = Loading;

	module.exports = { loading: Loading };

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';

	/*!
	 * JavaScript Cookie v2.1.3
	 * https://github.com/js-cookie/js-cookie
	 *
	 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
	 * Released under the MIT license
	 */

	function extend() {
	    var i = 0;
	    var result = {};
	    for (; i < arguments.length; i++) {
	        var attributes = arguments[i];
	        for (var key in attributes) {
	            result[key] = attributes[key];
	        }
	    }
	    return result;
	}
	function converter() {}

	var cookie = {
	    defaults: {},
	    api: function api(key, value, attributes) {
	        var result;
	        var _this = this;
	        if (typeof document === 'undefined') {
	            return;
	        }

	        // Write

	        if (arguments.length > 1) {
	            attributes = extend({
	                path: '/'
	            }, _this.defaults, attributes);

	            if (typeof attributes.expires === 'number') {
	                var expires = new Date();
	                expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
	                attributes.expires = expires;
	            }

	            // We're using "expires" because "max-age" is not supported by IE
	            attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

	            try {
	                result = JSON.stringify(value);
	                if (/^[\{\[]/.test(result)) {
	                    value = result;
	                }
	            } catch (e) {}

	            if (!converter.write) {
	                value = encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
	            } else {
	                value = converter.write(value, key);
	            }

	            key = encodeURIComponent(String(key));
	            key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
	            key = key.replace(/[\(\)]/g, escape);

	            var stringifiedAttributes = '';

	            for (var attributeName in attributes) {
	                if (!attributes[attributeName]) {
	                    continue;
	                }
	                stringifiedAttributes += '; ' + attributeName;
	                if (attributes[attributeName] === true) {
	                    continue;
	                }
	                stringifiedAttributes += '=' + attributes[attributeName];
	            }
	            return document.cookie = key + '=' + value + stringifiedAttributes;
	        }

	        // Read

	        if (!key) {
	            result = {};
	        }

	        // To prevent the for loop in the first place assign an empty array
	        // in case there are no cookies at all. Also prevents odd result when
	        // calling "get()"
	        var cookies = document.cookie ? document.cookie.split('; ') : [];
	        var rdecode = /(%[0-9A-Z]{2})+/g;
	        var i = 0;

	        for (; i < cookies.length; i++) {
	            var parts = cookies[i].split('=');
	            var cookie = parts.slice(1).join('=');

	            if (cookie.charAt(0) === '"') {
	                cookie = cookie.slice(1, -1);
	            }

	            try {
	                var name = parts[0].replace(rdecode, decodeURIComponent);
	                cookie = converter.read ? converter.read(cookie, name) : converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);

	                if (this.json) {
	                    try {
	                        cookie = JSON.parse(cookie);
	                    } catch (e) {}
	                }

	                if (key === name) {
	                    result = cookie;
	                    break;
	                }

	                if (!key) {
	                    result[name] = cookie;
	                }
	            } catch (e) {}
	        }

	        return result;
	    },
	    set: function set(key, value, attributes) {
	        return cookie.api.call(cookie, key, value, attributes);
	    },
	    get: function get(key) {
	        return cookie.api.call(cookie, key);
	    },
	    getJson: function getJson() {
	        return cookie.api.apply({
	            json: true
	        }, [].slice.call(arguments));
	    },
	    remove: function remove(key, attributes) {
	        cookie.api(key, '', extend(attributes, {
	            expires: -1
	        }));
	    },
	    clear: function clear() {
	        var json = cookie.getJson();
	        for (var key in json) {
	            cookie.remove(key);
	        }
	    }
	};

	module.exports = {
	    cookie: cookie
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * pub_sub
	 * 发布/订阅模式
	 */
	var o = $({});

	module.exports = {
	    sub: function sub() {
	        o.on.apply(o, arguments);
	    },
	    unsub: function unsub() {
	        o.off.apply(o, arguments);
	    },
	    pub: function pub() {
	        o.trigger.apply(o, arguments);
	    }
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';

	var template = '<div class="IUI-popover-container">{{header}}{{content}}</div>';

	var defaults = {
	    handle: '[data-popover]', //绑定监听对象
	    container: 'body', //全局作用域
	    direction: 'down-center',
	    compiler: null, //有无模板引擎
	    header: '' //标题
	};

	// matrix : 
	// 0 => 参照物x,
	// 1 => 参照物y,
	// 2 => 参照物w,
	// 3 => 参照物h,
	// 4 => 模板w,
	// 5 => 模板h,
	// 6 => 作用域元素x,
	// 7 => 作用域元素y
	// 8 => scrollTop
	var tplDir = {
	    left: function left(matrix) {
	        return matrix[0] - matrix[4] - matrix[6] - 20;
	    },
	    right: function right(matrix) {
	        return matrix[0] + matrix[2] * 2 - matrix[6] + 20;
	    },
	    up: function up(matrix) {
	        return matrix[1] - matrix[5] - matrix[7] - 20;
	    },
	    down: function down(matrix) {
	        return matrix[1] + matrix[3] - matrix[7] + 20;
	    }
	};

	var arrowDir = {
	    left: function left(matrix) {
	        return matrix[0] - matrix[6];
	    },
	    right: function right(matrix) {
	        return matrix[0] + matrix[2] * 2 - matrix[4] - matrix[6];
	    },
	    center: function center(matrix) {
	        return matrix[0] + matrix[2] - matrix[4] / 2 - matrix[6];
	    },
	    top: function top(matrix) {
	        return matrix[1] - matrix[7];
	    },
	    bottom: function bottom(matrix) {
	        return matrix[1] + matrix[3] - matrix[5] - matrix[7];
	    },
	    middle: function middle(matrix) {
	        return matrix[1] + matrix[3] / 2 - matrix[5] / 2 - matrix[7];
	    }
	};

	function Popover(config) {
	    this.$selector = $(config.handle);
	    this.$container = $(config.container);
	    this.config = config;
	    this.ctxPos = $(config.container)[0].getBoundingClientRect();
	    this.screenWidth = $(document).width();
	    this.screenHeight = $(document).height();
	    this.init();
	}

	Popover.prototype.init = function () {
	    var _this = this;

	    // show
	    _this.$container.on('click.IUI-popover', _this.config.handle, function (event) {
	        var $this = $(this);
	        var eventSpace = $this.data('popoverid') ? '.popover-' + $this.data('popoverid') : '.popover';

	        if ($this.hasClass('popover-active')) {
	            _this.hide($this.removeClass('popover-active').data('template'));
	            return false;
	        } else {
	            $this.addClass('popover-active');
	        }

	        $.pub('before' + eventSpace, [_this, $this]);
	        $('body').trigger('click.IUI-popover');
	        _this.show($this);
	        $.pub('after' + eventSpace, [_this, $this]);
	        event.stopPropagation();
	    });

	    // hide
	    $('body').on('click.IUI-popover', function (event) {
	        var $this = $(this);
	        if ($(event.target).closest('.IUI-popover-container').length === 0) {
	            $this.trigger('hide.popover', [_this]);
	            _this.hide();
	        }
	    });
	};

	// 获取调用者的位置
	Popover.prototype.getEmitterPos = function (emitter) {
	    var $emitter = emitter;
	    var pos = $emitter[0].getBoundingClientRect();
	    var emitterPosX = pos.left;
	    var emitterPosY = pos.top;
	    var emitterWidth = $emitter.outerWidth() / 2;
	    var emitterHeight = $emitter.outerHeight();
	    return [emitterPosX, emitterPosY, emitterWidth, emitterHeight];
	};

	// 填充内容
	Popover.prototype.fillContent = function (emitter) {
	    var _this = this;
	    var config = _this.config;
	    var $emitter = emitter;
	    var header = $emitter.attr('data-ppHeader') || config.header;
	    var str = $emitter.attr('data-popover');
	    var isEl = str.indexOf('##') === 0;
	    var $content = isEl ? str.slice(2, str.length) : $(str);

	    var _template = template.replace('{{header}}', header ? '<div class="popover-header">' + header + '</div>' : '');

	    if (!isEl && emitter.data('data') && config.compiler) {
	        _template = _template.replace('{{content}}', config.compiler($content.html(), $emitter));
	    } else {
	        _template = _template.replace('{{content}}', isEl ? '<div class="popover-content">' + $content + '</div>' : $content.html());
	    }

	    return _template;
	};

	Popover.prototype.excePosition = function (emitter, template) {
	    var _this = this;
	    // 外围容器坐标 x,y
	    var ctxPosX = _this.ctxPos.left;
	    var ctxPosY = _this.ctxPos.top;
	    // 当前视窗宽高 w,h
	    var screenWidth = _this.screenWidth;
	    var screenHeight = _this.screenHeight + _this.$container.scrollTop();
	    // 参照物的坐标集
	    var emitterMatrix = _this.getEmitterPos(emitter);
	    // 模板
	    var $template = template;
	    var tmpWidth = $template.outerWidth();
	    var tmpHeight = $template.outerHeight();
	    var position = [];
	    var dirName = emitter.attr('data-ppDirect') || _this.config.direction;
	    var customDir = dirName.split('-');
	    var index = 'left right'.indexOf(customDir[0]) !== -1 ? 0 : 1;
	    var matrix = emitterMatrix.concat([tmpWidth, tmpHeight, ctxPosX, ctxPosY]);

	    position[index] = tplDir[customDir[0]](matrix);
	    position[index ? 0 : 1] = arrowDir[customDir[1]](matrix);
	    position[2] = dirName;
	    return position;
	};

	Popover.prototype.show = function (emitter) {
	    var _this = this;
	    var config = _this.config;
	    var $emitter = emitter;
	    var content = _this.fillContent($emitter);
	    var $template = $(content);
	    var $body = $('body');
	    var position;
	    $emitter.data('template', $template);
	    _this.$container.data('popoverInit', _this.$container.css('position')).css({ 'position': 'relative' });
	    $template.addClass('popover-show').appendTo(config.container);
	    position = _this.excePosition(emitter, $template);
	    $template.css({
	        'left': position[0] + _this.$container.scrollLeft() + $body.scrollLeft(),
	        'top': position[1] + _this.$container.scrollTop() + $body.scrollTop()
	    }).addClass('popover-in ' + position[2]);
	};

	Popover.prototype.hide = function (target) {
	    var _this = this;
	    var $target = target || $('.IUI-popover-container');
	    var $container = _this.$container;

	    if (!target) {
	        $('[data-popover]').removeClass('popover-active');
	    }

	    $container.css('position', $container.data('popoverInit'));

	    IUI_UTILS.transitionEndShim($target.removeClass('popover-in'), function () {
	        $target.remove();
	    });
	};

	module.exports = {
	    popover: function popover(config) {
	        return new Popover($.extend({}, defaults, config));
	    }
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.tooltip = tooltip;

	var _utils = __webpack_require__(11);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var defaults = {
	  container: 'body',
	  handler: '[data-tooltip]',
	  offsetX: 10,
	  offsetY: 0
	};

	var positionCalc = {
	  left: function left(options, template) {
	    var _this = this;
	    var srcX = options.left;
	    var srcY = options.top;
	    var srcW = options.width;
	    var srcH = options.height;
	    var destH = template.outerHeight();

	    return [srcX + srcW, srcY + (srcH - destH) / 2];
	  },
	  right: function right() {},
	  top: function top() {},
	  down: function down() {}
	};

	function Tooltip(options) {
	  var _this = this;

	  _this.config = $.extend(defaults, options);
	  _this.$container = $(_this.config.container);
	  _this.init();
	};

	Tooltip.prototype = {
	  init: function init() {
	    var _this = this;
	    var config = _this.config;
	    var handler = config.handler;

	    _this.$container.on('mouseenter', handler, $.proxy(_this.show, _this));
	    _this.$container.on('mouseleave', handler, $.proxy(_this.hide, _this));
	  },
	  show: function show(event) {
	    var _this = this;
	    var config = _this.config;
	    var $target = $(event.target);
	    var options = ($target.data('tooltipOptions') || '|').split('|');
	    var text = $target.data('tooltip') || '';
	    var direct = options[0] || 'left';
	    var size = options[1] || 'small';

	    _this.$template = $('<div id= "tooltip-' + +new Date() + '" class="tooltip tooltip-' + size + ' tooltip-' + direct + '">' + text + '</div>');

	    _this.$container.append(_this.$template);

	    var pos = positionCalc[direct].call(_this, event.target.getBoundingClientRect(), _this.$template);

	    _this.$template.addClass('tooltip-show').css({
	      'left': pos[0] + config.offsetX,
	      'top': pos[1]
	    });
	  },
	  hide: function hide(event) {
	    var _this = this;
	    _this.$template.remove();
	  }
	};

	function tooltip(options) {
	  return new Tooltip(options);
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	'use strict';

	var defaults = {
	    el: '.inlineEditor',
	    container: 'body'
	};

	var transform = function () {
	    var matrixToArray = function matrixToArray(str) {
	        if (!str || str == 'none') {
	            return [1, 0, 0, 1, 0, 0];
	        }
	        return str.match(/(-?[0-9\.]+)/g);
	    };

	    var getPreviousTransforms = function getPreviousTransforms(elem) {
	        return elem.css('-webkit-transform') || elem.css('transform') || elem.css('-moz-transform') || elem.css('-o-transform') || elem.css('-ms-transform');
	    };

	    var getMatrix = function getMatrix(elem) {
	        var previousTransform = getPreviousTransforms(elem);
	        return matrixToArray(previousTransform);
	    };

	    var applyTransform = function applyTransform(elem, transform) {
	        elem.css('-webkit-transform', transform);
	        elem.css('-moz-transform', transform);
	        elem.css('-o-transform', transform);
	        elem.css('-ms-transform', transform);
	        elem.css('transform', transform);
	    };

	    var buildTransformString = function buildTransformString(matrix) {
	        return 'matrix(' + matrix[0] + ', ' + matrix[1] + ', ' + matrix[2] + ', ' + matrix[3] + ', ' + matrix[4] + ', ' + matrix[5] + ')';
	    };

	    var getTranslate = function getTranslate(elem) {
	        var matrix = getMatrix(elem);
	        return {
	            x: parseInt(matrix[4]),
	            y: parseInt(matrix[5])
	        };
	    };

	    var scale = function scale(elem, _scale) {
	        var matrix = getMatrix(elem);
	        matrix[0] = matrix[3] = _scale;
	        var transform = buildTransformString(matrix);
	        applyTransform(elem, transform);
	    };

	    var translate = function translate(elem, x, y) {
	        var matrix = getMatrix(elem);
	        matrix[4] = x;
	        matrix[5] = y;
	        var transform = buildTransformString(matrix);
	        applyTransform(elem, transform);
	    };

	    var rotate = function rotate(elem, deg) {
	        var matrix = getMatrix(elem);
	        var rad1 = deg * (Math.PI / 180);
	        var rad2 = rad1 * -1;
	        matrix[1] = rad1;
	        matrix[2] = rad2;
	        var transform = buildTransformString(matrix);
	        applyTransform(elem, transform);
	    };

	    return {
	        scale: scale,
	        translate: translate,
	        rotate: rotate,
	        getTranslate: getTranslate
	    };
	}();

	var win = window;

	var doc = document;

	var template = '';

	var section = {
	    getText: function getText() {
	        var txt = '';
	        if (win.getSelection) {
	            txt = win.getSelection().toString();
	        } else if (doc.getSelection) {
	            txt = doc.getSelection().toString();
	        } else if (doc.selection) {
	            txt = doc.selection.createRange().text;
	        }
	        return txt;
	    },
	    getContainer: function getContainer(sel) {
	        if (win.getSelection && sel && sel.commonAncestorContainer) {
	            return sel.commonAncestorContainer;
	        } else if (doc.selection && sel && sel.parentElement) {
	            return sel.parentElement();
	        }
	        return null;
	    },
	    getSelection: function getSelection() {
	        if (win.getSelection) {
	            return win.getSelection();
	        } else if (doc.selection && doc.selection.createRange) {
	            // IE
	            return doc.selection;
	        }
	        return null;
	    }
	};

	var rawEvents = {
	    mouseup: function mouseup(event) {
	        toolbar.updatePos($(this), $('.inlineEditor-toolbar'));
	    }
	};

	var toolbar = {
	    updatePos: function updatePos(editor, elem) {
	        var sel = win.getSelection(),
	            range = sel.getRangeAt(0),
	            boundary = range.getBoundingClientRect(),
	            bubbleWidth = elem.width(),
	            bubbleHeight = elem.height(),
	            offset = editor.offset().left,
	            pos = {
	            x: boundary.left + boundary.width / 2 - bubbleWidth / 2,
	            y: boundary.top - bubbleHeight - 8 + $(document).scrollTop()
	        };
	        transform.translate(elem, pos.x, pos.y);
	    }
	};

	function InlineEditor(options) {
	    var self = this;
	    self.config = $.extend({}, defaults, options);
	    var config = self.config;
	    self.$el = $(config.el);
	    self.$container = $(config.container);
	    self.init();
	}

	InlineEditor.prototype.init = function () {
	    var self = this;
	    var config = self.config;

	    self.$container.append($($('#toolbar').html()));
	    self.$container.on('mouseup', config.el, rawEvents.mouseup);
	};

	InlineEditor.prototype.bindEvents = function () {};

	module.exports = {
	    inlineEditor: function inlineEditor(config) {
	        return new InlineEditor(config);
	    }
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * version 1.0.0
	 * 支持垂直和水平翻转
	 * 支持鼠标和手势
	 * 不兼容 IE9-
	 */

	/**
	 * next version
	 * 超长内容模拟滚动
	 * 可配置对象
	 * 每屏内容动画控制
	 */

	var utils = __webpack_require__(11);

	var defaults = {
	    wrapper: '#selector',
	    mouseDrag: true,
	    touchDrag: true,
	    direction: 0
	};

	var normalStyle = {
	    '-webkit-transform-origin': 'center top 0px',
	    '-webkit-transform': 'scale(1)',
	    '-webkit-transition': 'none',
	    'transform-origin': 'center top 0px',
	    'transform': 'scale(1)',
	    'transition': 'none'
	};

	function getPage(event) {
	    var offset = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
	    return [offset.pageX, offset.pageY];
	}

	function Slippage(options) {
	    var _this = this;
	    _this.config = $.extend({}, defaults, options);
	    _this.$el = $(_this.config.wrapper);
	    statusInit.call(_this);
	    this.init(options);
	}

	Slippage.prototype.init = function (options) {
	    var _this = this;
	    if (_this.$el.children().length === 0) {
	        return false;
	    }
	    _this.$userItems = _this.$el.children();
	    _this.itemsAmount = _this.$userItems.length;
	    _this.wrapItems();
	    _this.$slippageItems = _this.$el.find('.slippage-item');
	    _this.$slippageWrapper = _this.$el.find('.slippage-wrapper');
	    _this.$slippageItems.eq(0).css(normalStyle).addClass('z-current');
	    _this.$slippageItems.find('.slippage-content').scrollTop(1);
	    _this.eventTypes();
	    _this.gestures();
	    console.log(_this);
	};

	function statusInit() {
	    var _this = this;
	    _this.animateStart = _this.pageIndex = _this.prevIndex = _this.nextIndex = _this.arrow = _this.pageHeight = 0;
	}

	function statusStart() {
	    var _this = this;
	    var amount = _this.itemsAmount;
	    var prevIndex = _this.pageIndex - 1;
	    var nextIndex = _this.pageIndex + 1;

	    _this.animateStart = 1;
	    _this.prevIndex = prevIndex < 0 ? amount - prevIndex - 2 : prevIndex;
	    _this.nextIndex = nextIndex < amount ? nextIndex : 0;
	    _this.pageHeight = _this.$slippageItems.eq(0)[_this.config.direction ? 'outerHeight' : 'outerWidth']();
	}

	function statusMove(direction) {
	    var _this = this;
	    _this.pageHeight = direction ? Math.abs(_this.pageHeight) : _this.pageHeight > 0 ? -_this.pageHeight : _this.pageHeight;
	    _this.animateTarget = direction ? _this.nextIndex : _this.prevIndex;
	    _this.animateStart = 2;
	}

	function statusUndo() {
	    var amount = _this.itemsAmount;
	    var prevIndex = _this.pageIndex + 1;
	    var nextIndex = _this.pageIndex - 1;
	    _this.animateStart = 0;
	    _this.prevIndex = prevIndex < amount ? prevIndex : 0;
	    _this.nextIndex = nextIndex < 0 ? amount - nextIndex - 2 : nextIndex;
	}

	Slippage.prototype.gestures = function () {
	    var _this = this;
	    var transition = _this.config.direction ? 'translateY' : 'translateX';

	    function swapEvents(type) {
	        if (type === 'on') {
	            $(document).on(_this.eventType.move, dragMove);
	            $(document).on(_this.eventType.end, dragEnd);
	        } else if (type === 'off') {
	            $(document).off(_this.eventType.move);
	            $(document).off(_this.eventType.end);
	        }
	    }

	    function dragStart(event) {
	        console.log(_this.animateStart);
	        if (_this.animateStart) {
	            return false;
	        }
	        var $this = _this.$eventTarget = $(this);
	        _this.mouseInit = getPage(event)[_this.config.direction];
	        swapEvents('on');
	        $this.css(normalStyle);
	        statusStart.call(_this);
	        return false;
	    }

	    function dragMove(event) {

	        var arrows = getPage(event)[_this.config.direction];
	        var offset = arrows - _this.mouseInit;
	        var $next = _this.$slippageItems.eq(_this.nextIndex);
	        var $prev = _this.$slippageItems.eq(_this.prevIndex);
	        var direction = arrows < _this.mouseInit;
	        var $scrollEl = _this.$eventTarget.find('.slippage-content');
	        var scrollAmount = $scrollEl.length ? $scrollEl[0].scrollHeight - $scrollEl[0].offsetHeight : 0;

	        _this.$slippageItems.removeClass('z-active');
	        _this.arrow = arrows;
	        statusMove.call(_this, direction, event);
	        _this.$slippageItems.eq(_this.animateTarget).addClass('z-active');
	        _this.$slippageItems.eq(_this.animateTarget).css({
	            '-webkit-transition': 'none',
	            'transition': 'none',
	            '-webkit-transform': transition + '(' + (_this.pageHeight + offset) + 'px)',
	            'transform': transition + '(' + (_this.pageHeight + offset) + 'px)'
	        });
	        // if($scrollEl.length && $scrollEl.scrollTop() >= scrollAmount && !direction){
	        //     console.log(1111111111111);
	        //     statusUndo.call(_this);
	        //     $scrollEl.scrollTop($scrollEl.scrollTop()-5);
	        //     swapEvents('off');
	        // }else if($scrollEl.length && $scrollEl.scrollTop() <= 0 && direction){
	        //     console.log(22222222222222);
	        //     $scrollEl.scrollTop(5)
	        //     statusUndo.call(_this);
	        //     swapEvents('off');
	        // }else{
	        //     console.log(33333333333333);
	        //     _this.arrow = arrows;
	        //     statusMove.call(_this,direction,event);
	        //     _this.$slippageItems.eq(_this.animateTarget).addClass('z-active');
	        //     _this.$slippageItems
	        //         .eq(_this.animateTarget)
	        //         .css({
	        //             '-webkit-transition': 'none',
	        //             'transition': 'none',
	        //             '-webkit-transform': transition + '(' + (_this.pageHeight + offset) + 'px)',
	        //             'transform': transition + '(' + (_this.pageHeight + offset) + 'px)'
	        //         });
	        // }
	    }

	    function dragEnd(event) {

	        if (_this.animateStart === 1) {
	            _this.animateStart = 0;
	            swapEvents('off');
	            return false;
	        }

	        var rollback = Math.abs(_this.arrow - _this.mouseInit) < 300;
	        var offsetEnd = rollback ? _this.pageHeight + 'px' : '0px';
	        var direction = _this.arrow < _this.mouseInit;
	        var $scrollEl = _this.$eventTarget.find('.slippage-content');

	        if (rollback) {
	            _this.animateStart = _this.pageHeight = 0;
	        } else {
	            _this.pageIndex = _this.animateTarget;
	            _this.$slippageItems.eq(_this.animateTarget).addClass('z-current');
	        }

	        $scrollEl.scrollTop($scrollEl.length && $scrollEl[0].scrollTop ? $scrollEl[0].scrollTop - 1 : 1);

	        _this.$slippageItems.eq(_this.animateTarget).css({
	            '-webkit-transition': '-webkit-transform .4s linear',
	            'transition': 'transform .4s linear',
	            '-webkit-transform': transition + '(' + offsetEnd + ')',
	            'transform': transition + '(' + offsetEnd + ')'
	        });

	        _this.$slippageItems.eq(_this.animateTarget).off(utils.transitionEnd).on(utils.transitionEnd, function (event) {
	            $(this).removeClass('z-active');
	            if (rollback) {
	                _this.$eventTarget.addClass('z-current');
	            } else {
	                _this.$eventTarget.removeClass('z-current');
	            }
	            _this.$eventTarget.css(normalStyle);
	            _this.animateStart = 0;
	        });

	        swapEvents('off');
	    }

	    _this.$el.on(_this.eventType.start, '.slippage-item', dragStart);

	    // _this.$el.on(_this.eventType.start, '.slippage-content', function(event) {

	    //     let scrollAmount = this.scrollHeight - this.offsetHeight;

	    //     if (this.scrollTop > 0 && this.scrollTop < scrollAmount) {
	    //         _this.animateStart = 0;
	    //         event.stopPropagation();
	    //     }


	    // });
	};

	Slippage.prototype.wrapItems = function () {
	    var _this = this;
	    _this.$userItems.wrapAll('<div class="slippage-wrapper">').wrap('<div class="slippage-item"></div>');
	    _this.$el.css('display', 'block');
	};

	Slippage.prototype.eventTypes = function () {
	    var _this = this,
	        types = ['s', 'e', 'x'];

	    _this.eventType = {};

	    if (_this.config.mouseDrag === true && _this.config.touchDrag === true) {
	        types = ['touchstart.slippage mousedown.slippage', 'touchmove.slippage mousemove.slippage', 'touchend.slippage touchcancel.slippage mouseup.slippage'];
	    } else if (_this.config.mouseDrag === false && _this.config.touchDrag === true) {
	        types = ['touchstart.slippage', 'touchmove.slippage', 'touchend.slippage touchcancel.slippage'];
	    } else if (_this.config.mouseDrag === true && _this.config.touchDrag === false) {
	        types = ['mousedown.slippage', 'mousemove.slippage', 'mouseup.slippage'];
	    }

	    _this.eventType.start = types[0];
	    _this.eventType.move = types[1];
	    _this.eventType.end = types[2];
	};

	module.exports = {
	    slippage: function slippage(options) {
	        return new Slippage(options);
	    }
	};

/***/ }
/******/ ]);