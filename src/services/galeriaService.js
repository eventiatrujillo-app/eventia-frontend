import api from './api';

export const obtenerGaleria = async (empresaId) => {

  const response = await api.get(
    `/empresas/${empresaId}/galeria`
  );

  return response.data;
};