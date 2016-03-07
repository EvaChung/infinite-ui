/**
 * panel 组件
 * @param {Number}		delay 		动画时间，单位毫秒
 */
$.fn.IUI({
    panel: function(options) {
        var $this = this;
        var $body = $('body');
        var $overlay = $('<div class="panel-overlay hide"></div>');
        var $sidebar = $this.data('target') ? $($this.data('target')) : $('.panel').eq(0);
        var _direction, $target;
        var defaults = {
            delay: 300
        };

        var config = $.extend({}, defaults, options);

        if ($this.find('.panel-overlay').length) {
            $overlay = $('.panel-overlay');
        } else {
            $this.append($overlay);
        }

        if (!$this.hasClass('panel-viewport')) {
            $this = $('.panel-viewport');
        }

        $this.on('touchstart.IUI-panel click.IUI-panel', '.panel-open', function(event) {
            event.preventDefault();
            openPanel($(this));
        });

        $this.on('touchstart.IUI-panel click.IUI-panel', '.panel-overlay', function(event) {
            event.preventDefault();
            closePanel();
        });

        $this.on(transitionEnd, function(event) {
            event.preventDefault();
            if (!$this.hasClass('panel-move')) {
                $sidebar.addClass('hide');
            }
        });

        function openPanel(handle) {
            var $handle = handle;
            _direction = 'panel-' + $handle.attr('data-direction');
            $target = $('.' + _direction);
            $overlay.removeClass('hide');
            $this.addClass(_direction + ' panel-move');
            $sidebar.removeClass('hide');
        }

        function closePanel() {
            $this.removeClass('panel-left panel-move');
            $overlay.addClass('hide');

        }
    }
});
