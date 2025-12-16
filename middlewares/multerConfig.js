const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Configuracion de Almacenamiento

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //La carpeta donde se guardaran las imagenes
        const dir = 'public/images/profile';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        //Crear un nombre de archivo unico para envitar confilctos
        const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

// 2. Filtro de Archivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|gif/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Error: El tipo de archivo no esta permitido!'));
};


// 3. Inicializacion de Multer

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, //Limite 5 MB
    fileFilter: fileFilter
});

module.exports = upload; //Exportamos la Configuracion