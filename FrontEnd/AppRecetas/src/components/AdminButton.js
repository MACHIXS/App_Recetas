import React, { useEffect, useState } from 'react';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

export default function AdminButton({ navigation }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
  AsyncStorage.getItem('jwt')
    .then(token => {
      console.log('🔑 Token leido en AdminButton:', token);
      if (!token) return;
      const decoded = jwtDecode(token);
      console.log('🔍 Payload decodificado:', decoded);
      // de ahí fíjate si el array viene en decoded.roles, decoded.role, decoded.Rol, etc.
      const roles = decoded.roles || decoded.role;
      if (Array.isArray(roles) && roles.includes('ADMIN')) {
        setIsAdmin(true);
      }
    })
    .catch(console.error);
}, []);

  if (!isAdmin) return null;
  return (
    <Button
      title="Admin"
      onPress={() => navigation.navigate('RegistrosPendientes')}
    />
  );
}
