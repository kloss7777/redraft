"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ContentNode = _interopRequireDefault(require("./ContentNode"));
var _usc2code = require("./helpers/usc2code");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Slices the decoded ucs2 array and encodes the result back to a string representation
 */
var getString = function getString(array, from, to) {
  return (0, _usc2code.ucs2encode)(array.slice(from, to));
};

/**
 * creates nodes with entity keys and the endOffset
 */
function createNodes(entityRanges) {
  var decoratorRanges = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var textArray = arguments.length > 2 ? arguments[2] : undefined;
  var block = arguments.length > 3 ? arguments[3] : undefined;
  var lastIndex = 0;
  var mergedRanges = [].concat(_toConsumableArray(entityRanges), _toConsumableArray(decoratorRanges)).sort(function (a, b) {
    return a.offset - b.offset;
  });
  var nodes = [];
  // if thers no entities will return just a single item
  if (mergedRanges.length < 1) {
    nodes.push(new _ContentNode["default"]({
      block: block,
      start: 0,
      end: textArray.length
    }));
    return nodes;
  }
  mergedRanges.forEach(function (range) {
    // create an empty node for content between previous and this entity
    if (range.offset > lastIndex) {
      nodes.push(new _ContentNode["default"]({
        block: block,
        start: lastIndex,
        end: range.offset
      }));
    }
    // push the node for the entity
    nodes.push(new _ContentNode["default"]({
      block: block,
      entity: range.key,
      decorator: range.component,
      decoratorProps: range.decoratorProps,
      decoratedText: range.component ? getString(textArray, range.offset, range.offset + range.length) : undefined,
      start: range.offset,
      end: range.offset + range.length,
      contentState: range.contentState
    }));
    lastIndex = range.offset + range.length;
  });

  // finaly add a node for the remaining text if any
  if (lastIndex < textArray.length) {
    nodes.push(new _ContentNode["default"]({
      block: block,
      start: lastIndex,
      end: textArray.length
    }));
  }
  return nodes;
}
function addIndexes(indexes, ranges) {
  ranges.forEach(function (range) {
    indexes.push(range.offset);
    indexes.push(range.offset + range.length);
  });
  return indexes;
}

/**
 * Creates an array of sorted char indexes to avoid iterating over every single character
 */
function getRelevantIndexes(text, inlineRanges) {
  var entityRanges = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var decoratorRanges = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var relevantIndexes = [];
  // set indexes to corresponding keys to ensure uniquenes
  relevantIndexes = addIndexes(relevantIndexes, inlineRanges);
  relevantIndexes = addIndexes(relevantIndexes, entityRanges);
  relevantIndexes = addIndexes(relevantIndexes, decoratorRanges);
  // add text start and end to relevant indexes
  relevantIndexes.push(0);
  relevantIndexes.push(text.length);
  var uniqueRelevantIndexes = relevantIndexes.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
  // and sort it
  return uniqueRelevantIndexes.sort(function (aa, bb) {
    return aa - bb;
  });
}
var RawParser = /*#__PURE__*/function () {
  function RawParser(_ref) {
    var _ref$flat = _ref.flat,
      flat = _ref$flat === void 0 ? false : _ref$flat;
    _classCallCheck(this, RawParser);
    this.flat = flat;
  }
  _createClass(RawParser, [{
    key: "relevantStyles",
    value: function relevantStyles(offset) {
      var styles = this.ranges.filter(function (range) {
        return offset >= range.offset && offset < range.offset + range.length;
      });
      return styles.map(function (style) {
        return style.style;
      });
    }

    /**
     * Loops over relevant text indexes
     */
  }, {
    key: "nodeIterator",
    value: function nodeIterator(node, start, end) {
      var _this = this;
      var indexes = this.relevantIndexes.slice(this.relevantIndexes.indexOf(start), this.relevantIndexes.indexOf(end));
      // loops while next index is smaller than the endOffset
      indexes.forEach(function (index, key) {
        // figure out what styles this char and the next char need
        // (regardless of whether there *is* a next char or not)
        var characterStyles = _this.relevantStyles(index);
        // calculate distance or set it to 1 if thers no next index
        var distance = indexes[key + 1] ? indexes[key + 1] - index : 1;
        // add all the chars up to next relevantIndex
        var text = getString(_this.textArray, index, index + distance);
        node.pushContent(text, characterStyles, _this.flat);

        // if thers no next index and thers more text left to push
        if (!indexes[key + 1] && index < end) {
          node.pushContent(getString(_this.textArray, index + 1, end), _this.relevantStyles(end - 1), _this.flat);
        }
      });
      return node;
    }

    /**
     * Converts raw block to object with nested style objects,
     * while it returns an object not a string
     * the idea is still mostly same as backdraft.js (https://github.com/evanc/backdraft-js)
     */
  }, {
    key: "parse",
    value: function parse(block) {
      var _this2 = this;
      var text = block.text,
        ranges = block.inlineStyleRanges,
        entityRanges = block.entityRanges,
        _block$decoratorRange = block.decoratorRanges,
        decoratorRanges = _block$decoratorRange === void 0 ? [] : _block$decoratorRange;
      // Some unicode charactes actualy have length of more than 1
      // this creates an array of code points using es6 string iterator
      this.textArray = (0, _usc2code.ucs2decode)(text);
      this.ranges = ranges;
      this.iterator = 0;
      // get all the relevant indexes for whole block
      this.relevantIndexes = getRelevantIndexes(text, ranges, entityRanges, decoratorRanges);
      // create entity or empty nodes to place the inline styles in
      var nodes = createNodes(entityRanges, decoratorRanges, this.textArray, block);
      var parsedNodes = nodes.map(function (node) {
        return _this2.nodeIterator(node, node.start, node.end);
      });
      return new _ContentNode["default"]({
        block: block,
        content: parsedNodes
      });
    }
  }]);
  return RawParser;
}();
exports["default"] = RawParser;