
const Donacion = require('../models/donacion');
const Solicitud = require('../models/solicitud');
const Banco = require('../models/banco');
const Cita = require('../models/cita');

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

    const citas = await Cita.find({ usuarioDonante: usuarioId })
      .populate({
        path: 'donacion',
        populate: [
          {
            path: 'solicitud',
            select: 'usuarioSolicitante',
            populate: {
              path: 'usuarioSolicitante',
              select: 'nombre direccion telefono'
            }
          },
          {
            path: 'solicitud',
            select: 'banco',
            populate: {
              path: 'banco',
              select: 'nombre direccion telefono'
            }
          }
        ]
      });

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

    const citaExistente = await Cita.findOne({ donacion: donacionId });
    if (citaExistente) {
      return res.status(400).json({ msg: 'La donación ya tiene una cita agendada.' });
    }

    const donacion = await Donacion.findById(donacionId).populate('solicitud');
    if (!donacion) {
      return res.status(404).json({ msg: 'La donación no fue encontrada.' });
    }

    const solicitud = await Solicitud.findById(donacion.solicitud);
    if (!solicitud) {
      return res.status(404).json({ msg: 'La solicitud de sangre no fue encontrada.' });
    }

    const banco = await Banco.findById(solicitud.banco);
    if (!banco) {
      return res.status(404).json({ msg: 'El banco de sangre no fue encontrado.' });
    }

    const nuevaCita = new Cita({
      donacion: donacionId,
      usuarioDonante: usuarioDonanteId,
      fecha,
      hora
    });

    const citaGuardada = await nuevaCita.save();

    banco.citas.push(citaGuardada._id);
    await banco.save();

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
