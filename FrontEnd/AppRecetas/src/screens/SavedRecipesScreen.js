// src/screens/SavedRecipesScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipeCard from '../components/RecipeCard';
import colors from '../theme/colors';

const STORAGE_KEY = 'savedRecipes';

export default function SavedRecipesScreen({ navigation }) {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        setLoading(true);
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          const list = saved ? JSON.parse(saved) : [];
          if (active) setRecetas(list);
        } catch (e) {
          console.error('Error cargando recetas guardadas', e);
        } finally {
          if (active) setLoading(false);
        }
      };
      load();
      return () => { active = false; };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={recetas}
      keyExtractor={r => String(r.idReceta)}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <RecipeCard
          receta={item}
          onPress={() => navigation.navigate('RecipeDetail', { recetaId: item.idReceta })}
        />
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>No hay recetas guardadas.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  empty:  { textAlign:'center', color:colors.secondary, marginTop:32 },
});
