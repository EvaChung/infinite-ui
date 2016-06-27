/**
 * alert 组件
 * @param {String}      title 标题                   默认为空
 * @param {String}      content 内容                 默认为空
 * @param {String}      confirmText                 确定按钮文本
 * @param {String}      cancelText                  取消按钮文本
 * @param {Boolean}     closeBtn                    是否开启关闭按钮
 * @param {Boolean}     shadow                      是否开启点击阴影关闭
 * @param {String}      type                        可选择 alert 或 confirm，区别在于有无【取消按钮】
 * @param {String}      status                      状态类，如 success , error , warning , info
 * @param {Function}    before                      回调函数 - 弹出前
 * @param {Function}    confirm                     回调函数 - 点击确认按钮后触发
 * @param {Function}    cancel                      回调函数 - 点击取消按钮后触发
 *
 *
 * @param $.alert({options});
 */
$.extend({
  alert: function(options) {
    var scrollBarWidth = IUI_UTILS.scrollBarWidth;
    var $body = $('body');
    var animateTime = document.all && !window.atob ? 0 : 200;
    var defaults = {
      title: '',
      content: '',
      confirmText: '确定',
      cancelText: '取消',
      closeBtn: false,
      shadow: true,
      type: 'confirm',
      status: 'default',
      keyboard: true,
      before: function() {},
      confirm: function() {},
      cancel: function() {}
    };

    var config = $.extend({}, defaults, options);

    var container = create();
    /**
     * [deferred description]
     * @type {Object}
     * @description 在回调函数中使用
     */
    var deferred = {
      showAlert: function() {
        show(container);
      },
      hideAlert: function() {
        hide(container);
      },
      target: container
    };

    if (!$.alertBackdrop) {
      $.alertBackdrop = $('<div class="IUI-alert-backdrop" style="display:none"></div>');
      $body.append($.alertBackdrop);
    }


    if (config.shadow) {
      $body.on('touchstart.iui-alert click.iui-alert', '.IUI-alert-container', function(event) {
        event.preventDefault();
        hide(container);
      });
    }

    $body.on('touchstart.iui-alert click.iui-alert', '.IUI-alert-main', function(event) {
      event.stopPropagation();
    });

    container.on('touchstart.iui-alert click.iui-alert', '.IUI-alert-confirm', function(event) {

      if (config.type === 'alert') {

        if (config.cancel.call(this, deferred) === false) {
          return false;
        }

        hide(container);

        return false;
      }

      if (config.confirm.call(this, deferred) === false) {
        return false;
      }

    });

    container.on('touchstart.iui-alert click.iui-alert', '.IUI-alert-cancel,.IUI-alert-close', function(event) {
      if (config.cancel.call(this, deferred) === false) {
        return false;
      }

      hide(container);
    });



    if (config.keyboard) {

      $(document).off('keyup.iui-alert').on('keyup.iui-alert', function(event) {
        // keyCode => esc
        if (event.keyCode === 27) {
          container.find('.IUI-alert-cancel,.IUI-alert-close').trigger('click.iui-alert');
        }
        // keyCode => enter
        if (event.keyCode === 13) {
          container.find('.IUI-alert-confirm').trigger('click.iui-alert');
        }
      });
    }


    /**
     * [show description]
     * @param  {jQuery object} target 需要显示的对象
     */
    function show(target) {    
        var screenH = document.documentElement.clientHeight;
        var GtIE10 = document.body.style.msTouchAction === undefined;
        //当body高度大于可视高度，修正滚动条跳动
        //tmd,>=ie10的滚动条不需要做此修正
        if ($('body').height() > screenH & GtIE10) {
             $body.css({'border-right':scrollBarWidth+'px transparent solid','overflow':'hidden'});
        }
       
        target.removeClass('hide');
        target.find('.IUI-alert-main').addClass('alert-opening');
        $.alertBackdrop.removeClass('hide').fadeIn(animateTime, function() {
            target.find('.IUI-alert-main').removeClass('alert-opening');
        });
    }
    /**
     * [hide description]
     * @param  {jQuery object} target 需要隐藏的对象
     */
    function hide(target) {
        $([$body, target]).off('touchstart.iui-alert click.iui-alert');
        target.addClass('alert-closing');
        $.alertBackdrop.fadeOut(animateTime, function() {
            $(this).addClass('hide');
            target.remove();
             $body.removeAttr('style');
        });
    }
    /**
     * [create description]
     * @return {string} 拼接html
     */
    function create() {
      var isConfirm = config.type === 'confirm';

      var _closeBtn = '<span class="IUI-alert-close"></span>';

      var _confirmBtn = '<a href="javascript:;" class="IUI-alert-confirm">' + config.confirmText + '</a>';

      var _cancelBtn = '<a href="javascript:;" class="IUI-alert-cancel">' + config.cancelText + '</a>';

      var _header = '<div class="IUI-alert-header">' + (config.title || '') + (config.closeBtn ? _closeBtn : '') + '</div>';

      var _content = '<div class="IUI-alert-content">' + (config.content || '') + '</div>';

      var _footer = '<div class="IUI-alert-footer">' + _confirmBtn + (isConfirm ? _cancelBtn : '') + '</div>';

      var _main = _header + _content + _footer;

      var $container = $('<div class="IUI-alert-container hide"><div class="IUI-alert-main ' + config.status + '">' + _main + '</div></div>');

      $body[0].appendChild($container[0]);

      return $container;
    }

    if (config.before.call(this, deferred) === false) {
      return false;
    }

    show(container);

  }
});
