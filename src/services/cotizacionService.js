import api from './api';

export const obtenerCotizaciones =
async ()=>{

const token =
localStorage.getItem(
'token'
);

const response =
await api.get(
'/empresas/mis-cotizaciones',
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

return response.data;

};

export const actualizarEstadoCotizacion =
async (
id,
estado
)=>{

const token =
localStorage.getItem(
'token'
);

const response =
await api.put(
`/empresas/cotizaciones/${id}/estado`,
{
estado
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