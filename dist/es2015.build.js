/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var noop = function noop() {};

	function api() {
	    var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

	    return new Promise(function (resolve, reject) {
	        var value = 'foobar';
	        resolve(value);
	        cb(null, value);
	    });
	}

	api(function (err, data) {
	    if (err) {
	        return console.error(err);
	    }
	});

	api().then(function (value) {}).catch(function (err) {
	    return console.errog(err);
	});

	var obj = {
	    msg: 'hello world',
	    foo: function foo() {
	        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.msg;

	        console.log(arguments);
	    }
	};

	function sum() {
	    for (var _len = arguments.length, numbers = Array(_len), _key = 0; _key < _len; _key++) {
	        numbers[_key] = arguments[_key];
	    }

	    return numbers.reduce(function (a, b) {
	        return a + b;
	    });
	}

	sum.apply(undefined, [1, 2, 3]);

	var set = new Set([1, 2, 3, 4]);

	var Animal = function () {
	    function Animal(a, b, c) {
	        _classCallCheck(this, Animal);

	        this.a = a;
	        this.b = b;
	        this.c = c;
	    }

	    _createClass(Animal, null, [{
	        key: 'extend',
	        value: function extend(constructor) {
	            for (var _len2 = arguments.length, _args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	                _args[_key2 - 1] = arguments[_key2];
	            }

	            return function (_Animal) {
	                _inherits(_class, _Animal);

	                function _class() {
	                    var _ref;

	                    _classCallCheck(this, _class);

	                    var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(_args)));

	                    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	                        args[_key3] = arguments[_key3];
	                    }

	                    constructor.call.apply(constructor, [_this].concat(args));
	                    return _this;
	                }

	                return _class;
	            }(Animal);
	        }
	    }]);

	    return Animal;
	}();

	var Point2D = function () {
	    function Point2D(x, y) {
	        _classCallCheck(this, Point2D);

	        this.x = x;
	        this.y = y;
	    }

	    _createClass(Point2D, [{
	        key: 'toString',
	        value: function toString() {
	            return '(' + this.x + ',' + this.y + ')';
	        }
	    }]);

	    return Point2D;
	}();

	Point2D.prototype.valueOf = function (argument) {
	    return this.valueOf();
	};

	var Point3D = function (_Point2D) {
	    _inherits(Point3D, _Point2D);

	    function Point3D() {
	        _classCallCheck(this, Point3D);

	        var _this2 = _possibleConstructorReturn(this, (Point3D.__proto__ || Object.getPrototypeOf(Point3D)).call(this));

	        _this2.x = 1;
	        return _this2;
	    }

	    _createClass(Point3D, [{
	        key: 'abc',
	        value: function abc() {
	            return 'Aho';
	        }
	    }]);

	    return Point3D;
	}(Point2D);

	var Layer = function () {
	    function Layer(selector, config) {
	        _classCallCheck(this, Layer);

	        this.el = selector;
	        this.config = config;
	    }

	    _createClass(Layer, [{
	        key: 'init',
	        value: function init() {
	            this.createTemplate();
	        }
	    }, {
	        key: 'createTemplate',
	        value: function createTemplate() {
	            var str = '<div>hello world</div>';
	        }
	    }], [{
	        key: 'destroy',
	        value: function destroy(constructor) {
	            delete this;
	        }
	    }]);

	    return Layer;
	}();

	var Dialog = function (_Layer) {
	    _inherits(Dialog, _Layer);

	    function Dialog() {
	        _classCallCheck(this, Dialog);

	        var _this3 = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this, arguments));
	        // 此处需要非常注意的是，
	        // 如果子类继承父类，那么在子类的constructor中必须使用 super 函数
	        // 才能够在子类的constructor中使用this，否则会报错


	        _this3.width = 100;
	        _this3.height = 200;
	        return _this3;
	    }

	    _createClass(Dialog, [{
	        key: 'show',
	        value: function show() {
	            this.style.display = 'block';
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            this.style.display = 'none';
	        }
	    }]);

	    return Dialog;
	}(Layer);

/***/ }
/******/ ]);