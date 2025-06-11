document.addEventListener('DOMContentLoaded', () => 
{
  const btnBuscarPaciente = document.getElementById('btnBuscarPaciente');
  const btnAgregarPaciente = document.getElementById('btnAgregarPaciente');
  const formBuscar = document.getElementById('formBuscar');
  const formAgregar = document.getElementById('formAgregar');
  const formBusqueda = document.getElementById('FormBuscarPaciente');

  const Tipo_Busqueda = document.getElementById('TipoBusqueda');

  const BusquedaNombre = document.getElementById('BusquedaNombre');
  const BusquedaCedula = document.getElementById('BusquedaCedula');

  const Tabla_Resultados = document.getElementById('Tabla_Resultados');


  btnBuscarPaciente.addEventListener('click', () => 
  {
    formBuscar.style.display = "block";
    formAgregar.style.display = "none";
  });

  btnAgregarPaciente.addEventListener('click', () => 
  {
    formBuscar.style.display = "none";
    formAgregar.style.display = "block";
  });

  Tipo_Busqueda.addEventListener('change', () => 
  {
    if (Tipo_Busqueda.value === 'Nombre') 
    {
      BusquedaNombre.style.display = 'block';
      BusquedaCedula.style.display = 'none';
    } 
    else if (Tipo_Busqueda.value === 'Cedula') 
    {
      BusquedaCedula.style.display = 'block';
      BusquedaNombre.style.display = 'none';
    } else 
    {
      BusquedaNombre.style.display = 'none';
      BusquedaCedula.style.display = 'none';
    }
  });

  formBusqueda.addEventListener('submit', async (e) => 
  {
    e.preventDefault();
    let data = {};

    Tabla_Resultados.style.display = 'block';

    if ( Tipo_Busqueda.value === 'Nombre' ) 
    {
      data.TipoBusqueda = 'Nombre';
      data.Nombre_Busqueda = document.getElementById('Nombre_Busqueda').value.trim();
      data.Apellidos_Busqueda = document.getElementById('Apellidos_Busqueda').value.trim();
      data.Fecha_Busqueda = document.getElementById('Fecha_Busqueda').value; 
    } 
    else if ( Tipo_Busqueda.value === 'Cedula' )  
    {
      data.TipoBusqueda = 'Cedula';
      data.Cedula_Busqueda = document.getElementById('Cedula_Busqueda').value.trim();
    } 
    else 
    {
      Tabla_Resultados.style.display = 'none';
      Swal.fire(
      {
        title: "Busqueda Invalida",
        text: "Ingrese un tipo de búsqueda válido.",
        icon: "question"
      });
      return;
    }

    try 
    {
      const response = await fetch('/buscar-Paciente', 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });

    const result = await response.json();

    const tbody = document.querySelector("#Tabla_Resultados tbody");
    tbody.innerHTML = ''; // Limpiar resultados anteriores

    result.forEach((paciente) => {
      AgregarPaciente(paciente.Id_Paciente,`${paciente.Nombre} ${paciente.Apellido}`, paciente.Fecha_Nacimiento, paciente.Cedula);
    })



    } 
    catch (error) 
    {
      Tabla_Resultados.style.display = 'none';
      const tbody = document.querySelector("#Tabla_Resultados tbody");
      tbody.innerHTML = ''; // Limpiar resultados anteriores
      console.error('Error al buscar paciente:', error);

      Swal.fire(
      {
        title: "No se pudo realizar la búsqueda",
        text: "Hubo un error al intentar buscar el paciente. Compruebe los datos ingresados.",
        icon: "error"
      });
    }

  });

})

function AgregarPaciente(Id,Nombre,Fecha, Cedula)
{
  
  var tabla = document.getElementById("Tabla_Resultados").getElementsByTagName('tbody')[0];

  var nuevaFila = document.createElement("tr");
  var celda_Paciente = document.createElement("td");
  var celda_Fecha = document.createElement("td");
  var celda_Cedula = document.createElement("td");
  var celda_Accion = document.createElement("td");

  celda_Paciente.textContent = Nombre;
  celda_Fecha.textContent = Fecha;
  celda_Cedula.textContent = Cedula;

  const btnAccion = document.createElement("button");
  btnAccion.classList.add("btn");
  btnAccion.textContent = "Seleccionar";
  btnAccion.addEventListener("click", () => {
    window.location.href = `/Triaje/${Id}`; // Ruta de ejemplo
  });

  celda_Accion.appendChild(btnAccion);
  
  // Agregar las celdas a la fila
  nuevaFila.appendChild(celda_Paciente);
  nuevaFila.appendChild(celda_Fecha);
  nuevaFila.appendChild(celda_Cedula);
  nuevaFila.appendChild(celda_Accion);
  
  // Agregar la fila a la tabla
  tabla.appendChild(nuevaFila);
}

function toggleDarkMode() 
{ document.body.classList.toggle('dark-mode'); }
    
