(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("SWN", [], factory);
	else if(typeof exports === 'object')
		exports["SWN"] = factory();
	else
		root["SWN"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regeneratorRuntime() { "use strict"; var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor; function n(r) { var e = "function" == typeof r && r.constructor; return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name)); } var o = { "throw": 1, "return": 2, "break": 3, "continue": 3 }; function a(r) { var e, t; return function (n) { e || (e = { stop: function stop() { return t(n.a, 2); }, "catch": function _catch() { return n.v; }, abrupt: function abrupt(r, e) { return t(n.a, o[r], e); }, delegateYield: function delegateYield(r, o, a) { return e.resultName = o, t(n.d, _regeneratorValues(r), a); }, finish: function finish(r) { return t(n.f, r); } }, t = function t(r, _t, o) { n.p = e.prev, n.n = e.next; try { return r(_t, o); } finally { e.next = n.n; } }), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n; try { return r.call(this, e); } finally { n.p = e.prev, n.n = e.next; } }; } return (_regeneratorRuntime = function _regeneratorRuntime() { return { wrap: function wrap(e, t, n, o) { return r.w(a(e), t, n, o && o.reverse()); }, isGeneratorFunction: n, mark: r.m, awrap: function awrap(r, e) { return new _OverloadYield(r, e); }, AsyncIterator: _regeneratorAsyncIterator, async: function async(r, e, t, o, u) { return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u); }, keys: _regeneratorKeys, values: _regeneratorValues }; })(); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _regeneratorKeys(e) { var n = Object(e), r = []; for (var t in n) r.unshift(t); return function e() { for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e; return e.done = !0, e; }; }
