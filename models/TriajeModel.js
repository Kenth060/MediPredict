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
      KTAS,
      Resultado_Triage,
    ];
        
    const query = `CALL InsertarTriaje(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    const [result] = await db.query(query, valores);
  }
};

module.exports = TriajeModel;

