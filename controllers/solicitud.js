const SolicitudSangre = require('../models/solicitud');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

const solicitarSangre = async (req, res) => {
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

    const { tipoSangre, banco } = req.body;

    // Crear una nueva instancia de SolicitudSangre con el ID del usuario que realiza la solicitud
    const nuevaSolicitud = new SolicitudSangre({
      usuarioSolicitante: usuario._id,
      tipoSangre,
      banco
    });

    // Guardar la solicitud en la base de datos
    const solicitudGuardada = await nuevaSolicitud.save();

    res.json({
      msg: 'Solicitud de sangre enviada correctamente',
      solicitud: solicitudGuardada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al enviar la solicitud de sangre'
    });
  }
};


const aceptarSolicitud = async (req, res) => {
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

    const { id } = req.params;

    // Verificar si la solicitud de sangre existe
    const solicitud = await SolicitudSangre.findById(id);
    if (!solicitud) {
      return res.status(404).json({
        msg: 'Solicitud de sangre no encontrada'
      });
    }

    // Verificar si el usuario que acepta la solicitud es el usuario donante
    const usuarioDonante = usuario._id; // Utilizar el ID del usuario obtenido desde el token

    if (solicitud.usuarioDonante && solicitud.usuarioDonante.toString() !== usuarioDonante.toString()) {
      return res.status(401).json({
        msg: 'No tienes permisos para aceptar esta solicitud de sangre'
      });
    }

    // Actualizar el estado de la solicitud y asignar el usuario donante
    solicitud.estado = 'Aceptada';
    solicitud.usuarioDonante = usuarioDonante;

    // Guardar los cambios en la base de datos
    await solicitud.save();

    res.json({
      msg: 'Solicitud de sangre aceptada exitosamente',
      solicitud
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al aceptar la solicitud de sangre'
    });
  }
};





module.exports = {
  solicitarSangre,
  aceptarSolicitud 
};

