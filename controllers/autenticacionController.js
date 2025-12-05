const logger = require("../loggers/loggerWinston");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Personas = require('../models/personas');
const Pacientes = require('../models/pacientes');
const Especialistas = require('../models/especialistas');
const AppError = require('../errors/AppError');

//Loguearse
exports.login = async (correo, contrasena) => {
  // Verificar si el usuario existe
  const user = await Personas.findOne({ where: { correo } });
  if (!user) {
    throw new AppError(`El usuario no existe en la base de datos`, 401);
  }
  // Verificar si la contraseña coincide
  const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
  if (!passwordMatch) {
    throw new AppError(`Contraseña Incorrecta`, 401);
  }
  const token = jwt.sign(
    { userId: user.id, correo: user.correo, rol: user.rol },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  const refreshToken = jwt.sign(
    { userId: user.id, correo: user.correo, rol: user.rol },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { token, refreshToken };
};

//Obtener usuario por id
exports.getUserById = async (id) => {
  const user = await Personas.findByPk(id, {
    attributes: { exclude: ['contrasena'] },
    include: [
      { model: Pacientes, as: 'paciente', required: false },
      { model: Especialistas, as: 'especialista', required: false }
    ]
  });
  if (!user) {
    throw new AppError(`El usuario no existe en la base de datos`, 404);
  }
  return user;
};

//Refrescar token
exports.refreshAuthToken = async (refreshToken) => {
  const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await Personas.findByPk(decodedToken.userId);
  if (!user) {
    throw new AppError("Authentication failed", 401);
  }
  const token = jwt.sign(
    { userId: user.id, correo: user.correo, rol: user.rol },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return token;
};