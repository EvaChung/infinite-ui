/**
 * datePicker 组件
 *
 * *** options ***
 *
 * @param {Str}                                 display    显示的方式，默认是显示在底部    'bottom'/'modal'
 * @param {Boolean}                             shadow     点击遮罩隐藏组件 - 默认为false;若为false，则禁止点击遮罩隐藏组件
 * @param {Number}                              level      显示的层级，默认：1
 * @param {Number}                              rows       picker显示的行数，默认：4
 * @param {Boolean}                             Linkage    选择联动 - 若为false，则不联动
 * @param {Array}                               dataJson   渲染picker的json - 有规定的格式，可查看json文件。不联动默认遍历获取第一个json
 * @param {Number}                              height     每一行的高度
 * @param {Boolean}                             idDefault  匹配默认值 - 若为false，则不匹配
 * @param {Str}                                 splitStr   设置分割value的符号，与默认值和显示在input里的值有关
 * @param {Boolean}                             isshort    是否开启简写，默认是关闭的
 * @param {Element selector}                    header     picker头部html
 *@param {function}                             confirm: function() {}
 *@param {function}                             cancel: function() {}
 *
 *
 * *** 关于value值 ***
 *
 *$('.select-value').data('value1')：第一级的value值
 *$('.select-value').data('value2')：第二级的value值
 *
 *
 * *** methods ***
 *
 *  show                详情请查阅源码部分
 *  hide                详情请查阅源码部分
 *
 */
function __dealCssEvent(eventNameArr, callback) {
    var events = eventNameArr,
        i, dom = this; // jshint ignore:line

    function fireCallBack(e) {
        /*jshint validthis:true */
        if (e.target !== this) return;
        callback.call(this, e);
        for (i = 0; i < events.length; i++) {
            dom.off(events[i], fireCallBack);
        }
    }
    if (callback) {
        for (i = 0; i < events.length; i++) {
            dom.on(events[i], fireCallBack);
        }
    }
}

//动画结束事件兼容
$.fn.animationEnd = function(callback) {
    __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
    return this;
};
$.fn.transitionEnd = function(callback) {
    __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
    return this;
};


