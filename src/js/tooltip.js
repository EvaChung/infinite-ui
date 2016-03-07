/**
 * tooltip 组件
 * @param {String}  target          需要绑定的元素，支持css选择器语法
 * @param {String}  animateClass    动画类
 * @param {String}  event           事件，支持符合逻辑的鼠标类事件，如 click,dblclick,hover
 * @param {String}  template        html模板
 *
 *
 * @example
 * $(context).IUI('tooltip',{options...});
 */
$.fn.IUI({
  tooltip: function(options) {

      var defaults = {
          target: '[data-tooltip]',
          animateClass: 'fadeIn',
          event: 'hover',
          template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-body"></div></div>'
      };

      var config = $.extend(defaults, options);
      var showHandle = config.event === 'hover' ? 'mouseenter' : 'click';
      var hideHandle = config.event === 'hover' ? 'mouseleave' : 'click';

      return this.each(function(index, ele) {
          var target = config.target;
          var animateClass = config.animateClass;
          $(ele).on(showHandle, target, function() {
              $('.tooltip').remove();
              var $ele = $(this);
              var _ele = this;
              var _elePosi = _ele.getBoundingClientRect();
              var _eleLeft = _elePosi.left;
              var _eleTop = _elePosi.top;
              var _eleWidth = _ele.offsetWidth;
              var _eleHeight = _ele.offsetHeight;

              var _tipDirec = $ele.attr('data-direction') || 'top',
                  distance = $ele.attr('data-distance') * 1 || 5,
                  title = $ele.attr('data-title');
              var $tip = $ele.after($(config.template)).next('.tooltip').addClass(_tipDirec + ' ' + animateClass);
              $tip.find('.tooltip-body').text(title);
              var _tipWidth = $tip[0].offsetWidth;
              var _tipHeight = $tip[0].offsetHeight;


              var left, top;

              if (_tipDirec == 'top') {
                  left = _eleLeft + (_eleWidth - _tipWidth) / 2;
                  top = _eleTop - _tipHeight - distance;
              } else if (_tipDirec == 'right') {
                  left = _eleLeft + _eleWidth + distance;
                  top = _eleTop + (_eleHeight - _tipHeight) / 2;
              } else if (_tipDirec == 'bottom') {
                  left = _eleLeft + (_eleWidth - _tipWidth) / 2;
                  top = _eleTop + _eleHeight + distance;
              } else if (_tipDirec == 'left') {
                  left = _eleLeft - _tipWidth - distance;
                  top = _eleTop + (_eleHeight - _tipHeight) / 2;
              }

              $tip.css({
                  'top': top,
                  'left': left
              });

              return false;
          });


          if (config.event === 'hover') {
              $(ele).on(hideHandle, target, function() {
                  $(this).next('.tooltip').remove();
              });
          } else {
              $(document).on(hideHandle, function(event) {
                  $('.tooltip').remove();
              });
          }

      });
  }
});
