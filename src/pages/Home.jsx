import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmpresaCard from '../components/EmpresaCard';
import { obtenerEmpresas } from '../services/empresaServices';
import facebook from "../assets/facebook.svg";
import instagram from "../assets/instagram.svg";
import tiktok from "../assets/tiktok.svg";
import '../styles/home.css';
import { LOGO_EVENTIA } from '../config/logo';
import { obtenerCategoriasPublicas } from '../services/categoriaService';


export default function Home() {
  const [empresas, setEmpresas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [evento, setEvento] = useState('');
  const [modoBusqueda, setModoBusqueda] = useState('proveedor');
  const [servicioSugerido, setServicioSugerido] = useState('');
  const [planFiltro, setPlanFiltro] = useState('');
  const [orden, setOrden] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    const data = await obtenerEmpresas();
    
    console.log("EMPRESAS:", data.empresas);
    data.empresas.forEach((e) => {
    console.log(
      e.nombre_empresa,
      "ID:", e.id,
      "SLUG:", e.slug
    );
  });
    setEmpresas(data.empresas || []);
  };

  useEffect(() => {
  cargarCategorias();
}, []);

const cargarCategorias = async () => {
  try {
    const data = await obtenerCategoriasPublicas();
    setCategorias(data.categorias || []);
  } catch (error) {
    console.error('Error cargando categorías:', error);
  }
};

/*Buscador inteligente */
const sinonimosBusqueda = {
  boda: ['catering', 'decoracion', 'fotografia', 'dj', 'local de eventos', 'barman','spa'],
  matrimonio: ['catering', 'decoracion', 'fotografia', 'dj', 'local de eventos', 'barman','spa'],
  cumpleaños: ['decoracion', 'catering', 'dj', 'barman', 'fotografia','spa' ],
  cumpleanos: ['decoracion', 'catering', 'dj', 'barman', 'fotografia','spa' ],
  quinceañero: ['decoracion', 'fotografia', 'dj', 'catering', 'spa'],
  quinceanero: ['decoracion', 'fotografia', 'dj', 'catering', 'spa'],
  fiesta: ['dj', 'barman', 'catering', 'decoracion', 'fotografia'],
  babyshower: ['decoracion', 'catering', 'fotografia'],
  graduacion: ['dj', 'barman', 'fotografia', 'catering']
};

const serviciosPorEvento = {
  boda: ['Local de Eventos', 'Catering', 'DJ', 'Fotografía', 'Decoración', 'Barman', 'Spa'],
  cumpleaños: ['Decoración', 'Catering', 'DJ', 'Barman', 'Fotografía'],
  quinceaños: ['Decoración', 'DJ', 'Fotografía', 'Catering', 'Spa'],
  babyshower: ['Decoración', 'Fotografía', 'Catering'],
  graduación: ['DJ', 'Fotografía', 'Catering', 'Local de Eventos'],
  corporativo: ['Local de Eventos', 'Catering', 'Fotografía', 'Barman'],
  aniversario: ['Decoración', 'DJ', 'Barman', 'Catering'],
  fiesta: ['DJ', 'Barman', 'Catering', 'Fotografía']
};

  /*filtro */
  const normalizar = (texto) =>
  String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const empresasFiltradas = empresas.filter((empresa) => {
  const categoriaEmpresa = normalizar(empresa.categoria);

  const categoriaElegida =
    modoBusqueda === 'evento'
      ? servicioSugerido
      : categoria;

  const coincideCategoria =
    !categoriaElegida ||
    categoriaEmpresa === normalizar(categoriaElegida);

  const coincideUbicacion =
    !ubicacion ||
    normalizar(empresa.distrito).includes(normalizar(ubicacion)) ||
    normalizar(empresa.direccion).includes(normalizar(ubicacion));

  const coincidePlan =
    !planFiltro ||
    normalizar(empresa.plan) === normalizar(planFiltro);

  const categoriasRecomendadas =
    (serviciosPorEvento[evento] || []).map(normalizar);

  const coincideEvento =
    modoBusqueda !== 'evento' ||
    !evento ||
    (
      servicioSugerido
        ? categoriaEmpresa === normalizar(servicioSugerido)
        : categoriasRecomendadas.includes(categoriaEmpresa)
    );

  return (
    coincideCategoria &&
    coincideUbicacion &&
    coincidePlan &&
    coincideEvento
  );
});

/*mejores proveedores */
  const mejoresProveedores = [...empresas]
  .sort((a, b) => {
    const prioridadPlan = {
      PREMIUM: 3,
      PRO: 2,
      BASICO: 1
    };

    return (
      (prioridadPlan[b.plan] || 0) - (prioridadPlan[a.plan] || 0) ||
      Number(b.promedio || 0) - Number(a.promedio || 0) ||
      Number(b.total_valoraciones || 0) - Number(a.total_valoraciones || 0)
    );
  })
  .slice(0, 3);

  const hayFiltrosActivos = Boolean(
  categoria ||
  ubicacion ||
  planFiltro ||
  evento ||
  servicioSugerido
);

const proveedoresAMostrar = hayFiltrosActivos
  ? empresasFiltradas
  : mejoresProveedores;

  

const limpiarBusqueda = () => {
  setEvento('');
  setBusqueda('');
  setCategoria('');
  setUbicacion('');
  setPlanFiltro('');
  setOrden('');
  setServicioSugerido('');
  setModoBusqueda('proveedor');
};

  return (
    <div className="eventia-home">

      <header className="eventia-navbar">

        <Link to="/" className="eventia-brand">
          <img src={LOGO_EVENTIA} alt="Eventia" />

          <div>
            <strong>EVENTIA</strong>
            <span>Proveedores para Eventos</span>
          </div>
        </Link>

        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#proveedores">Proveedores</a>
          <a href="#categorias">Categorías</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="btn-login">
            Iniciar sesión
          </Link>

          <Link to="/registro-empresa" className="btn-publicar">
            Publica tu Empresa
          </Link>
        </div>

      </header>

      <section id="inicio" className="hero-eventia">

        <div className="hero-content">

          <h1>
            Encuentra los Mejores Proveedores para tu Evento
          </h1>

          <p>
            Conectamos organizadores con proveedores confiables y profesionales
            para hacer de cada evento algo inolvidable.
          </p>

<div className="search-modes">

  <button
    type="button"
    className={modoBusqueda === 'proveedor' ? 'active' : ''}
    onClick={() => {

      setModoBusqueda('proveedor');

      // Limpiar el asistente de eventos
      setEvento('');
      setServicioSugerido('');

    }}
  >
    🔎 Buscar proveedor
  </button>

  <button
    type="button"
    className={modoBusqueda === 'evento' ? 'active' : ''}
    onClick={() => {

      setModoBusqueda('evento');

      // Limpiar el buscador de proveedores
      setBusqueda('');

    }}
  >
    🎉 Organizar evento
  </button>

</div>

<div className="search-bar-premium">

  {modoBusqueda === 'evento' && (
    <div className="search-bar-item">
      <label>🎉 Evento</label>

      <select
        value={evento}
        onChange={(e) => {
          setEvento(e.target.value);
          setServicioSugerido('');
        }}
      >
        <option value="">Selecciona evento</option>
        <option value="boda">💍 Boda</option>
        <option value="cumpleaños">🎂 Cumpleaños</option>
        <option value="quinceaños">🎉 Quinceaños</option>
        <option value="baby shower">👶 Baby Shower</option>
        <option value="graduación">🎓 Graduación</option>
        <option value="corporativo">🏢 Corporativo</option>
        <option value="fiesta">🍸 Fiesta</option>
      </select>
    </div>
  )}

  {modoBusqueda === 'proveedor' && (
  <div className="search-bar-item">
    <label>🤝 Servicio</label>

    <select
  value={categoria}
  onChange={(e) => setCategoria(e.target.value)}
>
  <option value="">Todos los servicios</option>

  {categorias.map((cat) => (
    <option
      key={cat.id}
      value={cat.nombre}
    >
      {cat.icono} {cat.nombre}
    </option>
  ))}
</select>
  </div>
)}

  <div className="search-bar-item">
  <label>📍 Ubicación</label>

  <select
    value={ubicacion}
    onChange={(e) => setUbicacion(e.target.value)}
  >
    <option value="">Todos los distritos</option>
    <option value="trujillo">Trujillo</option>
    <option value="victor larco">Víctor Larco</option>
    <option value="huanchaco">Huanchaco</option>
    <option value="la esperanza">La Esperanza</option>
    <option value="el porvenir">El porvenir</option>
    <option value="moche">Moche</option>
    <option value="florencia de mora">Florencia de mora</option>
    <option value="salaverry">Salaverry</option>
    <option value="laredo">Laredo</option>
    <option value="simbal">Simbal</option>
    <option value="poroto">Poroto</option>
  </select>
</div>

  <div className="search-bar-item">
  <label>👑 Plan</label>
  <select
    value={planFiltro}
    onChange={(e) => setPlanFiltro(e.target.value)}
  >
    <option value="">Todos</option>
    <option value="premium">👑 Premium</option>
    <option value="pro">⭐ Pro</option>
    <option value="basico">🥉 Básico</option>
  </select>
</div>

<div className="search-bar-item">
  <label>📊 Ordenar</label>

  <select
    value={orden}
    onChange={(e) => setOrden(e.target.value)}
  >
    <option value="">Predeterminado</option>
    <option value="valorados">⭐ Más valorados</option>
    <option value="recientes">🆕 Más recientes</option>
    <option value="az">A - Z</option>
  </select>
</div>
  <button
  type="button"
  className="search-bar-button"
  onClick={() => {
    document
      .getElementById('proveedores')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  }}
>
  🔍
</button>

</div>

{modoBusqueda === 'evento' && evento && (
  <div className="servicios-sugeridos">
    <h3>Para este evento podrías necesitar:</h3>

    <div>
      {serviciosPorEvento[evento]?.map((servicio) => (
        <button
          key={servicio}
          type="button"
          className={servicioSugerido === servicio ? 'active' : ''}
          onClick={() => setServicioSugerido(servicio)}
        >
          {servicio}
        </button>
      ))}
    </div>
  </div>
)}

          <div className="quick-categories">
            {categorias.map((cat) => (
              <Link
                key={cat.nombre}
                to={`/categoria/${cat.nombre}`}
                className="quick-category"
              >
                <span>{cat.icono}</span>
                <small>{cat.nombre}</small>
              </Link>
            ))}
          </div>

        </div>

      </section>

      <section id="categorias" className="popular-section">

        <div className="section-header">
          <h2>Categorías populares</h2>
        </div>

        <div className="popular-grid">
                {categorias
          .slice(0, 8)
          .map((cat) => (
            <Link
              key={cat.id || cat.nombre}
              to={`/categoria/${encodeURIComponent(cat.nombre)}`}
              className="popular-card"
            >
              <div className="popular-img">
                <span>{cat.icono || '🎉'}</span>
              </div>

              <div className="popular-info">
                <h3>{cat.nombre}</h3>
                <p>Proveedores disponibles</p>
        </div>
      </Link>
    ))}
        </div>

      </section>

      <section id="como-funciona" className="steps-section">

        <h2>¿Cómo funciona?</h2>

        <div className="steps-grid">

          <div className="step-card">
            <span>1</span>
            <div className="step-icon">🔍</div>
            <h3>Busca</h3>
            <p>Encuentra los Proveedores que Necesitas para tu Evento.</p>
          </div>

          <div className="step-card">
            <span>2</span>
            <div className="step-icon">📋</div>
            <h3>Compara</h3>
            <p>Revisa Perfiles, Servicios, Precios y Opiniones.</p>
          </div>

          <div className="step-card">
            <span>3</span>
            <div className="step-icon">💬</div>
            <h3>Contacta</h3>
            <p>Comunícate Directamente con los Proveedores.</p>
          </div>

          <div className="step-card">
            <span>4</span>
            <div className="step-icon">✅</div>
            <h3>Contrata</h3>
            <p>Elige al mejor Proveedor y haz tu Evento un éxito.</p>
          </div>

        </div>

        <div className="provider-cta">

          <div>
            <h2>¿Eres proveedor?</h2>
            <p>Únete a EVENTIA y haz crecer tu Negocio.</p>
          </div>

          <Link to="/registro-empresa">
            Publica tu Empresa 
          </Link>

        </div>

      </section>

      <section id="proveedores" className="providers-section">
  <div className="section-header">
    <h2>
      {hayFiltrosActivos
        ? `Proveedores de ${categoria || servicioSugerido || evento}`
        : 'Proveedores Destacados'}
    </h2>

    <p>
      {hayFiltrosActivos
        ? 'Resultados según los filtros seleccionados.'
        : 'Empresas activas disponibles para contratación.'}
    </p>
  </div>

  {proveedoresAMostrar.length === 0 ? (
    <div className="sin-resultados">
      <h3>😕 No encontramos proveedores</h3>

      <p>
        No existen proveedores con los filtros seleccionados.
      </p>

      <button
        type="button"
        onClick={limpiarBusqueda}
      >
        Limpiar búsqueda
      </button>
    </div>
  ) : (
    <div className="empresas-grid">
      {proveedoresAMostrar.map((empresa) => (
        <EmpresaCard
          key={empresa.id}
          empresa={empresa}
        />
      ))}
    </div>
  )}
</section>

   {!hayFiltrosActivos && (
  <section className="top-providers-section">
    <div className="section-header">
      <h2>🏆 Mejores Proveedores del Mes</h2>
      <p>
        Empresas destacadas por su valoración, actividad y presencia en EVENTIA.
      </p>
    </div>

    <div className="top-providers-grid">
      {mejoresProveedores.map((empresa, index) => (
        <div
          key={empresa.id}
          className="top-provider-card"
        >
          <span className="top-position">
            #{index + 1}
          </span>

          <EmpresaCard empresa={empresa} />
        </div>
      ))}
    </div>
  </section>
)}  

      <footer id="contacto" className="eventia-footer">

        <div>
          <h2>EVENTIA</h2>
          <p>
            La Plataforma Líder para conectar organizadores de Eventos
            con los mejores Proveedores.
          </p>
          <p>Comunicate con Nosotros</p>
          <p>Email  : eventia.trujillo@gmail.com</p>
        </div>

        <div>
          <h4>Navegación</h4>
          <a href="#inicio">Inicio</a>
          <a href="#proveedores">Proveedores</a>
          <a href="#categorias">Categorías</a>
          <a href="#como-funciona">Cómo funciona</a>
        </div>

        <div>
          <h4>Para proveedores</h4>
          <Link to="/registro-empresa">Publica tu Empresa</Link>
          <Link to="/login">Iniciar Sesión</Link>
        </div>

        <div>
          <h4>Legal</h4>
          <a href="#contacto">Términos y condiciones</a>
          <a href="#contacto">Política de privacidad</a>
        </div>
       
        <div className="footer-bottom">

        <div className="footer-social">

        <a href="https://www.facebook.com/profile.php?id=61591724101936" target="_blank" rel="noopener noreferrer">
        <img className="social-icon" src={facebook} alt="Facebook" />
        </a>

        <a href="https://www.instagram.com/eventia.trujillo" target="_blank" rel="noopener noreferrer">
         <img className="social-icon" src={instagram} alt="Instagram" />
        </a>

        <a href="https://www.tiktok.com/@eventia2026" target="_blank" rel="noopener noreferrer">
        <img className="social-icon" src={tiktok} alt="TikTok" />
        </a>
       </div>
         <p>© 2026 Eventia. Todos los derechos reservados.</p>
    </div>
</footer>
</div>
  );
}