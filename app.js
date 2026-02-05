const express = require('express')
const app = express();
const cors = require('cors')
const registroClinicosRoutes = require("./routes/registros-clinicosRoutes.js");
const historiaClinicaRoutes = require("./routes/historias-clinicasRoutes.js");
const citasRoutes = require("./routes/citasRoutes");
const pacientesRoutes = require("./routes/pacientesRoutes.js");
const especialistasRoutes = require("./routes/especialistasRoutes.js");
const autenticacionRoutes = require ("./routes/autenticacionRoutes.js");
const personasRoutes = require ("./routes/personasRoutes.js");
const { swaggerDocs } = require('./swagger.js');
const allowOrigin = ['http://localhost:3000', 'http://localhost:3001'];
const PORT = process.env.PORT || 3001;
const path = require('path');
require ("dotenv").config();

const corsOptions = {
    origin: allowOrigin,
    methods: ["GET","POST","PUT","DELETE","PATCH"],
    credentials: true,
};




// Instancia de Sequelize para conectarse a la base de datos
const sequelize = require("./helpers/database.js"); 

// Importaciones de los modelos 
const Citas = require("./models/citas.js"); 
const Especialistas = require("./models/especialistas.js"); 
const HistoriClinicas = require("./models/historias_clinicas.js");
const Pacientes = require ("./models/pacientes.js");
const Personas = require("./models/personas.js");
const RegistroClinicos = require("./models/registros_clinicos.js");
const errorHandler = require('./middlewares/errorHandler.js');
const logger = require('./loggers/loggerWinston.js');

// Sincronizar los modelos para verificar la conexión con la base de datos
sequelize
.sync({ alter: true })
.then(() => {
    logger.info("Todos los modelos se sincronizaron correctamente.");
}) .catch((err) => {
    logger.error("Ha ocurrido un error al sincronizar los modelos: ", err); 
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Cors
app.use(cors(corsOptions));

//Rutas
app.use("/registros-clinicos", registroClinicosRoutes);
app.use("/historias-clinicas", historiaClinicaRoutes);
app.use("/citas", citasRoutes);
app.use("/pacientes", pacientesRoutes);
app.use("/especialistas", especialistasRoutes);
app.use("/autenticacionRoutes",autenticacionRoutes)
app.use("/personas", personasRoutes);

//Middelware Manejo de Errores
app.use(errorHandler);

swaggerDocs(app);

app.get('/',(req, res)=> {
    res.send('Hola, Mundo')
})

app.listen(PORT,()=>{
    console.log(`Servidor http://localhost:${PORT}`)
})

module.exports = app;