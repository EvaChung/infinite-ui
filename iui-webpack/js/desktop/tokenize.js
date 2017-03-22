 /**
 * tokenize 组件
 * @param  {boolean} readOnly 为true的时候，其他所有option失效
 * @param  {number} limitCount 限制选择个数，默认 Infinity
 * @param  {string} input 搜索的 input
 * @param  {array} data 默认 []
 * @param  {function} overLimitCount 选择超过限制个数触发
 * @return {function}   beforeChoice 选择前回调函数
 * @return {function}   choiceCallback 选择token回调
 * @return {function}   removeCallback 移除token回调
 */
var settings = {
    readOnly: false,
    limitCount: Infinity,
    input: '<input type="text" maxLength="20">',
    data: [],
    overLimitCount: function(){},
    beforeChoice: function(){},
    choice: function(){},
    remove: function(){}
};

var KEY_CODE = {
    left: 37,
    top: 38,
    right: 39,
    bottom: 40,
    enter: 13,
    back: 9
};

var template = {
    spanTemplate: ['<span class="selected-item">',
                    '<span>{{text}}</span><span value="{{value}}" class="tokenize-close" remove="{{remove}}">×</span>',
                '</span>'].join(''),
    optionTemplate: '<option selected="selected" value="{value}">{value}</option>',
    liTemplate: '<li class="hidden tokenize-level-item" value="{value}">{value}</li>',
    selectTp: '<div class="tokenize-select"> <div class="tokenize-choiced"></div><span class="tokenize-inp">{{input}}</span> </div>'
};

// 选择
function setToken($$, _config, _this){
    var $this = $(this);
    var value = $this.attr('value');
    var text = $this.text();
    var remove = $this.attr('remove');
    var type = 'append';
    var $choiced = $$.find('.tokenize-choiced');

    // 已经选择的不能选择
    if ($this.hasClass('tokenize-selected') ||
        $this.hasClass('disabled')) {
        if (_config.limitCount === 1) {
            $$.find('.tokenize-main').addClass('hide');
        }
        return;
    }

    if (_config.beforeChoice.call(_this, $$) === false) {
        return;
    }


    if (_config.limitCount === 1) {
        type ='html';
        $this.closest('ul').find('li.tokenize-selected').removeClass('tokenize-selected');
        $choiced.addClass('has-token');
        $this.addClass('active');
    }
    $this.addClass('tokenize-selected');
    $choiced[type](template.spanTemplate.replace('{{value}}', value).replace('{{text}}', text).replace('{{remove}}', remove));

    $$.find('select option[value="'+value+'"]').attr('selected', 'selected');

    _config.choice.call(_this, $$);
    $$.find('.tokenize-main').addClass('hide');
}


$(document).on('click.tokenize', function(event) {
    $('.tokenize-main').addClass('hide');
});

function Tokenize(options, el){
    this.$el = $(el);
    this.$select = this.$el.find('select');
    this.config = options;
    this.init();
}

