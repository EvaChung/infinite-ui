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

            var $this = $(this);
            var $fields = $this.find('input');
            var config = $.extend({}, defaults, options);

            $this.data('deferred', config);

            $this.on('submit', function(event) {
                event.preventDefault();
                if ($this.hasClass('disabled')) {

                    config.pending.call($this, config);

                    return false;
                }

                var beforeResult = config.before.call($this, event, config);

                if (beforeResult === false) {
                    return false;
                }
                $this.addClass('disabled').prop('disabled',true);
                $.ajax({
                    url: config.url,
                    type: config.method,
                    data: $this.serialize()
                }).then(function(res) {
                    $this.removeClass('disabled').prop('disabled',false);
                    config.success.call($this, res, config);
                }, function(err) {
                    $this.removeClass('disabled').prop('disabled',false);
                    config.error.call($this, err, config);
                });
            });

        });
    }
});
