import api from './api';

export const obtenerMiSuscripcion = async () => {
  const token = localStorage.getItem('token');

  const response = await api.get('/empresas/mi-suscripcion', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const obtenerHistorial=
async()=>{ const res=await api.get('/empresas/historial-suscripciones');
return res.data;
};

export const obtenerHistorialSuscripciones = async () => {
  const token = localStorage.getItem('token');

  const res = await api.get('/empresas/historial-suscripciones', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};