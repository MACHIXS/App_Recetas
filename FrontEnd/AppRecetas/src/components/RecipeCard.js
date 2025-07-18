import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button
} from 'react-native';
import colors from '../theme/colors';


export default function RecipeCard({
  receta,
  onPress,
  showEstado = false,
  isAdmin = false,
  onApprove
}) {
  return (
    <View style={s.card}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(receta)}>
        <Image source={{ uri: receta.fotoPrincipal }} style={s.image} />
        <View style={s.info}>
          <Text style={s.title} numberOfLines={1}>
            {receta.nombreReceta}
          </Text>
          <Text style={s.meta}>Por: {receta.nickname}</Text>
        </View>
      </TouchableOpacity>

      {showEstado && (
        <Text style={[s.status, {
          color: receta.estado === 'APROBADA' ? 'green' : 'orange'
        }]}>  
          {receta.estado === 'APROBADA' ? '✅ Aprobada' : '🕒 Pendiente'}
        </Text>
      )}

      {isAdmin && receta.estado === 'PENDIENTE' && (
        <View style={s.approveButton}>
          <Button
            title="Aprobar"
            onPress={() => onApprove(receta.idReceta)}
            color={colors.primary}
          />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2 // shadow for Android
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
  status: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  approveButton: {
    margin: 12,
  },
});
