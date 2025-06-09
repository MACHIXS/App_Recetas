import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen             from '../screens/ProfileScreen';
import LoginScreen               from '../screens/LoginScreen';
import RegistroIniciarScreen     from '../screens/RegistroIniciarScreen';
import RegistroFinalScreen       from '../screens/RegistroFinalScreen';
import PasswordResetRequestScreen  from '../screens/PasswordResetRequestScreen';
import PasswordResetConfirmScreen  from '../screens/PasswordResetConfirmScreen';
import UpgradeAlumnoScreen         from '../screens/UpgradeAlumnoScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="RegistroIniciar" component={RegistroIniciarScreen} />
      <Stack.Screen name="RegistroFinal"   component={RegistroFinalScreen} />
      <Stack.Screen name="PasswordResetRequest" component={PasswordResetRequestScreen} />
      <Stack.Screen name="PasswordResetConfirm" component={PasswordResetConfirmScreen} />
      <Stack.Screen name="UpgradeAlumno"          component={UpgradeAlumnoScreen} />
    </Stack.Navigator>
  );
}
