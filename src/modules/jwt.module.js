import jwt from "jsonwebtoken";
import createError from "http-errors";

export default {
    sign: (payload) => {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 86400}, (err, token) => {
                if (err) return reject(createError.InternalServerError());
    
                resolve(token)
            });
        });
    },
    check: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
                if (err) {
                    const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
                    console.log(err)
                    return reject(createError.Unauthorized(message));
                }
                resolve(payload)
            })
        })
    }
}