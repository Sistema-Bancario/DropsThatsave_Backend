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
        msg: 'get Api - Controlador Usuario',
        listaUsuarios
    });

}

const postUsuario = async (req = request, res = response) => {
    const { nombre, correo, password, rol, tipoSangre, telefono } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol, tipoSangre, telefono });

    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });
}

const postUsuarioAdmin = async (req = request, res = response) => {
    const { nombre, correo, password } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password });

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

        const { telefono, correo } = req.body;

        usuario.telefono = telefono;
        usuario.correo = correo;

        const usuarioEditado = await usuario.save();

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
    postUsuario,
    postUsuarioAdmin,
    putUsuario,
    deleteUsuario
}


// CONTROLADOR