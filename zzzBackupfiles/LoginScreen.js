import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import { login } from '../api/auth';

export default function LoginScreen({ navigation }) {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { nickname } = await login({ mail, password });
      await AsyncStorage.setItem('jwt', token);          
      await AsyncStorage.setItem('userMail', mail);
      await AsyncStorage.setItem('userNickname', nickname);
      navigation.replace('Home', { nickname });
    } catch (err) {
      Alert.alert('Error', err.response?.data || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={mail}
        onChangeText={setMail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Ingresar" onPress={handleLogin} color={colors.primary} />
      <Button title="Registrarse" onPress={() => navigation.navigate('RegistroIniciar')} />
      <Button
        title="Olvidé mi contraseña"
        onPress={() => navigation.navigate('PasswordResetRequest')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: colors.text,
  },
});