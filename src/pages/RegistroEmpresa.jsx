import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/registroEmpresa.css';
import { LOGO_EVENTIA } from '../config/logo';
import PasswordInput from '../components/PasswordInput';


export default function RegistroEmpresa() {
  const navigate = useNavigate();
  const FORM_INICIAL = {
    nombre: '',
    email: '',
    password: '',
    nombre_empresa: '',
    descripcion: '',
    telefono: '',
    whatsapp: '',
    direccion: '',
    distrito: '',
    categoria: '',
    logo: null,
    portada: null,
    galeria: [],
    plan: '',
    metodo_pago: '',
    numero_operacion: ''
  }
  const [form, setForm] =useState(FORM_INICIAL);
  const [cargando, setCargando] = useState(false);
  //const [mostrarPassword, setMostrarPassword] =useState(false);
  const [errorPassword, setErrorPassword] = useState('');
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  const registrar = async (e) => {
    e.preventDefault();
    /*validar*/
    if (errorPassword || !form.password) {
  alert('Corrige la contraseña antes de continuar');
  return;
} 
    try {
      setCargando(true);

      await api.post('/auth/register', {
        nombre: form.nombre,
        email: form.email,
        password: form.password
      });

      const login = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      });

      const token = login.data.token;

      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify(login.data.usuario)
      );

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await api.post(
        '/empresas',
        {
          nombre_empresa: form.nombre_empresa,
          descripcion: form.descripcion,
          telefono: form.telefono,
          whatsapp: form.whatsapp,
          direccion: form.direccion,
          distrito: form.distrito,
          categoria: form.categoria,
          plan:form.plan,
          metodo_pago:form.metodo_pago,
          numero_operacion:form.numero_operacion
        },
        config
      );

      if (form.logo) {
        const logoData = new FormData();
        logoData.append('logo', form.logo);

        await api.post(
          '/empresas/logo',
          logoData,
          config
        );
      }

      if (form.portada) {
        const portadaData = new FormData();
        portadaData.append('portada', form.portada);

        await api.post(
          '/empresas/portada',
          portadaData,
          config
        );
      }

      if (form.galeria.length > 0) {
        const galeriaData = new FormData();

        form.galeria.forEach((foto) => {
          galeriaData.append('galeria', foto);
        });

        await api.post(
          '/empresas/galeria',
          galeriaData,
          config
        );
      }

      const confirmado = window.confirm(
`✅ Solicitud enviada correctamente

Tu empresa fue registrada y quedó pendiente de validación del administrador.

Presiona ACEPTAR para volver al inicio.`
);

   if (confirmado) {

    setForm(FORM_INICIAL);
    navigate('/login');
}

    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Error al registrar empresa'
      );

      console.error(error);

    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-page">

      <div className="registro-left">

        <Link to="/" className="registro-brand">
          <img src={LOGO_EVENTIA} alt="Eventia" />

          <div>
            <strong>EVENTIA</strong>
            <span>Proveedores para eventos</span>
          </div>
        </Link>

        <div className="registro-hero-text">
          <h1>
            Publica tu empresa y conecta con nuevos clientes
          </h1>

          <p>
            Registra tu negocio, sube tu logo, portada y fotos.
            Tu empresa será revisada por el administrador antes
            de aparecer en el portal.
          </p>

          <div className="registro-benefits">
            <span>✔ Perfil profesional</span>
            <span>✔ Galería de imágenes</span>
            <span>✔ Contacto directo por WhatsApp</span>
            <span>✔ Aprobación segura</span>
          </div>
        </div>

      </div>

      <div className="registro-right">

        <form
          className="registro-card"
          onSubmit={registrar}
          autoComplete="off"
        >

          <div className="registro-card-header">
            <h2>Registrar empresa</h2>
            <p>
              Completa la información para solicitar la publicación.
            </p>
          </div>

          <div className="form-grid">

            <input
            name="nombre"
            value={form.nombre}
            placeholder="Nombre del representante"
            onChange={handleChange}
            />

            <input
              name="correo_eventia_registro"
              type="email"
              autoComplete="email"
              value={form.email}
              placeholder="Correo de acceso al panel"
              onChange={handleChange}
              required
            />

            <div className="password-wrapper">
                <PasswordInput
                  name="clave_eventia_registro"
                  value={form.password}
                  placeholder="Crea una contraseña segura"
                  autoComplete="new-password"
                  required
                  onChange={(e) => {
                    const valor = e.target.value;

                    setForm((formActual) => ({
                      ...formActual,
                      password: valor
                    }));

                    const regex =
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

                    if (valor === '') {
                      setErrorPassword('');
                    } else if (!regex.test(valor)) {
                      setErrorPassword(
                        'Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.'
                      );
                    } else {
                      setErrorPassword('');
                    }
                  }}
                />

                <small
                  className={
                    errorPassword
                      ? 'password-help password-help-error'
                      : 'password-help'
                  }
                >
                  {errorPassword ||
                    'Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.'}
                </small>
              </div>

            <input
              name="nombre_empresa"
              value={form.nombre_empresa}
              placeholder="Nombre Empresa"
              onChange={handleChange}
            />

            <textarea
              name="descripcion"
              value={form.descripcion}
              placeholder="Descripcion Empresa"
              onChange={handleChange}
              
            />

            <input
              name="telefono"
              type="tel"
              maxLength={7}
              value={form.telefono}
              placeholder="Telefono"
              onChange={(e)=>{
              const valor=
              e.target.value
              .replace(/\D/g,'');
              setForm({
              ...form,
              telefono:
              valor
              .slice(0,7)
                  });
                  }}
            />

            <input
              name="whatsapp"
              type="tel"
              maxLength={9}
              value={form.whatsapp}
              placeholder="Whatsapp"
              onChange={(e)=>{
              const valor=
              e.target.value
              .replace(/\D/g,'');
              setForm({
              ...form,
              whatsapp:
              valor
              .slice(0,9)
              });
                  }}
              />

            <input
              name="direccion"
              value={form.direccion}
              placeholder="Direccion"
              onChange={handleChange}
              
            />

            <input
              name="distrito"
              value={form.distrito}
              placeholder="Distrito"
              onChange={handleChange}
              
            />

            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              
            >
              <option value="">Selecciona categoría</option>
              <option value="DJ">🎵 DJ</option>
              <option value="Barman">🍸 Barman</option>
              <option value="Catering">🍽 Catering</option>
              <option value="Local de Eventos">🏛 Local de Eventos</option>
              <option value="Fotografía">📸 Fotografía</option>
              <option value="Decoración">🎨 Decoración</option>
              <option value="Spa">💄 Belleza / Spa</option>
              <option value="Hora Loca">🎭 Hora Loca</option>
              <option value="Eventos">🎪 Eventos</option>
              <option value="Wedding Planner">💍 Wedding Planner</option>
              <option value="Maestro Ceremonia">🎤 Maestro Ceremonia</option>
              <option value="Orquesta Digital">🎼 Orquesta Digital</option>
              <option value="Alquiler de Mobiliario">🪑 Alquiler de Mobiliario</option>
              <option value="Seguridad">🛡️ Seguridad</option>
              <option value="Transporte">🚐 Transporte</option>
              <option value="Manicure-Pedicure">💅 Manicure-Pedicure / Spa</option>
              <option value="Cabina360">📸Cabina360</option>
              <option value="Shows Infantiles">🎈 Show Infantiles</option>
            </select>

          </div>

          <div className="upload-section">

  <label className="upload-card">
    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        setForm({
          ...form,
          logo: e.target.files[0]
        })
      }
    />

    <span className="upload-icon">🖼️</span>
    <strong>Logo de la empresa</strong>
    <small>
      {form.logo
        ? form.logo.name
        : 'Sube tu logo en JPG o PNG'}
    </small>
  </label>

  <label className="upload-card">
    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        setForm({
          ...form,
          portada: e.target.files[0]
        })
      }
    />

    <span className="upload-icon">🌄</span>
    <strong>Portada de la empresa</strong>
    <small>
      {form.portada
        ? form.portada.name
        : 'Imagen principal del perfil'}
    </small>
  </label>

  <label className="upload-card upload-card-full">
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => {
        const archivos =
          Array.from(e.target.files).slice(0, 5);

        setForm({
          ...form,
          galeria: archivos
        });
      }}
    />

    <span className="upload-icon">📸</span>
    <strong>Galería de imágenes</strong>
    <small>
      {form.galeria.length > 0
        ? `${form.galeria.length} imagen(es) seleccionada(s)`
        : 'Máximo 5 fotos de tus servicios'}
    </small>
  </label>

