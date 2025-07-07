import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';

export default function RecipeCard({ receta, onPress }) {
  return (
    <TouchableOpacity style={s.card} activeOpacity={0.8} onPress={() => onPress(receta)}>
      <Image source={{ uri: receta.fotoPrincipal }} style={s.image} />
      <View style={s.info}>
        <Text style={s.title} numberOfLines={1}>{receta.nombreReceta}</Text>
        <Text style={s.meta}>Por: {receta.nickname}</Text>
        <Text style={s.meta}>⭐ {receta.calificacionPromedio?.toFixed(1) || 0}</Text>
      </View>
      
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    fontSize: 14,
    color: colors.secondary,
  },
});