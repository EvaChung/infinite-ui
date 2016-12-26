/**
 * ajaxForm 组件
 * @param {String}  	url
 * @param {String}  	method
 * @param {String}  	type
 * @param {Function}  	before
 * @param {Function}  	success
 * @param {Function}  	error
 * @param {Function}    pending
 * @param {Function}  	always
 */
$.fn.IUI({
    ajaxForm: function(options) {
        return this.each(function() {
            var $selector = $(this);
            var defaults = {
                url: $selector.attr('action'),
                method: $selector.attr('method') || 'POST',
                type: $selector.attr('data-type') || 'json',
                timeout: 3000,
                data:null,
                ajax2:false,
                before: function() {},
                success: function() {},
                error: function() {},
                pending: function() {},
                always: function(){}
            };

            var config = $.extend({}, defaults, options);

            $selector.data('deferred', config);

            $selector.on('submit', function(event) {
                event.preventDefault();
                if ($selector.hasClass('disabled')) {

                    config.pending.call($selector, config);

                    return false;
                }

                var beforeResult = config.before.call($selector, event, config);

                var args = {
                    url: config.url,
                    type: config.method,
                    data: config.data || $selector.serialize(),
                    timeout: config.timeout
                };

                // ajax2
                if (config.ajax2) {
                    args.data = new FormData($selector[0]);
                    args.cache = false;
                    args.contentType = false;
                    args.processData = false;
                }

                if (beforeResult === false) {
                    return false;
                }
                $selector.addClass('disabled').prop('disabled',true);
                $.ajax(args).then(function(res) {
                    $selector.removeClass('disabled').prop('disabled',false);
                    config.success.call($selector, res, config);
                }, function(err) {
                    $selector.removeClass('disabled').prop('disabled',false);
                    config.error.call($selector, err, config);
                }).always(function(res) {
                    config.always.call($selector, res, config);
                });
            });

        });
    }
});
