import { useState } from 'react';
import './PlanesAdmin.css';

export default function PlanesAdmin({ planes, onGuardar }) {
  const [editando, setEditando] = useState(null);

  const cambiar = (id, campo, valor) => {
    setEditando((prev) => ({
      ...prev,
      [campo]: valor
    }));
  };

  return (
    <section className="planes-admin">
      <div className="planes-admin-header">
        <div>
          <h2>💳 Gestión de planes</h2>
          <p>Configura precios, duración y beneficios de cada plan.</p>
        </div>
      </div>

      <div className="planes-admin-grid">
        {planes.map((plan) => {
          const actual = editando?.id === plan.id ? editando : plan;

          return (
            <div key={plan.id} className="plan-admin-card">
              <div className="plan-admin-title">
                <span>{actual.icono || '⭐'}</span>
                <h3>{actual.nombre}</h3>
              </div>

              <label>Precio</label>
              <input
                type="number"
                value={actual.precio || ''}
                onChange={(e) => {
                  const nuevo = { ...actual, precio: e.target.value };
                  setEditando(nuevo);
                }}
              />

              <label>Duración días</label>
              <input
                type="number"
                value={actual.duracion_dias || ''}
                onChange={(e) => {
                  const nuevo = { ...actual, duracion_dias: e.target.value };
                  setEditando(nuevo);
                }}
              />

              <label>Máx. fotos</label>
              <input
                type="number"
                value={actual.max_fotos || ''}
                onChange={(e) => {
                  const nuevo = { ...actual, max_fotos: e.target.value };
                  setEditando(nuevo);
                }}
              />

              <label>Descripción</label>
              <textarea
                value={actual.descripcion || ''}
                onChange={(e) => {
                  const nuevo = { ...actual, descripcion: e.target.value };
                  setEditando(nuevo);
                }}
              />

              <div className="plan-checks">
                {[
                  ['activo', 'Activo'],
                  ['permite_video', 'Video'],
                  ['estadisticas', 'Estadísticas'],
                  ['destacado', 'Destacado'],
                  ['prioridad_busqueda', 'Prioridad'],
                  ['redes_sociales', 'Redes'],
                  ['pagina_web', 'Página web'],
                  ['soporte_preferente', 'Soporte']
                ].map(([campo, label]) => (
                  <label key={campo}>
                    <input
                      type="checkbox"
                      checked={Boolean(Number(actual[campo]))}
                      onChange={(e) => {
                        const nuevo = {
                          ...actual,
                          [campo]: e.target.checked ? 1 : 0
                        };
                        setEditando(nuevo);
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <button
                onClick={async () => {
                  await onGuardar(actual.id, actual);
                  setEditando(null);
                }}
              >
                Guardar cambios
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}