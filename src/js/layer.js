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
 * @param  {Function}          showCall            回调函数 - 显示触发
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
      showCall: function() {},
      hideCall: function() {},
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
    config.showCall.apply(self.$selector, [self]);
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
    config.hideCall.apply(self.$selector, [self]);

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
