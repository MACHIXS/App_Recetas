import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getCursos, getCronogramasPorCurso } from '../api/courses';
import colors from '../theme/colors';

export default function CourseListScreen({ navigation }) {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCursos();
        setCursos(data);
      } catch (e) {
        console.error(e);
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
    <FlatList
      data={cursos}
      keyExtractor={c => String(c.idCurso)}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate(
            'CourseDetail',
            { curso: item }
          )}
        >
          <Text style={styles.title}>{item.descripcion}</Text>
          <Text>Precio: ${item.precio}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  card: {
    backgroundColor: '#fff',
    padding:16,
    borderRadius:8,
    marginBottom:12,
    shadowColor:'#000', shadowOpacity:0.1, shadowRadius:4, elevation:2
  },
  title: { fontSize:18, fontWeight:'500', marginBottom:4 }
});
