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
