"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LieuxService = void 0;

var _config = require("../backend/config.js");

var _firestore = require("firebase/firestore");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var col = (0, _firestore.collection)(_config.db, "lieux");
var LieuxService = {
  getAll: function getAll(lieux) {
    var lieuxDoc;
    return regeneratorRuntime.async(function getAll$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap((0, _firestore.getDocs)(col).then(function (snap) {
              snap.forEach(function (doc) {
                lieux.push(_objectSpread({}, doc.data(), {
                  id: doc.id
                }));
              });
            }));

          case 3:
            lieuxDoc = _context.sent;
            return _context.abrupt("return", lieuxDoc);

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 7]]);
  }
};
exports.LieuxService = LieuxService;