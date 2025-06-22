const db = require('../db/db'); 

const TriajeModel = 
{
  async AgregarTriaje (datos) 
  {

    const KTAS = 2;
    const Resultado_Triage = 'Amarillo';

    const valores = 
    [
      datos.Id_Paciente,
      datos.Modo_LLegada,
      datos.Lesion,
      datos.Queja_Principal,
      datos.Estado_Mental,
      datos.Dolor,
      datos.Escala_Dolor,
      datos.Presion_Sistolica,
      datos.Presion_Diastolica,
      datos.Frecuencia_Cardiaca,
      datos.Frecuencia_Respiratoria,
      datos.Temperatura_Corporal,
      datos.Type_ED,
      datos.KTAS,
      datos.Resultado_Triage,
    ];
        
    const query = `CALL InsertarTriaje(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    const [result] = await db.query(query, valores);
  },
  async ObtenerSexo(ID_Paciente)
  {
    const query = `SELECT P.Sexo from pacientes P where P.Id_Paciente = ?`;
    const [result] = await db.query(query, [ID_Paciente]);

    console.log('Resultado de la consulta:', result);
    
    if (result.length > 0) 
    {
      console.log('Sexo del Paciente desde db:', result[0].Sexo);
      return result[0].Sexo;
    } 
    else 
    {
      throw new Error('Paciente no encontrado');
    }
  }
};

module.exports = TriajeModel;

