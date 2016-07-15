(function() {

  var template = '<div class="IUI-dialog-container hide">' +
    '<div role="content"></div>' +
    '<div role="operate">' +
    '<a href="javascript:;" role="confirm" class="btn btn-primary">确定</a>' +
    '<a href="javascript:;" class="btn btn-default" role="cancel">取消</a>' +
    '</div>' +
    '</div>';
  var defaults = {
    handle: '[data-dialog]', //绑定监听对象
    container: 'body',       //全局作用域
    offsetX: 0,              //全局微调 X 位置
    offsetY: 10,             //全局微调 Y 位置
    compiler: null,          //有无模板引擎
    data: {}                 //传参，当compiler存在时有效
  };

  function Dialog(config) {
    this.$selector = $(config.handle);
    this.$template = $(template);
    this.$container = $(config.container);
    this.config = config;
    this.containerPos = $(config.container)[0].getBoundingClientRect();
    this.init();
  }

  Dialog.prototype.init = function() {
    var self = this;


    // show
    this.$container.on('click.IUI-dialog', this.config.handle, function(event) {
      var $this = $(this);
      var eventSpace = $this.data('dialogid') ? ('.dialog-' + $this.data('dialogid')) : '.dialog';
      $this.trigger('show' + eventSpace, [self]);
      self.show($this);
      $this.trigger('after' + eventSpace, [self]);
      event.stopPropagation();
    });

    // hide
    this.$container.on('click.IUI-dialog', function(event) {
      var $this = $(this);
      $this.trigger('hide.dialog', [self]);
      self.hide();
    });

    // cut bubbling
    this.$container.on('click', '.IUI-dialog-container', function(event) {
      event.stopPropagation();
    });

    // cancel
    this.$container.on('click', '.IUI-dialog-container [role="cancel"]', function(event) {
      var $this = $(this);
      var id = self.$template.data('caller').data('dialogid');
      var eventSpace = id ? ('.dialog-' + id) : '.dialog';
      self.hide();
      $this.trigger('cancel' + eventSpace, [self]);
    });

    // confirm
    this.$container.on('click', '.IUI-dialog-container [role="confirm"]', function(event) {
      event.preventDefault();
      var $this = $(this);
      var id = self.$template.data('caller').data('dialogid');
      var eventSpace = id ? ('.dialog-' + id) : '.dialog';
      $this.trigger('confirm' + eventSpace, [self]);

    });
  };

  Dialog.prototype.show = function(handle) {
    var config = this.config;
    var $handle = handle;
    var pos = handle[0].getBoundingClientRect();
    var handlePosX = pos.left;
    var handlePosY = pos.top;
    var containerPosX = this.containerPos.left;
    var containerPosY = this.containerPos.top;
    var handleWidth = $handle.outerWidth() / 2;
    var handleHeight = $handle.outerHeight();
    var $template = this.$template;
    var $content = $($handle.attr('data-dialog'));
    var content = config.compiler ? config.compiler($handle.attr('data-dialog').replace(/\#|\./, ''), config.data) : $content.html();
    var screenWidth = $(document).width();
    var screenHeight = $(document).height();
    var triPos = '';
    this.$container.css({ 'position': 'relative' });
    $template.find('[role="content"]').html(content);
    $template.appendTo(config.container).removeClass('hide');
    handlePosX -= $template.outerWidth() / 2 - handleWidth + config.offsetX;
    handlePosY -= containerPosY - handleHeight - this.$container.scrollTop() - config.offsetY;

    if (screenWidth - pos.left < $template.outerWidth() / 2) {
      handlePosX = pos.left - ($template.outerWidth() - handleWidth * 2);
      triPos = 'right';
    }else if(pos.left === 0){
        handlePosX = pos.left ;
        triPos = 'left';
    }

    $template.removeClass('left right').addClass(triPos).css({
      left: handlePosX,
      top: handlePosY
    }).data('caller', $handle).data('dialog', this);
  };

  Dialog.prototype.hide = function() {
    this.$container.removeAttr('style');
    this.$template.remove();
  };

  $.extend({
    dialog: function(config) {
      return new Dialog($.extend({}, defaults, config));
    }
  });
}());
