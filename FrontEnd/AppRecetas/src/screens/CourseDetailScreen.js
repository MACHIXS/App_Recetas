// src/screens/CourseDetailScreen.js
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
import {
  getCronogramasPorCurso,
  inscribirCurso,
} from '../api/courses';
import colors from '../theme/colors';

export default function CourseDetailScreen({ route, navigation }) {
  const { curso } = route.params;
  const [cronogramas, setCronogramas] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCronogramasPorCurso(curso.idCurso);
        setCronogramas(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [curso]);

  const handlePaymentAndEnroll = (idCronograma) => {
    // 1) Simulamos un pago
    Alert.alert(
      'Simulación de pago',
      `Vas a pagar $${curso.precio} por el curso "${curso.descripcion}".`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Pagar e inscribirme',
          onPress: async () => {
            // 2) Luego de “pagar”, llamamos al endpoint de inscripción
            try {
              await inscribirCurso(idCronograma);
              Alert.alert(
                'Inscripción completada',
                '¡Te has inscrito correctamente!',
                [{ text: 'OK', onPress: () => navigation.navigate('Inscripciones') }]
              );
            } catch (e) {
              if (e.response?.status === 403) {
                Alert.alert(
                  'Acceso denegado',
                  'Solo los alumnos pueden inscribirse. Conviértete en alumno desde tu perfil.'
                );
              } else {
                console.error(e);
                Alert.alert('Error', 'No se pudo completar la inscripción.');
              }
            }
          }
        }
      ]
    );
  };

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
        <Text style={styles.title}>{curso.descripcion}</Text>
        <Text>Modalidad: {curso.modalidad}</Text>
        <Text>Contenidos: {curso.contenidos}</Text>
        <Text>Requerimientos: {curso.requerimientos}</Text>
        <Text style={styles.section}>Fechas disponibles:</Text>
        {cronogramas.map(c => (
          <View key={c.idCronograma} style={styles.cronoCard}>
            <Text>
              {c.sede.nombreSede} – {c.fechaInicio} a {c.fechaFin}
            </Text>
            <Button
              title={`Pagar $${curso.precio} e inscribirme`}
              onPress={() => handlePaymentAndEnroll(c.idCronograma)}
              color={colors.primary}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex:1, backgroundColor: colors.background },
  container: { padding:16 },
  center:    { flex:1, justifyContent:'center', alignItems:'center' },
  title:     { fontSize:24, fontWeight:'600', marginBottom:8 },
  section:   { fontSize:18, fontWeight:'500', marginTop:16, marginBottom:8 },
  cronoCard: {
    backgroundColor:'#fff',
    padding:12,
    borderRadius:8,
    marginBottom:12,
    shadowColor:'#000', shadowOpacity:0.1, shadowRadius:4, elevation:2
  },
});
