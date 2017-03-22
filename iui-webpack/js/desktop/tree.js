
// 使用 Mock
let Mock = require('mockjs');
let Random = Mock.Random;
Random.cname();
let data=[
  {
    "id": 1,
    "value": 1,
    "name": "江丽",
    "child": [
      {
        "id": 10,
        "value": 10,
        "name": "黄超",
        "child": [
          {
            "id": 100,
            "value": 100,
            "name": "刘勇",
            "child": [
              {
                "id": 200,
                "value": 200,
                "name": "杨伟"
              },
              {
                "id": 300,
                "value": 300,
                "name": "熊勇",
                "child": [
                  {
                    "id": 500,
                    "value": 500,
                    "name": "陆平"
                  },
                  {
                    "id": 600,
                    "value": 600,
                    "name": "黄霞"
                  }
                ]
              }
            ]
          },
          {
            "id": 400,
            "value": 400,
            "name": "崔涛"
          }
        ]
      }
    ]
  },
  {
    "id": 5,
    "value": 5,
    "name": "汤静",
    "child": [
      {
        "id": 50,
        "value": 50,
        "name": "曹磊"
      }
    ]
  }
];


//使用中文转拼音
let pinyin = require("../vendor/pinyin/web-pinyin.js");

let jsonData=data;
//隐藏原型链的值
/*
this.clickTarget(当前点击item),this.jsonDataChild(可点击元素json)
*/
// 输出结果
// console.log(JSON.stringify(data, null, 2))
//>cotainer>content>title+list>content>title+list/item>name+1
//一个列表
//title下一定有list,list下一定有item,list上一定有content.
//content和item并行，上面一定有list,list并行一定有title
//tree-list下可以是content＋item,或者纯item

var template = {
    item:`<div class="tree-item" data-value="{{value}}"> 
                <i class="tree-icon fa {{itemIcon}}" aria-hidden="true"></i>&nbsp; 
                <div class="tree-name">{{name}}</div> 
            </div>`,
    title:`<div class="tree-title">
                <i class="tree-icon fa {{titleIcon}}" aria-hidden="true"></i>&nbsp;
                <div class="tree-name" data-value="{{value}}" data-level="{{level}}" data-id="{{id}}">{{name}}</div>
            </div>`,
    wrap:`<div class="tree-wrap"></div>`,
    span:`<span class="tree-value" data-value="{{value}}">
                {{name}}
                <span class="tree-remove">×</span>
            </span>`,
    search:`<div class="tree-search-content">
                <input type="text" placeholder="请搜索" class="tree-search">
            </div>`,
    container:`<div class="tree-container">
                </div>`              
};
template.content=`<div class="tree-content">`+template.title+`<div class="tree-list">
                    </div>
                </div>`;

let $body=$('body');

// let containerTpl=`<div class="tree-container">
// </div>`;
let defaults = {
    jsonData:jsonData,
    //可配置的json key
    value:'value',
    child:'child',
    name:'name',
    //是否多选
    multiple:true,
    //icon 配置
    itemIcon:['fa-file-text-o','fa-file-text-o'],
    titleIcon:['fa-folder-o','fa-folder-open-o'],
    //是否排序：asc,des,false
    order:'asc',
    //排序属性
    orderProp:'name',
    //是否多选
    isMulti:true,
    //分割字符串
    splitStr: '<br>',
    //是否显示完整路径
    showPath:true,
    //是否开启搜索
    search:true,
    //选中值填充显示到哪里,默认：target
    activeBoxEle:false,
    //选中回调
    afterSelected:function(){},
    //删除回调
    afterRemove:function(){},

};
$body.click(event => {
    let $container=$('.tree-container');
    $container.length?$('.tree-container').remove():false;
});

function Tree($target,options){
    this.target=$target;
    this.options=options;
    this.target.data('tree',this);
    this.activeBoxEle=this.options.activeBoxEle?$(this.options.activeBoxEle):this.target;
    this.activeBoxEle.data('tree',this);
    this.init();
}

