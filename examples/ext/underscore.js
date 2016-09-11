//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {


  // 外围通过 `call(this)`的好处在于可以使用多个场景，例如：Node，Browser
  var root = this;

  // 下划线 _ 是 Underscore 的命名空间，就相当于 jQuery 的美元符号 $
  var previousUnderscore = root._;

  // 创建原生对象（Array，Object，Function）的原型简写
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype;

  // 创建原生常用对象方法的简写，以方便快速访问

  var

    push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

  // 此处声明了 ECMAScript 5 的一些原生方法

  var

  // 判断是否为数组
    nativeIsArray = Array.isArray,
    // 返回数组或对象的键
    nativeKeys = Object.keys,
    // 重定向执行上下文
    nativeBind = FuncProto.bind,
    // 创建一个拥有指定原型和若干个指定属性的对象
    nativeCreate = Object.create;

  // 创建一个空函数用于原型交换
  // 主要用于修正不兼容 Object.create 时的替代方案
  var Ctor = function() {};

  // 创建一个安全的 Underscore 对象供下面使用
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // 判断是否在 Node.js 环境
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // 版本号
  _.VERSION = '1.8.3';

  // 优化 callback，这个方法仅供内部使用，使用率贯穿整个框架
  var optimizeCb = function(func, context, argCount) {
    // 当只传了一个参，则不处理直接返回
    if (context === void 0) return func;
    // 判断参数个数，如果 null，则跳至 case 3
    switch (argCount == null ? 3 : argCount) {
      // 只有一个参数时
      case 1:
        return function(value) {
          return func.call(context, value);
        };
        // 两个参数时
      case 2:
        return function(value, other) {
          return func.call(context, value, other);
        };
        // 三个参数时
      case 3:
        return function(value, index, collection) {
          return func.call(context, value, index, collection);
        };
        // 四个参数时
      case 4:
        return function(accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    // 当传入大于四个参，或 argCount 不符合前面 switch 判断时
    return function() {
      return func.apply(context, arguments);
    };
  };

  // 高频度的内部方法 callback，根据传入 value 的类型来选择处理方式
  var cb = function(value, context, argCount) {
    // value 等于 null，则不处理直接返回
    if (value == null) return _.identity;
    // value若是函数，则调用 optimizeCb 方法
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    // value若是对象，则调用 matcher
    if (_.isObject(value)) return _.matcher(value);
    //若都不是，则返回 property 方法
    return _.property(value);
  };

  // 迭代 callback

  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // 高频度内部方法
  // 用法： _.extend = createAssigner(_.allKeys)
  var createAssigner = function(keysFunc, undefinedOnly) {
    //返回一个对象
    return function(obj) {
      var length = arguments.length;
      // 当参数小于2或者obj等于null，则不处理返回
      if (length < 2 || obj == null) return obj;
      // 循环 arguments
      for (var index = 1; index < length; index++) {
        // source ：每个参数
        var source = arguments[index],
          // keys ： 参数对应的所有键
          keys = keysFunc(source),
          // l ： keys的长度
          l = keys.length;
        // 循环 keys
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          // 如果 undefinedOnly = false，则 obj[key] 即使为undefined也依然保存。
          // 反之则 obj[key] === undefined 时跳过，不保存
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };

  };

  // 高频度内部方法：原型链继承修正
  // 如果浏览器不支持 Object.create(),则借用 Ctor 模拟实现 create
  var baseCreate = function(prototype) {
    // 传入被克隆的原型，如果不是对象，则返回一个空对象。
    if (!_.isObject(prototype)) return {};
    // 判断当前环境是否支持原生的create方法
    if (nativeCreate) return nativeCreate(prototype);
    // 当不支持 create 方法的修正。
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  // 高频度内部方法：传入键生成一个匿名函数，再传一个对象，返回此对象中key对应的值
  // 使用方法：
  // getLength = property('length');
  // getLength(['a','b','c','d','e']) => 5
  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // 最大数组长度
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  // 查询数组长度
  var getLength = property('length');
  // 判断是否为数组
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };
  // Collection Functions
  // --------------------

  // 遍历器，等价 forEach，可循环对象或数组
  _.each = _.forEach = function(obj, iteratee, context) {
    // obj 被遍历的对象或数组
    // iteratee 回调函数
    // context 重定向执行上下文，即：iteratee 的 this 将指向到 context 上
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    // 如果是数组
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      // 如果是对象，获得对象的所有 key，再循环keys
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };
  // 遍历器，等价 collect ， 通过转换函数(iteratee迭代器)映射列表中的每个值产生价值的新数组。
  // _.map([1, 2, 3], function(num){ return num * 3; });  => [3,6,9]
  _.map = _.collect = function(obj, iteratee, context) {
    // obj 被遍历的对象或数组
    // iteratee 回调函数
    // context 重定向执行上下文，即：iteratee 的 this 将指向到 context 上
    iteratee = cb(iteratee, context);

    //获得被循环对象的 key
    var keys = !isArrayLike(obj) && _.keys(obj),
      //被循环对象的长度
      length = (keys || obj).length,
      //创建一个新的数组
      results = Array(length);
    //循环获取 iteratee 返回值
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    // 返回被回调函数处理过的新数组
    return results;
  };

  // 创建一个可向左或向右迭代的 reduce 函数
  // dir : 1是从左往右，-1向右往左
  function createReduce(dir) {

    // 请先看此函数内的下半部分，再回头看这个迭代器 iterator
    // obj        ：待遍历对象或数组
    // iteratee   ：回调函数
    // memo       : 作为第一次调用 callback 的第一个参数
    // keys       : obj 的键集合
    // index      : 循环的起始值
    // length     : 键集合 keys 的长度
    function iterator(obj, iteratee, memo, keys, index, length) {

      for (; index >= 0 && index < length; index += dir) {
        // 判断是对象or数组来取得当前 key
        var currentKey = keys ? keys[index] : index;
        // 将回调函数 iteratee 返回的值赋给 memo
        // memo 再作为回调函数的第一位参数传进去，即
        // 第一参数：不断被传递的memo
        // 第二参数：被循环的当前值
        // 第三参数：被循环的当前键
        // 第四参数：被循环的对象
        memo = iteratee(memo, obj[currentKey], currentKey, obj);

      }

      return memo;
    }

    /**
     * 使用举例：
        var result = _.reduce([1, 2, 3,4,5,6,7,8,9,10], function(memo,value,index,object){
            return memo + 1;
        },'a');
         console.log(result)  => 10
     */

    // 以 reduce为例
    // obj        ：待遍历对象或数组
    // iteratee   ：回调函数,
    // memo       : 作为第一次调用 callback 的第一个参数
    // context    : 重定向执行上下文
    return function(obj, iteratee, memo, context) {
      // 调用 optimizeCb 获得 4 个参数入口的回调函数 iteratee
      iteratee = optimizeCb(iteratee, context, 4);
      // 判断是数组还是对象，获得键集合
      var keys = !isArrayLike(obj) && _.keys(obj),
        // 键集合的长度
        length = (keys || obj).length,
        // 索引，根据 dir 决定从左至右，还是从右至左循环
        index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      // 判断 memo 参数有无提供
      // 若无，则memo 重定义为 obj首个被循环的值
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      // 调用迭代器 iterator 去循环 obj
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // reduce() 方法接收一个函数作为累加器（accumulator），数组中的每个值（从左到右）开始合并，最终为一个值。
  // 等价于 foldl ， inject
  _.reduce = _.foldl = _.inject = createReduce(1);

  // reduce反向循环
  // 等价于 foldr
  _.reduceRight = _.foldr = createReduce(-1);

  // 返回一个在断言函数 predicate 中匹配的值，一旦匹配成功，立即中断循环并返回
  // 等价于 detect
  // var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
  // => 2
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    // 判断是数组or对象
    if (isArrayLike(obj)) {
      // 获取断言函数匹配的 key
      // findIndex 在后面会分析 *
      key = _.findIndex(obj, predicate, context);
    } else {
      // 获取断言函数匹配的 key
      // findKey 在后面会分析 *
      key = _.findKey(obj, predicate, context);
    }
    // 如果 key 不等于 undefined or -1 ，则返回匹配值
    if (key !== void 0 && key !== -1) return obj[key];
  };


// 筛选器，与find不一样的地方是，遍历每个值，匹配的将插入到新数组，直至整个遍历结束，返回新数组
// var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
// => [2, 4, 6]
_.filter = _.select = function(obj, predicate, context) {
  var results = [];
  predicate = cb(predicate, context);
  _.each(obj, function(value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
};

// 返回 obj 中没有通过 predicate 断言真值检测的元素集合，与filter相反。
_.reject = function(obj, predicate, context) {
  // 调用 filter 之前，先借用 negate 将 断言函数 predicate 取反
  return _.filter(obj, _.negate(cb(predicate)), context);
};

// 如果 obj 中的所有元素都通过 predicate 的真值检测就返回 true。
_.every = _.all = function(obj, predicate, context) {
  // 调用 cb 来优化一下 predicate 断言函数
  // PS：基本上很多 API 的回调函数，例如 predicate，iteratee之类在内部起始都会调用 cb 或 optimizeCb 来优化一下
  // 因为几乎每个 API 都有 context 这个重定向执行上下文对象
  predicate = cb(predicate, context);
  // 以下套路都很常见了，此处不做解释
  var keys = !isArrayLike(obj) && _.keys(obj),
    length = (keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) return false;
  }
  return true;
};

// 如果 obj 中有任何一个元素通过 predicate 的真值检测就返回true。
// 一旦找到了符合条件的元素, 就直接中断对list的遍历.
// 别名：any
// 与 find 不同的是，find 返回的是断言匹配的当前值，而 some 是返回 boolean 结果
_.some = _.any = function(obj, predicate, context) {
  predicate = cb(predicate, context);
  var keys = !isArrayLike(obj) && _.keys(obj),
    length = (keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) return true;
  }
  return false;
};

// 如果 obj 包含指定的 value 则返回true。
// 如果 obj 是数组，内部使用indexOf判断。
// 别名：includes,include
// fromIndex 来给定开始检索的索引位置。
_.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
  // 如果是对象，将获取obj的所有值集合
  if (!isArrayLike(obj)) obj = _.values(obj);
  if (typeof fromIndex != 'number' || guard) fromIndex = 0;
  // indexOf 的具体分析在 Array 篇章，功能和 js 的原生方法 indexOf 是一致的。
  return _.indexOf(obj, item, fromIndex) >= 0;
};

// 在 obj 的每个元素上执行 method 方法。
// 任何传递给 invoke 的额外参数，invoke都会在调用 method 方法的时候传递给它。
// 乍眼一看，很鸡肋的功能，细想一下，invoke 存在还是有道理的
// 在面前迭代器：each,map能够通过回调函数来改变 obj，但是执行每一次函数的时候，并没有可额外传参数的功能，只有 context 重定向执行上下文
// 而 invoke 是没有 context 功能，反而是后面可以传入无限个参数（理论上）给回调函数
// 举例：
// _.invoke([1,2,3,4,5,6,7],function(){
//    console.log(arguments);  => ["a", "b", "c", "d", "e"]
// },'a','b','c','d','e');
_.invoke = function(obj, method) {
  // 将参数转为数组
  var args = slice.call(arguments, 2);
  // 判断 method 是否为一个函数
  var isFunc = _.isFunction(method);

  return _.map(obj, function(value) {
    var func = isFunc ? method : value[method];
    return func == null ? func : func.apply(value, args);
  });
};

// pluck也许是map最常使用的用例模型的简化版本，即萃取数组对象中某属性值，返回一个数组。
// var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
// _.pluck(stooges, 'name');
// => ["moe", "larry", "curly"]
_.pluck = function(obj, key) {
  return _.map(obj, _.property(key));
};

// 遍历 obj 中的每一个值，返回一个数组，这个数组包含 attrs 所列出的属性的所有的 键 - 值对。
// 用在列表渲染上还是挺不错的
// 场景：从后台请求10篇文章的json里，筛选出：2016年08月04日,作者是janking的文章
// _.where(res.data, {author: "janking", date:'2016年08月04日'});
//
_.where = function(obj, attrs) {
  // matcher 函数会给你一个断言可以用来辨别给定的对象是否匹配attrs指定键/值属性。
  return _.filter(obj, _.matcher(attrs));
};

// 遍历 obj 中的每一个值，返回一个数组，这个数组包含attrs所列出的属性的**第一个**的 键 - 值对。
// 跟where不一样的是 findWhere 只返回匹配成功的 第一个
_.findWhere = function(obj, attrs) {
  return _.find(obj, _.matcher(attrs));
};

//返回 obj 中的最大值。如果传递iteratee参数，iteratee将作为 obj 中每个值的排序依据。
//如果 obj 为空，将返回-Infinity，所以你可能需要事先用isEmpty检查 obj
_.max = function(obj, iteratee, context) {
  var result = -Infinity,
    lastComputed = -Infinity,
    value, computed;
    // 如果没有 iteratee，则按 javascript 的比较运算规则处理
  if (iteratee == null && obj != null) {
    obj = isArrayLike(obj) ? obj : _.values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      // 第一次循环：value 与 负无穷 比较，
      // 之后都会跟前一个 result 比较，若大于，则赋值给 result ，继续下一个循环比较
      if (value > result) {
        result = value;
      }
    }
  } else {
    // 此处作最后一次解释，之后都略过
    // 几乎通过 cb 都是进行一次检验是否需要重定向执行上下文，即context；
    // 如果没有传 context，则调用 cb 与否都没有什么作为。
    iteratee = cb(iteratee, context);
    // 遍历 obj
    _.each(obj, function(value, index, list) {
      // 获取 iteratee 返回值作为比较对象
      computed = iteratee(value, index, list);
      // 若当前计算值 computed 大于上一次循环的计算值
      // 则 lastComputed 被 computed 覆盖作为下一次循环被比较的值
      if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
        result = value;
        lastComputed = computed;
      }
    });
  }
  return result;
};

// 返回 obj 中的最小值。如果传递iteratee参数，iteratee将作为 obj 中每个值的排序依据。
// 与 max 相似，仅比较运算符大于和小于的区别
_.min = function(obj, iteratee, context) {
  var result = Infinity,
    lastComputed = Infinity,
    value, computed;
  if (iteratee == null && obj != null) {
    obj = isArrayLike(obj) ? obj : _.values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value < result) {
        result = value;
      }
    }
  } else {
    iteratee = cb(iteratee, context);
    _.each(obj, function(value, index, list) {
      computed = iteratee(value, index, list);
      if (computed < lastComputed || computed === Infinity && result === Infinity) {
        result = value;
        lastComputed = computed;
      }
    });
  }
  return result;
};

