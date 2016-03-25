/**
 * layer 组件
 * @param  {String}            level               多选框级别
 * @param  {Function}          afterMoveLeft       回调函数 - 移动到左边
 * @param  {Function}          afterMoveRight      回调函数 - 移动到右边
 *
 *
 * @example
 *
 * $('.multiselect-main')IUI('multiselect',function(options));

 *
 * html基本结构
 * div.multiselect-box>ul.multiselect>li
 *
 * 二级
 *div.multiselect-box>ul.multiselect>li>div.mul-title+li.level-2
 */
$.fn.IUI({
    multiselect: function(options) {
        var defaults = {
            level: 1,
            dataJson: '',
            afterMoveLeft: function() {},
            afterMoveRight: function() {}
        };
        var self = this;
        var multiObject;
        /**
         * 元素字典
         */
        var data = {
            self: {
                ele: '.multiselect',
                contraryEle: '.multiselect-to'
            },
            to: {
                ele: '.multiselect-to',
                contraryEle: '.multiselect'
            }
        };
        var data2 = {
            self: {
                ele: '.multiselect .level-2',
                contraryEle: '.multiselect-to .level-2'
            },
            to: {
                ele: '.multiselect-to .level-2',
                contraryEle: '.multiselect .level-2'
            }
        };

        self.$container = $(this);
        self.$multi = self.$container.find('.multiselect');
        self.$multiTo = self.$container.find('.multiselect-to');
        self.config = $.extend({}, defaults, options);

        /**
         * 按下control||command键||shift键操作
         */
        $(window).on('keydown.win', function(e) {
            e.preventDefault();
            switch (e.which) {
                case 17:
                case 91:
                    //control||command键
                    self.$container.data('type', 'mul');
                    break;
                case 16:
                    //shift键
                    self.$container.data('type', 'continu');
                    break;
            }
        });
        /**
         * 松开键盘清除data
         */
        $(window).on('keyup.win', function(e) {
            e.preventDefault();
            self.$container.data('type', '');
        });
        /**
         * 存储命令模式所需的：函数，值，方向
         */
        var Command = function(execute, value, dire) {
            this.execute = execute;
            this.value = value;
            this.dire = dire;
        };
        /**
         * 单例存储撤销，返回撤销，操作。
         */
        var Calculator = function() {
            var commands = [];
            var redoCommands = [];

            return {
                execute: function(command) {
                    command.execute();
                    commands.push(command);
                    multiObject.setValue(command.dire);
                },
                /**
                 * 撤销操作。
                 */
                undo: function() {
                    //pop():删除并返回数组的最后一个元素
                    if (!commands[0]) {
                        return false;
                    }
                    var command = commands.pop();
                    redoCommands.push(command);
                    multiObject.undo(command.value, command.dire);
                    multiObject.setValue(command.dire);
                },
                /**
                 * 取消撤销。
                 */
                redo: function() {
                    if (!redoCommands[0]) {
                        return false;
                    }
                    var redoCommand = redoCommands.pop();
                    commands.push(redoCommand);
                    multiObject.redo(redoCommand.value, redoCommand.dire);
                    multiObject.setValue(redoCommand.dire);
                }
            };
        };

        function Multiselect() {
            this.calculator = new Calculator();
            this.init();
        }
        Multiselect.prototype = {
            init: function() {
                self.mulData = self.config.level >= 2 ? data2 : data;
                this.render(self.config.dataJson);
                this.setCommandFn();
                this.events();
                this.operateEvent();
            },
            /**
             * 初始化渲染html
             */
            render: function(json) {
                var result = concatHtml(json);
                self.$multi.append(result.item);
                self.$container.find('select').css('display', 'none').append(result.option);
                /**
                 * 有标题的情况
                 */
                if (self.config.level >= 2) {
                    self.mulData = data2;
                    self.$multiTo.append(self.$multi.children().clone());
                    self.$multiTo.find('.level-2 li').remove();
                    self.$container.on('click', '.mul-title', function() {
                        $(this).toggleClass('active').parent('li').find('.level-2').toggleClass('hide');
                    });
                }
            },
            /**
             * 设置操作函数
             */
            setCommandFn: function() {
                var _this = this;
                self.setCommand = function(ele, fn) {
                    var id = _this.getId(ele);
                    _this.calculator.execute(fn(id));
                };
                self.moveTo = function() {
                    MoveItemAndSort('to');
                };
                self.move = function() {
                    MoveItemAndSort('self');
                };
                self.moveToAll = function() {
                    MoveItemAndSort('to', 'all');
                };
                self.moveAll = function() {
                    MoveItemAndSort('self', 'all');
                };
                self.moveToTitle = function() {
                    MoveItemAndSort('to', 'title');
                };

                self.moveTitle = function() {
                    MoveItemAndSort('self', 'title');
                };

                //右到左
                self.toCommand = function(value) {
                    /*****************(execute,id,dire)******/
                    return new Command(self.moveTo, value, 'to');
                };
                //左到右
                self.selfCommand = function(value) {
                    return new Command(self.move, value, 'self');
                };

                self.allToCommand = function(value) {
                    return new Command(self.moveToAll, value, 'to');
                };

                self.allSelfCommand = function(value) {
                    return new Command(self.moveAll, value, 'self');
                };
                self.titleToCommand = function(value) {
                    return new Command(self.moveToTitle, value, 'to');
                };

                self.titleSelfCommand = function(value) {
                    return new Command(self.moveTitle, value, 'self');
                };
            },
            /**
             * 设置item事件函数
             */
            events: function() {
                var _this = this;
                var selfLi = self.mulData.self.ele + ' li';
                var toLi = self.mulData.to.ele + ' li';
                /**
                 * 单击item
                 */
                self.$container.on('click', selfLi, function(e) {
                    _this.itemClick($(this), 'self');
                });

                self.$container.on('click', toLi, function(e) {
                    _this.itemClick($(this), 'to');
                });
                /**
                 * 双击item
                 */
                self.$container.on('dblclick', selfLi, function(e) {
                    var $ele = $(this);
                    self.setCommand($ele, self.selfCommand);
                });
                self.$container.on('dblclick', toLi, function(e) {
                    var $ele = $(this);
                    self.setCommand($ele, self.toCommand);
                });
                /**
                 * 双击标题移动
                 */
                if (self.config.level >= 2) {
                    self.$multi.on('dblclick', '.mul-title', function(e) {
                        _this.moveTitle($(this));
                    });
                    self.$multiTo.on('dblclick', '.mul-title', function(e) {
                        _this.moveToTitle($(this));
                    });
                }
            },
            /**
             * 移动按钮点击事件函数
             */
            operateEvent: function() {
                var _this = this;
                if (!self.$container.find('.mutiselect-right').length) {
                    return;
                }
                self.$container.on('click', '.mutiselect-right', function() {
                    _this.move();
                });
                self.$container.on('click', '.mutiselect-left', function() {
                    _this.moveTo();
                });
                self.$container.on('click', '.mutiselect-rightAll', function() {
                    _this.moveAll();
                });
                self.$container.on('click', '.mutiselect-leftAll', function() {
                    _this.moveToAll();
                });
                self.$container.on('click', '.mutiselect-undo', function() {
                    _this.calculator.undo();
                });
                self.$container.on('click', '.mutiselect-redo', function() {
                    _this.calculator.redo();
                });
            },
            /**
             * 配合键盘control||command,shift按键点击事件函数
             */
            itemClick: function(ele, dire) {
                var type = self.$container.data('type');
                var $list = ele.parent('ul');
                var $item = $list.find('li');
                var _item = self.mulData[dire].ele + ' li';
                /**
                 * control||command
                 */
                if (type == 'mul') {
                    ele.toggleClass('current');
                    return;
                }
                /**
                 * shift
                 */
                if (type == 'continu') {
                    var $first = $list.find('li.current').eq(0);
                    var firstIndex = $item.index($first);
                    var index = $item.index(ele);
                    var begin = index > firstIndex ? firstIndex : index;
                    var end = index < firstIndex ? firstIndex : index;
                    if (firstIndex < 0) {
                        ele.addClass('current');
                        return;
                    }

                    $item.removeClass('current');
                    for (var i = begin; i <= end; i++) {
                        $item.eq(i).addClass('current');
                    }
                    return;
                }
                self.$container.find(_item).removeClass('current');
                ele.addClass('current');
            },
            getId: function(ele) {
                var id = [];
                var $ele = ele;
                $.each($ele, function(index, ele) {
                    id.push($(ele).data('id'));

                });
                id = id.join(',');
                return id;
            },
            /**
             * 从右到左
             */
            moveTo: function() {
                var $ele = self.$multiTo.find('li.current');
                self.setCommand($ele, self.toCommand);
            },
            /**
             * 从左到右
             */
            move: function() {
                var $ele = self.$multi.find('li.current');
                self.setCommand($ele, self.selfCommand);
            },
            moveToAll: function() {
                var $ele = self.$multiTo.find('li');
                self.setCommand($ele, self.allToCommand);
            },
            moveAll: function() {
                var $ele = self.$multi.find('li');
                self.setCommand($ele, self.allSelfCommand);
            },
            moveToTitle: function(obj) {
                var $ele = obj.parent('li').find('.level-2 li');
                obj.addClass('current');
                self.setCommand($ele, self.titleToCommand);
            },

            moveTitle: function(obj) {
                var $ele = obj.parent('li').find('.level-2 li');
                obj.addClass('current');
                self.setCommand($ele, self.titleSelfCommand);
            },
            undo: function(value, dire) {
                var $eleTo = self.$container.find(self.mulData[dire].contraryEle);
                var $ele = self.$container.find(self.mulData[dire].ele);
                var id = value.split(',');

                var html = [];
                for (var i = 0; i < id.length; i++) {
                    var $obj = $eleTo.find('li[data-id="' + id[i] + '"]');
                    html.push($obj);
                }
                if (self.config.level >= 2) {
                    SortItemLevel2Helper(html, $ele);
                    return;
                }
                $ele.append(html);
                SortItemHelper($ele);
            },
            redo: function(value, dire) {
                var $eleTo = self.$container.find(self.mulData[dire].ele);
                var $ele = self.$container.find(self.mulData[dire].contraryEle);
                var id = value.split(',');

                var html = [];
                for (var i = 0; i < id.length; i++) {
                    var $obj = $eleTo.find('li[data-id="' + id[i] + '"]');
                    html.push($obj);
                }
                if (self.config.level >= 2) {
                    SortItemLevel2Helper(html, $ele);
                    return;
                }
                $ele.append(html);
                SortItemHelper($ele);
            },
            /**
             * 设置select选中值
             */
            setValue: function(dire) {
                var $ele = self.$container.find(self.mulData.to.ele + ' li');
                var value = [];
                self.$container.find('select option').prop("selected", false);
                $.each($ele, function(index, ele) {
                    self.$container.find('select option[value="' + $(ele).data('value') + '"]').prop("selected", true);
                });
                switch (dire) {
                    case "to":
                        self.config.afterMoveLeft();
                        break;
                    case "self":
                        self.config.afterMoveRight();
                        break;
                }
            }
        };

        multiObject = new Multiselect();

        /**
         * 拼接html
         * option,li
         */
        function concatHtml(json) {
            var htmlItem = '';
            var htmlItem2 = '';
            var htmlOption = '';
            if (self.config.level === 1) {
                for (var i = 0; i < json.length; i++) {
                    htmlItem += '<li data-id="' + (i + 1) + '" data-value="' + json[i].value + '">' + json[i].name + '</li>';
                    htmlOption += '<option data-id="' + (i + 1) + '" value="' + json[i].value + '">' + json[i].name + '</option>';
                }
            }
            if (self.config.level === 2) {
                for (var k = 0; k < json.length; k++) {
                    htmlItem2 = '';
                    for (var j = 0; j < json[k].child.length; j++) {
                        htmlItem2 += '<li data-id="' + ((k + 1) * 10 + (j + 1)) + '" data-value="' + json[k].child[j].value + '">' + json[k].child[j].name + '</li>';
                        htmlOption += '<option data-id="' + ((k + 1) * 10 + (j + 1)) + '" value="' + json[k].child[j].value + '">' + json[k].child[j].name + '</option>';
                    }
                    htmlItem += '<li data-id="' + (k + 1) + '">' + '<div class="mul-title">' + json[k].name + '</div><ul class="level-2">' + htmlItem2 + '</ul></li>';
                }
            }
            return {
                option: htmlOption,
                item: htmlItem
            };
        }

        /**
         * 排序：1=》获取id 2=>从小到大排列 3=》拼接html
         */
        function SortItemHelper($ele) {
            var $itemTo = $ele.find('li');
            var _array = [];
            var html = [];
            var $obj;
            for (var i = 0; i < $itemTo.length; i++) {
                var id = $itemTo.eq(i).data('id');
                _array.push(id);
            }
            Array.prototype.sort.call(_array,function(x,y) {
                return x - y;
            });
            for (var j = 0; j < _array.length; j++) {
                $obj = $ele.find('li[data-id="' + _array[j] + '"]');
                html.push($obj);
            }
            $ele.html('').append(html);
        }
        /**
         * ele:原来所在多选框  eleTo：将要移过去的多选框
         * 有二级时，移动和排序
         */
        function SortItemLevel2Helper(ele, eleto) {
            $.each(ele, function(index, obj) {
                obj = obj instanceof $ ? obj : $(obj);
                var id = obj.data('id');
                var _index = Math.floor(id / 10) - 1;
                eleto.eq(_index).append(obj);
            });
            $.each(eleto, function(index, obj) {
                SortItemHelper($(obj));
            });
        }

        /**
         * dire:移动方向
         * all:确定移动对象 全部||标题||li
         * 有二级时，进行移动和排序
         */
        function MoveItemAndSort(dire, all) {
            var $ele = self.$container.find(self.mulData[dire].ele + ' li.current');
            var $eleAll = self.$container.find(self.mulData[dire].ele + ' li');
            var $eleTo = self.$container.find(self.mulData[dire].contraryEle);
            if (all === 'all') {
                $ele = $eleAll;
            }
            if (all === 'title') {
                $ele = $('.mul-title.current').parent('li').find('.level-2 li');
                $('.mul-title').removeClass('current');
            }
            if (self.config.level >= 2) {
                SortItemLevel2Helper($ele, $eleTo);
                return;
            }
            $eleTo.append($ele);
            SortItemHelper($eleTo);
        }

        return {
            moveRight: function(ele) {
                ele.addClass('current');
                self.setCommand(ele, self.selfCommand);
            },
            moveLeft: function(ele) {
                ele.addClass('current');
                self.setCommand(ele, self.toCommand);
            },
            moveRightAll: function() {
                var eleAll = self.$multi.find('li');
                self.setCommand(eleAll, self.allSelfCommand);
            },
            moveLeftAll: function() {
                var eleAll = self.$multiTo.find('li');
                self.setCommand(eleAll, self.allToCommand);
            },
            updateJson: function(json, level) {
                self.$multi.html('');
                self.$multiTo.html('');
                self.$container.find('select').html('');
                multiObject.calculator = new Calculator();
                if (level && level != self.config.level) {
                    self.config.level = Math.min(2, level);
                    self.mulData = self.config.level >= 2 ? data2 : data;
                }
                multiObject.render(json);
                multiObject.events();
            }
        };
    }
});
