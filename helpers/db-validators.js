const Role = require('../models/role');
const Usuario = require('../models/usuario');
const TipoSangre = require ('../models/tipoSangre')
const Banco = require ('../models/banco')
const esRoleValido = async( rol = '' ) => {

    const existeRol = await Role.findOne( { rol } );

    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la DB`);
    }

}

const sangreValida = async (tipo = '') => {
    const existeSangre = await TipoSangre.findOne({ tipo });

    if (!existeSangre) {
        throw new Error(`El tipo de sangre: ${tipo} no está registrado en la DB`);
    }
}

const existeBanco = async ( id = '' )=>{
    const existe =  await Banco.findById(id);

    if ( !existe ) {
        throw new Error(`El id ${ id } no existe en la DB`);
    }

}



const emailExiste = async( correo = '' ) => {

    const existeEmail = await Usuario.findOne( { correo } );

    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo } ya existe y esta registrado en la DB`);
    }

}


const existeUsuarioPorId = async(id) => {

    const existeUser = await Usuario.findById(id);

    if ( !existeUser ) {
        throw new Error(`El id ${ id } no existe en la DB`);
    }

}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    sangreValida,
    existeBanco 
}