// 返回一个随机打乱的数组
// 此处用的是 费雪耶兹（Fisher–Yates） 也被称作高纳德（ Knuth）随机置乱算法
// 详细介绍：http://blog.csdn.net/lhkaikai/article/details/25627161
_.shuffle = function(obj) {
  var set = isArrayLike(obj) ? obj : _.values(obj);
  var length = set.length;
  var shuffled = Array(length);
  for (var index = 0, rand; index < length; index++) {
    rand = _.random(0, index);
    if (rand !== index) shuffled[index] = shuffled[rand];
    shuffled[rand] = set[index];
  }
  return shuffled;
};


// 从 obj 中产生一个随机样本。
_.sample = function(obj, n, guard) {
  // 传递一个数字表示从 obj 中返回n个随机元素。
  // 个人猜测：guard 仅仅是在传入 n , 而 n 不是 number ，又要得到结果的一个校验参
  if (n == null || guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    // 否则将返回一个单一的随机项。
    return obj[_.random(obj.length - 1)];
  }
  return _.shuffle(obj).slice(0, Math.max(0, n));
};



// 返回一个排序后的 obj 拷贝副本。
// 如果传递 iteratee 参数，iteratee 将作为 obj 中每个值的排序依据。
// 迭代器也可以是字符串的属性的名称进行排序的(比如 length)。
_.sortBy = function(obj, iteratee, context) {
  // 如果 iteratee 是字段名（String），则返回 property方法，具体查看 cb 函数
  iteratee = cb(iteratee, context);
  // pluck
  return _.pluck(_.map(obj, function(value, index, list) {
    return {
      value: value, // obj 的 项
      index: index, // obj 的 索引
      criteria: iteratee(value, index, list) // 被回调函数 iteratee 计算过的值
    };
  }).sort(function(left, right) {
    var a = left.criteria;
    var b = right.criteria;
    if (a !== b) {
      if (a > b || a === void 0) return 1;
      if (a < b || b === void 0) return -1;
    }
    return left.index - right.index;
  }), 'value'); // 最终抽调 value 字段 ，返回新数组
};



