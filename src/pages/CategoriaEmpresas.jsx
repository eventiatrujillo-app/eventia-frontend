import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import EmpresaCard from '../components/EmpresaCard';
import { obtenerEmpresas } from '../services/empresaServices';

import { LOGO_EVENTIA } from '../config/logo';

import '../styles/categoriaEmpresas.css';

export default function CategoriaEmpresas() {
  const { categoria } = useParams();

  const [empresas, setEmpresas] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarEmpresas();
  }, [categoria]);

  const cargarEmpresas = async () => {
    const data = await obtenerEmpresas();

    const filtradas = (data.empresas || []).filter(
      (empresa) =>
        empresa.categoria?.toLowerCase() ===
        categoria.toLowerCase()
    );

    setEmpresas(filtradas);
  };

  const empresasFiltradas = empresas.filter((empresa) =>
    empresa.nombre_empresa
      ?.toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="categoria-page">

      <header className="categoria-header">

        <Link to="/" className="categoria-brand">
          <img src={LOGO_EVENTIA} alt="Eventia" />

          <div>
            <strong>EVENTIA</strong>
            <span>Proveedores para eventos</span>
          </div>
        </Link>

        <Link to="/" className="categoria-home-link">
          ← Volver al inicio
        </Link>

      </header>

      <section className="categoria-hero">

        <div>
          <span className="categoria-badge">
            Categoría
          </span>

          <h1>
            Proveedores de {categoria}
          </h1>

          <p>
            Encuentra empresas activas, revisa su información,
            galería y contacta directamente para contratar sus servicios.
          </p>
        </div>

        <div className="categoria-search">
          <label>Buscar dentro de {categoria}</label>

          <input
            type="text"
            placeholder="Buscar empresa..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

      </section>

      <section className="categoria-content">

        <div className="categoria-title-row">
          <div>
            <h2>
              Empresas disponibles
            </h2>

            <p>
              {empresasFiltradas.length} proveedor(es) encontrado(s)
            </p>
          </div>
        </div>

        {empresasFiltradas.length === 0 ? (
          <div className="categoria-empty">
            <h3>No hay proveedores disponibles</h3>
            <p>
              Por ahora no existen empresas activas en esta categoría.
            </p>

            <Link to="/">
              Explorar otras categorías
            </Link>
          </div>
        ) : (
          <div className="categoria-grid">
            {empresasFiltradas.map((empresa) => (
              <EmpresaCard
                key={empresa.id}
                empresa={empresa}
              />
            ))}
          </div>
        )}

      </section>

    </div>
  );
}