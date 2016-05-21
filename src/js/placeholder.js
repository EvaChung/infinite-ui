/**
 * placeholder 组件
 * @param {String}      target           被侦听的目标，className、ID ...
 * @param {String}      cloneClass       针对 name=password 进行 css 微调
 *
 * @example
 * $('form').IUI({target:'.form-control'});
 */
$.fn.IUI({
    placeholder: function(options) {
        return this.each(function() {
            var isSupport = utils.isPlaceholder();
            if (isSupport) {
                return false;
            }

            var defaults = {
                target: '.form-control',
                cloneClass: 'clone-password'
            };
            var $selector = $(this);
            var $window = $(window);
            var config = $.extend({}, defaults, options);



            $selector.find(config.target).each(function(index, el) {
                var placeholder = $(el).attr('placeholder');
                var $el = $(el);
                if (el.type === 'password') {

                    var $clone = $('<input class="' + config.target.slice(1) + '" type="text">');

                    $el.css({
                        'display': 'none'
                    });

                    $clone.addClass(config.cloneClass).val(placeholder);
                    $el.parent().append($clone);
                } else {
                    el.value = placeholder;
                }
            });

            $selector.find(config.target).on({
                focus: function(event) {
                    if ($(this).hasClass('clone-password')) {
                        $(this).css({
                            'display': 'none'
                        });
                        $(this).parent().find('input[type=password]').css({ 'display': 'block' }).focus();
                        return false;
                    }

                    if (this.value === $(this).attr('placeholder')) {
                        this.value = '';
                    }
                },
                blur: function(event) {
                    if ($(this).attr('type') === 'password' && !this.value) {
                        $(this).css({
                            'display': 'none'
                        });
                        $(this).parent().find('.clone-password').css({
                            'display': 'block'
                        });
                        return false;
                    }

                    if (!this.value) {
                        this.value = $(this).attr('placeholder');
                    }
                }
            });
        });
    }
});
