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
