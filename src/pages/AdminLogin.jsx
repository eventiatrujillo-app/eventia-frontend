import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LOGO_EVENTIA } from '../config/logo';
import '../styles/adminLogin.css';
import api from '../services/api';
import PasswordInput from '../components/PasswordInput';


export default function AdminLogin() {

  const navigate = useNavigate();

  const FORM_INICIAL = {usuario: '',password: ''};
  const [form, setForm] =useState(FORM_INICIAL);
  const [error, setError] =useState('');
  useEffect(() => {
    localStorage.removeItem('adminAuth');
    setForm(FORM_INICIAL);}, []);

  /*ingresar */
  const ingresar = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await api.post('/auth/login', {
      email: form.usuario,
      password: form.password
    });

    if (res.data.usuario.rol !== 'ADMIN') {
      setError('No tienes permisos de administrador');
      return;
    }

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
    navigate('/admin');

  } catch (error) {
    setError('Usuario o contraseña incorrectos');
  }
};

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
      e.target.value
    });

  };

  return (

<div className="admin-login-page">
<div className="admin-login-overlay" />

<div className="admin-login-card">

<Link to="/" className="admin-logo" >
<img src={LOGO_EVENTIA} alt="Eventia"/>

<div>
  <strong> EVENTIA </strong>
  <span>
  Panel administrador
  </span>
</div>
</Link>

<h1>Acceso seguro</h1>
<p> Ingresa tus credenciales para administrar empresas y validar pagos.</p>

<form onSubmit={ingresar} autoComplete="off">
<label>Usuario</label>
<input
type="text" name="usuario"
value={form.usuario}
placeholder="Ingresa usuario"
autoComplete="off"
onChange={handleChange}
required
/>

<label> Contraseña </label>
<PasswordInput
  name="password"
  value={form.password}
  placeholder="Ingresa contraseña"
  autoComplete="current-password"
  onChange={handleChange}
  required
/>

{error && (
<div className="admin-error">
{error}
</div>
)}
<button>Ingresar</button>
</form>

<Link
to="/"
className="admin-back"
>
← Volver al inicio
</Link>

</div>

</div>

);

}