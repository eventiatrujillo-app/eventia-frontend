import api from './api';

export const obtenerMiEmpresa = async () => {

  const token = localStorage.getItem('token');

  const response = await api.get(
    '/empresas/mi-empresa',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};