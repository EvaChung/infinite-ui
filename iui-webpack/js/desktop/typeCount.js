/**
 * typeCount 组件
 * @description     字数统计，侦听input[type=text],textarea
 * @example
 * html    div.J-typeCount>input+span.count
 * js      $('.J-typeCount').IUI('typeCount');
 */
module.exports = {
    typeCount: function(options) {
        return this.each(function() {
            var $this = $(this);
            var config = $.extend({
                separator :'/'
            },options);

            $this.on('keyup', 'input[type=text],textarea', function(event) {
                var _$this = $(this);
                var $target = _$this.parent().find('span.count');
                var initCount = parseInt($target.text().split(config.separator)[1]);
                var length = this.value.length;
                if (length > initCount) {
                    $target.addClass('error');
                } else {
                    $target.removeClass('error');
                }
                $target.html(length + config.separator + initCount);
            });

            $this.on('input propertychange', 'input[type=text],textarea', function(event) {
                $(this).trigger('keyup');
            });

            $this.find('input,textarea').trigger('keyup');
        });
    }
};
