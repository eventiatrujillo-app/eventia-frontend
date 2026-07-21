import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/resetPassword.css';
import { LOGO_EVENTIA } from '../config/logo';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [cargando, setCargando] = useState(false);

  const cambiar = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!token) {
      alert('El enlace de recuperación no es válido.');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert(
        'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.'
      );
      return;
    }

    try {
      setCargando(true);

      const respuesta = await api.post('/auth/reset-password', {
        token,
        password
      });

      if (!respuesta.data?.success) {
        throw new Error('No se pudo actualizar la contraseña');
      }

      alert('Contraseña actualizada correctamente.');

      navigate('/login', {
        replace: true
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          'Error al cambiar la contraseña.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="reset-page">
      <form className="reset-card" onSubmit={cambiar}>
        <img
          src={LOGO_EVENTIA}
          alt="EVENTIA"
          className="reset-logo"
        />

        <h1>Nueva contraseña</h1>

        <div className="password-box">
          <input
            type={mostrar ? 'text' : 'password'}
            placeholder="Nueva contraseña"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="toggle-password"
            onClick={() => setMostrar((actual) => !actual)}
            aria-label={
              mostrar
                ? 'Ocultar contraseña'
                : 'Mostrar contraseña'
            }
          >
            {mostrar ? '🙈' : '👁'}
          </button>
        </div>

        <small>
          Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.
        </small>

        <button
          type="submit"
          disabled={cargando}
        >
          {cargando
            ? 'Actualizando...'
            : 'Cambiar contraseña'}
        </button>
      </form>
    </div>
  );
}