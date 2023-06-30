const jwt = require('jsonwebtoken');
const DonacionSangre = require('../models/donacion');
const SolicitudSangre = require('../models/solicitud');
const Usuario = require('../models/usuario');
const { actualizarLitrosRestantes, actualizarEstadoSolicitud } = require('../controllers/solicitud');

const aceptarDonacion = async (req, res) => {
  try {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);

    const usuario = await Usuario.findById(uid);
    if (!usuario) {
      return res.status(404).json({
        msg: 'Usuario no encontrado'
      });
    }

    const { solicitud, litrosDonados, horaDonacion } = req.body;

    const solicitudSangre = await SolicitudSangre.findById(solicitud);
    if (!solicitudSangre) {
      return res.status(404).json({
        msg: 'Solicitud de sangre no encontrada'
      });
    }
    solicitudSangre.usuarioDonante.push(usuario._id);
    solicitudSangre.litrosDonados += litrosDonados;
    if (solicitudSangre.litrosDonados >= solicitudSangre.litrosSolicitados) {
      solicitudSangre.estado = 'Completada';
    }

    await solicitudSangre.save();

    const donacionSangre = new DonacionSangre({
      solicitud: solicitudSangre._id,
      usuarioDonante: usuario._id,
      litrosDonados
    });

    await donacionSangre.save();

    usuario.donaciones.push(donacionSangre._id);
    await usuario.save();

    await actualizarLitrosRestantes(solicitud, litrosDonados);

    await actualizarEstadoSolicitud(solicitud);

    res.json({
      msg: 'Donación de sangre aceptada exitosamente',
      solicitud: solicitudSangre,
      donacion: donacionSangre
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al aceptar la donación de sangre'
    });
  }
};



module.exports = {
  aceptarDonacion
};
