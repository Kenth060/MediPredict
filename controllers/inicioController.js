const DashboardModel = require('../models/InicioModel');

const obtenerDatosDashboard = async (req, res) => {
  try {
    const [dia, semana, mes, Flujo_Dia] = await Promise.all([
      DashboardModel.totalPacientesDelDia(),
      DashboardModel.totalPacientesPorSemana(),
      DashboardModel.totalPacientesPorMes(),
      DashboardModel.Flujo_Dia()
    ]);

    res.json({
      dia,
      semana,
      mes,
      Flujo_Dia
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener datos del dashboard' });
  }
};

module.exports = {
  obtenerDatosDashboard
};
