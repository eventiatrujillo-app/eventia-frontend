import api from './api';

export const actualizarEmpresa = async (data) => {

  const token =
    localStorage.getItem('token');

  const response =
    await api.put(
      '/empresas/mi-empresa',
      data,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  return response.data;

};