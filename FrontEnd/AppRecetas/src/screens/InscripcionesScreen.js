import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
} from 'react-native';
import colors from '../theme/colors';
import { getInscripciones, cancelarInscripcion } from '../api/courses';

export default function InscripcionesScreen() {
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getInscripciones();
        setInscripciones(data);
      } catch (e) {
        if (e.response?.status === 403) {
          Alert.alert(
            'Acceso denegado',
            'Solo los alumnos pueden ver sus inscripciones. Conviértete en alumno primero.'
          );
        } else {
          Alert.alert('Error', 'No se pudieron cargar tus inscripciones.');
        }
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

  if (inscripciones.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>No tienes inscripciones.</Text>
      </View>
    );
  }

  const handleCancelar = async (id) => {
    try {
      await cancelarInscripcion(id);
      setInscripciones(inscripciones.filter(i => {
        // ajusta al nombre real del id en la respuesta
        return String(i.idInscripcion || i.idAsistencia) !== String(id);
      }));
    } catch {
      Alert.alert('Error', 'No se pudo cancelar la inscripción.');
    }
  };

  const renderItem = ({ item }) => {
    // extraemos id y datos con fallback
    const id = item.idInscripcion ?? item.idAsistencia;
    const cronograma = item.cronograma || {};
    const curso = cronograma.curso || {};

    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          {curso.descripcion || '—'} — {cronograma.sede?.nombreSede || '—'}
        </Text>
        <Text style={styles.text}>Desde: {cronograma.fechaInicio || '—'}</Text>
        <Text style={styles.text}>Hasta: {cronograma.fechaFin || '—'}</Text>
        <View style={styles.buttonWrapper}>
          <Button
            title="Cancelar inscripción"
            color={colors.error}
            onPress={() => handleCancelar(id)}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={inscripciones}
        keyExtractor={item => {
          const id = item.idInscripcion ?? item.idAsistencia;
          return String(id);
        }}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.text,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  text: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 4,
  },
  buttonWrapper: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
});
