import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/login.css';
import { LOGO_EVENTIA } from '../config/logo';
import PasswordInput from '../components/PasswordInput';



export default function Login() {
  const navigate = useNavigate();
  const FORM_INICIAL = { email: '',password: '' }
  const [form,setForm]=useState(FORM_INICIAL);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const ingresar = async (e) => {e.preventDefault();
    try {
      setCargando(true);
      const response =await api.post('/auth/login',
        {
          email: form.email,
          password: form.password
        });
  

  if (!response.data.token) {
  alert('No llegó token');
  return;}
  localStorage.setItem('token',response.data.token);
  localStorage.setItem('user',JSON.stringify(
  response.data.usuario));

  navigate('/dashboard');
}
catch(error){
console.log(error.response?.data);
alert(error.response?.data?.message
|| 'Error login');
}
finally{setCargando(false);}
};

  return (
    <div className="login-page">

      <div className="login-left">

        <Link to="/" className="login-brand">
          <img src={LOGO_EVENTIA} alt="Eventia" />

          <div>
            <strong>EVENTIA</strong>
            <span>Proveedores para eventos</span>
          </div>
        </Link>

        <div className="login-text">
          <h1>
            Accede a tu Panel de Empresa
          </h1>

          <p>
            Administra tu perfil, actualiza tus datos,
            sube imágenes y mantén tu negocio visible
            para nuevos clientes.
          </p>

          <div className="login-benefits">
            <span>✔ Gestiona tu empresa</span>
            <span>✔ Actualiza logo y portada</span>
            <span>✔ Sube fotos de tus servicios</span>
            <span>✔ Recibe contactos por WhatsApp</span>
          </div>
        </div>

      </div>

      <div className="login-right">

        <form
          className="login-card"
          onSubmit={ingresar}
          autoComplete="off"
        >

          <div className="login-card-header">
            <img src={LOGO_EVENTIA} alt="Eventia" />

            <h2>Iniciar Sesión</h2>

            <p>
              Ingresa tus credenciales para continuar.
            </p>
          </div>

          <label>
            Correo electrónico
          </label>

          <input
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            placeholder="Ingresa tu correo"
            onChange={handleChange}
            required
          />
        
          <div className="login-password-field">
            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="forgot-password">
            <button
            type="button"
            onClick={()=>
            navigate('/recuperar-password')}
            >
            ¿Olvidaste tu contraseña?
            </button>
            </div>

          <button
            className="btn-login-submit"
            disabled={cargando}
          >
            {cargando
              ? 'Ingresando...'
              : 'Ingresar'}
          </button>

          <div className="login-links">
            <Link to="/">
              ← Volver al inicio
            </Link>

            <Link to="/registro-empresa">
              Registrar mi empresa
            </Link>
          </div>

        </form>

      </div>

    </div>
  );
}