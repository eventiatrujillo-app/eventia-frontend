import './AdminDashboard.css';

export default function AdminDashboard({ stats }) {
  const cards = [
    {
      label: 'Empresas',
      value: stats?.totalEmpresas || 0,
      icon: '🏢'
    },
    {
      label: 'Premium',
      value: stats?.premiumActivos || 0,
      icon: '👑'
    },
    {
      label: 'Pendientes',
      value: stats?.empresasPendientes || 0,
      icon: '⏳'
    },
    {
      label: 'Visitas',
      value: stats?.totalVisitas || 0,
      icon: '👁️'
    },
    {
      label: 'Cotizaciones',
      value: stats?.totalCotizaciones || 0,
      icon: '📨'
    },
    {
      label: 'PRO',
      value: stats?.proActivos || 0,
      icon: '⭐'
    },
    {
      label: 'Activas',
      value: stats?.empresasActivas || 0,
      icon: '✅'
    },
    {
      label: 'Videos',
      value: stats?.videosPendientes || 0,
      icon: '🎥'
    }
  ];

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <span>📊 Panel General</span>
          <h2>Dashboard Administrador</h2>
          <p>Resumen general del estado actual de EVENTIA.</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="admin-stat-card">
            <div className="admin-stat-icon">{card.icon}</div>

            <div>
              <h3>{card.value}</h3>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}