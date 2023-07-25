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
    apertura:{
        type:String,
    },
    cierre:{
        type: String
    },
    img: {
        type: String
    },
    citas: [{
        type: Schema.Types.ObjectId,
        ref: 'Cita'
    }]
})
module.exports = model('Banco', BancoSchema);