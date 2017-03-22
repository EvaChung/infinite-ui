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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	__webpack_require__(43);

	window.IUI_UTILS = __webpack_require__(11);

	var IUI = {};

	// 注入到jQuery原型对象
	$.each([__webpack_require__(14), __webpack_require__(45), __webpack_require__(46)], function (index, component) {
	    if ((typeof component === 'undefined' ? 'undefined' : _typeof(component)) === 'object' && !IUI[component]) {
	        $.extend(IUI, component);
	    }
	});

	// 注入到jQuery全局对象
	$.each([__webpack_require__(37), __webpack_require__(38), __webpack_require__(36), __webpack_require__(34), __webpack_require__(42)], function (index, component) {
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

/***/ 11:
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

/***/ 14:
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

/***/ 34:
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

/***/ 36:
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

/***/ 37:
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

/***/ 38:
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

/***/ 42:
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

/***/ },

/***/ 43:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 45:
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * mPicker 组件
	 *
	 * *** options ***
	 *
	 * @param {Str}                                 display    显示的方式，默认是显示在底部    'bottom'/'modal'
	 * @param {Boolean}                             shadow     点击遮罩隐藏组件 - 默认为false;若为false，则禁止点击遮罩隐藏组件
	 * @param {Number}                              level      显示的层级，默认：1
	 * @param {Number}                              rows       picker显示的行数，默认：4
	 * @param {Boolean}                             Linkage    选择联动 - 若为false，则不联动
	 * @param {Array}                               dataJson   渲染picker的json - 有规定的格式，可查看json文件。不联动默认遍历获取第一个json
	 * @param {Number}                              height     每一行的高度
	 * @param {Boolean}                             idDefault  匹配默认值 - 若为false，则不匹配
	 * @param {Str}                                 splitStr   设置分割value的符号，与默认值和显示在input里的值有关
	 * @param {Boolean}                             isshort    是否开启简写，默认是关闭的
	 * @param {Element selector}                    header     picker头部html
	 *@param {function}                             confirm: function() {}
	 *@param {function}                             cancel: function() {}
	 *
	 * *** 关于json格式 ***
	 *jsonChange.js是针对campaign里的json做的格式转换
	 *
	 * *** 关于value值 ***
	 *
	 *$('.select-value').data('value1')：第一级的value值
	 *$('.select-value').data('value2')：第二级的value值
	 *
	 *
	 * *** methods ***
	 *
	 *  show                详情请查阅源码部分
	 *  hide                详情请查阅源码部分
	 *  updateData          详情请查阅源码部分
	 *
	 */
	function __dealCssEvent(eventNameArr, callback) {
	    var events = eventNameArr,
	        i,
	        dom = this; // jshint ignore:line

	    function fireCallBack(e) {
	        /*jshint validthis:true */
	        if (e.target !== this) return;
	        callback.call(this, e);
	        for (i = 0; i < events.length; i++) {
	            dom.off(events[i], fireCallBack);
	        }
	    }
	    if (callback) {
	        for (i = 0; i < events.length; i++) {
	            dom.on(events[i], fireCallBack);
	        }
	    }
	}

	//动画结束事件兼容
	$.fn.animationEnd = function (callback) {
	    __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
	    return this;
	};
	$.fn.transitionEnd = function (callback) {
	    __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
	    return this;
	};

	module.exports = {
	    mPicker: function mPicker(options) {
	        var mPickerDefaults = {
	            display: 'bottom',
	            shadow: false,
	            level: 1,
	            rows: 4,
	            Linkage: false,
	            dataJson: '',
	            height: 36,
	            idDefault: false,
	            splitStr: ' ',
	            isshort: false,
	            header: '<div class="mPicker-header"></div>',
	            footer: '<div class="mPicker-footer"><a href="javascript:;" class="mPicker-confirm">确定</a><a href="javascript:;" class="mPicker-cancel">取消</a></div>',
	            confirm: function confirm() {},
	            cancel: function cancel() {}
	        };

	        var moveStartLock;

	        var ulWidth = ['100%', '50%'];

	        var $body = $('body');

	        var $mask = $('<div class="mPicker-mask hide"></div>');

	        var $mPicker = $('<div class="mPicker hide"></div>');

	        var lock, timeTouchend;
	        /**
	         * 添加mPicker容器
	         */
	        if (!$('.mPicker').length) {
	            $body.append($mPicker);
	            $mPicker.append($mask);
	        }
	        /**
	         * 阻止默认滚动
	         */
	        $body.on('touchmove', function (event) {
	            if (lock) {
	                // event.preventDefault();
	                event.stopPropagation();
	            }
	        });
	        /**
	         * 禁止滚动－－防止滚动选择时页面滚动
	         */
	        $body.on({
	            touchstart: function touchstart(event) {
	                // event.preventDefault();
	                lock = 1;
	            },
	            touchmove: function touchmove(event) {
	                // event.preventDefault();
	                //兼容部分手机有时候没有触发touchend
	                clearTimeout(timeTouchend);
	                timeTouchend = setTimeout(function () {
	                    lock = 0;
	                }, 100);
	            },
	            touchend: function touchend(event) {
	                event.preventDefault();
	                lock = 0;
	            }
	        }, '.mPicker-main');

	        function MPicker(ele, options) {
	            if (!ele.length) {
	                return false;
	            }
	            this.container = ele;
	            this.mpicker = $('.mPicker');
	            this.mask = this.mpicker.find('.mPicker-mask');
	            this.options = $.extend({}, mPickerDefaults, options);
	            this.init();
	            this.event();
	            this.container.data('mPicker', this);
	        }

	        MPicker.prototype = {
	            //初始化MPicker
	            init: function init(ele, options) {

	                /**
	                 * 根据行数计算居中的位置
	                 */
	                this.middleRowIndex = parseInt(this.options.rows / 2.5);
	                //展示方式
	                this.disy = this.options.display === 'bottom' ? 'mPicker-bottom down' : 'mPicker-modal';
	            },
	            //初始化mpicker,根据json渲染html结构,添加遮罩，边框等
	            render: function render() {
	                /**
	                 *  初始化mpicker,根据json渲染html结构
	                 *  添加遮罩，边框等
	                 */
	                var listStr;
	                var jsonData = [];
	                var mainStr;
	                var self = this;
	                /**
	                 * 添加 mPicker-main元素
	                 */
	                jsonData.push(self.options.dataJson);
	                if (self.options.level === 2) {
	                    var childStr = getChildJson(self.options.dataJson[0]);
	                    jsonData.push(childStr);
	                }
	                listStr = concatHtmlList.call(self, jsonData);
	                mainStr = '<div class="mPicker-main ' + self.disy + '" data-pickerId="' + self.pickerId + '">' + self.options.header + '<div class="mPicker-content">' + listStr + '</div>' + self.options.footer + '</div>';
	                self.mpicker.append(mainStr);
	                /**
	                 * 设置变量
	                 */
	                self.mpickerMain = self.mpicker.find('.mPicker-main');
	                //元素集合
	                var $content = self.mpickerMain.find('.mPicker-content');
	                var $list = self.mpickerMain.find('.mPicker-list');
	                var $listUl = $list.find('ul');
	                //var $itemOne=$listUl.eq(0);
	                //var $itemTwo=self.options.level === 2?$listUl.eq(1):false;
	                //设置多列宽度
	                if (self.options.level > 1) {
	                    $list.width(ulWidth[self.options.level - 1]);
	                }

	                //添加选中的边框
	                $list.append('<div class="mPicker-active-box"></div>');
	                $list.find('.mPicker-active-box').height(self.options.height);
	                /**
	                 * 设置选中的边框位置
	                 */
	                var activeBoxMarginTop = self.options.rows % 2 === 0 ? -self.options.height - 2 + 'px' : -self.options.height * 0.5 - 2 + 'px';

	                $content.find('.mPicker-active-box').css({
	                    'margin-top': activeBoxMarginTop
	                });
	                /**
	                 * 设置内容高度
	                 */
	                $content.height(self.options.height * self.options.rows);
	                $list.height(self.options.height * self.options.rows);
	            },
	            showPicker: function showPicker() {
	                var self = this;
	                self.mpicker.data('object', self);
	                //元素集合
	                //var $content=this.mpickerMain.find('.mPicker-content');

	                //var $listUl=$list.find('ul');
	                // var $itemOne=$listUl.eq(0);
	                // var $itemTwo=this.options.level === 2?$listUl.eq(1):false;
	                self.render();
	                var $list = self.mpicker.find('.mPicker-list');
	                self.container.focus();
	                self.container.blur();
	                self.mpicker.removeClass('hide');
	                self.mask.removeClass('hide');

	                clearTimeout(self.timer);
	                self.timer = setTimeout(function () {
	                    self.mpickerMain.removeClass('down');
	                }, 10);
	                /**
	                 * 显示默认值(判断点击确定选择后不再获取默认值)
	                 */
	                if (!self.noFirst && self.options.idDefault) {
	                    matchDefaultData.call(self);
	                }
	                /**
	                 * 获取input的data-id显示选中的元素
	                 */
	                var id = [];
	                setTransitionY(self.container, 0);
	                $list.each(function (index, ele) {
	                    var dataVal = self.container.data('id' + (index + 1)) ? self.container.data('id' + (index + 1)) : 0;
	                    id.push(dataVal);
	                });
	                //获得选中的元素
	                setItemMultiple.call(self, id);
	            },
	            hidePicker: function hidePicker(callback) {
	                var self = this;
	                self.mask.addClass('hide');

	                if (self.options.display === 'bottom') {
	                    self.mpicker.find('.mPicker-main').addClass('down').transitionEnd(function () {
	                        self.mpicker.addClass('hide');
	                        self.mpicker.find('.mPicker-main').remove();
	                        if (typeof callback === 'function') {
	                            callback.call(self);
	                        }
	                    });
	                    return false;
	                }

	                self.mpicker.addClass('hide');
	                callback.call(self);
	                self.mpicker.find('.mPicker-main').remove();
	            },
	            updateData: function updateData(data) {
	                var self = this;
	                if (!data.length) {
	                    return;
	                }
	                self.noFirst = false;
	                for (var i = 0; i < self.options.level; i++) {
	                    self.container.data('id' + (i + 1), 0);
	                    self.container.data('value' + (i + 1), '');
	                }
	                self.options.dataJson = data;
	                self.mpicker.find('.mPicker-main').remove();
	            },
	            confirm: function confirm() {
	                var self = this;
	                var str = '';
	                var $list = self.mpicker.find('.mPicker-main').find('.mPicker-list');
	                var $listUl = $list.find('ul');
	                self.noFirst = true;
	                $.each($listUl, function (index, ele) {
	                    var $active = $(ele).find('.active');
	                    var splitStr = index === 0 ? '' : self.options.splitStr;
	                    if ($active.length > 0) {
	                        index = index + 1;
	                        self.container.data('value' + index, $active.data('value'));
	                        self.container.data('id' + index, $active.data('id'));
	                        str += splitStr + $active.text();
	                    }
	                });
	                self.container.val(str);
	                self.hidePicker(self.options.confirm);
	            },
	            cancel: function cancel() {
	                var self = this;
	                self.hidePicker(self.options.cancel);
	            },
	            /**
	            *  事件
	            *  取消，确定，点击遮罩，列表滑动事件
	            */
	            event: function event() {
	                /**
	                 * 点击打开选择
	                 */
	                var self = this;
	                this.container.off('touchstart.container click.container').on('touchstart.container click.container', function (e) {
	                    e.preventDefault();
	                    e.stopPropagation();
	                    self.showPicker();
	                });
	                //点击确定
	                this.mpicker.off('touchstart.confirm click.confirm').on('touchstart.confirm click.confirm', '.mPicker-confirm', function (e) {
	                    e.preventDefault();
	                    var self = $('.mPicker').data('object');
	                    self.confirm();
	                });

	                //点击取消
	                this.mpicker.off('touchstart.cancel click.cancel').on('touchstart.cancel click.cancel', '.mPicker-cancel', function (e) {
	                    e.preventDefault();
	                    var self = $('.mPicker').data('object');
	                    self.cancel();
	                });

	                //点击遮罩取消
	                this.mpicker.off('touchstart.mask click.mask').on('touchstart.mask click.mask', '.mPicker-mask', function (e) {
	                    e.preventDefault();
	                    var self = $('.mPicker').data('object');
	                    if (self.options.shadow) {
	                        self.cancel();
	                    }
	                });

	                //遍历下拉列表
	                var startY;
	                var curY;
	                var moveY;

	                this.mpicker.off('touchstart.list mousedown.list').on('touchstart.list mousedown.list', '.mPicker-list', function (event) {
	                    fnTouches(event);

	                    var $this = $(this).find('ul');

	                    var tranY = getTranslateY($this);

	                    startY = getTouches(event).y - tranY;

	                    changeTime(0, $this);

	                    moveStartLock = true;
	                });

	                this.mpicker.off('touchmove.list mousemove.list').on('touchmove.list mousemove.list', '.mPicker-list', function (event) {
	                    event.preventDefault();
	                    if (!moveStartLock) {
	                        return false;
	                    }
	                    var self = $('.mPicker').data('object');

	                    fnTouches(event);

	                    var translate;

	                    var $this = $(this).find('ul');

	                    var listHeight = $this.height();

	                    var itemHeight = self.options.height * self.options.rows;

	                    var transMaxY = itemHeight - listHeight - parseInt(self.options.rows / 2) * self.options.height;

	                    var transMinY = self.middleRowIndex * self.options.height;

	                    curY = getTouches(event).y;

	                    moveY = curY - startY;

	                    translate = Math.round(moveY);
	                    //过了
	                    translate = translate > transMinY ? transMinY : translate;
	                    translate = translate < transMaxY ? transMaxY : translate;
	                    // console.info(self.options.rows)
	                    setTransitionY($this, translate);
	                    //兼容部分手机有时候没有触发touchend
	                    clearTimeout(self.timeTouchend);
	                    self.timeTouchend = setTimeout(function () {
	                        touchEndFn.call(self, $this);
	                    }, 100);
	                });

	                this.mpicker.off('touchend.list mouseup.list').on('touchend.list mouseup.list', '.mPicker-list', function (event) {
	                    event.preventDefault();
	                    var self = $('.mPicker').data('object');
	                    var $this = $(this).find('ul');
	                    touchEndFn.call(self, $this);
	                });
	            }
	        };
	        function getTouches(event) {
	            if (event.touches !== undefined) {
	                return {
	                    x: event.touches[0].pageX,
	                    y: event.touches[0].pageY
	                };
	            }

	            if (event.touches === undefined) {
	                if (event.pageX !== undefined) {
	                    return {
	                        x: event.pageX,
	                        y: event.pageY
	                    };
	                }
	                if (event.pageX === undefined) {
	                    return {
	                        x: event.clientX,
	                        y: event.clientY
	                    };
	                }
	            }
	        }

	        /**
	         *  滑动结束执行函数
	         *  ele:对应的list==>ul
	         *  如果是联动，则更新相应的list html
	         */
	        function touchEndFn(ele) {
	            clearTimeout(this.timeTouchend);
	            var result = setActiveItem.call(this, ele);

	            var resultId = result.target.data('id');

	            var itemIndex = this.mpicker.find('.mPicker-list ul').index(ele);
	            // this.lock=0;
	            //点第一个联动
	            if (this.options.Linkage && itemIndex === 0) {
	                refreshItemTwo.call(this, resultId);
	            }
	            //回调函数
	            // callbackFnName[itemIndex].call(ele, result);

	            changeTime(400, ele);

	            moveStartLock = false;
	        }

	        /**
	         *  第一次打开匹配默认值
	         */
	        function matchDefaultData() {
	            var self = this;
	            var inputVal = this.container.val().split(this.options.splitStr);
	            var defaultId = [];
	            var defaultValue = [];
	            var dataLevel2;
	            var hasLevel2;
	            //遍历获取id
	            var nameEach = function nameEach(data, index) {
	                $.each(data, function (key, val) {
	                    if (val.name == inputVal[index]) {
	                        defaultId[index] = key;
	                        defaultValue[index] = val.value;
	                        self.container.data('value' + (index + 1), defaultValue[index]);
	                        self.container.data('id' + (index + 1), defaultId[index]);
	                        return false;
	                    }
	                });
	            };
	            if ((typeof inputVal === 'undefined' ? 'undefined' : _typeof(inputVal)) !== 'object' || !inputVal.length || !self.mpicker.find('.mPicker-main')) {
	                return;
	            }

	            //将name值默认匹配成id，一旦匹配就跳出循环，多个匹配取第一个
	            //匹配一级
	            nameEach(this.options.dataJson, 0);
	            //匹配二级
	            dataLevel2 = this.options.Linkage ? this.options.dataJson[defaultId[0]] : this.options.dataJson[0];

	            if (this.options.Linkage && this.options.level === 2 && defaultId[0] && inputVal.length > 1) {
	                hasLevel2 = 1;
	            }

	            if (!this.options.Linkage && this.options.level === 2 && inputVal.length > 1) {
	                hasLevel2 = 1;
	            }

	            if (hasLevel2) {
	                dataLevel2 = getChildJson(dataLevel2);
	                nameEach(dataLevel2, 1);
	            }
	        }
	        /**
	         *  滑动结束，设置transtion值，返回当前选中的li index和元素
	         *  obj:滑动的元素
	         *  val:可有可没有。可传入data-id或不传
	         */
	        function setActiveItem(obj, val) {
	            var result;
	            var y = Math.round(getTranslateY(obj) / this.options.height);
	            //得到选中的index
	            var index = typeof val === 'number' ? obj.find('li').index(obj.find('li[data-id="' + val + '"]')) : this.middleRowIndex - y;

	            var y2 = -this.options.height * (index - this.middleRowIndex);
	            setTransitionY(obj, y2);
	            //添加选中样式
	            obj.find('li').eq(index).addClass('active').siblings('li').removeClass('active');

	            result = {
	                target: obj.find('li').eq(index),
	                index: index
	            };
	            return result;
	        }
	        /**
	         *  传入第一级index，更新第二级html（联动的情况下）
	         */
	        function refreshItemTwo(index) {
	            //兼容不存在child
	            var $itemTwo = this.mpicker.find('.mPicker-list ul').eq(1);
	            var data = getChildJson(this.options.dataJson[index]);
	            if (this.options.level === 2) {
	                var str = concatHtmlItem.call(this, data);
	                $itemTwo.html(str);
	                setActiveItem.call(this, $itemTwo, 0);
	            }
	        }
	        /**
	         *  传入数组，设置多级html
	         *  index:数组
	         */
	        function setItemMultiple(index) {
	            var $item = this.mpicker.find('.mPicker-list ul');
	            var index1 = index[0] ? index[0] : 0;
	            var index2 = index[1] ? index[1] : 0;

	            if (this.options.Linkage) {
	                refreshItemTwo.call(this, index1);
	            }
	            setActiveItem.call(this, $item.eq(0), index1);

	            if (this.options.level === 2) {
	                setActiveItem.call(this, $item.eq(1), index2);
	            }
	        }

	        /**
	         *  传入json,判断返回json,child
	         *  兼容不存在child报错的情况
	         */
	        function getChildJson(data) {
	            if (!data) {
	                return [];
	            }
	            var result = {}.hasOwnProperty.call(data, 'child') ? data.child : [];
	            return result;
	        }
	        /**
	         *  传入json拼接html，只有li级别
	         */
	        function concatHtmlItem(data) {
	            var str = '';
	            var self = this;
	            $.each(data, function (index, val) {
	                var name = self.options.isshort ? val.shortName : val.name;
	                str += '<li data-value="' + val.value + '" data-id="' + index + '">' + name + '</li>';
	            });
	            return str;
	        }
	        /**
	         *  传入li html 拼接ul
	         */
	        function concatHtmlList(data) {
	            var html = '';
	            for (var i = 0; i < data.length; i++) {
	                var itemStr = concatHtmlItem.call(this, data[i]);
	                html += '<div class="mPicker-list"><ul>' + itemStr + '</ul></div>';
	            }
	            return html;
	        }
	        /**
	         *  设置运动时间
	         */
	        function changeTime(times, obj) {
	            obj.css({
	                '-webkit-transition-duration': times + 'ms',
	                'transition-duration': times + 'ms'
	            });
	        }
	        /**
	         *  touches兼容
	         */
	        function fnTouches(e) {
	            if (!e.touches) {
	                e.touches = e.originalEvent.touches;
	            }
	        }
	        /**
	         *  设置translateY
	         */
	        function setTransitionY(obj, y) {
	            obj.css({
	                "-webkit-transform": 'translateY(' + y + 'px)',
	                transform: 'translateY(' + y + 'px)'
	            });
	        }
	        /**
	         *  获取translateY
	         */
	        function getTranslateY(obj) {
	            var transZRegex = /\.*translateY\((.*)px\)/i;
	            var result;
	            if (obj[0].style.WebkitTransform) {
	                result = parseInt(transZRegex.exec(obj[0].style.WebkitTransform)[1]);
	            } else if (obj[0].style.transform) {
	                result = parseInt(transZRegex.exec(obj[0].style.transforms)[1]);
	            }
	            return result;
	        }
	        return new MPicker($(this), options);
	    }
	};

/***/ },

