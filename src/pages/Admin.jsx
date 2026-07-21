import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';
import {
  obtenerPendientes,
  rechazarEmpresa,
  obtenerPagosPendientes,
  aprobarPago,
  obtenerSuscripciones,
  obtenerDashboardAdmin,
  listarEmpresasAdmin,
  obtenerActividadReciente,
  obtenerVideosPendientes,
  aprobarVideoAdmin,
  rechazarVideoAdmin,
  obtenerPlanesAdmin,
  actualizarPlanAdmin,
  suspenderEmpresaAdmin,
  reactivarEmpresaAdmin,
} from '../services/adminService';

import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  cambiarEstadoCategoria
} from '../services/categoriaService';

import AdminDashboard from '../components/admin/AdminDashboard';
import EmpresasAdmin from '../components/admin/EmpresasAdmin';
import ActividadReciente from '../components/admin/ActividadReciente';
import VideosAdmin from '../components/admin/VideosAdmin';
import PlanesAdmin from '../components/admin/PlanesAdmin';
import CategoriasAdmin from '../components/admin/CategoriasAdmin';

export default function Admin() {
  const navigate = useNavigate();

  const [empresasPendientes, setEmpresasPendientes] = useState([]);
  const [empresasAdmin, setEmpresasAdmin] = useState([]);
  const [stats, setStats] = useState({});
  const [cargando, setCargando] = useState(true);
  const [pagos, setPagos] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [videosPendientes, setVideosPendientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario || usuario.rol !== 'ADMIN') {
      navigate('/admin-login');
      return;
    }

    cargarTodo();
  }, [navigate]);

  const cargarTodo = async () => {
    try {
      const dashData = await obtenerDashboardAdmin();
      setStats(dashData.data || {});

      const adminData = await listarEmpresasAdmin();
      setEmpresasAdmin(adminData.empresas || []);

      const pendientesData = await obtenerPendientes();
      setEmpresasPendientes(pendientesData.empresas || []);

      const pagosData = await obtenerPagosPendientes();
      setPagos(pagosData.pagos || []);

      const actividadData = await obtenerActividadReciente();
      setActividades(actividadData.actividades || []);

      const videosData = await obtenerVideosPendientes();
      console.log('VIDEOS PENDIENTES ADMIN:', videosData);
      setVideosPendientes(videosData.videos || []);

      const planesData = await obtenerPlanesAdmin();
      setPlanes(planesData.planes || []);

      const categoriasData = await obtenerCategorias();
      setCategorias(categoriasData.categorias || []);

      const susData = await obtenerSuscripciones();
      setSuscripciones(susData.suscripciones || []);
    } catch (error) {
      console.error(error);
      alert('Error cargando panel administrador');
    } finally {
      setCargando(false);
    }
  };

  const rechazar = async (id) => {
    await rechazarEmpresa(id);
    cargarTodo();
  };

  const salir = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('adminAuth');
    navigate('/admin-login');
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2>EVENTIA</h2>
        <p>Panel administrador</p>

        <nav>
          <a>Dashboard</a>
          <a>Empresas</a>
          <a>Pagos</a>
          <a>Planes</a>
        </nav>

        <button onClick={salir}>Cerrar sesión</button>
      </aside>

      <main className="admin-main">
        <AdminDashboard stats={stats} />

        <ActividadReciente actividades={actividades} />

        <VideosAdmin
          videos={videosPendientes}
          onAprobar={async (id) => {
            await aprobarVideoAdmin(id);
            alert('Video aprobado');
            cargarTodo();
          }}
          onRechazar={async (id) => {
            await rechazarVideoAdmin(id);
            alert('Video rechazado');
            cargarTodo();
          }}
        />

        <PlanesAdmin
          planes={planes}
          onGuardar={async (id, plan) => {
            await actualizarPlanAdmin(id, plan);
            alert('Plan actualizado');
            cargarTodo();
          }}
        />

        <CategoriasAdmin
          categorias={categorias}
          onCrear={async (categoria) => {
            await crearCategoria(categoria);
            alert('Categoría creada correctamente');
            await cargarTodo();
          }}
          onActualizar={async (id, categoria) => {
            await actualizarCategoria(id, categoria);
            alert('Categoría actualizada correctamente');
            await cargarTodo();
          }}
          onCambiarEstado={async (id, estado) => {
            await cambiarEstadoCategoria(id, estado);
            alert(`Categoría ${estado.toLowerCase()} correctamente`);
            await cargarTodo();
          }}
        />

        <EmpresasAdmin
          empresas={empresasAdmin}
          onSuspender={async (id) => {
            await suspenderEmpresaAdmin(id);
            alert('Empresa suspendida');
            cargarTodo();
          }}
          onReactivar={async (id) => {
            await reactivarEmpresaAdmin(id);
            alert('Empresa reactivada');
            cargarTodo();
          }}
        />

        <header className="admin-header">
          <div>
            <h1>Empresas pendientes</h1>
            <p>Valida el pago y aprueba la publicación de proveedores.</p>
          </div>

          <div className="admin-counter">
            {empresasPendientes.length}
            <span>Pendientes</span>
          </div>
        </header>

        <section className="admin-section">
          <h2>Pagos pendientes</h2>

          {pagos.length === 0 ? (
            <p>No hay pagos pendientes.</p>
          ) : (
            pagos.map((pago) => (
              <div key={pago.id} className="admin-card">
                <h3>{pago.nombre_empresa}</h3>

                <p><strong>Plan:</strong> {pago.plan}</p>
                <p><strong>Monto:</strong> S/ {pago.monto}</p>
                <p><strong>Método:</strong> {pago.metodo_pago}</p>
                <p><strong>N° operación:</strong> {pago.numero_operacion}</p>
                <p><strong>Categoría:</strong> {pago.categoria}</p>
                <p><strong>Distrito:</strong> {pago.distrito}</p>

                <button
                  className="approve-btn"
                  onClick={async () => {
                    await aprobarPago(pago.id);
                    alert('Empresa activada');
                    cargarTodo();
                  }}
                >
                  Aprobar pago y activar
                </button>
              </div>
            ))
          )}
        </section>

        <section className="admin-section">
          <h2>Suscripciones activas</h2>

          {suscripciones.map((s) => (
            <div key={s.id} className="admin-card">
              <h3>{s.nombre_empresa}</h3>
              <p><strong>Plan:</strong> {s.plan}</p>
              <p><strong>Inicio:</strong> {new Date(s.fecha_inicio).toLocaleDateString()}</p>
              <p><strong>Fin:</strong> {new Date(s.fecha_fin).toLocaleDateString()}</p>

              <div className={s.dias_restantes <= 7 ? 'vencimiento danger' : 'vencimiento'}>
                {s.dias_restantes > 0 ? `${s.dias_restantes} días restantes` : 'VENCIDA'}
              </div>
            </div>
          ))}
        </section>

        {cargando ? (
          <div className="admin-empty">Cargando empresas...</div>
        ) : empresasPendientes.length === 0 ? (
          <div className="admin-empty">
            <h3>No hay empresas pendientes</h3>
            <p>Todas las solicitudes han sido revisadas.</p>
          </div>
        ) : (
          <div className="admin-grid">
            {empresasPendientes.map((emp) => (
              <div key={emp.id} className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <span className="status-badge">{emp.estado}</span>
                    <h2>{emp.nombre_empresa}</h2>
                    <p>{emp.descripcion}</p>
                  </div>
                </div>

                <div className="admin-info-grid">
                  <div>
                    <span>Email</span>
                    <strong>{emp.email}</strong>
                  </div>

                  <div>
                    <span>Categoría</span>
                    <strong>{emp.categoria}</strong>
                  </div>

                  <div>
                    <span>Distrito</span>
                    <strong>{emp.distrito}</strong>
                  </div>

                  <div>
                    <span>WhatsApp</span>
                    <strong>{emp.whatsapp}</strong>
                  </div>
                </div>

                <div className="payment-box">
                  <h3>Información de pago</h3>

                  <div className="payment-grid">
                    <div>
                      <span>Plan</span>
                      <strong>{emp.plan || 'No registrado'}</strong>
                    </div>

                    <div>
                      <span>Monto</span>
                      <strong>S/ {emp.monto || '0.00'}</strong>
                    </div>

                    <div>
                      <span>Método</span>
                      <strong>{emp.metodo_pago || 'No registrado'}</strong>
                    </div>

                    <div>
                      <span>N° operación</span>
                      <strong>{emp.numero_operacion || 'No registrado'}</strong>
                    </div>

                    <div>
                      <span>Estado pago</span>
                      <strong>{emp.estado_pago || 'PENDIENTE'}</strong>
                    </div>
                  </div>
                </div>

                <div className="admin-actions">
                  <button
                    className="approve-btn"
                    disabled={!emp.pago_id}
                    onClick={async () => {
                      await aprobarPago(emp.pago_id);
                      cargarTodo();
                    }}
                  >
                    Confirmar pago y activar empresa
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => rechazar(emp.id)}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}