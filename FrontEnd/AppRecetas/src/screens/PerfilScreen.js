import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Mi perfil</Text>
      {/* Aquí más datos de usuario */}
      <Button title="Cerrar sesión" onPress={handleLogout} color={colors.error}/>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:colors.background },
  title:     { fontSize:24, color:colors.primary, marginBottom:20 }
});
