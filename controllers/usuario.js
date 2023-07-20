const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');


const getUsuarios = async (req = request, res = response) => {
    const query = { estado: true };
    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);
    res.json({
        msg: 'Todos los usuarios encontrados son:',
        listaUsuarios
    });
}

const getAdmins = async (req = request, res = response) => {
    const query = { rol: "ADMIN_ROLE" };
    const listaAdmins = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);
    res.json({
        msg: 'Todos los Administradores encontrados son:',
        listaAdmins
    });
}

const getRolUsuarios = async (req = request, res = response) => {
    const query = { rol: "USER_ROLE" };
    const Users = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);
    res.json({
        msg: 'Todos los usuarios con rol Users encontrados son:',
        Users
    });
}


const defaultAdmin = async (req, res) => {
    try {
        let user = new Usuario();
        user.nombre = "Administrador";
        user.password = "123456";
        user.correo = "admin@gmail.com";
        user.rol = "ADMIN_ROLE";
        user.estado = true
        const userEncontrado = await Usuario.findOne({ correo: user.correo });
        if (userEncontrado) return console.log("El administrador está listo");
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
        user = await user.save();
        if (!user) return console.log("El administrador no está listo!");
        return console.log("El administrador está listo!");
    } catch (err) {
        throw new Error(err);
    }
};

const postUsuario = async (req = request, res = response) => {
    const { nombre, correo, password, rol, tipoSangre, telefono, direccion, tatuajes } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol, tipoSangre, telefono, direccion, tatuajes });

    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });
}

const postUsuarioAdmin = async (req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol});

    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });
}



const putUsuario = async (req = request, res = response) => {
    try {
        const token = req.header('x-token');
        const { uid } = jwt.verify(token, process.env.SECRET_KEY_FOR_TOKEN);
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        const { correo, telefono, ...resto } = req.body;

        if (Object.keys(resto).length > 0) {
            return res.status(400).json({
                msg: 'No se pueden enviar datos adicionales'
            });
        }

        if (correo) {
            // Validar el formato del correo si se proporciona
            if (!validateEmail(correo)) {
                return res.status(400).json({
                    msg: 'El correo proporcionado no es válido'
                });
            }
            usuario.correo = correo;
        }

        const usuarioEditado = await usuario.save();

        if (!usuarioEditado) {
            return res.status(404).json({
                msg: 'No se pudo editar el usuario'
            });
        }

        res.json({
            msg: 'PUT editar usuario',
            usuarioEditado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al editar el usuario'
        });
    }
}






const deleteUsuario = async (req = request, res = response) => {
    const { id } = req.params;

    const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'DELETE eliminar user',
        usuarioEliminado
    });
}

module.exports = {
    getUsuarios,
    getAdmins,
    getRolUsuarios,
    postUsuario,
    postUsuarioAdmin,
    putUsuario,
    deleteUsuario,
    defaultAdmin
}


// CONTROLADOR