// groupBy,indexBy,countBy的集合方法
// 传入一个行为函数，返回一个闭包
var group = function(behavior) {
  // 以 groupBy 为例
  // groupBy 是把一个集合分组为多个集合，通过 iterator 返回的结果进行分组.
  // 如果 iterator 是一个字符串而不是函数, 那么将使用 iterator 作为各元素的属性名来对比进行分组.
  return function(obj, iteratee, context) {
    var result = {};
    iteratee = cb(iteratee, context);
    _.each(obj, function(value, index) {
      var key = iteratee(value, index, obj);
      behavior(result, value, key);
    });
    return result;
  };
};

_.groupBy = group(function(result, value, key) {
  // result中是否有key
  if (_.has(result, key)) result[key].push(value);
  // 若无，则创建一个组
  else result[key] = [value];
});

// 给定一个 obj，和 一个用来返回一个在列表中的每个元素键 的 iterator 函数（或属性名），
// 返回一个每一项索引的对象。和groupBy非常像，但是当你知道你的键是唯一的时候可以使用indexBy 。
// 参数对应请结合内部方法 group 来看。
_.indexBy = group(function(result, value, key) {
  result[key] = value;
});

// 排序一个列表组成一个组，并且返回各组中的对象的数量的计数。
// 类似groupBy，但是不是返回列表的值，而是返回在该组中值的数目。
// 请结合内部函数 group 来看
_.countBy = group(function(result, value, key) {
  if (_.has(result, key)) result[key]++;
  else result[key] = 1;
});

