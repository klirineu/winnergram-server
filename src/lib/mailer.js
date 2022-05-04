"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _nodemailer = require('nodemailer'); var _nodemailer2 = _interopRequireDefault(_nodemailer);
var _transport = require('../configs/transport'); var _transport2 = _interopRequireDefault(_transport);

exports. default = _nodemailer2.default.createTransport(_transport2.default);