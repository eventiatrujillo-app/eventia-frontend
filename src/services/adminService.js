import api from './api';

/*********************************** */
export const obtenerPendientes = async () => {

const token =
localStorage.getItem('token');

const response =
await api.get(
'/admin/empresas/pendientes',
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

return response.data;

};
/******************************* */
export const aprobarEmpresa =
async(id)=>{

const token =
localStorage.getItem('token');

await api.put(
`/admin/empresas/${id}/aprobar`,
{},
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

};
/******************************* */
export const rechazarEmpresa =
async(id)=>{

const token =
localStorage.getItem('token');

await api.put(
`/admin/empresas/${id}/rechazar`,
{},
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

};
/***************************************************** */
export const obtenerPagosPendientes =
async () => {const res =await api.get('/admin/pagos/pendientes');
return res.data;};
/****************************************************** */

/******************************************************/
export const aprobarPago = async (pagoId) => {
  const token = localStorage.getItem('token');

  const response = await api.put(
    `/admin/pagos/${pagoId}/aprobar`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};
/*********************************************************/

/*********************************************************/
export const obtenerSuscripciones = async () => {
  const res = await api.get('/admin/suscripciones');
  return res.data;
};
/***********************************************************/
export const obtenerDashboardAdmin = async () => {
  const res = await api.get('/admin/dashboard');
  return res.data;
};
export const listarEmpresasAdmin = async () => {
  const res = await api.get('/admin/empresas');
  return res.data;
};
/**************************************************************/
export const obtenerActividadReciente = async () => {
  const res = await api.get('/admin/actividad');
  return res.data;
};
/**********************************************************/
export const obtenerVideosPendientes = async () => {
  const res = await api.get('/admin/videos-pendientes');
  return res.data;
};

export const aprobarVideoAdmin = async (id) => {
  const res = await api.put(`/admin/videos/${id}/aprobar`);
  return res.data;
};

export const rechazarVideoAdmin = async (id) => {
  const res = await api.put(`/admin/videos/${id}/rechazar`);
  return res.data;
};
/**************************************************************/
export const obtenerPlanesAdmin = async () => {
  const res = await api.get('/admin/planes');
  return res.data;
};

export const actualizarPlanAdmin = async (id, plan) => {
  const res = await api.put(`/admin/planes/${id}`, plan);
  return res.data;
};
/************************************************************/
export const suspenderEmpresaAdmin = async (id) => {
  const res = await api.put(`/admin/empresas/${id}/suspender`);
  return res.data;
};

export const reactivarEmpresaAdmin = async (id) => {
  const res = await api.put(`/admin/empresas/${id}/reactivar`);
  return res.data;
};