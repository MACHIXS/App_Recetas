import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen       from './src/screens/HomeScreen';
import CursosScreen     from './src/screens/CursosScreen';
import PerfilScreen     from './src/screens/PerfilScreen';
import LoginScreen      from './src/screens/LoginScreen';
import RegistroIniciarScreen from './src/screens/RegistroIniciarScreen';
import RegistroFinalScreen   from './src/screens/RegistroFinalScreen';
import PasswordResetRequestScreen from './src/screens/PasswordResetRequestScreen';
import PasswordResetConfirmScreen from './src/screens/PasswordResetConfirmScreen';
import UpgradeAlumnoScreen        from './src/screens/UpgradeAlumnoScreen';

import colors from './src/theme/colors';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

// Stack que envuelve el flujo de autenticación y la app
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown:false }}>
      {/* Auth */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegistroIniciar" component={RegistroIniciarScreen} />
      <Stack.Screen name="RegistroFinal" component={RegistroFinalScreen} />
      <Stack.Screen name="PasswordResetRequest" component={PasswordResetRequestScreen} />
      <Stack.Screen name="PasswordResetConfirm" component={PasswordResetConfirmScreen} />
      <Stack.Screen name="UpgradeAlumno" component={UpgradeAlumnoScreen} />

      {/* Una vez logueado, va al Tab */}
      <Stack.Screen name="Home" component={AppTabs} />
    </Stack.Navigator>
  );
}

// Bottom Tabs con tus tres pestañas
function AppTabs() {
  return (
    <Tab.Navigator
  screenOptions={{
    headerShown: false,
    tabBarShowLabel: true,
    tabBarLabelStyle: {
      fontSize: 12,
      fontFamily: 'Montserrat-Regular',    // según Figma
      marginBottom: 4,
    },
    tabBarStyle: {
      height: 80,                          // altura de la barra
      backgroundColor: '#FFFFFF',         // fondo
      borderTopColor: '#E0E0E0',          // línea superior
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    tabBarActiveTintColor: '#F4A261',     // color activo
    tabBarInactiveTintColor: '#A0A0A0',   // color inactivo
    tabBarIconStyle: { marginBottom: -4 },// para subir/bajar icono
  }}
>
  <Tab.Screen
    name="Recetas"
    component={HomeScreen}
    options={{
      tabBarIcon: ({ color, size }) =>
        <Ionicons name="restaurant" size={24} color={color} />,
    }}
  />
  <Tab.Screen
    name="Cursos"
    component={CursosScreen}
    options={{
      tabBarIcon: ({ color, size }) =>
        <Ionicons name="school" size={24} color={color} />,
    }}
  />
  <Tab.Screen
    name="Perfil"
    component={PerfilScreen}
    options={{
      tabBarIcon: ({ color, size }) =>
        <Ionicons name="person" size={24} color={color} />,
    }}
  />
</Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
