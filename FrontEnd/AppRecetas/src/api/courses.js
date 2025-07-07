import client from './client';

export const getSedes = () =>
  client.get('/sedes');

export const getCursos = () =>
  client.get('/cursos');

export const getCronogramas = () =>
  client.get('/cronogramas');

export const getCronogramasPorCurso = idCurso =>
  client.get(`/cronogramas/curso/${idCurso}`);

export const inscribirCurso = idCronograma =>
  client.post(`/inscripciones/${idCronograma}`);

export const getMisInscripciones = () =>
  client.get('/inscripciones');

export const cancelarInscripcion = idInscripcion =>
  client.delete(`/inscripciones/${idInscripcion}`);
