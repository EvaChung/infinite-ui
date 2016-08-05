/**
 * mPicker 组件
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

$.fn.IUI({
    fresh: function(options) {
        var freshDefaults ={
            diretion: true,
            startTouch: function() {},
            afterFresh:function(){}
        };
        function Fresh(ele,options){
            this.container=ele;
            this.options=$.extend(true,freshDefaults,options );
            this.event();
        }
        Fresh.prototype.event=function(){
            var _this=this;
            var startY,curY,moveY;
            //上拉刷新是禁止页面滚动
            document.body.addEventListener('touchmove', function(event) {
                if (_this.lock) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }, false);

            this.container.on({

                touchstart: function(e) {

                    fnTouches(e);

                    startY = e.touches[0].pageY;

                    changeTime.call(_this,0);

                    _this.options.startTouch.call(_this);

                },
                touchmove: function(e) {

                    fnTouches(e);

                    var _translate;

                    curY = e.touches[0].pageY;

                    if (_this.options.diretion) {
                        freshBottom.call(_this,startY,curY,moveY);
                        //freshBottom();
                    } else {
                        freshTop.call(_this,startY,curY,moveY);
                    }

                },

                touchend: function(e) {

                    if (_this.lock) {

                        changeTime.call(_this,300);

                        _translateY(_this.container, 0);

                        _this.lock = 0;

                        _this.options.afterFresh.call(_this);
                    }
                }
            });
        };
        function freshBottom(startY,curY,moveY){
            var $this=this.container;
            var height=$this.height();
            var childHeight=$this.find('[role="freshList"]').height();
            //向上
            if (curY > startY) {

                this.lock = 0;
            }

            //向下且滚动到底部了
            if (curY < startY && $this.scrollTop() + height >= childHeight) {

                if (!this.lock) {

                    this.lock = 1;
                }

                moveY = curY - startY;

                _translate = Math.round(moveY * 0.5);

                if (moveY < -10) {

                    _translate = Math.round((moveY * 0.5 + 10) * 0.3 - 10);

                }

                _translateY($this, _translate);
            }
        }

        function freshTop(startY,curY,moveY){
            var $this=this.container;
            //向下
            if (curY < startY) {

                this.lock = 0;
            }

            //向上且到顶部
            if (curY > startY && $this.scrollTop() <= 0) {

                if (!this.lock) {

                    this.lock = 1;
                }

                moveY = curY - startY;

                _translate = Math.round(moveY * 0.5);

                if (moveY > 10) {

                    _translate = Math.round((moveY * 0.5 + 10) * 0.3 - 10);

                }

                _translateY($this, _translate);
            }
        }
        // touches
        function fnTouches(e) {

            if (!e.touches) {
                e.touches = e.originalEvent.touches;
            }
        }

        function _translateY(obj, y) {
            obj.css({
                "-webkit-transform": 'translateY(' + y + 'px)',
                transform: 'translateY(' + y + 'px)'
            });
        }

        function changeTime(times) {
            this.container.css({
                '-webkit-transition-duration': times + 'ms',
                'transition-duration': times + 'ms'
            });
        }
        return new Fresh(this, options);
    }
});