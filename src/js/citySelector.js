;(function($, window, document, undefined) {

    

    var IUI = {};
    $.fn.IUI = function() {
        var arg = arguments;
        var method = arguments[0];
        if (IUI[method]) {
            method = IUI[method];
            arg = Array.prototype.slice.call(arg, 1);
            return method.apply(this, arg);
        } else if (typeof(method) == 'object' || !method) {
            for (var name in method) {
                IUI = $.extend(IUI, method);
                method = IUI[name];
                break;
            }
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.IUI Plugin');
            return this;
        }
    };

    $.fn.IUI({
        citySelector: function(options){
            var defaults = {
                container: 'body',
                isCityMode: true,     //城市省份模式，true城市，false省份，默认城市
                isSearchMode: true,   //开启搜索模式，true为搜索与点选，false为不搜索与点选，默认搜索与点选
                isSearchPinyin: true, //开启拼音搜索，true为拼音与name同时搜索，false只搜索name，默认同时搜索
                isMultiSelect: false, //单选多选模式，true多选，false单选，默认单选
                isProAndCity: false,  //是否输出省份与城市id到input，true为输出两个，false只输出city，默认city，只在城市模式有效
                isShortName: false,   //是否输出shortName到input，true为shortName，false为全称，默认全称
                cityData: [],         //后台返回的省市json数组
                hotCtiy: [],          //热门城市数组，shortName数组，默认为JSON前15个
                group: ['ABC','DEF','GHI','JKL','MNO','PQR','STU','WXYZ'],  //字母分组数组，默认333
                map: {
                    id: 'id',
                    parentId:'parentId',
                    levelOne:'100000'
                },
                selectCall: function(){},
                hideCall: function(){}
            };
            var config = $.extend({},defaults,options || {});

            var self = this;
            var $body = $('body');
            var Methods = function(){};//储存方法集合
            var methods = {};          //储存初始化的Methods
            var dataJson = {};         //储存过滤后的省市json,{collection:[],province:[],city:[]}
            var group = {};            //储存根据字母分组后的json,{hotCity:[],A:[],...}
            var mode = 0;              //当前模式，0为关闭容器，1为选择模式，2为搜索模式
            var activeID = '';         //储存active城市ID

            /**定义方法集合********************************/

            //省市json过滤器
            Methods.prototype.filter = function(){
                var province = [],city = [];

                $.each(config.cityData, function(i,n) {
                    if(n[config.map.parentId] === config.map.levelOne){
                        province.push(n);
                    }else{
                        city.push(n);
                    }
                });
                dataJson.province = province;
                dataJson.city = city;

                $.each(province, function(i,n) {
                    n.children = [];
                    $.each(city, function(j,k){
                        if(n.id === k.parentId){
                            n.children.push(k);
                        }
                    });
                });
                dataJson.collection = province;
            };

            //热门省份或城市
            Methods.prototype.hot = function(){
                var data = config.isCityMode ? dataJson.city : dataJson.province;//根据isCityMode选择省份或城市
                group.hotCtiy = [];

                if(config.hotCtiy.length){//有传入hotCity参数
                    $.each(config.hotCtiy,function(i,n){
                        $.each(data,function(j,k){
                            if(k.shortName.indexOf(n) !== -1){
                                group.hotCtiy = group.hotCtiy.concat(k);
                            }
                        });
                    });
                }else{//没有传入hotCity参数，取前15项
                    if(data.length < 15){
                        group.hotCtiy = group.hotCtiy.concat(data.slice(0));
                    }else{
                        group.hotCtiy = group.hotCtiy.concat(data.slice(0,15));
                    }
                }
            };

            //根据字母分组
            Methods.prototype.group = function(){
                var data = config.isCityMode ? dataJson.city : dataJson.province;//根据isCityMode选择省份或城市

                if(config.group.length){
                    $.each(config.group,function(i,n){                 //['ABC',...]
                        for(var x = 0;x < n.length; x++){              //'ABC'
                            var letter = n.charAt(x).toUpperCase();
                            group[letter] = [];                        //储存字母下的数组，{A:[{},{},{}],B:[{},{}]}
                            
                            $.each(data,function(j,k){
                                if(k.letter.indexOf(letter) === 0){
                                    group[letter] = group[letter].concat(k);
                                }
                            });
                        }
                    });

                }else{
                    throw new Error('the parameter group is illegal!');
                }
            };


            //初始化：建立DOM结构
            Methods.prototype.init = function(){
                var hotMenu = config.isCityMode ? "热门城市" : "热门省份";
                var cityMenu = '<li class="active">'+ hotMenu +'</li>';

                var cityClose = config.isMultiSelect ? '<i class="cityClose">×</i>' : '';

                $.each(config.group,function(i,n){
                    cityMenu += '<li>'+ n +'</li>';
                });

                if(!config.isSearchMode){
                    $body.find(self).find('input[data-role="name"]').attr('readonly',true);
                }

                var cityContainer = '<div class="cityContainer hide">'+
                        '<div class="citySelector hide">'+
                            cityClose +
                            '<ul class="cityMenu">'+
                                cityMenu +
                            '</ul>'+
                            '<div class="cityBox">'+
                                methods.renderSelector(hotMenu) +
                            '</div>'+
                        '</div>'+

                        '<div class="citySearcher hide">'+
                            '<ul>'+
                                
                            '</ul>'+
                        '</div>'+
                        
                    '</div>';

                $(config.container).append(cityContainer);

            };


            //渲染选择DOM内容
            Methods.prototype.renderSelector = function(menu){
                var cityBox = '';

                if(menu.indexOf("热门") >= 0){

                    if(!group.hotCtiy.length){
                        cityBox += '<dl><dt>hot</dt><dd>none<dd></dl>';
                    }else{
                        var a = '';
                        $.each(group.hotCtiy,function(i,n){
                            if(activeID && (activeID.indexOf(n[config.map.id]) >= 0)){//读取储存的active城市并渲染
                                a +=  '<a href="javascript:;" class="active" data-id="'+ n[config.map.id] +'" data-pid="'+ n[config.map.parentId] +'">'+ (config.isShortName ? n.shortName : n.name) +'</a>';
                            }else{
                                a +=  '<a href="javascript:;" data-id="'+ n[config.map.id] +'" data-pid="'+ n[config.map.parentId] +'">'+ (config.isShortName ? n.shortName : n.name) +'</a>';
                            }
                            
                        });

                        cityBox += '<dl>'+
                                    '<dt>hot</dt>'+
                                    '<dd>'+ a +'</dd>'+
                                '</dl>';
                    }
                    
                }else{
                    
                    for(var x = 0;x < menu.length; x++){
                        var letter = menu.charAt(x).toUpperCase();
                        var a = '';

                        if(group[letter].length){
                            $.each(group[letter],function(i,n){
                                if(activeID && activeID.indexOf(n[config.map.id]) >= 0){//读取储存的active城市并渲染
                                    a +=  '<a href="javascript:;" class="active" data-id="'+ n[config.map.id] +'" data-pid="'+ n[config.map.parentId] +'">'+ (config.isShortName ? n.shortName : n.name) +'</a>';
                                }else{
                                    a +=  '<a href="javascript:;" data-id="'+ n[config.map.id] +'" data-pid="'+ n[config.map.parentId] +'">'+ (config.isShortName ? n.shortName : n.name) +'</a>';
                                }
                            });

                            cityBox += '<dl>'+
                                        '<dt>'+ letter +'</dt>'+
                                        '<dd>'+ a +'</dd>'+
                                    '</dl>';
                        }
                    }
                }

                return cityBox;

            };

            //渲染搜索DOM内容
            Methods.prototype.renderSearcher = function(val){
                var data = config.isCityMode ? dataJson.city : dataJson.province;//根据isCityMode选择省份或城市
                var searchResult = '';

                if(!config.isMultiSelect){//单选模式
                    $.each(data,function(i,n){
                        if(n.name.search(val) >= 0 || (config.isSearchPinyin ? (n.pinyin.toLowerCase().search(val.toLowerCase()) >= 0) : false)){
                            if(activeID && activeID.indexOf(n[config.map.id]) >= 0){
                                searchResult += '<li class="active" data-id="'+ n[config.map.id] +'" data-pid="'+ n[config.map.parentId] +'"><span>'+ (config.isShortName ? n.shortName : n.name) +'</span><i>'+ (config.isSearchPinyin ? n.pinyin : '') +'</i></li>';
                            }else{
                                searchResult += '<li data-id="'+ n[config.map.id] +'" data-pid="'+ n[config.map.parentId] +'"><span>'+ (config.isShortName ? n.shortName : n.name) +'</span><i>'+ (config.isSearchPinyin ? n.pinyin : '') +'</i></li>';
                            }
                            
                        }
                    });
                    if(!searchResult){
                        searchResult += '<li class="cityNotFound">找不到该省市 : )</li>';
                    }

                }else{//多选模式
                    
                }
                return searchResult;
            };

            //赋值
            Methods.prototype.assign = function(that){
                var $name = self.children('input[data-role="name"]'),
                    $id = self.children('input[data-role="id"]'),
                    $pid = self.children('input[data-role="pid"]'),
                    nameVal = $name.val(),
                    idVal = $id.val(),
                    pidVal = $pid.val();

                if(that === null){//搜索无果 且关闭，执行清空
                    activeID = '';
                    $name.val('');
                    $id.val('');
                    if(config.isCityMode && config.isProAndCity){
                        $pid.val('');
                    }
                    return;
                }

                if(config.isMultiSelect){
                    var mulNameVal = nameVal + (nameVal ? ',' : '') + (that.is('a') ? that.text() : that.find('span').text()),
                        mulIdVal  = idVal + (idVal ? ',' : '') + that.attr('data-id'),
                        mulPidVal = pidVal + (pidVal ? ',' : '') + that.attr('data-pid');

                    $name.val(mulNameVal);
                    $id.val(mulIdVal);
                    if(config.isCityMode && config.isProAndCity){
                        $pid.val(mulPidVal);
                    }
                    
                    
                }else{
                    $name.val(that.is('a') ? that.text() : that.find('span').text());
                    $id.val(that.attr('data-id'));
                    if(config.isCityMode && config.isProAndCity){
                        $pid.val(that.attr('data-pid'));
                    }
                }

                config.selectCall.call(self);
                
            };

            //管理active状态
            Methods.prototype.manageActiveID = function(ID){
                if(config.isMultiSelect){
                    activeID += ID;
                }else{
                    activeID = ID;
                }
            };

            //阻止事件冒泡
            Methods.prototype.stopPropagation = function(e){
                if(e.stopPropagation){
                    e.stopPropagation();
                }else{
                    e.cancelBubble = true;
                }
            };

            //关闭城市容器:0
            Methods.prototype.hideContainer = function(type){
                //type说明：0 是因选择触发，1 是手动点击全局关闭
                //mode说明：0 是关闭容器，  1 是选择模式，2 是搜索模式
                var $cityContainer = $(config.container).find('.cityContainer');
                var $citySearcherUl = $cityContainer.find('.citySearcher ul');
                var $firstResult = $citySearcherUl.children('li').eq(0);
                
                if($cityContainer.css('display') !== 'none'){
                    
                    if(mode === 2 && type === 1){
                        if(!config.isMultiSelect){//单选
                            
                            if($firstResult.is('.cityNotFound')){//搜索无果 执行清空

                                methods.assign(null);

                            }else{//搜索有果 使用第一个结果赋值
                                activeID = $firstResult.attr('data-id') + ' ';
                                $citySearcherUl.find('li').removeClass('active');
                                $firstResult.addClass('active');

                                methods.assign($firstResult);
                            }
                        }else{//多选

                        }
                        
                    }else if(mode === 1  && !self.find('input[data-role="name"]').val()){
                        if(!config.isMultiSelect){//单选

                            methods.assign(null);
                            
                        }else{//多选

                        }
                    }

                    $cityContainer.addClass('hide').hide();
                    $cityContainer.find('.citySelector').addClass('hide').hide();
                    $cityContainer.find('.citySearcher').addClass('hide').hide();

                    config.hideCall.call(self);
                    mode = 0;
                }
                
            };

            //显示选择器:1
            Methods.prototype.showSelector = function(){
                var $cityContainer = $(config.container).find('.cityContainer');
                //重新渲染选择器，以更新active状态
                $cityContainer.find('.citySelector .cityBox').empty().html(methods.renderSelector($cityContainer.find('.citySelector .cityMenu>li.active').text()));

                $cityContainer.removeClass('hide').show();
                $cityContainer.find('.citySelector').removeClass('hide').show();
                $cityContainer.find('.citySearcher').addClass('hide').hide();
                mode = 1; 
            };

            //显示搜索器:2
            Methods.prototype.showSearcher = function(){
                var $cityContainer = $(config.container).find('.cityContainer');

                $cityContainer.removeClass('hide').show();
                $cityContainer.find('.citySelector').addClass('hide').hide();
                $cityContainer.find('.citySearcher').removeClass('hide').show();
                mode = 2;
            };


            

            methods = new Methods();

            

            /**定义选择事件集合********************************/

            //全局事件：关闭
            $(document).on('click',function(){
                methods.hideContainer(1);
                return;
            });

            //注销城市容器的全局关闭事件
            $(config.container).on('click','.cityContainer',function(e){
                methods.stopPropagation(e);
            });

            //点击关闭按钮
            $(config.container).on('click','.cityContainer .cityClose',function(){
                methods.hideContainer(1);
            });


            //点击绑定的元素
            $body.find(self).on('click',function(e){
                methods.stopPropagation(e);
                var $cityContainer = $(config.container).find('.cityContainer');
                if(mode === 1 || mode === 2){
                    return;
                }
                $cityContainer.css({
                    top: self.offset().top + self.outerHeight() + 10 + 'px',
                    left: self.offset().left + 'px'
                });

                methods.showSelector();
            });

            //点击cityMenu
            $(config.container).on('click','.cityContainer .citySelector .cityMenu li',function(){
                var $this = $(this);
                if($this.is('.active')){
                    return;
                }else{
                    $this.parent('.cityMenu').children('li').removeClass('active');
                    $this.addClass('active');
                    $(config.container).find('.cityContainer .citySelector .cityBox').empty().html(methods.renderSelector($this.text()));
                }
            });

            //点击城市
            $(config.container).on('click','.cityContainer .citySelector .cityBox a',function(){
                var $this = $(this);
                var $cityContainer = $(config.container).find('.cityContainer');
                var $activeMenu = $cityContainer.find('.citySelector .cityMenu li.active');

                if(config.isMultiSelect){//多选
                    if($this.is('.active')){
                        return;

                    }else{
                        activeID += $this.attr('data-id') + ' ';
                        $this.addClass('active');

                        methods.assign($this);
                    }
                
                }else{//单选
                    methods.manageActiveID($this.attr('data-id') + ' ');
                    // if($this.is('.active')){
                    //     methods.hideContainer(0);
                    //     return;

                    // }else{
                        // activeID = $this.attr('data-id') + ' ';
                        $cityContainer.find('.citySelector a').removeClass('active');
                        $this.addClass('active');

                        methods.assign($this);
                        methods.hideContainer(0);
                    // }
                }
            });



            /**定义搜索 事件集合********************************/

            //搜索开始
            $body.find(self).on('keyup','input[data-role="name"]',function(e){
                var $cityContainer = $(config.container).find('.cityContainer');
                if(e.target.value){
                    methods.showSearcher();
                    
                    $(config.container).find('.cityContainer .citySearcher ul').empty().html(methods.renderSearcher(e.target.value));
                }else{
                    methods.manageActiveID('');
                    methods.showSelector();
                }
            });

            //点击搜索结果
            $(config.container).on('click','.cityContainer .citySearcher li:not(.cityNotFound)',function(){
                var $this = $(this);
                var $cityContainer = $(config.container).find('.cityContainer');
                var $citySearcherUl = $cityContainer.find('.citySearcher ul');

                if(!config.isMultiSelect){//单选
                    methods.manageActiveID($this.attr('data-id') + ' ');

                    $citySearcherUl.find('li').removeClass('active');
                    $this.addClass('active');

                    methods.assign($this);
                    methods.hideContainer(0);

                }else{//多选

                }

            });



            return self.each(function(){
                methods.filter();
                methods.hot();
                methods.group();
                methods.init();

                console.log(dataJson);
                console.log(group);
                
            });

        }

    });





}(jQuery, window, document, undefined));


