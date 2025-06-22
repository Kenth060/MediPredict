const TriajeModel = require('../models/TriajeModel');
const axios = require('axios');

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
  },
  
  async RealizarTriaje(req, res) 
  {
    try 
    {

      sx =  await TriajeModel.ObtenerSexo(req.body.Id_Paciente);

      console.log('Sexo del Paciente desde Model :', sx);

      if (sx == 'Masculino') 
      {
        Sexo_Paciente = 1; // 1 para masculino
      }
      else if (sx == 'Femenino') 
      {
        Sexo_Paciente = 2; // 2 para femenino
      } 
      else 
      {
        Sexo_Paciente = 3; // 3 para otro o no especificado
      }


      const DatosPaciente = 
      {
        Sexo: Sexo_Paciente, // Asegúrate de hacer los mapeos necesarios
        Lesion: parseInt(req.body.Lesion),
        Mental: parseInt(req.body.Estado_Mental),
        Dolor: parseInt(req.body.Dolor),
        Dolor_NRS: parseFloat(req.body.Escala_Dolor),
        PAS: parseFloat(req.body.Presion_Sistolica),
        PAD: parseFloat(req.body.Presion_Diastolica),
        FC: parseFloat(req.body.Frecuencia_Cardiaca),
        FR: parseFloat(req.body.Frecuencia_Respiratoria),
        TC: parseFloat(req.body.Temperatura_Corporal),
        Saturacion: parseFloat(req.body.Saturacion), // valor por defecto si no hay
      }; 

      console.log('Datos del Paciente desde Formulario:', DatosPaciente);


    /*   const datosPaciente = {
          Sexo: 2, // 1 para masculino, 2 para femenino
          Lesion: 1, // 1 no hay lesión, 2 para lesión
          Mental: 2, // 1 Alerta , 2 Respuesta Verbal, 3 Respuesta al Dolor, 4 Inconsciente
          Dolor: 1, // 1 para con dolor, 2 para sin dolor
          Dolor_NRS: 9, // Escala de dolor NRS (0-10)
          PAS: 160, // Presión Arterial Sistólica
          PAD: 125, // Presión Arterial Diastólica
          FC: 98, // Frecuencia Cardiaca
          FR: 15, // Frecuencia Respiratoria
          TC: 38.5, // Temperatura Corporal
          Saturacion: 82 // Saturación de Oxígeno
        };
 */
      
      const respuesta = await axios.post('http://localhost:5000/predecir', DatosPaciente);

      const ktas = respuesta.data.ktas;
      const resultado = ['Rojo', 'Amarillo', 'Verde'][ktas - 1];


      console.log('KTAS:', ktas);
      console.log('Resultado:', resultado);


      const mapMental = 
      {
        1: "Alerta",
        2: "Respuesta Verbal",
        3: "Respuesta al Dolor",
        4: "Inconsciente"
      };

      const mapModoLlegada =
      {
          1:"Caminando",
          2:"Servicio de Emergencia",
          3:"Vehiculo Privado",
          5:"Transporte Publico",
          6:"Silla de Ruedas",
          7:"Otro"
      };

      const mapTypeED =
      {
          1:"Local",
          2:"Rural"
      };
      
      const datos = 
      {
        Id_Paciente: req.body.Id_Paciente,
        Modo_LLegada: mapModoLlegada[parseInt(req.body.Modo_LLegada)],
        Lesion: req.body.Lesion,
        Queja_Principal: req.body.Queja_Principal,
        Estado_Mental: mapMental[parseInt(req.body.Estado_Mental)],
        Dolor: req.body.Dolor,
        Escala_Dolor: req.body.Escala_Dolor,
        Presion_Sistolica: req.body.Presion_Sistolica ,
        Presion_Diastolica: req.body.Presion_Diastolica,
        Frecuencia_Cardiaca: req.body.Frecuencia_Cardiaca,
        Frecuencia_Respiratoria: req.body.Frecuencia_Respiratoria,
        Temperatura_Corporal: req.body.Temperatura_Corporal,
        Type_ED: mapTypeED[parseInt(req.body.Type_ED)],
        KTAS: ktas, // Aquí deberías calcular el KTAS si es automático, o agregarlo al formulario
        Resultado_Triage: resultado, // Lo mismo, puedes calcularlo según reglas
      };

        await TriajeModel.AgregarTriaje(datos);

        const queryString = `?Id_Paciente=${req.body.Id_Paciente}ktas=${ktas}&resultado=${resultado}`;
        res.render('Resultado', 
        {
          resultado: resultado,
          ktas: ktas,
        });

    } 
    catch (error) 
    {
      console.error('Error al realizar triaje:', error);
      res.status(500).send('Error al procesar el triaje');
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