Tree.prototype={
    init:function(){
        var self=this;
        //添加外围标签
        var $wrap=$(template.wrap);
        this.target.after($wrap);
        this.wrap=$wrap.append(this.target);
        
        //处理json排序，添加字段
        this.jsonDataHandle();
        this.event();
        
        
        // this.render();
    },
    // 渲染结构    
    render:function(){
        let self=this;
        let html='';
        //添加container
        self.wrap.append(template.container);
        self.container=$('.tree-container');

        let top=getcontainerTop.call(self);
        self.container.css({
            top:top
        });


        let data=self.options.jsonData;
        //渲染html
        data===false?false:self.iteratorAppendHtml();
        self.renderActive();
        //增加父元素路径
        if(self.options.showPath){
            self.addParentPath();
        } 
        //增加父元素路径
        if(self.options.search){
            self.addSearch();
        }    
    },
    //渲染默认值  vals:可选，逗号隔开。不传默认拿target的data-value
    renderActive:function(vals){
        let self=this;
        vals=valToArray.call(self,vals);
        if(!vals){
            return;
        }
        for (let i = 0, len = vals.length; i < len; i++) {
            // console.info(self.container.find('.tree-item[data-value="'+vals[i]+'"]'))
            self.container.find('.tree-item[data-value="'+vals[i]+'"]').addClass('active');
        }
    },

    event:function(){
        let self=this;
        //点击打开选择框
        this.target.off('click.tree').on('click.tree',function(e){
            let $this=$(this);
            self=$this.data('tree');
            if(!$('.tree-container').length){
                self.show();
                self.container.data('tree',self);
            }
            return false;
        })

        //点击展开收起子选项
        $body.off('click.tree').on('click.tree','.tree-container .tree-title',function(e){
            self=$('.tree-container').data('tree');
            let $this=$(this);
            $this.toggleClass('active').siblings('.tree-list').toggleClass('active');
            let i=$this.hasClass('active')?1:0;
            $this.find('.tree-icon').removeClass(self.options.titleIcon[1-i]).addClass(self.options.titleIcon[i]);
        })

        // item选择
        if(self.options.isMulti){
            self.multiEvent();
        }else{
            self.singleEvent();
        }

        //删除
        //有问题，先留着
        // self.activeBoxEle.on('click','.tree-value',function(event){
        //     let $this=$(this);
        //     self=$this.parents('.').data('tree');
        //     let val=self.target.data('value');
        //     self.remove(val);
        //     console.info($this)
        //     $this.remove();
        // });

        $body.on('click.tree','.tree-container',function(e){
            e.stopPropagation();
        })
    },
    // 多选
    multiEvent:function(){
        
        $body.on('click.tree','.tree-container .tree-item',function(e){
            let self=$('.tree-container').data('tree');
            let $this=$(this);
            $this.toggleClass('active');
            self.setValue($this);
        })
    },
    // 单选
    singleEvent:function(){
        $body.on('click.tree','.tree-container .tree-item',function(e){
            let self=$('.tree-container').data('tree');
            let $this=$(this);
            $this.addClass('active'); 
            self.container.find('.tree-item').not($this).removeClass('active');
            self.setValue($this);
            self.hide();
        })
    },
    // 显示
    show:function(){
        this.render();
        // this.container.removeClass('hide');
    },
    // 隐藏
    hide:function(){
        this.container.remove();
    },
    // 更新数据
    update:function(data){
        this.options.jsonData=data;
        this.jsonDataHandle();
    },
     // 删除
    remove:function(val){
        let self=this;
        let vals=self.target.data('value');
        self.removeValue(val,vals);
        if(self.container.length){
            self.container.find('.tree-item[data-value="'+val+'"]').removeClass('active');
        }
    },
    // 设置选中值（$target：tree-item）
    setValue:function($target){
        let self=this;
        let val=$target.data('value');
        self.clickTarget=$target;
        if($target.hasClass('active')){
            self.addValue(val);
            self.options.afterSelected.call(self,val);
        }else{
            self.removeValue(val);
            self.options.afterRemove.call(self,val);
        }   
    },
    // 移除选中值
    removeValue:function(val){
        let self=this;
        //移除val
        let vals=remove.call(self,val);
        self.target.data('value',vals);
        return vals;
    },
    // 添加
    addValue:function(val){
        let self=this;
        let vals=self.target.data('value');
        //添加val
        vals=add.call(self,val);
        self.target.data('value',vals);
        return vals;
    },
    
    // 拼接name值
    getName:function(vals){
        let self=this;
        let result=getName.call(self,vals);
        self.activeBoxEle.html(result);
        return result;
    },
    //添加搜索
    addSearch:function(){
        let self=this;
        self.container.prepend(template.search);
        self.container.on('keyup.tree','.tree-search',function(e){
            if(e.which===13){
                self.search();
            }
        })

    },
    search:function(){
        let self=this;
        let $search=self.container.find('.tree-search');
        let val=$search.val();
        let options=self.options;
        let jsonData=options.jsonData;
        if (!jsonData || !jsonData.length){
            return;
        }
        let stack = [];
        let child=options.child;
        let name=options.name;
        let $container=self.container;
        self.container.find('.tree-content').remove();
        //先将第一层节点放入栈
        for (let i = 0, len = jsonData.length; i < len; i++) {
            stack.push(jsonData[i]);
        }

        let item,isChild;
        while (stack.length) {
            item = stack.shift();
            isChild=hasChild(item,child);
            if(item.jqTreeParentVal===-1){
                 //第一级父元素
                $container.append(item.jqTreeCode);
            }else if(hasChild(item,child)||(item[name].indexOf(val)!=-1)){
                //当前匹配搜索或有子元素
                $container.find('[data-value="'+item.jqTreeParentVal+'"]').closest('.tree-content').find('.tree-list').first().append(item.jqTreeCode);
             
            }

            //如果该节点有子节点，继续添加进入栈顶
            if (hasChild(item,child)) {
                stack = item[child].concat(stack);
            }
        }
        //遍历去除无子元素的部分
        let $list=self.container.find('.tree-list');
        $.each($list,function(index,list){
            if(!$(list).find('.tree-item').length){
                $(list).parents('.tree-content').first().remove();
            }
        })
    },
    // 添加父元素路径到子元素，避免读取元素获得路径影响性能
    addParentPath:function(){
        let self=this;
        let $item=self.container.find('.tree-item');
        let $parent,namePath,valuePath,val,jsonChild;
        //添加父元素路径到子元素：jsonDataChild
        $.each($item,function(index,el){
            namePath=[];
            valuePath=[];
            $parent=$(el).parents('.tree-content');
            val=$(el).data('value');
            jsonChild=self.jsonDataChild[val];
            for (let i=$parent.length-1; i>=0; i--) {
                let $name=$parent.eq(i).find('.tree-name').first();
                namePath.push($name.text());
                valuePath.push($name.data('value'));
            }
            namePath.push(jsonChild.name);
            valuePath.push(val);
            jsonChild.namePath=namePath.join('/');
            jsonChild.valuePath=valuePath.join('/');
        })  
    },
    //处理json排序，添加字段
    jsonDataHandle:function(){
        let self=this;
        if(!(self.options.jsonData&&self.options.jsonData.length)){
            return false;
        }
        //排序
        if(self.options.order!==false){
            self.order();
        }
        self.jsonDataExtend();
    },
    //jsonData增加属性（jqTreeParentVal：父元素值，jqTreeLevel：当前层级，treeId：当前层级index）   
    jsonDataExtend:function() {
        let self=this;
        let options=self.options;
        let jsonData=options.jsonData;
        if (!jsonData || !jsonData.length){
            return;
        }
        let stack = [];
        let child=options.child;
        let oname=options.name;
        let ovalue=options.value;
        self.jsonDataChild={};
        //非递归广度优先
        //先将第一层节点放入栈
        for (let i = 0, len = jsonData.length; i < len; i++) {
            jsonData[i].jqTreeLevel=0;
            jsonData[i].treeId=i;
            jsonData[i].jqTreeParentVal=-1;
            stack.push(jsonData[i]);
        }

        let item,
            level,
            parentId;
        //stack是所有的一级数组
        while (stack.length) {
            item = stack.shift();
            //如果该节点有子节点，继续添加进入栈底
            if (hasChild(item,child)) {
                //有子元素标志
                item.jqTreeHasChild=true;
                //元素层级标志
                level=item.jqTreeLevel+1;
                //对用的html
                item.jqTreeCode=template.content.replace(/{{value}}/g,item[ovalue])
                .replace(/{{name}}/g,item[oname])
                .replace(/{{level}}/g,item.jqTreeLevel)
                .replace(/{{id}}/g,item.treeId)
                .replace(/{{titleIcon}}/g,options.titleIcon[0]);
                //父元素id
                parentId=item[ovalue];
                //长度
                for (let i = 0, len=item[child].length; i < len; i++) {
                    item[child][i].jqTreeLevel=level;
                    item[child][i].jqTreeParentVal=parentId;
                    item[child][i].treeId=i;
                }
                stack = stack.concat(item[child]);
            }else{
                //无子元素
                item.jqTreeHasChild=false;
                //tree-item html
                item.jqTreeCode=template.item.replace(/{{name}}/g,item[oname])
                .replace(/{{itemIcon}}/g,options.itemIcon[0])
                .replace(/{{value}}/g,item[ovalue]);

                self.jsonDataChild[item[ovalue]]=$.extend({},{},item);
            }
        }
        return jsonData;
    },
    //非递归广度优先实现
    iteratorAppendHtml:function() {
        let self=this;
        let options=self.options;
        let jsonData=options.jsonData;
        if (!jsonData || !jsonData.length){
            return;
        }
        let stack = [];
        let child=options.child;
        let $container=self.container;

        //先将第一层节点放入栈
        for (let i = 0, len = jsonData.length; i < len; i++) {
            stack.push(jsonData[i]);
        }

        let item;
        while (stack.length) {
            item = stack.shift();
            if(item.jqTreeParentVal===-1){
                $container.append(item.jqTreeCode);
            }else{
                $container.find('[data-value="'+item.jqTreeParentVal+'"]').closest('.tree-content').find('.tree-list').first().append(item.jqTreeCode);
            }

            //如果该节点有子节点，继续添加进入栈底
            if (hasChild(item,child)) {
                stack = stack.concat(item[child]);
            }
        }
        return jsonData;
    },
    //排序：深度优先算法
    order:function(){
        let self=this;
        let options=self.options;
        let child=options.child;
        let jsonData=options.jsonData;
        if (!jsonData || !jsonData.length) return;
        let stack = [];

        //先将第一层节点放入栈
        jsonData=sortResults.call(self,jsonData);
        for (let i = 0, len = jsonData.length; i < len; i++) {
            stack.push(jsonData[i]);
        }
        let item;

        while (stack.length) {
            item = stack.shift();
            //如果该节点有子节点，继续添加进入栈顶
            if (item[child] && item[child].length) {
                item[child]=sortResults.call(self,item[child]);
                stack = item[child].concat(stack);
            }
        }
        return jsonData;
    },
    //获取选中值的名字，值全路径
    getPath:function(){
        let self=this;
        let options=self.options;
        let child=self.jsonDataChild;
        let vals=self.target.data('value');
        let valuePath='';
        let namePath='';
        let childVal;
        if(vals){
            valuePath=[];
            namePath=[];
            vals=vals.toString().split(',');
            for (let i = 0; i < vals.length; i++) {
                childVal=child[vals[i]];
                valuePath.push(childVal.valuePath);
                namePath.push(childVal.namePath);
            }
            valuePath=valuePath.join(options.split);
            namePath=namePath.join(options.split);
        }
        return {
            valuePath:valuePath,
            namePath:namePath
        }
    }
}
    

