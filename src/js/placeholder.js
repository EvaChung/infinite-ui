/**
 * placeholder 组件
 * @param {color}     color           placeholder color
 * @param {String}    zIndex          placeholder z-index 需高于input
 *
 * @example
 * $('body').IUI('placeholder',{color:'#999',zIndex:2});
 */
$.fn.IUI({
  placeholder: function(option) {
    if ('placeholder' in document.createElement('input')) {
      return;
    }

    var defaults = {
      color: "#999", //placeholder color
      zIndex: 2 //针对position:absolute的input元素，label覆盖在input之上
    };
    var param = $.extend({}, defaults, option || {});
    var $eles = $(this).find('input[type="text"],input[type="password"],input[type="tel"],input[type="email"]');

    return $eles.each(function(i, n) {
      var $ele = $(n),
        ele = n, //ele供原生事件onpropertychange调用
        placeholder = $ele.attr('placeholder'),
        $elel = $('<label></label>').css({
          position: "absolute",
          top: 0,
          left: 0,
          height: 0,
          lineHeight: $ele.css("height"),
          fontSize: $ele.css("fontSize"),
          paddingLeft: $ele.css("textIndent") ? $ele.css("textIndent") : $ele.css('paddingLeft'),
          background: "none",
          cursor: "text",
          color: param.color,
          zIndex: param.zIndex
        }).text(placeholder).insertBefore($ele);

      $ele.parent().css({ "position": "relative" });

      if ($ele.val()) {
        $elel.hide();
      }

      //事件绑定
      $elel.bind({
        "click": function() {
          $elel.hide();
          $ele.focus();
        }
      });
      $ele.bind({
        "focus": function() {
          $elel.hide();
        },
        "blur": function() {
          if (!$ele.val()) {
            $elel.show();
          }
        },
        "input": function() {
          if ($ele.val()) {
            $elel.hide();
          } else {
            $elel.show();
          }
        }
      });
      //IE6-8不支持input事件，另行绑定
      ele.onpropertychange = function(event) {
        event = event || window.event;
        if (event.propertyName == "value") {
          var $this = $(this);
          if ($this.val()) {
            $(this).prev('label').hide();
          } else {
            $(this).prev('label').show();
          }
        }
      };
    });
  }
});
