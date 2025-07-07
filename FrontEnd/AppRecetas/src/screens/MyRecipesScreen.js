import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import RecipeCard from '../components/RecipeCard';
import colors from '../theme/colors';
import { getMyRecetas } from '../api/recipes';

export default function MyRecipesScreen({ navigation }) {
  const [recetas, setRecetas]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [isAdmin, setIsAdmin]   = useState(false);

  // 1) Leer isAdmin al montar la pantalla
  useEffect(() => {
    AsyncStorage.getItem('userRole').then(r => setIsAdmin(r === 'ADMIN'));
  }, []);

  // 2) Función para (re)cargar tus propias recetas
  useFocusEffect(useCallback(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await getMyRecetas();
        if (active) setRecetas(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []));

  const handleApprove = async id => {
    try {
      await aprobarReceta(id);
      // recargar lista:
      setLoading(true);
      const { data } = await getMyRecetas();
      setRecetas(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo aprobar la receta.');
    }
  };


  if (loading) {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" color={colors.primary}/>
      </View>
    );
  }


  if (recetas.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No tienes recetas cargadas.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
      <FlatList
        data={recetas}
        keyExtractor={r => String(r.idReceta)}
        renderItem={({ item }) => (
          <RecipeCard
            receta={item}
            onPress={() => navigation.navigate('RecipeDetail', { recetaId: item.idReceta })}
            showEstado
            isAdmin={isAdmin}
            onApprove={handleApprove}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
