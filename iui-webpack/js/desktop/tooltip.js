/**
 * tooltip
 * version 1.0
 * last update 2017-03-17
 */

let defaults = {
    container : 'body',
    handler   : '[data-tooltip]',
    offsetX   : 10,
    offsetY   : 10
};

// 位置计算
let positionCalc = {
    left(options,template){
      let _this        = this;
      let srcX         = options.left;
      let srcY         = options.top;
      let srcW         = options.width;
      let srcH         = options.height;
      let destW        = template.outerWidth();
      let destH        = template.outerHeight();

      return [srcX-destW-_this.config.offsetX,srcY+((srcH-destH)/2)];
    },
    right(options,template){
      let _this        = this;
      let srcX         = options.left;
      let srcY         = options.top;
      let srcW         = options.width;
      let srcH         = options.height;
      let destH        = template.outerHeight();

      return [srcX+srcW+_this.config.offsetX,srcY+((srcH-destH)/2)];

    },
    up(options,template){
      let _this        = this;
      let srcX         = options.left;
      let srcY         = options.top;
      let srcW         = options.width;
      let srcH         = options.height;
      let destW        = template.outerWidth();
      let destH        = template.outerHeight();

      return [(srcW/2)+srcX-(destW/2),srcY-destH-_this.config.offsetY];

    },
    down(options,template){
      let _this        = this;
      let srcX         = options.left;
      let srcY         = options.top;
      let srcW         = options.width;
      let srcH         = options.height;
      let destW        = template.outerWidth();
      let destH        = template.outerHeight();

      return [(srcW/2)+srcX-(destW/2),srcY+srcH+_this.config.offsetY];

    }
};


let eventAction = {
    focus(event){
      let _this        = this;
      let $target      = $(event.target);

        if(_this.$template){
          $target.data('iuiTooltip',_this.$template);
        }
    },
    blur(event){
      let _this        = this;
      let $target      = $(event.target);

        $target.data('iuiTooltip').remove();
        $target.removeData('iuiTooltip');
    }
};

function Tooltip(options) {
    let _this        = this;
    _this.config     = $.extend(defaults, options);
    _this.$container = $(_this.config.container);
    _this.init();
};

Tooltip.prototype = {
    init() {
      let _this        = this;
      let config       = _this.config;
      let handler      = config.handler;

      _this.$container.on('mouseenter.iui-tooltip' , handler , $.proxy(_this.show        , _this));
      _this.$container.on('mouseleave.iui-tooltip' , handler , $.proxy(_this.hide        , _this));
      _this.$container.on('focus.iui-tooltip'      , handler , $.proxy(eventAction.focus , _this));
      _this.$container.on('blur.iui-tooltip'       , handler , $.proxy(eventAction.blur  , _this));

    },
    show(event) {
      let _this        = this;
      let config       = _this.config;
      let $target      = $(event.target);
      let options      = ($target.data('tooltipOptions') || '|').split('|');
      let text         = $target.data('tooltip') || '';
      let direct       = options[0] || 'left';
      let size         = options[1] || 'small';
      let bcr          = event.target.getBoundingClientRect();


      if(!text || $target.data('iuiTooltip')){
        return false;
      }
      
      _this.$template = $(`<div id="tooltip-${+new Date()}" class="tooltip tooltip-${size} tooltip-${direct}">${text}</div>`);
        
      _this.$container.append(_this.$template);

      let pos         = positionCalc[direct].call(_this,bcr,_this.$template);

      _this.$template.addClass('tooltip-show').css({'left':pos[0],'top':pos[1]});

    },
    hide(event) {
      let _this     = this;
      let $target     = $(event.target);
      let $template = _this.$template;

      if($template && !$target.data('iuiTooltip')){
        $template.remove();
      }
    }
};

export function tooltip(options) {
    return new Tooltip(options);
};
