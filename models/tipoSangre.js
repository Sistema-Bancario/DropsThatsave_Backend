const { Schema, model } = require('mongoose');

const TipoSangreSchema = Schema({
    tipo:{
        type: String,
        required: true,
    }

})

module.exports = model('TipoSangre', TipoSangreSchema);