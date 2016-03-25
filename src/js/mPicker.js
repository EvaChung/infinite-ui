/**
 * validate 组件
 *
 * *** options ***
 *
 * @param {Number}                              level      显示的层级，默认：1
 * @param {Number}                              rows       picker显示的行数，默认：4
 * @param {Boolean}                             Linkage    选择联动 - 若为false，则不联动
 * @param {Array}                               dataJson   渲染picker的json - 有规定的格式，可查看json文件。不联动默认遍历获取第一个json
 * @param {Number}                              height     每一行的高度
 * @param {Boolean}                             idDefault  匹配默认值 - 若为false，则不匹配
 * @param {Str}                                 splitStr   设置分割value的符号，与默认值和显示在input里的值有关
 * @param {Element selector}                    header     picker头部html
 *@param {function}                             confirm: function() {}
 *@param {function}                             cancel: function() {}
 *
 * *** 关于json格式 ***
 *jsonChange.js是针对campaign里的json做的格式转换
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
 *  updateData          详情请查阅源码部分
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
$.fn.IUI({
    mPicker:function(options){
        var defaults={
            level: 1,
            rows: 4,
            Linkage: false,
            dataJson: '',
            height: 40,
            idDefault: false,
            splitStr: ' ',
            header: '<div class="mPicker-header"><a href="javascript:;" class="mPicker-cancel">取消</a><a href="javascript:;" class="mPicker-confirm">确定</a></div>',
            confirm: function() {},
            cancel: function() {}
        };
        var self = this;

        self.$container = $(this);

        self.$container.data('mPicker', self);

        self.options = $.extend({}, defaults, options);

        var ulWidth = ['100%', '50%'];

        var $body = $('body');
        /**
         * 阻止默认滚动
         */
        $body.on('touchmove', function(event) {
            if (self.lock) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
        /**
         * 禁止滚动－－防止滚动选择时页面滚动
         */
        $body.on({
            touchstart: function(event) {
                event.preventDefault();
                self.lock = 1;
            },
            touchmove: function(event) {
                event.preventDefault();
                //兼容部分手机有时候没有触发touchend
                clearTimeout(self.timeTouchend);
                self.timeTouchend = setTimeout(function() {
                    self.lock = 0;
                }, 100);
            },
            touchend: function(event) {
                event.preventDefault();
                self.lock = 0;
            }
        }, '.mPicker-main');
        /**
        * 点击打开选择
        */
        self.$container.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.render();
            self.$container.focus();
            self.$container.blur();
            self.$main.removeClass('hide');
            self.$mask.removeClass('hide');

            clearTimeout($body.data('mPicker-timer'));
            $body.data('mPicker-timer',setTimeout(function(){
                self.$main.removeClass('down');
            },10));
             /**
             * 显示默认值(判断点击确定选择后不再获取默认值)
             */
            if (!self.noFirst && self.options.idDefault) {
                matchDefaultData();
            }
             /**
             * 获取input的data-id显示选中的元素
             */
            var id=[];
            self.$list.each(function(index, ele) {
                setTransitionY(self.$container, 0);
                var dataVal = self.$container.data('id' + (index + 1)) ? self.$container.data('id' + (index + 1)) : 0;
                id.push(dataVal);
            });

            //获得选中的元素
            setItemMultiple(id);

            self.event();
        });

        /**
         *  初始化mpicker,根据json渲染html结构
         *  添加遮罩，边框等
         */
        self.render=function(){
            var listStr;
            var jsonData = [];
            var mainStr;
            /**
             * 根据行数计算居中的位置
             */
            self.$container.data('middleRowIndex',parseInt(self.options.rows / 2.5));
            /**
             * 添加遮罩
             */
            if ($('.mPicker-mask').length === 0) {
                $body.append('<div class="mPicker-mask hide"></div>');
            }

            self.$mask=$('.mPicker-mask');
             /**
             * 添加 mPicker-main元素
             */
            jsonData.push(self.options.dataJson);
            if (self.options.level === 2) {
                var childStr=getChildJson(self.options.dataJson[0]);
                jsonData.push(childStr);
            }
            listStr = concatHtmlList(jsonData);
            mainStr = '<div class="mPicker-main down" data-pickerId="'+self.pickerId+'">' + self.options.header + '<div class="mPicker-content">' + listStr + '</div></div>';
            $body.append(mainStr);
            /**
             * 设置变量
             */
            self.$main = $body.find('.mPicker-main');
            self.$content = self.$main.find('.mPicker-content');
            self.$list = self.$main.find('.mPicker-list');
            self.$list.width(ulWidth[self.options.level - 1]);
            self.$itemOne = self.$list.eq(0);
            if (self.options.level === 2) {
                self.$itemTwo = self.$list.eq(1);
            }
            /**
             * 添加选中的边框
             */
            self.$content.append('<div class="mPicker-active-box"></div>');
            self.$content.find('.mPicker-active-box').height(self.options.height);
             /**
             * 设置选中的边框位置
             */
            var activeBoxMarginTop = self.options.rows % 2 === 0 ? -self.options.height + 'px' : -self.options.height * 0.5 + 'px';

            self.$content.find('.mPicker-active-box').css({
                'margin-top': activeBoxMarginTop
            });
            /**
             * 设置内容高度
             */
            self.$content.height(self.options.height * self.options.rows);
        };

        /**
         *  事件
         *  取消，确定，点击遮罩，列表滑动事件
         */
        self.event=function(){
            //点击确定
            self.$main.find('.mPicker-confirm').on('touchstart.confirm click.confirm',function(e) {
                e.preventDefault();
                var str = '';
                self.noFirst = true;
                $.each(self.$list, function(index, ele) {
                    var $active = $(ele).find('.active');
                    var splitStr = index === 0 ? '' : self.options.splitStr;
                    if ($active.length > 0) {
                        index = index + 1;
                        self.$container.data('value' + index, $active.data('value'));
                        self.$container.data('id' + index, $active.data('id'));
                        str += splitStr + $active.text();
                    }
                });
                self.$container.val(str);
                self.deffered.hide(self.options.confirm);
            });

            //点击取消
            self.$main.find('.mPicker-cancel').on('touchstart.cancel click.cancel', function(e) {
                e.preventDefault();
                self.deffered.hide(self.options.cancel);
            });

            //点击遮罩取消
            self.$mask.off('touchstart.mask click.mask').on('touchstart.mask click.mask',function(e) {
                e.preventDefault();
                self.deffered.hide(self.options.cancel);
            });

            //遍历下拉列表
            var startY;
            var curY;
            var moveY;

            self.$list.on('touchstart.list', function(event) {
                fnTouches(event);

                var $this = $(this);

                var tranY = getTranslateY($this);

                startY = event.touches[0].pageY - tranY;

                 changeTime(0, $this);
            });

            self.$list.on('touchmove.list', function(event) {
                event.preventDefault();

                fnTouches(event);

                var translate;

                var $this=$(this);

                var listHeight =$this.height();

                var itemHeight=self.options.height* self.options.rows;

                var transMaxY = itemHeight - listHeight - parseInt(self.options.rows / 2) * self.options.height;

                var transMinY = self.$container.data('middleRowIndex') * self.options.height;

                curY = event.touches[0].pageY;

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
                    touchEndFn($this);
                }, 100);
            });

            self.$list.on('touchend.list', function(event) {
                event.preventDefault();
                var $this=$(this);
                touchEndFn($this);
            });
        };

        /**
         *  滑动结束执行函数
         *  ele:对应的list==>ul
         *  如果是联动，则更新相应的list html
         */
        function touchEndFn(ele) {
            clearTimeout(self.timeTouchend);
            var result = setActiveItem(ele);

            var resultId = result.target.data('id');

            var itemIndex=self.$list.index(ele);
            // self.lock=0;
            //点第一个联动
            if (self.options.Linkage && itemIndex === 0) {
                refreshItemTwo(resultId);
            }
            //回调函数
            // callbackFnName[itemIndex].call(ele, result);

            changeTime(200, ele);
        }

        /**
         *  第一次打开匹配默认值
         */
        function matchDefaultData(){
            var inputVal = self.$container.val().split(self.options.splitStr);
            var defaultId = [];
            var defaultValue = [];
            var dataLevel2;
            var hasLevel2;
             //遍历获取id
            var nameEach=function(data, index) {
                $.each(data, function(key, val) {
                    if (val.name == inputVal[index]) {
                        defaultId[index] = key;
                        defaultValue[index] = val.value;
                        self.$container.data('value' + (index + 1), defaultValue[index]);
                        self.$container.data('id' + (index + 1), defaultId[index]);
                        return false;
                    }
                });
            };
            if (typeof(inputVal) !== 'object' || !inputVal.length || !self.$main) {
                return;
            }

            //将name值默认匹配成id，一旦匹配就跳出循环，多个匹配取第一个
            //匹配一级
            nameEach(self.options.dataJson, 0);
            //匹配二级
            dataLevel2=self.options.Linkage?self.options.dataJson[defaultId[0]]:self.options.dataJson[0];

            if (self.options.Linkage&& self.options.level === 2 && defaultId[0] && inputVal.length > 1) {
                hasLevel2=1;
            }

            if (!self.options.Linkage && self.options.level === 2 && inputVal.length > 1) {
                hasLevel2=1;
            }

            if(hasLevel2){
                dataLevel2 = getChildJson(dataLevel2);
                nameEach(dataLevel2, 1);
            }

        }
        /**
         *  滑动结束，设置transtion值，返回当前选中的li index和元素
         *  obj:滑动的元素
         *  val:可有可没有。可传入data-id或不传
         */
        function setActiveItem(obj, val) {
            var result;
            var y = Math.round((getTranslateY(obj) / self.options.height));
            //得到选中的index
            var index = typeof(val) === 'number' ? obj.find('li').index(obj.find('li[data-id="' + val + '"]')) : self.$container.data('middleRowIndex') - y;

            var y2 = -self.options.height * (index - self.$container.data('middleRowIndex'));

            setTransitionY(obj, y2);
            //添加选中样式
            obj.find('li').eq(index).addClass('active').siblings('li').removeClass('active');

            result = {
                target: obj.find('li').eq(index),
                index: index
            };
            return result;
        }
         /**
         *  传入第一级index，更新第二级html（联动的情况下）
         */
        function refreshItemTwo(index) {
            //兼容不存在child
            var data = getChildJson(self.options.dataJson[index]);
            if (self.options.level === 2) {
                var str = concatHtmlItem(data);
                self.$itemTwo.html(str);
                setActiveItem(self.$itemTwo, 0);
            }
        }
         /**
         *  传入数组，设置多级html
         *  index:数组
         */
        function setItemMultiple(index) {
            var index1 = index[0] ? index[0] : 0;
            var index2 = index[1] ? index[1] : 0;

            if(self.options.Linkage){
                refreshItemTwo(index1);
            }

            setActiveItem(self.$itemOne, index1);

            if (self.options.level === 2) {
                setActiveItem(self.$itemTwo, index2);
            }
        }

        /**
         *  传入json,判断返回json,child
         *  兼容不存在child报错的情况
         */
        function getChildJson(data) {
            if(!data){
                return [];
            }
            var result=({}).hasOwnProperty.call(data,'child')?data.child:[];
            return result;
        }
         /**
         *  传入json拼接html，只有li级别
         */
        function concatHtmlItem(data){
            var str = '';
            $.each(data, function(index, val) {
                str += '<li data-value="' + val.value + '" data-id="' + index + '">' + val.name + '</li>';
            });
            return str;
        }
        /**
         *  传入li html 拼接ul
         */
        function concatHtmlList(data){
            var html='';
            for (var i = 0; i < data.length; i++) {
                var itemStr=concatHtmlItem(data[i]);
                html+='<ul class="mPicker-list">' + itemStr + '</ul>';
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
        /**
         * 暴露的接口：显示，隐藏，更新数据
         */
        self.deffered = {
            container:self.$container,
            show: function() {
                self.$container.trigger('touchstart');
            },
            hide: function(callback) {
                self.$mask.addClass('hide');
                self.$main.addClass('down').transitionEnd(function(){
                    self.$main.remove();
                    if(typeof(callback)==='function'){
                        callback.call(this);
                    }
                });
            },
            updateData: function(data) {
                if (!data.length) {
                    return;
                }
                self.noFirst = false;
                for (var i = 0; i < self.options.level; i++) {
                    self.$container.data('id' + (i + 1), 0);
                    self.$container.data('value' + (i + 1), '');
                }
                self.options.dataJson = data;
                self.$main.remove();
            }
        };

        return self.deffered;
    }
});