const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { mostrarCitas, hacerCita, reagendarCita, eliminarCita, misCitas } = require('../controllers/cita');

const router = Router();

router.get('/vercitas',[
    validarJWT,
],mostrarCitas);

router.get('/misCitas',[
    validarJWT,
],misCitas);

router.post('/agendarCita',[
    validarJWT,
],hacerCita);

router.put('/reagendar/:id',[
    validarJWT,
],reagendarCita);

router.delete('/eliminarcita/:id',[
    validarJWT,
],eliminarCita);



module.exports = router;