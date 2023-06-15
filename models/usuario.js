const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
    },
    correo: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    tipoSangre: {
        type: String,
       
    },
    telefono: {
        type: String,
        
    },
    rol: {
        type: String,
       
    },
    img: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


module.exports = model('Usuario', UsuarioSchema);