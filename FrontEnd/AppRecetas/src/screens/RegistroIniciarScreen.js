// AppRecetas/screens/RegistroIniciarScreen.js

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';
import axios from 'axios';
import colors from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const BASE_URL = 'http://192.168.0.242:8080/api/auth';

export default function RegistroIniciarScreen({ navigation }) {
  const [mail, setMail] = useState('');
  const [alias, setAlias] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Verifica alias y genera sugerencias si ya existe
  const checkAlias = async () => {
    if (!alias.trim()) return;
    try {
      const res = await axios.get(`${BASE_URL}/alias-suggestions`, {
        params: { nickname: alias }
      });
      if (res.data.length) {
        setSuggestions(res.data);
      } else {
        setSuggestions([]);
      }
    } catch (e) {
      console.error('Error sugerencias alias', e);
    }
  };

  const handleNext = async () => {
    if (!mail.trim() || !alias.trim()) {
      Alert.alert('Error', 'Completa correo y alias');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/registro/iniciar`,
        { mail, nickname: alias }
      );
      // navegar a RegistroFinal, guardo mail/alias
      await AsyncStorage.setItem('regMail', mail);
      await AsyncStorage.setItem('regAlias', alias);
      navigation.dispatch(
        CommonActions.navigate('RegistroFinal')
      );
    } catch (e) {
      console.error(e);
      if (e.response?.status === 409 && e.response.data.suggestions) {
        setSuggestions(e.response.data.suggestions);
        Alert.alert('Alias no disponible', 'Elegí uno de los sugeridos o prueba otro.');
      } else {
        Alert.alert('Error', e.response?.data?.message || e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          value={mail}
          onChangeText={setMail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Alias</Text>
        <TextInput
          style={styles.input}
          value={alias}
          onChangeText={text => {
            setAlias(text);
            setSuggestions([]);
          }}
          onBlur={checkAlias}
          placeholder="TuAlias"
        />

        {suggestions.length > 0 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggTitle}>Alias sugeridos:</Text>
            {suggestions.map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => {
                  setAlias(s);
                  setSuggestions([]);
                }}
              >
                <Text style={styles.suggItem}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
        <Button
          title={loading ? 'Enviando...' : 'Siguiente'}
          onPress={handleNext}
          disabled={loading}
          color={colors.primary}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
    padding: 24
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginTop: 12
  },
  input: {
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    color: colors.text
  },
  suggestions: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6
  },
  suggTitle: {
    fontWeight: '500',
    marginBottom: 4
  },
  suggItem: {
    paddingVertical: 4,
    color: colors.primary
  }
});
