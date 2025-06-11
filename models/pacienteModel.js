const db = require('../db/db'); // pool de mysql2 con promesas

/* module.exports = { */
/* async agregarPaciente(data) {
  const { nombre, sexo, fecha_nacimiento, cedula, direccion, telefono } = data;

  const edad = calcularEdad(fecha_nacimiento);

  const [result] = await pool.query(`
    INSERT INTO paciente (nombre, edad, sexo, fecha_nacimiento, cedula, direccion, telefono)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, edad, sexo, fecha_nacimiento, cedula, direccion, telefono]);

  return { id: result.insertId, nombre, edad };
}, */

/* async buscarPorNombreYFecha(nombre, fecha_nacimiento) {
  const [rows] = await pool.query(
    'SELECT * FROM paciente WHERE nombre = ? AND fecha_nacimiento = ?', [nombre, fecha_nacimiento]
  );
  return rows;
}

}; */

const PacienteModel = 
{

  async AgregarPaciente (data) 
  {
    const { Nombre_Px, Apellido_Px, FechaNacimiento_Px, Sexo_Px, Direccion_Px, Telefono_Px, Cedula_Px, Residencia_Px, Tabaquismo_Px} = data;

    const query = `CALL InsertarPaciente(?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const [result] = await db.query(query, [Nombre_Px, Apellido_Px, FechaNacimiento_Px, Sexo_Px, Direccion_Px, Telefono_Px, Cedula_Px, Residencia_Px, Tabaquismo_Px]);

    const Id_Paciente = result[0][0].Id_Paciente;
    console.log('Paciente agregado con ID:', Id_Paciente);
    return { Id_Paciente: Id_Paciente};
  },

  async BuscarPaciente(data) 
  {
    const {TipoBusqueda ,Nombre_Busqueda, Apellidos_Busqueda, Fecha_Busqueda, Cedula_Busqueda } = data;

    if (TipoBusqueda === 'Nombre') 
    {
      const query = `SELECT * FROM pacientes P WHERE P.Nombre = ?  and P.Apellido = ?  and P.Fecha_Nacimiento = ?`;
      const [results] = await db.query(query , [Nombre_Busqueda, Apellidos_Busqueda, Fecha_Busqueda]);
      console.log('Resultados de la búsqueda por nombre:', results);
      return results;
    }
    else if (TipoBusqueda === 'Cedula') 
    {
      const query = `SELECT * FROM pacientes P WHERE P.Cedula = ?`;
      const [results] = await db.query(query , [Cedula_Busqueda]);
      //console.log('Resultados de la búsqueda por cédula:', results);
      return results;
    }
    else 
    {
      throw new Error('Tipo de búsqueda no válido');
    }
  }

};

module.exports = PacienteModel

