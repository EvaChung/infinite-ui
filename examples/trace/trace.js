/**
 * Trace.js
 *
 * @version 2.0
 *
 */
(function() {

  /**
   * JSON,forEach polyfill
   *
   * from : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
   * from : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
   *
   */
  (function() {
    if (!this.JSON) {
      this.JSON = {
        parse: function(sJSON) {
          return eval('(' + sJSON + ')');
        },
        stringify: (function() {
          var toString = Object.prototype.toString;
          var isArray = Array.isArray || function(a) {
            return toString.call(a) === '[object Array]';
          };
          var escMap = {
            '"': '\\"',
            '\\': '\\\\',
            '\b': '\\b',
            '\f': '\\f',
            '\n': '\\n',
            '\r': '\\r',
            '\t': '\\t'
          };
          var escFunc = function(m) {
            return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
          };
          var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
          return function stringify(value) {
            if (value === null) {
              return 'null';
            } else if (typeof value === 'number') {
              return isFinite(value) ? value.toString() : 'null';
            } else if (typeof value === 'boolean') {
              return value.toString();
            } else if (typeof value === 'object') {
              if (typeof value.toJSON === 'function') {
                return stringify(value.toJSON());
              } else if (isArray(value)) {
                var res = '[';
                for (var i = 0; i < value.length; i++)
                  res += (i ? ', ' : '') + stringify(value[i]);
                return res + ']';
              } else if (toString.call(value) === '[object Object]') {
                var tmp = [];
                for (var k in value) {
                  if (value.hasOwnProperty(k))
                    tmp.push(stringify(k) + ': ' + stringify(value[k]));
                }
                return '{' + tmp.join(', ') + '}';
              }
            }
            return '"' + value.toString().replace(escRE, escFunc) + '"';
          };
        })()
      };
    }

  }.call(this));

  (function(root) {
    root.psb = (function() {
      var topics = {}; //消息管理集合
      var hOP = topics.hasOwnProperty;

      return {
        sub: function(topic, listener) {
          if (!hOP.call(topics, topic)) topics[topic] = [];
          var index = topics[topic].push(listener) - 1;
          return {
            remove: function() {
              delete topics[topic][index];
            }
          };
        },
        pub: function(topic, info) {
          if (!hOP.call(topics, topic)) return;
          each(topics[topic],function(index,item) {
            item(info !== undefined ? info : {});
          });
        }
      };
    })();

  }(this));

  // native objece alias;
  var root           = this;
  var doc            = document;
  var nav            = root.navigator;
  var screen         = root.screen;
  var ArrayProto     = Array.prototype;
  var push           = ArrayProto.push;
  var slice          = ArrayProto.slice;
  var ObjProto       = Object.prototype;
  var hasOwnProperty = ObjProto.hasOwnProperty;
  var encode         = root.encodeURIComponent;
  var decode         = root.decodeURIComponent;
  var nativeKeys     = Object.keys;
  var JSON           = root.JSON;


  //=============== internal methods =======================

  function each(obj, callback, args) {
    var name, i = 0,
        length = obj.length,
        isObj = length === undefined || Array.prototype.toString.call(obj) === ['[object Function]'];

    if (args) {
        if (isObj) {
            for (name in obj) {
                if (callback.apply(obj[name], args) === false) {
                    break;
                }
            }
        } else {
            for (; i < length;) {
                if (callback.apply(obj[i++], args) === false) {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    } else {
        if (isObj) {
            for (name in obj) {
                if (callback.call(obj[name], name, obj[name]) === false) {
                    break;
                }
            }
        } else {
            for (; i < length;) {
                if (callback.call(obj[i], i, obj[i++]) === false) {
                    break;
                }
            }
        }
    }

    return obj;
}

  /**
   * obj 是否为 object 类型
   */
  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }
  /**
   * 在 obj 中是否存在 key
   */
  function has(obj, key) {
    return obj !== null && hasOwnProperty.call(obj, key);
  }

  /**
   * 获取 obj 中的所有 key
   */
  function keys(obj) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj)
      if (has(obj, key)) keys.push(key);
    return keys;
  }

  /**
   * 返回 obj 的所有 value 的数组集合
   */
  function values(obj) {
    var keys = keys(obj);
    var length = keys.length;
    var values = Array(length);

    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  }




  /**
   * 对象拷贝
   */
  function extend() {
    var i = 0;
    var result = {};
    for (; i < arguments.length; i++) {
      var attributes = arguments[i];
      for (var key in attributes) {
        result[key] = attributes[key];
      }
    }
    return result;
  }

  /**
   * 数组去重
   */
  function unique(arr) {
      var res = [],
          i;

      for (i = 0; i < arr.length; i++) {
          if (res.indexOf(arr[i]) === -1) {
              res.push(arr[i]);
          }
      }
      return res;
  }


  /**
   *  将 object 转为 url query 格式
   */
  function obj2url(object) {
    var pairs = [];
    for (var prop in object) {
      if (object.hasOwnProperty(prop)) {
        var k = encodeURIComponent(prop),
          v = typeof object[prop] !== 'string' ? JSON.stringify(object[prop]) : encodeURIComponent(object[prop]);
        pairs.push(k + "=" + v);
      }
    }
    return pairs.join("&");
  }

  /**
   * 去除字符串两端空白
   */
  function trim(txt) {
    return txt.replace(/^\s+|\s+$/g, '');
  }




  /**
   * 返回时间戳
   */
  function timesamp() {
    return +new Date();
  }

  /**
   * 获取上一个url
   */
  function getReferrer() {
    var referrer = '';
    try {
      referrer = root.top.document.referrer;
    } catch (e) {
      if (root.parent) {
        try {
          referrer = root.parent.document.referrer;
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

  /**
   * cookie utils
   */
  var cookie = {
    get: function(sKey) {
      return decode(doc.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encode(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=s*([^;]*).*$)|^.*$"), "$1")) || r;
    },
    set: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
        return false;
      }
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
    remove: function(sKey, sPath, sDomain) {
      if (!sKey || !this.hasItem(sKey)) {
        return false;
      }
      doc.cookie = encode(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    has: function(sKey) {
      return (new RegExp("(?:^|;\\s*)" + encode(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(doc.cookie);
    },
    keys: function() {
      /* optional method: you can safely remove it! */
      var aKeys = doc.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decode(aKeys[nIdx]); }
      return aKeys;
    }
  };

  /**
   * on , bind ,off untils ...
   */
  var eventUtils = {
    on: function(ele, types, fn) {
      var events = types.split(' '),
        i = 0,
        len = events.length;
      for (; i < len; i++) {
        this.bind(ele, events[i], fn);
      }
    },
    bind: function(ele, type, fn) {
      if (doc.addEventListener) {
        return function(ele, type, fn) {
          ele.addEventListener(type, fn, false);
        };
      } else if (doc.attachEvent) {
        return function(ele, type, fn) {
          ele.attachEvent('on' + type, fn);
        };
      }
      return function(ele, type, fn) {
        ele['on' + type] = fn;
      };
    }(),
    off: function(ele, type, fn) {
      if (doc.removeEventListener) {
        return function(ele, type, fn) {
          ele.removeEventListener(type, fn);
        };
      } else if (doc.attachEvent) {
        return function(ele, type, fn) {
          ele.detachEvent('on' + type, fn);
        };
      }
      return function(ele, fn) {
        ele['on' + type] = r;
      };
    }()
  };


  /**
   * document on ready
   */
  var domReady = function() {
    if (doc.addEventListener) {
      return function(dom, fn) {
        eventUtils.on(dom, 'DOMContentLoaded', fn);
      };
    } else if (doc.attachEvent) {
      return function(dom, fn) {
        eventUtils.on(dom, 'readystatechange', function() {
          if (dom.readyState === 'complete') {
            fn();
          }
        });
      };
    }
  }();

  /**
   * 选中文本截取
   */
  var getSelectText = function() {
    return root.getSelection ? function() {
        return trim(root.getSelection() + '').slice(0, 60);
      }:function() {
        return trim(doc.selection.createRange().text).slice(0, 60);
      };
  }();

  var getMeta = (function(){
        var k  = doc.getElementsByTagName('meta');
        var t  = doc.getElementsByTagName('title');
        var result = {keyword:'',description:''};
        var name;
        result.title =  t && encode(trim(t[0].innerHTML)) || '';

        for(name in k){
          if('keywords'.indexOf(name.toLowerCase()) !== -1){
            result.keyword =  encode(k[name].content);
          }
          if('description'.indexOf(name.toLowerCase()) !== -1){
              result.description =  encode(k[name].content);
            }
        }
        return result;
  }());
  /**
   * 获取浏览器版本
   */
  var navType = (function() {
    var ua       = nav.userAgent;
    var cmReg    = /(Maxthon|UBrowser|BIDUBrowser|QQBrowser|LBBROWSER(?=\/))\/?\s*(\d+)/i;
    var sg       = 'SE 2.X MetaSr 1.0';
    var mReg     = /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i;
    var M        = ua.match(cmReg) || ua.match(mReg) || [];
    var isMobile = /Mobile/.test(ua);
    var tmp;

    if (/trident/i.test(M[1])) {
      tmp = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tmp[1] || '');
    }

    if (M[1] === 'Chrome') {
      tmp = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tmp !== null) return tmp.slice(1).join(' ').replace('OPR', 'Opera');
    }

    M = M[2] ? [M[1], M[2]] : [nav.appName, nav.appVersion, '-?'];

    if ((tmp = ua.match(/version\/(\d+)/i)) !== null) {
      M.splice(1, 1, tmp[1]);
    }

    if (isMobile) {
      M.push('mobile');
    }
    return M.join(' ');
  })();


  /*
   * 采集力度判断
   */
  function detectLevel(level, type, e) {
    //type: click|keyup|select|mouseup
    var levelMap = [ false, false,
      function() { getElePro(type, e); },
      function() {
        var target = e.target || e.srcElement;
        if (target.type !== 'password') {
          getElePro(type, e);
        }
      },
      function() {
        if (type === 'click' || type === 'mouseup') {
          getElePro(type, e);
        }
      }
    ];
    if (levelMap[level]) {
      levelMap[level]();
    }
  }


  /*
   * 发送
   */

  var img = new Image();

  function send(){
     // img.src = config.url+obj2url(userAction);

    each(['record','nextUrl','scriptError'],function(index, value) {
      var arr = userAction[value];
      if(arr.length === 10){
        arr.length = 0;
      }
    });
    userAction.duration = 0;

    console.log(decodeURIComponent(JSON.stringify(userAction)));
  }

  /*
   * 填充对象
   */
  var dictionary = ['nodeName', 'id', 'className', 'text', 'name', 'type', 'title', 'href', 'src', 'alt'];//注意：'value'排除

  function fillEle(target, type) {
    var ele = {};
    ele.eventType = type;
    each(dictionary,function(index,name){
      var value = target[name];
      if(value !== undefined && value !== '') {
        ele[name] = value.toLowerCase();
      }
    });
    return ele;
  }
  // 比较两个元素
  function CompareEle(target, ele) {
    var flag = true;
    var type = target.type;
    var checkKey = dictionary;
    if (type === 'checkbox' || type === 'radio') {
      checkKey = dictionary.filter(filterKey);
    }
    each(checkKey,function(index,name){
      var value = target[name];
      if(value !== undefined && value !== '') {
        if(value !== ele[name]) {
          flag = false;
          return false;
        }
      }
    });
    return flag;
  }

  function filterKey(value) {
    return (value !== 'id' && value !== 'className');
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

  var scriptSource = (function(scripts) {
    var _scripts = document.getElementsByTagName('script'),
      _script = _scripts[_scripts.length - 1];

    if (_script.getAttribute.length !== undefined) {
      return _script.src;
    }

    return _script.getAttribute('src', -1);
  }());

  // 单页访问时长
  (function(){
    var nowTime = timesamp();

    // 过期时间,单位毫秒  ---- test
    var expireTime = 30000;

    // 每次行为的开始时间
    var beginTime = nowTime;

    // 最后行为时间
    var endTime = nowTime;

    // 是否活跃
    var active = true;

    // 用户停止操作，记录当前行为的时长
    function interval() {
      userAction.duration += endTime - beginTime;
      active = false;
      clearInterval(it);
    }

    // 没用操作停止记录
    var it = setInterval(interval, expireTime);

    // 不断重置开始时间
    setInterval(function() {
      if (!active) {
        beginTime = endTime = timesamp();
      }
    }, 1000);

    // 有下面行为，表示用户是活跃的，重新计时是否活跃
    eventUtils.on(doc, 'mousemove keydown scroll', function(event) {
      var t = timesamp();
      clearInterval(it);
      it = setInterval(interval, expireTime);
      if (!active) {
        active = true;
        beginTime = t;
      }
      endTime = t;
    });


    psb.sub('visitTime',function(){
        userAction.duration += timesamp() - beginTime;
    });

  }(root));

  var config = {
    url          : './qq.png?',
    production   : false,           // true则不输出console
    clickDiff    : 500,             // 两次点击的间隔超过500ms才进行记录
    clickTime    : timesamp(),      // 记录点击的时间
    level        : 3                // 采集力度 0\1\常规(抓基础信息、不抓行为) 4\常规＋click＋select 3\常规＋click＋select＋表单 2\常规＋click＋select＋表单(密码)
  };

  root.userAction = {
    visitDepth     : 0,                                               // 浏览器深度
    duration       : 0,                                               // 访问时长
    resolution     : screen.width + '*' + screen.height,              // 分辨率
    os             : navigator.platform,                              // 操作系统
    browser        : navType,                                         // 浏览器版本
    language       : nav.language || nav.browserLanguage,             // 浏览器语言
    currentUrl     : encode(location.href),                           // 当前url
    prevUrl        : getReferrer(),                                   // 上一个url
    title          : getMeta.title,                                   // 标题
    keyword        : getMeta.keyword,                                 // 关键词
    description    : getMeta.description,                             // 描述
    connectionType : (function() {                                    // 网络环境
                      var ct = navigator.connection || navigator.mozConnection || navigator.webkitConnection || navigator.oConnection;
                      var c  = navType.indexOf('mobile') > -1 && ct ? ct.type : 'unknow';
                          return c;
                    }())
  };


  root.userAction.record = [];
  root.userAction.scriptError = [];
  root.userAction.nextUrl = [];
  /*
   * 页面跳转采集
   */

  eventUtils.on(doc, 'click', function(e){
    var target    = e.target || e.srcElement;
    var hrefPro   = '';
    var regHref   = /^javascript.*$|^#.*$/gi;
    var parentEl  = null;

    if (target.nodeName === 'A' && !regHref.test(hrefPro)) {

      hrefPro = target.href ? target.getAttribute('href') : '#';
    }else{
      each([1,2,3,4],function(){
        var _this = parentEl || target;
        var nodeName = _this.parentNode.nodeName;

        parentEl = _this.parentNode;

        if(nodeName === 'BODY' || nodeName === 'HTML'){
          return false;
        }
        return parentEl.nodeName !== 'A';
      });

      hrefPro = parentEl.nodeName === 'A' ? parentEl.getAttribute('href') : '';

    }

    if(hrefPro &&!regHref.test(hrefPro)){
      userAction.nextUrl.push(hrefPro);
    }

    userAction.nextUrl = unique(userAction.nextUrl);

  });

  /*
   * 鼠标事件捕捉
   */
  eventUtils.on(doc, 'click keyup change mouseup', function(e){
    var event = e || window.event;
    var type = event.type;
    var target = event.target || event.srcElement;
    switch(type) {
      case 'click':
          if (clickFilter() && getSelectText() === '' && /HTML|BODY|FORM|SELECT|OPTION|TEEXTAREA|INPUT|AUDIO|CANVAS|VIDEO/.test(target.nodeName) === false) {
            detectLevel(config.level, type, event);
          }
        break;
      case 'keyup':
          if (target.value) {
            detectLevel(config.level, type, event);
          }
        break;
      case 'change':
          if (/SELECT|TEEXTAREA|INPUT/.test(target.nodeName) === true) {
            detectLevel(config.level, type, event);
          }
        break;
      case 'mouseup':
          if (getSelectText() !== '') {
            detectLevel(config.level, type, event);
          }
        break;
      default:
        break;
    }
    send();

  });

  // 过滤掉多次点击
  function clickFilter() {
    var nowTime = timesamp();
    if (nowTime - config.clickTime < config.clickDiff) {
      return false;
    }
    return true;
  }

  /*
   * 获取元素属性
   */
  function getElePro(type, e) {
    //根据行为获取元素
    var elePro = getElePro[type](e);
    //非空对象则插入数组
    if(keys(elePro).length > 0){
      var arr = root.userAction.record;
      arr.push(elePro);
      //每收集10条记录就传送
      if (arr.length === 10) {
        send();
      }
    }
  }

  /*
   * 点击click（不含表单）
   */
  getElePro.click = function(e) {
    config.clickTime = timesamp();
    var elePro  = {};
    var target  = e.target || e.srcElement;
    if (target.nodeName === 'LABEL') {
      var child = target.children;
      if( child.length === 1 && child[0].nodeName === 'INPUT') {
        return {};
      }
    }
    //填充对象
    var text    = trim(target.innerText || target.textContent || '');
    elePro = fillEle(target, 'click');
    elePro.text = text.substr(0,30);
    return elePro;
  };

  /*
   * 按键输入keyup
   */
  getElePro.keyup  = function(e) {
    var elePro     = {},
        target     = e.target || e.srcElement,
        record     = root.userAction.record,        //获取记录数组
        lastRecord = record[record.length - 1],     //获取记录数组的最后一个
        tvalue     =  target.value;                 //目标值
    //判断：是否有最后一条记录、记录是否为keyup、记录是否和目标元素一致
    if (lastRecord && CompareEle(target, lastRecord)) {
      //获取记录存储的值
      var values = lastRecord.value;
      var value = values[values.length-1];
      //判断输入值的改变
      if(tvalue.indexOf(value)>-1){
        values[values.length-1] = tvalue;
      } else {
        if(value.indexOf(tvalue)==-1) {
          values.push(tvalue);
        }
      }
    } else {
      //填充对象
      elePro = fillEle(target, 'keyup', [tvalue]);
      elePro.value = [tvalue];
    }
    return elePro;
  };

  // 获取 select-mutiple values
  function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }

  // 获取 checkbox(单个／一组) values
  function getCheckboxValues(target) {
    var result;
    var group = getElementsByName(target.nodeName, target.name);
    if ( group.length > 1 ) {
      result = [];
      each(group,function(index,name){
        if (name.checked) {
          result.push(name.value);
        }
      });
    } else {
      result = target.checked ? target.value : '';
    }
    return result;
  }

  // 获取相同的元素
  function getElementsByName(tag, name) {
    var returns = document.getElementsByName(name);
    if (returns.length > 0)
        return returns;
    returns = [];
    var e = document.getElementsByTagName(tag);
    for (var i = 0; i < e.length; i++) {
        if (e[i].getAttribute("name") == name) {
            returns[returns.length] = e[i];
        }
    }
    return returns;
  }

  /*
   * 按键输入change
   */
  getElePro.change = function(e) {
    var elePro     = {},
        target     = e.target || e.srcElement,
        //获取记录数组、最后一个
        record     = root.userAction.record,
        lastRecord = record[record.length - 1],
        //目标值
        tvalue     = target.value;
    if (target.type == 'checkbox') {
      tvalue = getCheckboxValues(target);
    }
    if (target.type == 'select-multiple') {
      tvalue = getSelectValues(target);
    }
    //判断：是否有最后一条记录、记录是否为keyup、记录是否和目标元素一致
    if (lastRecord && lastRecord.eventType === 'keyup' && CompareEle(target, lastRecord)) {
      var values = lastRecord.value;
      if (tvalue != values[values.length-1]) {
        values.push(tvalue);
      }
    } else {
      //填充对象
      elePro = fillEle(target, 'keyup', [tvalue]);
      elePro.value = [tvalue];
    }
    return elePro;
  };


  /*
   * 选取后的mouseup
   */
  getElePro.mouseup = function(e) {
    //直接判断是否有选取字段
    var elePro = {};
    var target = e.target || e.srcElement;
    elePro = fillEle(target, 'select');
    elePro.text = getSelectText();
    return elePro;
  };


  domReady(doc, function() {
    //关闭页面发送
    var goEventType = navType.indexOf('mobile') === -1 ? 'beforeunload' : 'pagehide';
    var goEventEle = root;

    if (goEventType === 'pagehide') {
      goEventType = root.hasOwnProperty('onpagehide') ? 'pagehide' : 'beforeunload';
    }

    eventUtils.on(goEventEle, goEventType, function() {
        psb.pub('visitTime');
        send();
    });

  });

  root.onerror = function(errorMessage, scriptURI, lineNumber) {
      userAction.scriptError.push({
          message: errorMessage,
          script: scriptURI,
          line: lineNumber
      });
      if (userAction.scriptError.length === 10) {
          send();
          userAction.scriptError.length =0;
      }
  };

}.call(this));
