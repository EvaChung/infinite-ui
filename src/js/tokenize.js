 /**
 * tokenize 组件
 * @param  {boolean} readOnly 为true的时候，其他所有option失效
 * @return {string}   contain 默认为'.tokenize'，共有上下文
 * @param  {string} remove 如果为'no-remove'，表示不能删除初始化就选中的token
 * @param  {number} maxLength 最多可以输入多少个字符进行搜索，默认是10
 * @param  {string} placeholder input的placeholder
 * @param  {boolean} expand 是否展开二级菜单，默认 true
 * @param  {function} overLimitCount 选择超过限制个数触发
 * @return {function}   existToken 已经存在标签触发
 * @return {function}   searchCallback 搜索后的回调函数
 * @return {function}   beforeChoice 选择前回调函数
 * @return {function}   choiceCallback 选择token回调
 * @return {function}   removeCallback 移除token回调
 * .tokenize
 *     select
 *     .token
 *         .token-item
 *         input
 *     .tokenize-level
 *         .tokenize-level-item
 * .tokenize
 *     select
 *     .token
 *         .token-item
 *         input
 *     .tokenize-level1
 *         .tokenize-level1-item
 *             ul.tokenize-level2
 *                 .tokenize-level2-item2
 */
 /*
    多级必须有optgroup 必须有label属性
 */
