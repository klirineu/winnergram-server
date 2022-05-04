"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jwtmodule = require('../modules/jwt.module'); var _jwtmodule2 = _interopRequireDefault(_jwtmodule);
var _httperrors = require('http-errors'); var _httperrors2 = _interopRequireDefault(_httperrors);

const Guard = async (req, res, next) => {
    if (!req.headers.auth) return next(_httperrors2.default.Unauthorized('Access token is required'));
    const token = req.headers['auth'];

    if (!token) return next(_httperrors2.default.Unauthorized());
    await _jwtmodule2.default.check(token).then(user => {
        req.user = user.id;
        
        next();
    }).catch(e => {
        console.log(e)
        next(_httperrors2.default.Unauthorized(e.message));
    });
}

exports.Guard = Guard;