module.exports = {
    datePicker:function(options){
        var maxTime = new Date();
        var minTime = new Date(maxTime);
        minTime.setFullYear(maxTime.getFullYear()- 50);
        var datePickerDefaults = {
            display: 'bottom',
            shadow: false,
            level: 1,
            rows: 4,
            Linkage: false,
            dataJson: '',
            height: 36,
            idDefault: false,
            splitStr: ' ',
            splitStr2: ' ',
            isshort : false,
            dateConfig: {
                open: false,
                maxTime: maxTime,
                minTime: minTime,
                currentTime: null,
                dateLevel: 3
            },
            header: '<div class="datePicker-header"></div>',
            footer: '<div class="datePicker-footer"><div href="javascript:;" class="datePicker-confirm">确定</div><div href="javascript:;" class="datePicker-cancel">取消</div></div>',
            confirm: function() {},
            cancel: function() {},
            touchend: function(){}
        };

        var moveStartLock;

        var $body = $('body');

        var datePickerTp = '<div class="datePicker hide"><div class="datePicker-mask hide"></div></div>';

        // 获取位置
        function getTouches(event) {
            if (event.touches !== undefined) {
                return {
                    x : event.touches[0].pageX,
                    y : event.touches[0].pageY
                };
            }

            if (event.touches === undefined) {
                if (event.pageX !== undefined) {
                    return {
                        x : event.pageX,
                        y : event.pageY
                    };
                }
                if (event.pageX === undefined) {
                    return {
                        x : event.clientX,
                        y : event.clientY
                    };
                }
            }
        }

        /**
         * [description]
         * @return {[Array]} [将初始数据转换为需要的格式]
         */
        function convertData(data, parentvalue){
            var arr = [];

            $.each(data, function(index, val) {
                if (val.parentvalue === parentvalue ) {
                    arr.push(val);
                    val.child = convertData(data, val.value);
                }
            });
            return  arr;
        }


        /**
         *  滑动结束执行函数
         *  ele:对应的list==>ul
         *  如果是联动，则更新相应的list html
         */
        function touchEndFn(ele, val, init) {
            var self = this;
            var result = setActiveItem.call(this,ele, val);
            var levelIndex = result.levelIndex; // 当前滑动的ul 索引
            var index = result.index;
            changeTime(400, ele);

            moveStartLock=false;


            // 联动
           if (this.options.Linkage) {
                // 确定下级是哪一级
                this.selected = this.selected.slice(0, levelIndex);
                // 本级选择的索引
                this.selected.push(index);
                refreshItem.call(this);
            }

            clearTimeout(this.datePickerTouchEndFn);
            this.datePickerTouchEndFn = setTimeout(function(){
                var str = joinSelected.call(self);
                var $head = self.$datePicker.find('.datePicker-header');

                $head.text(str);
                self.options.touchend.call(self, $head, str);

                // 如果是时间需要隐藏多余的天数
                if (levelIndex < 2 || init) {
                    correctDate.call(self, str);
                }
            }, 0);
        }

        function correctDate(str){
            var options = this.options;

            if (options.dateConfig.open) {
                var splitStr = typeof options.splitStr === 'string' ? options.splitStr : options.splitStr2;
                var arr = str.split(splitStr).slice(0,2).join('/');
                var over = (new Date(arr + '/31')).getDate();
                var length = 31 - (over !== 31 ? over : 0) - 1;
                var $ul = this.$datePicker.find('ul:eq(2)');
                var $li = $ul.find('>li').removeClass('hide');
                var $active = $li.filter('.active');
                var index = $active.index();

                $li.filter(':gt('+length+')').addClass('hide');

                if (index > length) {
                    touchEndFn.call(this, $ul, length);
                }
            }
        }

        /**
         *  匹配默认值
         */
        function matchSelectedData(value) {
            var self=this;
            var inputVal = value.split(this.options.splitStr);
            var data = this.options.dataJson;
            var $ul = self.$datePicker.find('ul');
            var str = '';

            $.each(inputVal, function(index, val) {
                try{
                    if (index === 0) {
                        str += 'data';
                        str += '[' + setSelectedData.call(self, data, val, $ul.eq(index)) + '].child';
                    }else{
                        str += '[' + setSelectedData.call(self, eval(str), val, $ul.eq(index)) + '].child';
                    }
                }catch(e){}
            });

            // touchEndFn.call(self, $ul, 0);
            // var data = eval('this.options.dataJson'+str);
        }

        // 显示选中的选项
        function setSelectedData(data, val, $el){
            var self = this;
            var idx = 0;
            $.each(data, function(index2, val2) {

                if (val == val2.value) {
                    touchEndFn.call(self, $el, index2, true);
                    idx = index2;
                    return false;
                }
            });
            return idx;
        }

        /**
         *  滑动结束，设置transtion值，返回当前选中的li index和元素
         *  obj:滑动的元素
         *  val:可有可没有。可传入data-value或不传
         */
        function setActiveItem(obj, val) {
            var result;
            // 获取初始第几个值
            var y = Math.round((getTranslateY(obj) / this.options.height));
            //得到选中的index
            var index = typeof(val) === 'number' ? obj.find('li').index(obj.find('li[data-id="' + val + '"]')) : this.middleRowIndex - y;

            var y2 = -this.options.height * (index - this.middleRowIndex);

            setTransitionY(obj, y2);
            //添加选中样式
            obj.find('li').eq(index).addClass('active').siblings('li').removeClass('active');

            result = {
               // target: obj.find('li').eq(index),
                index: index,
                levelIndex: this.$datePicker.find('ul').index(obj),
            };
            return result;
        }

        /**
         *  联动的情况下
         */
        function refreshItem() {
            //兼容不存在child
            //var $itemTwo=this.$datePicker.find('.datePicker-list ul').eq(level);
            var selected = this.selected;
            var str = '';

            $.each(selected, function(index, val) {
                 if (index > 0) {
                    str += '.child['+val+']';
                 }else{
                    str += '['+val+']';
                 }
            });

            try{
                var data = eval('this.options.dataJson'+str);

                if (data) {
                    data = data.child;

                    if (data && data.length) {
                        var $ul = this.$datePicker.find('ul').eq(selected.length);
                        var html = concatHtmlItem.call(this, data);
                        $ul.html(html);
                        touchEndFn.call(this, $ul, 0);
                    }
                }
            }catch(e){}
        }

        /**
         *  传入json拼接html，只有li级别
         */
        function concatHtmlItem(data) {
            var str = '';
            var self=this;
            $.each(data, function(index, val) {
                var name = self.options.isshort ? val.shortName : val.name;
                str += '<li data-value="' + val.value + '" data-id="' + index + '">' + name + '</li>';
            });
            return str;
        }

        /**
         *  传入li html 拼接ul
         */
        function concatHtmlList(data, j) {
            var html = '';
            var itemStr = '';
            var childStr = '';

            j = j ? j : 0;

            for (var i = 0; i < this.options.level; i++) {
                if (i > 0) {

                    itemStr = '';
                    childStr += 'child';

                    if (data[0] && data[0][childStr] && data[0][childStr].length) {
                        html += concatHtmlList.call(this, data[0][childStr], i);
                    }
                }else{
                    itemStr = concatHtmlItem.call(this,data);
                    html += '<div class="datePicker-list"><ul data-value="'+j+'">' + itemStr + '</ul></div>';
                }
            }
            return html;
        }

        /**
         *  设置运动时间
         */
        function changeTime(times, obj) {
            obj.css({
                '-webkit-transition-duration': times + 'ms',
                'transition-duration': times + 'ms'
            });
        }

        /**
         *  touches兼容
         */
        function fnTouches(e) {
            if (!e.touches) {
                e.touches = e.originalEvent.touches;
            }
        }

        /**
         *  设置translateY
         */
        function setTransitionY(obj, y) {
            obj.css({
                "-webkit-transform": 'translateY(' + y + 'px)',
                transform: 'translateY(' + y + 'px)'
            });
        }

        /**
         *  获取translateY
         */
        function getTranslateY(obj) {
            var transZRegex = /\.*translateY\((.*)px\)/i;
            var result;
            if (obj[0].style.WebkitTransform) {
                result = parseInt(transZRegex.exec(obj[0].style.WebkitTransform)[1]);
            } else if (obj[0].style.transform) {
                result = parseInt(transZRegex.exec(obj[0].style.transforms)[1]);
            }
            return result;
        }

        function setDateData(){
            var options = this.options;
            var config = options.dateConfig;
            var maxTime = config.maxTime;
            var minTime = config.minTime;
            var json = [];
            var maxYear = maxTime.getFullYear();
            var minYear = minTime.getFullYear();
            var c60 = true;
            var temp, temp2;
            var dateLevel = config.dateLevel;

            function setTime(n){
                var arr = [];
                var n2 = -1;

                // 超过级别跳出递归
                if (dateLevel === 2 && n === 31 ||
                    dateLevel === 3 && n === 24 ||
                    dateLevel === 4 && n === 60 ||
                    dateLevel === 5 && n === 60 && !c60 ) {
                    return;
                }

                // 递归输出json
                if (n < 0) {
                    return;
                }else if(n === 12){
                    n2 = 31;
                }else if(n === 31){
                    n2 = 24;
                }else if(n === 24){
                    n2 = 60;
                }else if(n === 60 && c60){
                    c60 = false;
                    n2 = 60;
                }


                var i = 0;
                var j = i;

                if (n === 12 || n === 31) {
                    i++;
                }else{
                    n--;
                }

                // “child”都是引用关系
                for (i; i <= n; i++) {
                    if (j === 0 || j === 1) {
                        j = -1;
                        temp2 = {
                            name: i > 9 ? i : '0' + i,
                            value: i > 9 ? i : '0' + i,
                            child: setTime(n2)
                        };
                        arr.push(temp2);
                    }else{
                        arr.push({
                            name: i > 9 ? i : '0' + i,
                            value: i > 9 ? i : '0' + i,
                            child: temp2.child
                        });
                    }
                }
                return arr;
            }

            for (var i = minYear; i <= maxYear; i++) {
                if (i !== minYear) {
                    json.push({
                        name: i,
                        value: i,
                        child: temp.child
                    });
                }else{
                    temp = {
                        name: i,
                        value: i,
                        child: dateLevel > 1 ? setTime(12) : ''
                    };
                    json.push(temp);
                }
            }
            options.dataJson = json;
        }

        function joinSelected(){
            var self = this;
            var str = '';
            var $listUl = self.$datePicker.find('.datePicker-list ul');

            $.each($listUl, function(index, ele) {
                var $active = $(ele).find('.active');
                var splitStr = index === 0 ? '' : self.options.splitStr;
                if (typeof splitStr !== 'string') {
                    splitStr = self.options.splitStr2;
                }
                if ($active.length > 0) {
                    index = index + 1;
                    str += splitStr + $active.text();
                }
            });
            return str;
        }

        function gt10(num){
            return num > 9 ? num : '0' + num;
        }

        function DatePicker(ele,options){
            if (!ele.length) {
                return false;
            }
            this.container = ele;
            this.$datePicker = $(datePickerTp).appendTo('body');
            this.mask = this.$datePicker.find('.datePicker-mask');
            this.options = $.extend(true, {}, datePickerDefaults, options);

            if (this.options.dateConfig.open) {
                setDateData.call(this);
            }else{
                this.options.dataJson = convertData(this.options.dataJson, 0);
            }

            this.init();
            this.event();
            this.selected = [];
            this.dateInit = {};
        }

        DatePicker.prototype={
            //初始化DatePicker
            init:function(ele,options){

                /**
                 * 根据行数计算居中的位置
                 */
                this.middleRowIndex = parseInt(this.options.rows / 2.5);
                //展示方式
                this.disy = this.options.display === 'bottom' ? 'datePicker-bottom down' : 'datePicker-modal';
            },
            //初始化$datePicker,根据json渲染html结构,添加遮罩，边框等
            render:function(){
                /**
                 *  初始化$datePicker,根据json渲染html结构
                 *  添加遮罩，边框等
                 */
                var listStr;
                var jsonData = [];
                var mainStr;
                var self=this;
                /**
                 * 添加 datePicker-main元素
                 */



                jsonData = self.options.dataJson;

                listStr = concatHtmlList.call(self,jsonData);

                mainStr = '<div class="datePicker-main '+ self.disy +'" data-pickerId="' + self.pickerId + '">' + self.options.header + '<div class="datePicker-content">' + listStr + '</div>' + self.options.footer + '</div>';
                self.$datePicker.append(mainStr);
                /**
                 * 设置变量
                 */
                self.$datePickerMain = self.$datePicker.find('.datePicker-main');
                //元素集合
                var $content=self.$datePickerMain.find('.datePicker-content');
                var $list=self.$datePickerMain.find('.datePicker-list');
                var $listUl=$list.find('ul');
                //var $itemOne=$listUl.eq(0);
                //var $itemTwo=self.options.level === 2?$listUl.eq(1):false;
                //设置多列宽度
                if(self.options.level > 1){
                    $list.width(100/self.options.level + '%');
                }

                //添加选中的边框
                $list.append('<div class="datePicker-active-box"></div>');
                $list.find('.datePicker-active-box').height(self.options.height);
                /**
                 * 设置选中的边框位置
                 */
                var activeBoxMarginTop = self.options.rows % 2 === 0 ? -self.options.height - 2 + 'px' : -self.options.height * 0.5 - 2 + 'px';

                $content.find('.datePicker-active-box').css({
                    'margin-top': activeBoxMarginTop
                });
                /**
                 * 设置内容高度
                 */
                $content.height(self.options.height * self.options.rows);
                $list.height(self.options.height * self.options.rows);

            },
            showPicker:function(){
                var self=this;
                var options = self.options;
                var dateConfig = options.dateConfig;

                // 渲染 DOM
                self.render();


                var $list=self.$datePicker.find('.datePicker-list');
                self.container.focus();
                self.container.blur();
                self.$datePicker.removeClass('hide');
                self.mask.removeClass('hide');

                var $ul =  $list.find('ul');

                clearTimeout(self.timer);
                self.timer=setTimeout(function() {
                    self.$datePickerMain.removeClass('down');
                }, 10);

                // 初始 y 为0
                setTransitionY($ul, 0);

                var value = this.container.val();

                if (!value && dateConfig.open && dateConfig.currentTime) {
                    var ct = new Date(dateConfig.currentTime);
                    var splitStr = options.splitStr;

                    splitStr = typeof splitStr === 'string' ? splitStr : options.splitStr2;
                    value = ct.getFullYear() + splitStr;
                    value += gt10(ct.getMonth() + 1) + splitStr;
                    value += gt10(ct.getDate()) + splitStr;
                    value += gt10(ct.getHours()) + splitStr;
                    value += gt10(ct.getMinutes()) + splitStr;
                    value += gt10(ct.getSeconds());

                    value = value.indexOf('NaN') > -1 ? '' : value;
                }

                if (value) {
                    //touchEndFn.call(this, $ul, 0);
                    matchSelectedData.call(self, value);
                }else{
                    if (options.Linkage) {
                        touchEndFn.call(this, $ul.eq(0), 0);
                    }else{
                        $ul.each(function(index, el) {
                            touchEndFn.call(self, $(el), 0);
                        });
                    }
                }

            },
            hidePicker:function(callback, str){
                var self=this;
                self.mask.addClass('hide');

                if(self.options.display === 'bottom'){
                    self.$datePicker.find('.datePicker-main').addClass('down').transitionEnd(function() {
                        self.$datePicker.addClass('hide');
                        self.$datePicker.find('.datePicker-main').remove();
                        if (typeof(callback) === 'function') {
                            callback.call(self, str);
                        }
                    });
                    return false;
                }

                self.$datePicker.addClass('hide');
                callback.call(self, str);
                self.$datePicker.find('.datePicker-main').remove();
            },
            confirm:function(){
                var self=this;
                var str = joinSelected.call(self);
                self.container.val(str);
                self.hidePicker(self.options.confirm, str);

            },
            cancel:function(){
                var self=this;
                self.hidePicker(self.options.cancel);
            },
             /**
             *  事件
             *  取消，确定，点击遮罩，列表滑动事件
             */
            event : function() {
                /**
                 * 点击打开选择
                 */
                var self = this;

                this.container.on('click.container', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.showPicker();
                });

                //点击确定
                this.$datePicker.on('click.confirm','.datePicker-confirm', function(event) {
                    event.preventDefault();
                    self.confirm();
                });

                //点击取消
                this.$datePicker.on('click.cancel','.datePicker-cancel', function(event) {
                    event.preventDefault();
                    self.cancel();
                });

                //点击遮罩取消
                this.$datePicker.on('click.mask','.datePicker-mask', function(e) {
                    e.preventDefault();
                    if(self.options.shadow){
                        self.cancel();
                    }
                });

                // 阻止默认行为
                this.$datePicker.on('touchmove.mask', function(event) {
                    event.preventDefault();
                });

                //遍历下拉列表
                var startY;
                var curY;
                var moveY;

                // 开始拖动
                this.$datePicker.on('touchstart.list mousedown.list','.datePicker-list', function(event) {
                    fnTouches(event);

                    var $this = $(this).find('ul');

                    var tranY = getTranslateY($this);

                    startY = getTouches(event).y - tranY;

                    changeTime(0, $this);

                    moveStartLock=true;
                });

                // 拖动中
                this.$datePicker.on('touchmove.list mousemove.list', '.datePicker-list',function(event) {
                    event.preventDefault();
                    if(!moveStartLock){
                        return false;
                    }

                    fnTouches(event);

                    var translate;

                    var $this = $(this).find('ul');

                    var listHeight = $this.height();

                    var itemHeight = self.options.height * self.options.rows;

                    var transMaxY = itemHeight - listHeight - parseInt(self.options.rows / 2) * self.options.height;

                    var transMinY = self.middleRowIndex * self.options.height;

                    curY = getTouches(event).y;

                    moveY = curY - startY;

                    translate = Math.round(moveY);
                    //过了
                    translate = translate > transMinY ? transMinY : translate;
                    translate = translate < transMaxY ? transMaxY : translate;
                    // console.info(self.options.rows)
                    setTransitionY($this, translate);


                    //兼容部分手机有时候没有触发touchend
                    clearTimeout(self.timeTouchend);
                    self.timeTouchend = setTimeout(function() {
                        touchEndFn.call(self,$this);
                    }, 100);
                });
            }
        };

        return this.each(function(index, el) {
            new DatePicker($(el), options);
        });
    }
}

