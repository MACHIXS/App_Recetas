import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import { requestPasswordReset } from '../api/auth';

export default function PasswordResetRequestScreen({ navigation }) {
  const [mail, setMail] = useState('');

  const handleRequest = async () => {
    if (!mail) {
      return Alert.alert('Error', 'Ingresá tu correo.');
    }
    try {
      await requestPasswordReset({ mail });
      Alert.alert(
        'Código enviado',
        'Revisa tu correo para el código de recuperación.',
        [{ text: 'Continuar', onPress: () => navigation.navigate('PasswordResetConfirm') }]
      );
    } catch (err) {
      Alert.alert('Error', err.response?.data || err.message);
    }
  };

  return (
    <View style={s.container}>
      <TextInput
        placeholder="Correo electrónico"
        style={s.input}
        value={mail}
        onChangeText={setMail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button title="Enviar código" onPress={handleRequest} color={colors.primary} />
    </View>
  );
}

const s = StyleSheet.create({
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