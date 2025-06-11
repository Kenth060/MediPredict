const express = require('express');
const router = express.Router();
const TriajeController = require('../controllers/TriajeController');


router.get('/Triaje/:Id_Paciente', (req, res) => {
  const pacienteId = req.params.Id_Paciente;
  res.render('Triaje', {Id_Paciente:pacienteId }); 
});

router.post('/AddTriaje', TriajeController.AgregarTriaje);

module.exports = router;