/***/ 46:
/***/ function(module, exports) {

	'use strict';

	/**
	 * datePicker 组件
	 *
	 * *** options ***
	 *
	 * @param {Str}                                 display    显示的方式，默认是显示在底部    'bottom'/'modal'
	 * @param {Boolean}                             shadow     点击遮罩隐藏组件 - 默认为false;若为false，则禁止点击遮罩隐藏组件
	 * @param {Number}                              level      显示的层级，默认：1
	 * @param {Number}                              rows       picker显示的行数，默认：4
	 * @param {Boolean}                             Linkage    选择联动 - 若为false，则不联动
	 * @param {Array}                               dataJson   渲染picker的json - 有规定的格式，可查看json文件。不联动默认遍历获取第一个json
	 * @param {Number}                              height     每一行的高度
	 * @param {Boolean}                             idDefault  匹配默认值 - 若为false，则不匹配
	 * @param {Str}                                 splitStr   设置分割value的符号，与默认值和显示在input里的值有关
	 * @param {Boolean}                             isshort    是否开启简写，默认是关闭的
	 * @param {Element selector}                    header     picker头部html
	 *@param {function}                             confirm: function() {}
	 *@param {function}                             cancel: function() {}
	 *
	 *
	 * *** 关于value值 ***
	 *
	 *$('.select-value').data('value1')：第一级的value值
	 *$('.select-value').data('value2')：第二级的value值
	 *
	 *
	 * *** methods ***
	 *
	 *  show                详情请查阅源码部分
	 *  hide                详情请查阅源码部分
	 *
	 */
	function __dealCssEvent(eventNameArr, callback) {
	    var events = eventNameArr,
	        i,
	        dom = this; // jshint ignore:line

	    function fireCallBack(e) {
	        /*jshint validthis:true */
	        if (e.target !== this) return;
	        callback.call(this, e);
	        for (i = 0; i < events.length; i++) {
	            dom.off(events[i], fireCallBack);
	        }
	    }
	    if (callback) {
	        for (i = 0; i < events.length; i++) {
	            dom.on(events[i], fireCallBack);
	        }
	    }
	}

	//动画结束事件兼容
	$.fn.animationEnd = function (callback) {
	    __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
	    return this;
	};
	$.fn.transitionEnd = function (callback) {
	    __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
	    return this;
	};

	module.exports = {
	    datePicker: function datePicker(options) {
	        var maxTime = new Date();
	        var minTime = new Date(maxTime);
	        minTime.setFullYear(maxTime.getFullYear() - 50);
	        var datePickerDefaults = {
	            display: 'bottom',
	            shadow: false,
	            level: 1,
	            rows: 4,
	            Linkage: false,
	            dataJson: '',
	            height: 36,
	            idDefault: false,
	            splitStr: ' ',
	            splitStr2: ' ',
	            isshort: false,
	            dateConfig: {
	                open: false,
	                maxTime: maxTime,
	                minTime: minTime,
	                dateLevel: 3
	            },
	            header: '<div class="datePicker-header"></div>',
	            footer: '<div class="datePicker-footer"><a href="javascript:;" class="datePicker-confirm">确定</a><a href="javascript:;" class="datePicker-cancel">取消</a></div>',
	            confirm: function confirm() {},
	            cancel: function cancel() {},
	            touchend: function touchend() {}
	        };

	        var moveStartLock;

	        var $body = $('body');

	        var lock, timeTouchend;

	        var datePickerTp = '<div class="datePicker hide"><div class="datePicker-mask hide"></div></div>';

	        /**
	         * 阻止默认滚动
	         */
	        $body.on('touchmove', function (event) {
	            if (lock) {
	                // event.preventDefault();
	                event.stopPropagation();
	            }
	        });

	        /**
	         * 禁止滚动－－防止滚动选择时页面滚动
	         */
	        $body.on({
	            touchstart: function touchstart(event) {
	                // event.preventDefault();
	                lock = 1;
	            },
	            touchmove: function touchmove(event) {
	                // event.preventDefault();
	                //兼容部分手机有时候没有触发touchend
	                clearTimeout(timeTouchend);
	                timeTouchend = setTimeout(function () {
	                    lock = 0;
	                }, 100);
	            },
	            touchend: function touchend(event) {
	                event.preventDefault();
	                lock = 0;
	            }
	        }, '.datePicker-main');

	        // 获取位置
	        function getTouches(event) {
	            if (event.touches !== undefined) {
	                return {
	                    x: event.touches[0].pageX,
	                    y: event.touches[0].pageY
	                };
	            }

	            if (event.touches === undefined) {
	                if (event.pageX !== undefined) {
	                    return {
	                        x: event.pageX,
	                        y: event.pageY
	                    };
	                }
	                if (event.pageX === undefined) {
	                    return {
	                        x: event.clientX,
	                        y: event.clientY
	                    };
	                }
	            }
	        }

	        /**
	         * [description]
	         * @return {[Array]} [将初始数据转换为需要的格式]
	         */
	        function convertData(data, parentvalue) {
	            var arr = [];

	            $.each(data, function (index, val) {
	                if (val.parentvalue === parentvalue) {
	                    arr.push(val);
	                    val.child = convertData(data, val.value);
	                }
	            });
	            return arr;
	        }

	        /**
	         *  滑动结束执行函数
	         *  ele:对应的list==>ul
	         *  如果是联动，则更新相应的list html
	         */
	        function touchEndFn(ele, val, init) {
	            var self = this;
	            var result = setActiveItem.call(this, ele, val);
	            var levelIndex = result.levelIndex; // 当前滑动的ul 索引
	            var index = result.index;
	            changeTime(400, ele);

	            moveStartLock = false;

	            // 联动
	            if (this.options.Linkage) {
	                // 确定下级是哪一级
	                this.selected = this.selected.slice(0, levelIndex);
	                // 本级选择的索引
	                this.selected.push(index);
	                refreshItem.call(this);
	            }

	            clearTimeout(this.datePickerTouchEndFn);
	            this.datePickerTouchEndFn = setTimeout(function () {
	                var str = joinSelected.call(self);
	                var $head = self.$datePicker.find('.datePicker-header');

	                $head.text(str);
	                self.options.touchend.call(self, $head, str);

	                // 如果是时间需要隐藏多余的天数
	                if (levelIndex < 2 || init) {
	                    correctDate.call(self, str);
	                }
	            }, 0);
	        }

	        function correctDate(str) {
	            var options = this.options;

	            if (options.dateConfig.open) {
	                var splitStr = typeof options.splitStr === 'string' ? options.splitStr : options.splitStr2;
	                var arr = str.split(splitStr).slice(0, 2).join('/');
	                var over = new Date(arr + '/31').getDate();
	                var length = 31 - (over !== 31 ? over : 0) - 1;
	                var $ul = this.$datePicker.find('ul:eq(2)');
	                var $li = $ul.find('>li').removeClass('hide');
	                var $active = $li.filter('.active');
	                var index = $active.index();

	                $li.filter(':gt(' + length + ')').addClass('hide');

	                if (index > length) {
	                    touchEndFn.call(this, $ul, length);
	                }
	            }
	        }

	        /**
	         *  匹配默认值
	         */
	        function matchSelectedData(value) {
	            var self = this;
	            var inputVal = value.split(this.options.splitStr);
	            var data = this.options.dataJson;
	            var $ul = self.$datePicker.find('ul');
	            var str = '';

	            $.each(inputVal, function (index, val) {
	                try {
	                    if (index === 0) {
	                        str += 'data';
	                        str += '[' + setSelectedData.call(self, data, val, $ul.eq(index)) + '].child';
	                    } else {
	                        str += '[' + setSelectedData.call(self, eval(str), val, $ul.eq(index)) + '].child';
	                    }
	                } catch (e) {}
	            });

	            // touchEndFn.call(self, $ul, 0);
	            // var data = eval('this.options.dataJson'+str);
	        }

	        // 显示选中的选项
	        function setSelectedData(data, val, $el) {
	            var self = this;
	            var idx = 0;
	            $.each(data, function (index2, val2) {

	                if (val == val2.value) {
	                    touchEndFn.call(self, $el, index2, true);
	                    idx = index2;
	                    return false;
	                }
	            });
	            return idx;
	        }

	        /**
	         *  滑动结束，设置transtion值，返回当前选中的li index和元素
	         *  obj:滑动的元素
	         *  val:可有可没有。可传入data-value或不传
	         */
	        function setActiveItem(obj, val) {
	            var result;
	            // 获取初始第几个值
	            var y = Math.round(getTranslateY(obj) / this.options.height);
	            //得到选中的index
	            var index = typeof val === 'number' ? obj.find('li').index(obj.find('li[data-id="' + val + '"]')) : this.middleRowIndex - y;

	            var y2 = -this.options.height * (index - this.middleRowIndex);
	            setTransitionY(obj, y2);
	            //添加选中样式
	            obj.find('li').eq(index).addClass('active').siblings('li').removeClass('active');

	            result = {
	                // target: obj.find('li').eq(index),
	                index: index,
	                levelIndex: this.$datePicker.find('ul').index(obj)
	            };
	            return result;
	        }

	        /**
	         *  联动的情况下
	         */
	        function refreshItem() {
	            //兼容不存在child
	            //var $itemTwo=this.$datePicker.find('.datePicker-list ul').eq(level);
	            var selected = this.selected;
	            var str = '';

	            $.each(selected, function (index, val) {
	                if (index > 0) {
	                    str += '.child[' + val + ']';
	                } else {
	                    str += '[' + val + ']';
	                }
	            });

	            try {
	                var data = eval('this.options.dataJson' + str);

	                if (data) {
	                    data = data.child;

	                    if (data && data.length) {
	                        var $ul = this.$datePicker.find('ul').eq(selected.length);
	                        var html = concatHtmlItem.call(this, data);
	                        $ul.html(html);
	                        touchEndFn.call(this, $ul, 0);
	                    }
	                }
	            } catch (e) {}
	        }

	        /**
	         *  传入json拼接html，只有li级别
	         */
	        function concatHtmlItem(data) {
	            var str = '';
	            var self = this;
	            $.each(data, function (index, val) {
	                var name = self.options.isshort ? val.shortName : val.name;
	                str += '<li data-value="' + val.value + '" data-id="' + index + '">' + name + '</li>';
	            });
	            return str;
	        }

	        /**
	         *  传入li html 拼接ul
	         */
	        function concatHtmlList(data, j) {
	            var html = '';
	            var itemStr = '';
	            var childStr = '';

	            j = j ? j : 0;

	            for (var i = 0; i < this.options.level; i++) {
	                if (i > 0) {

	                    itemStr = '';
	                    childStr += 'child';

	                    if (data[0] && data[0][childStr] && data[0][childStr].length) {
	                        html += concatHtmlList.call(this, data[0][childStr], i);
	                    }
	                } else {
	                    itemStr = concatHtmlItem.call(this, data);
	                    html += '<div class="datePicker-list"><ul data-value="' + j + '">' + itemStr + '</ul></div>';
	                }
	            }
	            return html;
	        }

	        /**
	         *  设置运动时间
	         */
	        function changeTime(times, obj) {
	            obj.css({
	                '-webkit-transition-duration': times + 'ms',
	                'transition-duration': times + 'ms'
	            });
	        }

	        /**
	         *  touches兼容
	         */
	        function fnTouches(e) {
	            if (!e.touches) {
	                e.touches = e.originalEvent.touches;
	            }
	        }

	        /**
	         *  设置translateY
	         */
	        function setTransitionY(obj, y) {
	            obj.css({
	                "-webkit-transform": 'translateY(' + y + 'px)',
	                transform: 'translateY(' + y + 'px)'
	            });
	        }

	        /**
	         *  获取translateY
	         */
	        function getTranslateY(obj) {
	            var transZRegex = /\.*translateY\((.*)px\)/i;
	            var result;
	            if (obj[0].style.WebkitTransform) {
	                result = parseInt(transZRegex.exec(obj[0].style.WebkitTransform)[1]);
	            } else if (obj[0].style.transform) {
	                result = parseInt(transZRegex.exec(obj[0].style.transforms)[1]);
	            }
	            return result;
	        }

	        function setDateData() {
	            var options = this.options;
	            var config = options.dateConfig;
	            var maxTime = config.maxTime;
	            var minTime = config.minTime;
	            var json = [];
	            var maxYear = maxTime.getFullYear();
	            var minYear = minTime.getFullYear();
	            var c60 = true;
	            var temp, temp2;
	            var dateLevel = config.dateLevel;

	            function setTime(n) {
	                var arr = [];
	                var n2 = -1;

	                // 超过级别跳出递归
	                if (dateLevel === 2 && n === 31 || dateLevel === 3 && n === 24 || dateLevel === 4 && n === 60 || dateLevel === 5 && n === 60 && !c60) {
	                    return;
	                }

	                // 递归输出json
	                if (n < 0) {
	                    return;
	                } else if (n === 12) {
	                    n2 = 31;
	                } else if (n === 31) {
	                    n2 = 24;
	                } else if (n === 24) {
	                    n2 = 60;
	                } else if (n === 60 && c60) {
	                    c60 = false;
	                    n2 = 60;
	                }

	                var i = 0;
	                var j = i;

	                if (n === 12 || n === 31) {
	                    i++;
	                } else {
	                    n--;
	                }

	                // “child”都是引用关系
	                for (i; i <= n; i++) {
	                    if (j === 0 || j === 1) {
	                        j = -1;
	                        temp2 = {
	                            name: i > 9 ? i : '0' + i,
	                            value: i > 9 ? i : '0' + i,
	                            child: setTime(n2)
	                        };
	                        arr.push(temp2);
	                    } else {
	                        arr.push({
	                            name: i > 9 ? i : '0' + i,
	                            value: i > 9 ? i : '0' + i,
	                            child: temp2.child
	                        });
	                    }
	                }
	                return arr;
	            }

	            for (var i = maxYear; i >= minYear; i--) {
	                if (i !== maxYear) {
	                    json.push({
	                        name: i,
	                        value: i,
	                        child: temp.child
	                    });
	                } else {
	                    temp = {
	                        name: i,
	                        value: i,
	                        child: dateLevel > 1 ? setTime(12) : ''
	                    };
	                    json.push(temp);
	                }
	            }
	            options.dataJson = json;
	        }

	        function joinSelected() {
	            var self = this;
	            var str = '';
	            var $list = self.$datePicker.find('.datePicker-list');
	            var $listUl = $list.find('ul');
	            self.noFirst = true;
	            $.each($listUl, function (index, ele) {
	                var $active = $(ele).find('.active');
	                var splitStr = index === 0 ? '' : self.options.splitStr;
	                if (typeof splitStr !== 'string') {
	                    splitStr = self.options.splitStr2;
	                }
	                if ($active.length > 0) {
	                    index = index + 1;
	                    str += splitStr + $active.text();
	                }
	            });
	            return str;
	        }

	        function DatePicker(ele, options) {
	            if (!ele.length) {
	                return false;
	            }
	            this.container = ele;
	            this.$datePicker = $(datePickerTp).appendTo('body');
	            this.mask = this.$datePicker.find('.datePicker-mask');
	            this.options = $.extend(true, {}, datePickerDefaults, options);

	            if (this.options.dateConfig.open) {
	                setDateData.call(this);
	            } else {
	                this.options.dataJson = convertData(this.options.dataJson, 0);
	            }

	            this.init();
	            this.event();
	            this.selected = [];
	            this.dateInit = {};
	        }

	        DatePicker.prototype = {
	            //初始化DatePicker
	            init: function init(ele, options) {

	                /**
	                 * 根据行数计算居中的位置
	                 */
	                this.middleRowIndex = parseInt(this.options.rows / 2.5);
	                //展示方式
	                this.disy = this.options.display === 'bottom' ? 'datePicker-bottom down' : 'datePicker-modal';
	            },
	            //初始化$datePicker,根据json渲染html结构,添加遮罩，边框等
	            render: function render() {
	                /**
	                 *  初始化$datePicker,根据json渲染html结构
	                 *  添加遮罩，边框等
	                 */
	                var listStr;
	                var jsonData = [];
	                var mainStr;
	                var self = this;
	                /**
	                 * 添加 datePicker-main元素
	                 */

	                jsonData = self.options.dataJson;

	                listStr = concatHtmlList.call(self, jsonData);

	                mainStr = '<div class="datePicker-main ' + self.disy + '" data-pickerId="' + self.pickerId + '">' + self.options.header + '<div class="datePicker-content">' + listStr + '</div>' + self.options.footer + '</div>';
	                self.$datePicker.append(mainStr);
	                /**
	                 * 设置变量
	                 */
	                self.$datePickerMain = self.$datePicker.find('.datePicker-main');
	                //元素集合
	                var $content = self.$datePickerMain.find('.datePicker-content');
	                var $list = self.$datePickerMain.find('.datePicker-list');
	                var $listUl = $list.find('ul');
	                //var $itemOne=$listUl.eq(0);
	                //var $itemTwo=self.options.level === 2?$listUl.eq(1):false;
	                //设置多列宽度
	                if (self.options.level > 1) {
	                    $list.width(100 / self.options.level + '%');
	                }

	                //添加选中的边框
	                $list.append('<div class="datePicker-active-box"></div>');
	                $list.find('.datePicker-active-box').height(self.options.height);
	                /**
	                 * 设置选中的边框位置
	                 */
	                var activeBoxMarginTop = self.options.rows % 2 === 0 ? -self.options.height - 2 + 'px' : -self.options.height * 0.5 - 2 + 'px';

	                $content.find('.datePicker-active-box').css({
	                    'margin-top': activeBoxMarginTop
	                });
	                /**
	                 * 设置内容高度
	                 */
	                $content.height(self.options.height * self.options.rows);
	                $list.height(self.options.height * self.options.rows);
	            },
	            showPicker: function showPicker() {
	                var self = this;

	                // 渲染 DOM
	                self.render();

	                var $list = self.$datePicker.find('.datePicker-list');
	                self.container.focus();
	                self.container.blur();
	                self.$datePicker.removeClass('hide');
	                self.mask.removeClass('hide');

	                var $ul = $list.find('ul');

	                clearTimeout(self.timer);
	                self.timer = setTimeout(function () {
	                    self.$datePickerMain.removeClass('down');
	                }, 10);

	                // 初始 y 为0
	                setTransitionY($ul, 0);

	                var value = this.container.val();

	                if (value) {
	                    //touchEndFn.call(this, $ul, 0);
	                    matchSelectedData.call(self, value);
	                } else {
	                    if (self.options.Linkage) {
	                        touchEndFn.call(this, $ul.eq(0), 0);
	                    } else {
	                        touchEndFn.call(this, $ul, 0);
	                    }
	                }
	            },
	            hidePicker: function hidePicker(callback, str) {
	                var self = this;
	                self.mask.addClass('hide');

	                if (self.options.display === 'bottom') {
	                    self.$datePicker.find('.datePicker-main').addClass('down').transitionEnd(function () {
	                        self.$datePicker.addClass('hide');
	                        self.$datePicker.find('.datePicker-main').remove();
	                        if (typeof callback === 'function') {
	                            callback.call(self, str);
	                        }
	                    });
	                    return false;
	                }

	                self.$datePicker.addClass('hide');
	                callback.call(self, str);
	                self.$datePicker.find('.datePicker-main').remove();
	            },
	            confirm: function confirm() {
	                var self = this;
	                var str = joinSelected.call(self);
	                self.container.val(str);
	                self.hidePicker(self.options.confirm, str);
	            },
	            cancel: function cancel() {
	                var self = this;
	                self.hidePicker(self.options.cancel);
	            },
	            /**
	            *  事件
	            *  取消，确定，点击遮罩，列表滑动事件
	            */
	            event: function event() {
	                /**
	                 * 点击打开选择
	                 */
	                var self = this;

	                this.container.off('touchstart.container click.container').on('touchstart.container click.container', function (e) {
	                    e.preventDefault();
	                    e.stopPropagation();
	                    self.showPicker();
	                });

	                //点击确定
	                this.$datePicker.off('touchstart.confirm click.confirm').on('touchstart.confirm click.confirm', '.datePicker-confirm', function (e) {
	                    e.preventDefault();
	                    self.confirm();
	                });

	                //点击取消
	                this.$datePicker.off('touchstart.cancel click.cancel').on('touchstart.cancel click.cancel', '.datePicker-cancel', function (e) {
	                    e.preventDefault();
	                    self.cancel();
	                });

	                //点击遮罩取消
	                this.$datePicker.off('touchstart.mask click.mask').on('touchstart.mask click.mask', '.datePicker-mask', function (e) {
	                    e.preventDefault();
	                    if (self.options.shadow) {
	                        self.cancel();
	                    }
	                });

	                //遍历下拉列表
	                var startY;
	                var curY;
	                var moveY;

	                // 开始拖动
	                this.$datePicker.off('touchstart.list mousedown.list').on('touchstart.list mousedown.list', '.datePicker-list', function (event) {
	                    fnTouches(event);

	                    var $this = $(this).find('ul');

	                    var tranY = getTranslateY($this);

	                    startY = getTouches(event).y - tranY;

	                    changeTime(0, $this);

	                    moveStartLock = true;
	                });

	                // 拖动中
	                this.$datePicker.off('touchmove.list mousemove.list').on('touchmove.list mousemove.list', '.datePicker-list', function (event) {
	                    event.preventDefault();
	                    if (!moveStartLock) {
	                        return false;
	                    }

	                    fnTouches(event);

	                    var translate;

	                    var $this = $(this).find('ul');

	                    var listHeight = $this.height();

	                    var itemHeight = self.options.height * self.options.rows;

	                    var transMaxY = itemHeight - listHeight - parseInt(self.options.rows / 2) * self.options.height;

	                    var transMinY = self.middleRowIndex * self.options.height;

	                    curY = getTouches(event).y;

	                    moveY = curY - startY;

	                    translate = Math.round(moveY);
	                    //过了
	                    translate = translate > transMinY ? transMinY : translate;
	                    translate = translate < transMaxY ? transMaxY : translate;
	                    // console.info(self.options.rows)
	                    setTransitionY($this, translate);

	                    //兼容部分手机有时候没有触发touchend
	                    clearTimeout(self.timeTouchend);
	                    self.timeTouchend = setTimeout(function () {
	                        touchEndFn.call(self, $this);
	                    }, 100);
	                });
	            }
	        };

	        return new DatePicker(this, options);
	    }
	};

/***/ }

/******/ });