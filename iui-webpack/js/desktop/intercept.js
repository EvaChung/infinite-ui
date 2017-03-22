/**
 * intercept 组件
 * @param  {boolean} fixedWidth 为true的时候，支持多个选框，默认default
 * @param  {number} rangeWidth 选框宽度，默认80
 * @param  {number} rangeHeight 选框高度，默认80
 * @param  {number} maxRangeWidth 选框最大宽度
 * @param  {number} minRangeWidth 选框最小宽度
 * @param  {number} maxRangeHeight 选框最大高度
 * @return {number}   minRangeHeight 选框最小高度
 * @return {object}   $preview 预览目标元素
 * @return {function}   intercept 选择后回调
 */
let settings = {
    fixedWidth: false,
    rangeWidth: 80,
    rangeHeight: 80,
    maxRangeWidth: Infinity,
    minRangeWidth: 40,
    maxRangeHeight: Infinity,
    minRangeHeight: 40,
    $preview: null,
    intercept: function(){}
};

let control = {
    wrapWidth: 0, // 容易宽度
    wrapHeight: 0,// 容易高度
    // 选择框模板
    rangeTemplate:   '<div class="intercept-filter"><div class="intercept-bg bg-top"></div>' +
                '<div class="intercept-bg bg-right"></div>' +
                '<div class="intercept-bg bg-bottom"></div>' +
                '<div class="intercept-bg bg-left"></div>' +
                '<div class="intercept-range">' +
                    '<span class="range range-1"></span>' +
                    '<span class="range range-2"></span>' +
                    '<span class="range range-3"></span>' +
                    '<span class="range range-4"></span>' +
                    '<span class="range range-5"></span>' +
                    '<span class="range range-6"></span>' +
                    '<span class="range range-7"></span>' +
                    '<span class="range range-8"></span>' +
                    '<span class="range-b range-b1"></span>' +
                    '<span class="range-b range-b2"></span>' +
                    '<span class="range-b range-b3"></span>' +
                    '<span class="range-b range-b4"></span>' +
                '</div></div>',
    // 预览遮罩模板
    previewTemplate: '<div class="intercept-bg bg-top"></div>' +
                '<div class="intercept-bg bg-right"></div>' +
                '<div class="intercept-bg bg-bottom"></div>' +
                '<div class="intercept-bg bg-left"></div>',
    info: {current: {}}, // 记录选择框对应的实际图片信息
    prevHtml: {}, // 当前选择框的上一个位置
    factor: 1,  // 图片的缩放比率
    imgWidth: 0, // 图片没有缩放的时候的高和宽
    imgHeight: 0, // 图片没有缩放的时候的高和宽
    imgTop: 0,  // 图片初始位置偏移值
    imgLeft: 0, // 图片初始位置偏移值
    cursor: '', // 当改变range（mousemove）大小的时候，cursor可能不一致，用来控制一致
};


function Intercept(options, $el){
    this.config = $.extend(true, {}, settings, options);
    this.control = $.extend(true, {}, control);
    this.$ = $el;
    this.$img = $el.find('img');
    this.init(options);
}

