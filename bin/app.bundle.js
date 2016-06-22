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

	/**
	 * utils
	 */
	__webpack_require__(1);
	/**
	 * 全局部件
	 */
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);

	/**
	 * UI组件
	 * @场景：PC端，IE8+
	 */

	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);

	/**
	 * UI组件
	 * @场景：适应多端
	 */
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);
	__webpack_require__(19);


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	utils：通用方法
	*/

	window.IUI_UTILS = {
	  animateEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
	  transitionEnd: 'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd',
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

	window.IUI = {};


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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * alert 组件
	 * @param {String}      title 标题                   默认为空
	 * @param {String}      content 内容                 默认为空
	 * @param {String}      confirmText                 确定按钮文本
	 * @param {String}      cancelText                  取消按钮文本
	 * @param {Boolean}     closeBtn                    是否开启关闭按钮
	 * @param {Boolean}     shadow                      是否开启点击阴影关闭
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
	    var animateTime = document.all && !window.atob ? 0 : 200;
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
	      $.alertBackdrop = $('<div class="IUI-alert-backdrop" style="display:none"></div>');
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


	    if (config.keyboard) {
	      if (config.keyboard) {
	        $(window).on('keyup.iui-alert', function(event) {
	          // keyCode => esc
	          if (event.keyCode === 27) {
	            container.find('.IUI-alert-cancel,.IUI-alert-close').trigger('click.iui-alert');
	          }
	          // keyCode => enter
	          if (event.keyCode === 13) {
	            container.find('.IUI-alert-confirm').trigger('click.iui-alert');
	          }
	        });
	      }
	    }

	    /**
	     * [show description]
	     * @param  {jQuery object} target 需要显示的对象
	     */
	    function show(target) {
	        target.removeClass('hide');
	        target.find('.IUI-alert-main').addClass('alert-opening');
	        $.alertBackdrop.fadeIn(animateTime,function(){
	            target.find('.IUI-alert-main').removeClass('alert-opening');
	        });
	    }
	    /**
	     * [hide description]
	     * @param  {jQuery object} target 需要隐藏的对象
	     */
	    function hide(target) {
	        $([$body,target]).off('touchstart.iui-alert click.iui-alert');
	        target.addClass('alert-closing');
	        $.alertBackdrop.fadeOut(animateTime,function(){
	            $(this).addClass('hide');
	            target.remove();
	        });
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


/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports) {

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
	        var x = obj.offset().left;
	        var y = obj.offset().top;
	        var tip;

	        clearTimeout(obj.data('count'));

	        if (param.position) {
	            if (typeof obj.attr('data-tip') === 'undefined') {

	                $('<div class="tips" id="tip_' + id + '" style="left:' + (x + param.offset[0]) + 'px;top:' + (y + objHeight + param.offset[1]) + 'px"></div>').appendTo('body');
	                obj.attr('data-tip', id);

	            }
	            tip = $('#tip_' + obj.attr('data-tip'));

	        }

	        var target = param.position === 'custom' ? tip : obj;

	        target.html('<span class="' + status + '">' + param.text + '</span>').removeClass('hide');

	        obj.data('count', setTimeout(function() {

	            target.addClass('hide');

	            if(param.callback){
	                param.callback();
	            }

	        }, param.timeout));

	    }
	});


/***/ },
/* 7 */
/***/ function(module, exports) {

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


/***/ },
/* 8 */
/***/ function(module, exports) {

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

	                for (var i = 0, email; email < arr.length; i++) {

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
	                $selector.parent().append($list);
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

	            $list.on('click', config.item, function(event) {
	                event.preventDefault();
	                clearTimeout(time);
	                $selector.val($(this).attr('data-value')).focus();
	                $list.addClass('hide');
	                config.checkedCall.apply($selector, [event, config]);
	                return false;
	            });
	        });


	    }
	});


