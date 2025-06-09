const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

/* Conexion.connect( (error) => {
    if (error)
    {
        console.log('El error de conexion es ' + error);
        return; 
    }
    console.log('SIIIUUU TE CONECTASTE A LA BASE DE DATOS :D');
}); */
module.exports = db;

