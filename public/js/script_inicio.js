document.addEventListener('DOMContentLoaded', async () => 
{
  const response = await fetch('/inicio/datos');
  const data = await response.json();

  const chartData = {
    día: data.dia,
    semana: data.semana,
    mes: data.mes
  };

  const Flujo_Dia = data.Flujo_Dia;

  const chartCanvas = document.getElementById('chart');
  const ctx = chartCanvas.getContext('2d');

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Pacientes',
        data: chartData['día'],
        borderColor: '#7646d2',
        backgroundColor: 'transparent',
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#7646d2'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#aaa' }, grid: { color: '#333' } },
        x: { ticks: { color: '#aaa' }, grid: { display: false } }
      }
    }
  });

  // Permitir cambiar de día/semana/mes
  window.changeData = (periodo) => {
    document.querySelectorAll('.tab-filter button').forEach(b => b.classList.remove('active'));
    const index = { día: 0, semana: 1, mes: 2 };
    document.querySelectorAll('.tab-filter button')[index[periodo]].classList.add('active');
    chart.data.datasets[0].data = chartData[periodo];
    chart.update();
    document.getElementById('total-count').textContent = chartData[periodo].reduce((a, b) => a + b, 0);
  };


  // Actualizar los contadores de pacientes
    document.getElementById('Pacientes_Rojos').textContent = Flujo_Dia.rojo
    document.getElementById('Pacientes_Amarillos').textContent = Flujo_Dia.amarillo
    document.getElementById('Pacientes_Verdes').textContent = Flujo_Dia.verde
  
  // Modo oscuro
  window.toggleDarkMode = () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('dark-mode');
  };

  
  document.getElementById('btn_Triaje').addEventListener('click', () => {
    window.location.href = '/Pacientes';
  })

  // Cargar día por defecto
  changeData('día');
});
