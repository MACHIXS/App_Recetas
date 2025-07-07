import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecipeListScreen   from '../screens/RecipeListScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';

const Stack = createNativeStackNavigator();

export default function RecipeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecipeList"
        component={RecipeListScreen}
        options={{ title: 'Recetas' }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: 'Detalle de Receta' }}
      />
    </Stack.Navigator>
  );
}

