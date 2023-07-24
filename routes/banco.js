const { Router } = require('express');
const { check } = require('express-validator');
const { postBanco, putBanco, deleteBanco, mostrarBancos } = require('../controllers/banco');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrarBancos',[
    validarJWT,
    // tieneRole('ADMIN_ROLE')
],mostrarBancos);

router.post('/agregar', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    check('estado', 'El estado es obligatorio').not().isEmpty(),
] ,postBanco);

router.put('/editar/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE'),
],putBanco)

router.delete('/eliminar/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE')
],deleteBanco)

module.exports = router;