"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CategorieService = void 0;

var _config = require("../backend/config.js");

var _firestore = require("firebase/firestore");

//import { ref, getDownloadURL } from "firebase/storage";
var CategorieService = {
  getAll: function getAll(cats) {
    var col, doc;
    return regeneratorRuntime.async(function getAll$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            col = (0, _firestore.collection)(_config.db, "categories");
            _context.next = 4;
            return regeneratorRuntime.awrap((0, _firestore.getDocs)(col).then(function (snap) {
              snap.forEach(function (doc) {
                cats.push(doc.data());
              });
            }));

          case 4:
            doc = _context.sent;
            return _context.abrupt("return", doc);

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 8]]);
  }
};
exports.CategorieService = CategorieService;