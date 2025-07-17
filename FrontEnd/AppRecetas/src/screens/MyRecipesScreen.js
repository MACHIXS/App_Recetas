import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipeCard from '../components/RecipeCard';
import colors from '../theme/colors';
import client from '../api/client';       // tu instancia de axios con interceptor
import { getMyRecetas } from '../api/recipes';

export default function MyRecipesScreen({ navigation }) {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 1) Definimos fetchRecetas **antes** de usarlo
  const fetchRecetas = async () => {
    setLoading(true);
    try {
      const { data } = await getMyRecetas();
      setRecetas(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudieron cargar tus recetas.');
    } finally {
      setLoading(false);
    }
  };

  // 2) Hook de arranque: leemos isAdmin y cargamos las recetas
  useEffect(() => {
    AsyncStorage.getItem('isAdmin').then(v => setIsAdmin(v === 'true'));
    fetchRecetas();
  }, []);

  // 3) Función para aprobar y filtrar localmente
  const handleApprove = async (recetaId) => {
    try {
      await client.patch(`/recetas/${recetaId}/aprobar`);
      // quitamos la receta aprobada de la lista
      setRecetas(old => old.filter(r => r.idReceta !== recetaId));
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo aprobar la receta.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!recetas.length) {
    return (
      <View style={styles.center}>
        <Text>No tienes recetas pendientes.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={recetas}
        keyExtractor={r => String(r.idReceta)}
        renderItem={({ item }) => (
          <RecipeCard
            receta={item}
            showEstado
            isAdmin={isAdmin}
            onPress={() => navigation.navigate('RecipeDetail', { recetaId: item.idReceta })}
            onApprove={() => handleApprove(item.idReceta)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex:1, backgroundColor: colors.background },
  center: { flex:1, justifyContent:'center', alignItems:'center' },
});
