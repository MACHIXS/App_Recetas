// AppRecetas/screens/ProfileScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import colors from '../theme/colors';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading]   = useState(true);
  const [token, setToken]       = useState(null);
  const [mail, setMail]         = useState('');
  const [nickname, setNickname] = useState('');
  const [isAlumno, setIsAlumno] = useState(false);
  const [isAdmin, setIsAdmin]   = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  // 1) Carga inicial de token y datos de usuario
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      (async () => {
        const t = await AsyncStorage.getItem('jwt');
        if (!isActive) return;
        setToken(t);

        if (t) {
          setMail(await AsyncStorage.getItem('userMail'));
          setNickname(await AsyncStorage.getItem('userNickname'));
          setIsAlumno((await AsyncStorage.getItem('isAlumno')) === 'true');
          const payload = JSON.parse(atob(t.split('.')[1]));
          setIsAdmin(Array.isArray(payload.roles) && payload.roles.includes('ADMIN'));

        }
        setLoading(false);
      })();
      return () => { isActive = false; };
    }, [])
  );

  // 2) Configuro el botón "Admin" dinámicamente tras leer el token
  useEffect(() => {
  navigation.setOptions({ headerRight: null });

  if (token) {
    const { roles } = jwtDecode(token);
    if (Array.isArray(roles) && roles.includes('ADMIN')) {
      navigation.setOptions({
        headerRight: () => (
          // envolvemos TODO en un único contenedor
          <View style={{ flexDirection: 'row', marginRight: 8 }}>
            
          </View>
        ),
      });
    }
  }
}, [token, navigation]);

  // 3) Loading spinner
  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 4) No autenticado
  if (!token) {
    return (
      <View style={s.container}>
        <Text style={s.title}>Bienvenido</Text>
        <Button
          title="Iniciar Sesión"
          onPress={() => navigation.navigate('Login')}
          color={colors.primary}
        />
        <View style={{ height: 16 }} />
        <Button
          title="Registrarse"
          onPress={() => navigation.navigate('RegistroIniciar')}
          color={colors.secondary}
        />
      </View>
    );
  }

  // 5) Usuario autenticado
  return (
    <View style={s.container}>
      <Text style={s.label}>Nombre</Text>
      <Text style={s.value}>{nickname}</Text>

      <Text style={s.label}>Correo</Text>
      <Text style={s.value}>{mail}</Text>

      {isAdmin && (
        <>
          <View style={{ height: 32 }} />
          <Button
            title="Admin"
            onPress={() => setShowAdminMenu(v => !v)}
            color={colors.primary}
          />
          {showAdminMenu && (
            <View style={s.adminMenu}>
              <Button
                title="Usuarios Pendientes"
                onPress={() => navigation.navigate('RegistrosPendientesUsuarios')}
                color={colors.secondary}
              />
              <View style={{ height: 8 }} />
              <Button
                title="Recetas Pendientes"
                onPress={() => navigation.navigate('RecetasPendientes')}
                color={colors.secondary}
              />
              <View style={{ height: 8 }} />
              <Button
                title="Calificaciones Pendientes"
                onPress={() => navigation.navigate('CalificacionesPendientes')}
                color={colors.secondary}
              />
            </View>
          )}
        </>
      )}

      {!isAlumno && (
        <>
          <View style={{ height: 32 }} />
          <Button
            title="Convertirme en alumno"
            onPress={() => navigation.navigate('UpgradeAlumno')}
            color={colors.primary}
          />
        </>
      )}

      <View style={{ height: 16 }} />

      <Button
        title="Cambiar contraseña"
        onPress={() => navigation.navigate('PasswordResetRequest')}
        color={colors.primary}
      />
      
  
      <View style={{ height: 16 }} />
      <Button
        title="Mis recetas"
        onPress={() => navigation.navigate('MisRecetas')}
        color = {colors.primary}   
      />
      <View style={{ height: 16 }} />
      <Button
        title="Recetas guardadas"
        onPress={() => navigation.navigate('SavedRecipes')}
        color={colors.primary}
      />

      <View style={{ height: 16 }} />
      <Button
    title="Cuenta Corriente"
    onPress={() => navigation.navigate('CuentaCorriente')}
  />


      <View style={{ height: 200 }} />
    
      <Button 
        title="Cerrar sesión"
        onPress={async () => {
          await AsyncStorage.clear();
          navigation.navigate('Recetas');
        }}
        color={colors.error}
        
      
      />
    </View>
  );
}

const s = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 8,
  },
  adminMenu: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,borderWidth: 1, borderColor: '#ddd', 
  },
});
