(function() {

    var template = '<div class="IUI-popover-container">{{header}}{{content}}</div>';

    var defaults = {
        handle: '[data-popover]', //绑定监听对象
        container: 'body', //全局作用域
        offsetX: 0, //全局微调 X 位置
        offsetY: 10, //全局微调 Y 位置
        compiler: null, //有无模板引擎
        header: '' //标题
    };

    function Popover(config) {
        this.$selector = $(config.handle);
        this.$container = $(config.container);
        this.config = config;
        this.containerPos = $(config.container)[0].getBoundingClientRect();
        this.screenWidth = $(document).width();
        this.screenHeight = $(document).height();
        this.init();
    }

    Popover.prototype.init = function() {
        var self = this;

        // show
        self.$container.on('click.IUI-popover', self.config.handle, function(event) {
            var $this = $(this);
            var eventSpace = $this.data('popoverid') ? ('.popover-' + $this.data('popoverid')) : '.popover';

            if($this.hasClass('popover-active')){
              self.hide($this.removeClass('popover-active').data('template'));
              return false;
            }else{
              $this.addClass('popover-active');
            }

            $.pub('before' + eventSpace, [self, $this]);
            self.show($this);
            $.pub('after' + eventSpace, [self, $this]);
            event.stopPropagation();
        });

        // hide
        $('body').on('click.IUI-popover', function(event) {
            var $this = $(this);
            if(($(event.target).closest('.IUI-popover-container').length === 0)){
              $this.trigger('hide.popover', [self]);
              self.hide(); 
            }
        });

    };

    Popover.prototype.getEmitterPos = function(emitter) {
        var self = this;
        var config = self.config;
        var $emitter = emitter;
        var pos = $emitter[0].getBoundingClientRect();
        var emitterPosX = pos.left;
        var emitterPosY = pos.top;
        var emitterWidth = $emitter.outerWidth() / 2;
        var emitterHeight = $emitter.outerHeight();
        return [emitterPosX, emitterPosY, emitterWidth, emitterHeight];
    };

    Popover.prototype.fillContent = function(emitter) {
        var self = this;
        var config = self.config;
        var $emitter = emitter;
        var header = $emitter.attr('data-ppHeader') || config.header;
        var str = $emitter.attr('data-popover');
        var isEl = str.indexOf('##') === 0;
        var $content = isEl ? str.slice(2, str.length) : $(str);

        var _template = template.replace('{{header}}', header ? '<div class="popover-header">' + header + '</div>' : '');

        if (!isEl && $content.data('compiler') && config.compiler) {
            _template = _template.replace('{{content}}', config.compiler($content.html(), $emitter));
        } else {
            _template = _template.replace('{{content}}', isEl ? '<div class="popover-content">' + $content + '</div>' : $content.html());
        }

        return _template;

    };

    Popover.prototype.excePosition = function(emitter, template) {
        var self = this;
        var containerPosX = self.containerPos.left;
        var containerPosY = self.containerPos.top;
        var screenWidth = self.screenWidth;
        var screenHeight = self.screenHeight + self.$container.scrollTop();
        var emitterMatrix = self.getEmitterPos(emitter);
        var $template = template;
        var tmpWidth = $template.outerWidth() / 2;
        var tmpHeight = $template.outerHeight() + 30;
        var edgeTest = ['center', 'bottom'];

        if (emitterMatrix[1] < tmpHeight) {
            edgeTest[1] = 'bottom'; // bottom edge
        }

        if (screenHeight - emitterMatrix[1] - emitterMatrix[3] < tmpHeight) {
            edgeTest[1] = 'top'; // bottom top edge  
        }

        if (tmpWidth + emitterMatrix[2] / 2 + emitterMatrix[0] > screenWidth) {
            edgeTest[0] = 'right'; // right edge;  
        }


        if (emitterMatrix[0] < tmpWidth) {
            edgeTest[0] = 'left'; // left edge
        }

        $template.addClass(edgeTest.join(' '));

        var position = [];

        if (edgeTest[0] === 'left') {
            position[0] = 0;
        } else if (edgeTest[0] === 'right') {
            position[0] = emitterMatrix[0] - containerPosX - $template.outerWidth() + emitterMatrix[2] * 2;
        } else {
            position[0] = emitterMatrix[0] - containerPosX - tmpWidth + emitterMatrix[2];
        }

        if (edgeTest[1] === 'top') {
            position[1] = emitterMatrix[1] + self.$container.scrollTop() - containerPosY - tmpHeight;
        } else {
            position[1] = emitterMatrix[1] + self.$container.scrollTop() + emitterMatrix[3] - containerPosY;
        }
        return position;
    };



    Popover.prototype.show = function(emitter) {
        var self = this;
        var config = self.config;
        var $emitter = emitter;
        var content = self.fillContent($emitter);
        var $template = $(content);
        $emitter.data('template',$template);
        self.$container.data('popoverInit',self.$container.css('position')).css({ 'position': 'relative' });
        $template.addClass('popover-show').appendTo(config.container);
        var position = self.excePosition(emitter, $template);
        $template.css({
            'left': position[0] + config.offsetX,
            'top': position[1] + config.offsetY,
        }).addClass('popover-in');

    };

    Popover.prototype.hide = function(target) {
      var self = this;
      var $target = target || $('.IUI-popover-container');
      var $container = self.$container;

      if(!target){
        $('[data-popover]').removeClass('popover-active');
      }

      $container.css('position',$container.data('popoverInit'));

      IUI_UTILS.transitionEndShim($target.removeClass('popover-in'),function(){
        $target.remove();
      });

    };

    $.extend({
        popover: function(config) {
            return new Popover($.extend({}, defaults, config));
        }
    });
}());
