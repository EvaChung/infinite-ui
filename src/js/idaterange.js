$.fn.IUI({
    idate: function(options) {

        if (typeof moment === void 0) {
            throw 'can not found moment.js';
            return false;
        }

        var defaults = {
            container: 'body',
            format:'YYYY-MM-DD hh:mm:ss',
            singleDatePicker: false,
            separator:' to '
        };

        var templateEngine = function(html, options) {
            var re = /<%([^%>]+)?%>/g,
                reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
                code = 'var r=[];\n',
                cursor = 0,
                match;
            var add = function(line, js) {
                js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                    (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                return add;
            }
            while (match = re.exec(html)) {
                add(html.slice(cursor, match.index))(match[1], true);
                cursor = match.index + match[0].length;
            }
            add(html.substr(cursor, html.length - cursor));
            code += 'return r.join("");';
            return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
        };

        var template = $('#tpl-html').html();

        var dateBox = '<div class="idate-container">' +
                            '<div class="idate-content clearfix">' +
                                '<div class="idate-calendar">' +
                                    '<div class="idate-calendar-table"></div>' +
                                '</div>' +
                                '<div class="idate-side hide">' +
                                    '<button class="btn-dateType">date</button>' +
                                    '<button class="btn-dateType">week</button>' +
                                    '<button class="btn-dateType">month</button>' +
                                    '<button class="btn-dateType">season</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

        var selector = this;

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

        function Idate(options) {
            this.$el = selector;
            this.config = $.extend({}, defaults, options);
            this.$container = $(this.config.container);
            this.$dateBox = $(dateBox);
            this.$dateTableContext = this.$dateBox.find('.idate-calendar-table');
            this.startDate = null;
            this.startTd = null;
            this.endTd = null;
            this.endDate = null;
            this.rangeStep = 0;
            // this.init();
            this.event();
        }


        // Idate.prototype.init = function() {

        // };
        //
        //



        Idate.prototype.event = function() {
            var self = this;
            // 隐藏控件
            self.$container.on('click', function(event) {
                var $target = $(event.target);
                if(
                    $target.is(self.$el) ||
                    $target.closest('.idate-container').length ||
                    $target.is(self.$dateBox) ||
                    $target.parents('table.idate-table-condensed').length
                ){return;}
                 self.hideCalendar();
            });

            // 调用控件
            self.$el.on('focus.iui-idate', function(event) {
                var value,html;

                if(self.config.singleDatePicker){
                    value = isValidDate(this.value) ? this.value : +new Date() ;
                    html = self.renderDates(value,this.value);
                }else{
                    value = this.value ? this.value.split(self.config.separator) : [];
                    html = self.renderRangeDates(value,value.slice());
                }

                self.$dateTableContext.html(html);
                self.showCalendar(this);
            });

            // 选择月份
            self.$dateBox.on('click.iui-idate', '.btn-month', function(event) {
                var html = self.renderMonths($(this).data('num'));
                self.$dateTableContext.html(html);
            });

            // 选择年份
            self.$dateBox.on('click.iui-idate', '.btn-year', function(event) {
                var html = self.renderYears($(this).data('num'));
                self.$dateTableContext.html(html);
            });

            // 上一页
            self.$dateBox.on('click.iui-idate', '.btn-prev', function(event) {
                var $this = $(this);
                var html;
                if (self.mode === 0) {
                    html = self.renderDates($this.data('num'),self.$el.val());
                } else if (self.mode === 1) {
                    html = self.renderMonths($this.data('num'));
                } else {
                    html = self.renderYears($this.data('num'));
                }
                self.$dateTableContext.html(html);
            });

            // 下一页
            self.$dateBox.on('click.iui-idate', '.btn-next', function(event) {
                var $this = $(this);
                var html;
                if (self.mode === 0) {
                    html = self.renderDates($this.data('num'),self.$el.val());
                } else if (self.mode === 1) {
                    html = self.renderMonths($this.data('num'));
                } else {
                    html = self.renderYears($this.data('num'));
                }
                self.$dateTableContext.html(html);
            });

            self.$dateBox.on('click.iui-idate', 'td.date', function(event) {
            		var $this = $(this);
            		if(self.config.singleDatePicker){
            			self.singlePicker($this.data('num'));
            		}else{
                        self.rangePicker($this.data('num'),this);
            		}
            });

            self.$dateBox.on('click.iui-idate', 'span.month', function(event) {
            	var $this = $(this);
                var html = self.renderDates($this.data('num'),self.$el.val());
                self.$dateTableContext.html(html);
            });

            self.$dateBox.on('click.iui-idate', 'span.year', function(event) {
            	var $this = $(this);
                var html = self.renderMonths($this.data('num'),self.$el.val());
                self.$dateTableContext.html(html);
            });

            self.$dateBox.on('mouseenter', 'td', function(event) {
                var $this = $(this);
                var tdList = self.$dateBox.find('td');
                var curTdIndex = tdList.index($this);
                var startTdIndex = tdList.index(self.startTd);
                var startDate = +new Date(self.startDate);
                var data;
                if(startTdIndex === -1 && (+new Date(tdList.eq(0).data('num')) > startDate)){
                    startTdIndex = 0;
                }
                data = tdList.slice(startTdIndex,curTdIndex);

                if(self.rangeStep){
                    tdList.slice(curTdIndex).removeClass('range-in');
                    $.each(data,function(index, el) {
                        var $el = $(el);
                        var time = +new Date($el.data('num'));
                        if(time > startDate){
                            $el.addClass('range-in');
                        }
                    });
                }
            });

            self.$dateBox.on('click.iui-idate','td.off',function(event){
                var $this = $(this);
                if()
            });

        };

        Idate.prototype.showCalendar = function(caller) {
            var self = this;
            var offset = caller.getBoundingClientRect();
            var offsetX = offset.left;
            var offsetY = offset.top;
            var offsetWidth = offset.width;
            var offsetHeight = offset.height;
            var dateBoxWidth;
            var dateBoxHeight;
            self.$dateBox.addClass('open').css('opacity', 0).appendTo(self.$container);
            dateBoxWidth = self.$dateBox.outerWidth();
            dateBoxHeight = self.$dateBox.outerHeight();
            self.$dateBox.css({
                left: offsetX + offsetWidth - dateBoxWidth,
                top: offsetY + offsetHeight + 10,
                opacity: 1
            });
        };

        Idate.prototype.hideCalendar = function(caller){
        	this.$dateBox.removeClass('open');
        };

        Idate.prototype.renderDates = function(time,value) {
            var self = this;
            // UI当前时间
            var curTime = moment(time);
            var curTimeM = curTime.format('M');
            var curTimeYYYYMMDD = curTime.format('YYYY-MM-DD');
            var startDate = moment(time).date(1).weekday(0);
            var endDate = moment(time).endOf('month').weekday(8);
            var diffInDays = endDate.diff(startDate, 'days');
            // 现实当前时间
            var nowTime = moment();
            var nowTimeYYYYMMDD = nowTime.format('YYYY-MM-DD');
            // value时间
            var valueTime = moment(isValidDate(value) ? value : time);
            var valueTimeYYYYMMDD = valueTime.format('YYYY-MM-DD');

            var html = templateEngine(template, {
                title: function() {
                    var html = '<th colspan="3" class="btn-month" data-num="' + curTime.format('YYYY-MM-DD') + '">' + curTime.format('MMMM') + '</th><th colspan="2" class="btn-year" data-num="' + curTime.format('YYYY-MM-DD') + '">' + curTime.format('YYYY') + '</th>';
                    return html;
                }(),
                prev: moment(time).subtract(1, 'months').format('YYYY-MM-DD'),
                next: moment(time).add(1, 'months').format('YYYY-MM-DD'),
                weeklist: [
                    curTime.isoWeekday(1).format('ddd'),
                    curTime.isoWeekday(2).format('ddd'),
                    curTime.isoWeekday(3).format('ddd'),
                    curTime.isoWeekday(4).format('ddd'),
                    curTime.isoWeekday(5).format('ddd'),
                    curTime.isoWeekday(6).format('ddd'),
                    curTime.isoWeekday(7).format('ddd')
                ],
                tbody: function() {
                    var html = '<tbody class="idate-dateList"><tr>';
                    for (var i = 1; i < diffInDays; i++) {
                        var curDate = startDate.add(i === 1 ? 0 : 1, 'd');
	                      var curDateYYYYMMDD = curDate.format('YYYY-MM-DD');
                        var isCurMonth = curDate.format('M') === curTimeM ;
                        var offStyle = isCurMonth ? '' : ' off';
                        var isNowDate = curDateYYYYMMDD === nowTimeYYYYMMDD ? ' cur-date' : '';
                        var isChecked = value && curDateYYYYMMDD === valueTimeYYYYMMDD ? ' active' : '';

                        html += '<td class="date' + offStyle + isNowDate + isChecked + '" data-num="'+curDate.format('YYYY-MM-DD')+'">' + curDate.format('D') + '</td>';
                        if (i != 1 && i % 7 == 0) {
                            html += '</tr><tr>';
                        }
                    }
                    return html + '</tr></tbody>';
                }()
            });
            self.mode = 0;
            return html;
        };

        Idate.prototype.renderRangeDates = function(time,value){
            var self = this;
            if(time.length < 2){
                return self.renderDates(+new Date(),false);
            }
        };

        Idate.prototype.renderMonths = function(time) {
            var self = this;
            var curTime = moment(time);
            var curTimeYYYY = curTime.format('YYYY');
            var curMonth = parseInt(curTime.format('M'), 10) - 1;
            var nowTime = moment();
            var nowTimeYYYY = nowTime.format('YYYY');
            var html = templateEngine(template, {
                title: function() {
                    var html = '<th colspan="5" class="btn-year" data-num="' + curTime.format('YYYY-MM-DD') + '">' + curTimeYYYY + '</th>';
                    return html;
                }(),
                prev: moment(time).subtract(1, 'year').format('YYYY-MM-DD'),
                next: moment(time).add(1, 'year').format('YYYY-MM-DD'),
                tbody: function() {
                    var months = moment.monthsShort();
                    var html = '<tbody class="idate-monthList"><tr><td colspan="7">';
                    for (var i = 0; i < months.length; i++) {
                        html += '<span class="month' + (i === curMonth && curTimeYYYY === nowTimeYYYY ? ' cur-month' : '') + '" data-num="' + curTime.month(i).format('YYYY-MM') + '">' + months[i] + '</span>';
                    }
                    return html + '</td></tr></tbody>';
                }()
            });
            self.mode = 1;
            return html;
        };

        Idate.prototype.renderYears = function(time) {
            var self = this;
            var startYear = moment(time).subtract(5, 'year');
            var endYear = moment(time).add(6, 'year');
            var startYearYYYY = parseInt(startYear.format('YYYY'), 10);
            var curYear = moment().format('YYYY');
            var html = templateEngine(template, {
                title: function() {
                    var html = '<th colspan="5" data-num="' + startYear.format('YYYY-MM-DD') + '">' + startYear.format('YYYY') + '-' + endYear.format('YYYY') + '</th>';
                    return html;
                }(),
                prev: moment(time).subtract(12, 'year').format('YYYY-MM-DD'),
                next: moment(time).add(12, 'year').format('YYYY-MM-DD'),
                tbody: function() {
                    var html = '<tbody class="idate-yearList"><tr><td colspan="7">';
                    for (var i = 0; i < 12; i++) {
                        var isCurYear = parseInt(curYear, 10) === (parseInt(startYearYYYY, 10) + i ) ? ' cur-year' : '';
                    		var year = startYearYYYY + i ;
                    		var yearYYYYMMDD = startYear.add(i === 0 ? 0 : 1,'year').format('YYYY-MM-DD');
                        html += '<span class="year' + isCurYear + '" data-num="'+yearYYYYMMDD+'">' + year + '</span>';
                    }
                    return html + '</td></tr></tbody>';
                }()
            });
            self.mode = 2;
            return html;
        };

        Idate.prototype.singlePicker = function(time){
        	var self = this;
        	self.$el.val(moment(time).format(self.config.format));
        	self.hideCalendar();
        };

        Idate.prototype.rangePicker = function(time,caller){
            var self = this;
            var $caller = $(caller);
            var fromDate =  moment(time);
            if(self.rangeStep === 0){
                self.$dateBox.find('td').removeClass('range-in from to');
                $caller.addClass('from');
                self.rangeStep = 1;
                self.startTd = $caller;
                self.startDate = time;
            }else{
                $caller.addClass('to');
                self.rangeStep = 0;
                self.endTd = $caller;
                self.endDate = time;
            }
        };

        return new Idate(options);

    }
});
