const TriajeModel = require('../models/TriajeModel');

const TriajeController = 
{
  async AgregarTriaje(req, res) 
  {
    try 
    {
        const datos = 
        {
            Id_Paciente: req.body.Id_Paciente,
            Modo_LLegada: req.body.Modo_LLegada,
            Lesion: req.body.Lesion,
            Queja_Principal: req.body.Queja_Principal,
            Estado_Mental: req.body.Estado_Mental,
            Dolor: req.body.Dolor,
            Escala_Dolor: req.body.Escala_Dolor,
            Presion_Sistolica: req.body.Presion_Sistolica ,
            Presion_Diastolica: req.body.Presion_Diastolica,
            Frecuencia_Cardiaca: req.body.Frecuencia_Cardiaca,
            Frecuencia_Respiratoria: req.body.Frecuencia_Respiratoria,
            Temperatura_Corporal: req.body.Temperatura_Corporal,
            Type_ED: 'Rural',
            KTAS: 3, // Aquí deberías calcular el KTAS si es automático, o agregarlo al formulario
            Resultado_Triage: 'Amarillo', // Lo mismo, puedes calcularlo según reglas
        };

        await TriajeModel.AgregarTriaje(datos);

        res.render('Triaje', 
        {
            alert: true,
            alertTitle: 'Triaje en Proceso',
            alertMessage: '¡Se está procesando el Triaje del Paciente!',
            alertIcon: 'info',
            showConfirmButton: false,
            timer: 2000,
            ruta: 'Resultado',
            Id_Paciente: req.body.Id_Paciente
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
  }
};



module.exports = TriajeController;

/* 
function mapModoLlegada(valor) 
{
  if (valor === 'Ambulancia') return 'Ambulancia';
  if (valor === 'Particular') return 'Vehiculo Privado';
  if (valor === 'Policía') return 'Otro'; // No hay valor exacto en ENUM
  return 'Otro';
}

function mapEstadoMental(valor) {
  if (valor === 'Alerta') return 'Alerta';
  if (valor === 'Confuso') return 'Reaccion_Verbal'; // Mapeo aproximado
  if (valor === 'Inconsciente') return 'Inconsciente';
  return 'Alerta';
}
 */