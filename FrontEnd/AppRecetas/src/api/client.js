import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const client = axios.create({
  baseURL: 'http://172.20.10.9:8080/api', //IP/backend
});

client.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
