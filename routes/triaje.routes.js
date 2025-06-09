const express = require('express');
const router = express.Router();

router.get('/Triaje/:id', (req, res) => {
  const pacienteId = req.params.id;
  res.render('Triaje', { pacienteId }); // luego lo usas para rellenar
});

module.exports = router;
