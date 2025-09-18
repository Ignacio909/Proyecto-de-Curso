const express = require('express')
const app = express();
app.get('/',(req, res)=> {
    res.send('Hola, Mundo')
})


// Instancia de Sequelize para conectarse a la base de datos
const sequelize = require("./helpers/database.js"); 

// Importaciones de los modelos 
const Citas = require("./models/citas.js"); 
const Especialistas = require("./models/especialistas.js"); 
const HistoriClinicas = require("./models/historias_clinicas.js");
const Pacientes = require("./models/pacientes.js");
const Personas = require("./models/personas.js");
const RegistroClinicos = require("./models/registros_clinicos.js");

// Sincronizar los modelos para verificar la conexión con la base de datos
sequelize
.sync({ alter: true })
.then(() => {
console.log("Todos los modelos se sincronizaron correctamente.");
}) .catch((err) => {
console.log("Ha ocurrido un error al sincronizar los modelos: ", err); 
});

app.use(express.json());
const registroClinicosRoutes = require("./routes/registros-clinicosRoutes.js");
const historiaClinicaRoutes = require("./routes/historias-clinicasRoutes.js");
const { swaggerDocs } = require('./swagger.js');


app.use("/registros", registroClinicosRoutes);
app.use("/historias", historiaClinicaRoutes);

swaggerDocs(app);

app.listen(3000,()=>{
    console.log('Servidor http://localhost:3000')
})

module.exports = app;