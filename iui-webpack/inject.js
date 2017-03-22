window.IUI = IUI || {};
// 调用插件
$.fn.IUI = $.fn.IUI || function() {
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

module.exports = function(component, type) {
    if (type) {
        if (typeof component === 'object' && !IUI[component]) {
            $.extend(IUI, component);
        }
    } else {
        $.extend(component);
    }
}

