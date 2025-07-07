import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer }    from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons }               from '@expo/vector-icons';


import RecipeStack from './src/navigation/RecipeStack';
import CursosScreen  from './src/screens/CursosScreen';
import ProfileStackScreen from './src/navigation/ProfileStack';
import CourseStack from './src/navigation/CourseStack';



import colors from './src/theme/colors';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Recetas" 
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor:   colors.primary,
          tabBarInactiveTintColor: colors.text,
          tabBarStyle: {
            height: 56,
            backgroundColor: colors.background,
            borderTopColor: '#E0E0E0',
          },
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIcon: ({ color }) => {
            let iconName;
            if (route.name === 'Recetas') iconName = 'restaurant';
            if (route.name === 'Cursos')   iconName = 'school';
            if (route.name === 'Perfil')   iconName = 'person';
            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Recetas"    component={RecipeStack} options={{title: 'Recetas' }} />
        <Tab.Screen name="Cursos"     component={CourseStack} options={{ title: 'Cursos' }} />
        <Tab.Screen name="Perfil"     component={ProfileStackScreen} options={{ title:'Perfil' }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

