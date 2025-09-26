class AppError extends Error{
    constructor (message, statusCode){
        super(message);//Llama al constructor de la clase base Error
        this.statusCode = statusCode;//Establece el codigo de estado
        this.status = `${statusCode}`.startsWith("4") ? "fai" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = AppError;