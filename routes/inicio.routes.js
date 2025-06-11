const express = require('express');
const router = express.Router();
const InicioController = require('../controllers/inicioController');

router.get('/inicio', (req, res) => res.render('inicio'));
router.get('/inicio/datos', InicioController.obtenerDatosDashboard);

router.get('/Resultado', (req, res) => res.render('Resultado'));

module.exports = router;
