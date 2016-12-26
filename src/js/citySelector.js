;(function($, window, document, undefined) {

    function CitySelector(config,selector){
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

        this.config = $.extend({},defaults,config || {});
        this.$selector = selector;
        this.dataJson = {};         //储存过滤后的省市json,{collection:[],province:[],city:[]}
        this.group = {};            //储存根据字母分组后的json,{hotCity:[],A:[],...}
        this.mode = 0;              //当前模式，0为关闭容器，1为选择模式，2为搜索模式
        this.activeID = '';         //储存active城市ID

        this.filter();
        this.hot();
        this.divide();
        this.init();
        this.bindSelectEvent();
        this.bindSearchEvent();

        console.log(this.dataJson);
        console.log(this.group);

    };
    

    //省市json过滤器
    CitySelector.prototype.filter = function(){
        var self = this;
        var config = self.config;
        var province = [],city = [];

        $.each(config.cityData, function(i,n) {
            if(n[config.map.parentId] === config.map.levelOne){
                province.push(n);
            }else{
                city.push(n);
            }
        });
        self.dataJson.province = province;
        self.dataJson.city = city;

        $.each(province, function(i,n) {
            n.children = [];
            $.each(city, function(j,k){
                if(n.id === k.parentId){
                    n.children.push(k);
                }
            });
        });
        self.dataJson.collection = province;
    };

    //热门省份或城市
    CitySelector.prototype.hot = function(){
        var self = this;
        var config = self.config;
        var data = config.isCityMode ? self.dataJson.city : self.dataJson.province;//根据isCityMode选择省份或城市
        self.group.hotCtiy = [];

        if(config.hotCtiy.length){//有传入hotCity参数
            $.each(config.hotCtiy,function(i,n){
                $.each(data,function(j,k){
                    if(k.shortName.indexOf(n) !== -1){
                        self.group.hotCtiy = self.group.hotCtiy.concat(k);
                    }
                });
            });
        }else{//没有传入hotCity参数，取前15项
            if(data.length < 15){
                self.group.hotCtiy = self.group.hotCtiy.concat(data.slice(0));
            }else{
                self.group.hotCtiy = self.group.hotCtiy.concat(data.slice(0,15));
            }
        }
    };

    //根据字母分组
    CitySelector.prototype.divide = function(){
        var self = this;
        var config = self.config;
        var data = config.isCityMode ? self.dataJson.city : self.dataJson.province;//根据isCityMode选择省份或城市

        if(config.group.length){
            $.each(config.group,function(i,n){                 //['ABC',...]
                for(var x = 0;x < n.length; x++){              //'ABC'
                    var letter = n.charAt(x).toUpperCase();
                    self.group[letter] = [];                        //储存字母下的数组，{A:[{},{},{}],B:[{},{}]}
                    
                    $.each(data,function(j,k){
                        if(k.letter.indexOf(letter) === 0){
                            self.group[letter] = self.group[letter].concat(k);
                        }
                    });
                }
            });

        }else{
            throw new Error('the parameter {group} is illegal!');
        }
    };


    //初始化：建立DOM结构
    CitySelector.prototype.init = function(){
        var self = this;
        var config = self.config;

        var hotMenu = config.isCityMode ? "热门城市" : "热门省份";
        var cityMenu = '<li class="active">'+ hotMenu +'</li>';
        var cityClose = config.isMultiSelect ? '<i class="cityClose">×</i>' : '';

        $.each(config.group,function(i,n){
            cityMenu += '<li>'+ n +'</li>';
        });

        if(!config.isSearchMode){
            self.$selector.find('input[role="name"]').prop('readonly',true);
        }

        var cityContainer = '<div class="cityContainer hide">'+
                '<div class="citySelector hide">'+
                    cityClose +
                    '<ul class="cityMenu">'+
                        cityMenu +
                    '</ul>'+
                    '<div class="cityBox">'+
                        self.renderSelector(hotMenu) +
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
    CitySelector.prototype.renderSelector = function(menu){
        var self = this;
        var config = self.config;
        var cityBox = '';

        if(menu.indexOf("热门") >= 0){

            if(!self.group.hotCtiy.length){
                cityBox += '<dl><dt>hot</dt><dd>none<dd></dl>';
            }else{
                var a = '';
                $.each(self.group.hotCtiy,function(i,n){
                    if(self.activeID && (self.activeID.indexOf(n[config.map.id]) >= 0)){//读取储存的active城市并渲染
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

                if(self.group[letter].length){
                    $.each(self.group[letter],function(i,n){
                        if(self.activeID && self.activeID.indexOf(n[config.map.id]) >= 0){//读取储存的active城市并渲染
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
    CitySelector.prototype.renderSearcher = function(val){
        var self = this;
        var config = self.config;

        var data = config.isCityMode ? self.dataJson.city : self.dataJson.province;//根据isCityMode选择省份或城市
        var searchResult = '';

        if(!config.isMultiSelect){//单选模式
            $.each(data,function(i,n){
                if(n.name.search(val) >= 0 || (config.isSearchPinyin ? (n.pinyin.toLowerCase().search(val.toLowerCase()) >= 0) : false)){
                    if(self.activeID && self.activeID.indexOf(n[config.map.id]) >= 0){
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
    CitySelector.prototype.assign = function(that){
        var self = this;
        var config = self.config;

        var $name = self.$selector.find('input[role="name"]'),
            $id = self.$selector.find('input[role="id"]'),
            $pid = self.$selector.find('input[role="pid"]'),
            nameVal = $name.val(),
            idVal = $id.val(),
            pidVal = $pid.val();

        if(that === null){//搜索无果 且关闭，执行清空
            self.activeID = '';
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
    CitySelector.prototype.manageActiveID = function(ID){
        var self = this;
        var config = self.config;

        if(config.isMultiSelect){
            self.activeID += ID;
        }else{
            self.activeID = ID;
        }
    };

    //阻止事件冒泡
    CitySelector.prototype.stopPropagation = function(e){
        if(e.stopPropagation){
            e.stopPropagation();
        }else{
            e.cancelBubble = true;
        }
    };

    //关闭城市容器:0
    CitySelector.prototype.hideContainer = function(type){
        //type说明：0 是因选择触发，1 是手动点击全局关闭
        //mode说明：0 是关闭容器，  1 是选择模式，2 是搜索模式
        var self = this;
        var config = self.config;

        var $cityContainer = $(config.container).find('.cityContainer');
        var $citySearcherUl = $cityContainer.find('.citySearcher ul');
        var $firstResult = $citySearcherUl.children('li').eq(0);
        
        if($cityContainer.css('display') !== 'none'){
            
            if(self.mode === 2 && self.type === 1){
                if(!config.isMultiSelect){//单选
                    
                    if($firstResult.is('.cityNotFound')){//搜索无果 执行清空

                        self.assign(null);

                    }else{//搜索有果 使用第一个结果赋值
                        self.activeID = $firstResult.attr('data-id') + ' ';
                        $citySearcherUl.find('li').removeClass('active');
                        $firstResult.addClass('active');

                        self.assign($firstResult);
                    }
                }else{//多选

                }
                
            }else if(self.mode === 1  && ! self.$selector.find('input[role="name"]').val()){
                if(!config.isMultiSelect){//单选

                    self.assign(null);
                    
                }else{//多选

                }
            }

            $cityContainer.addClass('hide');
            $cityContainer.find('.citySelector').addClass('hide');
            $cityContainer.find('.citySearcher').addClass('hide');

            config.hideCall.call(self);
            self.mode = 0;
        }
        
    };

    //显示选择器:1
    CitySelector.prototype.showSelector = function(){
        var self = this;
        var config = self.config;
        var $cityContainer = $(config.container).find('.cityContainer');

        //重新渲染选择器，以更新active状态
        $cityContainer.find('.citySelector .cityBox').empty().html(self.renderSelector($cityContainer.find('.citySelector .cityMenu>li.active').text()));

        $cityContainer.removeClass('hide');
        $cityContainer.find('.citySelector').removeClass('hide');
        $cityContainer.find('.citySearcher').addClass('hide');
        self.mode = 1; 
    };

    //显示搜索器:2
    CitySelector.prototype.showSearcher = function(){
        var self = this;
        var config = self.config;
        var $cityContainer = $(config.container).find('.cityContainer');

        $cityContainer.removeClass('hide');
        $cityContainer.find('.citySelector').addClass('hide');
        $cityContainer.find('.citySearcher').removeClass('hide');
        self.mode = 2;
    };

    //选择事件集合
    CitySelector.prototype.bindSelectEvent = function(){
        var self = this;
        var config = self.config;

        //全局事件：关闭
        $(document).on('click.citySelector',function(){
            self.hideContainer(1);
            return;
        });

        //注销城市容器的全局关闭事件
        $(config.container).on('click.citySelector','.cityContainer',function(e){
            self.stopPropagation(e);
        });

        //点击关闭按钮
        $(config.container).on('click.citySelector','.cityContainer .cityClose',function(){
            self.hideContainer(1);
        });


        //点击绑定的元素
        $(self.$selector).on('click.citySelector',function(e){
            self.stopPropagation(e);
            var $cityContainer = $(config.container).find('.cityContainer');
            if(self.mode === 1 || self.mode === 2){
                return;
            }
            $cityContainer.css({
                top: self.$selector.offset().top + self.$selector.outerHeight() + 10 + 'px',
                left: self.$selector.offset().left + 'px'
            });

            self.showSelector();
        });

        //点击cityMenu
        $(config.container).on('click.citySelector','.cityContainer .citySelector .cityMenu li',function(){
            var $this = $(this);
            if($this.is('.active')){
                return;
            }else{
                $this.parent('.cityMenu').children('li').removeClass('active');
                $this.addClass('active');
                $(config.container).find('.cityContainer .citySelector .cityBox').empty().html(self.renderSelector($this.text()));
            }
        });

        //点击城市
        $(config.container).on('click.citySelector','.cityContainer .citySelector .cityBox a',function(){
            var $this = $(this);
            var $cityContainer = $(config.container).find('.cityContainer');
            var $activeMenu = $cityContainer.find('.citySelector .cityMenu li.active');

            if(config.isMultiSelect){//多选
                if($this.is('.active')){
                    return;

                }else{
                    self.activeID += $this.attr('data-id') + ' ';
                    $this.addClass('active');

                    self.assign($this);
                }
            
            }else{//单选
                self.manageActiveID($this.attr('data-id') + ' ');
                // if($this.is('.active')){
                //     methods.hideContainer(0);
                //     return;

                // }else{
                    // activeID = $this.attr('data-id') + ' ';
                    $cityContainer.find('.citySelector a').removeClass('active');
                    $this.addClass('active');

                    self.assign($this);
                    self.hideContainer(0);
                // }
            }
        });
    };


    //搜索事件集合
    CitySelector.prototype.bindSearchEvent = function(){
        var self = this;
        var config = self.config;

        //搜索开始
        $(self.$selector).on('keyup.citySelector','input[role="name"]',function(e){
            var $cityContainer = $(config.container).find('.cityContainer');
            if(e.target.value){
                self.showSearcher();
                
                $(config.container).find('.cityContainer .citySearcher ul').empty().html(self.renderSearcher(e.target.value));
            }else{
                self.manageActiveID('');
                self.showSelector();
            }
        });

        //点击搜索结果
        $(config.container).on('click.citySelector','.cityContainer .citySearcher li:not(.cityNotFound)',function(){
            var $this = $(this);
            var $cityContainer = $(config.container).find('.cityContainer');
            var $citySearcherUl = $cityContainer.find('.citySearcher ul');

            if(!config.isMultiSelect){//单选
                self.manageActiveID($this.attr('data-id') + ' ');

                $citySearcherUl.find('li').removeClass('active');
                $this.addClass('active');

                self.assign($this);
                self.hideContainer(0);

            }else{//多选

            }

        });
    };





    $.fn.IUI({
        citySelector: function(config){
            return new CitySelector(config,this);
        }

    });





}(jQuery, window, document, undefined));


