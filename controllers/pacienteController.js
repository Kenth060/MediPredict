const pacienteModel = require('../models/pacienteModel');

/* exports.crear = async (req, res) => {
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
}; */

const PacienteController = 
{
  async addPaciente(req, res) 
  {
    try 
    {
      const ID = await pacienteModel.AgregarPaciente(req.body);

      console.log('Px agregado con ID:', ID.Id_Paciente);
      res.render('Pacientes', 
      {
        alert: true,
        alertTitle: 'Paciente agregado',
        alertMessage: '¡Se agregó al Paciente correctamente!',
        alertIcon: 'success',
        showConfirmButton: true,
        timer: false,
        ruta: 'Triaje/' + ID.Id_Paciente, // Redirigir a la página de Triaje con el ID del paciente
        Id_Paciente: ID.Id_Paciente // Pasar el ID del paciente agregado
      });
    } 
    catch (error) 
    {
      console.error('Error al agregar Paciente:', error);
      res.render('Pacientes', 
      {
        alert: true,
        alertTitle: 'No se pudo completar la operación',
        alertMessage: 'No se pudo agregar al Paciente, compruebe los datos e intente nuevamente',
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta: 'Pacientes'
      });
    }
  },

  async buscarPaciente(req, res)
  {
    try 
    {
      const resultados = await pacienteModel.BuscarPaciente(req.body);
      
      const results = resultados.map (paciente => 
      {
        const fecha = new Date(paciente.Fecha_Nacimiento);
        return {
        ...paciente,
        Fecha_Nacimiento: fecha.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      };
        
      });

      res.json(results);
    } 
    catch (error) 
    {
      console.error('Error al buscar Paciente:', error);
      res.status(500).json({ error: 'Error al buscar Paciente' });
    }
  }

};



module.exports = PacienteController;