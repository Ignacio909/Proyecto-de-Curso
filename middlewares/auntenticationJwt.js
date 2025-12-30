const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");

const authenticate = (roles) => {
    return function (req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(new AppError("Necesita iniciar sesion", 403));

        }
        const parts = authHeader.split(' ');
        const token = parts.length === 2 ? parts[1] : authHeader;

        //Log preview del token (seguro - solo inicio y fin)
        const tokenPreview = token.length > 20
            ? `${token.substring(0, 15)}...${token.substring(token.length - 15)}`
            : token;
       // console.log('🔑 [AUTH] Token recibido:', tokenPreview, `(${token.length} caracteres)`);

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            /*// Log de debugging
            console.log('🔍 [AUTH DEBUG] Token decodificado:', {
                userId: decodedToken.userId,
                rol: decodedToken.rol,
                rolesPermitidos: roles,
                ruta: req.method + ' ' + req.path
            });
            */

            if (!roles || roles.length === 0 || roles.includes(decodedToken.rol)) {
                req.userData = { userId: decodedToken.userId, rol: decodedToken.rol };
                return next();
            } else {
               // console.log('❌ [AUTH DEBUG] Rol no autorizado:', decodedToken.rol, 'Permitidos:', roles);
                return next(new AppError("Usted no posee el rol necesario para realizar esa accion", 403));
            }
        } catch (error) {
           // console.log('❌ [AUTH DEBUG] Error verificando token:', error.message);
           // console.log('❌ [AUTH DEBUG] Token que falló:', tokenPreview);
            return next(new AppError("Permiso denegado", 403));
        }
    };
};
module.exports = authenticate;
