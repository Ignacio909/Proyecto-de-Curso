const logger = require("../loggers/loggerWinston");

const errorHandler = (err, req, res, next) => {
    // Si el error no es un objeto (ej: es un string), lo convertimos a un objeto Error
    if (typeof err !== 'object' || err === null) {
        err = new Error(err);
    }

    err.statusCode = err.statusCode || 500; // Establece el codigo de estado de error, por defecto 500
    err.status = err.status || "error"; // Establece el estado del error, por defecto 'error'


    logger.error(
        `ERROR ${err.statusCode} - ${req.method} ${req.path} - ${err.status} - ${err.message} - IP: ${req.ip}`
    ); // Registra el error

    res.status(err.statusCode).json({
        // Envia la Respuesta al cliente
        status: err.status,
        message: err.message,
    });
};

module.exports = errorHandler;