// 将任意可循环的转为真实数组
// 例如 arguments，object
_.toArray = function(obj) {
  if (!obj) return [];
  // 如果是真实数组
  if (_.isArray(obj)) return slice.call(obj);
  // 如果 类数组，例如arguments
  if (isArrayLike(obj)) return _.map(obj, _.identity);
  // 如果是 object
  return _.values(obj);
};

// 返回任意可循环的长度
// 例如 arguments、object
_.size = function(obj) {
  if (obj == null) return 0;
  return isArrayLike(obj) ? obj.length : _.keys(obj).length;
};

//拆分一个数组（array）为两个数组：
//第一个数组其元素都满足predicate迭代函数，
// 而第二个的所有元素均不能满足predicate迭代函数
_.partition = function(obj, predicate, context) {
  predicate = cb(predicate, context);
  var pass = [],
    fail = [];
  _.each(obj, function(value, key, obj) {
    (predicate(value, key, obj) ? pass : fail).push(value);
  });
  return [pass, fail];
};





  /*===========================================================================================================*/




  // Array Functions
  // ---------------

  // 返回array（数组）的第一个元素。
  // 传递 n 参数将返回数组中从第一个元素开始的n个元素（即：返回前 N 个元素）
  _.first = _.head = _.take = function(array, n, guard) {
    // 什么都不传，返回 undefined
    if (array == null) return void 0;
    // 没有传 n ，返回 array 第一个元素
    if (n == null || guard) return array[0];
    // 传入 n ， 调用 initial
    return _.initial(array, array.length - n);
  };

  // 返回数组中除了最后一个元素外的其他全部元素。
  // 在arguments对象上特别有用。
  // 传递 n参数，排除数组后面的 n 个元素
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // 返回array（数组）的最后一个元素。
  // 传递 n 参数将返回数组中从最后一个元素开始的n个元素
  // 与 first 相反
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // 返回数组中除了第一个元素外的其他全部元素。
  // 传递 n 参数将返回从 n 开始的剩余所有元素 。
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // 返回一个除去所有false值的 array副本。
  // 在javascript中, false, null, 0, "", undefined 和 NaN 都是false值.
  _.compact = function(array) {
    // 调用 identity，返回一个「返回value」的函数作为 filter 的 callback
    // filter 用 if 判断 array的每个值来过滤掉 false 的值
    return _.filter(array, _.identity);
  };

  // 内部函数 - 递归
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [],
      idx = 0;
      // 第一层循环
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      // 校验是否为非空数组
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // 若传有 shallow ， 就只减少一维，即使 input[i] 有多维
        if (!shallow) value = flatten(value, shallow, strict);

        // 最终获得一维的input[i]
        var j = 0,
          len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // 将一个嵌套多层的数组 array（数组） (嵌套可以是任何层数)转换为只有一层的数组。
  // 如果你传递 shallow参数，数组将只减少一维的嵌套。
  _.flatten = function(array, shallow) {
    // 借助 内部函数 flatten 实现
    return flatten(array, shallow, false);
  };

  // 返回一个删除 *value 后的数组
  // 即 可以传入无限个值，
  // 不过，如果 array 是多维数组，就删不了深层的
  // _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
  // => [2, 3, 4]
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // 返回 array去重后的副本, 使用 === 做相等测试.
  // 如果您确定 array 已经排序, 那么给 isSorted 参数传递 true值, 此函数将运行的更快的算法.
  // 如果要处理对象元素, 传递 iteratee函数来获取要对比的属性.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    // array 若已排序，则跳过,
    // 若 isSorted 不传或任何 false 值，那这个函数的入参数不够，导致下面代码执行报错，因此，此处需要重定义参数
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    // 如果回调函数不为空
    if (iteratee != null) iteratee = cb(iteratee, context);
    // 返回结果数组
    var result = [];
    // seen 是作为处理对象元素数组的临时存储地
    // 例如这种数组：
    // _.uniq([{a:1,b:2},{a:1,b:3,c:4},{d:5,e:9}],false,function(value){
    //   return value.a;
    // })
    var seen = [];
    // 循环 array
    for (var i = 0, length = getLength(array); i < length; i++) {
      // 得到值
      var value = array[i],
        // 若有回调函数，则以回调函数结果作为计算结果
        // 若无，则以 value 为计算结果
        computed = iteratee ? iteratee(value, i, array) : value;
      // 若 array 已排序
      if (isSorted) {
        // 若当前是第一次循环，或者 seen 不等于计算，将往 result 插入第一个值
        // 一般去重，第一位都没必要判断
        if (!i || seen !== computed) result.push(value);
        // 临时存储计算结果
        seen = computed;
        // 若有回调函数
      } else if (iteratee) {
        // 判断 computed 在 seen 中是否存在
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
        // 调用 contains 来检查 value 在 contains 是否存在
        // 若只是普通的去重，就只执行了这句罢了
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // 返回传入的 arrays（数组）并集：按顺序返回，返回数组的元素是唯一的，可以传入一个或多个 arrays（数组）。
  _.union = function() {
    // 比较简单，先借助递归器flatten，将数组降至一维数组，再调用 uniq 去重。
    return _.uniq(flatten(arguments, true, true));
  };

  // 返回传入 arrays（数组）交集。结果中的每个值是存在于传入的每个arrays（数组）里。
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // 类似于without，但返回的值来自array参数数组，并且不存在于other 数组.
  // 也没什么好分析的，借助之前已实现的函数封装而成
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value) {
      return !_.contains(rest, value);
    });
  };

  // 将 每个arrays中相应位置的值合并在一起。在合并分开保存的数据时很有用.
  // 如果你用来处理矩阵嵌套数组时, _.zip.apply 可以做类似的效果。
  // ['moe', 'larry', 'curly'],
  // [30,       40,        50],
  // [true,   false,    false]
  //
  // to
  //
  // ["moe",   30, true],
  // ["larry", 40, false],
  // ["curly", 50, false]
  //
  _.zip = function() {
    return _.unzip(arguments);
  };


  // 与zip功能相反的函数，给定若干arrays，返回一串联的新数组，其第一元素个包含所有的输入数组的第一元素，其第二包含了所有的第二元素，依此类推。
  // 通过apply用于传递数组的数组。
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // 将数组转换为对象。传递任何一个单独[key, value]对的列表，或者一个键的列表和一个值得列表。
  // 如果存在重复键，最后一个值将被返回。
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // findIndex,findLastIndex 的构造器
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // 类似于_.indexOf，当predicate通过真检查时，返回第一个索引值；否则返回-1。
  _.findIndex = createPredicateIndexFinder(1);
  // 和_.findIndex类似，但反向迭代数组，当predicate通过真检查时，最接近末端的索引值将被返回。
  _.findLastIndex = createPredicateIndexFinder(-1);

  // 使用二分查找确定value在list中的位置序号，value按此序号插入能保持list原有的排序。
  // 如果提供iterator函数，iterator将作为list排序的依据，包括你传递的value 。
  // iterator也可以是字符串的属性名用来排序(比如length)
  // 例如：38 在数组中 [10,20,30,40,50,60] 下标为 3
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0,
      high = getLength(array);
      // 二分查找法
      // 附图 http://baike.baidu.com/pic/%E4%BA%8C%E5%88%86%E6%9F%A5%E6%89%BE/10628618/0/ac2fc3c4d6ecbd9439db49b2?fr=lemma&ct=single#aid=0&pic=ac2fc3c4d6ecbd9439db49b2
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1;
      else high = mid;
    }
    return low;
  };

  // indexOf,lastIndexOf的构造器
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0,
        length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // *** 不知道为何已经有了findIndex和findLastIndex还创造 indexOf，lastIndexOf出来……


  //
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // 一个用来创建整数灵活编号的列表的函数，便于each 和 map循环。
  // 如果省略start则默认为 0；step 默认为 1.返回一个从start 到stop的整数的列表，用step来增加 （或减少）独占。
  // 值得注意的是，如果stop值在start前面（也就是stop值小于start值），那么值域会被认为是零长度，而不是负增长。
  // -如果你要一个负数的值域 ，请使用负数step.
  // 举例：
  // _.range(10);          => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  // _.range(1, 11);       => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  // _.range(0, 30, 5);    => [0, 5, 10, 15, 20, 25]
  // _.range(0, -10, -1);  => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };




  //==============================================================================================================================
  //
  //
  //
  //
  // Function (ahem) Functions
  // ------------------

  // bind 与 partial的构造器
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    // 2016-08-09 21:01:09 此处存疑：什么情况下才会跳过这一句？
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    console.log(321);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // 绑定函数 function 到对象 context 上, 也就是无论何时调用函数, 函数里的 this 都指向这个 object.
  // 任意可选参数 arguments 可以传递给函数 function , 可以填充函数所需要的参数,这也被称为 partial application。
  // 对于没有结合上下文的partial application绑定，请使用partial。
  //
  _.bind = function(func, context) {
    // 如果支持原生bind
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    // 如果 func 不是函数
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    // 获得外参
    var args = slice.call(arguments, 2);
    // 若不支持原生bind,则模拟 bind
    var bound = function() {
      // 借助 executeBound
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };


  // partial 是个很有意思的方法，他将函数与参数绑定在一块，延后执行，甚至可以给参数占位符
  // 具体先看看例子：
  // 声明一个函数
  // var subtract = function(a, b) { return b - a; };
  // 预存一个参数 a=>5
  // sub5 = _.partial(subtract, 5);
  // 再传一个参数 b=>20
  // 执行计算
  // sub5(20);
  // => 15

  // 占位符玩法，用 underscore 的 _ 代替
  // 参数 a => _
  // subFrom20 = _.partial(subtract, _, 20);
  // 传入 a=5 替换 _，并执行计算
  // subFrom20(5);
  // => 15

  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0,
        length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        // 判断是否有占位符，如果有，则扩充arguments
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      // 调用 excuteBound
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // 绑定 obj 中函数的 this 永远指向 obj
  // 举例
  // var buttonView = {
  //        label  : 'underscore',
  //        onClick: function(){ alert('clicked: ' + this.label); },
  //        onHover: function(){ console.log('hovering: ' + this.label); }
  //   };
  //
  //  _.bindAll(buttonView, 'onClick', 'onHover');
  //
  // jQuery('#underscore_button').bind('click', buttonView.onClick);
  _.bindAll = function(obj) {
    var i, length = arguments.length,
      key;
      // 如果不传函数名，立即抛出错误
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // 存储计算值，用于反复同一公式且同一参数计算时
  // 例如：斐波纳契计算
  // var fibonacci = _.memoize(function(n) {
  //    return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
  // });
  //
  // fibaonacci(10) => 第一次调用通过计算得到 55
  // fibaonacci(10) => 之后 n 次调用，都直接跳过计算，拿存储值
  //
  // hasher 可以自定义 cache 的键
  //
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      // 获取缓存对象
      var cache = memoize.cache;
      // 生成 key
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      // 如果 cache 中无 address（key），则执行 func
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // 延迟执行，没啥好讲的
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  };

  // 延迟调用function直到当前调用栈清空为止，类似使用延时为0的setTimeout方法。
  // 对于执行开销大的计算和无阻塞UI线程的HTML渲染时候非常有用。
  // 如果传递arguments参数，当函数function执行时， arguments 会作为参数传入。
  _.defer = _.partial(_.delay, _, 1);

  // 节流阀：返回一个节流函数，适用于keyup=>ajax查询
  // 当重复调用函数的时候，至少每隔 wait 毫秒调用一次该函数。
  // 默认情况下，throttle将在你调用的第一时间尽快执行这个function，并且，如果你在wait周期内调用任意次数的函数，都将尽快的被覆盖。
  // 如果你想禁用第一次首先执行的话，传递{leading: false}，还有如果你想禁用最后一次执行的话，传递{trailing: false}。
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // 去抖动（防反跳）
  // 返回 function 函数的防反跳版本, 将延迟函数的执行(真正的执行)在函数最后一次调用时刻的 wait 毫秒之后.
  // 对于必须在一些输入（多是一些用户操作）停止到达之后执行的行为有帮助。
  // 例如: 渲染一个Markdown格式的评论预览, 当窗口停止改变大小之后重新计算布局, 等等.
  // 传参 immediate 为 true， debounce会在 wait 时间间隔的开始调用这个函数 。
  // 在类似不小心点了提交按钮两下而提交了两次的情况下很有用。
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // 返回一个新的 predicate 函数的否定版本
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // 复合函数计算
  // 即 f(g(h()));
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);


  /*===========================================================================================================*/

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'
  ];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj)
      if (_.has(obj, key)) keys.push(key);
      // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
      length = keys.length,
      results = {},
      currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj),
      key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {},
      obj = object,
      iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) {
        return key in obj;
      };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

  // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs),
      length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor,
        bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
          _.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a),
        key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function() {};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function() {} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));
