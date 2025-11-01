const multer = require ('multer');
const path = require ('path');

// 1. Configuracion de Almacenamiento

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //La carpeta donde se guardaran las imagenes
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        //Crear un nombre de archivo unico para envitar confilctos
        const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

// 2. Filtro de Archivos
const fileFilter = (req, file, cb) => {
    const ollowedTypes = /jpeg | jpg | gi/;
    const mimetype = ollowedTypes.test(file.mimetype);
    const extname = ollowedTypes.test(path.extname(file.originalname).toLowerCase());

    if(mimetype && extname) {
        return cb (null, true);
    }
    cb('Error: El tipo de archivo no esta permitido!');
};


// 3. Inicializacion de Multer

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5 },//Limite 5 MB
    fileFilter: fileFilter
});

module.exports = upload; //Exportamos la Configuracion