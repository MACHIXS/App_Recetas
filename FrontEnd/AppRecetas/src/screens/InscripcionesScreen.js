import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import {
  getMisInscripciones,
  cancelarInscripcion
} from '../api/courses';
import colors from '../theme/colors';

export default function InscripcionesScreen() {
  const [inscrip, setInscrip] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      const { data } = await getMisInscripciones();
      setInscrip(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={inscrip}
      keyExtractor={i => String(i.idAsistencia)}
      contentContainerStyle={{ padding:16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>{item.cronograma.curso.descripcion}</Text>
          <Text>Sede: {item.cronograma.sede.nombreSede}</Text>
          <Text>Inicio: {item.cronograma.fechaInicio}</Text>
          <Button
            title="Cancelar"
            onPress={async () => {
              await cancelarInscripcion(item.idAsistencia);
              cargar();
            }}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center:{flex:1,justifyContent:'center',alignItems:'center'},
  card:{backgroundColor:'#fff',padding:12,borderRadius:8,marginBottom:12}
});
