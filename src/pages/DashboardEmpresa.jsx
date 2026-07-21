import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerMiEmpresa } from '../services/dashboardService';
import { actualizarEmpresa } from '../services/empresaDashboardService';
import '../styles/dashboard.css';
import api from '../services/api';
import { LOGO_EVENTIA } from '../config/logo';
import {obtenerCotizaciones,actualizarEstadoCotizacion}from '../services/cotizacionService';
import {obtenerDisponibilidad,crearDisponibilidad,eliminarDisponibilidad} from'../services/disponibilidadService';
import {obtenerEstadisticas} from '../services/estadisticasService';
import {obtenerMiSuscripcion,obtenerHistorialSuscripciones}from '../services/SuscripcionService';
import { CATEGORY_COVERS } from '../config/categoryCovers';
import {LOGOS_URL,PORTADAS_URL,GALERIA_URL,VIDEOS_URL} from '../config/urls';

export default function DashboardEmpresa() {
  const navigate =useNavigate();
  const [empresa,setEmpresa] =useState(null);
  const [cargandoEmpresa, setCargandoEmpresa] = useState(true);
  const [errorEmpresa, setErrorEmpresa] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [nuevasFotos, setNuevasFotos] = useState([]);
  const [cotizaciones,setCotizaciones]=useState([]);
  const [disponibilidad,setDisponibilidad]=useState([]);
  const [fechaReserva,setFechaReserva]=useState('');
  const [descripcionReserva,setDescripcionReserva]=useState('');
  const [estadisticas,setEstadisticas]=useState({visitas:0,clicks_whatsapp:0,cotizaciones:0,valoracion:0});
  const [suscripcion,setSuscripcion]=useState(null);
  const [historialSuscripciones, setHistorialSuscripciones] = useState([]);
  const [tab,setTab]=useState('empresa');
  const [galeria, setGaleria] = useState([]);
  const [videoPremium, setVideoPremium] = useState(null);

  useEffect(() => {
    cargarEmpresa();
  }, []);

 const cargarEmpresa = async () => {

  try {

    setCargandoEmpresa(true);
    setErrorEmpresa('');

    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const data = await obtenerMiEmpresa();

    if (!data.success || !data.empresa) {

      setEmpresa(null);

      setErrorEmpresa(
        'No existe una empresa asociada a esta cuenta.'
      );

      return;

    }

    setEmpresa({
      ...data.empresa,

      usa_portada_eventia:
        data.empresa.usa_portada_eventia === true ||
        data.empresa.usa_portada_eventia === 1 ||
        data.empresa.usa_portada_eventia === '1'
    });

    const [

      gal,
      disp,
      cot,
      stats,
      sub,
      hist

    ] = await Promise.all([

      api.get(`/empresas/${data.empresa.id}/galeria`),

      obtenerDisponibilidad(data.empresa.id),

      obtenerCotizaciones(),

      obtenerEstadisticas(),

      obtenerMiSuscripcion(),

      obtenerHistorialSuscripciones()

    ]);

    setGaleria(gal.data.fotos || []);

    setDisponibilidad(disp.disponibilidad || []);

    setCotizaciones(cot.cotizaciones || []);

    setEstadisticas(stats.estadisticas || {
      visitas:0,
      clicks_whatsapp:0,
      cotizaciones:0,
      valoracion:0
    });

    setSuscripcion(sub.suscripcion || null);

    setHistorialSuscripciones(
      hist.suscripciones || []
    );

  }

  catch(error){

    console.error(error);

    if(error.response?.status===401){

      localStorage.removeItem('token');

      navigate('/login');

      return;

    }

    setErrorEmpresa(
      error.response?.data?.message ||
      'No se pudo cargar el Dashboard.'
    );

  }

  finally{

    setCargandoEmpresa(false);

  }

};

const handleChange = (e) => {
  const { name, value } = e.target;

  setEmpresa((empresaActual) => ({
    ...empresaActual,
    [name]: value
  }));
};
  
  const guardar = async () => {
  if (!/^\d{7}$/.test(empresa.telefono || '')) {
    alert('El teléfono debe tener exactamente 7 dígitos.');
    return;
  }

  if (!/^9\d{8}$/.test(empresa.whatsapp || '')) {
    alert(
      'El WhatsApp debe comenzar con 9 y tener exactamente 9 dígitos.'
    );
    return;
  }

  try {
    setGuardando(true);

    await actualizarEmpresa({
      ...empresa,
      usa_portada_eventia:
        empresa.usa_portada_eventia ? 1 : 0
    });

    alert('Empresa actualizada correctamente');
    await cargarEmpresa();
  } catch (error) {
    alert(
      error.response?.data?.message ||
      'No se pudo actualizar la empresa.'
    );
  } finally {
    setGuardando(false);
  }
};

/*disponibilidad*/
const agregarFecha =async ()=>{await crearDisponibilidad(fechaReserva,descripcionReserva);
const data =await obtenerDisponibilidad(empresa.id);
setDisponibilidad(data.disponibilidad);
setFechaReserva('');
setDescripcionReserva('');
};
const eliminarFecha =async (id)=>{
await eliminarDisponibilidad(id);
setDisponibilidad(prev=>prev.filter(f=>f.id!==id));
};  
/*estado cotizacion */ 
  const cambiarEstado =async (id,estado)=>{
  await actualizarEstadoCotizacion(id,estado);
  const cot =await obtenerCotizaciones();
  setCotizaciones(cot.cotizaciones);
  };
//permisos empresas
if (cargandoEmpresa) {

  return (

    <div className="dashboard-page">

      <h2>Cargando información...</h2>

    </div>

  );

}

if (errorEmpresa) {

  return (

    <div className="dashboard-page">

      <h2>Error</h2>

      <p>{errorEmpresa}</p>

      <button
        onClick={cargarEmpresa}
      >

        Reintentar

      </button>

    </div>

  );

}

if (!empresa) {

  return (

    <div className="dashboard-page">

      <h2>No existe empresa</h2>

      <p>

        Debes registrar una empresa primero.

      </p>

    </div>

  );

}
 //planes empresa
 const permisos = {
  esBasico: empresa?.plan === 'BASICO',
  esPro: empresa?.plan === 'PRO',
  esPremium: empresa?.plan === 'PREMIUM',

  puedeUsarRedes:
    Boolean(Number(empresa?.redes_sociales)),

  puedeUsarPaginaWeb:
    Boolean(Number(empresa?.permite_pagina_web)),

  puedeSubirVideo:
    Boolean(Number(empresa?.permite_video)),

  puedeVerEstadisticas:
    Boolean(Number(empresa?.permite_estadisticas)),

  puedeSerDestacado:
    Boolean(Number(empresa?.permite_destacado)),

  tienePrioridadBusqueda:
    Boolean(Number(empresa?.prioridad_busqueda)),

  tieneSoportePreferente:
    Boolean(Number(empresa?.soporte_preferente)),

  maxFotos:
    Math.max(0, Number(empresa?.max_fotos) || 7)
};

/*subir galeria */
const subirGaleria = async () => {
  if (empresa.estado !== 'ACTIVO') {
    alert(
      'Tu empresa debe estar activa para cambiar la galería.'
    );
    return;
  }

  if (nuevasFotos.length === 0) {
    alert('Selecciona al menos una imagen.');
    return;
  }

  const disponibles =
    permisos.maxFotos - galeria.length;

  if (nuevasFotos.length > disponibles) {
    alert(
      `Solo puedes subir ${disponibles} foto(s) adicionales.`
    );
    return;
  }

  try {
    const formData = new FormData();

    nuevasFotos.forEach((foto) => {
      formData.append('galeria', foto);
    });

    await api.post('/empresas/galeria', formData);

    const galeriaActualizada = await api.get(
      `/empresas/${empresa.id}/galeria`
    );

    setGaleria(
      galeriaActualizada.data.fotos || []
    );
    setNuevasFotos([]);

    alert('Galería actualizada correctamente.');
  } catch (error) {
    alert(
      error.response?.data?.message ||
      'No se pudo actualizar la galería.'
    );
  }
};
  

const usaPortadaEventia =
  empresa?.usa_portada_eventia === true ||
  empresa?.usa_portada_eventia === 1 ||
  empresa?.usa_portada_eventia === '1';

const portadaEventia =
  CATEGORY_COVERS[empresa?.categoria] || CATEGORY_COVERS.default;

const portadaPersonalizada =
  empresa?.portada
   
    ? `${PORTADAS_URL}/${empresa.portada}`
    : portadaEventia;

const portadaPreview =
  usaPortadaEventia
    ? portadaEventia
    : portadaPersonalizada;

  return (
    <div className="dashboard-page">
       <div className="dashboard-topbar">
        {suscripcion && (

          <div className="suscripcion-card">
                <div>
                <span>PLAN ACTUAL</span>
                <h3> { suscripcion.plan} </h3>
                <p> Vence:{ new Date( suscripcion.fecha_fin).toLocaleDateString()}</p>
                </div>
          <div>
          <div className={ suscripcion.estado==='ACTIVA' ? 'badge-plan':'badge-plan-off'}>
              { suscripcion.estado }
          </div>

    <h3> { suscripcion.dias_restantes } días </h3>
    <p> restantes </p>
    {suscripcion.dias_restantes <= 7 && (
    <button
      className="btn-renovar-dashboard"
      onClick={() => navigate('/planes')}>
      Renovar ahora
    </button> 
    )}
  </div>
</div>)}

<div className="historial-card">
      <h2>Historial de Suscripciones</h2>
      {historialSuscripciones.length === 0 ? (
        <p>No tienes suscripciones registradas.</p>
      ) : (
        historialSuscripciones.map((s) => (
          <div key={s.id} className="historial-item">
                <strong>{s.plan}</strong>
                <span>{s.estado}</span>
                <p>
                  {new Date(s.fecha_inicio).toLocaleDateString()} - {' '}
                  {new Date(s.fecha_fin).toLocaleDateString()}
                </p>
          </div> ))
  )}
</div>
   
<div className="dashboard-logo-row">

  <Link to="/" className="dashboard-brand">
    <img src={LOGO_EVENTIA} alt="Eventia"/>

    <div>
      <strong>EVENTIA</strong>
      <span>Proveedores para tu Evento</span>
    </div>
  </Link>

  <Link
    to="/"
    className="btn-home-dashboard"
  >
    ← Ir al Inicio
  </Link>

</div>
</div>

      <div className="dashboard-header">
        <h1>Panel de Empresa</h1>
        <p>Administra la Información Pública de tu Negocio.</p>
      </div>

<div className="dashboard-tabs">
      <button
      className={tab==='empresa'?'tab active':'tab'}
      onClick={()=>setTab('empresa')}
      >
      🏢 Mi empresa
      </button>

      <button
      className={tab==='galeria'?'tab active':'tab'}
      onClick={()=>setTab('galeria')}
      >
      🖼 Galería
      </button>

      <button
      className={tab==='config'?'tab active':'tab'}
      onClick={()=>setTab('config')}
      >
      ⚙ Configuración
      </button>
</div>
      <div className="stats-grid">
      <div className="stat-card">
      <div className="stat-icon">
      👁
      </div>
          <div>
            <h2>{ estadisticas.visitas}</h2>
            <p> Visitas al Perfil </p>
          </div>
      </div>

<div className="stat-card">
  <div className="stat-icon">
  💬
  </div>
<div>
  <h2>
  {estadisticas.clicks_whatsapp}</h2>
  <p>Clicks WhatsApp</p>
</div>
</div>
<div className="stat-card">
<div className="stat-icon">
📨
</div>
<div>
<h2>{estadisticas.cotizaciones}</h2>
<p>Cotizaciones</p>
</div>
</div>

<div className="stat-card">
<div className="stat-icon">
⭐
</div>
<div>
<h2>{estadisticas.valoracion}</h2>
<p>Valoración Promedio</p>
</div>
</div>
</div>

{tab === 'galeria' && (
  <div className="galeria-dashboard-section">

    <h2>Galería de imágenes</h2>

    <div className="limite-plan-box">
  <strong>
    Plan actual: {empresa.plan || 'BASICO'}
  </strong>

  <p>
    Has usado {galeria.length} de {permisos.maxFotos} fotos disponibles.
  </p>
</div>

    {empresa.estado === 'ACTIVO' ? (
  <>
    <p>
      Puedes actualizar las fotos de tu empresa. Máximo{' '}
      {permisos.maxFotos} imágenes según tu plan.
    </p>

    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      multiple
      disabled={galeria.length >= permisos.maxFotos}
      onChange={(e) => {
        const disponibles =
          permisos.maxFotos - galeria.length;

        const archivos = Array.from(
          e.target.files || []
        );

        const tiposPermitidos = [
          'image/jpeg',
          'image/png',
          'image/webp'
        ];

        const archivosValidos = archivos.filter(
          (archivo) => {
            const formatoValido =
              tiposPermitidos.includes(archivo.type);

            const pesoValido =
              archivo.size <= 5 * 1024 * 1024;

            return formatoValido && pesoValido;
          }
        );

        if (
          archivosValidos.length !== archivos.length
        ) {
          alert(
            'Solo se permiten imágenes JPG, PNG o WebP de máximo 5 MB.'
          );
        }

        setNuevasFotos(
          archivosValidos.slice(0, disponibles)
        );
      }}
    />

    <button
      type="button"
      onClick={subirGaleria}
      disabled={galeria.length >= permisos.maxFotos}
    >
      {galeria.length >= permisos.maxFotos
        ? 'Límite de fotos alcanzado'
        : 'Subir nuevas fotos'}
    </button>

    <div className="galeria-preview">
      {galeria.length === 0 ? (
        <p>No tienes imágenes en tu galería.</p>
      ) : (
        galeria.map((foto) => (
          <div
            key={foto.id}
            className="galeria-item"
          >
            <img
              src={`${GALERIA_URL}/${foto.imagen}`}
              alt={`Trabajo de ${empresa.nombre_empresa}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  CATEGORY_COVERS.default;
              }}
            />

            <button
              type="button"
              onClick={async () => {
                const confirmar = window.confirm(
                  '¿Deseas eliminar esta imagen?'
                );

                if (!confirmar) return;

                try {
                  await api.delete(
                    `/empresas/galeria/${foto.id}`
                  );

                  setGaleria((actual) =>
                    actual.filter(
                      (item) => item.id !== foto.id
                    )
                  );
                } catch (error) {
                  alert(
                    error.response?.data?.message ||
                    'No se pudo eliminar la imagen.'
                  );
                }
              }}
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  </>
) : (
  <div className="galeria-bloqueada">
    Tu empresa aún está pendiente de aprobación.
    Podrás cambiar la galería cuando esté ACTIVA.
  </div>
)}
      

    <div className="video-premium-dashboard">
  <h2>🎥 Video Premium</h2>

  {permisos.puedeSubirVideo ? (
    <>
      <p>
        Sube un video corto en formato MP4 para destacar tu empresa.
      </p>

      <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={(e) => {
              const archivo = e.target.files?.[0];

              if (!archivo) {
                setVideoPremium(null);
                return;
              }

              const tiposPermitidos = [
                'video/mp4',
                'video/webm',
                'video/quicktime'
              ];

              if (!tiposPermitidos.includes(archivo.type)) {
                alert('Solo se permiten videos MP4, WebM o MOV.');
                e.target.value = '';
                setVideoPremium(null);
                return;
              }

              if (archivo.size > 50 * 1024 * 1024) {
                alert('El video no puede superar los 50 MB.');
                e.target.value = '';
                setVideoPremium(null);
                return;
              }

              setVideoPremium(archivo);
            }}
          />

      <button
        type="button"
        onClick={async () => {
              if (!videoPremium) {
                alert('Selecciona un video.');
                return;
              }

              try {
                const formData = new FormData();
                formData.append('video', videoPremium);

                await api.post('/empresas/video', formData);

                alert(
                  'Video subido correctamente. Quedará pendiente de aprobación.'
                );

                setVideoPremium(null);
                await cargarEmpresa();
              } catch (error) {
                alert(
                  error.response?.data?.message ||
                  'No se pudo subir el video.'
                );
              }
            }}
        
      >
        Subir video
      </button>
      {empresa?.video && (
  <div className="video-preview-dashboard">

    <h3>🎬 Video actual</h3>

    <video
      className="dashboard-video"
      controls
      preload="metadata"
      src={`${VIDEOS_URL}/${empresa.video}`}
      
    >
      Tu navegador no soporta video HTML5.
    </video>

  </div>
)}
    </>
  ) : (

    
    <div className="upgrade-box">
      <h3>🎥 Video Premium</h3>
      <p>Disponible únicamente para empresas con plan Premium.</p>
      <button type="button" onClick={() => navigate('/planes')}>
        Actualizar a Premium
      </button>
    </div>
  )}
</div>

  </div>

  
)}



 {tab === 'config' && (   
<div className="dashboard-bottom">

  <div className="cotizaciones-card">
    <h2>Solicitudes recibidas</h2>

    {cotizaciones.length === 0 ? (
      <p>Todavía no tienes solicitudes.</p>
    ) : (
      cotizaciones.map((c) => (
        <div key={c.id} className="cotizacion-item">
          <div className="cotizacion-top">
            <h4>{c.nombre_cliente}</h4>
            <span className={`estado-${c.estado.toLowerCase()}`}>
              {c.estado}
            </span>
          </div>

          <p>📞 {c.telefono}</p>
          <p>📅 {new Date(c.fecha_evento).toLocaleDateString()}</p>
          <p>💬 {c.mensaje}</p>

          <div className="cotizacion-actions">
            <button onClick={() => cambiarEstado(c.id, 'CONTACTADO')}>
              Contactado
            </button>

            <button onClick={() => cambiarEstado(c.id, 'CERRADO')}>
              Cerrar
            </button>
          </div>
        </div>
      ))
    )}
  </div>

  <div className="agenda-card">
    <h2>Calendario de disponibilidad</h2>

    <div className="agenda-form">
      <input
        type="date"
        value={fechaReserva}
        onChange={(e) => setFechaReserva(e.target.value)}
      />

      <input
        placeholder="Descripción"
        value={descripcionReserva}
        onChange={(e) => setDescripcionReserva(e.target.value)}
      />

      <button onClick={agregarFecha}>
        Agregar
      </button>
    </div>

    <div className="agenda-list">
      {disponibilidad.map((item) => (
        <div key={item.id} className="agenda-item">
          <div>
            <strong>
              {new Date(item.fecha).toLocaleDateString()}
            </strong>

            <p>{item.descripcion}</p>
          </div>

          <button onClick={() => eliminarFecha(item.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>

</div>
 )}
 {tab === 'empresa' && (
      <div className="dashboard-card">

        <div className="preview-section">
          <img
            src={portadaPreview}
            alt={empresa.nombre_empresa}
            className="dashboard-portada"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = CATEGORY_COVERS.default;
            }}
          />

          <img
            className="preview-logo"
            src={
            empresa.logo
      
      ? `${LOGOS_URL}/${empresa.logo}`
      : 'https://placehold.co/200x200?text=Logo'
  }
  alt="Logo"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src=LOGO_EVENTIA;
   
  }}
/>

          <h2>{empresa.nombre_empresa}</h2>
          <span>{empresa.categoria}</span>
        </div>

        <div className="form-section">

          <label>Nombre de la empresa</label>
          <input
            name="nombre_empresa"
            value={empresa.nombre_empresa || ''}
            onChange={handleChange}
          />

          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={empresa.descripcion || ''}
            onChange={handleChange}
          />

          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={empresa.telefono || ''}
            maxLength={7}
            inputMode="numeric"
            onChange={(e) => {
              const valor = e.target.value
                .replace(/\D/g, '')
                .slice(0, 7);

              handleChange({
                target: {
                  name: 'telefono',
                  value: valor
                }
              });
            }}
          />

          <label>WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            value={empresa.whatsapp || ''}
            maxLength={9}
            inputMode="numeric"
            onChange={(e) => {
              const valor = e.target.value
                .replace(/\D/g, '')
                .slice(0, 9);

              handleChange({
                target: {
                  name: 'whatsapp',
                  value: valor
                }
              });
            }}
          />

          <label>Dirección</label>
          <input
            name="direccion"
            value={empresa.direccion || ''}
            onChange={handleChange}
          />

          <label>Distrito</label>
          <input
            name="distrito"
            value={empresa.distrito || ''}
            onChange={handleChange}
          />

          <label>Categoría</label>
          <input
            name="categoria"
            value={empresa.categoria || ''}
            onChange={handleChange}
          />

          {permisos.puedeUsarRedes ? (
  <>
    <label>Facebook</label>
    <input
      name="facebook"
      value={empresa.facebook || ''}
      onChange={handleChange}
      placeholder="https://facebook.com/tuempresa"
    />

    <label>Instagram</label>
    <input
      name="instagram"
      value={empresa.instagram || ''}
      onChange={handleChange}
      placeholder="https://instagram.com/tuempresa"
    />

    <label>TikTok</label>
    <input
      name="tiktok"
      value={empresa.tiktok || ''}
      onChange={handleChange}
      placeholder="https://tiktok.com/@tuempresa"
    />

    <label>Página Web (Opcional)</label>
      <input
        name="pagina_web"
        value={empresa.pagina_web || ''}
        placeholder="https://www.miempresa.com"
        onChange={(e) =>
          setEmpresa({
            ...empresa,
            pagina_web: e.target.value
          })
        }
      />
  </>

) : (
  <div className="upgrade-box">
    <h3>⭐ Función Pro</h3>
    <p>Actualiza tu plan para agregar Facebook, Instagram y TikTok.</p>

    <button
      type="button"
      onClick={() => navigate('/planes')}
    >
      Actualizar plan
    </button>
  </div>
)}

{permisos.puedeUsarPaginaWeb ? (
  <>
    <label>Página web (opcional)</label>

    <input
      name="pagina_web"
      value={empresa.pagina_web || ''}
      placeholder="https://www.miempresa.com"
      onChange={handleChange}
    />
  </>
) : (
  <div className="upgrade-box">
    <h3>🌐 Página web</h3>
    <p>Tu plan actual no incluye la publicación de una página web.</p>

    <button
      type="button"
      onClick={() => navigate('/planes')}
    >
      Mejorar plan
    </button>
  </div>
)}



<div className="appearance-card">

  <div className="appearance-header">
    <div>
      <span>🎨 Apariencia del Perfil</span>
      <h3>Personaliza cómo verán tu empresa</h3>
      <p>
        Elige una portada oficial de EVENTIA o usa tu propia imagen personalizada.
      </p>
    </div>
  </div>

  <div className="cover-options">

    <button
      type="button"
      className={
        empresa.usa_portada_eventia
          ? 'cover-option active'
          : 'cover-option'
      }
      onClick={() =>
        setEmpresa({
          ...empresa,
          usa_portada_eventia: true
        })
      }
    >
      <div>
        <strong>🎨 Portada EVENTIA</strong>
        <span>Recomendada según tu categoría</span>
      </div>

      {empresa.usa_portada_eventia && (
        <b>✓</b>
      )}
    </button>

    <button
      type="button"
      className={
        !empresa.usa_portada_eventia
          ? 'cover-option active'
          : 'cover-option'
      }
      onClick={() =>
        setEmpresa({
          ...empresa,
          usa_portada_eventia: false
        })
      }
    >
      <div>
        <strong>🖼 Mi portada</strong>
        <span>Usa una imagen personalizada</span>
      </div>

      {!empresa.usa_portada_eventia && (
        <b>✓</b>
      )}
    </button>

  </div>

  <div className="profile-preview-title">
    Así verán tu empresa los clientes
  </div>

  <div className="cover-preview premium-preview">
    <img
  key={portadaPreview}
  src={portadaPreview}
  alt="Vista previa portada"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = portadaEventia;
  }}
/>

    <div className="preview-overlay" />

    <div className="preview-profile-info">
      <img
        src={
          empresa.logo
            ? `${LOGOS_URL}/${empresa.logo}`
            : '/logo.png'
        }
        alt="Logo"
      />

      <div>
        <h4>{empresa.nombre_empresa}</h4>
        <span>{empresa.categoria}</span>
      </div>
    </div>

    <div className="preview-badge">
      {usaPortadaEventia
  ? '🎨 Portada EVENTIA'
  : '🖼 Portada personalizada'}
    </div>
  </div>

</div>

          <button onClick={guardar} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </button>

        </div>

      </div>
 )}
    </div>
 
  );
}

