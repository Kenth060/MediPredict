const pool = require('../db/db'); // pool de mysql2 con promesas

module.exports = {
async agregarPaciente(data) {
  const { nombre, sexo, fecha_nacimiento, cedula, direccion, telefono } = data;

  const edad = calcularEdad(fecha_nacimiento);

  const [result] = await pool.query(`
    INSERT INTO paciente (nombre, edad, sexo, fecha_nacimiento, cedula, direccion, telefono)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, edad, sexo, fecha_nacimiento, cedula, direccion, telefono]);

  return { id: result.insertId, nombre, edad };
},

async buscarPorNombreYFecha(nombre, fecha_nacimiento) {
  const [rows] = await pool.query(
    'SELECT * FROM paciente WHERE nombre = ? AND fecha_nacimiento = ?', [nombre, fecha_nacimiento]
  );
  return rows;
},



};

function calcularEdad(fecha) {
  const nacimiento = new Date(fecha);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}
