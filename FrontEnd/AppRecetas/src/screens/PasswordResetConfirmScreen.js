import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import { confirmPasswordReset } from '../api/auth';

export default function PasswordResetConfirmScreen({ navigation }) {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleConfirm = async () => {
    if (!token || !newPassword) {
      return Alert.alert('Error', 'Completá código y nueva contraseña.');
    }
    try {
      await confirmPasswordReset({ token, newPassword });
      Alert.alert('¡Listo!', 'Contraseña actualizada.', [
        { text: 'Ingresar', onPress: () => navigation.replace('Login') }
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data || err.message);
    }
  };

  return (
    <View style={s.container}>
      <TextInput
        placeholder="Código de recuperación"
        style={s.input}
        value={token}
        onChangeText={setToken}
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="Nueva contraseña"
        style={s.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Cambiar contraseña" onPress={handleConfirm} color={colors.primary} />
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