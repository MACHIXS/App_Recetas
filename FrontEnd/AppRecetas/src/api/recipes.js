import client from './client';

//const BASE = 'http://192.168.0.242:8080/api/recetas';

export const getRecetas = ()     => client.get('/recetas');

export const getTipos = ()       => client.get('/tiposReceta');

export const getIngredientes = () => client.get('/ingredientes');

export const getRecetasPorIngrediente = nombre =>
  client.get(`/recetas/ingrediente?nombre=${encodeURIComponent(nombre)}`);

export const getRecetasSinIngrediente =nombre => 
  client.get(`/recetas/sin-ingrediente?nombre=${encodeURIComponent(nombre)}`);

export const getRecetasPorUsuario = nickname =>
  client.get(`/recetas/usuario?nickname=${encodeURIComponent(nickname)}`);

export const getRecetaDetalle = id =>
  client.get(`/recetas/${id}`);

export const createReceta = (dto) =>
  client.post('/recetas',dto);

export const getMyRecetas = () =>
  client.get('/recetas/mias');  

export const aprobarReceta = id =>
  client.patch(`/recetas/${id}/aprobar`);

export const calificarReceta = (idReceta, calificacion, comentarios) =>
  client.post(`/recetas/${idReceta}/calificar`, { calificacion, comentarios });

export const getPendingRatings = () =>
  client.get('/calificaciones/pendientes');

export const approveRating = id =>
  client.patch(`/calificaciones/${id}/aprobar`);

export const rejectRating = id =>
  client.delete(`/calificaciones/${id}/rechazar`);

export const guardarReceta         = id => client.post(`/lista/${id}`);

export const eliminarRecetaGuardada = id => client.delete(`/lista/${id}`);

export const getRecetasGuardadas   = () => client.get('/lista');