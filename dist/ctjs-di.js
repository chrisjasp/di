(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ctjs-di"] = factory();
	else
		root["ctjs-di"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = exports.Context = function () {
  function Context() {
    _classCallCheck(this, Context);

    this._map = {};
  }

  _createClass(Context, [{
    key: 'entry',
    value: function entry(name) {
      return this._map[name];
    }
  }, {
    key: 'register',
    value: function register(name, type, args) {
      var entry = new ContextEntry(name, this).type(type).args(args);
      this._map[name] = entry;
      return entry;
    }
  }, {
    key: 'has',
    value: function has(name) {
      return this.entry(name) != null;
    }
  }, {
    key: 'get',
    value: function get(name) {
      if (this.has(name)) {
        return this.entry(name).object();
      } else {
        throw Error('Object[' + name + '] is not registerd');
      }
    }
  }, {
    key: 'create',
    value: function create(name, args) {
      if (this.entry(name).strategy() != Strategy.proto) {
        throw Error('Attempt to create singleton object');
      }

      if (this.has(name)) {
        return this.entry(name).create(args);
      } else {
        throw Error('Object[' + name + '] is not registered');
      }
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      for (var name in this._map) {
        var entry = this.entry(name);
        this.ready(this.inject(name, this.get(name), entry.dependencies()));
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      this._map = {};
    }
  }, {
    key: 'removeSpaces',
    value: function removeSpaces(s) {
      while (s.indexOf(' ') >= 0) {
        s = s.replace(' ', '');
      }return s;
    }
  }, {
    key: 'inject',
    value: function inject(name, o, dependencies) {
      var _this = this;

      dependencies = dependencies ? dependencies : o.dependencies;
      if (o && dependencies) {
        var depExpList = this.removeSpaces(dependencies).split(',');
        depExpList.forEach(function (depExp) {
          if (depExp) {
            var exp = new DependencyExpression(depExp);
            var dep = _this.get(exp.name);
            if (dep == null) {
              throw Error('Dependency [' + name + '.' + exp.property + ']->[' + exp.name + '] can not be satisfied');
            }
            o[exp.property] = dep;
          }
        });
      }
      return o;
    }
  }, {
    key: 'ready',
    value: function ready(o) {
      if (typeof o.ready === 'function') {
        o.ready();
      }
      return o;
    }
  }]);

  return Context;
}();

var ContextEntry = function () {
  function ContextEntry(name, ctx) {
    _classCallCheck(this, ContextEntry);

    this._name = name;
    this._ctx = ctx;
    this._strategy = Strategy.singleton;
    this._factory = this.__factory;
  }

  _createClass(ContextEntry, [{
    key: 'create',
    value: function create(newArgs) {
      return this._strategy(this._name, this._object, this._factory, this._type, newArgs ? newArgs : this._args, this._ctx, this._dependencies);
    }
  }, {
    key: 'object',
    value: function object(o) {
      if (!arguments.length) {
        this._object = this.create();
        return this._object;
      } else {
        this._object = o;
        return this;
      }
    }
  }, {
    key: 'strategy',
    value: function strategy(s) {
      if (!arguments.length) {
        return this._strategy;
      }
      this._strategy = s;
      return this;
    }
  }, {
    key: 'type',
    value: function type(t) {
      if (!arguments.length) {
        return this._type;
      }
      this._type = t;
      return this;
    }
  }, {
    key: 'dependencies',
    value: function dependencies(d) {
      if (!arguments.length) {
        return this._dependencies;
      }
      this._dependencies = d;
      return this;
    }
  }, {
    key: 'args',
    value: function args(a) {
      if (!arguments.length) {
        return this._args;
      }
      this._args = a;
      return this;
    }
  }, {
    key: 'factory',
    value: function factory(f) {
      if (!arguments.length) {
        return this._factory;
      }
      this._factory = f;
      return this;
    }
  }, {
    key: '__factory',
    value: function __factory(type, args) {
      if (args instanceof Array) {
        return eval(DiUtils.invokeStmt(args, 'new')); // eslint-disable-line no-eval
      } else {
        return new type(args); // eslint-disable-line new-cap
      }
    }
  }]);

  return ContextEntry;
}();

var Strategy = function () {
  function Strategy() {
    _classCallCheck(this, Strategy);
  }

  _createClass(Strategy, null, [{
    key: 'proto',
    value: function proto(name, object, factory, type, args, ctx, dependencies) {
      object = factory(type, args);
      return ctx.ready(ctx.inject(name, object, dependencies));
    }
  }, {
    key: 'singleton',
    value: function singleton(name, object, factory, type, args, ctx, dependencies) {
      if (!object) {
        object = factory(type, args);
      }
      return object;
    }
  }]);

  return Strategy;
}();

var DiUtils = function () {
  function DiUtils() {
    _classCallCheck(this, DiUtils);
  }

  _createClass(DiUtils, null, [{
    key: 'invokeStmt',
    value: function invokeStmt(args, op) {
      var exp = op ? op : '';
      exp += ' type(';
      var i = 0;
      for (; i < args.length; ++i) {
        exp += 'args[' + i + '],';
      }
      if (i > 0) {
        exp = exp.slice(0, exp.length - 1);
      }
      exp += ')';
      return exp;
    }
  }]);

  return DiUtils;
}();

var DependencyExpression = function DependencyExpression(depExp) {
  _classCallCheck(this, DependencyExpression);

  var property = depExp;
  var name = depExp;
  if (depExp.indexOf('=') > 0) {
    var depExpParts = depExp.split('=');
    property = depExpParts[0];
    name = depExpParts[1];
  }
  this.name = name;
  this.property = property;
};

var Di = exports.Di = function () {
  function Di() {
    _classCallCheck(this, Di);
  }

  _createClass(Di, null, [{
    key: 'createContext',
    value: function createContext() {
      return new Context();
    }
  }, {
    key: 'version',
    get: function get() {
      return '1.0.0';
    }
  }]);

  return Di;
}();

/***/ })
/******/ ]);
});