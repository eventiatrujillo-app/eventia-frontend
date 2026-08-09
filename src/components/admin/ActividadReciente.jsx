import './ActividadReciente.css';

export default function ActividadReciente({ actividades = [] }) {

  const obtenerIcono = (tipo) => {
    switch (tipo) {
      case 'empresa':
        return '🏢';

      case 'pago':
        return '💰';

      case 'suscripcion':
        return '⭐';

      default:
        return '🔔';
    }
  };

  const obtenerClase = (tipo) => {
    switch (tipo) {
      case 'empresa':
        return 'actividad-empresa';

      case 'pago':
        return 'actividad-pago';

      case 'suscripcion':
        return 'actividad-suscripcion';

      default:
        return '';
    }
  };

  const obtenerTituloTipo = (tipo) => {
    switch (tipo) {
      case 'empresa':
        return 'Empresa registrada';

      case 'pago':
        return 'Pago';

      case 'suscripcion':
        return 'Suscripción';

      default:
        return 'Actividad';
    }
  };

  return (
    <section className="actividad-card">

      <div className="actividad-header">

        <div>
          <h2>🔔 Actividad reciente</h2>

          <p>
            Últimos movimientos registrados en EVENTIA
          </p>
        </div>

        <span className="actividad-count">
          {actividades.length}
        </span>

      </div>

      {actividades.length === 0 ? (

        <div className="actividad-empty">
          <span>📭</span>
          <p>No hay actividad reciente.</p>
        </div>

      ) : (

        <div className="actividad-list">

          {actividades.map((item, index) => (

            <div
              key={`${item.tipo}-${item.titulo}-${item.fecha}-${index}`}
              className={`actividad-item ${obtenerClase(item.tipo)}`}
            >

              <div className="actividad-icon">
                {obtenerIcono(item.tipo)}
              </div>

              <div className="actividad-content">

                <div className="actividad-title-row">

                  <strong>
                    {item.titulo}
                  </strong>

                  <span className="actividad-tipo">
                    {obtenerTituloTipo(item.tipo)}
                  </span>

                </div>

                <p>
                  {item.descripcion}
                </p>

                <small>
                  {new Date(item.fecha).toLocaleString(
                    'es-PE',
                    {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    }
                  )}
                </small>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}