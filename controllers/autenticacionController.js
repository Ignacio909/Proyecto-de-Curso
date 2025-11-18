const { Op } = require("sequelize");
const Personas = require("../models/personas");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");
const logger = require("../loggers/loggerWinston");

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
    { expiresIn: "1d" }
  );
  return { token, refreshToken };
};

//Refrescar token
exports.refreshAuthToken = async (refreshToken) => {
  const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  
  const user = await Personas.findByPk(decodedToken.userId);
  if (!user) {
    return res.status(401).json({
      message: "Authentication failed",
    });
  }
  const token = jwt.sign(
    { userId: user.id, correo: user.correo, rol: user.rol },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return token;
};