const jwt = require('jsonwebtoken');
const DonacionSangre = require('../models/donacion');
const SolicitudSangre = require('../models/solicitud');
const Usuario = require('../models/usuario');


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
  
      // Verificar si el usuario que acepta la donación es el usuario donante
      const usuarioDonante = usuario._id; // Utilizar el ID del usuario obtenido desde el token
  
      if (solicitudSangre.usuarioDonante && solicitudSangre.usuarioDonante.toString() !== usuarioDonante.toString()) {
        return res.status(401).json({
          msg: 'No tienes permisos para aceptar esta donación de sangre'
        });
      }
  
      // Actualizar la cantidad de sangre donada en la solicitud
      solicitudSangre.litrosDonados += litrosDonados;
  
      // Verificar si se ha completado la cantidad solicitada
      if (solicitudSangre.litrosDonados >= solicitudSangre.litrosSolicitados) {
        solicitudSangre.estado = 'Completada';
      }
  
      // Guardar los cambios en la base de datos
      await solicitudSangre.save();
  
      res.json({
        msg: 'Donación de sangre aceptada exitosamente',
        solicitud: solicitudSangre
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

  

module.exports = {
  aceptarDonacion
};
