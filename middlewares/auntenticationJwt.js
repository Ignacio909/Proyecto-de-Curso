const jwt = require ("jsonwebtoken");
const AppError = require("../errors/AppError");

const authenticate = (roles) => {
    return function (req, res, next){
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return next (new AppError ("Necesita iniciar sesion", 403));

        }
        const parts = authHeader.split(' ');
        const token = parts.length === 2 ? parts[1] : authHeader;
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if(!roles || roles.length === 0 || roles.includes(decodedToken.rol)){
                req.userData = {userId: decodedToken.userId, rol: decodedToken.rol};
                return next();
            } else {
                return next (new AppError("Usted no posee el rol necesario para realizar esa accion", 403));
            }
        } catch (error) {
            return next(new AppError("Permiso denegado",403));    
        }
    };
};
module.exports = authenticate;
