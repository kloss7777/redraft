"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _arrayEqual = _interopRequireDefault(require("./helpers/arrayEqual"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ContentNode = /*#__PURE__*/function () {
  function ContentNode(props) {
    _classCallCheck(this, ContentNode);
    this.content = props.content || [];
    this.start = typeof props.start !== 'undefined' ? props.start : null;
    this.end = typeof props.end !== 'undefined' ? props.end : null;
    this.entity = typeof props.entity !== 'undefined' ? props.entity : null;
    this.decorator = typeof props.decorator !== 'undefined' ? props.decorator : null;
    this.decoratorProps = props.decoratorProps || null;
    this.decoratedText = typeof props.decoratedText !== 'undefined' ? props.decoratedText : null;
    this.contentState = props.contentState;
    this.style = props.style || null;
    this.styles = props.styles || null;
    this.block = props.block || {};
  }
  _createClass(ContentNode, [{
    key: "getCurrentContent",
    value: function getCurrentContent() {
      return this.content[this.content.length - 1];
    }
  }, {
    key: "addToCurrentContent",
    value: function addToCurrentContent(string) {
      this.content[this.content.length - 1] = this.content[this.content.length - 1] + string;
    }
  }, {
    key: "handleFlatPush",
    value: function handleFlatPush(string, stack) {
      var current = this.getCurrentContent();
      // if the stacks are equal just add the string to the current node
      if (current instanceof ContentNode && (0, _arrayEqual["default"])(stack, current.styles)) {
        current.addToCurrentContent(string);
        return;
      }
      // create a node with whole styles stack
      var newNode = new ContentNode({
        styles: _toConsumableArray(stack),
        content: [string]
      });
      this.content.push(newNode);
    }
  }, {
    key: "pushContent",
    value: function pushContent(string) {
      var stack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var flat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // we can just concat strings when both the pushed item
      // and the last element of the content array is a string
      if (!stack || stack.length < 1) {
        if (typeof string === 'string' && typeof this.getCurrentContent() === 'string') {
          this.addToCurrentContent(string);
        } else {
          this.content.push(string);
        }
        return this;
      }
      // handle flat structure
      if (flat) {
        this.handleFlatPush(string, stack);
        return this;
      }
      var _stack = _toArray(stack),
        head = _stack[0],
        rest = _stack.slice(1);
      var current = this.getCurrentContent();
      if (current instanceof ContentNode && current.style === head) {
        current.pushContent(string, rest, flat);
      } else {
        var newNode = new ContentNode({
          style: head
        });
        newNode.pushContent(string, rest, flat);
        this.content.push(newNode);
      }
      return this;
    }
  }]);
  return ContentNode;
}();
var _default = ContentNode;
exports["default"] = _default;