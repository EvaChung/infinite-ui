/**
 * tokenize 组件
 * @param  {function} overLimitCount 选择超过个数
 * @return {function}   existToken 已经存在
 * .tokenize > select + ul + .token > .token-item
 */
;(function($){
		var defaults = {
			overLimitCount: function(){},
			existToken: function(){}
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
			parentStr: '.tokenize',
			spanTemplate: ['<span class="token-item">',
							'<span>{text}</span><span data-value="{value}" class="token-close">x</span>',
						'</span>'].join(''),
			optionTemplate: '<option selected="selected" value="{value}">{value}</option>',
			liTemplate: '<li class="hidden" data-value="{value}">{value}</li>',
			inputTemplate: '<div class="token"> <span> <input type="text"> </span> </div>'
		};

		var tokenize = $.fn.tokenize = function(options){
			$.extend( defaults, options);

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
				tokenize.setEvent($this);
				//创建默认token
				$this.find('li[uled]').addClass('current').trigger('click');
			});
		};


		//模拟下拉框
		tokenize.renderSelect = function($target){
			var htmlStr = $target.find('select').prop('outerHTML');
			htmlStr = (htmlStr + '').replace(/select/g, 'ul').replace(/option/g, 'li class="hide"').replace(/value/g, 'data-value');
			$target.append(htmlStr);
		};

		//创建token
		tokenize.createToken = function(text, value){
			var $inp = $(this).parents(htmlTemplate.parentStr).find('input').val('');
			var $token = $inp.parent();
			var str = htmlTemplate.spanTemplate.replace('{text}', text).replace('{value}', value);
			$(str).insertBefore($token);
		};

		//设置事件
		tokenize.setEvent = function($target){

			//删除token
			$target.on('click', '.token-close', function(event) {
				event.stopPropagation();
				var $this = $(this);
				var $tokenize = $this.parents(htmlTemplate.parentStr);
				var value = $this.attr('data-value');
				var $tokens = tokenize.hideToken($tokenize);
				$tokenize.find('option[value="'+value+'"]').removeAttr('selected');
				$tokens.filter('li[data-value="'+value+'"]').removeClass('hidden');
				$this.parent('.token-item').remove();
			});
			//聚焦输入
			$target.on('click', '.token', function(event) {
				event.stopPropagation();
				var $this = $(this);
				$this.find('input').focus();
				tokenize.searchToken.call($this.find('input')[0], event);
			});
			//点击li设置token
			$target.on('click', 'li', function(event) {
				tokenize.setToken.call(this);
			});

			//输入搜索token
			$target.on('keyup', 'input', function(event) {
				var keycode = event.keyCode;
				var KC = KEY_CODE;

				(keycode !== KC.enter && keycode !== KC.back && keycode !== KC.bottom && keycode !== KC.top) && tokenize.searchToken.call(this, event);
			});

			//按下enter键设置token
			$target.on('keyup', 'ul,input', function(event) {
				var keycode = event.keyCode;
				var KC = KEY_CODE;
				(keycode === KC.enter || keycode === KC.back) && tokenize.setToken.call(this);
			});

			//按下上下键切换token
			$target.on('keyup', function(event) {
				var keycode = event.keyCode;
				var KC = KEY_CODE;
				(keycode === KC.bottom || keycode === KC.top) && tokenize.turnToken.call(this, keycode);
			});

			//鼠标样式
			$target.on('mouseenter', 'li', function(event) {
				$(this).siblings().removeClass('current').end().addClass('current');
			});
		};

		//输入搜索token
		tokenize.searchToken = function(event){
			var $parent =  $(this).parents(htmlTemplate.parentStr);
			var $lis = $parent.find('ul').removeClass('hide').find('li').removeClass('current').not('.hidden');
			var showAll = $parent.data('showAll');
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
		};

		//按下enter键或者点击 li 设置token
		tokenize.setToken = function(){
			var $tokenize = $(this).parents(htmlTemplate.parentStr);
			var $tokens = $tokenize.find('li');
			//var $visibleTokens = $tokens.filter(':visible');
			var $selectedTokens = $tokens.filter('.current');
			var str;
			var index;
			var $inp = $tokenize.find('.token input');
			var value = $.trim($inp.val());

			if (!tokenize.testCount.call(this)) {
				defaults.overLimitCount($tokenize);
				return;
			}

			if (!tokenize.testExist.call(this)) {
				defaults.existToken($tokenize);
				return;
			}

			//$selectedTokens = $selectedTokens.length ? $selectedTokens : $visibleTokens.eq(0);
			if ($selectedTokens.length) {
				$selectedTokens.removeClass('current').addClass('hidden');

				//创建 token
				tokenize.createToken.call(this, $selectedTokens.text(), $selectedTokens.attr('data-value'));

				//改变select
				index = $tokens.index($selectedTokens);
				$tokenize.find('option').eq(index).attr('selected', 'selected');
			}else if($tokenize.data('create') && value){
				//添加 li
				$tokenize.find('ul').append(htmlTemplate.liTemplate.replace(/\{value\}/g, value));

				//创建 token
				tokenize.createToken.call(this, value, value);

				//修改 select
				$tokenize.find('select').append(htmlTemplate.optionTemplate.replace(/\{value\}/g, value));
			}
			tokenize.hideToken($tokenize);
		};

		//按下上下键切换token
		tokenize.turnToken = function(keycode){
			var $tokens = $(this).find('li');
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
				tokenize.hideToken($(htmlTemplate.parentStr));
			});
			return function($ele){
				return $ele.find('ul').addClass('hide').find('li').addClass('hide');
			};
		}();

		//判断选择的个数
		tokenize.testCount = function(){
			var $tokenize = $(this).parents(htmlTemplate.parentStr);
			var limitCount = $tokenize.data('limitCount');
			var length = $tokenize.find('.token-item').length;
			if (limitCount !== Infinity) {
				if (length >= limitCount) {
					return false;
				}
			}
			return true;
		};

		//判断是否已经存在
		tokenize.testExist = function(){
			var $tokenize = $(this).parents(htmlTemplate.parentStr);
			var text = $.trim($tokenize.find('.token input').val());
			var $tokenItem = $tokenize.find('.token-item');
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

