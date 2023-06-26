const jwt = require('jsonwebtoken');
const DonacionSangre = require('../models/donacion');
const SolicitudSangre = require('../models/solicitud');
const Usuario = require('../models/usuario');
const { actualizarLitrosRestantes, actualizarEstadoSolicitud } = require('../controllers/solicitud');

const aceptarDonacion = async (req, res) => {
  try {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);

    // Verificar si el usuario existe
    const usuario = await Usuario.findById(uid);
    if (!usuario) {
      return res.status(404).json({
        msg: 'Usuario no encontrado'
      });
    }

    const { solicitud, litrosDonados } = req.body;

    // Verificar si la solicitud de sangre existe
    const solicitudSangre = await SolicitudSangre.findById(solicitud);
    if (!solicitudSangre) {
      return res.status(404).json({
        msg: 'Solicitud de sangre no encontrada'
      });
    }

    // Agregar el usuarioDonante al array de usuarioDonante en la solicitud
    solicitudSangre.usuarioDonante.push(usuario._id);

    // Actualizar la cantidad de sangre donada en la solicitud
    solicitudSangre.litrosDonados += litrosDonados;

    // Verificar si se ha completado la cantidad solicitada
    if (solicitudSangre.litrosDonados >= solicitudSangre.litrosSolicitados) {
      solicitudSangre.estado = 'Completada';
    }

    // Guardar los cambios en la base de datos
    await solicitudSangre.save();

    // Crear una nueva instancia de DonacionSangre
    const donacionSangre = new DonacionSangre({
      solicitud: solicitudSangre._id,
      usuarioDonante: usuario._id,
      litrosDonados
    });

    // Guardar la donación de sangre en su propia colección
    await donacionSangre.save();

    // Agregar el ID de la donación al array de donaciones en el usuario
    usuario.donaciones.push(donacionSangre._id);
    await usuario.save();

    // Actualizar los litros restantes en la solicitud
    await actualizarLitrosRestantes(solicitud, litrosDonados);

    // Actualizar el estado de la solicitud si los litros se han completado
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
