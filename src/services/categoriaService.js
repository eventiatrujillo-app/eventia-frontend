import api from './api';

export const obtenerCategorias = async () => {
  const res = await api.get('/categorias/admin');
  return res.data;
};

export const crearCategoria = async (categoria) => {
  const res = await api.post('/categorias', categoria);
  return res.data;
};

export const actualizarCategoria = async (id, categoria) => {
  const res = await api.put(`/categorias/${id}`, categoria);
  return res.data;
};

export const cambiarEstadoCategoria = async (id, estado) => {
  const res = await api.put(`/categorias/${id}/estado`, {
    estado
  });

  return res.data;
};


export const obtenerCategoriasPublicas = async () => {
  const res = await api.get('/categorias');
  return res.data;
};