import client from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1) Iniciar registro
export const iniciarRegistro = ({ mail, nickname }) =>
  client.post('/auth/registro/iniciar', { mail, nickname });

// 2) Finalizar registro
export const finalizarRegistro = ({ token, nombre, apellido, password, fechaNacimiento }) =>
  client.post('/auth/registro/finalizar', { token, nombre, apellido, password, fechaNacimiento });

// 3) Login
//export const login = async ({ mail, password }) => {
//  const { data } = await client.post('/auth/login', { mail, password });
//  await AsyncStorage.setItem('jwt', data.token);
//  return data;
//};

export function login(credentials) {
  // devolvemos TODO lo que responda /auth/login: { token, nickname, alumno }
  return client
    .post('/auth/login', credentials)
    .then(res => res.data);
}

// 4) Solicitar recuperación de contraseña
export const requestPasswordReset = ({ mail }) =>
  client.post('/auth/password-reset/request', { mail });

// 5) Confirmar recuperación de contraseña
export const confirmPasswordReset = ({ token, newPassword }) =>
  client.post('/auth/password-reset/confirm', { token, newPassword });
