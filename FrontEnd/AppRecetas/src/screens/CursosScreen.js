
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function CursosScreen() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Cursos disponibles</Text>
      {/* Aquí más UI de cursos */}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:colors.background },
  title:     { fontSize:24, color:colors.primary }
});