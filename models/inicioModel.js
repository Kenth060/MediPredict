const db = require('../db/db'); // tu conexión a MySQL

const totalPacientesDelDia = async () => {
  const [result] = await db.query(`
    SELECT COUNT(*) AS total_dia
    FROM triaje T
    INNER JOIN pacientes P on T.Id_Paciente=P.Id_Paciente 
    WHERE DATE(T.Fecha_Triaje) = CURDATE();
  `);
  return Array(7).fill(0).map((_, i) => {
    const hoy = new Date().getDay(); // 0=Dom, 1=Lun,...6=Sáb
    return i === (hoy === 0 ? 6 : hoy - 1) ? result[0].total_dia : 0;
  });
};

const totalPacientesPorSemana = async () => {
  const [rows] = await db.query(`
    SELECT DAYOFWEEK(T.Fecha_Triaje) AS dia_semana, COUNT(*) AS total
    FROM triaje T 
    INNER JOIN pacientes P on T.Id_Paciente=P.Id_Paciente 
    WHERE WEEKOFYEAR(T.Fecha_Triaje) = WEEKOFYEAR(CURDATE())
    GROUP BY dia_semana
    ORDER BY dia_semana;
  `);

  const semana = Array(7).fill(0); // [Lun, Mar, Mié, Jue, Vie, Sáb, Dom]
  rows.forEach(({ dia_semana, total }) => {
    const index = dia_semana === 1 ? 6 : dia_semana - 2;
    semana[index] = total;
  });
  return semana;
};

const totalPacientesPorMes = async () => {
  const [rows] = await db.query(`
          SELECT 
      dias.dia_semana,
      IFNULL(t.total, 0) AS total
      FROM (
      SELECT 'Monday' AS dia_semana
      UNION ALL SELECT 'Tuesday'
      UNION ALL SELECT 'Wednesday'
      UNION ALL SELECT 'Thursday'
      UNION ALL SELECT 'Friday'
      UNION ALL SELECT 'Saturday'
      UNION ALL SELECT 'Sunday'
      ) AS dias
      LEFT JOIN (
      SELECT 
          DAYNAME(T.Fecha_Triaje) AS dia_semana,
          COUNT(*) AS total
      FROM triaje T
      INNER JOIN pacientes P ON T.Id_Paciente = P.Id_Paciente 
      WHERE MONTH(T.Fecha_Triaje) = MONTH(CURRENT_DATE())
          AND YEAR(T.Fecha_Triaje) = YEAR(CURRENT_DATE())
      GROUP BY DAYNAME(T.Fecha_Triaje)
      ) AS t ON dias.dia_semana = t.dia_semana
      ORDER BY FIELD(dias.dia_semana, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
  `);

  const mes = rows.map(result => result.total);
  return mes;
};

const Flujo_Dia = async () => 
{
  const [rows] = await db.query(`
    SELECT
    COUNT(CASE WHEN T.Resultado_Triage = 'Rojo' THEN 1 ELSE NULL END) AS Total_Rojo,
    COUNT(CASE WHEN T.Resultado_Triage = 'Amarillo' THEN 1 ELSE NULL END) AS Total_Amarillo,
    COUNT(CASE WHEN T.Resultado_Triage = 'Verde' THEN 1 ELSE NULL END) AS Total_Verde
    FROM
        triaje T
    WHERE
        DATE(T.Fecha_Triaje) = CURDATE();
  `);

  
  const Flujo_Dia = 
  {
    rojo: rows[0].Total_Rojo,
    amarillo: rows[0].Total_Amarillo,
    verde: rows[0].Total_Verde
  };

  return Flujo_Dia;
 }

 const Flujo_Mes = async () => 
 {
  const [rows] = await db.query(`
    SELECT
            COUNT(CASE WHEN T.Resultado_Triage = 'Rojo' THEN 1 ELSE NULL END) AS Total_Rojo,
            COUNT(CASE WHEN T.Resultado_Triage = 'Amarillo' THEN 1 ELSE NULL END) AS Total_Amarillo,
            COUNT(CASE WHEN T.Resultado_Triage = 'Verde' THEN 1 ELSE NULL END) AS Total_Verde
        FROM triaje T
          WHERE MONTH(T.Fecha_Triaje)= MONTH(CURDATE()) and YEAR(T.Fecha_Triaje)=YEAR(CURDATE());
  `);

  
  const Flujo_Mes = 
  {
    rojo: rows[0].Total_Rojo,
    amarillo: rows[0].Total_Amarillo,
    verde: rows[0].Total_Verde
  };

  return Flujo_Mes;
 }

module.exports = {
  totalPacientesDelDia,
  totalPacientesPorSemana,
  totalPacientesPorMes,
  Flujo_Dia};
