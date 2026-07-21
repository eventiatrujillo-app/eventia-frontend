import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerEmpresaPorId } from '../services/empresaServices';
import { obtenerGaleria } from '../services/galeriaService';
import '../styles/empresaDetalle.css';
import {obtenerValoraciones,crearValoracion} from '../services/ValoracionService';
import api from '../services/api';
import { obtenerDisponibilidad } from '../services/disponibilidadService';
import { CATEGORY_COVERS } from '../config/categoryCovers';
import TrustBadges from '../components/TrustBadges';
import { LOGOS_URL,PORTADAS_URL,GALERIA_URL,VIDEOS_URL} from '../config/urls';



export default function EmpresaDetalle() {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [valoraciones,setValoraciones]=useState([]);
  const [promedio,setPromedio]=useState(0);
  const [total,setTotal]=useState(0);
  const [form,setForm]=useState({
  nombre_cliente:'',
  puntuacion:5,
  comentario:''
  });
  const [mostrarCotizacion, setMostrarCotizacion] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaEvento, setFechaEvento] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [mostrarVideo, setMostrarVideo] = useState(false);
  const [fotoActual, setFotoActual] = useState(null);
  const lightboxRef = useRef(null);
  
  
  useEffect(() => {
    cargarEmpresa();
     registrarVisita(); }, [id]);

  useEffect(() => {
  if (fotoActual !== null) {
    setTimeout(() => {
      lightboxRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  }
}, [fotoActual]);
  
  const cargarEmpresa = async () => {
    const data = await obtenerEmpresaPorId(id);
    setEmpresa(data.empresa);

    const fotos = await obtenerGaleria(id);
    setGaleria(fotos.fotos || []);

    /****/
    const dataValoraciones =await obtenerValoraciones(id);
    setValoraciones(dataValoraciones.valoraciones || []);
    setPromedio(dataValoraciones.promedio || 0);
    setTotal(dataValoraciones.total|| 0);

   const disp = await obtenerDisponibilidad(id);
   setDisponibilidad(disp.disponibilidad || []);
   };

   const enviarValoracion =async ()=>{await crearValoracion(id,form);
   setForm({nombre_cliente:'',puntuacion:5,comentario:''});
   cargarEmpresa();
   alert('Gracias por valorar');
   };

/*enviar cotizacion*/ 
   const enviarCotizacion= async () => {
    
    if (telefono.length < 7 || telefono.length > 9) {
    alert('Ingresa un teléfono válido (7 a 9 dígitos).');
    return;
  }
     
      await api.post(`/empresas/${empresa.id}/cotizaciones`,
      {
      empresa_id:empresa.id,
      nombre_cliente:nombre,
      telefono,
      fecha_evento:fechaEvento,
      mensaje
      });
      alert(
'✅ Solicitud enviada correctamente.\n\nEspera que el proveedor se pondrá en contacto contigo.'
);
      setNombre('');
      setTelefono('');
      setFechaEvento('');
      setMensaje('');
      setMostrarCotizacion(false);
      };

   /*estadisticas*/
   const registrarVisita = async () => {
  try {await api.post(
      `/empresas/${id}/visita`);
  } catch (error) {
    console.log(error);
  }
};

//whatsapp
const registrarClickWhatsapp = async () => {
  try {
    await api.post(`/empresas/${empresa.id}/whatsapp`);
  } catch (error) {
    console.error('Error registrando clic de WhatsApp:', error);
  }
};
const abrirWhatsapp = async (e) => {
  e.preventDefault();

  try {
    await api.post(`/empresas/${empresa.id}/whatsapp`);
  } catch (error) {
    console.error('Error registrando clic de WhatsApp:', error);
  }

  window.open(
    whatsappUrl,
    '_blank',
    'noopener,noreferrer'
  );
};

  if (!empresa) {
    return (
      <div className="detalle-loading">
        Cargando empresa...
      </div>
    );
  }

  const esPremium = empresa.plan === 'PREMIUM';
  const esPro = empresa.plan === 'PRO';
  const logoUrl = empresa.logo
  ? `${LOGOS_URL}/${empresa.logo}`
  : '/covers/default.jpg';

    const portadaEventia =
    CATEGORY_COVERS[empresa.categoria] || CATEGORY_COVERS.default;

        const usaPortadaEventia = Boolean(Number(empresa.usa_portada_eventia));
        const portadaUrl = usaPortadaEventia
          ? portadaEventia
          : empresa.portada
            ? `${PORTADAS_URL}/${empresa.portada}`
            : portadaEventia;

  const whatsappUrl =
    `https://wa.me/51${empresa.whatsapp}?text=Hola,%20vi%20tu%20empresa%20en%20EVENTIA%20y%20quiero%20información%20para%20un%20evento`;
  return (
    <div className={esPremium ? 'detalle-page premium-page' : 'detalle-page'}>

      <div className="detalle-topbar">
        <Link to="/" className="volver-home">
          ← Volver al Inicio
        </Link>
      </div>

 <section className="detalle-hero-pro ev-animate-in">

  <img
    src={portadaUrl}
    alt={empresa.nombre_empresa}
    className="detalle-hero-bg"
    fetchPriority="high"
    decoding="async"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src =
        CATEGORY_COVERS[empresa.categoria] || CATEGORY_COVERS.default;
    }}
  />

  <div className="detalle-hero-mask" />

  {esPremium && empresa.video && (
    <button
      type="button"
      className="detalle-video-btn"
      onClick={() => setMostrarVideo(true)}
    >
      ▶ Ver presentación
    </button>
  )}

  <div className="detalle-hero-content-pro ev-animate-up">

    <img
      src={logoUrl}
      alt={empresa.nombre_empresa}
      className="detalle-logo-pro"
    />

    <div className="detalle-hero-text">
      <span className="detalle-categoria-pro">
        {empresa.categoria}
      </span>

      <h1>{empresa.nombre_empresa}</h1>

      <p>{empresa.descripcion}</p>

      <TrustBadges
        empresa={empresa}
        promedio={promedio}
        total={total}
      />

      <div className="detalle-hero-actions">
        <button
          type="button"
          onClick={() => setMostrarCotizacion(true)}
        >
          📨 Solicitar cotización
        </button>

        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            onClick={registrarClickWhatsapp}
          >
            💬 WhatsApp
          </a>
      </div>
    </div>

  </div>
</section>

{mostrarVideo && empresa.video && (
  <div
    className="video-modal"
    onClick={() => setMostrarVideo(false)}
  >
    <div
      className="video-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="cerrar-video"
        onClick={() => setMostrarVideo(false)}
        aria-label="Cerrar video"
      >
        ✕
      </button>

      <video
        controls
        autoPlay
        preload="metadata"
        src={`${VIDEOS_URL}/${empresa.video}`}
      >
        Tu navegador no permite reproducir este video.
      </video>
    </div>
  </div>
)}

{fotoActual !== null && galeria[fotoActual] && (
  <div
    ref={lightboxRef}
    className="lightbox"
    onClick={() => setFotoActual(null)}
  >
    <div
      className="lightbox-content"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={() => setFotoActual(null)}
        aria-label="Cerrar galería"
      >
        ✕
      </button>

      <button
        type="button"
        className="lightbox-prev"
        onClick={() =>
          setFotoActual((actual) =>
            actual === 0 ? galeria.length - 1 : actual - 1
          )
        }
      >
        ❮
      </button>

      <img
        src={`${GALERIA_URL}/${galeria[fotoActual].imagen}`}
        alt={`Foto ${fotoActual + 1}`}
        loading="eager"
        decoding="async"
      />

      <button
        type="button"
        className="lightbox-next"
        onClick={() =>
          setFotoActual((actual) =>
            actual === galeria.length - 1 ? 0 : actual + 1
          )
        }
      >
        ❯
      </button>

      <div className="contador-fotos">
        {fotoActual + 1} / {galeria.length}
      </div>
    </div>
  </div>
)}

<section className="detalle-stats-pro ev-animate-up">
  <div>
    <strong>⭐ {promedio || '0.0'}</strong>
    <span>{total} opiniones</span>
  </div>

  <div>
    <strong>⚡ Rápida respuesta</strong>
    <span>Contacto directo</span>
  </div>

  <div>
    <strong>📷 {galeria.length}</strong>
    <span>fotos publicadas</span>
  </div>

  {esPremium && (
    <div>
      <strong>👑 Premium</strong>
      <span>Proveedor destacado</span>
    </div>
  )}
</section>


      <main className="detalle-layout detalle-landing">

        <section className="detalle-main">

          <div className="detalle-card detalle-about-pro ev-hover-lift">
          <div className="section-title-pro">
            <span>✨ Información</span>
            <h2>Sobre {empresa.nombre_empresa}</h2>
            <p>Conoce más sobre este proveedor y los servicios que ofrece.</p>
          </div>

          <p className="detalle-descripcion">
            {empresa.descripcion}
          </p>

          <div className="detalle-highlights">
            <div>✅ Atención personalizada</div>
            <div>✅ Servicios para eventos</div>
            <div>✅ Contacto directo</div>
          </div>

            <div className="detalle-info-grid">

              <div>
                <span>📍 Distrito</span>
                <strong>{empresa.distrito}</strong>
              </div>

              <div>
                <span>📌 Dirección</span>
                <strong>{empresa.direccion}</strong>
              </div>

              <div>
                <span>🏷 Categoría</span>
                <strong>{empresa.categoria}</strong>
              </div>

              <div>
                <span>✅ Estado</span>
                <strong>{empresa.estado}</strong>
              </div>

            </div>
          </div>

           {esPremium && (
  <section className="premium-video-section">
    <div className="premium-video-info">
      <span>🎥 Video Premium</span>
      <h2>Conoce a {empresa.nombre_empresa}</h2>
      <p>
        Mira una presentación breve del proveedor, sus servicios y trabajos realizados.
      </p>
    </div>

    <div className="premium-video-box">
      {empresa.video ? (
        <video
          controls
          preload="metadata"
          playsInline
          src={`${VIDEOS_URL}/${empresa.video}`}
          className="premium-video-player"
        />
      ) : (
        <>
          <button type="button" className="play-premium-btn">
            ▶
          </button>
          <div>
            <strong>Video aún no disponible</strong>
            <small>Este proveedor Premium todavía no subió su presentación.</small>
          </div>
        </>
      )}
    </div>    
  </section> 
)}

<div className="detalle-card why-card-pro ev-hover-lift">
  <div className="section-title-pro">
    <span>🏆 Confianza</span>
    <h2>¿Por qué elegir este proveedor?</h2>
    <p>Razones que ayudan a tomar una mejor decisión para tu evento.</p>
  </div>

  <div className="why-grid-pro">
    <div>
      <strong>⚡ Respuesta rápida</strong>
      <span>Contacto directo por WhatsApp.</span>
    </div>

    <div>
      <strong>✅ Empresa verificada</strong>
      <span>Información revisada en EVENTIA.</span>
    </div>

    <div>
      <strong>🎉 Experiencia en eventos</strong>
      <span>Servicios orientados a celebraciones y reuniones.</span>
    </div>

    <div>
      <strong>⭐ Opiniones reales</strong>
      <span>Valoraciones de clientes dentro de la plataforma.</span>
    </div>
  </div>
</div>

          <div className="detalle-card detalle-gallery-pro ev-hover-lift">
          <div className="section-title-pro gallery-title-pro">
            <span>📸 Galería</span>
            <h2>Trabajos y eventos realizados</h2>
            <p>Explora fotos reales de sus servicios y experiencias.</p>
          </div>

          <div className="galeria-header">

              <span>
                {galeria.length} fotos
              </span>
            </div>

            {galeria.length === 0 ? (
              <p className="sin-galeria">
                Esta empresa aún no tiene fotos en su galería.
              </p>
            ) : (

<div className={esPremium ? 'premium-gallery-layout' : 'detalle-galeria'}>
  {galeria.slice(0, 5).map((foto, index) => (
    <div
      key={foto.id}
      className={
        esPremium
          ? index === 0
            ? 'premium-gallery-main'
            : 'premium-gallery-small'
          : 'foto-card'
      }
      onClick={() => setFotoActual(index)}
    >
      <img
        src={`${GALERIA_URL}/${foto.imagen}`}
        alt={`Trabajo realizado por ${empresa.nombre_empresa}`}
        loading="lazy"
        decoding="async"
      />

      {esPremium && index === 4 && galeria.length > 5 && (
        <div
          className="gallery-more"
          onClick={(e) => {
            e.stopPropagation();

            const primeraFotoOculta = Math.min(5, galeria.length - 1);

            setFotoActual(primeraFotoOculta);
          }}
        >
          📷 Ver {galeria.length} fotos
        </div>
      )}
    </div>
  ))}
</div>
            )}
          </div>

        </section>

        <aside className="detalle-sidebar">
          <div className="contact-card contact-card-pro">
            <div className="section-title-pro">
              <span>📩 Contacto directo</span>
              <h3>Contactar proveedor</h3>
              <p>Solicita información, disponibilidad o cotización.</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-detalle"
              onClick={registrarClickWhatsapp}
            >
              💬 Contactar por WhatsApp
            </a>
            

            <button
              className="btn-cotizar"
              onClick={()=>
              setMostrarCotizacion(true)
              }
              >
              📨 Solicitar cotización
              </button>
              {mostrarCotizacion && (

              <div className="cotizacion-box">

              <input
              placeholder="Nombre"
              value={nombre}
              onChange={(e)=>
              setNombre(e.target.value)}
              />

              <input
                type="tel"
                placeholder="Celular o Teléfono"
                value={telefono}
                maxLength={9}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, '');
                  setTelefono(valor);
                }}
              />

              <input
              type="date"
              value={fechaEvento}
              onChange={(e)=>
              setFechaEvento(e.target.value)}
              />

              <textarea
              placeholder="Describe tu evento"
              value={mensaje}
              onChange={(e)=>
              setMensaje(e.target.value)}
              />

              <button
                className="btn-enviar-cotizacion"
                onClick={enviarCotizacion}
              >
                📨 Enviar solicitud
              </button>

              </div>

              )}
            <a
              href={`tel:${empresa.telefono}`}
              className="btn-phone"
            >
              📞 Llamar ahora
            </a>
          </div>

          <div className="contact-card">
            <h3>Datos del Proveedor</h3>
            <div className="contact-card">
              <h3>Disponibilidad</h3>

              {disponibilidad.length === 0 ? (
                <p>Este proveedor aún no publicó fechas ocupadas.</p>
              ) : (
                disponibilidad.map((item) => (
                  <div key={item.id} className="disponibilidad-item">
                    <strong>
                      📅 {new Date(item.fecha).toLocaleDateString()}
                    </strong>
                    <span>{item.descripcion}</span>
                  </div>
                ))
              )}
            </div>

            {(empresa.facebook || empresa.instagram || empresa.tiktok || empresa.pagina_web) && (
                <div className="contact-card">
                  <h3>🌐 Redes sociales</h3>

                  <div className="social-links-detalle">
                    {empresa.facebook && (
                      <a href={empresa.facebook} target="_blank" rel="noreferrer">
                        📘 Facebook
                      </a>
                    )}

                    {empresa.instagram && (
                      <a href={empresa.instagram} target="_blank" rel="noreferrer">
                        📸 Instagram
                      </a>
                    )}

                    {empresa.tiktok && (
                      <a href={empresa.tiktok} target="_blank" rel="noreferrer">
                        🎵 TikTok
                      </a>
                    )}

                    {empresa.pagina_web && (
                      <a href={empresa.pagina_web} target="_blank" rel="noreferrer">
                        🌍 Sitio web
                      </a>
                    )}
                  </div>
                </div>
              )}

            <div className="contact-row">
              <span>Teléfono</span>
              <strong>{empresa.telefono}</strong>
            </div>

            <div className="contact-row">
              <span>WhatsApp</span>
              <strong>{empresa.whatsapp}</strong>
            </div>

            <div className="contact-row">
              <span>Ubicación</span>
              <strong>{empresa.distrito}</strong>
            </div>
          </div>
          
          <div className="rating-card">

<h2> ⭐ {promedio} </h2>
<p> {total} valoraciones</p>
<div className="stars">
{[1,2,3,4,5]
.map((n)=>(
<button key={n} onClick={()=>setForm({...form,puntuacion:n})}
className={form.puntuacion>=n ?'active':''}>★
</button>
))}
</div>
{promedio >= 4.5 && total >= 5 && (
<div className="badge-top">
🏆 Proveedor destacado
</div>
)}


<input placeholder="Tu nombre" value={form.nombre_cliente}
onChange={(e)=>
setForm({

...form,

nombre_cliente:
e.target.value

})
}
/>

<textarea placeholder="Comentario" value={form.comentario}
onChange={(e)=>
setForm({

...form,

comentario:
e.target.value

})
}
/>
<button onClick={
enviarValoracion
}

>

Enviar valoración

</button>

</div>

        </aside>

      </main>

    </div>
  );
}