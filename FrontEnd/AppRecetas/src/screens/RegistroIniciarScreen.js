import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import { iniciarRegistro } from '../api/auth';

export default function RegistroIniciarScreen({ navigation }) {
  const [mail, setMail]         = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleIniciar = async () => {
    if (!mail || !nickname) {
      return Alert.alert('Error', 'Debes completar correo y alias.');
    }
    setLoading(true);
    try {
      await iniciarRegistro({ mail, nickname });
      Alert.alert(
        'Registro iniciado',
        'Revisa tu correo para el código de validación.',
        [{ text: 'Continuar', onPress: () => navigation.navigate('RegistroFinal', { mail }) }]
      );
    } catch (err) {
      Alert.alert('Error', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <TextInput
        placeholder="Correo electrónico"
        value={mail}
        onChangeText={setMail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Alias"
        value={nickname}
        onChangeText={setNickname}
        autoCapitalize="none"
        style={styles.input}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleIniciar}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Enviando...' : 'Iniciar registro'}
        </Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: colors.text,
  },
  button: {
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});