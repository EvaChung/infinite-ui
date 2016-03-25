/**
 * panel 组件
 * @param {Number}		delay 		动画时间，单位毫秒
 */
$.fn.IUI({
    panel: function(options) {
        var $selector = this;
        var $body = $('body');
        var $overlay = $('<div class="panel-overlay hide"></div>');
        var $sidebar = $selector.data('target') ? $($selector.data('target')) : $('.panel').eq(0);
        var _direction, $target;
        var defaults = {
            delay: 300
        };

        var config = $.extend({}, defaults, options);

        if ($selector.find('.panel-overlay').length) {
            $overlay = $('.panel-overlay');
        } else {
            $selector.append($overlay);
        }

        if (!$selector.hasClass('panel-viewport')) {
            $selector = $('.panel-viewport');
        }

        $selector.on('touchstart.IUI-panel click.IUI-panel', '.panel-open', function(event) {
            event.preventDefault();
            openPanel($(this));
        });

        $selector.on('touchstart.IUI-panel click.IUI-panel', '.panel-overlay', function(event) {
            event.preventDefault();
            closePanel();
        });

        $selector.on(transitionEnd, function(event) {
            event.preventDefault();
            if (!$selector.hasClass('panel-move')) {
                $sidebar.addClass('hide');
            }
        });

        function openPanel(handle) {
            var $handle = handle;
            _direction = 'panel-' + $handle.attr('data-direction');
            $target = $('.' + _direction);
            $overlay.removeClass('hide');
            $selector.addClass(_direction + ' panel-move');
            $sidebar.removeClass('hide');
        }

        function closePanel() {
            $selector.removeClass('panel-left panel-move');
            $overlay.addClass('hide');

        }
    }
});
