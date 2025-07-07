import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCronogramasPorCurso, inscribirCurso } from '../api/courses';
import { createPreference } from '../api/payments';
import colors from '../theme/colors';

export default function CourseDetailScreen({ route, navigation }) {
  const { curso } = route.params;
  const [cronogramas, setCronogramas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) Carga de cronogramas
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCronogramasPorCurso(curso.idCurso);
        setCronogramas(data);
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'No se pudieron cargar las fechas.');
      } finally {
        setLoading(false);
      }
    })();
  }, [curso]);

  // 2) Función que inicia pago y luego redirige a WebView
  const handlePagarEInscribir = async ({ cronogramaId, precio, descripcion }) => {
    try {
      // obtener email del payer (guardado en AsyncStorage al loguear)
      const payerEmail = await AsyncStorage.getItem('userEmail');
      if (!payerEmail) throw new Error('Email de usuario no encontrado');

      // 2.1) Crear preferencia en el backend
      const { data } = await createPreference({
        amount: precio,
        description: descripcion,
        payerEmail,
      });

      // 2.2) Navegar a la pantalla de pago con la URL de Mercado Pago
      navigation.navigate('Payment', { url: data.initPoint });

    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo iniciar el pago.');
    }
  };

  // 3) UI mientras carga
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Detalle del curso */}
        <Text style={styles.title}>{curso.descripcion}</Text>
        <Text>Modalidad: {curso.modalidad}</Text>
        <Text>Contenidos: {curso.contenidos}</Text>
        <Text>Requerimientos: {curso.requerimientos}</Text>

        {/* Cronogramas disponibles */}
        <Text style={styles.section}>Fechas disponibles:</Text>
        {cronogramas.map(c => (
          <View key={c.idCronograma} style={styles.cronoCard}>
            <Text>
              {c.sede.nombreSede} – {c.fechaInicio} a {c.fechaFin}
            </Text>
            <Button
              title="Pagar e inscribirme"
              onPress={() =>
                handlePagarEInscribir({
                  cronogramaId: c.idCronograma,
                  precio: curso.precio,
                  descripcion: curso.descripcion,
                })
              }
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.background },
  container: { padding: 16 },
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title:     { fontSize: 24, fontWeight: '600', marginBottom: 8, color: colors.text },
  section:   { fontSize: 18, fontWeight: '500', marginTop: 16, marginBottom: 8, color: colors.primary },
  cronoCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