//根据val值拼接name
function getName(vals){
    let self=this;
    let $target=self.clickTarget;
    let temp=[];
    let name=self.options.showPath?'namePath':'name';
    for (let i = 0,len=vals.length; i < len; i++) {
        temp.push(template.span
            .replace(/{{name}}/,self.jsonDataChild[vals[i]][name])
            .replace(/{{value}}/,vals[i]));
    }

    return temp.join(self.options.splitStr);
}
//添加val
function add(val){
    let vals=this.target.data('value');
    //单选
    if(!this.options.isMulti){
        vals='';
    }
    if(vals){
        let temp=[];
        vals=vals.toString().split(',');
        vals.push(val);
        //拼接name值
        this.getName(vals);
        vals=vals.join(',');
    }else{
        //this.target.html(this.jsonDataChild[val].name);
        vals=val;
        this.getName([vals]);
    }
    return vals; 
}
//移除val
function remove(val){
    let vals=this.target.data('value');
    //多选，有值
    if(this.options.isMulti&&vals){
        vals=vals.toString().split(',');
        let temp=[];
        for (let i = 0,len= vals.length; i < len; i++) {
            if(vals[i]!=val){
                temp.push(vals[i]);
            }
        }
        this.getName(temp);
        vals=temp.join(',');
    }else{
        vals='';
        this.activeBoxEle.html('');
    }
    return vals;
}

