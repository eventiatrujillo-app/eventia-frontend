import api from './api';

export const obtenerEstadisticas =
async ()=>{

const token =
localStorage.getItem(
'token'
);

const response =
await api.get(
'/empresas/estadisticas',
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

return response.data;

};