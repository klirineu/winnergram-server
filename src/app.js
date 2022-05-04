"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _morgan = require('morgan'); var _morgan2 = _interopRequireDefault(_morgan);
var _routes = require('./routes');

const app = _express2.default.call(void 0, );

app.use(_cors2.default.call(void 0, "*"));
app.use(_express2.default.json({ limit: "50mb" }));
app.use(
    _express2.default.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use("/wg", _routes.Router);
app.use(_morgan2.default.call(void 0, "dev"));

exports.app = app;
