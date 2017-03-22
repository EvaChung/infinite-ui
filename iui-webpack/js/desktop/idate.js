/*
    idate
    @version  1.1
    @author   janking
 */
var moment = require('../vendor/moment');
var templateEngine = function(html, options) {
    var re = /<%([^%>]+)?%>/g,
        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
        code = 'var r=[];\n',
        cursor = 0,
        match;
    var add = function(line, js) {
        code += js ? (line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') : (line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    };

    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
};

var template = '<%if(!this[\'idate\'].config.singleDatePicker){%>' +
    '<div class="range-time-show">' +
    '<i class="fa fa-calendar glyphicon glyphicon-calendar"></i>' +
    '<span class="time-text">' +
    '<%if(this[\'witchCalendar\'] === 0){%>' +
    '<%this[\'idate\'].startDate%>' +
    '<%}else{%>' +
    '<%this[\'idate\'].endDate%>' +
    '<%}%>' +
    '</span>' +
    '</div>' +
    '<%}%>' +
    '<table class="idate-table-condensed">' +
    '<thead>' +
    '<tr>' +
    '<th class="btn-prev" data-num="<%this[\'prev\']%>"><i class="glyphicon glyphicon-chevron-left"></i></th>' +
    '<%this["title"]%>' +
    '<th class="btn-next" data-num="<%this[\'next\']%>"><i class="glyphicon glyphicon-chevron-right"></i></th>' +
    '</tr>' +
    '<%if(this["weeklist"]){%>' +
    '<tr class="idate-week">' +
    '<%for(var i = 0;i < this["weeklist"].length ; i++){%>' +
    '<th><%this["weeklist"][i]%></th>' +
    '<%}%>' +
    '</tr>' +
    '<%}%>' +
    '</thead>' +
    '<%this["tbody"]%>' +
    '</table>';

var dateBox = '<div class="idate-container">' +
    '<div class="idate-content clearfix">' +
    '<div class="idate-calendar left">' +
    '<div class="idate-calendar-table"></div>' +
    '</div>{{right-calendar}}{{sidebar}}' +
    '</div>' +
    '</div>';

var sidebar = '<div class="idate-side">' +
    '<label class="calendar-type"><input name="idate-type" value="0" type="radio" checked>自定义</label>' +
    '<label class="calendar-type"><input name="idate-type" value="1" type="radio" >自然日</label>' +
    '<label class="calendar-type"><input name="idate-type" value="2" type="radio">自然周</label>' +
    '<label class="calendar-type"><input name="idate-type" value="3" type="radio">自然月</label>' +
    '</div>';

var rightCalendar = '<div class="idate-calendar right"><div class="idate-calendar-table"></div></div>';

var YYYYMMDD = 'YYYY-MM-DD';
var statusClassName = 'range-in from to';

/**
 * [isValidDate 是否为有效时间对象]
 * @param  {String/Number}  time [格式化时间或时间戳]
 * @return {Boolean}      [true or false]
 */
function isValidDate(time) {
    var d = time ? new Date(time) : null;
    if (Object.prototype.toString.call(d) === "[object Date]") {
        if (isNaN(d.getTime())) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

/**
 * [getCalendarIndex 获取当前操作日历的序号]
 * @param  {[jQ dom]} src [当前操作日历中的某一元素]
 * @return {[Number]}     [0:左边日历，1:右边日历]
 */
function getCalendarIndex(src) {
    return src.parents('div.idate-calendar').hasClass('left') ? 0 : 1;
}

/**
 * [detectRangeIn 判断当前td是否为当前所选时间范围内]
 * @param  {[String]}   curDate     [当前格式化时间]
 * @param  {[String]}   offStyle    [当前td的class是否有off]
 * @return {[String]}               [返回 range-in 或空字符串]
 */
function detectRangeIn(curDate, offStyle) {
    var curDateTimestamp = +moment(curDate);
    return this.rangeStatus === 2 && this.startDate && curDateTimestamp > +moment(this.startDate) && curDateTimestamp < +moment(this.endDate) && !offStyle ? ' range-in' : '';
}

/**
 * [detectRangeFrom 判断当前td是否为起始时间]
 * @param  {[String]}   curDate     [当前格式化时间]
 * @param  {[String]}   offStyle    [当前td的class是否有off]
 * @return {[String]}               [返回 from 或空字符串]
 */
function detectRangeFrom(curDate, offStyle) {
    return this.rangeStatus && curDate === moment(this.startDate).format(YYYYMMDD) && !offStyle ? ' from' : '';
}

/**
 * [detectRangeFrom 判断当前td是否为结束时间]
 * @param  {[String]}   curDate     [当前格式化时间]
 * @param  {[String]}   offStyle    [当前td的class是否有off]
 * @return {[String]}               [返回 to 或空字符串]
 */
function detectRangeTo(curDate, offStyle) {
    return this.rangeStatus === 2 && curDate === moment(this.endDate).format(YYYYMMDD) && !offStyle ? ' to' : '';
}

/**
 * [inputDate 向input插入所选时间]
 */
function inputDate() {
    var self = this;
    var fmt = self.config.format;
    var separator = self.config.separator;
    var value = self.startDate && self.endDate ? moment(self.startDate).format(fmt) + separator + moment(self.endDate).format(fmt) : '';
    if (self.$el.val() !== value) {
        self.$el.data('prevDate', self.$el.val());
        self.$el.val(value);
        if (self.checkType !== 2) {
            self.$el.data('prevDate', value);
        }
        self.$el.trigger('idate.change', [self]);
    }

}

/**
 * [statusReset 组件状态重置]
 * rangeStatus : 范围选取状态
 * startDate   : 开始时间
 * endDate     : 结束时间
 * rangeStep   : 选取步骤
 */
function statusReset() {
    this.rangeStatus = 0;
    this.startDate = null;
    this.endDate = null;
    this.rangeStep = 0;
    this.$dateBox.find('td').removeClass('range-in from to');
    this.$el.val('');
}

/**
 * [getValue 获取input的value值]
 * @return {[Array]} [返回时间数组]
 */
function getValue() {
    var input = this.$el[0];
    var value = input.value ? input.value.split(this.config.separator) : [];
    if (!isValidDate(value[0]) || !isValidDate(value[1])) {
        this.value = '';
        value = [null, null];
    }
    return value;
}

/**
 * [isValidValue 判断input的值是否符合时间格式]
 * @param  {[String]}  value [input value]
 * @return {Boolean}
 */
function isValidValue(value) {
    return value && isValidDate(value[0]) && isValidDate(value[1]) && +new Date(value[0]) <= +new Date(value[1]);
}

/**
 * [saveStatus 组件状态保存]
 * 根据checkType进行分类存储
 * checkType : 0 自定义，1 自然日，2 自然周，3 自然月
 */
function saveStatus() {
    var self = this;
    var checkType = self.checkType;
    self._cache[checkType] = {
        startDate: self.startDate,
        endDate: self.endDate,
        rangeStatus: self.rangeStatus,
        rangeStep: self.rangeStep,
        html: self.$dateBox.html()
    };

}

/**
 * [loadStatus 读取缓存]
 */
function loadStatus(cache) {
    this.startDate = cache.startDate;
    this.endDate = cache.endDate;
    this.rangeStatus = cache.rangeStatus;
    this.rangeStep = cache.rangeStep;
}

$(window).on('resize', function(event) {
    $('.idate-container.open').each(function(index, el) {
        var idate = $(el).data('idate');
        idate.showCalendar(idate.$el[0]);
    });
});

// 隐藏组件
$('body').on('click', function(event) {
    $('.idate-container.open').each(function(index, el) {
        var $target = $(event.target);
        var idate = $(el).data('idate');
        if (
            $target.is(idate.$el) ||
            $target.closest('.idate-container').length ||
            $target.is(idate.$dateBox) ||
            $target.parents('table.idate-table-condensed').length ||
            $target.is($(idate.config.iconClick))
        ) {
            return;
        }
        idate.hideCalendar();
    });
});

if (typeof moment === void 0) {
    throw 'can not found moment.js';
}

var selector = this;

var defaults = {
    container: 'body',
    format: YYYYMMDD,
    singleDatePicker: false,
    separator: ' to ',
    minDate: '',
    maxDate: moment(),
    maxDateLength: Number.MAX_VALUE,
    sidebar: true,
    shortcut: {
        today: [moment(), moment()],
        yesterday: [moment().subtract(1, 'd'), moment().subtract(1, 'd')],
        lastWeek: [moment().subtract(6, 'd'), moment()],
        lastMonth: [moment().subtract(29, 'd'), moment()]
    }
};

function Idate(options) {
    this.$el = selector;
    this.config = $.extend({}, defaults, options);
    var isRangePicker = !this.config.singleDatePicker;
    this.$container = $(this.config.container);
    this.containerPos = this.$container[0].getBoundingClientRect();
    this.template = dateBox.replace('{{right-calendar}}', isRangePicker ? rightCalendar : '');
    this.template = this.template.replace('{{sidebar}}', isRangePicker && this.config.sidebar ? sidebar : '');
    this.$dateBox = $(this.template);
    this.$dateTableContext = this.$dateBox.find('.idate-calendar-table');
    this.screenWidth = $(document).width();
    this.screenHeight = $(document).height();
    this._cache = [];
    this.startDate = null;
    this.endDate = null;
    this.piking = null;
    this.checkType = 0;
    this.rangeStep = 0;
    this.rangeStatus = 0; // 0 初始化，1 起始，2 结束
    this.minDate = this.config.minDate ? moment(this.config.minDate) : null;
    this.maxDate = this.config.maxDate ? moment(this.config.maxDate) : null;
    this.init();
}

Idate.prototype.init = function() {
    var self = this;
    var type = ['singleEvent', 'rangeEvent'][self.config.singleDatePicker ? 0 : 1];
    self[type]();
    self.$dateBox.data('idate', self);
};

Idate.prototype.setStartTime = function(time, caller) {
    var self = this;
    var $tds = self.$dateBox.find('td');
    var $text = self.$dateBox.find('.time-text');
    var $ltext = $text.eq(0);
    var $caller = caller || $({});
    $tds.removeClass(statusClassName);
    $caller.addClass('from');
    self.rangeStep = self.rangeStatus = 1;
    self.startDate = time;
    $ltext.text(time);
};

Idate.prototype.setEndTime = function(time, caller, reset) {
    var self = this;
    var $text = self.$dateBox.find('.time-text');
    var $rtext = $text.eq(1);
    var $caller = caller || $({});
    $caller.addClass('to');
    self.rangeStep = 0;
    self.endDate = time;
    self.rangeStatus = 2;
    $rtext.text(time);

    if (reset) {
        self.checkType = 0;
        self.$dateBox.find('.btn-shortcut').removeClass('active');
        self.$dateBox.find('[name="idate-type"]').removeAttr('checked').eq(0).attr('checked', true).prop('checked', true);
        self.$dateBox.find('.idate-content').removeClass('mode-week mode-month');
        self._cache = [];
    }
    inputDate.call(self);

};


Idate.prototype.rangeEvent = function() {
    var self = this;
    // 调用控件
    self.$el.on('focus.iui-idate', function(event) {
        var value = getValue.call(self);
        var cacheObj = self._cache[self.checkType];
        var html;
        if (self._cache.length !== 0) {
            loadStatus.call(self, cacheObj);
            self.$dateBox.html(cacheObj.html);
            self.$dateTableContext = self.$dateBox.find('.idate-calendar-table');
            self.$dateBox.find('.idate-content');
        } else {
            html = self.renderRangeDates(value, value.slice());
            self.$dateTableContext.each(function(index, el) {
                el.innerHTML = html[index];
            });
        }
        // self.$dateBox.find('.idate-calendar-table').removeClass('disabled');
        self.showCalendar(this);
    });

    if (self.config.iconClick) {
        $(self.config.iconClick).on('click', function(event) {
            self.$el.trigger('focus.iui-idate');
        });
    }
    // 上一页,下一页
    self.$dateBox.on('click.iui-idate', '.btn-prev,.btn-next', function(event) {
        var $this = $(this);
        var index = getCalendarIndex($this);
        var curTime = $this.data('num');
        var prevTime = moment(curTime).subtract(1, 'M').format(YYYYMMDD);
        var nextTime = moment(curTime).add(1, 'M').format(YYYYMMDD);
        var value = index ? [prevTime, curTime] : [curTime, nextTime];
        var html;

        if (self.mode === 0) {
            html = self.renderRangeDates(value, getValue.call(self));
        } else if (self.mode === 1) {
            html = self.renderMonths($this.data('num'));
        } else {
            html = self.renderYears($this.data('num'));
        }

        if (typeof html === 'string') {
            self.$dateTableContext.eq(index).html(html);
        } else {
            self.$dateTableContext.each(function(index, el) {
                el.innerHTML = html[index];
            });
        }

    });

    // 开始，结束选取时间
    self.$dateBox.on('click.iui-idate', 'td.date', function(event) {
        var $this = $(this);
        var curTime = $this.data('num');
        var startDate = moment(self.startDate);
        var endDate = moment(curTime);
        var diffInDays = endDate.diff(startDate, 'days') + 1;
        var index = getCalendarIndex($this);
        var curDate, html, weekStart, weekEnd;
        if (self.checkType) {
            if (self.checkType === 1) {
                if ($this.hasClass('off') || $this.hasClass('disabled')) {
                    return false;
                }
                weekStart = weekEnd = curTime;
            } else if (self.checkType === 2 && $this.parent().find('td.disabled').length === 0) {
                weekStart = moment(curTime).weekday(0).format(YYYYMMDD);
                weekEnd = moment(curTime).weekday(6).format(YYYYMMDD);
            } else {
                return false;
            }

            self.setStartTime(weekStart, self.$dateBox.find('[data-num="' + weekStart + '"]'));
            self.setEndTime(weekEnd, self.$dateBox.find('[data-num="' + weekEnd + '"]'));
            curDate = index ? moment(self.startDate).subtract(1, 'M') : self.startDate;
            html = self.renderRangeDates([curDate, null]);
            self.$dateTableContext.each(function(key, el) {
                el.innerHTML = html[key];
            });
            inputDate.call(self);
            self.hideCalendar();
        } else {
            if ($this.hasClass('off') || $this.hasClass('disabled') || (diffInDays > self.config.maxDateLength && self.rangeStatus === 1)) {
                return;
            }
            self.rangePicker(curTime, this);
        }
    });

    // 开始选取范围
    self.$dateBox.on('mouseenter', 'td', function(event) {
        var $this = $(this);
        var tdList = self.$dateBox.find('td');
        var curTdIndex = tdList.index($this);
        var startTdIndex = tdList.index(self.$dateBox.find('td[data-num="' + self.startDate + '"]'));
        var startDate = +new Date(self.startDate);
        var fromDate = moment(self.startDate);
        var data;
        if (startTdIndex === -1 && (+new Date(tdList.eq(0).data('num')) > startDate)) {
            startTdIndex = 0;
        }

        data = tdList.slice(startTdIndex, curTdIndex);
        if (self.rangeStep) {
            tdList.slice(curTdIndex).removeClass('range-in');
            $.each(data, function(index, el) {
                var $el = $(el);
                var curTimeStr = $el.data('num');
                var time = +new Date(curTimeStr);
                var diffInDays = moment(curTimeStr).diff(fromDate, 'days');
                if (time > startDate && !$el.hasClass('off') && diffInDays < self.config.maxDateLength) {
                    $el.addClass('range-in');
                }
            });
        }
    });

    // 进入月份
    self.$dateBox.on('click.iui-idate', '.btn-month', function(event) {
        var $this = $(this);
        var index = getCalendarIndex($this);
        var html = self.renderMonths($(this).data('num'));
        self.$dateTableContext.eq(index).html(html);
        self.$dateBox.find('.idate-calendar-table').eq(index ? 0 : 1).addClass('disabled');
    });

    // 进入年份
    self.$dateBox.on('click.iui-idate', '.btn-year', function(event) {
        var $this = $(this);
        var index = getCalendarIndex($this);
        var html = self.renderYears($(this).data('num'));
        self.$dateTableContext.eq(index).html(html);
        self.$dateBox.find('.idate-calendar-table').eq(index ? 0 : 1).addClass('disabled');
    });

    // 选择月份
    self.$dateBox.on('click.iui-idate', 'span.month', function(event) {
        var $this = $(this);
        var index = getCalendarIndex($this);
        var curDateStr = $(this).data('num');
        var weekStart, weekEnd;

        if ($this.hasClass('disabled')) {
            return false;
        }
        if (self.checkType === 3) {
            weekStart = moment(curDateStr).startOf('month').format(YYYYMMDD);
            weekEnd = moment(curDateStr).endOf('month').format(YYYYMMDD);
            self.setStartTime(weekStart, null);
            self.setEndTime(weekEnd, null);
            self.hideCalendar();
        } else {
            var curDate = index ? moment(curDateStr).subtract(1, 'M') : curDateStr;
            var html = self.renderRangeDates([curDate, null], false);
            self.$dateBox.find('.idate-calendar-table').removeClass('disabled');
            self.$dateTableContext.each(function(index, el) {
                el.innerHTML = html[index];
            });
        }
    });

    // 选择年份
    self.$dateBox.on('click.iui-idate', 'span.year', function(event) {
        var $this = $(this);
        var index = getCalendarIndex($this);
        if ($this.hasClass('disabled')) {
            return false;
        }
        var html = self.renderMonths($this.data('num'));
        self.$dateTableContext.eq(index).html(html);
    });

    // // 快捷选择
    // self.$dateBox.on('click.iui-idate', '.btn-shortcut', function(event) {
    //     event.preventDefault();
    //     var $this = $(this);
    //     var timeRange = self.config.shortcut[$this.data('type')];
    //     var startDate = timeRange[0];
    //     var endDate = timeRange[1];
    //     var typeClassName = 'mode-week mode-month';
    //     var html;
    //     self.$dateBox.find('.idate-content').removeClass(typeClassName);
    //     self.$dateBox.find('[name="idate-type"]').removeAttr('checked').eq(0).attr('checked','checked').prop('checked',true);
    //     $this.addClass('active').siblings('.active').removeClass('active');
    //     self.setStartTime(startDate.format(YYYYMMDD),null);
    //     self.setEndTime(endDate.format(YYYYMMDD),null);
    //     html = self.renderRangeDates([self.startDate,null],false);
    //     self.$dateTableContext.each(function(index, el) {
    //             el.innerHTML = html[index];
    //     });
    //     self.hideCalendar();
    // });

    // 自然模式
    self.$dateBox.on('change.iui-idate', '.calendar-type input', function(event) {
        saveStatus.call(self);
        var $this = $(this);
        var type = self.checkType = parseInt($this.val(), 10);
        var cacheObj = self._cache[type];
        var typeClassName = 'mode-week mode-month';
        var $content = self.$dateBox.find('.idate-content');
        var $shortcuts = self.$dateBox.find('.btn-shortcut');
        var $radios = self.$dateBox.find('[name="idate-type"]');
        var html = cacheObj ? cacheObj.html : self.renderRangeDates([moment(), null], false);
        var mode = { 2: 'mode-week', 3: 'mode-month' };
        $shortcuts.removeClass('active');
        $radios.not($this).removeAttr('checked');
        $this.attr('checked', 'checked').prop('checked', true);
        if (cacheObj) {
            loadStatus.call(self, cacheObj);
            self.$dateBox.html(html);
            self.$dateTableContext = self.$dateBox.find('.idate-calendar-table');
        } else {
            self.$dateTableContext.each(function(index, el) {
                el.innerHTML = html[index];
            });
            statusReset.call(self);
        }
        if (type) {
            $content.removeClass(typeClassName).addClass(mode[type]);
            self.$dateBox.find('.idate-calendar-table').removeClass('disabled');
            if (type === 3) {
                self.$dateTableContext.eq(0).html(self.renderMonths(moment()));
            }
        } else {
            $content.removeClass(typeClassName);
        }
        self.showCalendar(self.$el[0]);
        self.$el.trigger('idate.checkTypeChange', [self]);
    });

};

Idate.prototype.singleEvent = function() {
    var self = this;
    // 调用控件
    self.$el.on('focus.iui-idate', function(event) {
        var value = isValidDate(this.value) ? this.value : +new Date();
        var html = self.renderDates(value, this.value);
        self.$dateTableContext.html(html);
        self.showCalendar(this);
    });


    // 上一页 or 下一页
    self.$dateBox.on('click.iui-idate', '.btn-prev,.btn-next', function(event) {
        var $this = $(this);
        var curDateStr = $this.data('num');
        var mode = self.mode;
        var html = mode ? (mode === 1 ? self.renderMonths(curDateStr) : self.renderYears(curDateStr)) : self.renderDates(curDateStr, self.$el.val());
        self.$dateTableContext.html(html);
    });

    // 进入月份 or 进入年份
    self.$dateBox.on('click.iui-idate', '.btn-month,.btn-year', function(event) {
        var $this = $(this);
        var curDateStr = $this.data('num');
        var type = ['renderMonths', 'renderYears'][$this.hasClass('btn-month') ? 0 : 1];
        var html = self[type](curDateStr);
        self.$dateTableContext.html(html);
    });

    // 选择日期
    self.$dateBox.on('click.iui-idate', 'td.date', function(event) {
        var $this = $(this);
        self.singlePicker($this.data('num'));
    });

    // 选择月份 or 选择年份
    self.$dateBox.on('click.iui-idate', 'span.month,span.year', function(event) {
        var $this = $(this);
        var curDateStr = $this.data('num');
        var type = ['renderDates', 'renderMonths'][$this.hasClass('month') ? 0 : 1];
        var html = self[type]($this.data('num'), self.$el.val());
        self.$dateTableContext.html(html);
    });

};

Idate.prototype.showCalendar = function(caller) {
    var self = this;
    var offsetCaller = caller.getBoundingClientRect();
    var offsetX = offsetCaller.left;
    var offsetY = offsetCaller.top;
    var offsetWidth = offsetCaller.width;
    var offsetHeight = offsetCaller.height;
    var dateBoxWidth;
    self.$dateBox.removeAttr('style').addClass('open').css('opacity', 0).appendTo(self.$container);
    dateBoxWidth = self.$dateBox.outerWidth();
    self.$dateBox.css({
        left: offsetX,
        top: offsetY + offsetHeight + 10,
        opacity: 1
    });
};


Idate.prototype.hideCalendar = function(caller) {
    var self = this;
    if (!self.config.singleDatePicker) {
        saveStatus.call(self);
        inputDate.call(self);
    }
    self.$dateBox.removeClass('open');
};


Idate.prototype.renderDates = function(time, value, calendarIndex) {
    var self = this;
    // 待渲染UI的当前时间
    var curTime = moment(time);
    // 待渲染UI的当前月份对象
    var curTimeM = curTime.format('M');
    // 待渲染UI的当前月份格式 YYYY-MM-DD
    var curTimeYYYYMMDD = curTime.format(YYYYMMDD);
    // 待渲染UI的当前月第一天所在周的星期一的对象
    var startDate = moment(time).date(1).weekday(0);
    // 现实当前时间
    var nowTimeYYYYMMDD = moment().format(YYYYMMDD);
    // value时间对象
    var valueTime = moment(isValidDate(value) ? value : time);
    // value时间的格式化 YYYY-MM-DD
    var valueTimeYYYYMMDD = valueTime.format(YYYYMMDD);
    // 是否单选时间模式
    var pickerType = self.config.singleDatePicker;

    var html = templateEngine(template, {
        witchCalendar: calendarIndex, //渲染header部分的开始，结束时间
        idate: self,
        title: '<th colspan="3" class="btn-month" data-num="' + curTimeYYYYMMDD + '">' + curTime.format('MMMM') + '</th><th colspan="2" class="btn-year" data-num="' + curTimeYYYYMMDD + '">' + curTime.format('YYYY') + '</th>',
        prev: moment(time).subtract(1, 'M').format(YYYYMMDD),
        next: moment(time).add(1, 'M').format(YYYYMMDD),
        weeklist: function() {
            var arr = [];
            for (var i = 1; i < 8; i++) {
                arr.push(curTime.isoWeekday(i).format('dd'));
            }
            return arr;
        }(),
        tbody: function() {
            var html = '<tbody class="idate-dateList"><tr class="">';
            var rowHasDisabled = '';
            for (var i = 1; i < 43; i++) {
                // 当前循环的时间对象
                var curDate = startDate.add(i === 1 ? 0 : 1, 'days');
                var curDateYYYYMMDD = curDate.format(YYYYMMDD);
                // 当前循环的日期所属月是否等于待渲染UI的月份，若不是，则class="off"
                var isCurMonth = curDate.format('M') === curTimeM;
                var offStyle = isCurMonth ? '' : ' off';
                // 当前循环的日期是否现实中的今天；若是，则class="cur-date"
                var isNowDate = curDateYYYYMMDD === nowTimeYYYYMMDD && !offStyle ? ' cur-date' : '';
                // 当前循环的日期是否上一次所选中的，若是，则class="active"，仅当单选时间模式有效
                var isChecked = pickerType && value && curDateYYYYMMDD === valueTimeYYYYMMDD ? ' active' : '';
                // 当前循环的日期是否在被选中的开始时间与结束时间之中
                var rangIn = detectRangeIn.call(self, curDateYYYYMMDD, offStyle);
                // 当前循环的日期是否是被选中的开始时间
                var fromDate = detectRangeFrom.call(self, curDateYYYYMMDD, offStyle);
                // 当前循环的日期是否是被选中的结束时间
                var toDate = detectRangeTo.call(self, curDateYYYYMMDD, offStyle);

                var maxDate = self.maxDate && +curDate > +self.maxDate ? ' disabled' : '';

                var statusClass = offStyle + isNowDate + isChecked + rangIn + fromDate + toDate + maxDate;

                rowHasDisabled += maxDate ? '1' : '0';

                html += '<td class="date' + statusClass + '" data-num="' + curDateYYYYMMDD + '">' + curDate.format('D') + '</td>';

                if (i != 1 && i % 7 === 0) {
                    html = html.replace('class=""', rowHasDisabled.indexOf('1') !== -1 ? '' : 'class="has-not-disabled"');
                    html += '</tr><tr class="">';
                }
            }

            return html + '</tr></tbody>';
        }()
    });
    self.mode = 0;
    return html;
};

Idate.prototype.renderRangeDates = function(time, value) {
    var self = this;
    var isValidStartDate = isValidDate(time[0]);
    var leftTime = isValidStartDate ? time[0] : moment();
    var rightTime = moment(isValidStartDate ? time[0] : +new Date()).add(1, 'M');
    var lHtml, rHtml;

    if (isValidValue(value)) {
        self.rangeStatus = 2;
        self.startDate = moment(+new Date(value[0])).format(YYYYMMDD);
        self.endDate = moment(+new Date(value[1])).format(YYYYMMDD);
    }

    lHtml = self.renderDates(leftTime, false, 0);
    rHtml = self.renderDates(rightTime, false, 1);

    return [lHtml, rHtml];
};

Idate.prototype.renderMonths = function(time) {
    var self = this;
    var curTime = moment(time);
    var curTimeYYYY = curTime.format('YYYY');
    var curMonth = parseInt(curTime.format('M'), 10) - 1;
    var nowTime = moment();
    var nowTimeYYYY = nowTime.format('YYYY');
    var html = templateEngine(template, {
        idate: self,
        title: '<th colspan="5" class="btn-year" data-num="' + curTime.format(YYYYMMDD) + '">' + curTimeYYYY + '</th>',
        prev: moment(time).subtract(1, 'y').format(YYYYMMDD),
        next: moment(time).add(1, 'y').format(YYYYMMDD),
        tbody: function() {
            var months = moment.monthsShort();
            var html = '<tbody class="idate-monthList"><tr><td colspan="7">';
            for (var i = 0; i < months.length; i++) {
                var isThisMonth = (i === curMonth && curTimeYYYY === nowTimeYYYY ? ' cur-month' : '');
                var maxDate = self.maxDate && +curTime.month(i) > +self.maxDate ? ' disabled' : '';
                var statusClassName = isThisMonth + maxDate;

                html += '<span class="month' + statusClassName + '" data-num="' + curTime.month(i).format(YYYYMMDD) + '">' + months[i] + '</span>';
            }
            return html + '</td></tr></tbody>';
        }()
    });
    self.mode = 1;
    return html;
};

Idate.prototype.renderYears = function(time) {
    var self = this;
    var startYear = moment(time).subtract(5, 'y');
    var endYear = moment(time).add(6, 'y');
    var startYearYYYY = parseInt(startYear.format('YYYY'), 10);
    var curYear = moment().format('YYYY');
    var html = templateEngine(template, {
        idate: self,
        title: '<th colspan="5" data-num="' + startYear.format(YYYYMMDD) + '">' + startYearYYYY + '-' + endYear.format('YYYY') + '</th>',
        prev: moment(time).subtract(12, 'y').format(YYYYMMDD),
        next: moment(time).add(12, 'y').format(YYYYMMDD),
        tbody: function() {
            var html = '<tbody class="idate-yearList"><tr><td colspan="7">';
            for (var i = 0; i < 12; i++) {
                var isCurYear = parseInt(curYear, 10) === (parseInt(startYearYYYY, 10) + i) ? ' cur-year' : '';
                var year = startYearYYYY + i;
                var yearYYYYMMDD = startYear.add(i === 0 ? 0 : 1, 'y').format(YYYYMMDD);
                var maxDate = self.maxDate && +new Date(yearYYYYMMDD) > +self.maxDate ? ' disabled' : '';
                html += '<span class="year' + isCurYear + maxDate + '" data-num="' + yearYYYYMMDD + '">' + year + '</span>';
            }
            return html + '</td></tr></tbody>';
        }()
    });
    self.mode = 2;
    return html;
};

Idate.prototype.singlePicker = function(time) {
    var self = this;
    self.$el.val(moment($(this).data('num')).format(self.config.format));
    self.hideCalendar();
};

Idate.prototype.rangePicker = function(time, caller) {
    var self = this;
    var $caller = $(caller);
    var fromDate = moment(time);
    var $tds = self.$dateBox.find('td');
    self.$dateBox.find('.btn-shortcut').removeClass('active');

    if ((+new Date(time)) < (+new Date(self.startDate))) {
        self.rangeStep = 0;
        $tds.remove(statusClassName);
    }

    if (self.rangeStep === 0) {
        self.setStartTime(time, $caller);
    } else {
        self.setEndTime(time, $caller);
        self.hideCalendar();
    }
};


module.exports = {
    idate: function(options) {
         return new Idate(options);

    }
};
