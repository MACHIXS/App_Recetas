import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import { finalizarRegistro } from '../api/auth';

export default function RegistroFinalScreen({ route, navigation }) {
  const { mail } = route.params; // opcional, solo si quieres mostrarlo
  const [token, setToken]             = useState('');
  const [nombre, setNombre]           = useState('');
  const [apellido, setApellido]       = useState('');
  const [password, setPassword]       = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  const handleFinalizar = async () => {
    if (!token || !nombre || !apellido || !password || !fechaNacimiento) {
      return Alert.alert('Error', 'Completa todos los campos.');
    }
    try {
      await finalizarRegistro({ token, nombre, apellido, password, fechaNacimiento });
      Alert.alert('¡Listo!', 'Tu cuenta ya está activa.', [
        { text: 'Ingresar', onPress: () => navigation.replace('Login') },
        { text:'OK', onPress: async () => {
           
           await AsyncStorage.setItem('userMail', mail);
           await AsyncStorage.setItem('userNickname', nickname);
           navigation.replace('Tabs', { screen:'Recetas', params:{ nickname } });
         }
       }
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data || err.message);
    }
  };

  return (
    <View style={s.container}>
      {/* Puedes mostrar el mail si lo deseas: */}
      {/* <Text style={s.subtitle}>Registrando: {mail}</Text> */}

      <TextInput
        placeholder="Código de validación"
        style={s.input}
        value={token}
        onChangeText={setToken}
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="Nombre"
        style={s.input}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        placeholder="Apellido"
        style={s.input}
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        placeholder="Contraseña"
        style={s.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Fecha nacimiento (YYYY-MM-DD)"
        style={s.input}
        value={fechaNacimiento}
        onChangeText={setFechaNacimiento}
      />

      <Button
        title="Finalizar registro"
        onPress={handleFinalizar}
        color={colors.primary}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, padding:24, justifyContent:'center', backgroundColor:colors.background },
  input:     { borderWidth:1, borderColor:colors.text, borderRadius:8,
               padding:12, marginBottom:16, color:colors.text },
  // subtitle:  { fontSize:16, marginBottom:12, color:colors.text }
});