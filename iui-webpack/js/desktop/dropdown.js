 /**
  * dropdown 组件
  * @param      {boolean}    readOnly        为true的时候，其他所有option失效
  * @param      {number}     limitCount      限制选择个数，默认 Infinity
  * @param      {string}     input           搜索的 input
  * @param      {array}      data            默认 []
  */
 let utils = require('../utils');
 let isSafari = (function(){
                    var ua = navigator.userAgent.toLowerCase(); 
                    if (ua.indexOf('safari') != -1) { 
                      return ua.indexOf('chrome') > -1 ? false : true;
                    }
                })();
 let settings = {
     readOnly       : false,
     limitCount     : Infinity,
     input          : '<input type="text" maxLength="20" placeholder="搜索名称或ID">',
     data           : [],
     overLimitCount : function() {},
     beforeChoice   : function() {},
     choice         : function() {},
     remove         : function() {}
 };

 let KEY_CODE = {
     up             : 38,
     down           : 40,
     enter          : 13
 };

 let template = `<a href="javascript:;" class="dropdown-select">
                    <span class="dropdown-chose-list"></span>
                    <span class="dropdown-search">{{input}}</span> 
                </a>`;

// select-option 转 ul-li
 function selectToDiv(str) {
     let result = str || '';
     // 此处顺序不能换
     result     = result.replace(/\=\"\"/gi,'');
     result     = result.replace(/<optgroup label="([^"]*)" data-group-id="([^"]*)">/g, '<li class="dropdown-group" data-group-id="$2">$1</li>');
     result     = result.replace(/<\/optgroup>/gi, '');
     result     = result.replace(/selected class\=\"dropdown-option\"/gi,'class="dropdown-option dropdown-chose"');
     result     = result.replace(/<option disabled/gi, '<li disabled ').replace(/option>/gi, 'li>');
     result     = result.replace(/value/gi,'data-value');
     result     = result.replace(/<option/gi, '<li tabindex="0"');
     result     = result.replace(/select/gi, 'ul');

     return result;
 }

// object-data 转 select-option
 function objectToSelect(data) {
     let map    = {};
     let result = '';
     let name   = [];

     if (!data || !data.length) {
         return false;
     }

     $.each(data, function(index, val) {
        // disable 权重高于 selected
         let hasGroup = val.groupId;
         let disabled = val.disabled ? 'disabled' : '';
         let selected = val.selected && !disabled ? 'selected' : '';
         let temp     = `<option ${disabled} ${selected} class="dropdown-option" value="${val.id}" data-name="${val.name}">${val.name}</option>`;

         if(selected){
            name.push(`<span>${val.name}</span>`);
         }

         // 判断是否有分组
         if (hasGroup) {
             if (map[val.groupId]) {
                 map[val.groupId] += temp;
             } else {
                 map[val.groupId]  = val.groupName + '|-|' + temp;
             }
         } else {
             map[index] = temp;
         }

     });

     $.each(map, function(index, val) {
         let option = val.split('|-|');
         // 判断是否有分组
         if (option.length === 2) {
             let groupName = option[0];
             let items     = option[1];
             result += `<optgroup label="${groupName}" data-group-id="${index}">${items}</optgroup>`;
         } else {
             result += val;
         }

     });
     return [result,name];
 }

// select-option 转 object-data
 function  selectToObject(el){
    let $select = el;
    let result  = [];

    function readOption(key,el){
        let $option   = $(el);
        this.id       = $option.prop('value');
        this.name     = $option.text();
        this.disabled = $option.prop('disabled');
        this.selected = $option.prop('selected');
    }

    $.each($select.children(),function(key,el){
        let tmp      = {};
        let tmpGroup = {};
        let $el      = $(el);

        if(el.nodeName === 'OPTGROUP'){
            tmpGroup.groupId   = $el.data('groupId');
            tmpGroup.groupName = $el.attr('label');
            $.each($el.children(),$.proxy(readOption,tmp));
            $.extend(tmp,tmpGroup);
        }else{
            $.each($el,$.proxy(readOption,tmp));
        }

        result.push(tmp);
    });

    return result;
 }

 let action = {
     show: function(event) {
         event.stopPropagation();
         let _dropdown = this;
         let $main     = _dropdown.$el.find('.dropdown-main');
         $('.dropdown-main').addClass('hide');
         $main.toggleClass('hide'); 
         // $main.find('input').focus();
     },
     search: utils.throttle(function(event) {
         let _dropdown = this;
         let $el       = _dropdown.$el;
         let $input    = $(event.target);
         let txt       = $input.val();
         let data      = _dropdown.config.data;
         let result    = [];

         if(event.keyCode > 36 && event.keyCode < 41){
            return;
         }

         $.each(data, function(key, value) {
             if(value.name.toLowerCase().indexOf(txt) > -1 || value.id === parseInt(txt) ){
                result.push(value);
             }
         });

        $el.find('ul').html(selectToDiv(objectToSelect(result)[0]));


     }, 300),
     control:function(event) {      
         var keyCode = event.keyCode;
         var KC      = KEY_CODE;
         var index   = 0;
         var direct;
         var itemIndex;
         var $items;
         if (keyCode === KC.down || keyCode === KC.up) {

             // 方向
             direct    = keyCode === KC.up ? -1 : 1;
             $items    = this.$el.find('[tabindex]');
             itemIndex = $items.index($(document.activeElement));

             // 初始
             if(itemIndex === -1){
                index = direct + 1 ? -1 : 0;
             }else{
                index = itemIndex;
             }

            // 确认位序
            index  = index + direct;

            // 最后位循环
            if(index === $items.length){
                index = 0;
            }

            $items.eq(index).focus();
            event.preventDefault();

         }
     },
     multiChoose:function(event){
        let _dropdown   = this;
        let _config     = _dropdown.config;
        let $el         = _dropdown.$el;
        let $select     = _dropdown.$select;
        let $target     = $(event.target);
        let value       = $target.data('value');
        let hasSelected = $target.hasClass('dropdown-chose');
        _dropdown.name  = [];

        console.time('testing');

        $target.toggleClass('dropdown-chose');
        
        $.each(_config.data,function(key,item){
            if(item.id == value){
                item.selected = hasSelected ? false : true;
            }
            if(item.selected){
                _dropdown.name.push(`<span>${item.name}</span>`);
            }
        });

        // let processResult = objectToSelect(_config.data);

        // $select[0].innerHTML=processResult[0];

        $select.find('option[value="'+value+'"]').prop('selected',hasSelected ? false : true);

        _dropdown.name.push(`<span class="placeholder">${_dropdown.placeholder}</span>`);

        _dropdown.$choseList.html(_dropdown.name.join(''));

        console.timeEnd('testing');

     },
     singleChoose:function(event){
        let _dropdown   = this;
        let _config     = _dropdown.config;
        let $el         = _dropdown.$el;
        let $select     = _dropdown.$select;
        let $target     = $(event.target);
        let value       = $target.data('value');
        let hasSelected = $target.hasClass('dropdown-chose');
        _dropdown.name      = [];
        console.time('testing');

        $el.find('.dropdown-main').addClass('hide');

        $el.find('li').not($target).removeClass('dropdown-chose');

        $target.toggleClass('dropdown-chose');

        $.each(_config.data,function(key,item){
            // id 有可能是数字也有可能是字符串，强制全等有弊端 2017-03-20 22:19:21
            item.selected = false;
            if(item.id == value){
                item.selected = hasSelected ? 0 : 1;
                _dropdown.name.push(`<span>${item.name}</span>`);
            }
        });

        // let processResult = objectToSelect(_config.data);

        $select.find('option[value="'+value+'"]').prop('selected',true);

        _dropdown.name.push(`<span class="placeholder">${_dropdown.placeholder}</span>`);

        _dropdown.$choseList.html(_dropdown.name.join(''));

        console.timeEnd('testing');
        
     }
 };




 function Dropdown(options, el) {
     this.$el         = $(el);
     this.$select     = this.$el.find('select');
     this.placeholder = this.$select.attr('placeholder');
     this.config      = options;
     this.name        = [];
     this.iss         = !this.$select.prop('multiple');
     this.init();
 };

 Dropdown.prototype = {
     init: function() {
         let _this         = this;
         let _config       = _this.config;
         let $el           = _this.$el;
         let openHandle    = isSafari ? 'click.iui-dropdown' : 'focus.iui-dropdown';
         $el.addClass('dropdown');

         if(_config.data.length === 0){
            _config.data   = selectToObject(_this.$select);
         }

         let processResult = objectToSelect(_config.data);
         _this.name        = processResult[1];
         _this.$select.html(processResult[0]);

         _this.renderSelect();

         _this.$el.find('ul').removeAttr('id').removeAttr('name');

         $el.on('click.iui-dropdown', function(event) { event.stopPropagation(); });

         // 聚焦显示下拉
         $el.on(openHandle, '.dropdown-select',$.proxy(action.show, _this));

         // 搜索
         $el.on('keyup.iui-dropdown', 'input', $.proxy(action.search, _this));


         // 按下enter键设置token
         $el.on('keyup.iui-dropdown', function(event) {
             var keyCode = event.keyCode;
             var KC = KEY_CODE;
             if (keyCode === KC.enter) {
                $.proxy(_this.iss ? action.singleChoose : action.multiChoose,_this,event)();
             }
         });

         // 按下上下键切换token
         $el.on('keydown.iui-dropdown', $.proxy(action.control,_this));

         $el.on('click.iui-dropdown','[tabindex]', $.proxy(_this.iss ? action.singleChoose : action.multiChoose,_this));

     },

     // 渲染 select 为 dropdown
     renderSelect: function() {
         let _this   = this;
         let _config = _this.config;
         let $el     = _this.$el;
         let $select = _this.$select;
         let htmlStr = '<div class="dropdown-main hide">' + selectToDiv($select.prop('outerHTML')) + '</div>';

         // 自定义搜索框
         $el.append(template.replace('{{input}}', _this.config.input));
         // // 给 li 添加类名
         $el.append(htmlStr).find('ul').removeClass('hide');

         // 移动搜索框位置，并且虚拟placeholder
         $el.find('.dropdown-main').prepend($el.find('input').parent());

         _this.$choseList = $el.find('.dropdown-chose-list');

         _this.$choseList.html($('<span class="placeholder"></span>').text(_this.placeholder));

         _this.$choseList.prepend(_this.name.join(''));
     }
 };


 $(document).on('click.dropdown', function(event) {
     $('.dropdown-main').addClass('hide');
 });

 module.exports = {
     dropdown: function(options) {
        this.each(function(index, el) {
            $(el).data('iui-dropdown',new Dropdown($.extend(true, {}, settings, options), el));
         });
     }
 };
