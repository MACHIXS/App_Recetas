import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { getRecetaDetalle } from '../api/recipes';  // ①
import colors from '../theme/colors';

export default function RecipeDetailScreen({ route }) {
  const { recetaId } = route.params;
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getRecetaDetalle(recetaId); // ②
        setDetalle(data);
      } catch (e) {
        console.error(e);
        setError('No se pudo cargar el detalle.');
      } finally {
        setLoading(false);
      }
    })();
  }, [recetaId]);

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
              m.tipoContenido === 'foto'
                ? <Image
                    key={i2}
                    source={{ uri: m.urlContenido }}
                    style={styles.stepImage}
                  />
                : null
            ))}
          </View>
        ))}

        {/* CALIFICACIONES */}
        <Text style={styles.section}>Calificaciones</Text>
        {detalle.calificaciones.length === 0
          ? <Text style={styles.text}>Aún no hay calificaciones.</Text>
          : detalle.calificaciones.map((c, i) => (
            <View key={i} style={styles.rating}>
              <Text style={styles.textBold}>{c.nickname}</Text>
              <Text style={styles.text}>⭐ {c.calificacion}</Text>
              {c.comentarios && <Text style={styles.text}>{c.comentarios}</Text>}
            </View>
          ))
        }

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex:1, backgroundColor: colors.background },
  container: { padding:16 },
  center:    { flex:1, justifyContent:'center', alignItems:'center' },
  image:     { width:'100%', height:200, borderRadius:12, marginBottom:16 },
  title:     { fontSize:24, fontWeight:'600', color:colors.text },
  meta:      { fontSize:14, color:colors.secondary, marginBottom:12 },
  section:   { fontSize:18, fontWeight:'500', color:colors.primary, marginTop:16 },
  text:      { fontSize:16, color:colors.text, marginVertical:4 },
  step:      { marginBottom:12 },
  stepTitle: { fontSize:16, fontWeight:'500', marginBottom:4 },
  stepImage: { width:'100%', height:150, borderRadius:8, marginTop:4 },
  rating:    { marginBottom:12 },
  textBold:  { fontSize:16, fontWeight:'600', color:colors.text },
});
