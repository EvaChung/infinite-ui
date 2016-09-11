(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery, window, document);
    }
}(function($, window, document, undefined) {

    var isIE6 = !!(document.all && !window.XMLHttpRequest),

        isMobile = /Mobile/i.test(navigator.userAgent),

        pluginName = 'cityselector',

        defaults = {
            dataJson: null,
            dataAuto: true,
            circle: true,
            level: 2,
            value:false,
            defaultArea: undefined,
            onChangeOne:function(){},
            onChangeTwo:function(){},
            onChangeThree:function(){}
        };

    //cityselector 构造函数

    function cityselector(element, options) {

        this.element = element;

        this.$element = $(this.element);

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;

        this._name = pluginName;

        this.$body = $('body');

        this.selectedIndex = [];

        this.init();
    }


    function concatHtml(data,filter) {
            var str = '';
            var filterStr = '';

            if(data){

                $.each(data, function(index, val) {
                    var _value = val.value ? 'data-value="'+val.value+'"' : '';
                    if(filter && $.inArray(val.name, filter) !== -1){

                        filterStr += '<li data-id="' + index + '" '+_value+' title="' + val.name + '">' + val.name + '</li>';

                    }else{

                        str += '<li data-id="' + index + '" '+_value+'  title="' + val.name + '">' + val.name + '</li>';

                    }

                });

                if(filter){return filterStr;}

            }

            return str;
        }
        //cityselector 原型

    cityselector.prototype = {
        init: function() {
            var _this = this;

            var dataJson = _this.options.dataJson || null;

            var $levelOne = _this.$element.find('.city_level_1');

            var $levelTwo = _this.$element.find('.city_level_2');

            var $levelThree = _this.$element.find('.city_level_3');

            var $nameOne = $levelOne.find('.selector_name');

            var $nameTwo = $levelTwo.find('.selector_name');

            var $nameThree = $levelThree.find('.selector_name');

            var $ulOne = $levelOne.find('.selector_list');

            var $ulTwo = $levelTwo.find('.selector_list');

            var $ulThree = $levelThree.find('.selector_list');

            var checkedArr = [];

            var $name = [];

            var filterData = _this.options.filterData || null;

            if (!dataJson) {

                $.error("请检查城市JSON数据是否加载完毕。");

                return false;
            }


            //后台默认参数
            if (_this.options.defaultArea) {
                checkedArr = _this.defaultAreaSplit(_this.options.defaultArea) || [];
            }

            //checked默认参数 ,当value有值时，将覆盖后台的defaultArea
            _this.$element.find('.selector_name').each(function(index, el) {

                var _val = $(el).attr('data-checked');

                _val ? checkedArr[index] = _val : '';

            });

            if (checkedArr.length) {
                //默认 且 筛选

                (function(len) {

                    var $context, _data,$checked,_val;

                    for (var i = 0; i < len; i++) {

                        $context = _this.$element.find('>div').eq(i);

                        if (i === 0) {

                            _data = dataJson;

                        } else if (i === 1 && _this.selectedIndex[i - 1]) {

                            _data = dataJson[_this.selectedIndex[0]].city;

                            filterData = null;

                        } else if (i === 2 && _this.selectedIndex[i - 1]) {

                            _data = dataJson[_this.selectedIndex[0]]['city'][_this.selectedIndex[1]].area;

                            filterData = null;

                        } else {

                            _data = null;

                        }

                        $context.find('.selector_list').html(concatHtml(_data, filterData));

                        if (checkedArr[i]) {

                            $.each($context.find('li'),function(index,el){

                                if(checkedArr[i].indexOf(el.title) !==-1){

                                    var $el = $(el);

                                    _this.selectedIndex[i] = $(el).attr('data-id');

                                    $checked = $el.addClass('checked');

                                    $context.find('.selector_name').html($checked.attr('title'));

                                    _val = _this.options.value ? $checked.attr('data-value') : $checked.attr('title');

                                    $context.find('input').val(_val);
                                }
                            });

                        }
                    }

                }(_this.options.level));

            } else if (_this.options.filterData) {
                //筛选 且 无默认
                $levelOne.find('.selector_list').html(concatHtml(dataJson,filterData));

            } else {

                $levelOne.find('.selector_list').html(concatHtml(dataJson));

            }

            isIE6 ? $('.selector_list').find('li').on({
                mouseenter: function(event) {
                    $(this).addClass('hover');
                },
                mouseleave: function(event) {
                    $(this).removeClass('hover');
                }
            }) : false;

            _this.$element.find('>div').on('click focus', function(event) {
                var $this = $(this);
                $this.addClass('active');
                $('.selector_list').addClass('none');
                $this.find('.selector_list').removeClass('none');
                return false;
            }).on('blur', function() {
                var $this = $(this);
                _this.$element.find('.selector_list').addClass('none');
                return false;
            })


            $levelOne.on('click', 'li', function(event) {

                var $this = $(this);

                _this.selectedIndex[0] = $this.attr('data-id');

                _this.afterChose($this, _this);

                if (_this.options.level > 1) {

                    $levelTwo.find('input').val('');

                    $nameTwo.html($nameTwo.attr('data-name'));

                    $ulTwo.html(concatHtml(dataJson[_this.selectedIndex[0]].city));

                    _this.afterChose($ulTwo.find('li').eq(0), _this);
                }

                if (_this.options.level > 2) {

                    $levelThree.find('input').val('');

                    $nameThree.html($nameThree.attr('data-name'));

                    $ulThree.html('');
                }
                _this.options.onChangeOne($this);

                return false;
            });

            $levelTwo.on('click', 'li', function(event) {

                var $this = $(this);

                _this.selectedIndex[1] = $this.attr('data-id');

                _this.afterChose($this, _this);

                $nameThree.html($nameThree.attr('data-name'));

                if (_this.options.level > 2) {

                    $levelThree.find('input').val('');

                    $ulThree.html(concatHtml(dataJson[_this.selectedIndex[0]]['city'][_this.selectedIndex[1]].area));
                }

                _this.options.onChangeTwo($this);

                return false;
            });

            $levelThree.on('click', 'li', function(event) {

                var $this = $(this);

                _this.afterChose($this, _this);

                _this.options.onChangeThree($this);

                return false;
            });

            _this.$body.off('click.selector').on('click.selector', function(event) {
                $('.selector_list').addClass('none');
                _this.$element.children().removeClass('active');
            });

        },
        defaultAreaSplit: function(str) {
            var reg = /.+?(省|市|区|县)/g;
            return str.match(reg);
        },
        afterChose: function(target, context) {
            var _name = target.attr('title');
            var _parents = target.parents().eq(1);
            var _val = context.options.value ? target.attr('data-value') : _name;
            context.$element.find('ul').addClass('none');
            target.removeClass('none');
            target.addClass('checked').siblings('.checked').removeClass('checked');
            _parents.find('.selector_name').html(_name);
            _parents.find('input').val(_val);
            target.parents('.active').removeClass('active');

        }
    }

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new cityselector(this, options));
            }
        });
    };

}));