</div>
 
<div className="planes-section">

  <div className="planes-header">
    <h3>Elige tu Plan EVENTIA</h3>
    <p>
      Selecciona el Plan que mejor se adapta a la Visibilidad que quieres para tu Empresa.
    </p>
  </div>

  <div className="planes-grid">

    <label className={form.plan === 'BASICO' ? 'plan-card active' : 'plan-card'}>
      <input
        type="radio"
        name="plan"
        value="BASICO"
        onChange={handleChange}
      />

      <span className="plan-name">Básico</span>
      <h4>S/ 29.90</h4>
      <p className="plan-desc">Ideal para empezar a publicar tu empresa.</p>

      <ul>
        <li>✔ Perfil público</li>
        <li>✔ Logo y portada</li>
        <li>✔ Hasta 5 fotos</li>
        <li>✔ Recibe cotizaciones</li>
      </ul>
      
      <div className="plan-result">
      📈 Aproximadamente 10–20 contactos al mes
      </div>

    </label>

    <label className={form.plan === 'PRO' ? 'plan-card active recommended' : 'plan-card recommended'}>
      <input
        type="radio"
        name="plan"
        value="PRO"
        onChange={handleChange}
      />

      <div className="plan-badge">Recomendado</div>

      <span className="plan-name">Pro</span>
      <h4>S/ 59.90</h4>
      <p className="plan-desc">Mayor visibilidad para conseguir más Clientes.</p>

      <ul>
        <li>✔ Todo lo del Básico</li>
        <li>✔ Mejor posición en búsquedas</li>
        <li>✔ Estadísticas del perfil</li>
        <li>✔ Más oportunidades de contacto</li>
      </ul>

      <div className="plan-result">
      🔥 Aproximadamente 30–50 contactos al mes
      </div>
    </label>

    <label className={form.plan === 'PREMIUM' ? 'plan-card active' : 'plan-card'}>
      <input
        type="radio"
        name="plan"
        value="PREMIUM"
        onChange={handleChange}
      />

      <span className="plan-name">Premium</span>
      <h4>S/ 99.90</h4>
      <p className="plan-desc">Para Empresas que quieren Destacar en EVENTIA.</p>

      <ul>
        <li>✔ Todo lo del Pro</li>
        <li>✔ Empresa destacada en Home</li>
        <li>✔ Prioridad en categorías</li>
        <li>✔ Perfil con mayor visibilidad</li>
      </ul>
      <div className="plan-result">
      🚀 Aproximadamente 60–100 contactos al mes
      </div>
    </label>
  </div>

  </div>


