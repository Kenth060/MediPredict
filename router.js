const express = require('express');
const router = express.Router();

router.use('/', require('./routes/pacientes.routes'));
router.use('/', require('./routes/triaje.routes'));

//Ruta raíz
router.get('/inicio', (req, res) => res.render('inicio'));
router.get ("/", (req, res) => { res.redirect("inicio");});


module.exports = router;
