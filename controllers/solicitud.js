const SolicitudSangre = require('../models/solicitud');
const DonacionSangre = require('../models/donacion');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const Banco = require('../models/banco')


const solicitarSangre = async (req, res) => {
  try {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);

    const usuario = await Usuario.findById(uid);
    if (!usuario) {
      return res.status(404).json({
        msg: 'Usuario no encontrado'
      });
    } 

    const { tipoSangre, banco, litros } = req.body;

    const existeBanco = await Banco.findById(banco);
    if (!existeBanco) {
      return res.status(404).json({
        msg: 'Banco no encontrado'
      });
    }
    const nuevaSolicitud = new SolicitudSangre({
      usuarioSolicitante: usuario._id,
      tipoSangre,
      banco,
      litros
    });

    const solicitudGuardada = await nuevaSolicitud.save();

    usuario.solicitudes.push(solicitudGuardada._id);
    await usuario.save();

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



// const aceptarSolicitud = async (req, res) => {
//   try {
//     const token = req.header('x-token');
//     const { uid, tipoSangre } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);

//     // Verificar si el usuario existe
//     const usuario = await Usuario.findById(uid);
//     if (!usuario) {
//       return res.status(404).json({
//         msg: 'Usuario no encontrado'
//       });
//     }

//     const { id, litros } = req.params;

//     // Verificar si la solicitud de sangre existe
//     const solicitud = await SolicitudSangre.findById(id);
//     if (!solicitud) {
//       return res.status(404).json({
//         msg: 'Solicitud de sangre no encontrada'
//       });
//     }

//     // Verificar si el usuario que acepta la solicitud es el usuario donante
//     const usuarioDonante = usuario._id; // Utilizar el ID del usuario obtenido desde el token

//     if (solicitud.usuarioDonante && solicitud.usuarioDonante.toString() !== usuarioDonante.toString()) {
//       return res.status(401).json({
//         msg: 'No tienes permisos para aceptar esta solicitud de sangre'
//       });
//     }

//     // Obtener el tipo de sangre solicitado
//     const tipoSangreSolicitado = solicitud.tipoSangre;

//     // Verificar si el tipo de sangre del usuario coincide con el tipo de sangre solicitado
//     if (usuario.tipoSangre !== tipoSangreSolicitado) {
//       return res.status(401).json({
//         msg: 'El tipo de sangre del usuario no coincide con el solicitado'
//       });
//     }

//     // Actualizar el estado de la solicitud y asignar el usuario donante y los litros de sangre donados
//     solicitud.estado = 'Aceptada';
//     solicitud.usuarioDonante = usuarioDonante;
//     solicitud.litrosDonados = litros;

//     // Calcular la cantidad restante de litros necesarios
//     const litrosRestantes = solicitud.litros - litros;

//     // Guardar los cambios en la base de datos
//     await solicitud.save();

//     res.json({
//       msg: 'Solicitud de sangre aceptada exitosamente',
//       solicitud,
//       litrosRestantes
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       msg: 'Error al aceptar la solicitud de sangre'
//     });
//   }
// };

const actualizarLitrosRestantes = async (solicitudId, litrosDonados) => {
  try {
    const solicitud = await SolicitudSangre.findById(solicitudId);
    if (!solicitud) {
      throw new Error('Solicitud de sangre no encontrada');
    }

    solicitud.litros -= litrosDonados;

    if (solicitud.litros <= 0) {
      solicitud.estado = 'Completada';
    }

    await solicitud.save();
  } catch (error) {
    throw new Error('Error al actualizar los litros restantes en la solicitud');
  }
};

const actualizarEstadoSolicitud = async (solicitudId) => {
  try {
    const solicitud = await SolicitudSangre.findById(solicitudId);
    if (!solicitud) {
      throw new Error('Solicitud de sangre no encontrada');
    }

    if (solicitud.litros <= 0) {
      solicitud.estado = 'Completada';
      await solicitud.save();
    }
  } catch (error) {
    throw new Error('Error al actualizar el estado de la solicitud');
  }
};


const mostrarSolicitudesDeSangre = async (req, res) => {
  try {
    const token = req.header('x-token');
    const { uid, tipoSangre } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);

    const solicitudes = await SolicitudSangre.find({ tipoSangre, estado: 'Pendiente' }).populate('usuarioSolicitante');

    res.json({
      solicitudes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al mostrar las solicitudes de sangre'
    });
  }
};

const eliminarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitudEliminada = await SolicitudSangre.findByIdAndUpdate(id, { estado: false });

    res.json({
      msg: 'Solicitud eliminada',
      solicitudEliminada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al eliminar la solicitud'
    });
  }
};
















module.exports = {
  solicitarSangre,
  mostrarSolicitudesDeSangre,
  //aceptarSolicitud,
  actualizarLitrosRestantes,
  actualizarEstadoSolicitud,
  eliminarSolicitud
};

