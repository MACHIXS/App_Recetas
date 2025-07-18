// src/screens/RecipeDetailScreen.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating-widget';
import axios from 'axios';
import { getRecetaDetalle ,calificarReceta} from '../api/recipes';
import colors from '../theme/colors';

export default function RecipeDetailScreen({ route }) {
  const { recetaId } = route.params;
  const [detalle, setDetalle]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Estados para la valoración
  const [rating, setRating]     = useState(0);
  const [comment, setComment]   = useState('');
  const [sending, setSending]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getRecetaDetalle(recetaId);
        setDetalle(data);
      } catch (e) {
        console.error(e);
        setError('No se pudo cargar el detalle.');
      } finally {
        setLoading(false);
      }
    })();
  }, [recetaId]);

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Seleccioná una cantidad de estrellas.');
      return;
    }
    setSending(true);
    try {
      const token = await AsyncStorage.getItem('jwt');
      await axios.post(
        `http://192.168.0.242:8080/api/recetas/${recetaId}/calificar`,
        { calificacion: rating, comentarios: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('¡Gracias!', 'Tu valoración será visible tras aprobación.');
      setRating(0);
      setComment('');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.response?.data || e.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
  if (error) return (
    <View style={styles.center}>
      <Text style={{ color: colors.error }}>{error}</Text>
    </View>
  );
  if (!detalle) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* FOTO PRINCIPAL */}
        <Image
          source={{ uri: detalle.fotoPrincipal }}
          style={styles.image}
        />

        {/* TÍTULO */}
        <Text style={styles.title}>{detalle.nombreReceta}</Text>
        <Text style={styles.meta}>Por: {detalle.nickname}</Text>

        {/* DESCRIPCIÓN */}
        <Text style={styles.section}>Descripción</Text>
        <Text style={styles.text}>{detalle.descripcionReceta}</Text>

        {/* INGREDIENTES */}
        <Text style={styles.section}>Ingredientes</Text>
        {detalle.ingredientes.map((i, idx) => (
          <Text key={idx} style={styles.text}>
            • {i.cantidad} {i.unidad} de {i.nombre}
            {i.observaciones ? ` (${i.observaciones})` : ''}
          </Text>
        ))}

        {/* PASOS */}
        <Text style={styles.section}>Pasos</Text>
        {detalle.pasos.map((p, idx) => (
          <View key={idx} style={styles.step}>
            <Text style={styles.stepTitle}>Paso {p.nroPaso}</Text>
            <Text style={styles.text}>{p.texto}</Text>
            {p.multimedia.map((m, i2) => (
              m.tipoContenido === 'foto' && (
                <Image
                  key={i2}
                  source={{ uri: m.urlContenido }}
                  style={styles.stepImage}
                />
              )
            ))}
          </View>
        ))}

        {/* CALIFICACIONES APROBADAS */}
        <Text style={styles.section}>Comentarios Aprobados</Text>
        {detalle.calificaciones.length === 0
          ? <Text style={styles.text}>Aún no hay calificaciones.</Text>
          : detalle.calificaciones.map((c, i) => (
              <View key={i} style={styles.ratingBox}>
                <Text style={styles.textBold}>{c.nickname}</Text>
                <Text style={styles.text}>⭐ {c.calificacion}</Text>
                {c.comentarios?.length > 0 && (
                  <Text style={styles.text}>{c.comentarios}</Text>
                )}
              </View>
            ))
        }

        {/* FORMULARIO DE VALORACIÓN */}
        <Text style={styles.section}>Valorar esta receta</Text>
        <StarRating
          rating={rating}
          onChange={setRating}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Dejá un comentario (opcional)"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <Button
          title={sending ? 'Enviando...' : 'Enviar valoración'}
          onPress={submitRating}
          disabled={sending || rating === 0}
          color={colors.primary}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex:1, backgroundColor: colors.background },
  container:   { padding:16 },
  center:      { flex:1, justifyContent:'center', alignItems:'center' },
  image:       { width:'100%', height:200, borderRadius:12, marginBottom:16 },
  title:       { fontSize:24, fontWeight:'600', color:colors.text },
  meta:        { fontSize:14, color:colors.secondary, marginBottom:12 },
  section:     { fontSize:18, fontWeight:'500', color:colors.primary, marginTop:16 },
  text:        { fontSize:16, color:colors.text, marginVertical:4 },
  step:        { marginBottom:12 },
  stepTitle:   { fontSize:16, fontWeight:'500', marginBottom:4 },
  stepImage:   { width:'100%', height:150, borderRadius:8, marginTop:4 },
  ratingBox:   { backgroundColor:'#fafafa', padding:12, borderRadius:8, marginVertical:8 },
  textBold:    { fontSize:16, fontWeight:'600', color:colors.text },
  input:       {
    borderWidth:1,
    borderColor:colors.text,
    borderRadius:8,
    padding:10,
    backgroundColor:'#fff',
    color:colors.text,
    marginBottom:12
  },
});
