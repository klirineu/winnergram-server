"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _httperrors = require('http-errors'); var _httperrors2 = _interopRequireDefault(_httperrors);

exports. default = {
    sign: (payload) => {
        return new Promise((resolve, reject) => {
            _jsonwebtoken2.default.sign(payload, process.env.JWT_SECRET, {expiresIn: 86400}, (err, token) => {
                if (err) return reject(_httperrors2.default.InternalServerError());
    
                resolve(token)
            });
        });
    },
    check: (token) => {
        return new Promise((resolve, reject) => {
            _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET, (err, payload) => {
                if (err) {
                    const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                    console.log(err)
                    return reject(_httperrors2.default.Unauthorized(message));
                }
                resolve(payload)
            })
        })
    }
}