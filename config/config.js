require("dotenv").config();

module.exports = {
    development: {
        database: process.env.DB_NAME_DEV,
        username: process.env.DB_USER_DEV,
        password: process.env.DB_PASSWORD_DEV,
        host: process.env.DB_HOST_DEV || "127.0.0.1",
        port: process.env.DB_PORT_DEV || 5432,
        dialect: process.env.DB_DIALECT_DEV || "postgres",
        logging: false, // Desactivar logs SQL en desarrollo
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },

    test: {
        database: process.env.DB_NAME_TEST,
        username: process.env.DB_USER_TEST,
        password: process.env.DB_PASSWORD_TEST,
        host: process.env.DB_HOST_TEST || "127.0.0.1",
        port: process.env.DB_PORT_TEST || 5432,
        dialect: process.env.DB_DIALECT_TEST || "postgres",
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },

    production: {
        database: process.env.DB_NAME_PRO,
        username: process.env.DB_USER_PRO,
        password: process.env.DB_PASSWORD_PRO,
        host: process.env.DB_HOST_PRO,
        port: process.env.DB_PORT_PRO || 5432,
        dialect: process.env.DB_DIALECT_PRO || "postgres",
        logging: false,
        dialectOptions: {
            ssl: process.env.DB_SSL_PRO === "true" ? {
                require: true,
                rejectUnauthorized: false
            } : false
        },
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000
        }
    }
};