let utils = require('../utils');
let defaults = {
    form: '.form-inline',
};

let store = [];
let scrollBarWidth = utils.scrollBarWidth;

function Table(options, el) {
    let self = this;
    self.config = $.extend({}, defaults, options);
    self.$el = el;
    self.$container = el.addClass('table-container');
    self.$table = self.$container.find('table').wrap('<div class="table-content"><div class="table-main"></div></div>');
    self.$content = self.$container.find('.table-content');
    self.$main = self.$container.find('.table-main');
    self.$fixedTable = $('<div class="table-header-fixed"><table class="' + (self.$table.attr('class') || '') + '"><thead>' + self.$table.find('thead').html() + '</thead></table></div>');

    self.init();
};

Table.prototype = {
    init() {
        let self = this;
        let config = self.config;
        self.bindEvent();
        self.updateFixHeader();
        self.$content.prepend(self.$fixedTable);
        self.$main.find('table').css({ 'marginTop': -self.$fixedTable.find('thead')[0].getBoundingClientRect().height });
    },
    updateFixHeader() {
        let self = this;
        let $srcTh = self.$table.find('thead th');
        let $descTh = self.$fixedTable.find('thead th');

        $.each($srcTh, function(index, el) {
            let $el = $(el);
            let $desc = $descTh.eq(index).find('.fill-cell');
            let lastTh = index === $descTh.length - 1 ? scrollBarWidth : 0;
            let paddingWidth = parseInt($el.css('padding-right')) * 2;
            let width = el.getBoundingClientRect().width - paddingWidth + lastTh - 1;


            if ($desc.length) {
                $desc.css('width', width);
            } else {
                $descTh.eq(index).append('<div class="fill-cell" style="width:' + width + '"></div>');
            }

        });


        let headWidth = self.$fixedTable.find('table')[0].getBoundingClientRect().width - 2;

        self.$main.css({ 'width': headWidth });
        // self.$fixedTable.find('table').css({'width':headWidth});

    },
    bindEvent(){
    	var self = this;
    	self.$el.on('change', '.table-checkedall', function(event) {
    		self.$el.find('.item-checked').prop('checked',this.checked);
    	});
    	self.$el.on('click', '.btn-table-edit', function(event) {
    		// self.$el.find('.item-checked').prop('checked',this.checked);
    	});
    }
};



$(window).on('resize', function() {
    $.each(store, function(key, obj) {
        obj.updateFixHeader();
    });
});

module.exports = {
    table: function(options) {
        store.push(new Table(options, this));
        return store[store.length - 1];
    }
};
