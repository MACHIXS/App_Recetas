import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import colors from '../theme/colors';
import { listarRecetasPendientes, aprobarReceta } from '../api/recipes';

export default function PendingRecipesScreen() {
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading]       = useState(true);

  // Función para traer las pendientes
  const loadPendientes = async () => {
    setLoading(true);
    try {
      const { data } = await listarRecetasPendientes();
      setPendientes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendientes();
  }, []);

  const handleApprove = async (idReceta) => {
    try {
      await aprobarReceta(idReceta);
      // ¡Muy importante! Tras aprobar, volvemos a recargar la lista:
      await loadPendientes();
    } catch (e) {
      console.error(e);
      // aquí podrías mostrar un Alert si falla
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <FlatList
      data={pendientes}
      keyExtractor={r => String(r.idReceta)}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <RecipeCard
          receta={item}
          showEstado
          isAdmin
          onApprove={handleApprove}
          onPress={() => {/* tal vez entras al detalle */}}
        />
      )}
      ListEmptyComponent={<Text style={styles.empty}>No hay recetas pendientes.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  empty:  { textAlign:'center', color:colors.secondary, marginTop:32 }
});
