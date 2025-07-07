import client from './client';

export const getRecetas = ()     => client.get('/recetas');

export const getTipos = ()       => client.get('/tiposReceta');

export const getIngredientes = () => client.get('/ingredientes');

export const getRecetasPorIngrediente = nombre =>
  client.get(`/recetas/ingrediente?nombre=${encodeURIComponent(nombre)}`);

export const getRecetaDetalle = id =>
  client.get(`/recetas/${id}`);