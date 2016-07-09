/**
 * tooltip 组件
 * @param {String}  target          需要绑定的元素，支持css选择器语法
 * @param {String}  event           事件，支持符合逻辑的鼠标类事件，如 click,dblclick,hover
 * @param {String}  template        html模板
 *
 *
 * @example
 * $(context).IUI('tooltip',{options...});
 */

;(function($){
    function tooltip(options, $selector){
      var defaults = {
          showHandle: 'mouseenter',
          hideHandle: 'mouseleave',
          custom: false,
          customHtml: '',
          direc: 'top',
          leftOffset: 0,
          topOffset: 0,
          className: '',
          template: '<div class="tooltip {{className}}"><div class="tooltip-arrow">{{customHtml}}</div><div class="tooltip-body"></div></div>',
          showCallback: function(){},
          hideCallback: function(){}
      };

      $.extend(defaults, options);

      this.$selector = $selector;
      this.options = defaults;
      this.init();
    }

    tooltip.prototype = {
      init: function(){
        this.addEvent();
      },
      addEvent: function(){
        var config = this.options;
        var $selector = this.$selector;

        $selector.on(config.showHandle, '[data-tooltip]', function(event) {
            if (event.type === 'click') {
                event.stopPropagation();
            }

            var $ele = $(this);
            var id = $ele.attr('data-tooltip');
            var tipConfig = config.list[id];

            var _ele = this;
            var _elePosi = _ele.getBoundingClientRect();
            var _eleLeft = _elePosi.left;
            var _eleTop = _elePosi.top;
            var _eleWidth = _ele.offsetWidth;
            var _eleHeight = _ele.offsetHeight;

            var direc = tipConfig && tipConfig.direc || config.direc,
                leftOffset = tipConfig && tipConfig.leftOffset || config.leftOffset,
                topOffset = tipConfig && tipConfig.topOffset || config.topOffset,
                content = tipConfig && tipConfig.content,
                custom = tipConfig && tipConfig.custom || config.custom,
                customHtml = tipConfig && tipConfig.customHtml || config.customHtml,
                className = tipConfig && tipConfig.className || config.className || '',
                showCallback = tipConfig && tipConfig.showCallback || config.showCallback,
                hideCallback = tipConfig && tipConfig.hideCallback || config.hideCallback;

            var $tip;
            var _tipWidth;
            var _tipHeight;
            var left, top;

            var $arrow;
            var arrowWidth, arrowHeight;

            var str = config.template.replace('{{className}}', className);

            if (custom) {
                str = str.replace('{{customHtml}}', customHtml);
            }else{
                str = str.replace('{{customHtml}}', '');
            }


            $('.tooltip').remove();
            $ele.after(str);
            $tip = $ele.next('.tooltip');
            $arrow = $tip.find('.tooltip-arrow');

            if (!custom) {
                $arrow.addClass(direc);
            }

            arrowWidth = $arrow[0].offsetWidth;
            arrowHeight = $arrow[0].offsetHeight;



            $tip.find('.tooltip-body').html(content);
            _tipWidth = $tip[0].offsetWidth;
            _tipHeight = $tip[0].offsetHeight;

            switch(direc){
                case 'top':
                    left = _eleLeft + (_eleWidth - _tipWidth) / 2;
                    top = _eleTop - _tipHeight - topOffset - arrowHeight;
                    break;
                case 'right':
                    left = _eleLeft + _eleWidth + leftOffset + arrowWidth;
                    top = _eleTop + (_eleHeight - _tipHeight) / 2;
                    break;
                case 'bottom':
                    left = _eleLeft + (_eleWidth - _tipWidth) / 2;
                    top = _eleTop + _eleHeight + topOffset + arrowHeight;
                    break;
                case 'left':
                    left = _eleLeft - _tipWidth - leftOffset - arrowWidth;
                    top = _eleTop + (_eleHeight - _tipHeight) / 2;
                    break;
                case 'topLeft':
                    left = _eleLeft - _tipWidth - leftOffset - arrowWidth/2;
                    top = _eleTop - _tipHeight - topOffset - arrowHeight/2;
                    break;
                case 'topRight':
                    left = _eleLeft + _eleWidth + leftOffset + arrowWidth/2;
                    top = _eleTop - _tipHeight - topOffset - arrowHeight/2;
                    break;
                case 'bottomLeft':
                    left = _eleLeft - _tipWidth - leftOffset - arrowWidth/2;
                    top = _eleTop + _eleHeight + topOffset + arrowHeight/2;
                    break;
                case 'bottomRight':
                    left = _eleLeft + _eleWidth + leftOffset + arrowWidth/2;
                    top = _eleTop + _eleHeight + topOffset + arrowHeight/2;
                    break;
            }

            $tip.css({
                'top': top,
                'left': left
            });

            showCallback.call(tipConfig, config);
        });

        if (config.hideHandle === 'mouseleave') {
            $selector.on(config.hideHandle, '[data-tooltip]', function() {
                var $ele = $(this);
                var id = $ele.attr('data-tooltip');
                var tipConfig = config.list[id];
                var hideCallback = tipConfig && tipConfig.hideCallback || config.hideCallback;
                $('.tooltip').remove();
                hideCallback.call(config);
            });
        } else {
            $(document).on(config.hideHandle, function(event) {
                var $ele = $(this);
                var id = $ele.attr('data-tooltip');
                var tipConfig = config.list[id];
                var hideCallback = tipConfig && tipConfig.hideCallback || config.hideCallback;
                $('.tooltip').remove();
                hideCallback.call(config);
            });
        }

      }
    };


    // //
    // $.fn.tooltip = function(options){
    //   return new tooltip(options, this);
    // };

    $.fn.IUI({
     tooltip: function(options){
      return new tooltip(options, this);
     }
    });

})(jQuery);
