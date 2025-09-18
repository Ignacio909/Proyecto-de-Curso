const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Clínica",
            version: "1.0.0",
            description: "Documentación de la API con Swagger",
        },
    
    },
  apis: ["./models/*.js","./routes/*.js", "./docs/*.yml"], // aquí swagger buscará documentación
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📑 Swagger disponible en: http://localhost:3000/api-docs");
};

module.exports = { swaggerDocs };