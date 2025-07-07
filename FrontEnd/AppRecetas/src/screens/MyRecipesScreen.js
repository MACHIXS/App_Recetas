import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import colors from '../theme/colors';
import { getMyRecetas } from '../api/recipes'; // nuevo endpoint GET /recetas/mias

export default function MyRecipesScreen({ navigation }) {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyRecetas();
        setRecetas(data);
      } catch {
        // manejar error...
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
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
            onPress={() => navigation.navigate('RecipeDetail', { recetaId: item.idReceta })}
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