//vals转为数组
function valToArray(vals){
    vals=vals||this.target.data('value');
    if(vals){
        vals=vals.toString().split(',');
    }else{
        vals=false;
    }
    return vals;
}
//排序
function sortResults(data) {
    let options=this.options;
    let order=options.order;
    let prop=options.orderProp;
    
    data = data.sort(function(a, b) {
        let tempA=pinyin(a[prop]).join('');
        let tempB=pinyin(b[prop]).join('');
        if (order==='asc') {
            return (tempA > tempB) ? 1 : ((tempA < tempB) ? -1 : 0);
        } else if (order==='des')  {
            return (tempB > tempA) ? 1 : ((tempB < tempA) ? -1 : 0);
        }
    });
    //console.info('sortResults',data)
    return data;
}

//判断是否有属性－－未兼容ie
function hasProp(data,prop){
    // self.options.child
    return ({}).hasOwnProperty.call(data, prop);
}

//获取container top
function getcontainerTop(){
    let targetH = this.target.outerHeight();
    let targetW = this.target.outerWidth();
    let cHeight=this.container.outerHeight();
    let targetT=this.target.offset().top;
    let top='100%';
    // 大于最底部，小于最顶部
    if(($body.outerHeight<targetH+cHeight)&&(targetT-cHeight>0)){
        top=-cHeight;
    }
    return top;
}

