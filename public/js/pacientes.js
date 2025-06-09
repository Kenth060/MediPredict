document.addEventListener('DOMContentLoaded', () => {
  const btnBuscar = document.getElementById('btnBuscar');
  const btnAgregar = document.getElementById('btnAgregar');
  const formBuscar = document.getElementById('formBuscar');
  const formAgregar = document.getElementById('formAgregar');
  const buscarForm = document.getElementById('buscarForm');
  const agregarForm = document.getElementById('agregarForm');
  const resultadoBusqueda = document.getElementById('resultadoBusqueda');

  btnBuscar.addEventListener('click', () => {
    formBuscar.classList.remove('hidden');
    formAgregar.classList.add('hidden');
    resultadoBusqueda.innerHTML = ''; // limpiar
  });

  btnAgregar.addEventListener('click', () => {
    formAgregar.classList.remove('hidden');
    formBuscar.classList.add('hidden');
    resultadoBusqueda.innerHTML = ''; // limpiar
  });

  buscarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombreBuscar').value;
    const fecha = document.getElementById('fechaBuscar').value;

    const response = await fetch('/Paciente/buscar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, fecha_nacimiento: fecha })
    });

    const data = await response.json();

    if (data.encontrado && data.resultados.length > 0) {
      const rows = data.resultados.map(p => `
        <tr>
          <td>${p.nombre}</td>
          <td>${p.edad}</td>
          <td>${p.sexo}</td>
          <td>${p.direccion}</td>
          <td>${p.telefono}</td>
          <td><a class="btn" href="/Triaje/${p.id}">Llenar Cuestionario</a></td>
        </tr>
      `).join('');

      resultadoBusqueda.innerHTML = `
        <h3>Resultados encontrados:</h3>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Edad</th><th>Sexo</th><th>Dirección</th><th>Teléfono</th><th>Acción</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    } else {
      resultadoBusqueda.innerHTML = `<p>No se encontró ningún paciente con esos datos.</p>`;
    }
  });

  agregarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(agregarForm));
    const response = await fetch('/Paciente/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Paciente añadido correctamente',
        confirmButtonText: 'Continuar'
      }).then(() => {
        window.location.href = `/Triaje/${data.pacienteId}`;
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar el paciente',
        text: data.mensaje || 'Ocurrió un error inesperado',
      });
    }
  });
});
