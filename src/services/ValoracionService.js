import api from './api';

export const obtenerValoraciones =
async (empresaId) => {

const res =
await api.get(
`/empresas/${empresaId}/valoraciones`
);

return res.data;

};

export const crearValoracion =
async (
empresaId,
datos
) => {

const res =
await api.post(
`/empresas/${empresaId}/valoraciones`,
datos
);

return res.data;

};