/***/ },
/* 9 */
/***/ function(module, exports) {

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
	            var isSupport = utils.isPlaceholder();
	            if (isSupport) {
	                return false;
	            }

	            var defaults = {
	                target: '.form-control',
	                cloneClass: 'clone-password'
	            };
	            var $selector = $(this);
	            var $window = $(window);
	            var config = $.extend({}, defaults, options);



	            $selector.find(config.target).each(function(index, el) {
	                var placeholder = $(el).attr('placeholder');
	                var $el = $(el);
	                if (el.type === 'password') {

	                    var $clone = $('<input class="' + config.target.slice(1) + '" type="text">');

	                    $el.css({
	                        'display': 'none'
	                    });

	                    $clone.addClass(config.cloneClass).val(placeholder);
	                    $el.parent().append($clone);
	                } else {
	                    el.value = placeholder;
	                }
	            });

	            $selector.find(config.target).on({
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


/***/ },
/* 10 */
/***/ function(module, exports) {

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


/***/ },
/* 11 */
/***/ function(module, exports) {

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


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * layer 组件
	 * @param  {String}            level               多选框级别
	 * @param  {Function}          afterMoveLeft       回调函数 - 移动到左边
	 * @param  {Function}          afterMoveRight      回调函数 - 移动到右边
	 *
	 *
	 * @example
	 *
	 * $('.lrselect-main')IUI('lrselect',function(options));

	 *
	 * html基本结构
	 * div.lrselect-box>ul.lrselect>li
	 *
	 * 二级
	 *div.lrselect-box>ul.lrselect>li>div.mul-title+li.level-2
	 */
	$.fn.IUI({
	    lrselect: function(options) {
	        var defaults = {
	            level: 1,
	            dataJson: '',
	            afterMoveLeft: function() {},
	            afterMoveRight: function() {}
	        };
	        var self = this;
	        var multiObject;
	        /**
	         * 元素字典
	         */
	        var data = {
	            self: {
	                ele: '.lrselect',
	                contraryEle: '.lrselect-to'
	            },
	            to: {
	                ele: '.lrselect-to',
	                contraryEle: '.lrselect'
	            }
	        };
	        var data2 = {
	            self: {
	                ele: '.lrselect .level-2',
	                contraryEle: '.lrselect-to .level-2'
	            },
	            to: {
	                ele: '.lrselect-to .level-2',
	                contraryEle: '.lrselect .level-2'
	            }
	        };

	        self.$container = $(this);
	        self.$multi = self.$container.find('.lrselect');
	        self.$multiTo = self.$container.find('.lrselect-to');
	        self.config = $.extend({}, defaults, options);

	        /**
	         * 按下control||command键||shift键操作
	         */
	        $(window).on('keydown.win', function(e) {
	            e.preventDefault();
	            switch (e.which) {
	                case 17:
	                case 91:
	                    //control||command键
	                    self.$container.data('type', 'mul');
	                    break;
	                case 16:
	                    //shift键
	                    self.$container.data('type', 'continu');
	                    break;
	            }
	        });
	        /**
	         * 松开键盘清除data
	         */
	        $(window).on('keyup.win', function(e) {
	            e.preventDefault();
	            self.$container.data('type', '');
	        });
	        /**
	         * 存储命令模式所需的：函数，值，方向
	         */
	        var Command = function(execute, value, dire) {
	            this.execute = execute;
	            this.value = value;
	            this.dire = dire;
	        };
	        /**
	         * 单例存储撤销，返回撤销，操作。
	         */
	        var Calculator = function() {
	            var commands = [];
	            var redoCommands = [];

	            return {
	                execute: function(command) {
	                    command.execute();
	                    commands.push(command);
	                    multiObject.setValue(command.dire);
	                },
	                /**
	                 * 撤销操作。
	                 */
	                undo: function() {
	                    //pop():删除并返回数组的最后一个元素
	                    if (!commands[0]) {
	                        return false;
	                    }
	                    var command = commands.pop();
	                    redoCommands.push(command);
	                    multiObject.undo(command.value, command.dire);
	                    multiObject.setValue(command.dire);
	                },
	                /**
	                 * 取消撤销。
	                 */
	                redo: function() {
	                    if (!redoCommands[0]) {
	                        return false;
	                    }
	                    var redoCommand = redoCommands.pop();
	                    commands.push(redoCommand);
	                    multiObject.redo(redoCommand.value, redoCommand.dire);
	                    multiObject.setValue(redoCommand.dire);
	                }
	            };
	        };

	        function lrSelect() {
	            this.calculator = new Calculator();
	            this.init();
	        }
	        lrSelect.prototype = {
	            init: function() {
	                self.mulData = self.config.level >= 2 ? data2 : data;
	                this.render(self.config.dataJson);
	                this.setCommandFn();
	                this.events();
	                this.operateEvent();
	            },
	            /**
	             * 初始化渲染html
	             */
	            render: function(json) {
	                var result = concatHtml(json);
	                self.$multi.append(result.item);
	                self.$container.find('select').css('display', 'none').append(result.option);
	                /**
	                 * 有标题的情况
	                 */
	                if (self.config.level >= 2) {
	                    self.mulData = data2;
	                    self.$multiTo.append(self.$multi.children().clone());
	                    self.$multiTo.find('.level-2 li').remove();
	                    self.$container.on('click', '.mul-title', function() {
	                        $(this).toggleClass('active').parent('li').find('.level-2').toggleClass('hide');
	                    });
	                }
	            },
	            /**
	             * 设置操作函数
	             */
	            setCommandFn: function() {
	                var _this = this;
	                self.setCommand = function(ele, fn) {
	                    var id = _this.getId(ele);
	                    _this.calculator.execute(fn(id));
	                };
	                self.moveTo = function() {
	                    MoveItemAndSort('to');
	                };
	                self.move = function() {
	                    MoveItemAndSort('self');
	                };
	                self.moveToAll = function() {
	                    MoveItemAndSort('to', 'all');
	                };
	                self.moveAll = function() {
	                    MoveItemAndSort('self', 'all');
	                };
	                self.moveToTitle = function() {
	                    MoveItemAndSort('to', 'title');
	                };

	                self.moveTitle = function() {
	                    MoveItemAndSort('self', 'title');
	                };

	                //右到左
	                self.toCommand = function(value) {
	                    /*****************(execute,id,dire)******/
	                    return new Command(self.moveTo, value, 'to');
	                };
	                //左到右
	                self.selfCommand = function(value) {
	                    return new Command(self.move, value, 'self');
	                };

	                self.allToCommand = function(value) {
	                    return new Command(self.moveToAll, value, 'to');
	                };

	                self.allSelfCommand = function(value) {
	                    return new Command(self.moveAll, value, 'self');
	                };
	                self.titleToCommand = function(value) {
	                    return new Command(self.moveToTitle, value, 'to');
	                };

	                self.titleSelfCommand = function(value) {
	                    return new Command(self.moveTitle, value, 'self');
	                };
	            },
	            /**
	             * 设置item事件函数
	             */
	            events: function() {
	                var _this = this;
	                var selfLi = self.mulData.self.ele + ' li';
	                var toLi = self.mulData.to.ele + ' li';
	                /**
	                 * 单击item
	                 */
	                self.$container.on('click', selfLi, function(e) {
	                    _this.itemClick($(this), 'self');
	                });

	                self.$container.on('click', toLi, function(e) {
	                    _this.itemClick($(this), 'to');
	                });
	                /**
	                 * 双击item
	                 */
	                self.$container.on('dblclick', selfLi, function(e) {
	                    var $ele = $(this);
	                    self.setCommand($ele, self.selfCommand);
	                });
	                self.$container.on('dblclick', toLi, function(e) {
	                    var $ele = $(this);
	                    self.setCommand($ele, self.toCommand);
	                });
	                /**
	                 * 双击标题移动
	                 */
	                if (self.config.level >= 2) {
	                    self.$multi.on('dblclick', '.mul-title', function(e) {
	                        _this.moveTitle($(this));
	                    });
	                    self.$multiTo.on('dblclick', '.mul-title', function(e) {
	                        _this.moveToTitle($(this));
	                    });
	                }
	            },
	            /**
	             * 移动按钮点击事件函数
	             */
	            operateEvent: function() {
	                var _this = this;
	                if (!self.$container.find('.lrselect-right').length) {
	                    return;
	                }
	                self.$container.on('click', '.lrselect-right', function() {
	                    _this.move();
	                });
	                self.$container.on('click', '.lrselect-left', function() {
	                    _this.moveTo();
	                });
	                self.$container.on('click', '.lrselect-rightAll', function() {
	                    _this.moveAll();
	                });
	                self.$container.on('click', '.lrselect-leftAll', function() {
	                    _this.moveToAll();
	                });
	                self.$container.on('click', '.lrselect-undo', function() {
	                    _this.calculator.undo();
	                });
	                self.$container.on('click', '.lrselect-redo', function() {
	                    _this.calculator.redo();
	                });
	            },
	            /**
	             * 配合键盘control||command,shift按键点击事件函数
	             */
	            itemClick: function(ele, dire) {
	                var type = self.$container.data('type');
	                var $list = ele.parent('ul');
	                var $item = $list.find('li');
	                var _item = self.mulData[dire].ele + ' li';
	                /**
	                 * control||command
	                 */
	                if (type == 'mul') {
	                    ele.toggleClass('current');
	                    return;
	                }
	                /**
	                 * shift
	                 */
	                if (type == 'continu') {
	                    var $first = $list.find('li.current').eq(0);
	                    var firstIndex = $item.index($first);
	                    var index = $item.index(ele);
	                    var begin = index > firstIndex ? firstIndex : index;
	                    var end = index < firstIndex ? firstIndex : index;
	                    if (firstIndex < 0) {
	                        ele.addClass('current');
	                        return;
	                    }

	                    $item.removeClass('current');
	                    for (var i = begin; i <= end; i++) {
	                        $item.eq(i).addClass('current');
	                    }
	                    return;
	                }
	                self.$container.find(_item).removeClass('current');
	                ele.addClass('current');
	            },
	            getId: function(ele) {
	                var id = [];
	                var $ele = ele;
	                $.each($ele, function(index, ele) {
	                    id.push($(ele).data('id'));

	                });
	                id = id.join(',');
	                return id;
	            },
	            /**
	             * 从右到左
	             */
	            moveTo: function() {
	                var $ele = self.$multiTo.find('li.current');
	                self.setCommand($ele, self.toCommand);
	            },
	            /**
	             * 从左到右
	             */
	            move: function() {
	                var $ele = self.$multi.find('li.current');
	                self.setCommand($ele, self.selfCommand);
	            },
	            moveToAll: function() {
	                var $ele = self.$multiTo.find('li');
	                self.setCommand($ele, self.allToCommand);
	            },
	            moveAll: function() {
	                var $ele = self.$multi.find('li');
	                self.setCommand($ele, self.allSelfCommand);
	            },
	            moveToTitle: function(obj) {
	                var $ele = obj.parent('li').find('.level-2 li');
	                obj.addClass('current');
	                self.setCommand($ele, self.titleToCommand);
	            },

	            moveTitle: function(obj) {
	                var $ele = obj.parent('li').find('.level-2 li');
	                obj.addClass('current');
	                self.setCommand($ele, self.titleSelfCommand);
	            },
	            undo: function(value, dire) {
	                var $eleTo = self.$container.find(self.mulData[dire].contraryEle);
	                var $ele = self.$container.find(self.mulData[dire].ele);
	                var id = value.split(',');

	                var html = [];
	                for (var i = 0; i < id.length; i++) {
	                    var $obj = $eleTo.find('li[data-id="' + id[i] + '"]');
	                    html.push($obj);
	                }
	                if (self.config.level >= 2) {
	                    SortItemLevel2Helper(html, $ele);
	                    return;
	                }
	                $ele.append(html);
	                SortItemHelper($ele);
	            },
	            redo: function(value, dire) {
	                var $eleTo = self.$container.find(self.mulData[dire].ele);
	                var $ele = self.$container.find(self.mulData[dire].contraryEle);
	                var id = value.split(',');

	                var html = [];
	                for (var i = 0; i < id.length; i++) {
	                    var $obj = $eleTo.find('li[data-id="' + id[i] + '"]');
	                    html.push($obj);
	                }
	                if (self.config.level >= 2) {
	                    SortItemLevel2Helper(html, $ele);
	                    return;
	                }
	                $ele.append(html);
	                SortItemHelper($ele);
	            },
	            /**
	             * 设置select选中值
	             */
	            setValue: function(dire) {
	                var $ele = self.$container.find(self.mulData.to.ele + ' li');
	                var value = [];
	                self.$container.find('select option').prop("selected", false);
	                $.each($ele, function(index, ele) {
	                    self.$container.find('select option[value="' + $(ele).data('value') + '"]').prop("selected", true);
	                });
	                switch (dire) {
	                    case "to":
	                        self.config.afterMoveLeft();
	                        break;
	                    case "self":
	                        self.config.afterMoveRight();
	                        break;
	                }
	            }
	        };

	        multiObject = new lrSelect();

	        /**
	         * 拼接html
	         * option,li
	         */
	        function concatHtml(json) {
	            var htmlItem = '';
	            var htmlItem2 = '';
	            var htmlOption = '';
	            if (self.config.level === 1) {
	                for (var i = 0; i < json.length; i++) {
	                    htmlItem += '<li data-id="' + (i + 1) + '" data-value="' + json[i].value + '">' + json[i].name + '</li>';
	                    htmlOption += '<option data-id="' + (i + 1) + '" value="' + json[i].value + '">' + json[i].name + '</option>';
	                }
	            }
	            if (self.config.level === 2) {
	                for (var k = 0; k < json.length; k++) {
	                    htmlItem2 = '';
	                    for (var j = 0; j < json[k].child.length; j++) {
	                        htmlItem2 += '<li data-id="' + ((k + 1) * 10 + (j + 1)) + '" data-value="' + json[k].child[j].value + '">' + json[k].child[j].name + '</li>';
	                        htmlOption += '<option data-id="' + ((k + 1) * 10 + (j + 1)) + '" value="' + json[k].child[j].value + '">' + json[k].child[j].name + '</option>';
	                    }
	                    htmlItem += '<li data-id="' + (k + 1) + '">' + '<div class="mul-title">' + json[k].name + '</div><ul class="level-2">' + htmlItem2 + '</ul></li>';
	                }
	            }
	            return {
	                option: htmlOption,
	                item: htmlItem
	            };
	        }

	        /**
	         * 排序：1=》获取id 2=>从小到大排列 3=》拼接html
	         */
	        function SortItemHelper($ele) {
	            var $itemTo = $ele.find('li');
	            var _array = [];
	            var html = [];
	            var $obj;
	            for (var i = 0; i < $itemTo.length; i++) {
	                var id = $itemTo.eq(i).data('id');
	                _array.push(id);
	            }
	            Array.prototype.sort.call(_array,function(x,y) {
	                return x - y;
	            });
	            for (var j = 0; j < _array.length; j++) {
	                $obj = $ele.find('li[data-id="' + _array[j] + '"]');
	                html.push($obj);
	            }
	            $ele.html('').append(html);
	        }
	        /**
	         * ele:原来所在多选框  eleTo：将要移过去的多选框
	         * 有二级时，移动和排序
	         */
	        function SortItemLevel2Helper(ele, eleto) {
	            $.each(ele, function(index, obj) {
	                obj = obj instanceof $ ? obj : $(obj);
	                var id = obj.data('id');
	                var _index = Math.floor(id / 10) - 1;
	                eleto.eq(_index).append(obj);
	            });
	            $.each(eleto, function(index, obj) {
	                SortItemHelper($(obj));
	            });
	        }

	        /**
	         * dire:移动方向
	         * all:确定移动对象 全部||标题||li
	         * 有二级时，进行移动和排序
	         */
	        function MoveItemAndSort(dire, all) {
	            var $ele = self.$container.find(self.mulData[dire].ele + ' li.current');
	            var $eleAll = self.$container.find(self.mulData[dire].ele + ' li');
	            var $eleTo = self.$container.find(self.mulData[dire].contraryEle);
	            if (all === 'all') {
	                $ele = $eleAll;
	            }
	            if (all === 'title') {
	                $ele = $('.mul-title.current').parent('li').find('.level-2 li');
	                $('.mul-title').removeClass('current');
	            }
	            if (self.config.level >= 2) {
	                SortItemLevel2Helper($ele, $eleTo);
	                return;
	            }
	            $eleTo.append($ele);
	            SortItemHelper($eleTo);
	        }

	        return {
	            moveRight: function(ele) {
	                ele.addClass('current');
	                self.setCommand(ele, self.selfCommand);
	            },
	            moveLeft: function(ele) {
	                ele.addClass('current');
	                self.setCommand(ele, self.toCommand);
	            },
	            moveRightAll: function() {
	                var eleAll = self.$multi.find('li');
	                self.setCommand(eleAll, self.allSelfCommand);
	            },
	            moveLeftAll: function() {
	                var eleAll = self.$multiTo.find('li');
	                self.setCommand(eleAll, self.allToCommand);
	            },
	            updateJson: function(json, level) {
	                self.$multi.html('');
	                self.$multiTo.html('');
	                self.$container.find('select').html('');
	                multiObject.calculator = new Calculator();
	                if (level && level != self.config.level) {
	                    self.config.level = Math.min(2, level);
	                    self.mulData = self.config.level >= 2 ? data2 : data;
	                }
	                multiObject.render(json);
	                multiObject.events();
	            }
	        };
	    }
	});


/***/ },
/* 13 */
/***/ function(module, exports) {

	;(function($, window, document, undefined) {

	  /**
	   * [iSelector description]              构造器
	   * @param {[type]} selector [description]   selector
	   * @param {[type]} options  [description]   参数
	   */
	  function iSelector(selector, options) {
	    this.options = $.extend({}, iSelector.defaults, options);
	    this.$container = $(this.options.container);
	    this.$selector = $(selector);
	    this.init();
	    this.event();
	  }

	  /**
	   * [defaults description]         定义参数
	   * dataJson               传入json数据
	   * container              父节点
	   * template               自定义html模板
	   * placeholder              列默认显示的文字
	   * field                input的字段名 [省，市，区]
	   * iselect                是否用于select,默认是false，用于自定义
	   * isvalue                value存的是id 还是 name 默认true.是存id
	   * shorthand              是否开启简写功能,默认不开启 false
	   * level                多少列  默认是一列(级) 1
	   * values                 返回选中的值
	   * joinHtml               拼接html的函数，用于json数据自定义的，里面有4个传值
	                      [data-json数据, pid-json数据的父id, level-列数（级数）, placeholder-默认显示的文字]
	   */

	  /**
	   * 关于 template
	   * data-caller={{caller}} ： 必填，用于呼出下来列表，select时是change事件，自定义标签是click
	   * data-item              ： 自定义标签时必填，因为【项】需要绑定click事件
	   * role="name"            ： 自定义标签时必填，用于声明【name】 显示选中的选项名称
	   * role="content"         ： 自定义标签时必填，用于声明【容器】 选项列表
	   * role="input"       :  自定义标签时必填，用于声明【input】隐藏域
	   * name="{{field}}"     :  input字段名称，必填
	   */
	  iSelector.defaults = {
	    dataJson: null,
	    container: 'body',
	    template: '<div class="selector-level selector-level-{{level}}"><a href="javascript:;" role="name" class="selector-name selector-name-dcolor" data-caller="{{caller}}">{{name}}</a><input type="hidden" name="{{field}}" role="input" value=""><ul role="content" class="selector-list hide">{{content}}</ul></div>',
	    placeholder: ['请选择省份', '请选择市', '请选择区'],
	    field: ['userProvinceId', 'userCityId', 'userAreaId'],
	    iselect: false,
	    isvalue: true,
	    shorthand: false,
	    values: [],
	    level: 1,
	    joinHtml: function(data, pid, level, placeholder) {
	      var _data = data;
	      var _len = _data.length;
	      var _pid = pid || '100000';
	      var _html = this.options.iselect ? '<option>' + placeholder + '</option>' : '';

	      if (level < 0) {
	        return _html;
	      }

	      for (var i = 0; i < _len; i++) {
	        var _name = this.options.shorthand ? _data[i].shortName : _data[i].name;
	        var _val = this.options.isvalue ? _data[i].id : _data[i].name;

	        if (_data[i].parentId === _pid) {
	          if (this.options.iselect) {
	            _html += '<option data-item="' + level + '" value="' + _val + '">' + _name + '</option>';
	          } else {
	            _html += '<li data-item="' + level + '" data-id="' + _data[i].id + '" data-value="' + _val + '">' + _name + '</li>';
	          }
	        }
	      }

	      return _html;
	    },
	    startClick: null //自定义标签一开始点击的回调
	  };

	  iSelector.prototype.init = function() {
	    var self = this;
	    var config = self.options;
	    var html, placeholder, field;

	    /**
	     * [for description]    定义的级别循环,添加html模板到对应的级别去
	     */
	    for (var i = 0; i < config.level; i++) {

	      //默认提示
	      placeholder = config.placeholder[i] || '';

	      //html模板把{{level}}和{{caller}}替换成对应的级别
	      html = config.template.replace('{{level}}', i + 1).replace('{{caller}}', i + 1);

	      if (!i) {
	        html = html.replace('{{content}}', config.joinHtml.call(this, config.dataJson, null, i + 1, placeholder));
	      } else {
	        html = html.replace('{{content}}', config.joinHtml.call(this, config.dataJson, null, -1, placeholder));
	      }

	      //自定义标签的时候会要求有这个{{name}},{{field}},要把这个替换成默认的显示文字
	      if (html.indexOf('{{name}}') !== -1) {
	        html = html.replace('{{name}}', placeholder);
	      }

	      //自定义标签的时候会要求有这个{{field}},要把这个替换成要传的字段名称
	      if (html.indexOf('{{field}}') !== -1) {
	        field = config.field[i] || '';
	        html = html.replace('{{field}}', field);
	      }

	      //把html添加到对应的级别去
	      self.$selector.append(html);

	    }

	  };

	  iSelector.prototype.event = function() {
	    var self = this;
	    var config = self.options;
	    var $selector = self.$selector;

	    /**
	     * 定义的级别循环,级别的事件处理
	     */
	    for (var i = 0; i < config.level; i++) {
	      (eventInjection)(i);
	    }

	    //判断是否是用于自定义的
	    if (!config.iselect) {
	      //执行点击区域外的就隐藏列表;
	      $(document).on('click.iselector', function(event) {
	        var e = event || window.event;
	        var elem = e.target || e.srcElement;
	        while (elem) {
	          if (elem.className && elem.className.indexOf(self) > -1) {
	            return;
	          }
	          elem = elem.parentNode;
	        }

	        self.$selector.find('[role="content"]').addClass('hide');
	      });

	    }

	    function eventInjection(index) {
	      var plusIndex = i + 1;

	      //判断是否是select  是就用chage事件，否则就是click事件
	      if (config.iselect) {

	        $selector.on('change.iselector', '[data-caller="' + plusIndex + '"]', function(event) {
	          var $this = $(this);

	          self.hideSelector($this, index, true);

	        });

	      } else {

	        //显示列表
	        $selector.on('click.iselector', '[data-caller="' + plusIndex + '"]', function(event) {
	          var $this = $(this);
	          var $selectorList = $selector.find('[role="content"]');

	          $selectorList.addClass('hide').eq(index).removeClass('hide');

	          if (typeof config.startClick === 'function') {
	            /**
	             * 一开始点击的时候调用一个回调函数
	             * typeof 判断传进来的类型是不是一个function函数
	             * 返回三个参数 $self/_this/config
	             */
	            config.startClick.apply(this, [self, $this, config]);
	          }

	          return false;
	        });

	        //点击列表事件
	        $selector.on('click.iselector', '[data-item="' + plusIndex + '"]', function(event) {
	          var $this = $(this);

	          config.values = [];

	          self.hideSelector($this, index, false);

	        });
	      }

	    }
	  };

	  /**
	   * [hideSelector description]             选项执行的函数
	   * @param  {[type]} tagert  [description]       传点击的this
	   * @param  {[type]} index   [description]       传循环的列数
	   * @param  {[type]} iselect [description]       是否是select   true/false
	   */
	  iSelector.prototype.hideSelector = function(tagert, index, iselect) {
	    var self = this;
	    var config = self.options;
	    var $selector = self.$selector;
	    var $name = $selector.find('[role="name"]');
	    var $caller = $selector.find('[data-caller]');
	    var $input = $selector.find('[role="input"]');
	    var $content = $selector.find('[role="content"]');
	    var parentId = iselect ? tagert.val() : tagert.attr('data-id');
	    var txt = tagert.text();
	    var plusIndex = index + 1;
	    var nextIndex = index + 2;
	    var placeholder = config.placeholder[plusIndex] || '';

	    /**
	     * [if description]     判断是否是用于select，执行select事件，否则执行自定义的事件
	     * @param  {[type]} iselect [description]   是否是用于select
	     */
	    if (iselect) {

	      //默认提示
	      placeholder = config.placeholder[plusIndex] || '';

	      //添加下一列的选项
	      $content.eq(plusIndex).html(config.joinHtml.call(self, config.dataJson, parentId, nextIndex, placeholder));

	      //执行下一列的事件，然后选中第一个
	      $content.eq(plusIndex).find('[data-item]').eq(0).prop('selected', true).trigger('change');

	    } else {

	      //添加选中的class
	      tagert.addClass('checked').siblings('.checked').removeClass('checked');

	      //添加选中的文字到name显示
	      $name.eq(index).text(txt).removeClass('selector-name-dcolor');

	      //添加选中的值到input里
	      $input.eq(index).val(parentId);

	      //添加下一列的选项列表
	      $content.eq(plusIndex).html(config.joinHtml.call(self, config.dataJson, parentId, nextIndex, placeholder));

	      //执行下一列的点击事件，选中第一个
	      $content.eq(plusIndex).find('[data-item]').eq(0).trigger('click');

	      //隐藏对应的列表
	      $content.eq(index).addClass('hide');

	    }

	    //返回选中的值
	    config.values.unshift(parentId);

	    //选择选项后触发自定义事件choose(选择)事件
	    $selector.trigger('choose-' + plusIndex, [self, tagert, plusIndex, config.values]);

	  };

	  $.fn.IUI({
	    iselector: function(config) {
	      return this.each(function() {
	        if (!$(this).data('iselector')) {
	          $(this).data('iselector', new iSelector(this, config));
	        }
	      });
	    }
	  });

	})(jQuery, window, document);


/***/ },
/* 14 */
/***/ function(module, exports) {

	 /**
	 * tokenize 组件
	 * @param  {boolean} readOnly 为true的时候，其他所有option失效
	 * @return {string}   contain 默认为'.tokenize'，共有上下文
	 * @param  {string} remove 如果为'no-remove'，表示不能删除初始化就选中的token
	 * @param  {number} maxLength 最多可以输入多少个字符进行搜索，默认是10
	 * @param  {function} overLimitCount 选择超过限制个数触发
	 * @return {function}   existToken 已经存在标签触发
	 * @return {function}   searchCallback 搜索后的回调函数
	 * .tokenize > select + ul + .token > .token-item
	 */
	 /*
	    多级必须有optgroup 必须有label属性
	 */
	;(function($){
	    var settings = {
	        readOnly: false,
	        contain: '.tokenize',
	        remove: '',
	        maxLength: 20,
	        overLimitCount: function(){},
	        existToken: function(){},
	        searchCallback: function(){}
	    };

	    var KEY_CODE = {
	        top: 38,
	        right: 39,
	        bottom: 40,
	        left: 37,
	        enter: 13,
	        back: 9
	    };

	    var htmlTemplate = {
	        spanTemplate: ['<span class="token-item">',
	                        '<span>{text}</span><span data-value="{value}" class="token-close">x</span>',
	                    '</span>'].join(''),
	        optionTemplate: '<option selected="selected" value="{value}">{value}</option>',
	        liTemplate: '<li class="hidden" data-value="{value}">{value}</li>',
	        inputTemplate: '<div class="token"> <span> <input type="text" maxlength="{{maxlength}}" style="width: {{width}}px"> </span> </div>'
	    };

	    var tokenize = $.fn.tokenize = function(options){
	        var defaults = $.extend({}, settings, options);

	        htmlTemplate.inputTemplate = htmlTemplate.inputTemplate.replace('{{maxlength}}', defaults.maxLength).replace('{{width}}', defaults.maxLength*12);

	        this.each(function(index, el) {
	            var $this = $(this);
	            var limitCount = $this.attr('data-limitCount') * 1;

	            if (typeof limitCount !== 'number' || isNaN(limitCount)) {
	                limitCount = Infinity;
	            }
	            $this.data({
	                showAll: $this.attr('data-showAll') === 'false' ? false : true,
	                create: $this.attr('data-create') === 'false' ? false : true,
	                limitCount: limitCount
	            });

	            //添加input
	            $this.append(htmlTemplate.inputTemplate);

	            //创建模拟下拉框
	            tokenize.renderSelect($this);

	            //设置各种事件
	            tokenize.setEvent($this, defaults);

	            //创建默认token
	            $this.find('li[uled]').each(function(index, el) {
	                $(el).addClass('current ' + defaults.remove).trigger('click');
	            });

	            // 恢复显示
	            $this.find('.tokenize-level').removeClass('hide');
	        });
	    };


	    //模拟下拉框
	    tokenize.renderSelect = function($contain){
	        var htmlStr = $contain.find('select').prop('outerHTML');

	        htmlStr = (htmlStr + '').replace(/<optgroup\s+label="(.*)".*>/g, '<li class="tokenize-level">$1<ul class="tokenize-menu">');
	        htmlStr = htmlStr.replace(/<\/optgroup>/g, '</ul></li>');
	        htmlStr = htmlStr.replace(/select/g, 'ul').replace(/option/g, 'li').replace(/value/g, 'data-value');
	        $contain.append(htmlStr);
	    };

	    //创建token
	    tokenize.createToken = function(text, value, defaults){
	        var $inp = $(this).parents(defaults.contain).find('input').val('');
	        var $token = $inp.parent();
	        var str = htmlTemplate.spanTemplate.replace('{text}', text).replace('{value}', value);
	        $(str).insertBefore($token);
	    };

	    //设置事件
	    tokenize.setEvent = function($contain, defaults){

	        if (defaults.readOnly === false) {
	            //删除token
	            $contain.on('click', '.token-close', function(event) {
	                event.stopPropagation();
	                var $this = $(this);
	                var $contain = $this.parents(defaults.contain);
	                var value = $this.attr('data-value');
	                var $li = $contain.find('li[data-value="'+value+'"]');
	                if ($li.hasClass('no-remove')) {
	                    return;
	                }
	                $contain.find('option[value="'+value+'"]').removeAttr('selected');
	                $li.removeClass('hidden');
	                $li.parents('li').eq(0).removeClass('hide');
	                $this.parent('.token-item').remove();

	                tokenize.hideToken($contain);
	            });

	            //聚焦输入
	            $contain.on('click', '.token', function(event) {
	                event.stopPropagation();
	                var $this = $(this);
	                $this.find('input').focus();
	                tokenize.searchToken.call($this.find('input')[0], defaults);
	            });

	            //输入搜索token
	            $contain.on('keyup', 'input', function(event) {
	                var keycode = event.keyCode;
	                var KC = KEY_CODE;
	                if(keycode !== KC.enter && keycode !== KC.back && keycode !== KC.bottom && keycode !== KC.top) {
	                    tokenize.searchToken.call(this, defaults);
	                }
	            });

	            //按下enter键设置token
	            $contain.on('keyup', '>ul,input', function(event) {
	                var keycode = event.keyCode;
	                var KC = KEY_CODE;
	                if(keycode === KC.enter || keycode === KC.back) {
	                    tokenize.setToken.call(this, defaults);
	                }
	            });

	            //按下上下键切换token
	            $contain.on('keyup', function(event) {
	                var keycode = event.keyCode;
	                var KC = KEY_CODE;
	                if (keycode === KC.bottom || keycode === KC.top) {
	                    tokenize.turnToken.call(this, keycode);
	                }
	            });

	            //鼠标样式
	            $contain.on('mouseenter', 'li', function(event) {
	                if (!$(this).hasClass('tokenize-level')) {
	                    var $this = $(this);
	                    $this.parents(defaults.contain).find('li').removeClass('current');
	                    $this.addClass('current');
	                }
	            });
	        }else{
	            $contain.find('input').attr('readonly', 'readonly');
	        }



	        //点击li设置token
	        $contain.on('click', 'li', function(event) {
	            if (!$(this).hasClass('tokenize-level')) {
	                tokenize.setToken.call(this, defaults);
	            }else{
	                event.stopPropagation();
	            }
	        });

	    };

	    //输入搜索token
	    tokenize.searchToken = function(defaults){
	        var $contain =  $(this).parents(defaults.contain);

	        // 获取可见的非级别li
	        var $lis = $contain.find('>ul').removeClass('hide').find('li').not('.tokenize-level').removeClass('current').not('.hidden');
	        var showAll = $contain.data('showAll');
	        var values = $.trim(this.value);
	        var count = 0;
	        $lis.each(function(index, el) {
	            var $el = $(el);
	            var txts = $el.text();
	            var cn = count !== 0 ? '' : 'current';


	            if ((showAll || values !== '') && txts.indexOf(values) > -1) {
	                ++count;
	                $el.removeClass('hide').addClass(cn);
	            }else{
	                $el.addClass('hide');
	            }

	        });

	        defaults.searchCallback.call($contain);

	        // 隐藏父ul
	        tokenize.hideTitle.call($contain);
	    };

	    //按下enter键或者点击 li 设置token
	    tokenize.setToken = function(defaults){
	        var $contain = $(this).parents(defaults.contain);
	        var $tokens = $contain.find('li').not('.tokenize-level');
	        //var $visibleTokens = $tokens.filter(':visible');
	        var $selectedTokens = $tokens.filter('.current');
	        var str;
	        var index;
	        var $inp = $contain.find('.token input');
	        var value = $.trim($inp.val());

	        if (!tokenize.testCount.call(this, defaults)) {
	            defaults.overLimitCount($contain);
	            return;
	        }

	        if (!tokenize.testExist.call(this, defaults)) {
	            defaults.existToken($contain);
	            return;
	        }

	        //$selectedTokens = $selectedTokens.length ? $selectedTokens : $visibleTokens.eq(0);
	        if ($selectedTokens.length) {
	            $selectedTokens.removeClass('current').addClass('hidden');

	            //创建 token
	            tokenize.createToken.call(this, $selectedTokens.text(), $selectedTokens.attr('data-value'), defaults);

	            //改变select
	            index = $tokens.index($selectedTokens);
	            $contain.find('option').eq(index).attr('selected', 'selected');

	            // 隐藏父ul
	            tokenize.hideTitle.call($contain);
	        }else{
	            var $ul = $contain.find('ul');

	            // 多级是无法创建的
	            if($contain.data('create') && $ul.length === 1 && value){
	                //添加 li
	                $contain.find('ul').append(htmlTemplate.liTemplate.replace(/\{value\}/g, value));

	                //创建 token
	                tokenize.createToken.call(this, value, value, defaults);

	                //修改 select
	                $contain.find('select').append(htmlTemplate.optionTemplate.replace(/\{value\}/g, value));
	            }
	        }
	        tokenize.hideToken($contain);
	    };

	    //按下上下键切换token
	    tokenize.turnToken = function(keycode){
	        var $tokens = $(this).find('li').not('.tokenize-level');
	        var $visibleTokens = $tokens.filter(':visible');
	        var $selectedTokens = $visibleTokens.filter('.current');
	        var index = $visibleTokens.index($selectedTokens);
	        var length = $visibleTokens.length;
	        if (length) {
	            index = keycode === 40 ? (index +1)%length : (index !== -1 ? index - 1 : index)%length;
	            $selectedTokens.removeClass('current');
	            $visibleTokens.eq(index).addClass('current');
	        }
	    };

	    //隐藏li
	    tokenize.hideToken = function($ele){
	        $(document).click(function(event) {
	            tokenize.hideToken($('.tokenize'));
	        });
	        return function($ele){
	            $ele.find('>ul').addClass('hide');
	            $ele.find('li').not('.tokenize-level').addClass('hide');
	            //return $ele.find('ul').not('.tokenize-menu').addClass('hide').find('li').addClass('hide');
	        };
	    }();

	    //隐藏标题（多级的情况）
	    tokenize.hideTitle = function(){
	        var $lis = this.find('.tokenize-level');

	        $lis.each(function(index, el) {
	            var $el = $(el);

	            if($el.find('li:not(.hidden):not(.hide)').length > 0){
	                $el.removeClass('hide');
	            }else{
	                $el.addClass('hide');
	            }
	        });
	    };

	    //判断选择的个数
	    tokenize.testCount = function(defaults){
	        var $contain = $(this).parents(defaults.contain);
	        var limitCount = $contain.data('limitCount');
	        var length = $contain.find('.token-item').length;
	        if (limitCount !== Infinity) {
	            if (length >= limitCount) {
	                return false;
	            }
	        }
	        return true;
	    };

	    //判断是否已经存在
	    tokenize.testExist = function(defaults){
	        var $contain = $(this).parents(defaults.contain);
	        var text = $.trim($contain.find('.token input').val());
	        var $tokenItem = $contain.find('.token-item');
	        var result = true;
	        $tokenItem.each(function(index, el) {
	            var $span = $(el).find('span').eq(0);
	            if ($span.text() === text) {
	                result = false;
	                return;
	            }
	        });
	        return result;
	    };

	    $.fn.IUI({
	     tokenize: tokenize
	    });

	})(jQuery);

/***/ },
/* 15 */
/***/ function(module, exports) {

	/**
	 * layer 组件
	 * @param  {String}            container           组件的执行上下文环境，默认是body
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
	 * @event
	 *
	 * $('selector').on('layer.show',function(){});
	 * $('selector').on('layer.hide',function(){});
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

	(function($, window) {

	  var $backdrop = $('<div class="layer-backdrop" style="display:none"></div>');
	  var screenH = document.documentElement.clientHeight;
	  var $body = $('body');
	  var animateTime = document.all && !window.atob ? 0 : 200;
	  function Layer(config, selector) {
	    var defaults = {
	      container: 'body',
	      vertical: true,
	      cache: false,
	      shadow: true,
	      confirmHandle: '.btn-confirm',
	      closeHandle: '.btn-cancel,.btn-close',
	      offsetWidth: 'auto',
	      offsetHeight: 'auto',
	      url: $(this).attr('data-url') || false,
	      dataType: $(this).attr('data-dataType') || 'html',
	      content: '',
	      successCall: function() {},
	      errorCall: function() {},
	      confirmCall: function() {},
	      cancelCall: function() {}
	    };
	    this.$selector = selector;
	    this.config = $.extend(defaults, config);
	    this.$backdrop = $backdrop;

	    this.init();
	    this.event();
	  }

	  Layer.prototype.init = function() {
	    var self = this;
	    var config = self.config;
	    var template = '<div class="layer-box hide" id="{layerName}"><div class="layer-content">' + config.content + '</div></div>';
	    var $selector = this.$selector = self.$selector.length ? self.$selector : $(template.replace('{layerName}', self.$selector.selector.replace('#', ''))).appendTo(config.container);
	    var $container = config.container === 'body' ? $body : $(config.container);
	    var closeHandle = config.closeHandle;
	    var $content = this.$content = $selector.find('.layer-content');
	    var layerWidth = Number($selector.attr('data-width')) || config.offsetWidth;
	    var layerHeight = Number($selector.attr('data-height')) || config.offsetHeight;

	    $content.css({
	      width: layerWidth,
	      height: layerHeight
	    });
	  };

	  Layer.prototype.ajaxLoad = function() {
	    var self = this;
	    var config = self.config;
	    var $selector = self.$selector;
	    var requestUrl = config.url || '?';
	    var method = $selector.attr('data-method') || 'GET';
	    var dataType = config.dataType;

	    if (config.cache && $selector.data('success')) {
	      self.showLayer();
	      return false;
	    }

	    $.loading(true, true);
	    $selector.data('success', 1);

	    $.ajax({
	      url: requestUrl,
	      type: method,
	      dataType: dataType,
	      data: config.data
	    }).then(function(res) {
	      $.loading(false);
	      config.successCall.apply($selector, [res, this, self]);
	      self.showLayer();
	    }, function(err) {
	      $.loading(false);
	      self.hideLayer();
	      config.errorCall.apply($selector, [err, this, self]);
	    });

	    return self;
	  };

	  Layer.prototype.event = function() {
	    var self = this;
	    var config = self.config;
	    var $selector = self.$selector;

	    //确认事件
	    $selector.on('click.iui-layer', config.confirmHandle, function(event) {
	      event.preventDefault();
	      config.confirmCall.apply($selector, [event, this]);
	      return false;
	    });

	    // 阴影层事件
	    $selector.on('click.iui-layer', function(event) {
	      if (!config.shadow) {
	        return false;
	      }
	      if ($body.find('.layer-loading').length) {
	        return false;
	      }
	      self.hideLayer();
	      config.cancelCall.apply($selector, [event, this]);
	      return false;
	    });

	    //阻止事件冒泡
	    $selector.on('click.iui-layer', '.layer-content', function(event) {
	      event.stopPropagation();
	    });

	    //绑定关闭事件
	    $selector.on('click.iui-layer', config.closeHandle, function(event) {
	      self.hideLayer();
	      config.cancelCall.apply($selector, [event, this]);
	      return false;
	    });
	  };

	  Layer.prototype.showLayer = function() {
	    var self = this;
	    var config = self.config;

	    self.$selector.removeClass('hide');
	    self.$selector.after($backdrop);
	    self.resize();
	    self.$content.addClass('layer-opening');
	    $backdrop.fadeIn(animateTime, function() {
	      self.$content.removeClass('layer-opening');
	    });
	    self.$selector.trigger('layer.show', [self]);
	    return self;
	  };


	  Layer.prototype.hideLayer = function() {
	    var self = this;
	    var config = self.config;

	    self.$content.addClass('layer-closing');
	    self.$backdrop.fadeOut(animateTime, function() {
	      self.$selector.addClass('hide');
	      self.$content.removeClass('layer-closing');
	      $(this).remove();
	    });
	    self.$selector.trigger('layer.hide', [this]);

	    return self;
	  };

	  Layer.prototype.resize = function() {
	    var self = this;
	    var config = self.config;
	    var $content = self.$content;
	    var outerHeight = parseInt($content.css('margin-bottom')) * 2;
	    var contentHeight = $content.outerHeight() + outerHeight;

	    $body.addClass('layer-open');

	  };

	  $.fn.IUI({
	    layer: function(config) {
	      return new Layer(config, this);
	    }
	  });

	}(jQuery, window));


/***/ },
/* 16 */
/***/ function(module, exports) {

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


/***/ },
/* 17 */
/***/ function(module, exports) {

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

	            var $selector = $(this);
	            var config = $.extend({}, defaults, options);
	            var $items = $selector.find(config.item);
	            var $contents = $selector.find(config.content);
	            var time = null;
	            var index = 0;
	            if (!$items.length) {
	                return;
	            }


	            init($items.eq(0));

	            $selector.on(config.handle, config.item, function(event) {
	                event.preventDefault();
	                var _this = $(this);
	                config.beforeShow.apply(_this, [event, config]);
	                init(_this);
	                config.afterShow.apply(_this, [event, config]);
	            });


	            function init(current, isLoop) {
	                var _items = $selector.find(config.item);
	                _contents = $selector.find(config.content);
	                index = _items.index(current);
	                _items.removeClass(config.current);
	                _contents.removeClass(config.current);
	                _items.eq(index).addClass(config.current);
	                _contents.eq(index).addClass(config.current);

	            }

	        });
	    }
	});