Tokenize.prototype = {
    init: function(){
        this.comcatSelect();
        this.renderSelect();
        this.setEvent();

        // 初始选中
        this.$el.find('li[uled]').trigger('click');
    },

    // json 拼接 select
    comcatSelect: function(){
        var _this = this;
        var config = _this.config;
        var data = config.data;
        var str = '';
        var isClose = true;
        var groupName = '';
        var optionClass = '';

        if (data && data.length) {
            $.each(data, function(index, val) {
                if (!val.group || val.group === groupName) {
                    str += '<option remove="'+val.remove+'" class="tokenize-option '+optionClass +' ' +val.disabled+'" value="'+val.value+'" '+val.selected+'>'+val.text+'</option>';
                }else{
                    if (isClose) {
                        isClose = false;
                        optionClass = 'group-option';
                    }else{
                        str += '</optgroup>';
                    }
                    str += '<optgroup label="'+val.text+'">';
                    groupName = val.group;
                }

                // if (!val.group) {
                //     str += '<option remove="'+val.remove+'" class="tokenize-option '+optionClass +' ' +val.disabled+'" value="'+val.value+'" '+val.selected+'>'+val.text+'</option>';
                // }else{
                //     if (isClose) {
                //         str += '<optgroup label="'+val.text+'">';
                //         optionClass = 'group-option';
                //         isClose = false;
                //     }else{
                //         str += '</optgroup>';
                //         str += '<optgroup label="'+val.text+'">';
                //     }
                // }
            });
            if (!isClose) {
                str += '</optgroup>';
            }
            _this.$select.append(str);
        }
    },

    // 渲染 select 为 tokenize
    renderSelect: function(){
        var _config = this.config;
        var $$ = this.$el;
        var $select = this.$select;
        var htmlStr = '<div class="tokenize-main hide">' + $select.prop('outerHTML') + '</div>';

        htmlStr = (htmlStr + '').replace(/<optgroup label="([^"]*)">/g, '<li class="tokenize-group">$1</li>');
        htmlStr = htmlStr.replace(/<\/optgroup>/g, '');
        htmlStr = htmlStr.replace(/select/gi, 'ul').replace(/<option/gi, '<li').replace(/option>/gi, 'li>');

        // 自定义搜索框
        $$.append(template.selectTp.replace('{{input}}', this.config.input));
        // 给 li 添加类名
        $$.append(htmlStr).find('ul').removeClass('hide').find('li').not('.tokenize-group').addClass('tokenize-option');

        // 移动搜索框位置，并且虚拟placeholder
        if (_config.limitCount === 1) {
            $$.find('.tokenize-main').prepend($$.find('input').parent());
            $('<div class="ph"></div>').insertAfter($$.find('.tokenize-choiced')).text($select.attr('placeholder'));
        }
    },

    // 交互事件
    setEvent: function(){
        var _this = this;
        var _config = _this.config;
        var $$ = _this.$el;
        var $select = _this.$select;

        $$.addClass('tokenize');

        if (_config.limitCount === 1) {
            $$.addClass('tokenize-single');
        }

        $$.on('click', function(event) {
            event.stopPropagation();
        });

        // 选择
        $$.on('click', '.tokenize-option', function(event) {
            // 多选
            if (_config.limitCount !== 1) {
                if ($$.find('li.tokenize-selected').length >= _config.limitCount) {
                    _config.overLimitCount.call(_this, $$);
                    return;
                }
            }

            setToken.call(this, $$, _config, _this);
        });

        if (this.config.readOnly) {
            return;
        }

        // 聚焦显示下拉
        $$.on('click', '.tokenize-select', function(event) {
            event.stopPropagation();
            $('.tokenize-main').addClass('hide');

            var $lis = $$.find('.tokenize-main').removeClass('hide').find('.tokenize-option:not(.disabled)').removeClass('active');
            var $lisTemp;

            if (_config.limitCount !== 1) {
                $lis = $lis.not('.tokenize-selected');
            }else{
                $lisTemp = $lis.filter('[value="'+$select.val()+'"]');
                $lis = $lisTemp.length ? $lisTemp : $lis;
            }

            $lis.eq(0).addClass('active');
            $$.find('input').focus();
        });

        // 去除
        $$.on('click', '.tokenize-close', function(event) {
            event.stopPropagation();
            var $this = $(this);
            var value = $this.attr('value');
            var selector = 'li[value="'+value+'"],option[value="'+value+'"]';

            $$.find(selector).removeAttr('selected').removeClass('tokenize-selected');
            $this.parent().remove();

            // 单选清除已选标志
            $$.find('.tokenize-choiced').removeClass('has-token');

            _config.remove.call(_this, $$);

        });

        // 搜索
        $$.on('keyup.tokenize-search', 'input', function(event) {
            if(event.keyCode === KEY_CODE.enter){
                return;
            }

            clearTimeout(window.tokenizeSearchTo);
            var txt = $(this).val();

            window.tokenizeSearchTo = setTimeout(function(){
                $$.find('.tokenize-option').each(function(index, el) {
                    var $el = $(el);

                    if ($el.text().indexOf(txt) > -1) {
                        $el.removeClass('hide');
                    }else{
                        $el.addClass('hide');
                    }
                });

                // 如果是多选，则还需要隐藏没有符合项的标题
                $$.find('.tokenize-group').each(function(index, el) {
                    var $el = $(el);

                    if($el.nextUntil('.tokenize-group').filter(':visible').length){
                        $el.removeClass('hide');
                    }else{
                        $el.addClass('hide');
                    }
                });
            }, 0);
        });

        // 按下enter键设置token
        $$.on('keyup.tokenize-set', function(event) {
            var keyCode = event.keyCode;
            var KC = KEY_CODE;
            if(keyCode === KC.enter) {
                setToken.call($$.find('.active')[0], $$, _config, _this);
            }
        });

        // 按下上下键切换token
        $$.on('keyup.tokenize-turn', function(event) {
            var keyCode = event.keyCode;
            var KC = KEY_CODE;
            var $lis;
            var direc = 1;
            var $curLi;
            var index;
            var $ul;
            var st = 0;

            if (keyCode === KC.bottom || keyCode === KC.top) {
                $lis = $$.find('li.tokenize-option:not(.disabled):visible');

                if (_config.limitCount !== 1) {
                    $lis = $lis.not('.tokenize-selected');
                }

                if (keyCode === KC.top) {
                    direc = -1;
                }

                $curLi = $lis.filter('.active').removeClass('active');
                index = $lis.index($curLi) + direc;

                if (direc === 1 && index >= $lis.length) {
                    index--;
                }else if(direc === -1 && index <= 0){
                    index = 0;
                }

                $lis.eq(index).addClass('active');
                $ul = $curLi.closest('ul');

                if(direc === 1 && index < $lis.length){
                    $ul.scrollTop($ul.scrollTop() + $curLi.height());
                }else if(direc === -1 && index >= 0){
                    st = $ul.scrollTop() - $curLi.height();
                    $ul.scrollTop(st < 0 ? 0 : st);
                }
            }
        });

        //鼠标样式
        $$.on('mouseenter.tokenize', '.tokenize-option', function(event){
            var $this = $(this);

            if ($this.hasClass('disabled')) {
                return false;
            }

            if (_config.limitCount !== 1 && $this.hasClass('tokenize-selected')) {
                return;
            }

            $$.find('.tokenize-option.active').removeClass('active');
            $this.addClass('active');

        });

        // 显示下拉的时候禁止页面滚动
        $$.find('.tokenize-main').hover(function() {
            var $body = $('body');
            var top = $body.scrollTop();
            $(document).on('scroll.tokenize', function(event) {
                $body.scrollTop(top);
            });
        }, function() {
            $(document).off('scroll.tokenize');
        });
    }
};

$.fn.tokenize = function(options){
    this.each(function(index, el) {
        new Tokenize($.extend(true, {}, settings, options), el);
    });
};

module.exports = {
    tokenize:function(config) {
        this.tokenize(config);
    }
};

