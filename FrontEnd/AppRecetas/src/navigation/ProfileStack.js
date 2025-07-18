import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';

import ProfileScreen             from '../screens/ProfileScreen';
import LoginScreen               from '../screens/LoginScreen';
import RegistroIniciarScreen     from '../screens/RegistroIniciarScreen';
import RegistroFinalScreen       from '../screens/RegistroFinalScreen';
import PasswordResetRequestScreen  from '../screens/PasswordResetRequestScreen';
import PasswordResetConfirmScreen  from '../screens/PasswordResetConfirmScreen';
import UpgradeAlumnoScreen         from '../screens/UpgradeAlumnoScreen';
import AdminPendingRegistrationsScreen from '../screens/AdminPendingRegistrationsScreen';
import AdminButton                     from '../components/AdminButton';
import AdminPendingRecipesScreen from '../screens/AdminPendingRecipesScreen';
import AdminPendingRatingsScreen from '../screens/AdminPendingRatingsScreen';


const Stack = createNativeStackNavigator();

export default function ProfileStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ headerShown: true, title: 'Perfil' }}
      />

      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="RegistroIniciar" component={RegistroIniciarScreen} />
      <Stack.Screen name="RegistroFinal"   component={RegistroFinalScreen} />
      <Stack.Screen name="PasswordResetRequest" component={PasswordResetRequestScreen} />
      <Stack.Screen name="PasswordResetConfirm" component={PasswordResetConfirmScreen} />
      <Stack.Screen name="UpgradeAlumno"          component={UpgradeAlumnoScreen} />
      <Stack.Screen name="RegistrosPendientesUsuarios" component={AdminPendingRegistrationsScreen} options={{ headerShown: true, title: 'Registros Pendientes' }} />
      <Stack.Screen name="RecetasPendientes" component={AdminPendingRecipesScreen} options={{ headerShown:true, title:'Aprobar Recetas' }} />
      <Stack.Screen name="CalificacionesPendientes" component={AdminPendingRatingsScreen} options={{ headerShown:true, title:'Aprobar Calificaciones' }} 
/>

    </Stack.Navigator>
  );
}