function _regeneratorAsync(n, e, r, t, o) { var a = _regeneratorAsyncGen(n, e, r, t, o); return a.next().then(function (n) { return n.done ? n.value : a.next(); }); }
function _regeneratorAsyncGen(r, e, t, o, n) { return new _regeneratorAsyncIterator(_regenerator().w(r, e, t, o), n || Promise); }
function _regeneratorAsyncIterator(t, e) { function n(r, o, i, f) { try { var c = t[r](o), u = c.value; return u instanceof _OverloadYield ? e.resolve(u.v).then(function (t) { n("next", t, i, f); }, function (t) { n("throw", t, i, f); }) : e.resolve(u).then(function (t) { c.value = t, i(c); }, function (t) { return n("throw", t, i, f); }); } catch (t) { f(t); } } var r; this.next || (_regeneratorDefine2(_regeneratorAsyncIterator.prototype), _regeneratorDefine2(_regeneratorAsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function () { return this; })), _regeneratorDefine2(this, "_invoke", function (t, o, i) { function f() { return new e(function (e, r) { n(t, i, e, r); }); } return r = r ? r.then(f, f) : f(); }, !0); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _OverloadYield(e, d) { this.v = e, this.k = d; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var _idCounter = 0;
var _globalModalCount = 0;
var _originalBodyOverflow = null;
function lockBodyScroll() {
  if (_globalModalCount === 0) {
    _originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  _globalModalCount++;
}
function unlockBodyScroll() {
  if (_globalModalCount > 0) {
    _globalModalCount--;
  }
  if (_globalModalCount === 0 && _originalBodyOverflow !== null) {
    document.body.style.overflow = _originalBodyOverflow;
    _originalBodyOverflow = null;
  }
}
function createResult(isConfirmed, value) {
  return {
    isConfirmed: isConfirmed,
    isDismissed: !isConfirmed,
    value: value
  };
}
function calcStackOffset(position, existingToasts) {
  var offset = 0;
  for (var i = 0; i < existingToasts.length; i++) {
    var t = existingToasts[i];
    var rect = t.container.getBoundingClientRect();
    if (rect.height > 0) {
      offset += rect.height + 8;
    } else {
      offset += 60;
    }
  }
  return offset;
}
function getStackBaseline(position) {
  var topPositions = ["top", "top left", "top right"];
  var bottomPositions = ["bottom", "bottom left", "bottom right"];
  if (topPositions.indexOf(position) !== -1) return "top";
  if (bottomPositions.indexOf(position) !== -1) return "bottom";
  return "top";
}
var SWN = /*#__PURE__*/function () {
  function SWN() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, SWN);
    this.options = {
      titleText: options.titleText || "Notice",
      buttonText: options.buttonText || "OK",
      cancelText: options.cancelText || "Cancel",
      template: options.template || null,
      position: options.position || "center",
      bgColor: options.bgColor || "#000000",
      bgOpacity: options.bgOpacity || 0.5,
      bgBlur: options.bgBlur || 0,
      zIndex: options.zIndex || 9999,
      inputPlaceholder: options.inputPlaceholder || "Enter your response...",
      defaultValue: options.defaultValue || "",
      inputType: options.inputType || "text",
      inputAttributes: options.inputAttributes || {},
      preConfirm: options.preConfirm || null,
      closeOnOverlayClick: options.closeOnOverlayClick !== undefined ? options.closeOnOverlayClick : false,
      showCloseButton: options.showCloseButton || false,
      animation: options.animation || null,
      timer: options.timer || null,
      timerProgressBar: options.timerProgressBar || false,
      html: options.html || false,
      onOpen: options.onOpen || null,
      onClose: options.onClose || null
    };
    this.originalAlert = window.alert;
    this.originalConfirm = window.confirm;
    this.originalPrompt = window.prompt;
    this._activeOverlays = [];
    this._queueRunning = false;
  }
  return _createClass(SWN, [{
    key: "openCount",
    get: function get() {
      return this._activeOverlays.length;
    }
  }, {
    key: "_generateId",
    value: function _generateId() {
      return ++_idCounter;
    }
  }, {
    key: "_getAnimationStyles",
    value: function _getAnimationStyles(animation) {
      if (!animation) return {
        enter: {},
        active: {},
        exit: {}
      };
      var duration = animation.duration || 200;
      var type = animation.type || "fade";
      switch (type) {
        case "fade":
          return {
            enter: {
              opacity: "0",
              transition: "opacity " + duration + "ms ease"
            },
            active: {
              opacity: "1"
            },
            exit: {
              opacity: "0",
              transition: "opacity " + duration + "ms ease"
            }
          };
        case "slide-up":
          return {
            enter: {
              opacity: "0",
              transform: "translateY(20px)",
              transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease"
            },
            active: {
              opacity: "1",
              transform: "translateY(0)"
            },
            exit: {
              opacity: "0",
              transform: "translateY(20px)",
              transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease"
            }
          };
        case "slide-down":
          return {
            enter: {
              opacity: "0",
              transform: "translateY(-20px)",
              transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease"
            },
            active: {
              opacity: "1",
              transform: "translateY(0)"
            },
            exit: {
              opacity: "0",
              transform: "translateY(-20px)",
              transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease"
            }
          };
        case "scale":
          return {
            enter: {
              opacity: "0",
              transform: "scale(0.9)",
              transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease"
            },
            active: {
              opacity: "1",
              transform: "scale(1)"
            },
            exit: {
              opacity: "0",
              transform: "scale(0.9)",
              transition: "opacity " + duration + "ms ease, transform " + duration + "ms ease"
            }
          };
        default:
          return {
            enter: {},
            active: {},
            exit: {}
          };
      }
    }
  }, {
    key: "_getToastPositionStyles",
    value: function _getToastPositionStyles(position, offset) {
      var isTop = getStackBaseline(position) === "top";
      var styles = {
        position: "fixed",
        display: "flex",
        zIndex: String((this.options.zIndex || 9999) + 1)
      };
      if (isTop) {
        styles.top = 16 + offset + "px";
      } else {
        styles.bottom = 16 + offset + "px";
      }
      switch (position) {
        case "top":
        case "bottom":
          styles.left = "50%";
          styles.transform = "translateX(-50%)";
          break;
        case "top left":
        case "bottom left":
          styles.left = "16px";
          break;
        case "top right":
        case "bottom right":
          styles.right = "16px";
          break;
        case "left":
          styles.left = "16px";
          styles.top = 16 + offset + "px";
          delete styles.bottom;
          break;
        case "right":
          styles.right = "16px";
          styles.top = 16 + offset + "px";
          delete styles.bottom;
          break;
        default:
          styles.left = "50%";
          styles.transform = "translateX(-50%)";
      }
      return styles;
    }
  }, {
    key: "getPositionStyles",
    value: function getPositionStyles(position) {
      var styles = {
        position: "fixed",
        display: "flex"
      };
      if (position === "center") {
        styles.width = "100%";
      }
      switch (position) {
        case "center":
          styles.top = "0";
          styles.left = "0";
          styles.right = "0";
          styles.bottom = "0";
          styles.alignItems = "center";
          styles.justifyContent = "center";
          styles.padding = "1rem";
          break;
        case "top":
          styles.top = "1rem";
          styles.left = "50%";
          styles.transform = "translateX(-50%)";
          break;
        case "top left":
          styles.top = "1rem";
          styles.left = "1rem";
          styles.alignItems = "flex-start";
          break;
        case "top right":
          styles.top = "1rem";
          styles.right = "1rem";
          styles.alignItems = "flex-start";
          styles.justifyContent = "flex-end";
          break;
        case "bottom":
          styles.bottom = "1rem";
          styles.left = "50%";
          styles.transform = "translateX(-50%)";
          break;
        case "bottom left":
          styles.bottom = "1rem";
          styles.left = "1rem";
          styles.alignItems = "flex-end";
          break;
        case "bottom right":
          styles.bottom = "1rem";
          styles.right = "1rem";
          styles.alignItems = "flex-end";
          styles.justifyContent = "flex-end";
          break;
        case "left":
          styles.left = "1rem";
          styles.top = "50%";
          styles.transform = "translateY(-50%)";
          break;
        case "right":
          styles.right = "1rem";
          styles.top = "50%";
          styles.transform = "translateY(-50%)";
          break;
        default:
          styles.top = "0";
          styles.left = "0";
          styles.right = "0";
          styles.bottom = "0";
          styles.alignItems = "center";
          styles.justifyContent = "center";
          styles.width = "100%";
          styles.padding = "1rem";
      }
      return styles;
    }
  }, {
    key: "applyStyles",
    value: function applyStyles(element, styles) {
      Object.assign(element.style, styles);
    }
  }, {
    key: "createOverlay",
    value: function createOverlay(options) {
      var wrapper = document.createElement("div");
      wrapper.setAttribute("data-swn-overlay-wrapper", "");
      var wrapperStyles = {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: String(options.zIndex)
      };
      if (options.bgBlur > 0) {
        wrapperStyles.backdropFilter = "blur(" + options.bgBlur + "px)";
        wrapperStyles.WebkitBackdropFilter = "blur(" + options.bgBlur + "px)";
      }
      this.applyStyles(wrapper, wrapperStyles);
      var overlay = document.createElement("div");
      overlay.setAttribute("data-swn-overlay", "");
      var overlayStyles = {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: options.bgColor,
        opacity: String(options.bgOpacity)
      };
      this.applyStyles(overlay, overlayStyles);
      wrapper.appendChild(overlay);
      return wrapper;
    }
  }, {
    key: "_applyInputAttributes",
    value: function _applyInputAttributes(inputEl, attributes) {
      if (!attributes || _typeof(attributes) !== "object") return;
      var keys = Object.keys(attributes);
      for (var i = 0; i < keys.length; i++) {
        inputEl.setAttribute(keys[i], attributes[keys[i]]);
      }
    }
  }, {
    key: "_createInput",
    value: function _createInput(type, options) {
      if (type === "textarea") {
        var ta = document.createElement("textarea");
        ta.setAttribute("data-swn-input", "");
        ta.className = "w-full px-3 py-2 border rounded-md mb-4";
        ta.placeholder = options.inputPlaceholder || "Enter your response...";
        ta.value = options.defaultValue || "";
        this._applyInputAttributes(ta, options.inputAttributes);
        return ta;
      }
      var input = document.createElement("input");
      input.setAttribute("data-swn-input", "");
      input.setAttribute("type", type || "text");
      input.className = "w-full px-3 py-2 border rounded-md mb-4";
      input.placeholder = options.inputPlaceholder || "Enter your response...";
      input.value = options.defaultValue || "";
      this._applyInputAttributes(input, options.inputAttributes);
      return input;
    }
  }, {
    key: "createNoticeElement",
    value: function createNoticeElement(message, type, options) {
      var noticeElement;
      var container = document.createElement("div");
      container.setAttribute("data-swn-container", "");
      var isToast = type === "toast";
      if (isToast) {
        container.setAttribute("role", "status");
        container.setAttribute("aria-live", "polite");
      } else {
        container.setAttribute("role", "dialog");
        container.setAttribute("aria-modal", "true");
      }
      var positionStyles = this.getPositionStyles(options.position);
      positionStyles.zIndex = String(options.zIndex + 1);
      this.applyStyles(container, positionStyles);
      var templateId = options.template ? options.template : type === "prompt" ? "#prompt-template" : type === "confirm" ? "#confirm-template" : isToast ? "#toast-template" : null;
      var template = null;
      if (templateId) {
        template = document.querySelector(templateId);
      }
      var needsInput = type === "prompt";
      var needsCancel = type === "confirm" || type === "prompt";
      if (template) {
        noticeElement = template.content.cloneNode(true);
      } else {
        noticeElement = document.createElement("div");
        noticeElement.setAttribute("data-swn", "");
        if (isToast) {
          noticeElement.innerHTML = "<button data-swn-close type=\"button\" aria-label=\"Close\" style=\"position:absolute;top:4px;right:8px;background:transparent;border:none;font-size:18px;cursor:pointer;line-height:1;padding:0;color:inherit;opacity:0.5;\">\xD7</button>" + '<div data-swn-title></div>' + '<div data-swn-body></div>';
        } else if (needsInput) {
          var inputHtml = this._createInput(options.inputType, options).outerHTML;
          noticeElement.innerHTML = '<div data-swn-title></div>' + '<div data-swn-body></div>' + inputHtml + '<div data-swn-validation></div>' + '<div data-swn-buttons>' + '<button data-swn-cancel></button>' + '<button data-swn-ok></button>' + '</div>';
        } else if (needsCancel) {
          noticeElement.innerHTML = '<div data-swn-title></div>' + '<div data-swn-body></div>' + '<div data-swn-buttons>' + '<button data-swn-cancel></button>' + '<button data-swn-ok></button>' + '</div>';
        } else {
          noticeElement.innerHTML = '<div data-swn-title></div>' + '<div data-swn-body></div>' + '<div data-swn-buttons>' + '<button data-swn-ok></button>' + '</div>';
        }
      }
      var titleElement = noticeElement.querySelector("[data-swn-title]");
      var bodyElement = noticeElement.querySelector("[data-swn-body]");
      var okButton = noticeElement.querySelector("[data-swn-ok]");
      var cancelButton = noticeElement.querySelector("[data-swn-cancel]");
      var inputElement = noticeElement.querySelector("[data-swn-input]");
      var closeButton = noticeElement.querySelector("[data-swn-close]");
      var validationElement = noticeElement.querySelector("[data-swn-validation]");
      var id = this._generateId();
      if (titleElement) {
        titleElement.textContent = options.titleText;
        titleElement.id = "swn-title-" + id;
        if (!isToast) {
          container.setAttribute("aria-labelledby", titleElement.id);
        }
      }
      if (bodyElement) {
        if (options.html) {
          bodyElement.innerHTML = message;
        } else {
          bodyElement.textContent = message;
        }
        bodyElement.id = "swn-body-" + id;
        if (!isToast) {
          container.setAttribute("aria-describedby", bodyElement.id);
        }
      }
      if (okButton && !isToast) {
        okButton.textContent = options.buttonText;
      }
      if (cancelButton) {
        if (!needsCancel && !isToast) {
          cancelButton.style.display = "none";
        } else {
          cancelButton.textContent = options.cancelText;
          cancelButton.style.display = "";
        }
      }
      if (inputElement && needsInput) {
        if (template) {
          inputElement.placeholder = options.inputPlaceholder;
          inputElement.value = options.defaultValue || "";
          if (options.inputType && options.inputType !== "textarea") {
            inputElement.setAttribute("type", options.inputType);
          }
          this._applyInputAttributes(inputElement, options.inputAttributes);
          inputElement.style.display = "";
        }
      } else if (inputElement) {
        inputElement.style.display = "none";
      }
      if (closeButton) {
        if (options.showCloseButton || isToast) {
          closeButton.style.display = "";
        } else {
          closeButton.style.display = "none";
        }
      }
      if (validationElement) {
        validationElement.textContent = "";
      }
      var notice = noticeElement.querySelector("[data-swn]");
      if (notice) {
        notice.setAttribute("data-swn-type", type);
        notice.setAttribute("data-swn-position", options.position);
        notice.setAttribute("data-swn-bg-color", options.bgColor);
        notice.setAttribute("data-swn-bg-opacity", String(options.bgOpacity));
        notice.setAttribute("data-swn-bg-blur", String(options.bgBlur));
        notice.setAttribute("data-swn-z-index", String(options.zIndex));
      }
      container.appendChild(noticeElement);
      return {
        container: container
      };
    }
  }, {
    key: "show",
    value: function show(message, options) {
      if (options === undefined) options = {};
      return this._showInternal(message, "alert", options).then(function (result) {
        return undefined;
      });
    }
  }, {
    key: "showPrompt",
    value: function showPrompt(message, options) {
      if (options === undefined) options = {};
      return this._showInternal(message, "prompt", options).then(function (result) {
        return result.isConfirmed ? result.value : null;
      });
    }
  }, {
    key: "showConfirm",
    value: function showConfirm(message, options) {
      if (options === undefined) options = {};
      return this._showInternal(message, "confirm", options).then(function (result) {
        return result.isConfirmed;
      });
    }
  }, {
    key: "showToast",
    value: function showToast(message, options) {
      if (options === undefined) options = {};
      return this._showInternal(message, "toast", options).then(function (result) {
        return result;
      });
    }
  }, {
    key: "showNotice",
    value: function showNotice(message, type, callOptions) {
      if (callOptions === undefined) callOptions = {};
      return this._showInternal(message, type, callOptions).then(function (result) {
        if (type === "alert") return undefined;
        if (type === "confirm") return result.isConfirmed;
        if (type === "prompt") return result.isConfirmed ? result.value : null;
        return result;
      });
    }
  }, {
    key: "fire",
    value: function fire(options) {
      var type = options.type || "alert";
      var message = options.body !== undefined ? options.body : options.message || "";
      var callOptions = {};
      var keys = Object.keys(options);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== "type" && keys[i] !== "body" && keys[i] !== "message") {
          callOptions[keys[i]] = options[keys[i]];
        }
      }
      return this._showInternal(message, type, callOptions);
    }
  }, {
    key: "queue",
    value: function queue(steps) {
      var self = this;
      var results = [];
      function runNext(index) {
        if (index >= steps.length) {
          return Promise.resolve(results);
        }
        return self.fire(steps[index]).then(function (result) {
          results.push(result);
          return runNext(index + 1);
        });
      }
      return runNext(0);
    }
  }, {
    key: "_showInternal",
    value: function _showInternal(message, type, callOptions) {
      var self = this;
      var currentOptions = {};
      var optsKeys = Object.keys(this.options);
      for (var i = 0; i < optsKeys.length; i++) {
        currentOptions[optsKeys[i]] = this.options[optsKeys[i]];
      }
      var callKeys = Object.keys(callOptions);
      for (var j = 0; j < callKeys.length; j++) {
        currentOptions[callKeys[j]] = callOptions[callKeys[j]];
      }
      var isToast = type === "toast";
      return new Promise(function (resolve) {
        var previousActiveElement = document.activeElement;
        var result = self.createNoticeElement(message, type, currentOptions);
        var container = result.container;
        var overlay = null;
        var dismissReason = null;
        if (!isToast) {
          overlay = self.createOverlay(currentOptions);
          document.body.appendChild(overlay);
        } else {
          var toastsAtPosition = self._activeOverlays.filter(function (item) {
            return item.type === "toast" && item.currentOptions.position === currentOptions.position;
          });
          var offset = calcStackOffset(currentOptions.position, toastsAtPosition);
          var toastStyles = self._getToastPositionStyles(currentOptions.position, offset);
          self.applyStyles(container, toastStyles);
        }
        document.body.appendChild(container);
        if (!isToast) {
          lockBodyScroll();
        }
        var activeNotice = {
          overlay: overlay,
          container: container,
          currentOptions: currentOptions,
          type: type,
          resolve: resolve,
          previousActiveElement: previousActiveElement,
          handleKeyDown: null,
          timerId: null,
          pauseTimer: null,
          resumeTimer: null
        };
        self._activeOverlays.push(activeNotice);
        var okButton = container.querySelector("[data-swn-ok]");
        var cancelButton = container.querySelector("[data-swn-cancel]");
        var inputElement = container.querySelector("[data-swn-input]");
        var closeButton = container.querySelector("[data-swn-close]");
        var validationElement = container.querySelector("[data-swn-validation]");
        var timerBarElement = container.querySelector("[data-swn-timer-bar]");
        var focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        var firstFocusableElement = focusableElements[0];
        var lastFocusableElement = focusableElements[focusableElements.length - 1];
        var resolved = false;
        var resolveWithResult = function resolveWithResult(resultVal, reason) {
          if (resolved) return;
          resolved = true;
          if (reason) dismissReason = reason;
          cleanup();
          resolve(resultVal);
        };
        var handleConfirm = function handleConfirm() {
          var inputValue = inputElement ? inputElement.value : undefined;
          if (typeof currentOptions.preConfirm === "function" && type === "prompt") {
            var preResult;
            try {
              preResult = currentOptions.preConfirm(inputValue);
            } catch (err) {
              if (validationElement) {
                validationElement.textContent = err.message || String(err);
              }
              return;
            }
            if (preResult && typeof preResult.then === "function") {
              if (okButton) {
                okButton.disabled = true;
                okButton.textContent = "...";
              }
              preResult.then(function (validatedValue) {
                resolveWithResult(createResult(true, validatedValue), "confirm");
              })["catch"](function (err) {
                if (okButton) {
                  okButton.disabled = false;
                  okButton.textContent = currentOptions.buttonText;
                }
                if (validationElement) {
                  validationElement.textContent = err.message || String(err);
                }
              });
              return;
            }
            resolveWithResult(createResult(true, preResult !== undefined ? preResult : inputValue), "confirm");
            return;
          }
          if (type === "prompt") {
            resolveWithResult(createResult(true, inputValue), "confirm");
          } else if (type === "confirm") {
            resolveWithResult(createResult(true, true), "confirm");
          } else {
            resolveWithResult(createResult(true, undefined), "confirm");
          }
        };
        var dismiss = function dismiss(dismissVal) {
          if (type === "prompt") {
            resolveWithResult(createResult(false, null), dismissVal);
          } else if (type === "confirm") {
            resolveWithResult(createResult(false, false), dismissVal);
          } else {
            resolveWithResult(createResult(false, undefined), dismissVal);
          }
        };
        var cleanup = function cleanup() {
          if (activeNotice.handleKeyDown) {
            document.removeEventListener("keydown", activeNotice.handleKeyDown);
          }
          if (activeNotice.timerId) {
            clearTimeout(activeNotice.timerId);
            activeNotice.timerId = null;
          }
          var animation = currentOptions.animation;
          if (animation) {
            var animStyles = self._getAnimationStyles(animation);
            var noticeEl = container.querySelector("[data-swn]") || container;
            if (animStyles.exit) {
              self.applyStyles(noticeEl, animStyles.exit);
            }
            var exitDuration = animation.duration || 200;
            setTimeout(function () {
              if (overlay && overlay.parentNode) overlay.remove();
              if (container.parentNode) container.remove();
            }, exitDuration);
          } else {
            if (overlay && overlay.parentNode) overlay.remove();
            if (container.parentNode) container.remove();
          }
          self._activeOverlays = self._activeOverlays.filter(function (item) {
            return item.container !== container;
          });
          if (!isToast) {
            unlockBodyScroll();
            if (previousActiveElement && typeof previousActiveElement.focus === "function") {
              try {
                previousActiveElement.focus();
              } catch (e) {}
            }
          }
          if (isToast) {
            self._repositionToasts(currentOptions.position);
          }
          self._dispatchEvent(container, "swn:close", {
            type: type
          });
          if (typeof currentOptions.onClose === "function") {
            currentOptions.onClose();
          }
        };
        var handleKeyDown;
        if (!isToast) {
          handleKeyDown = function handleKeyDown(e) {
            var isTabPressed = e.key === "Tab" || e.keyCode === 9;
            var isEscPressed = e.key === "Escape" || e.keyCode === 27;
            if (isEscPressed) {
              dismiss("esc");
              return;
            }
            if (!isTabPressed) return;
            if (e.shiftKey) {
              if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
              }
            }
          };
          activeNotice.handleKeyDown = handleKeyDown;
          document.addEventListener("keydown", handleKeyDown);
        }
        if (okButton && !isToast) {
          okButton.addEventListener("click", function () {
            handleConfirm();
            self._dispatchEvent(container, "swn:confirm", {
              type: type
            });
          });
        }
        if (cancelButton) {
          cancelButton.addEventListener("click", function () {
            dismiss("cancel");
            self._dispatchEvent(container, "swn:cancel", {
              type: type
            });
          });
        }
        if (closeButton) {
          closeButton.addEventListener("click", function () {
            dismiss("close");
          });
        }
        if (inputElement && type === "prompt") {
          inputElement.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.keyCode === 13) {
              if (inputElement.tagName === "TEXTAREA") return;
              e.preventDefault();
              handleConfirm();
            }
          });
        }
        if (currentOptions.closeOnOverlayClick && overlay) {
          overlay.addEventListener("click", function (e) {
            if (e.target === overlay || e.target.hasAttribute("data-swn-overlay")) {
              dismiss("overlay");
            }
          });
        }
        if (currentOptions.timer && currentOptions.timer > 0) {
          var timerDuration = currentOptions.timer;
          var startTimer = Date.now();
          var remainingTime = timerDuration;
          if (timerBarElement && currentOptions.timerProgressBar) {
            timerBarElement.classList.add("swn-timer-active");
            timerBarElement.style.transition = "none";
            timerBarElement.style.width = "100%";
            requestAnimationFrame(function () {
              timerBarElement.style.transition = "width " + timerDuration + "ms linear";
              timerBarElement.style.width = "0%";
            });
          }
          activeNotice.timerId = setTimeout(function () {
            if (!resolved) {
              dismiss("timer");
            }
          }, timerDuration);
          activeNotice.pauseTimer = function () {
            if (activeNotice.timerId) {
              clearTimeout(activeNotice.timerId);
              activeNotice.timerId = null;
              remainingTime -= Date.now() - startTimer;
            }
            if (timerBarElement && currentOptions.timerProgressBar) {
              var computedWidth = getComputedStyle(timerBarElement).width;
              timerBarElement.style.transition = "none";
              timerBarElement.style.width = computedWidth;
            }
          };
          activeNotice.resumeTimer = function () {
            startTimer = Date.now();
            if (timerBarElement && currentOptions.timerProgressBar && remainingTime > 0) {
              timerBarElement.style.transition = "width " + remainingTime + "ms linear";
              requestAnimationFrame(function () {
                timerBarElement.style.width = "0%";
              });
            }
            activeNotice.timerId = setTimeout(function () {
              if (!resolved) {
                dismiss("timer");
              }
            }, remainingTime);
          };
          var hoverTarget = isToast ? container : container.querySelector("[data-swn]") || container;
          hoverTarget.addEventListener("mouseenter", function () {
            if (activeNotice.pauseTimer) activeNotice.pauseTimer();
          });
          hoverTarget.addEventListener("mouseleave", function () {
            if (activeNotice.resumeTimer) activeNotice.resumeTimer();
          });
        }
        if (currentOptions.animation) {
          var animStyles2 = self._getAnimationStyles(currentOptions.animation);
          var noticeEl2 = container.querySelector("[data-swn]") || container;
          if (animStyles2.enter) {
            self.applyStyles(noticeEl2, animStyles2.enter);
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                self.applyStyles(noticeEl2, animStyles2.active || {});
              });
            });
          }
        }
        if (!isToast) {
          if (type === "prompt" || inputElement && type === "prompt") {
            inputElement.focus();
            if (inputElement.select) inputElement.select();
          } else if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
        self._dispatchEvent(container, "swn:open", {
          type: type
        });
        if (typeof currentOptions.onOpen === "function") {
          currentOptions.onOpen();
        }
      });
    }
  }, {
    key: "_repositionToasts",
    value: function _repositionToasts(position) {
      var toastsAtPosition = this._activeOverlays.filter(function (item) {
        return item.type === "toast" && item.currentOptions.position === position;
      });
      var offset = 0;
      for (var i = 0; i < toastsAtPosition.length; i++) {
        var item = toastsAtPosition[i];
        var rect = item.container.getBoundingClientRect();
        var toastStyles = this._getToastPositionStyles(position, offset);
        var isTop = getStackBaseline(position) === "top";
        var currentTransform = item.container.style.transform || "";
        if (isTop || position === "left" || position === "right") {
          item.container.style.top = toastStyles.top || "";
          item.container.style.bottom = toastStyles.bottom || "";
        } else {
          item.container.style.bottom = toastStyles.bottom || "";
          item.container.style.top = toastStyles.top || "";
        }
        if (toastStyles.left) item.container.style.left = toastStyles.left;
        if (toastStyles.right) item.container.style.right = toastStyles.right;
        var h = rect.height > 0 ? rect.height : 60;
        offset += h + 8;
      }
    }
  }, {
    key: "_dispatchEvent",
    value: function _dispatchEvent(element, eventName, detail) {
      var event;
      if (typeof CustomEvent === "function") {
        event = new CustomEvent(eventName, {
          bubbles: true,
          detail: detail || {}
        });
      } else {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventName, true, true, detail || {});
      }
      try {
        element.dispatchEvent(event);
      } catch (e) {}
    }
  }, {
    key: "destroy",
    value: function destroy() {
      for (var i = 0; i < this._activeOverlays.length; i++) {
        var item = this._activeOverlays[i];
        var isToast = item.type === "toast";
        item.resolve(createResult(false, item.type === "prompt" ? null : item.type === "confirm" ? false : undefined));
        if (item.handleKeyDown) {
          document.removeEventListener("keydown", item.handleKeyDown);
        }
        if (item.timerId) {
          clearTimeout(item.timerId);
        }
        if (item.overlay && item.overlay.parentNode) item.overlay.remove();
        if (item.container.parentNode) item.container.remove();
        if (typeof item.currentOptions.onClose === "function") {
          item.currentOptions.onClose();
        }
        if (!isToast) {
          unlockBodyScroll();
        }
      }
      this._activeOverlays = [];
    }
  }, {
    key: "getOptionsFromElement",
    value: function getOptionsFromElement(element) {
      var options = {};
      var dataset = element.dataset;
      if (dataset.swnTitle) options.titleText = dataset.swnTitle;
      if (dataset.swnOkText) options.buttonText = dataset.swnOkText;
      if (dataset.swnCancelText) options.cancelText = dataset.swnCancelText;
      if (dataset.swnTemplate) options.template = dataset.swnTemplate;
      if (dataset.swnPosition) options.position = dataset.swnPosition;
      if (dataset.swnBgColor) options.bgColor = dataset.swnBgColor;
      if (dataset.swnBgOpacity) options.bgOpacity = parseFloat(dataset.swnBgOpacity);
      if (dataset.swnBgBlur) options.bgBlur = parseInt(dataset.swnBgBlur, 10);
      if (dataset.swnZIndex) options.zIndex = parseInt(dataset.swnZIndex, 10);
      if (dataset.swnCloseOnOverlayClick) options.closeOnOverlayClick = dataset.swnCloseOnOverlayClick === "true";
      if (dataset.swnShowCloseButton) options.showCloseButton = dataset.swnShowCloseButton === "true";
      if (dataset.swnHtml) options.html = dataset.swnHtml === "true";
      if (dataset.swnTimer) options.timer = parseInt(dataset.swnTimer, 10);
      if (dataset.swnTimerProgressBar) options.timerProgressBar = dataset.swnTimerProgressBar === "true";
      if (dataset.swnInputType) options.inputType = dataset.swnInputType;
      if (dataset.swnAnimation) {
        try {
          options.animation = JSON.parse(dataset.swnAnimation);
        } catch (e) {
          options.animation = {
            type: dataset.swnAnimation
          };
        }
      }
      return options;
    }
  }, {
    key: "install",
    value: function install() {
      var self = this;
      window.alert = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(message) {
          var options;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                options = {};
                if (document.activeElement && document.activeElement.hasAttribute("data-swn-trigger")) {
                  options = self.getOptionsFromElement(document.activeElement);
                }
                _context.next = 4;
                return self.show(message, options);
              case 4:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }();
      window.confirm = /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(message) {
          var options;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                options = {};
                if (document.activeElement && document.activeElement.hasAttribute("data-swn-trigger")) {
                  options = self.getOptionsFromElement(document.activeElement);
                }
                _context2.next = 4;
                return self.showConfirm(message, options);
              case 4:
                return _context2.abrupt("return", _context2.sent);
              case 5:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }));
        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      }();
      window.prompt = /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(message, defaultValue) {
          var options;
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                options = {};
                if (document.activeElement && document.activeElement.hasAttribute("data-swn-trigger")) {
                  options = self.getOptionsFromElement(document.activeElement);
                }
                _context3.next = 4;
                return self.showPrompt(message, _objectSpread({
                  defaultValue: defaultValue !== undefined ? defaultValue : ""
                }, options));
              case 4:
                return _context3.abrupt("return", _context3.sent);
              case 5:
              case "end":
                return _context3.stop();
            }
          }, _callee3);
        }));
        return function (_x3, _x4) {
          return _ref3.apply(this, arguments);
        };
      }();
    }
  }, {
    key: "uninstall",
    value: function uninstall() {
      window.alert = this.originalAlert;
      window.confirm = this.originalConfirm;
      window.prompt = this.originalPrompt;
    }
  }]);
}();
document.addEventListener("DOMContentLoaded", function () {
  var templates = document.querySelectorAll("template");
  var hasValidTemplate = false;
  for (var i = 0; i < templates.length; i++) {
    if (templates[i].content.querySelector("[data-swn]")) {
      hasValidTemplate = true;
      break;
    }
  }
  var triggers = document.querySelectorAll("[data-swn-trigger]");
  if (hasValidTemplate && triggers.length > 0) {
    var swn = new SWN();
    swn.install();
  }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SWN);
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=swn.js.map