<div className="payment-section">
    <div className="payment-section">
    <h2>💳 Forma de Pago</h2>
    <select
    name="metodo_pago"
    value={form.metodo_pago}
    onChange={handleChange}
    className="payment-select"
    required
    >
    <option value="">
    Selecciona un medio de pago &nbsp;
    </option>
      <option value="YAPE">
      💜 Yape
      </option>

      <option value="PLIN">
      💙 Plin
      </option>

      <option value="TRANSFERENCIA">
      💳 Transferencia bancaria
      </option>

    </select>
<div className="resumen-section">

<h3> Resumen de tu suscripción</h3>
<div className="resumen-card">
<div className="resumen-row">
<span>Plan elegido</span>
<strong>
{form.plan || '-'}
</strong>
</div>
<div className="resumen-row">
<span>Duración</span>
<strong> 30 días </strong>
</div>
<div className="resumen-row total">
<span>Total</span>
<strong>
{
form.plan==='BASICO'
?'S/29.90':
form.plan==='PRO'
?'S/59.90':
form.plan==='PREMIUM'
?'S/99.90':
'S/0'
} </strong>
</div>
<hr/>
<div className="resumen-beneficios">
<div>
✔ Perfil publicado
</div>
<div>
✔ Recibir cotizaciones
</div>
<div>
✔ Panel empresa
</div>
<div>
✔ Renovación mensual
</div>
</div>
</div>
</div>

<input
name="numero_operacion"
placeholder="Número de operación"
value={form.numero_operacion}
onChange={handleChange}
required
/>
</div>

  <div className="payment-info">
    <p><strong>Yape / Plin:</strong> 934557415</p>
    <p><strong>Banco:</strong> BCP - Cuenta 19429679225013 / Cuenta Interbancaria 00219412967922501399</p>
    <p>Tu empresa será publicada después de validar el pago.</p>
  </div>

</div>
          <button
            className="btn-registro"
            disabled={cargando}
          >
            {cargando
              ? 'Registrando...'
              : 'Enviar solicitud'}
          </button>

          <Link to="/" className="volver-inicio">
            ← Volver al inicio
          </Link>

        </form>

      </div>

    </div>
  );
}