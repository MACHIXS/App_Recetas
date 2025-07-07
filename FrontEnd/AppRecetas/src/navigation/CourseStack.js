import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourseListScreen from '../screens/CourseListScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import InscripcionesScreen from '../screens/InscripcionesScreen';
import PaymentScreen from '../screens/PaymentScreen';
import WebViewScreen from '../screens/WebViewScreen';


const Stack = createNativeStackNavigator();

export default function CourseStack() {
  return (
    <Stack.Navigator>
      {/* Listado de cursos */}
      <Stack.Screen
        name="CourseList"
        component={CourseListScreen}
        options={{ title: 'Cursos' }}
      />

      {/* Detalle de un curso (pasas todo el objeto curso por params) */}
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: 'Detalle del Curso' }}
      />

      {/* Inscripciones del alumno */}
      <Stack.Screen
        name="Inscripciones"
        component={InscripcionesScreen}
        options={{ title: 'Mis Inscripciones' }}
      />

      {/* Pantalla de pago */}
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: 'Pagar Curso' }}
      />
      <Stack.Screen
       name="WebviewScreen"
      component={WebViewScreen}
       options={{ headerShown: false }}
     />

    </Stack.Navigator>
  );
}
