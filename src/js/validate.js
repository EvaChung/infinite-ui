/**
 * validate 组件
 *
 * *** options ***
 *
 * @param {Boolean}                      ajaxValidate        启动ajax验证
 * @param {Element selector}             globalMessage       全局提示id，若为false，则逐项提示
 * @param {Element selector}             errorClass          验证信息 - 错误 class
 * @param {Element selector}             infoClass           验证信息 - 提示 class  若为false，则无info提示
 * @param {Element selector}             successClass        验证信息 - 成功 class  若为false，则无info提示
 * @param {Array}                        collections         验证规则配置
 * @param {Object}                       strategy            新增验证规则
 *
 *
 * collections 语法：[{验证项},{验证项},{验证项},{验证项}]
 *
 * 验证项 语法：
 *
    {
        required: 'password',                                 // 对应 input[data-required]
        context: '.form-group',                               // data-required的执行上下文
        infoMsg: '请输入您的密码，字符长度为3-16位',             // 提示信息
        matches: {                                           // 组合验证
            isNonEmpty: {                                    // 对应 strategy 中存在的验证方法
                errMsg: '密码不能为空'                        //  验证错误的返回信息
            },
            between: {
                errMsg: '密码长度为6-16位',
                range:[6,16]                                //可自定义字段
            }
        }
    }

 *
 *
 * *** events ***
 *
 * $('any element').on('validate.focus',function(event,matches){});
 *
 * $('any element').on('validate.blur',function(event,matches){});
 *
 *
 *
 * *** methods ***
 *
 *  batch           详情请查阅源码部分
 *  message         详情请查阅源码部分
 *  verify          详情请查阅源码部分
 *
 */
