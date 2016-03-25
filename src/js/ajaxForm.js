/**
 * ajaxForm 组件
 * @param {String}  	url
 * @param {String}  	method
 * @param {String}  	type
 * @param {String}  	before
 * @param {String}  	success
 * @param {String}  	error
 * @param {String}  	pending
 */
$.fn.IUI({
    ajaxForm: function(options) {
        return this.each(function() {
            var defaults = {
                url: $(this).attr('action'),
                method: $(this).attr('method') || 'POST',
                type: $(this).attr('data-type') || 'json',
                before: function() {},
                success: function() {},
                error: function() {},
                pending: function() {}

            };

            var $selector = $(this);
            var $fields = $selector.find('input');
            var config = $.extend({}, defaults, options);

            $selector.data('deferred', config);

            $selector.on('submit', function(event) {
                event.preventDefault();
                if ($selector.hasClass('disabled')) {

                    config.pending.call($selector, config);

                    return false;
                }

                var beforeResult = config.before.call($selector, event, config);

                if (beforeResult === false) {
                    return false;
                }
                $selector.addClass('disabled').prop('disabled',true);
                $.ajax({
                    url: config.url,
                    type: config.method,
                    data: $selector.serialize()
                }).then(function(res) {
                    $selector.removeClass('disabled').prop('disabled',false);
                    config.success.call($selector, res, config);
                }, function(err) {
                    $selector.removeClass('disabled').prop('disabled',false);
                    config.error.call($selector, err, config);
                });
            });

        });
    }
});
