const express = require('express');
const router = express.Router();

router.use('/', require('./routes/pacientes.routes'));
router.use('/', require('./routes/triaje.routes'));
router.use('/', require('./routes/inicio.routes'));

//Ruta raíz
router.get ("/", (req, res) => { res.redirect("inicio");});


module.exports = router;
