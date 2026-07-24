import { API_URL } from '../config/urls';

export const obtenerEmpresas = async () => {
  const response = await fetch(`${API_URL}/empresas`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar las empresas');
  }

  return response.json();
};

export const obtenerEmpresaPorId = async (id) => {
  const response = await fetch(`${API_URL}/empresas/${id}`);

  if (!response.ok) {
    throw new Error('No se pudo cargar la empresa');
  }

  return response.json();
};
// NUEVA FUNCIÓN
export const obtenerEmpresaPorSlug = async (slug) => {
  const response = await fetch(`${API_URL}/empresas/slug/${slug}`);

  if (!response.ok) {
    throw new Error('No se pudo cargar la empresa');
  }

  return response.json();
};