;(function($){
    var settings = {
        readOnly: false,
        contain: '.tokenize',
        remove: '',
        maxLength: 20,
        placeholder: '',
        expand: true,
        overLimitCount: function(){},
        existToken: function(){},
        searchCallback: function(){},
        beforeChoice: function(){},
        choiceCallback: function(){},
        removeCallback: function(){}
    };

    var KEY_CODE = {
        top: 38,
        right: 39,
        bottom: 40,
        left: 37,
        enter: 13,
        back: 9
    };

    var htmlTemplate = {
        spanTemplate: ['<span class="token-item">',
                        '<span>{{text}}</span><span data-value="{{value}}" class="token-close {{no-remove}}">×</span>',
                    '</span>'].join(''),
        optionTemplate: '<option selected="selected" value="{value}">{value}</option>',
        liTemplate: '<li class="hidden tokenize-level-item" data-value="{value}">{value}</li>',
        inputTemplate: '<div class="token"> <span class="tokenize-inp"> <input type="text" maxlength="{{maxlength}}" placeholder="{{placeholder}}" style="width: {{width}}px"> </span> </div>'
    };

    var addChoiceCurrent = function(event, defaults) {
        if (!$(this).hasClass('tokenize-level1-item')) {
            var $this = $(this);
            $this.closest(defaults.contain).find('li').removeClass('current');
            $this.addClass('current');
        }
    };

    var tokenize = $.fn.tokenize = function(options){
        var defaults = $.extend(true, {}, settings, options);

        return this.each(function(index, el) {
            var $this = $(this);
            var limitCount = $this.attr('data-limitCount') * 1;

            if ($this.data('init')) {
                return true;
            }

            if (isNaN(limitCount)) {
                limitCount = Infinity;
            }
            $this.data({
                showAll: $this.attr('data-showAll') === 'false' ? false : true,
                create: $this.attr('data-create') === 'false' ? false : true,
                limitCount: limitCount,
                init: true
            });

            //添加input
            $this.append(htmlTemplate.inputTemplate.replace('{{maxlength}}', defaults.maxLength).replace('{{placeholder}}', defaults.placeholder).replace('{{width}}', defaults.maxLength*12));

            //创建模拟下拉框
            tokenize.renderSelect($this, defaults.expand);

            //设置各种事件
            tokenize.setEvent($this, defaults);

            //创建默认token
            $this.find('li[uled]').each(function(index, el) {
                $(el).addClass('current ' + defaults.remove).trigger('click');
            });

            // 恢复显示
            $this.find('.tokenize-level1-item').removeClass('hide');
        });
    };


    //模拟下拉框
    tokenize.renderSelect = function($contain, expand){
        var htmlStr = $contain.find('select').prop('outerHTML');
        var direc = expand ? 'tokenize-up' : '';
        var dis = expand ? '' : 'hide';
        var str = '<li class="tokenize-level1-item"><span class="tokenize-level1-name '+direc+'">$1</span><ul class="tokenize-level2 '+dis+'">';

        if (htmlStr.indexOf('<optgroup') === -1) {
            htmlStr = htmlStr.replace(/<\/optgroup>/g, '</ul></li>');
            htmlStr = htmlStr.replace(/select/gi, 'ul').replace(/option/gi, 'li').replace(/value/g, 'data-value');
            $contain.append(htmlStr).find('ul').addClass('tokenize-level').find('li').addClass('tokenize-level-item');
        }else{
            htmlStr = (htmlStr + '').replace(/<optgroup\s+label="(.*)".*>/g, str);
            htmlStr = htmlStr.replace(/<\/optgroup>/g, '</ul></li>');
            htmlStr = htmlStr.replace(/select/gi, 'ul').replace(/option/gi, 'li').replace(/value/g, 'data-value');
            $contain.append(htmlStr).find('ul').eq(0).addClass('tokenize-level1').find('ul>li').addClass('tokenize-level2-item');
        }
    };

    //创建token
    tokenize.createToken = function(text, value, cn, defaults){
        var $inp = $(this).closest(defaults.contain).find('input').val('');
        var $token = $inp.parent();
        var str = htmlTemplate.spanTemplate.replace('{{text}}', text).replace('{{value}}', value).replace('{{no-remove}}', cn);
        $(str).insertBefore($token);
    };

    //设置事件
    tokenize.setEvent = function($contain, defaults){

        if (defaults.readOnly === false) {
            //删除token
            $contain.on('click.tokenize', '.token-close', function(event) {
                event.stopPropagation();
                var $this = $(this);
                var $contain = $this.closest(defaults.contain);
                var value = $this.attr('data-value');
                var $li = $contain.find('li[data-value="'+value+'"]');
                if ($li.hasClass('no-remove')) {
                    return;
                }
                $contain.find('option[value="'+value+'"]').removeAttr('selected');
                $li.removeClass('hidden');
                $li.closest('li').eq(0).removeClass('hide');
                $this.parent('.token-item').remove();

                tokenize.hideToken($contain);
                defaults.removeCallback.call($contain);
            });

            //聚焦输入
            $contain.on('click.tokenize', '.token', function(event) {
                event.stopPropagation();
                $(document).trigger('click.tokenize');
                var $this = $(this);
                $this.find('input').focus();
                tokenize.searchToken.call($this.find('input')[0], defaults);
            });

            //输入搜索token
            $contain.on('keyup.tokenize', 'input', function(event) {
                var keycode = event.keyCode;
                var KC = KEY_CODE;
                if(keycode !== KC.enter && keycode !== KC.back && keycode !== KC.bottom && keycode !== KC.top) {
                    tokenize.searchToken.call(this, defaults);
                }
            });

            // 收缩二级菜单
            $contain.on('click.tokenize', '.tokenize-level1-name', function(event) {
                $(this).toggleClass('tokenize-up').next().toggleClass('hide');
            });

            //按下enter键设置token
            $contain.on('keyup.tokenize', '>ul,input', function(event) {
                var keycode = event.keyCode;
                var KC = KEY_CODE;
                if(keycode === KC.enter || keycode === KC.back) {
                    tokenize.setToken.call(this, defaults);
                }
            });

            //按下上下键切换token
            $contain.on('keyup.tokenize', function(event) {
                var keycode = event.keyCode;
                var KC = KEY_CODE;
                if (keycode === KC.bottom || keycode === KC.top) {
                    $contain.off('mouseenter.tokenize');
                    tokenize.turnToken.call(this, keycode);
                    $contain.one('mousemove', '>ul', function(event){
                        $contain.on('mouseenter.tokenize', 'li', function(event){
                            addChoiceCurrent.call(this, event, defaults);
                        });
                    });
                }
            });

            //鼠标样式
            $contain.on('mouseenter.tokenize', 'li', function(event){
                addChoiceCurrent.call(this, event, defaults);
            });

        }else{
            $contain.find('input').attr('readonly', 'readonly');
        }



        //点击li设置token
        $contain.on('click.tokenize', 'li', function(event) {
            if (!$(this).hasClass('tokenize-level1-item')) {
                tokenize.setToken.call(this, defaults);
            }else{
                event.stopPropagation();
            }
        });

    };

    //输入搜索token
    tokenize.searchToken = function(defaults){
        var $contain =  $(this).closest(defaults.contain);

        // 获取可见的非级别li
        var $ul = $contain.find('>ul');
        var $lis = $ul.find('li').not('.tokenize-level1-item').removeClass('current').not('.hidden');
        var showAll = $contain.data('showAll');
        var values = $.trim(this.value);
        var count = 0;
        $lis.each(function(index, el) {
            var $el = $(el);
            var txts = $el.text();
            var cn = count !== 0 ? '' : 'current';


            if ((showAll || values !== '') && txts.indexOf(values) > -1) {
                ++count;
                $el.removeClass('hide').addClass(cn);
            }else{
                $el.addClass('hide');
            }

        });

        defaults.searchCallback.call($contain);

        if (count === 0) {
            $ul.addClass('hide');
            return;
        }

        $ul.removeClass('hide');

        // 隐藏父ul
        tokenize.hideTitle.call($contain);
    };

    //按下enter键或者点击 li 设置token
    tokenize.setToken = function(defaults){
        var $contain = $(this).closest(defaults.contain);
        var $tokens = $contain.find('li').not('.tokenize-level1-item');
        //var $visibleTokens = $tokens.filter(':visible');
        var $selectedTokens = $tokens.filter('.current');
        var str;
        var index;
        var $inp = $contain.find('.token input');
        var value = $.trim($inp.val());
        var cn;


        if (!tokenize.testCount.call(this, defaults)) {
            defaults.overLimitCount($contain);
            return;
        }

        if (!tokenize.testExist.call(this, defaults)) {
            defaults.existToken($contain);
            return;
        }

        //$contain.off('mouseenter.tokenize');

        defaults.beforeChoice.call($contain);

        //$selectedTokens = $selectedTokens.length ? $selectedTokens : $visibleTokens.eq(0);
        if ($selectedTokens.length) {
            $selectedTokens.removeClass('current').addClass('hidden');
            cn = $selectedTokens.hasClass('no-remove') ? 'no-remove' : '';

            //创建 token
            tokenize.createToken.call(this, $selectedTokens.text(), $selectedTokens.attr('data-value'), cn, defaults);

            //改变select
            index = $tokens.index($selectedTokens);
            $contain.find('option').eq(index).attr('selected', 'selected');
        }else{
            var $ul = $contain.find('ul');

            // 多级是无法创建的
            if($contain.data('create') && $ul.length === 1 && value){
                //添加 li
                $contain.find('ul').append(htmlTemplate.liTemplate.replace(/\{value\}/g, value));

                //创建 token
                tokenize.createToken.call(this, value, value, '', defaults);

                //修改 select
                $contain.find('select').append(htmlTemplate.optionTemplate.replace(/\{value\}/g, value));
            }
        }
        tokenize.hideToken($contain);
        defaults.choiceCallback.call($contain, $selectedTokens);
        // $contain.on('mouseenter.tokenize', 'li', function(event){
        //     addChoiceCurrent.call(this, event, defaults);
        // });
    };

    //按下上下键切换token
    tokenize.turnToken = function(keycode){
        var $this = $(this);
        var $ul = $this.find('>ul');
        var $tokens = $this.find('li').not('.tokenize-level1-item');
        var height = $tokens.height();
        var $visibleTokens = $tokens.filter(':visible');
        var $selectedTokens = $visibleTokens.filter('.current');
        var index = $visibleTokens.index($selectedTokens);
        var length = $visibleTokens.length;

        if (length) {
            if(keycode === 40){
                index = (index +1)%length;
            }else{
                if (index !== 0) {
                    index = --index;
                }else{
                    index = --length;
                }
            }
            $selectedTokens.removeClass('current');
            $visibleTokens.eq(index).addClass('current');
            $ul.scrollTop(index*height);
        }
    };

    //隐藏li
    tokenize.hideToken = function($ele){
        $(document).on('click.tokenize',function(event) {
            tokenize.hideToken($('.tokenize'));
        });
        return function($ele){
            $ele.find('>ul').not('.extra').addClass('hide');
            $ele.find('li').not('.tokenize-level1-item,.extra').addClass('hide');
            //return $ele.find('ul').not('.tokenize-level2').addClass('hide').find('li').addClass('hide');
        };
    }();

    //隐藏标题（多级的情况）
    tokenize.hideTitle = function(){
        var $lis = this.find('.tokenize-level1-item');

        $lis.each(function(index, el) {
            var $el = $(el);

            if($el.find('li:not(.hidden):not(.hide)').length > 0){
                $el.removeClass('hide');
            }else{
                $el.addClass('hide');
            }
        });
    };

    //判断选择的个数
    tokenize.testCount = function(defaults){
        var $contain = $(this).closest(defaults.contain);
        var limitCount = $contain.data('limitCount');
        var length = $contain.find('.token-item').length;
        if (limitCount !== Infinity) {
            if (length >= limitCount) {
                return false;
            }
        }
        return true;
    };

    //判断是否已经存在
    tokenize.testExist = function(defaults){
        var $contain = $(this).closest(defaults.contain);
        var text = $.trim($contain.find('.token input').val());
        var $tokenItem = $contain.find('.token-item');
        var result = true;
        $tokenItem.each(function(index, el) {
            var $span = $(el).find('span').eq(0);
            if ($span.text() === text) {
                result = false;
                return;
            }
        });
        return result;
    };

    $.fn.IUI({
     tokenize: tokenize
    });

})(jQuery);
