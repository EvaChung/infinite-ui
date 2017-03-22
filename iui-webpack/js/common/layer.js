let utils          = require('../utils');
let scrollBarWidth = utils.scrollBarWidth;
let $body          = $('body');
let defaults       = {
    container      : 'body',
    cache          : false,
    shadow         : true,
    confirmHandle  : '.btn-confirm',
    closeHandle    : '.btn-cancel,.btn-close',
    offsetWidth    : 'auto',
    offsetHeight   : 'auto',
    url            : $(this).attr('data-url') || false,
    dataType       : $(this).attr('data-dataType') || 'html',
    data           : '',
    method         : 'GET',
    content        : '',
    animateDisable : false,
    zIndex         : 0,
    trigger        : 'click',
    dynamic        : false,
    showCall       : function() {},
    hideCall       : function() {},
    successCall    : function() {},
    errorCall      : function() {},
    confirmCall    : function() {},
    cancelCall     : function() {}
};

function Layer(config, selector) {
    this.$selector = selector;
    this.config    = $.extend(defaults, config);
    //创建遮罩层
    this.$backdrop = $('<div class="layer-backdrop"></div>');
    this.init();
}

Layer.prototype.init = function() {
    var _this        = this;
    var config      = _this.config;
    var template    = '<div class="layer-box hide" id="{{layerName}}" tabindex="1"><div class="layer-content">' + config.content + '</div></div>';
    var $selector   = this.$selector = _this.$selector.length ? _this.$selector : $(template.replace('{{layerName}}', _this.$selector.selector.replace('#', '')));
    var $content    = this.$content = $selector.find('.layer-content');
    var layerWidth  = Number($selector.attr('data-width')) || config.offsetWidth;
    var layerHeight = Number($selector.attr('data-height')) || config.offsetHeight;

    if(!config.dynamic){
        $selector.appendTo(config.container);
    }

    if(config.zIndex){
        _this.$backdrop.css('z-index',config.zIndex);
        $selector.css('z-index',config.zIndex + 10);
    }


    $content.css({
        width: layerWidth,
        height: layerHeight
    });

    $selector.data('layer', _this);


};

Layer.prototype.ajaxLoad = function() {
    var _this       = this;
    var config     = _this.config;
    var $selector  = _this.$selector;
    var requestUrl = config.url || '?';
    var method     = ($selector.attr('data-method') || config.method).toUpperCase();
    var dataType   = config.dataType;

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
    }).then(function(res) {
        $.loading(false);
        config.successCall.apply($selector, [res, this, _this]);
        _this.showLayer();
    }, function(err) {
        $.loading(false);
        _this.hideLayer();
        config.errorCall.apply($selector, [err, this, _this]);
    });

    return _this;
};

Layer.prototype.event = function() {
    var _this      = this;
    var config    = _this.config;
    var $selector = _this.$selector;

    //确认事件
    $selector.on(config.trigger + '.iui-layer', config.confirmHandle, function(event) {
        event.preventDefault();
        config.confirmCall.apply($selector, [event, _this]);
        return false;
    });

    // 阴影层事件
    $selector.on(config.trigger + '.iui-layer', function(event) {
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
    $selector.on(config.trigger + '.iui-layer', config.closeHandle, function(event) {
        _this.hideLayer();
        config.cancelCall.apply($selector, [event, _this]);
        return false;
    });
};

Layer.prototype.showLayer = function(cutto) {
    var _this      = this;
    var config    = _this.config;
    var $backdrop = _this.$backdrop;
    var $body     = $('body');
    var screenH   = document.documentElement.clientHeight;
    var gtIE10    = document.body.style.msTouchAction === undefined;
    var isCutto   = cutto;
    var Q         = $.Deferred();
    _this.$selector.appendTo(config.container);
    _this.event();
    // 当body高度大于可视高度，修正滚动条跳动
    // >=ie10的滚动条不需要做此修正,tmd :(
    if ($body.height() > screenH & (gtIE10)) {
        $body.data('initstyle',$body.attr('style') || '');
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

    utils.animateEndShim(_this.$content, function(event) {
        _this.$content.removeClass('layer-opening');
        //触发show事件
        _this.$selector.trigger('layer.show', [_this]);
        //触发showCall回调
        config.showCall.apply(_this.$selector, [_this]);

        Q.resolve();
    },config.animateDisable);

    // 绑定 esc 键盘控制
    $(document).on('keyup.iui-layer', function(event) {
        if (event.keyCode === 27) {
            _this.$selector.trigger('click.iui-layer', config.closeHandle);
        }
    });

    //返回Layer对象
    return Q;
};


Layer.prototype.hideLayer = function(cutto) {
    var _this    = this;
    var config  = _this.config;
    var isCutto = cutto;
    var Q       = $.Deferred();
    //插入-弹层-隐藏动画
    _this.$content.off(utils.animateEnd);
    _this.$content.addClass('layer-closing');
    if (!isCutto) {
        _this.$backdrop.removeAttr('style');
        utils.transitionEndShim(_this.$backdrop, function() {
            _this.$backdrop.remove();
        },config.animateDisable);
    }
    utils.animateEndShim(_this.$content, function(event) {
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
    },config.animateDisable);


    //恢复 body 滚动条
    $body.attr('style',$body.data('initstyle'));

    // 绑定 esc 键盘控制
    $(document).off('keyup.iui-layer');
    return Q;
};

Layer.prototype.cutTo = function(nextId, currentId) {
    if(!$(nextId).length){
        console.warn('Can\'t find layer \''+nextId+'\',the config.dynamic must set false');
        return false;
    }
    var nextLayer = $(nextId).data('layer');
    var currentLayer = (currentId ? $(currentId) : this.$selector).data('layer');

    if (nextLayer.$backdrop.width() === 0) {
        nextLayer.$backdrop = currentLayer.$backdrop;
    }
    currentLayer.hideLayer(true).done(function(){
        nextLayer.showLayer(true);
    });

};

Layer.prototype.destroy = function() {
    var _this = this;
    var $selector = _this.$selector;
    //确认事件
    $selector.remove();
};


module.exports = {
    layer:function(config) {
        return new Layer(config, this);
    }
}
