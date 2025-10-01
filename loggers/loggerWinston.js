const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const fs = require("fs");
const path = require("path");

// Asegurar que exista la carpeta logs
const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
    level: "info",
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true }),
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                logFormat
            ),
        }),
        new transports.File({ filename: path.join(logsDir, "error.log"), level: "error" }),
        new transports.File({ filename: path.join(logsDir, "combined.log") }),
    ],
});

module.exports = logger;

