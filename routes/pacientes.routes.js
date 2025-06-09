const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/pacienteController');

// Ruta principal que carga la vista
router.get('/Pacientes', (req, res) => res.render('Pacientes', {alerta:undefined}));

// Rutas que responden a fetch()
router.post('/Paciente/crear', PacienteController.crear);
router.post('/Paciente/buscar', PacienteController.buscar);

module.exports = router;
