import { Link } from 'react-router-dom';
import { LOGO_EVENTIA } from '../config/logo';
import '../styles/planes.css';

export default function Planes() {
  const planes = [
    {
      nombre: 'BÁSICO',
      precio: '29.90',
      descripcion: 'Ideal para empezar a publicar tu empresa.',
      beneficios: [
        'Perfil público',
        'Logo y portada',
        'Galería básica',
        'Cotizaciones'
      ]
    },
    {
      nombre: 'PRO',
      precio: '59.90',
      descripcion: 'Mayor visibilidad para conseguir más clientes.',
      beneficios: [
        'Todo lo del Básico',
        'Más visibilidad',
        'Estadísticas',
        'Mejor posicionamiento'
      ]
    },
    {
      nombre: 'PREMIUM',
      precio: '99.90',
      descripcion: 'Para empresas que quieren destacar en EVENTIA.',
      beneficios: [
        'Todo lo del Pro',
        'Empresa destacada',
        'Mayor prioridad',
        'Perfil premium'
      ]
    }
  ];

  return (
    <div className="planes-page">
      <header className="planes-header">
        <Link to="/" className="planes-brand">
          <img src={LOGO_EVENTIA} alt="Eventia" />
          <div>
            <strong>EVENTIA</strong>
            <span>Planes para empresas</span>
          </div>
        </Link>

        <Link to="/dashboard" className="planes-volver">
          ← Volver al dashboard
        </Link>
      </header>

      <section className="planes-hero">
        <h1>Elige el plan ideal para tu empresa</h1>
        <p>
          Publica tus servicios, recibe cotizaciones y aumenta tu visibilidad
          dentro de EVENTIA.
        </p>
      </section>

      <section className="planes-grid">
        {planes.map((plan) => (
          <div key={plan.nombre} className="plan-box">
            <h2>{plan.nombre}</h2>

            <div className="plan-price">
              S/ {plan.precio}
              <span>/ mes</span>
            </div>

            <p>{plan.descripcion}</p>

            <ul>
              {plan.beneficios.map((b) => (
                <li key={b}>✔ {b}</li>
              ))}
            </ul>

            <Link
              to={`/pago-plan/${plan.nombre}`}
              className="btn-elegir-plan"
            >
              Elegir plan
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}