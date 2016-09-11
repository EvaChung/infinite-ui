;(function(win, undefined) {
    //全局变量
    var doc = win.document,
        nav = win.navigator,
        screen = win.screen,
        encode = win.encodeURIComponent,
        decode = win.decodeURIComponent;

    //后台配置
    var configs = {
            url: '', //请求地址
            level: 4,//1、常规，2、常规 + click行为 + select文本行为，3、常规 + click行为 + select文本行为 + 表单行为，4、常规 + click行为  + select文本行为 + 单行为（包括密码）
            ck:  [{"name":"dmpt_id","value":"aaaaaaaa","time":1484992397},{"name":"dmpt_c19dc3cf9b0ced13099cc512d5ccaec4","value":"bbbbbbb","time":1484992397}],
            startTime: 1453888397,
            clickDiff: 500, //两次点击的间隔超过500ms才进行记录
            clickTime: time(), //记录点击的时间
            scrollHeight: getScrollHeight() //页面可以滚动的高度
        };


    //前端配置
    var r = null,
        tool = {},
        //收集的信息
        userAction = {
            visitDepth: 0,  //浏览深度
            user: '',
            record: [],
            scriptError: []
        };



    /**
     * polyfill
     * ie6-ie8
     */
    (function() {
        if (!win.JSON) {
            win.JSON = {};
            JSON.parse = function(json) {
                //return eval('1,' + json);
                return eval('(' + json + ')');
            };

            var arr = '[object Array]',
                obj = '[object Object]';

            JSON.stringify = function(json) {
                var t = '';
                var m = Object.prototype.toString.call(json);
                if (m == arr) {
                    t = ArrayParse(json);
                } else if (m == obj) {
                    t = ObjectParse(json);
                } else {
                    t = json;
                }
                return t;
            };

        }
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(obj, start) {
                for (var i = (start || 0), j = this.length; i < j; i++) {
                    if (this[i] === obj) { return i; }
                }
                return -1;
            };
        }
        function ObjectParse(json) {
            var t = '{';
            forIn(json, function(i, ele) {
                var m = Object.prototype.toString.call(ele);
                if (m == arr) {
                    t += i + ':' + ArrayParse(ele) + ',';
                } else if (m == obj) {
                    t += i + ':' + ObjectParse(ele) + ',';
                } else {

                    t += i + ':' + ele + ',';
                }
            });
            if (t.length != 1) {
                t = t.substring(0, t.length - 1);
            }
            return t + '}';
        }

        function ArrayParse(json) {
            var t = '[';
            each(json, function(i, ele) {
                var m = Object.prototype.toString.call(ele);
                if (m == arr) {
                    t += ArrayParse(ele) + ',';
                } else if (m == obj) {
                    t += ObjectParse(ele) + ',';
                } else {
                    t += ele + ',';
                }
            });
            if (t.length != 1) {
                t = t.substring(0, t.length - 1);
            }
            return t + ']';
        }

        function forIn(obj, handler) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    handler(i, obj[i]);
                }
            }
        }

        function each(arr, handler) {
            for (var i = 0, len = arr.length; i < len; i += 1) {
                handler(i, arr[i]);
            }
        }

    }());

    /**
     * 共用函数集合
     */

    //对象克隆
    function extend (object) {
        // Takes an unlimited number of extenders.
        var args = Array.prototype.slice.call(arguments, 1);

        // For each extender, copy their properties on our object.
        for (var i = 0, source; source = args[i]; i++) {
            if (!source) continue;
            for (var property in source) {
                object[property] = source[property];
            }
        }

        return object;
    }
    //对象转URL参数
    function json2url(object){
        var pairs = [];
        for (var prop in object) {
          if (object.hasOwnProperty(prop)) {
            var k = encodeURIComponent(prop),
                v = encodeURIComponent(object[prop]);
            pairs.push( k + "=" + v);
          }
        }
        return pairs.join("&");
    }
    //去除首尾空格
    function trim(txt){
        return txt.replace(/^\s+|\s+$/g, '');
    }
    //截取字符
    function substr(txt, len){
        len = len || 30;
        if (txt.length > len) {
            txt = txt.substr(0, len);
        }
        return txt;
    }
    //非空对象
    function notEmptyObject(obj){
       if (typeof obj === 'object') {
            for(var p in obj){
                return true;
            }
       }else if (typeof obj === 'string' && obj !== '') {
            return true;
       }
       return false;
    }

    //获取时间
    function time(){
        return +new Date();
    }
 

    //页面可以滚动的高度
    function getScrollHeight(){
        var bch = doc.body.clientHeight;
        var dch = doc.documentElement.clientHeight;
        var ch = 0;
        if(bch && dch){
            ch = (bch <dch)?bch :dch;        
        }
        else{
            ch = (bch >dch)?bch :dch;    
        }
        return  doc.body.scrollHeight - ch;
    }

    //发送
    function send(){
        var errors = userAction.scriptError;
        var records = userAction.record;
        var src = configs.url;
            src += '&' + userAction.user.join('&');
            src += '&requestTime=' + configs.startTime;
            src += '&visitDepth=' + userAction.visitDepth;
            src += '&record=' + encode(JSON.stringify(records));
            src += '&scriptError=' + encode(JSON.stringify(errors));
        var img = new Image();
        img.src = src;
        errors.length = records.length = 0;
    }

    //等级判断
    function judgeLevel(level, type, e){
        //type: click|keyup|select|mouseup
        switch (level){
            case 4:
            case 3:
                getElePro(type, e);
                break;
            case 2:
                if (type === 'click' || type === 'select') {
                    getElePro(type, e);
                }
                break;
            case 1:
                break;
        }
    }

    //后台识别
    function extensionField() {
        if (typeof(T_fields) === 'undefined') {
            return '';
        } else {

            try {
                JSON.parse(T_fields);
            } catch (e) {
                return '';
            }
            return '&extension='+T_fields;
        }
    }

    //tool Event on()
    tool.event = {
        on: function(ele, types, fn){
            var events = types.split(' '),
                 i = 0,
                 len = events.length;
            for (; i < len; i++) {
                this.bind(ele, events[i], fn);
            }
        },
        bind: function(ele, type, fn){
            if (doc.addEventListener) {
                return function(ele, type, fn){
                    ele.addEventListener(type, fn, false);
                };
            }else if (doc.attachEvent) {
                return function(ele, type, fn){
                     ele.attachEvent('on' + type, fn);
                };
            }
            return function(ele, type, fn){
                 ele['on' + type] = fn;
            };
        }(),
        off: function(ele, type, fn){
            if (doc.removeEventListener) {
                return function(ele, type, fn){
                    ele.removeEventListener(type, fn);
                };
            }else if (doc.attachEvent) {
                return function(ele, type, fn){
                    ele.detachEvent('on' + type, fn);
                };
            }
            return function(ele, fn){
                ele['on' + type] = r;
            };
        }()
    };

    //tool cookie
    tool.cookie = {
        getItem: function (sKey) {
            return decode(doc.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encode(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=s*([^;]*).*$)|^.*$"), "$1")) || r;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                  case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                  case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                  case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
                }
            }
            doc.cookie = encode(sKey) + "=" + encode(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!sKey || !this.hasItem(sKey)) { return false; }
            doc.cookie = encode(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function (sKey) {
            return (new RegExp("(?:^|;\\s*)" + encode(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(doc.cookie);
        },
        keys: /* optional method: you can safely remove it! */ function () {
            var aKeys = doc.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decode(aKeys[nIdx]); }
            return aKeys;
        }
    };

    //tool DOMContentLoaded
    tool.ready = function() {
        if (doc.addEventListener) {
            return function(dom, fn){
                tool.event.on(dom, 'DOMContentLoaded', fn);
            };
        } else if (doc.attachEvent) {
            return function(dom, fn){
                tool.event.on(dom, 'readystatechange', function(){
                    if (dom.readyState === 'complete') {
                       fn();
                    }
                });
            };
        }
    }();


    tool.getMouseSelectedText = function(){
        if(win.getSelection){
            return function(){
                return substr(trim(win.getSelection() + ''));
            };
        }else{
            return function(){
                return substr(trim(doc.selection.createRange().text));
            };
        }
    }();


     /**
      * 固定请求地址前缀
      */
    (function(){
        var ck = configs.ck;
        var str = '';
        var item;
        var coo = tool.cookie;
        var cooValue;
        //var date = (new Date()).getTime();
        for (var i = 0,length = ck.length; i < length; i++) {
            item = ck[i];
            cooValue = coo.getItem(item.name) || '';
            str += '&' + item.name + '=' + cooValue;
        }
        configs.url = configs.url.indexOf('?') > -1 ? configs.url + '&' : configs.url + '?';
        configs.url +=  str.substring(1);
        configs.url += extensionField();

    })();

    /**
     * 监听错误
     */
    win.onerror = function(errorMessage, scriptURI, lineNumber) {
        userAction.scriptError.push({
            message: errorMessage,
            script: scriptURI,
            line: lineNumber
        });
        if (userAction.scriptError.length === 10) {
            send();
        }
    };


    /**
     * 行为信息采集的实现
     */
    //数组添加元素
    function addToArr(arr, ele){
        var result = notEmptyObject(ele);
        if (result) {
            arr.push(ele);
        }
    }

    //获取元素属性
    function getElePro(type, e){
        var elePro = getElePro[type](e);
        var arr = userAction.record;// userAction.action[type];

        addToArr(arr, elePro);

        if (arr.length === 10) {
            send();
        }

        //输出抓取的信息，上线的时候应该去掉
        if (win.console) {
            console.log(JSON.stringify(userAction.record));
        }else{
            alert(JSON.stringify(userAction.record));
        }

    }
    //click不包括表单
    getElePro.click = function(e){
        var target = e.target || e.srcElement,
            elePro = {},
            text = trim(target.innerText || target.textContent || ''),
            nowTime = time();

        //防止多次点击
        if (nowTime - configs.clickTime < configs.clickDiff) {
            return elePro;
        }
        configs.clickTime = nowTime;

        //
        if (target.nodeName !== 'HTML' && target.nodeName !== 'BODY' && target.value === undefined) {
            elePro.eventType = 'click';
            elePro.nodeName = target.nodeName;
            elePro.href = target.href || '';
            elePro.src = target.src || '';
            elePro.title = target.title || '';
            elePro.className = target.className || '';
            elePro.id = target.id || '';
            elePro.alt = target.alt || '';
            elePro.text = substr(text);
        }
        return elePro;
    };

    getElePro.keyup = getElePro.change = function(e){
        var target = e.target || e.srcElement, //当前元素
            elePro = {}, //元素属性容器
            ua = userAction,
            record = ua.record, //
            length = record.length,
            lastRecord = record[length - 1],
            values,
            value,
            tvalue = target.value,
            inputType = target.type,
            j = 0;

        if (configs.level === 3 && inputType === 'password') {
            return elePro;
        }

        //只有value存在值才进行保存
        if (tvalue){
            //判断当前的element是否存在
            if (lastRecord && lastRecord.eventType === 'keyup' && lastRecord.name === target.name) {
                values = lastRecord.value;//[]
                for (var i = 0, vLen = values.length; i < vLen; i++) {
                    if (values[i].indexOf(tvalue) > -1) {
                        j++;
                        break;
                    }
                    if (tvalue.indexOf(values[i]) > -1) {
                        values[i] = tvalue;
                        j++;
                        break;
                    }
                }
                if (j === 0) {
                    values.push(tvalue);
                }

            }else{
                elePro.eventType = 'keyup';
                elePro.nodeName = target.nodeName;
                elePro.name = target.name || '';
                elePro.id = target.id || '';
                elePro.className = target.className || '';
                elePro.value = [tvalue];
            }
        }
        return elePro;
    };

    getElePro.select = function(e){
        var str = tool.getMouseSelectedText();
        if(notEmptyObject(str)){
            return {
                eventType: 'selectText',
                text: str
            };
        }
        return '';
    };



    /**
     * 开始行为信息采集：
     *
     */



     /*
     * 常规信息采集
     * 分辨率、
     * 浏览器、
     * 当前url、
     * 上一下url、
     * 网页标题、
     *
     */
    (function(){
        //前一个 url
        function getReferrer() {
            var referrer = '';

            try {
                referrer = win.top.doc.referrer;
            } catch (e) {
                if (win.parent) {
                    try {
                        referrer = win.parent.doc.referrer;
                    } catch (e2) {
                        referrer = '';
                    }
                }
            }

            if (referrer === '') {
                referrer = doc.referrer;
            }

            return referrer;
        }

         // 获取浏览器类型
        tool.navType = (function() {
            var ua = nav.userAgent,
                tem;
            var cmReg = /(Maxthon|UBrowser|BIDUBrowser|QQBrowser|LBBROWSER(?=\/))\/?\s*(\d+)/i;
            var sg = 'SE 2.X MetaSr 1.0';
            var mReg = /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i;
            var M = ua.match(cmReg) || ua.match(mReg) || [];
            var isMobile = /Mobile/.test(ua);


            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }

            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }

            M = M[2] ? [M[1], M[2]] : [nav.appName, nav.appVersion, '-?'];

            if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                M.splice(1, 1, tem[1]);
            }

            if (isMobile) {
                M.push('mobile');
            }
            return M.join(' ');
        })();
        var bi = [],tit = doc.getElementsByTagName('title'),
            conType = 'unknow',
            connection = nav.connection || nav.mozConnection || nav.webkitConnection || nav.oConnection;

        tit = tit && encode(trim(tit[0].innerHTML)) || '';

        if (tool.navType.indexOf('mobile') > -1 && connection) {
            conType = connection.type;

        }

        //分辨率
        bi.push('resolution=' + screen.width + '*' + screen.height);
        //操作系统
        bi.push('os=' + nav.platform);
        //浏览器版本
        bi.push('browser=' + tool.navType);
        //网络环境
        bi.push('connectionType=' + conType);
        //浏览器语言
        bi.push('language=' + nav.language || nav.browserLanguage);
        //当前url
        bi.push('currentUrl=' + encode(location.href));
        //上一个url
        bi.push('prevUrl=' + getReferrer());
        //title
        bi.push('title=' + tit);

        userAction.user = bi;

    })();


    /*
     * 浏览深度采集
     */
    tool.ready(doc, function(){
        var diffTop = configs.scrollHeight;
        if(diffTop <= 0 ){
            userAction.visitDepth = 1;
        }else{
            tool.event.on(win, 'scroll', uaScroll, false);
        }
        function uaScroll(e){
            var t1 = doc.body.scrollTop || doc.documentElement.scrollTop,
               t2 = diffTop,
               pc = (t1/t2).toFixed(2);

            if (pc >= 1) {
                tool.event.off(win, 'scroll', uaScroll);
                userAction.visitDepth = 1;
            }else{
                userAction.visitDepth = Math.max(userAction.visitDepth, pc);
            }
        }
    });

    /*
     * 下一个页面采集
     */
    tool.event.on(doc, 'click', function(e){
        var target = e.target || e.srcElement;
        var hrefPro = target.href ? target.getAttribute('href') : '#';
        var targetPro = target.target ? target.target : '_self';
        var regHref = /^javascript.*$|^#.*$/gi;
        var baseInfos = userAction.user;
        var len = baseInfos.length;

        if (target.nodeName === 'A'
            && targetPro === '_self'
            && !regHref.test(hrefPro)) {

            if(baseInfos[len - 1].indexOf('nextUrl') > -1){
                baseInfos[len - 1] = 'nextUrl=' + hrefPro;
            }else{
                baseInfos.push('nextUrl=' + hrefPro);
            }
        }
    });


     /*
     * 行为信息采集
     */
    tool.event.on(doc, 'click keyup change mouseup', function(e){
        e = e || win.event;
        var type = e.type;
        var level = configs.level;

        //change也是表单行为，统一为 keyup
        type = type !== 'change' ? type : 'keyup';

        //选中文本为 select
        type = type !== 'mouseup' ? type : 'select';

        //如果选中文本，则点击不记录，只记录 select
        if (type === 'click' && tool.getMouseSelectedText() !== '') {
            return;
        }

        judgeLevel(level, type, e);
    });




    /**
     * 追踪信息发送
     */
    tool.ready(doc, function(){
        //关闭页面发送
        var goEventType = tool.navType.indexOf('mobile') === -1 ? 'beforeunload' : 'pagehide';
        var goEventEle = win;

        if (goEventType === 'pagehide') {
            goEventType = win.hasOwnProperty('onpagehide') ? 'pagehide' : 'beforeunload';
        }

        tool.event.on(goEventEle, goEventType, function(){
            send();
        });


    });

    // tool.event.on(win, 'unload', function(){
    //     send();
    // });

    // setInterval(function(){
    //     send();
    // }, 3000);




})(window, undefined);