/***/ },
/* 18 */
/***/ function(module, exports) {

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
	$.fn.IUI({
	    ajaxForm: function(options) {
	        return this.each(function() {
	            var $selector = $(this);
	            var defaults = {
	                url: $selector.attr('action'),
	                method: $selector.attr('method') || 'POST',
	                type: $selector.attr('data-type') || 'json',
	                data: $selector.attr('data-ajaxType') || 'ajax',
	                before: function() {},
	                success: function() {},
	                error: function() {},
	                pending: function() {},
	                always: function(){}

	            };

	            var $fields = $selector.find('input');
	            var config = $.extend({}, defaults, options);

	            $selector.data('deferred', config);

	            $selector.on('submit', function(event) {
	                event.preventDefault();
	                if ($selector.hasClass('disabled')) {

	                    config.pending.call($selector, config);

	                    return false;
	                }

	                var beforeResult = config.before.call($selector, event, config);

	                var args = {
	                    url: config.url,
	                    type: config.method,
	                    data: $selector.serialize()
	                };

	                // ajax2
	                if (config.data !== 'ajax') {
	                    args.data = new FormData($selector[0]);
	                    args.cache = false;
	                    args.contentType = false;
	                    args.processData = false;
	                }

	                if (beforeResult === false) {
	                    return false;
	                }
	                $selector.addClass('disabled').prop('disabled',true);
	                $.ajax(args).then(function(res) {
	                    $selector.removeClass('disabled').prop('disabled',false);
	                    config.success.call($selector, res, config);
	                }, function(err) {
	                    $selector.removeClass('disabled').prop('disabled',false);
	                    config.error.call($selector, err, config);
	                }).always(function(res) {
	                    config.always.call($selector, res, config);
	                });
	            });

	        });
	    }
	});


/***/ },
/* 19 */
/***/ function(module, exports) {

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
	                    var value = $target[0].value;
	                    if ($.trim(value).length === 0) {
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
	                        return false;
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
	                var self = this;
	                var collections = self.options.collections;
	                var statusArr = ['info', 'success', 'error'];
	                for (var i = 0; i < collections.length; i++) {
	                    self.add(collections[i]);
	                }
	                self.behavior();
	                $.each(self.cache, function(name, fields) {
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
	                var self = this;
	                var handle = handler.call(this);
	                this.$selector.on('focus', handle, function(event) {
	                    var $this = $(this);
	                    var _name = $this.data('required');
	                    var collections = self.cache[_name];
	                    if (self.options.infoClass) {
	                        self.message(0, collections);
	                    }
	                    $this.trigger('validate.focus', collections);
	                });

	                this.$selector.on('blur', handle, function(event) {
	                    self.verify.call(this, self, 'blur');
	                });

	                this.$selector.on('change', 'input[type=radio][data-required],input[type=checkbox][data-required],input[type="file"][data-required]', function(event) {
	                    self.verify.call(this, self, 'change');
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

	                var className, contextClass, msg, $target, $msgEl;

	                contextClass = ['info', 'success', 'error'];

	                $msgEl = this.options.globalMessage ? $(this.options.globalMessage) : options.context;


	                if (status === 0) {
	                    className = this.options.infoClass;
	                    msg = options.infoMsg;
	                } else if (status === 1) {
	                    className = this.options.successClass;
	                    msg = '';
	                } else if (status === 2) {
	                    className = this.options.errorClass;
	                    msg = options.matches[matchesName].errMsg;
	                } else {
	                    // 后期再考虑 status === anything ...
	                }

	                className = className.replace(/\./g, ' ').slice(1);
	                $msgEl.removeClass('validate-context-info validate-context-success validate-context-error')
	                    .addClass('validate-context-' + contextClass[status]).find('.validate-message').remove();
	                $target = $('<div class="validate-message ' + className + '" >' + msg + '</div>');
	                $msgEl.append($target);

	            };

	            /**
	             * batch    批量验证
	             * @param  {Boolean}            circulation       强制循环，true：将全部验证，false：其中一个验证不通过将返回false并中断循环
	             * @return {Boolean}
	             *
	             */
	            Validate.prototype.batch = function(circulation) {
	                var self = this;
	                var status = [];
	                $.each(this.cache, function(name, target) {
	                    var initStatus = target.self.data('validateStatus');
	                    var result = !initStatus ? self.verify.call(target.self, self, 'batch') : initStatus;

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
	                var str = '';
	                var collections = this.options.collections;

	                for (var i = 0; i < collections.length; i++) {
	                    var key = collections[i].required;
	                    if (/checkbox|radio|file/.test(this.cache[key].self[0].type)) {
	                        continue;
	                    }
	                    str += '[data-required=' + collections[i].required + '],';
	                }
	                return str.slice(0, str.length - 1);

	            }

	            return new Validate(options);
	        }
	    });


/***/ }
/******/ ]);