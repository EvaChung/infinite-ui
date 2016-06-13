 /**
 * tokenize 组件
 * @param  {boolean} readOnly 为true的时候，其他所有option失效
 * @return {string}   contain 默认为'.tokenize'，共有上下文
 * @param  {string} remove 如果为'no-remove'，表示不能删除初始化就选中的token
 * @param  {number} maxLength 最多可以输入多少个字符进行搜索，默认是10
 * @param  {function} overLimitCount 选择超过限制个数触发
 * @return {function}   existToken 已经存在标签触发
 * @return {function}   searchCallback 搜索后的回调函数
 * .tokenize > select + ul + .token > .token-item
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
        overLimitCount: function(){},
        existToken: function(){},
        searchCallback: function(){}
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
                        '<span>{text}</span><span data-value="{value}" class="token-close">x</span>',
                    '</span>'].join(''),
        optionTemplate: '<option selected="selected" value="{value}">{value}</option>',
        liTemplate: '<li class="hidden" data-value="{value}">{value}</li>',
        inputTemplate: '<div class="token"> <span> <input type="text" maxlength="{{maxlength}}" style="width: {{width}}px"> </span> </div>'
    };

    var tokenize = $.fn.tokenize = function(options){
        var defaults = $.extend({}, settings, options);

        htmlTemplate.inputTemplate = htmlTemplate.inputTemplate.replace('{{maxlength}}', defaults.maxLength).replace('{{width}}', defaults.maxLength*12);

        this.each(function(index, el) {
            var $this = $(this);
            var limitCount = $this.attr('data-limitCount') * 1;

            if (typeof limitCount !== 'number' || isNaN(limitCount)) {
                limitCount = Infinity;
            }
            $this.data({
                showAll: $this.attr('data-showAll') === 'false' ? false : true,
                create: $this.attr('data-create') === 'false' ? false : true,
                limitCount: limitCount
            });

            //添加input
            $this.append(htmlTemplate.inputTemplate);

            //创建模拟下拉框
            tokenize.renderSelect($this);

            //设置各种事件
            tokenize.setEvent($this, defaults);

            //创建默认token
            $this.find('li[uled]').each(function(index, el) {
                $(el).addClass('current ' + defaults.remove).trigger('click');
            });

            // 恢复显示
            $this.find('.tokenize-level').removeClass('hide');
        });
    };


    //模拟下拉框
    tokenize.renderSelect = function($contain){
        var htmlStr = $contain.find('select').prop('outerHTML');

        htmlStr = (htmlStr + '').replace(/<optgroup\s+label="(.*)".*>/g, '<li class="tokenize-level">$1<ul class="tokenize-menu">');
        htmlStr = htmlStr.replace(/<\/optgroup>/g, '</ul></li>');
        htmlStr = htmlStr.replace(/select/g, 'ul').replace(/option/g, 'li').replace(/value/g, 'data-value');
        $contain.append(htmlStr);
    };

    //创建token
    tokenize.createToken = function(text, value, defaults){
        var $inp = $(this).parents(defaults.contain).find('input').val('');
        var $token = $inp.parent();
        var str = htmlTemplate.spanTemplate.replace('{text}', text).replace('{value}', value);
        $(str).insertBefore($token);
    };

    //设置事件
    tokenize.setEvent = function($contain, defaults){

        if (defaults.readOnly === false) {
            //删除token
            $contain.on('click', '.token-close', function(event) {
                event.stopPropagation();
                var $this = $(this);
                var $contain = $this.parents(defaults.contain);
                var value = $this.attr('data-value');
                var $li = $contain.find('li[data-value="'+value+'"]');
                if ($li.hasClass('no-remove')) {
                    return;
                }
                $contain.find('option[value="'+value+'"]').removeAttr('selected');
                $li.removeClass('hidden');
                $li.parents('li').eq(0).removeClass('hide');
                $this.parent('.token-item').remove();

                tokenize.hideToken($contain);
            });

            //聚焦输入
            $contain.on('click', '.token', function(event) {
                event.stopPropagation();
                var $this = $(this);
                $this.find('input').focus();
                tokenize.searchToken.call($this.find('input')[0], defaults);
            });

            //输入搜索token
            $contain.on('keyup', 'input', function(event) {
                var keycode = event.keyCode;
                var KC = KEY_CODE;
                if(keycode !== KC.enter && keycode !== KC.back && keycode !== KC.bottom && keycode !== KC.top) {
                    tokenize.searchToken.call(this, defaults);
                }
            });

            //按下enter键设置token
            $contain.on('keyup', '>ul,input', function(event) {
                var keycode = event.keyCode;
                var KC = KEY_CODE;
                if(keycode === KC.enter || keycode === KC.back) {
                    tokenize.setToken.call(this, defaults);
                }
            });

            //按下上下键切换token
            $contain.on('keyup', function(event) {
                var keycode = event.keyCode;
                var KC = KEY_CODE;
                if (keycode === KC.bottom || keycode === KC.top) {
                    tokenize.turnToken.call(this, keycode);
                }
            });

            //鼠标样式
            $contain.on('mouseenter', 'li', function(event) {
                if (!$(this).hasClass('tokenize-level')) {
                    var $this = $(this);
                    $this.parents(defaults.contain).find('li').removeClass('current');
                    $this.addClass('current');
                }
            });
        }else{
            $contain.find('input').attr('readonly', 'readonly');
        }



        //点击li设置token
        $contain.on('click', 'li', function(event) {
            if (!$(this).hasClass('tokenize-level')) {
                tokenize.setToken.call(this, defaults);
            }else{
                event.stopPropagation();
            }
        });

    };

    //输入搜索token
    tokenize.searchToken = function(defaults){
        var $contain =  $(this).parents(defaults.contain);

        // 获取可见的非级别li
        var $lis = $contain.find('>ul').removeClass('hide').find('li').not('.tokenize-level').removeClass('current').not('.hidden');
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

        // 隐藏父ul
        tokenize.hideTitle.call($contain);
    };

    //按下enter键或者点击 li 设置token
    tokenize.setToken = function(defaults){
        var $contain = $(this).parents(defaults.contain);
        var $tokens = $contain.find('li').not('.tokenize-level');
        //var $visibleTokens = $tokens.filter(':visible');
        var $selectedTokens = $tokens.filter('.current');
        var str;
        var index;
        var $inp = $contain.find('.token input');
        var value = $.trim($inp.val());

        if (!tokenize.testCount.call(this, defaults)) {
            defaults.overLimitCount($contain);
            return;
        }

        if (!tokenize.testExist.call(this, defaults)) {
            defaults.existToken($contain);
            return;
        }

        //$selectedTokens = $selectedTokens.length ? $selectedTokens : $visibleTokens.eq(0);
        if ($selectedTokens.length) {
            $selectedTokens.removeClass('current').addClass('hidden');

            //创建 token
            tokenize.createToken.call(this, $selectedTokens.text(), $selectedTokens.attr('data-value'), defaults);

            //改变select
            index = $tokens.index($selectedTokens);
            $contain.find('option').eq(index).attr('selected', 'selected');

            // 隐藏父ul
            tokenize.hideTitle.call($contain);
        }else{
            var $ul = $contain.find('ul');

            // 多级是无法创建的
            if($contain.data('create') && $ul.length === 1 && value){
                //添加 li
                $contain.find('ul').append(htmlTemplate.liTemplate.replace(/\{value\}/g, value));

                //创建 token
                tokenize.createToken.call(this, value, value, defaults);

                //修改 select
                $contain.find('select').append(htmlTemplate.optionTemplate.replace(/\{value\}/g, value));
            }
        }
        tokenize.hideToken($contain);
    };

    //按下上下键切换token
    tokenize.turnToken = function(keycode){
        var $tokens = $(this).find('li').not('.tokenize-level');
        var $visibleTokens = $tokens.filter(':visible');
        var $selectedTokens = $visibleTokens.filter('.current');
        var index = $visibleTokens.index($selectedTokens);
        var length = $visibleTokens.length;
        if (length) {
            index = keycode === 40 ? (index +1)%length : (index !== -1 ? index - 1 : index)%length;
            $selectedTokens.removeClass('current');
            $visibleTokens.eq(index).addClass('current');
        }
    };

    //隐藏li
    tokenize.hideToken = function($ele){
        $(document).click(function(event) {
            tokenize.hideToken($('.tokenize'));
        });
        return function($ele){
            $ele.find('>ul').addClass('hide');
            $ele.find('li').not('.tokenize-level').addClass('hide');
            //return $ele.find('ul').not('.tokenize-menu').addClass('hide').find('li').addClass('hide');
        };
    }();

    //隐藏标题（多级的情况）
    tokenize.hideTitle = function(){
        var $lis = this.find('.tokenize-level');

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
        var $contain = $(this).parents(defaults.contain);
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
        var $contain = $(this).parents(defaults.contain);
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