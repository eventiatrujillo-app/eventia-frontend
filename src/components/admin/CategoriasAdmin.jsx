import { useMemo, useState } from 'react';
import './CategoriasAdmin.css';

const formularioInicial = {
  nombre: '',
  slug: '',
  icono: '🎉',
  portada: '',
  estado: 'ACTIVA',
  orden: 0
};

export default function CategoriasAdmin({
  categorias = [],
  onCrear,
  onActualizar,
  onCambiarEstado
}) {
  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState(formularioInicial);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const categoriasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return categorias;

    return categorias.filter((categoria) =>
      categoria.nombre?.toLowerCase().includes(texto) ||
      categoria.slug?.toLowerCase().includes(texto)
    );
  }, [categorias, busqueda]);

  const crearSlug = (nombre) =>
    String(nombre || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleNombre = (e) => {
    const nombre = e.target.value;

    setForm((actual) => ({
      ...actual,
      nombre,
      slug: categoriaEditando ? actual.slug : crearSlug(nombre)
    }));
  };

  const limpiarFormulario = () => {
    setForm(formularioInicial);
    setCategoriaEditando(null);
  };

  const editarCategoria = (categoria) => {
    setCategoriaEditando(categoria.id);

    setForm({
      nombre: categoria.nombre || '',
      slug: categoria.slug || '',
      icono: categoria.icono || '🎉',
      portada: categoria.portada || '',
      estado: categoria.estado || 'ACTIVA',
      orden: Number(categoria.orden || 0)
    });

    document
      .getElementById('form-categoria')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      alert('Ingresa el nombre de la categoría.');
      return;
    }

    if (!form.slug.trim()) {
      alert('Ingresa el slug de la categoría.');
      return;
    }

    try {
      setGuardando(true);

      const datos = {
        ...form,
        nombre: form.nombre.trim(),
        slug: crearSlug(form.slug),
        orden: Number(form.orden || 0)
      };

      if (categoriaEditando) {
        await onActualizar(categoriaEditando, datos);
      } else {
        await onCrear(datos);
      }

      limpiarFormulario();
    } catch (error) {
      console.error('Error guardando categoría:', error);
      alert(
        error?.response?.data?.message ||
        'No se pudo guardar la categoría.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const alternarEstado = async (categoria) => {
    const nuevoEstado =
      categoria.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';

    const confirmar = window.confirm(
      `¿Deseas cambiar la categoría "${categoria.nombre}" a ${nuevoEstado}?`
    );

    if (!confirmar) return;

    await onCambiarEstado(categoria.id, nuevoEstado);
  };

  return (
    <section className="categorias-admin">
      <div className="categorias-admin-header">
        <div>
          <span>📂 Catálogo</span>
          <h2>Gestión de categorías</h2>
          <p>
            Crea, edita, ordena y activa los servicios disponibles en EVENTIA.
          </p>
        </div>

        <div className="categorias-counter">
          {categorias.length}
          <small>categorías</small>
        </div>
      </div>

      <div className="categorias-admin-layout">
        <form
          id="form-categoria"
          className="categoria-form"
          onSubmit={guardarCategoria}
        >
          <div className="categoria-form-title">
            <h3>
              {categoriaEditando
                ? '✏ Editar categoría'
                : '➕ Nueva categoría'}
            </h3>

            {categoriaEditando && (
              <button
                type="button"
                className="categoria-cancelar"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}
          </div>

          <label>Nombre</label>
          <input
            type="text"
            value={form.nombre}
            onChange={handleNombre}
            placeholder="Ej. Wedding Planner"
          />

          <label>Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug: crearSlug(e.target.value)
              })
            }
            placeholder="wedding-planner"
          />

          <div className="categoria-form-row">
            <div>
              <label>Ícono</label>
              <input
                type="text"
                value={form.icono}
                onChange={(e) =>
                  setForm({
                    ...form,
                    icono: e.target.value
                  })
                }
                placeholder="🎉"
              />
            </div>

            <div>
              <label>Orden</label>
              <input
                type="number"
                min="0"
                value={form.orden}
                onChange={(e) =>
                  setForm({
                    ...form,
                    orden: e.target.value
                  })
                }
              />
            </div>
          </div>

          <label>Nombre del archivo de portada</label>
          <input
            type="text"
            value={form.portada}
            onChange={(e) =>
              setForm({
                ...form,
                portada: e.target.value
              })
            }
            placeholder="wedding-planner.jpg"
          />

          <label>Estado</label>
          <select
            value={form.estado}
            onChange={(e) =>
              setForm({
                ...form,
                estado: e.target.value
              })
            }
          >
            <option value="ACTIVA">Activa</option>
            <option value="INACTIVA">Inactiva</option>
          </select>

          <button
            type="submit"
            className="categoria-guardar"
            disabled={guardando}
          >
            {guardando
              ? 'Guardando...'
              : categoriaEditando
                ? 'Guardar cambios'
                : 'Crear categoría'}
          </button>
        </form>

        <div className="categorias-listado">
          <div className="categorias-toolbar">
            <div>
              <h3>Categorías registradas</h3>
              <p>{categoriasFiltradas.length} resultados</p>
            </div>

            <input
              type="search"
              placeholder="Buscar categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {categoriasFiltradas.length === 0 ? (
            <div className="categorias-empty">
              No se encontraron categorías.
            </div>
          ) : (
            <div className="categorias-grid">
              {categoriasFiltradas.map((categoria) => (
                <article
                  key={categoria.id}
                  className="categoria-item"
                >
                  <div className="categoria-icono">
                    {categoria.icono || '🎉'}
                  </div>

                  <div className="categoria-info">
                    <div className="categoria-title-row">
                      <h4>{categoria.nombre}</h4>

                      <span
                        className={
                          categoria.estado === 'ACTIVA'
                            ? 'categoria-estado activa'
                            : 'categoria-estado inactiva'
                        }
                      >
                        {categoria.estado}
                      </span>
                    </div>

                    <p>/{categoria.slug}</p>

                    <div className="categoria-meta">
                      <span>Orden: {categoria.orden}</span>
                      <span>
                        Portada: {categoria.portada || 'Sin portada'}
                      </span>
                    </div>
                  </div>

                  <div className="categoria-actions">
                    <button
                      type="button"
                      onClick={() => editarCategoria(categoria)}
                    >
                      ✏ Editar
                    </button>

                    <button
                      type="button"
                      className={
                        categoria.estado === 'ACTIVA'
                          ? 'desactivar'
                          : 'activar'
                      }
                      onClick={() => alternarEstado(categoria)}
                    >
                      {categoria.estado === 'ACTIVA'
                        ? '🚫 Desactivar'
                        : '✅ Activar'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}