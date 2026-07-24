import '../styles/card.css';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CATEGORY_COVERS } from '../config/categoryCovers';
import TrustBadges from '../components/TrustBadges';
import {LOGOS_URL,PORTADAS_URL} from '../config/urls';

export default function EmpresaCard({ empresa }) {
  
    const usaPortadaEventia =
    empresa.usa_portada_eventia === 1 ||
    empresa.usa_portada_eventia === true ||
    empresa.usa_portada_eventia === '1';

    const portadaEventia =
      CATEGORY_COVERS[empresa.categoria] || CATEGORY_COVERS.default;

    const portadaUrl =
      usaPortadaEventia
        ? portadaEventia
        : empresa.portada
        ? `${PORTADAS_URL}/${empresa.portada}`
        : portadaEventia;

    const logoUrl =
      empresa.logo
        ? `${LOGOS_URL}/${empresa.logo}`
        : portadaEventia;

  

  return (
    <Link to={ empresa.slug
      ? `/proveedor/${empresa.slug}`
      : `/empresa/${empresa.id}` } className="empresa-link" >
      <article className="empresa-card">
        <div className="empresa-media">
          <img
            className="portada"
            src={portadaUrl}
            alt={empresa.nombre_empresa || 'Proveedor'}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = CATEGORY_COVERS.default;
            }}
          />

          <img
            className="logo"
            src={logoUrl}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="empresa-body">
          <div className="card-topline">
            <span className="categoria">{empresa.categoria}</span>
            {empresa.distrito && <span className="distrito">{empresa.distrito}</span>}
          </div>

          <h3>{empresa.nombre_empresa}</h3>

          <TrustBadges empresa={empresa} />

          <div className="card-rating">
          <span>⭐ {empresa.promedio || '0.0'}</span>
          <small>{empresa.total_valoraciones || 0} valoraciones</small>
          </div>
          <p>{empresa.descripcion}</p>


          <div className="card-actions">
  <span className="btn-ver-perfil">
    👁 Ver Perfil
  </span>

  <button
    type="button"
    className="btn-whatsapp-secundario"
    onClick={async (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        await api.post(`/empresas/${empresa.id}/whatsapp`);
      } catch (error) {
        console.log(error);
      }

      window.open(
        `https://wa.me/51${empresa.whatsapp}`,
        '_blank'
      );
    }}
  >
    WhatsApp
  </button>
</div>
        </div>
      </article>
    </Link>
  );
}