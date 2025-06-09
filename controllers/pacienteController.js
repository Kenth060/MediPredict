const pacienteModel = require('../models/pacienteModel');

exports.crear = async (req, res) => {
  try {
    const nuevoPaciente = await pacienteModel.agregarPaciente(req.body);
    res.json({ success: true, pacienteId: nuevoPaciente.id });
  } catch (err) {
    console.error(err);
    res.json({ success: false, mensaje: 'Error al agregar paciente' });
  }
};

exports.buscar = async (req, res) => {
  try {
    const resultados = await pacienteModel.buscarPorNombreYFecha(req.body.nombre, req.body.fecha_nacimiento);
    res.json({ encontrado: resultados.length > 0, resultados });
  } catch (err) {
    console.error(err);
    res.json({ encontrado: false, mensaje: 'Error en la búsqueda' });
  }
};
