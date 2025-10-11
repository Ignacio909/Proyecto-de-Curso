const { Sequelize } = require("sequelize");
require("dotenv").config();
const logger = require("../loggers/loggerWinston");

const config = require("../config/config");
const environment = process.env.NODE_ENV || "development";
const configEnv = config[environment];

// Validar que existe la configuración para el entorno
if (!configEnv) {
    logger.error(`No se encontró configurción para el entorno: ${environment}`);
    process.exit(1);
}

// Conexión con la BD usando toda la configuración del config.js
const sequelize = new Sequelize(
    configEnv.database,
    configEnv.username,
    configEnv.password,
    {
        host: configEnv.host,
        port: configEnv.port,
        dialect: configEnv.dialect,
        logging: configEnv.logging,
        pool: configEnv.pool,
        dialectOptions: configEnv.dialectOptions || {},
    }
);

// Función para comprobar la conexión
sequelize
    .authenticate()
    .then(() => {
        logger.info(` Conexión a la base de datos establecida correctamente [${environment}]`);
        logger.info(`  - Base de datos: ${configEnv.database}`);
        logger.info(`  - Host: ${configEnv.host}:${configEnv.port}`);
    })
    .catch((err) => {
        logger.error(` Error al conectarse con la Base de Datos [${environment}]:`);
        logger.error(`  - Mensaje: ${err.message}`);
        logger.error(`  - Detalles: ${err.stack}`);
        process.exit(1); // Terminar la aplicación si no hay conexión
    });

module.exports = sequelize;