const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { aceptarDonacion } = require('../controllers/donacion');

const router = Router();

router.post('/aceptar',[
    validarJWT
], aceptarDonacion)


module.exports = router;