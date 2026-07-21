import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';
import { LOGO_EVENTIA } from '../config/logo';
import '../styles/pagoPlan.css';

export default function PagoPlan() {
  const { plan } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    metodo_pago: '',
    numero_operacion: ''
  });

  const [cargando, setCargando] = useState(false);

  const enviar = async () => {
    if (!form.metodo_pago || !form.numero_operacion) {
      alert('Completa el medio de pago y número de operación');
      return;
    }

    try {
      setCargando(true);

      const token = localStorage.getItem('token');

      await api.post(
        '/empresas/renovar-plan',
        {
          plan,
          metodo_pago: form.metodo_pago,
          numero_operacion: form.numero_operacion
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Pago enviado correctamente. Quedará pendiente de aprobación y activo en un maximo de 24 horas.');

      navigate('/dashboard');

    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Error al enviar pago'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pago-page">
      <div className="pago-card">

        <Link to="/" className="pago-brand">
          <img src={LOGO_EVENTIA} alt="Eventia" />
          <strong>EVENTIA</strong>
        </Link>

        <h1>Finalizar compra</h1>
        <h2>Plan {plan}</h2>

        <div className="medio-pago">
          <p><strong>💜 Yape / Plin:</strong> 934557415</p>
          <p><strong>💳 BCP:</strong> 296-79225013 / cci:00219412967922501399</p>
        </div>

        <label>Medio de pago</label>
        <select
          value={form.metodo_pago}
          onChange={(e) =>
            setForm({
              ...form,
              metodo_pago: e.target.value
            })
          }
        >
          <option value="">Selecciona medio de pago</option>
          <option value="YAPE">💜 Yape</option>
          <option value="PLIN">💙 Plin</option>
          <option value="TRANSFERENCIA">💳 Transferencia</option>
        </select>

        <label>Número de operación</label>
        <input
          value={form.numero_operacion}
          placeholder="Ej: 123456789"
          onChange={(e) =>
            setForm({
              ...form,
              numero_operacion: e.target.value
            })
          }
        />

        <button onClick={enviar} disabled={cargando}>
          {cargando ? 'Enviando...' : 'Enviar pago'}
        </button>

        <Link to="/planes" className="volver-plan">
          ← Volver a planes
        </Link>

      </div>
    </div>
  );
}