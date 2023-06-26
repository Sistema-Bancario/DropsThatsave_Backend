const { Router } = require('express');
const { check } = require('express-validator');
const { solicitarSangre, aceptarSolicitud } = require('../controllers/solicitud');
const { validarJWT } = require('../middlewares/validar-jwt');
const { sangreValida, existeBanco } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/solicitudNueva', [
    validarJWT,
    check('tipoSangre', 'El tipo de sangre es obligatorio').notEmpty(),
    check('tipoSangre').custom(  sangreValida ),
    check('banco', 'El banco es obligatorio').notEmpty(),
    check('litros', 'La cantidad es obliagtoria').notEmpty(),
    validarCampos
],solicitarSangre);

router.put('/aceptar/:id',[
    validarJWT,
    check('litros', 'La cantidad es obliagtoria').notEmpty(),
], aceptarSolicitud)


module.exports = router;