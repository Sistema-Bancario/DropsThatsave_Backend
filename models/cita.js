const { Schema, model } = require('mongoose');

const CitaSchema = Schema({
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
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Confirmada', 'Cancelada'],
    default: 'Pendiente'
  },
});

const Cita = model('Cita', CitaSchema);

module.exports = Cita;
