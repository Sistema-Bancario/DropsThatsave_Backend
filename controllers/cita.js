const Cita = require('../models/Cita');
const solicitud = require('../models/solicitud');

const mostrarCitas = async (req, res) => {
  try {
    const citas = await SolicitudSangre.find();

    res.json({
      citas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al mostrar las citas'
    });
  }
};

const misCitas = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    const citas = await Cita.find({ usuarioDonante: usuarioId });

    res.json({
      citas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al mostrar las citas'
    });
  }
};


const hacerCita = async (req, res) => {
  try {
    const { donacionId, fecha, hora } = req.body;
    const usuarioDonanteId = req.usuario._id; 

    const citaExistente = await Cita.findOne({ donacion: donacionId, fecha, hora });
    if (citaExistente) {
      return res.status(400).json({ msg: 'La cita ya está ocupada, elige otra fecha y hora.' });
    }

    const donacion = await DonacionSangre.findById(donacionId).populate('solicitud');
    if (!donacion) {
      return res.status(404).json({ msg: 'La donación no fue encontrada.' });
    }

    const nuevaCita = new Cita({
      donacion: donacionId,
      usuarioDonante: usuarioDonanteId,
      fecha,
      hora
    });

    const citaGuardada = await nuevaCita.save();

    donacion.solicitud.banco.citas.push(citaGuardada._id);
    await donacion.solicitud.banco.save();

    res.json({
      msg: 'Cita creada exitosamente',
      cita: citaGuardada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al crear la cita'
    });
  }
};





const reagendarCita = async (req, res) => {
  try {
    const { nuevaFecha, nuevaHora } = req.body;
    const citaId = req.params.id; 

    const citaExistente = await Cita.findById(citaId);
    if (!citaExistente) {
      return res.status(404).json({ msg: 'Cita no encontrada' });
    }

    const citaExistenteEnNuevaFechaHora = await Cita.findOne({ solicitud: citaExistente.solicitud, fecha: nuevaFecha, hora: nuevaHora });
    if (citaExistenteEnNuevaFechaHora) {
      return res.status(400).json({ msg: 'La nueva fecha y hora seleccionada ya están ocupadas' });
    }

    citaExistente.fecha = nuevaFecha;
    citaExistente.hora = nuevaHora;
    const citaGuardada = await citaExistente.save();

    res.json({
      msg: 'Cita reagendada exitosamente',
      cita: citaGuardada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al reagendar la cita'
    });
  }
};


const eliminarCita = async (req, res) => {
  try {
    const { citaId } = req.body;

    const citaExistente = await Cita.findById(citaId);
    if (!citaExistente) {
      return res.status(404).json({ msg: 'Cita no encontrada' });
    }

    await citaExistente.remove();

    const banco = await Banco.findById(citaExistente.solicitud);
    banco.citas = banco.citas.filter(cita => cita.toString() !== citaId);
    await banco.save();

    res.json({
      msg: 'Cita eliminada exitosamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al eliminar la cita'
    });
  }
};


module.exports = {
  hacerCita,
  reagendarCita,
  eliminarCita,
  mostrarCitas,
  misCitas
}