function hasChild(item,child){
    return hasProp(item,child)&&item[child] && item[child].length;
}

module.exports = {
    tree: function(config) {
        return new Tree($(this),$.extend({}, defaults, config));
    }
};

// <div class="J-label-attr hide">
//     <div class="tree-container">
//         <div class="tree-content">
//             <div class="tree-title active" data-id="03">
//                 <i class="fa fa-folder-o" aria-hidden="true"></i>&nbsp;
//                 <div class="tree-name" data-id="030">1111</div>
//             </div>
//             <div class="tree-list" data-level="1">
//                 <div class="tree-content">
//                     <div class="tree-title active" data-id="03">
//                         <i class="fa fa-folder-o" aria-hidden="true"></i>&nbsp;
//                         <div class="tree-name" data-id="030">1111</div>
//                     </div>
//                     <div class="tree-list">
//                         <div class="tree-item active" data-id="03">
//                             <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
//                             <div class="tree-name" data-id="030">1111</div>
//                         </div>
//                         <div class="tree-item">
//                             <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
//                             <div class="tree-name" data-id="0301">常驻地</div>
//                         </div>
//                         <div class="tree-item">
//                             <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
//                             <div class="tree-name" data-id="0301">常驻地</div>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="tree-item">
//                     <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
//                     <div class="tree-name" data-id="0301">常驻地</div>
//                 </div>
//                 <div class="tree-item">
//                     <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
//                     <div class="tree-name" data-id="0302">常去场所</div>
//                 </div>
//             </div>
//         </div>
//         <div class="tree-content">
//             <div class="tree-title active" data-id="04">
//               <i class="fa fa-folder-o" aria-hidden="true"></i>&nbsp;
//               视频偏好
//             </div>
//             <div class="tree-list" data-level="1">
//                 <div class="tree-item">
//                     <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
//                     <div class="tree-name" data-id="0401">视频来源</div>
//                 </div>
//                 <div class="tree-item">
//                     <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
//                     <div class="tree-name" data-id="0402">观看时段</div>
//                 </div>
//                 <div class="tree-item">
//                     <i class="fa fa-file-text-o" aria-hidden="true"></i>&nbsp;
//                     <div class="tree-name" data-id="0403">观看设备</div>
//                 </div>
//             </div>
//         </div>
//     </div>
// </div> 
