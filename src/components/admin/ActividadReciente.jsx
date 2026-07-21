import './ActividadReciente.css';

export default function ActividadReciente({ actividades }) {
  return (
    <section className="actividad-card">
      <h2>🔔 Actividad reciente</h2>

      {actividades.length === 0 ? (
        <p>No hay actividad reciente.</p>
      ) : (
        actividades.map((item, index) => (
          <div key={index} className="actividad-item">
            <span>{item.tipo === 'pago' ? '💰' : '🏢'}</span>

            <div>
              <strong>{item.titulo}</strong>
              <p>{item.descripcion}</p>
              <small>{new Date(item.fecha).toLocaleString()}</small>
            </div>
          </div>
        ))
      )}
    </section>
  );
}