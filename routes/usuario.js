//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario, postUsuarioAdmin, getAdmins, getRolUsuarios, getMiPerfil, putMiPerfil } = require('../controllers/usuario');
const { esRoleValido, emailExiste, existeUsuarioPorId, sangreValida } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');


const router = Router();

router.get('/mostrar', getUsuarios);


router.get('/miPerfil', [
    validarJWT, ],getMiPerfil);

router.get('/mostrarAdmins', [
    validarJWT,
    tieneRole('ADMIN_ROLE')],getAdmins);
    
router.get('/mostrarUsers',[
    validarJWT,
    tieneRole('ADMIN_ROLE')
], getRolUsuarios);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('tipoSangre', 'El tipo de sangre es obligatorio').not().isEmpty(),
    check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono debe de ser más de 8 digitos').isLength( { min: 8 } ),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    check('rol').default('USER_ROLE').custom(  esRoleValido ),
    check('tipoSangre').custom(  sangreValida ),
    validarCampos,
] ,postUsuario);

router.post('/agregarAdmin', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('rol').default('ADMIN_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    
    validarCampos
    //validarJWT
], postUsuarioAdmin)

router.put('/editar', [
    validarJWT,
    validarCampos,
] ,putUsuario);

router.put('/editarMiPerfil', [
    validarJWT,
    validarCampos,
] ,putMiPerfil);


router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteUsuario);


module.exports = router;


// ROUTES