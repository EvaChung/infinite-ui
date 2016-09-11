(function($) {

    var isIE6 = !!(document.all && !window.XMLHttpRequest);


    var methods = {
        //初始化
        init: function(options) {
            return this.each(function() {

                var defaults = {
                        url: null,
                        target: null,
                        animate: false,
                        success: null,
                        error:null,
                        shadow: true,
                        callback: null,
                        confirm: null,
                        cache: true,
                        onClose: null,
                        ajaxType:'GET',
                        ajaxData:null,
                        loadImage: '/Public/images/loading2.gif'
                    },

                    $this = $(this),
                    $body = $('body'),
                    $layer = $('#layer'),
                    settings = $.extend({}, defaults, options),
                    screenH = document.documentElement.clientHeight;

                if (!$layer.length) {
                    $body.append('<div id="layer" style="height:' + screenH + 'px"></div>');
                    $layer = $('#layer');
                }

                if (settings.url) {
                    methods.dynamicHtml(settings, $layer);
                }

                if (settings.target) {
                    methods.staticHtml(settings, $layer);
                }

                if (settings.confirm) {
                    methods.confirmHtml(settings, $layer, $this);
                }

                methods.Event(settings, $layer, $this);

            });
        },
        confirmHtml: function(options, layer, src) {
            var $body = $('body');
            var settings = options;
            var _id = new Date().getTime();
            var zIndex = Number(layer.css('z-index')) + 1;

            if (!src.attr('data-id')) {

                src.attr('data-id', _id);

                $body.append('<div id="layer_' + _id + '" class="layer_confirm none">' + settings.confirm + '</div>');

                $('#layer_' + _id).data('src',src).css({
                    "position": "fixed",
                    "z-index": zIndex
                });

                methods.showLayer($('#layer_' + _id), settings);
            } else {

                $('#layer_' + src.attr('data-id')).html(settings.confirm);

                methods.showLayer($('#layer_' + src.attr('data-id')), settings);
            }

        },
        //加载静态HTML
        staticHtml: function(options, layer) {
            var settings = options;
            methods.showLayer($(options.target), settings);

        },
        //加载动态HTML
        dynamicHtml: function(options, layer) {
            var $body = $('body');
            var settings = options;
            var $layer = layer;
            var $layerContent = $('#layer_content');

            if (!$layerContent.length) {
                $body.append('<div id="layer_content" class="none"></div>');
                $layerContent = $('#layer_content');
            }

            $layerContent.data('url') === 'undefined' ? $layerContent.data('url', settings.url) : false;

            if ($layerContent.data('url') === settings.url && settings.cache) {
                methods.showLayer($layerContent, settings);
            } else {
                $layerContent.data('url', settings.url);
                $.ajax({
                    url: settings.url,
                    type: settings.ajaxType,
                    dataType: 'HTML',
                    data:settings.ajaxData,
                    beforeSend: function() {
                        $layerContent.html('<img src="' + settings.loadImage + '"  alt="loading" style="position:absolute;margin:auto;left:0;top:0;right:0;bottom:0;" />');
                        methods.showLayer($layerContent, settings);
                    }
                }).then(function(data) {

                    $layerContent.html(data);

                    methods.showLayer($layerContent, settings);

                    settings.success ? settings.success() : false;

                }, function(err) {

                    var str = '<span style="color:#f00">状态码：' + err.status + '，该页面无法显示！</span>';

                    $layerContent.html('<div style="text-align:center;">' + str + '</div>');

                    methods.showLayer($layerContent, settings);

                    settings.error ? settings.error() : false;
                });
            }

        },
        tip: function(options) {
            return this.each(function() {
                var settings = $.extend({
                        message: '',
                        timeout: 2000,
                        zIndex: 1000,
                        animate: 'fadeIn'
                    }, options),
                    $body = $('body'),
                    time = null;
                $body.append('<div id="layer_tip" class="none">' + settings.message + '</div>');

                var $tip = $("#layer_tip");
                var tipWidth = $tip.width();
                var tipHeight = $tip.height();
                var offset = methods.countPosition($tip);
                $tip.css({
                    "width": tipWidth,
                    "height": tipHeight,
                    "left": offset.left,
                    "top": offset.top
                }).removeClass('none');
                time = setInterval(function() {
                    clearInterval(time);
                    $tip.addClass('none');
                }, settings.timeout);
            });
        },
        //显示layer
        showLayer: function(target, options) {
            var settings = options||{};
            var $layer = $('#layer');
            var screenH = document.documentElement.clientHeight;
            var screenW = document.documentElement.clientWidth;
            var $imgCollection = target.find('img');
            var pos;

            if (isIE6) {
                $('#layer').css({
                    "position": "absolute",
                    "height": $('body').height()
                });
            } else {
                $('#layer').css({
                    "height": screenH
                });
            }

            if ($layer.hasClass('none')) {
                $layer.removeClass('none');
            }

            if(target.hasClass('layer_confirm')){
                $layer.attr('data-id',target.attr('id'));
            }

            if ($imgCollection.length && !$imgCollection.eq(0).data('cache')) {

                $imgCollection.each(function(index, val) {

                    val.onload = function() {

                        pos = methods.countPosition(target);

                        target.css({"top": pos.top,"left": pos.left});

                        $(this).data('cache',true);

                    }

                });
            }

            target.removeClass('none');
            pos = methods.countPosition(target);

            target.css({
                "top": pos.top,
                "left":pos.left,
                "position": isIE6 ? "absolute" : "fixed"
            });

            settings.callback ? settings.callback() : false;

        },
        //关闭layer
        closeLayer: function(target) {
            $('#layer').addClass('none');
            target.addClass('none');
        },
        //计算位置
        countPosition: function(target) {
            var H = document.documentElement.clientHeight,
                W = isIE6 ? document.body.clientWidth : document.documentElement.clientWidth,
                scrollTop = isIE6 ? document.documentElement.scrollTop : 0;
            return {
                top: scrollTop + ((H - target.outerHeight()) / 2),
                left: (W - target.outerWidth()) / 2
            };

        },
        //重置位置
        updatePosition: function(target) {
            var H = document.documentElement.clientHeight;
            var pos = methods.countPosition(target);
            $('#layer').height(H);
            target.css({
                "top": pos.top,
                "left": pos.left
            });
        },
        //事件库
        Event: function(options, layer, src) {
            var $body = $('body');
            var settings = options;
            var $layer = layer;
            var $layerContent = $('#layer_content');
            var eventTarget = settings.shadow ? '.layer_close,#layer' : '.layer_close';

            $body.off('click.layer').on('click.layer', eventTarget, function(event) {

                event.preventDefault();

                $layer.addClass('none');

                $layerContent.addClass('none');

                if (settings.target) {
                    $(settings.target).addClass('none');
                }

                if (settings.confirm) {
                    $('#'+layer.attr('data-id')).addClass('none');
                }

                settings.onClose ? settings.onClose() : false;

            });

            $(window).on('resize.layer', function(event) {
                if (settings.url) {
                    methods.updatePosition($layerContent);
                }

                if (settings.target) {
                    methods.updatePosition($(settings.target));
                }

                if (settings.confirm) {
                    methods.updatePosition($("#layer_" + src.data('id')));
                }
            });
        }
    };

    $.fn.layer = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.layer Plugin');
            return this;
        }
        return method.apply(this, arguments);
    }

}(jQuery));