Intercept.prototype = {
    init(){
        let _this = this;
        let $$ = this.$;
        let $img = $$.find('img');

        $$.append(this.control.rangeTemplate);

        // 预览需要添加预览滤镜
        if (this.config.$preview) {
            this.config.$preview.append(this.control.previewTemplate).append($img.clone());
        }

        this.setEvent();

        // 图片换了需要重新渲染
        $img.on('load', function(event) {
            reInit.call(_this, $img);
        });

        // 第一次图片的 load 可能没有执行
        if($img[0].readyState=="complete" || $img[0].readyState=="loaded"){
            reInit.call(_this, $img);
        }

    },
    // 图片自适应到容器中
    imgResponse(wrapW, wrapH, imgW, imgH, $img, preview){
        // 图片宽高大于容易才需要缩放
        // 预览除外，都需要缩放
        if (preview) {
            if (imgW/wrapW > imgH/wrapH) {
                $img.width(wrapW);
                $img.height(wrapW/imgW*imgH); // 这是需要的，因为 new Image()生成的图片无法自动改变高度（宽度）
            }else{
                $img.height(wrapH);
                $img.width(wrapH/imgH*imgW); // 这是需要的，因为 new Image()生成的图片无法自动改变高度（宽度）
            }
        }else if (imgW > wrapW || imgH > wrapH) {
            if (imgW / imgH > wrapW / wrapH) {
                $img.width(wrapW);
                //$img.height(wrapW/imgW*imgH);
            }else{
                $img.height(wrapH);
                //$img.width(wrapH/imgH*imgW);
            }

        }
    },
    // 图片位置和选框位置初始化
    setTargetSize(){
        let _this = this;
        let _config = _this.config;
        let _control = _this.control;
        let $$ = _this.$;
        let [wrapW, wrapH] = [$$.width(), $$.height()];
        let $target = this.$.find('.intercept-target');
        //let img = new Image();
        let [rangeHeight, rangeWidth] = [_config.rangeHeight, _config.rangeWidth];
        let [marginTop, marginLeft] = [-rangeHeight/2, -rangeWidth/2];
        let $range;

        // 记录图片原始宽高，不然比例不正确
        if (!$target.data('wh')) {
            $target.data('wh', [$target.width(), $target.height()]);
        }

        let [tarW, tarH] = $target.data('wh');
        let left,top;

        _this.imgResponse(wrapW, wrapH, tarW, tarH, $target);
        _control.factor = tarW / $target.width();
        tarW = $target.width();
        tarH = $target.height();

        [left, top] = [(wrapW - tarW)/2, (wrapH - tarH)/2];

        $target.css({
            'margin-top': top,
            'margin-left': left
        });

        // 记录图片适应后的值
        _control.imgLeft = left;
        _control.imgTop = top;
        _control.imgWidth = tarW;
        _control.imgHeight = tarH;

        // 记录容器大小
        _control.wrapWidth = wrapW;
        _control.wrapHeight = wrapH;

        // 初始化选择框的位置
        $range = $$.find('.intercept-range');
        $range.css({
            width: _config.rangeWidth,
            height: rangeHeight,
            left: parseFloat($range.css('left')) + marginLeft,
            top: parseFloat($range.css('top')) + marginTop
        });

        _this.createFilter();
    },
    // 生成截图时的滤镜
    createFilter(){
        let _this = this;
        let _config = _this.config;
        let _control = _this.control;
        let $$ = _this.$;
        let [rangeHeight, rangeWidth] = [_config.rangeHeight, _config.rangeWidth];
        let $range;
        let top, left, bottom;

        $range = $$.find('.intercept-range');
        top = parseFloat($range.css('top'));
        left = parseFloat($range.css('left'));
        bottom = _control.wrapHeight - rangeHeight - top;

        $$.find('.bg-top').css({height: top});
        $$.find('.bg-right').css({
            width: _control.wrapWidth - rangeWidth - left,
            top: top,
            bottom: bottom
        });
        $$.find('.bg-bottom').css({height: bottom });
        $$.find('.bg-left').css({
            width: left,
            top: top,
            bottom: bottom
        });
    },
    setEvent(){
        let _this = this;
        let $$ = _this.$;
        let _config = _this.config;
        let _control = _this.control;
        let moveRange = false;
        let changeRange = false;
        let starX, starY, starTop, starLeft, starWidth, starHeight;

        function changeRangeSize(event){
            let [diffX, diffY, left, top, width, height] = [event.clientX - starX,event.clientY - starY,0,0,0,0];
            let $this = $(this);
            let cursor = $this.css('cursor').match(/.*(?=-)/)[0];
            let $range = $this.parent();

            if (cursor !== _control.cursor) {
                return;
            }


           // json[cursor],等比缩放
            // 大小方向变化
            switch(cursor){
                case 'n':
                    left = 0;
                    top = diffY;
                    height = -diffY;
                    break;
                case 's':
                    left = 0;
                    top = 0;
                    height = diffY;
                    break;
                case 'w':
                    left = diffX;
                    top = 0;
                    width = -diffX;
                    break;
                case 'e':
                    left = 0;
                    top = 0;
                    width = diffX;
                    break;
                case 'nw':
                    left = diffX;
                    top = diffY;
                    height = -diffY;
                    width = -diffX;
                    break;
                case 'ne':
                    left = 0;
                    top = diffY;
                    height = -diffY;
                    width = diffX;
                    break;
                case 'se':
                    left = 0;
                    top = 0;
                    height = diffY;
                    width = diffX;
                    break;
                case 'sw':
                    left = diffX;
                    top = 0;
                    height = diffY;
                    width = -diffX;
                    break;
            }

            width = starWidth + width;
            height = starHeight + height;
            left = starLeft + left;
            top = starTop + top;

            if (left < 0 ||
                top < 0 ||
                left + width > _control.wrapWidth ||
                top + height > _control.wrapHeight) {
                return;
            }

            if (width > _config.maxRangeWidth ||
                height > _config.maxRangeHeight ||
                width < _config.minRangeWidth ||
                height < _config.minRangeHeight) {
                return;
            }

            $range.css({
                width: width,
                height: height,
                left: left,
                top: top
            });

            _config.rangeWidth = width;
            _config.rangeHeight = height;

            _this.createFilter();

            if (_config.$preview) {
                let type = _config.fixedWidth ? _config.rangeWidth + '' + _config.rangeHeight : 'current';
                _this.setInfo(type);
                _this.preview(type);
            }
        }

        $$.on('mousedown', '.intercept-range', function(event) {
            event.preventDefault(); // 这一句特别重要，如果没有就会导致 mouseup 无法触发的情况
            let $this = $(this);

            moveRange = true;
            starX = event.clientX;
            starY = event.clientY;
            starTop = parseFloat($this.css('top'));
            starLeft = parseFloat($this.css('left'));
        });

        $$.on('mousemove', '.intercept-range', function(event) {
            if (moveRange) {
                let $this = $(this);
                let [diffX, diffY] = [event.clientX - starX, event.clientY - starY];
                let [maxLeft, maxTop] = [_control.wrapWidth - _config.rangeWidth, _control.wrapHeight - _config.rangeHeight];

                [diffX, diffY] = [starLeft + diffX, starTop + diffY];

                if (diffX < 0) {
                    diffX = 0;
                }else if(diffX >= maxLeft){
                    diffX = maxLeft;
                }

                if (diffY < 0) {
                    diffY = 0;
                }else if(diffY >= maxTop){
                    diffY = maxTop;
                }

                $this.css({
                    top: diffY,
                    left: diffX
                });
                _this.createFilter();

                if (_config.$preview) {
                    let type = _config.fixedWidth ? _config.rangeWidth + '' + _config.rangeHeight : 'current';
                    _this.setInfo(type);
                    _this.preview(type);
                }
            }
        });

        // 没有固定宽高，可以缩放选择框
        if (!_config.fixedWidth) {
            $$.on('mousedown', '.intercept-range>span', function(event) {
                event.preventDefault(); // 这一句特别重要，如果没有就会导致 mouseup 无法触发的情况
                event.stopPropagation();
                let $this = $(this);
                let $range = $this.parent();

                changeRange = true;
                _control.cursor = $this.css('cursor').match(/.*(?=-)/)[0];
                starX = event.clientX;
                starY = event.clientY;
                starTop = parseFloat($range.css('top'));
                starLeft = parseFloat($range.css('left'));
                starWidth = parseFloat($range.css('width'));
                starHeight = parseFloat($range.css('height'));
            });

            $$.on('mousemove', '.intercept-range>span', function(event) {
                event.stopPropagation();

               if (changeRange) {
                    let _this = this;
                    $$.on('mousemove.intercept-changeSize', function(event) {
                        changeRangeSize.call(_this, event);
                    });
                    changeRangeSize.call(_this, event);
               }
            });

        }


        $$.on('mouseleave mouseup', function(event) {
            let type =  _config.rangeWidth + '' + _config.rangeHeight;
            $$.off('mousemove.intercept-changeSize');
            _control.cursor = '';

            if (moveRange && _config.fixedWidth) {
                // 保留当前html副本
                _control.prevHtml[type] = $$.find('.intercept-filter').html();
                moveRange = false;
                _this.setInfo(type);
                _config.intercept.call(_this, _control.info);
            }

            if (!_config.fixedWidth && (changeRange || moveRange)) {
                changeRange = false;
                moveRange = false;
                type = 'current';
                _this.setInfo(type);
                _config.intercept.call(_this, _control.info);
            }
        });
    },
    // 返回当前选择对应的图片信息
    setInfo(type){
        let _this = this;
        let $$ = _this.$;
        let _config = _this.config;
        let _control = _this.control;
        let item = _control.info[type];
        let fl = Math.floor;
        let $range = $$.find('.intercept-range');
        let [left, top] = [parseFloat($range.css('left')), parseFloat($range.css('top'))];
        let top2, height, left2, width;
        let factor = _control.factor;

        if (!item) {
            item = _control.info[type] = {};
        }

        // 获取所截区域的top、height
        if (top + _config.rangeHeight < _control.imgTop || top > _control.imgTop + _control.imgHeight) {
            item.tip = '选择框没有在图片上';
            item.left = item.top = item.width = item.height = '';
            return false;
        }else{
            top2 = top -_control.imgTop;
            top2 = top2 > 0 ? top2 : 0;
            height = Math.min(top + _config.rangeHeight, _control.imgTop + _control.imgHeight) - _control.imgTop - top2;
        }

        // 实际top、height
        item.top = fl(top2 * factor);
        item.height = fl(height * factor);

        //
        if (left + _config.rangeWidth < _control.imgLeft || left > _control.imgLeft + _control.imgWidth) {
            item.left = item.top = item.width = item.height = '';
            item.tip = '选择框没有在图片上';
            return false;
        }else{
            left2 = left -_control.imgLeft;
            left2 = left2 > 0 ? left2 : 0;
            width = Math.min(left + _config.rangeWidth, _control.imgLeft + _control.imgWidth) - _control.imgLeft - left2;
        }

        item.left = fl(left2 * factor);
        item.width = fl(width * factor);

        item.tip = '';
    },
    // 重新初始化，比如改变选择框大小的时候
    reInit(changeImage){
        let _control = this.control;
        let _config = this.config;
        let item = _control.prevHtml[_config.rangeWidth + '' + _config.rangeHeight];

        if (changeImage || !item) {
            this.$.find('.intercept-range').css({
                left: '50%',
                top: '50%'
            });
            this.setTargetSize();

             // 如果有预览
            if (_config.$preview) {
                let type = _config.fixedWidth ? _config.rangeWidth + '' + _config.rangeHeight : 'current';
                this.setInfo(type);
                this.preview(type);
            }
        }else{
            this.$.find('.intercept-filter').html(item);
        }
    },
    // 创建预览的滤镜
    createPreviewFilter(wrapW, wrapH, imgW, imgH, $$){
        let[left, top] = [(wrapW - imgW)/2, (wrapH - imgH)/2];
        $$.find('.bg-top,.bg-bottom').css({height: top});
        $$.find('.bg-right,.bg-left').css({
            width: left,
            top: top,
            bottom: top
        });
        return [left, top];
    },
    // 预览
    preview(type){
        let _this = this;
        let _control = _this.control;
        let item = $.extend(true, {}, _control.info[type]);

        if (item) {
            if (item.tip) {
                item.left = item.top = item.width = item.height = 0;
            }

            this.config.$preview.each(function(index, el) {
                let $el = $(el);
                let $img = $el.find('img');
                let $imgTemp = $(new Image());
                let [wrapW, wrapH] = [$el.width(), $el.height()];


                _this.imgResponse(wrapW, wrapH, item.width, item.height, $imgTemp, true);

                let [left, top] = _this.createPreviewFilter(wrapW, wrapH, $imgTemp.width(), $imgTemp.height(), $el);
                let factor = $imgTemp.width()/item.width;
                let width = factor*_this.$img.data('wh')[0];

                $img.css({
                    width: width,
                    top: -factor*(item.top)+top,
                    left: -factor*(item.left)+left,
                });
            });
        }
    }
};

$.fn.intercept = function(options){
    return this.each((index, el) => {
        let $el = $(el);

        if (!$el.data('intercept')) {
            $el.data('intercept', new Intercept(options, $el));
        }
    });
};

function reInit($img){
    $img.data('wh', false).removeAttr('style');
    this.reInit(true);
    //this.control.info = {};
    this.config.intercept.call(this, this.control.info);
}

module.exports = {
    intercept:function(config) {
        this.intercept(config);
    }
};
