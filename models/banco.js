const { Schema, model } = require('mongoose');

const BancoSchema = Schema({
    nombre:{
        type:String,
        required:true
    },
    direccion:{
        type:String,
    },
    telefono:{
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    },
    
})
module.exports = model('Banco', BancoSchema);