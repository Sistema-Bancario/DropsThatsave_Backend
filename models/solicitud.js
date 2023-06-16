const { Schema, model } = require('mongoose');

const SolicitudSangreSchema = Schema({
  usuarioSolicitante: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  usuarioDonante: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  tipoSangre: {
    type: String,
  },
  banco: {
    type: Schema.Types.ObjectId,
    ref: 'Banco'
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Aceptada', 'Rechazada'],
    default: 'Pendiente'
  }
});

module.exports = model('SolicitudSangre', SolicitudSangreSchema);
