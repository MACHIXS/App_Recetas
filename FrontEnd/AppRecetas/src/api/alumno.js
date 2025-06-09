import client from './client';

export const upgradeToAlumno = async ({
  numeroTarjeta,
  fechaVencimientoTarjeta,
  codigoSeguridadTarjeta,
  tramite,
  dniFrenteUri,
  dniFondoUri,
}) => {
  const form = new FormData();
  form.append('numeroTarjeta', numeroTarjeta);
  form.append('fechaVencimientoTarjeta', fechaVencimientoTarjeta);
  form.append('codigoSeguridadTarjeta', codigoSeguridadTarjeta);
  form.append('tramite', tramite);
  form.append('dniFrente', { uri: dniFrenteUri, name: 'frente.jpg', type: 'image/jpeg' });
  form.append('dniFondo',  { uri: dniFondoUri,  name: 'fondo.jpg',  type: 'image/jpeg' });

  const { data } = await client.post(
    '/auth/upgrade-alumno',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};
