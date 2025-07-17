import client from './client';

export const getSedes = () =>
  client.get('/sedes');

export const getCursos = () =>
  client.get('/cursos');

//export const getCronogramas = () =>
  //client.get('/cronogramas');

export const getCronogramasPorCurso  = id => 
  client.get(`/cronogramas/curso/${id}`);

export const inscribirCurso = id =>
  client.post(`/inscripciones/${id}`);


export const getInscripciones =
 () => client.get('/inscripciones');

 
export const cancelarInscripcion = id =>
  client.delete(`/inscripciones/${id}`);