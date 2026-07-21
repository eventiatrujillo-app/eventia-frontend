const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3001/api';

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  API_URL.replace(/\/api\/?$/, '');

export const UPLOADS_URL =
  import.meta.env.VITE_UPLOADS_URL ||
  `${SERVER_URL}/uploads`;

export const LOGOS_URL = `${UPLOADS_URL}/logos`;
export const PORTADAS_URL = `${UPLOADS_URL}/portadas`;
export const GALERIA_URL = `${UPLOADS_URL}/galeria`;
export const VIDEOS_URL = `${UPLOADS_URL}/videos`;

export { API_URL, SERVER_URL };