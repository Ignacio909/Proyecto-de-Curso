const logger = require("../loggers/loggerWinston");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const Personas = require('../models/personas');
const Pacientes = require('../models/pacientes');
const Especialistas = require('../models/especialistas');
const AppError = require('../errors/AppError');

//Loguearse
exports.login = async (correo, contrasena, twoFactorToken) => {
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

  // --- LÓGICA 2FA ---
  if (user.twoFactorEnabled) {
    // Si el usuario tiene 2FA pero NO envió el token todavía (Paso 1 del login)
    if (!twoFactorToken) {
      return {
        require2FA: true,
        userId: user.id
      };
    }

    // Si el usuario SÍ envió el token (Paso 2 del login), lo verificamos
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: twoFactorToken,
      window: 1 // Permite un margen de error de 30 segundos (por si los relojes no están exactos)
    });

    if (!verified) {
      throw new AppError("Código 2FA incorrecto o expirado", 401);
    }
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
//
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

// 1. Generar el Secreto y el QR (Para configurar)
exports.generate2FA = async (userId) => {
  const user = await Personas.findByPk(userId);
  if (!user) throw new AppError("Usuario no encontrado", 404);

  // Generamos un secreto único para este usuario
  // 'name' es lo que saldrá en la app (Google Authenticator) del usuario
  const secret = speakeasy.generateSecret({
    name: `ConsultorioMedico (${user.correo})`
  });

  // Guardamos el secreto TEMPORALMENTE en la BD (pero aún no activamos el enabled)
  user.twoFactorSecret = secret.base32;
  await user.save();

  // Generamos el QR como una URL de imagen (Data URL)
  // El frontend pondrá esto en un <img src="...">
  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

  return {
    qrCodeUrl,
    secret: secret.base32 // Opcional: por si quieres mostrar el código texto también
  };
};

// 2. Verificar y Activar 2FA
exports.verifyAndEnable2FA = async (userId, token) => {
  const user = await Personas.findByPk(userId);
  if (!user) throw new AppError("Usuario no encontrado", 404);

  // Verificamos que el código (token) que ingresó el usuario coincida con el secreto guardado
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: token // El código de 6 dígitos que envía el usuario
  });

  if (verified) {
    // Si es correcto, ahora sí activamos oficialmente el 2FA
    user.twoFactorEnabled = true;
    await user.save();
    return true;
  } else {
    return false; // Código incorrecto
  }


  // 3. Desactivar 2FA
  exports.disable2FA = async (userId) => {
    const user = await Personas.findByPk(userId);
    if (!user) throw new AppError("Usuario no encontrado", 404);

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null; // Opcional: borrar el secreto para obligar a re-escanear si lo reactiva
    await user.save();

    return true;
  };

};