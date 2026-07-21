import './EmpresasAdmin.css';
import { useMemo, useState } from 'react';
import { LOGOS_URL } from '../../config/urls';

export default function EmpresasAdmin({ empresas, onSuspender, onReactivar }) {
const [busqueda, setBusqueda] = useState('');
const [filtroPlan, setFiltroPlan] = useState('');
const [filtroEstado, setFiltroEstado] = useState('');
const [menuAbierto, setMenuAbierto] = useState(null);

const empresasFiltradas = useMemo(() => {
  return empresas.filter((empresa) => {
    const texto = busqueda.toLowerCase();

    const coincideBusqueda =
      empresa.nombre_empresa?.toLowerCase().includes(texto) ||
      empresa.categoria?.toLowerCase().includes(texto) ||
      empresa.distrito?.toLowerCase().includes(texto);

    const coincidePlan =
      filtroPlan === '' || empresa.plan === filtroPlan;

    const coincideEstado =
      filtroEstado === '' || empresa.estado === filtroEstado;

    return coincideBusqueda && coincidePlan && coincideEstado;
  });
}, [empresas, busqueda, filtroPlan, filtroEstado]);

  return (
    <div className="admin-table-card">

      <div className="admin-table-header">
  <div>
    <h2>Empresas registradas</h2>
    <p>{empresasFiltradas.length} resultados</p>
  </div>

  <div className="admin-filters">
    <input
      type="text"
      placeholder="Buscar empresa..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
    />

    <select value={filtroPlan} onChange={(e) => setFiltroPlan(e.target.value)}>
      <option value="">Todos los planes</option>
      <option value="BASICO">Basico</option>
      <option value="PRO">PRO</option>
      <option value="PREMIUM">Premium</option>
      
    </select>

    <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
      <option value="">Todos los estados</option>
      <option value="ACTIVO">Activo</option>
      <option value="INACTIVO">Inactivo</option>
    </select>
  </div>
</div>

      <table className="admin-table">

        <thead>
          <tr>
            <th>Logo</th>
            <th>Empresa</th>
            <th>Categoría</th>
            <th>Distrito</th>
            <th>Plan</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {empresasFiltradas.map((empresa) => (

            <tr key={empresa.id}>

              <td>
                <img
                  src={`${LOGOS_URL}/${empresa.logo}`}
                  className="admin-logo"
                  alt=""
                />
              </td>

              <td>{empresa.nombre_empresa}</td>

              <td>{empresa.categoria}</td>

              <td>{empresa.distrito}</td>

              <td>

                <span className={`badge-plan ${empresa.plan?.toLowerCase()}`}>
                  {empresa.plan || 'BÁSICO'}
                </span>

              </td>

              <td>{empresa.estado}</td>

              <td>

                <div className="admin-actions-menu">
  <button
    type="button"
    className="menu-trigger"
    onClick={() =>
      setMenuAbierto(menuAbierto === empresa.id ? null : empresa.id)
    }
  >
    ⋮
  </button>

  {menuAbierto === empresa.id && (
    <div className="menu-dropdown">
      <a
        href={`/empresa/${empresa.id}`}
        target="_blank"
        rel="noreferrer"
      >
        👁 Ver perfil
      </a>

      <button type="button">
        ✏ Editar empresa
      </button>

      <button type="button">
        👑 Cambiar plan
      </button>

      {empresa.estado === 'ACTIVO' ? (
        <button
          type="button"
          className="danger"
          onClick={() => onSuspender(empresa.id)}
        >
          🚫 Suspender
        </button>
      ) : (
        <button
          type="button"
          className="success"
          onClick={() => onReactivar(empresa.id)}
        >
          ✅ Reactivar
        </button>
      )}
    </div>
  )}
</div>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );

}