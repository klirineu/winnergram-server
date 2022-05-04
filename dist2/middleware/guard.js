import jwt from "../modules/jwt.module";
import createError from "http-errors";

const Guard = async (req, res, next) => {
    if (!req.headers.auth) return next(createError.Unauthorized('Access token is required'));
    const token = req.headers['auth'];

    if (!token) return next(createError.Unauthorized());
    await jwt.check(token).then(user => {
        req.user = user.id;
        
        next();
    }).catch(e => {
        console.log(e)
        next(createError.Unauthorized(e.message));
    });
}

export { Guard };