$.fn.IUI({
    validate: function(options) {
        /**
         *
         * GLOB_STRATEGY    默认验证策略集合
         *
         */
        var GLOB_STRATEGY = {
            isNonEmpty: function(params) {
                var $target = this.self;
                if ($target[0].value.length === 0) {
                    return false;
                }
            },
            minLength: function(params) {
                //大于
                if (this.self[0].value.length < params.minLength) {
                    return false;
                }
            },
            maxLength: function(params) {
                //小于
                if (this.self[0].value.length < params.maxLength) {
                    return errorMsg;
                }
            },
            isMobile: function(params) {
                //是否为手机号码
                if (!/(^1[3|5|8][0-9]{9}$)/.test(this.self[0].value)) {
                    return false;
                }
            },
            isEmail: function(params) {
                //是否为邮箱
                if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.self[0].value)) {
                    return false;
                }
            },
            between: function(params) {
                var $target = this.self;
                var length = this.self[0].value.length;
                var min = params.range[0];
                var max = params.range[1];
                if (length < min || length > max) {
                    return false;
                }

            },
            //纯英文
            onlyEn: function(params) {
                if (!/^[A-Za-z]+$/.test(this.self[0].value)) {
                    return false;
                }
            },
            //纯中文
            onlyZh: function(params) {
                if (!/^[\u4e00-\u9fa5]+$/.test(this.self[0].value)) {
                    return false;
                }
            },
            //非整数
            notInt: function(params) {
                if (/^[0-9]*$/.test(this.self[0].value)) {
                    return false;
                }
            },
            //数字包含小数
            onlyNum: function(params) {
                if (!/^[0-9]+([.][0-9]+){0,1}$/.test(value)) {
                    return false;
                }
            },
            //整数
            onlyInt: function(params) {
                if (!/^[0-9]*$/.test(value)) {
                    return false;
                }
            },
            //至少选中一项 radio || checkbox
            isChecked: function(params) {
                var result = void(0);
                this.self.each(function(index, el) {
                    result = el.checked;
                    return result ? false : true;
                });
                return result ? void(0) : false;
            },
            //昵称
            isNickname: function(params) {
                if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,20}$/i.test(this.self[0].value)) {
                    return false;
                }
            }
        };
        var defaults = {
            ajaxValidate: false,
            globalMessage: false,
            errorClass: '.validate-error',
            infoClass: '.validate-info',
            successClass: '.validate-success',
            collections: null,
            strategy: GLOB_STRATEGY
        };

        var selector = this;

        function Validate(options) {
            this.container = 'body';
            this.options = $.extend(true, {}, defaults, options);
            this.$selector = selector;
            this.cache = {};
            this.init();
        }


        /**
         * init方法     初始化
         */
        Validate.prototype.init = function() {
            var _this = this;
            var collections = _this.options.collections;
            var statusArr = ['info','success','error'];
            for (var i = 0; i < collections.length; i++) {
                _this.add(collections[i]);
            }
            _this.behavior();
            $.each(_this.cache,function(name,fields) {
                var contextClassName = /validate-context-(info|success|error)/.exec(fields.context[0].className);
                var initStatus;
                if(contextClassName){
                    initStatus = contextClassName[1];
                    fields.self.data('validateStatus',$.inArray(initStatus, statusArr));
                }
            });
        };

        /**
         * add方法      参数修正，将传入进来的数据转化另一种格式，并插入到cache中
         * @param {Object} options      每一项需要验证的配置参数
         *
         */
        Validate.prototype.add = function(options) {
            var $dom = this.$selector.find('[data-required=' + options.required + ']');
            var $context = $dom.parents(options.context);
            $.extend(true, this.cache, (function() {
                var item = {};
                var target = item[options.required] = {};
                target.matches = {};
                target.self = $dom;
                target.context = $context;
                target.infoMsg = options.infoMsg || '';
                $.extend(true, target.matches, options.matches);
                return item;
            }()));
        };


        /**
         * behavior     行为方法，如：focus、blur、change
         */
        Validate.prototype.behavior = function() {
            var _this = this;
            var _handle = handler(this.options.collections);

            this.$selector.on('focus', _handle, function(event) {
                var $this = $(this);
                var _name = $this.data('required');
                var collections = _this.cache[_name];
                if (_this.options.infoClass) {
                    _this.message(0, collections);
                }
                $this.trigger('validate.focus', collections);
            });

            this.$selector.on('blur', _handle, function(event) {
                _this.verify.call(this, _this, 'blur');
            });

            this.$selector.on('change', 'input[type=radio][data-required],input[type=checkbox][data-required]', function(event) {
                _this.verify.call(this, _this, 'change');
            });

        };

        /**
         * verify  行为触发验证
         * @param  {Object} glob      全局对象 Validate
         * @param  {String} eventName 事件名
         */
        Validate.prototype.verify = function(glob, eventName) {
            var $this = $(this);
            var collections = glob.cache[$this.data('required')];
            var matches = collections.matches;
            var status = false;

            /**
             * @param {String}      name        验证函数名
             * @param {Object}      params      验证字段（自定义字段）：errMsg、range
             */
            $.each(matches, function(name, params) {
                var result = glob.options.strategy[name].call(collections, params);
                status = result === void(0) ? 1 : 2;
                $this.data('validateStatus', result);
                glob.message(status, collections, name);

                return status === 2 ? false : true;

            });

            $this.trigger('validate.' + eventName, collections);

            return status;
        };

        /**
         * [message description]
         * @param  {Number} status      验证状态：0 未验证状态，1 验证且通过，2 验证且不通过
         * @param  {Object} options     被转化后的验证参数
         * @param  {String} matchesName 验证函数名
         *
         */
        Validate.prototype.message = function(status, options, matchesName) {

            var _className, _status, _contextClass, _msg, $target, $msg;

            _contextClass = ['info', 'success', 'error'];

            $msg = this.options.globalMessage ? $(this.options.globalMessage) : options.context;


            if (status === 0) {
                _className = this.options.infoClass;
                _msg = options.infoMsg;
            } else if (status === 1) {
                _className = this.options.successClass;
                _msg = '';
            } else if (status === 2) {
                _className = this.options.errorClass;
                _msg = options.matches[matchesName].errMsg;
            } else {
                // 后期再考虑 status === anything ...
            }

            _className = _className.replace(/\./g, ' ').slice(1);
            $msg.removeClass('validate-context-info validate-context-success validate-context-error')
                .addClass('validate-context-' + _contextClass[status]).find('.validate-message').remove();
            $target = $('<div class="validate-message ' + _className + '" >' + _msg + '</div>');
            $msg.append($target);

        };

        /**
         * batch    批量验证
         * @param  {Boolean}            circulation       强制循环，true：将全部验证，false：其中一个验证不通过将返回false并中断循环
         * @return {Number,Boolean}                       若circulation为true，将返回boolean，否则返回状态码 1 或 2 。
         *
         */
        Validate.prototype.batch = function(circulation) {
            var _this = this;
            $.each(this.cache, function(name, target) {
                var initStatus = target.self.data('validateStatus');
                var _result = initStatus === void(0) ? _this.verify.call(target.self, _this, 'batch') : initStatus;

                if (circulation) {
                    return _result === 2 ? false : true;
                }

                return _result;
            });
        };
        /**
         * handler 生成事件代理对象
         * @param  {Array}      collections       验证集合
         * @return {String}     事件委托目标
         */
        function handler(collections) {
            var _str = '';
            for (var i = 0; i < collections.length; i++) {
                if (/checkbox|radio/.test(collections[i].type)) {
                    continue;
                }
                _str += '[data-required=' + collections[i].required + '],';
            }
            return _str.slice(0, _str.length - 1);

        }

        return new Validate(options);
    }
});
