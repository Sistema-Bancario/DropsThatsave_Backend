const { Schema, model } = require('mongoose');

const DonacionSangreSchema = Schema({
  solicitud: {
    type: Schema.Types.ObjectId,
    ref: 'SolicitudSangre',
    required: true
  },
  usuarioDonante: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  litrosDonados: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('DonacionSangre', DonacionSangreSchema);
