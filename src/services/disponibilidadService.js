import api from './api';

export const obtenerDisponibilidad =
async (empresaId) => {

const response =
await api.get(
`/empresas/${empresaId}/disponibilidad`
);

return response.data;

};

export const crearDisponibilidad =
async (fecha, descripcion) => {

const token =
localStorage.getItem(
'token'
);

const response =
await api.post(
'/empresas/disponibilidad',
{
fecha,
descripcion
},
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

return response.data;

};

export const eliminarDisponibilidad =
async (id)=>{

const token=
localStorage.getItem(
'token'
);

await api.delete(
`/empresas/disponibilidad/${id}`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

};