// AppRecetas/screens/UpgradeAlumnoScreen.js

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import colors from '../theme/colors';

export default function UpgradeAlumnoScreen({ navigation }) {
  const [cardNumber, setCardNumber] = useState('');
  const [tramite, setTramite] = useState('');
  const [frontUri, setFrontUri] = useState(null);
  const [backUri, setBackUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // Selección de imagen con preview compatible expo-image-picker v14+
  const pickImage = async (setter, label) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a la galería');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.cancelled) {
      // Expo v14+ devuelve assets array
      const uri = result.uri || (result.assets && result.assets[0]?.uri);
      if (uri) {
        setter(uri);
        Alert.alert('Imagen cargada', `${label} cargado correctamente`);
      }
    }
  };

  const handleSubmit = async () => {
    if (!/^\d{16}$/.test(cardNumber)) {
      Alert.alert('Número de tarjeta inválido', 'Debe contener exactamente 16 dígitos.');
      return;
    }
    if (!tramite.trim()) {
      Alert.alert('Falta trámite', 'Ingrese el número de trámite del DNI.');
      return;
    }
    if (!frontUri || !backUri) {
      Alert.alert('Faltan imágenes', 'Debe seleccionar ambas imágenes del DNI.');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('jwt');
      const form = new FormData();
      form.append('numeroTarjeta', cardNumber);
      form.append('tramite', tramite);
      form.append('dniFrente', { uri: frontUri, name: 'frente.jpg', type: 'image/jpeg' });
      form.append('dniFondo',  { uri: backUri,   name: 'dorso.jpg',  type: 'image/jpeg' });

      await axios.post(
        'http://192.168.0.242:8080/api/usuarios/convertir',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      await AsyncStorage.setItem('isAlumno', 'true');

      Alert.alert('Éxito', 'Ahora eres alumno');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', e.response?.data?.message || 'No se pudo convertir');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.label}>Número de Tarjeta</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="number-pad"
          maxLength={16}
          placeholder="1234123412341234"
        />

        <Text style={styles.label}>Número de trámite (DNI)</Text>
        <TextInput
          style={styles.input}
          value={tramite}
          onChangeText={setTramite}
          maxLength={12}
          placeholder="Ej: 123456789"
        />

        <Text style={styles.label}>Foto DNI - Frente</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => pickImage(setFrontUri, 'Frente')}
        >
          {frontUri ? (
            <Image source={{ uri: frontUri }} style={styles.preview} />
          ) : (
            <Text style={styles.imageText}>Seleccionar Imagen</Text>
          )}
        </TouchableOpacity>
        {frontUri && <Text style={styles.confirmText}>Frente cargado</Text>}

        <Text style={styles.label}>Foto DNI - Dorso</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => pickImage(setBackUri, 'Dorso')}
        >
          {backUri ? (
            <Image source={{ uri: backUri }} style={styles.preview} />
          ) : (
            <Text style={styles.imageText}>Seleccionar Imagen</Text>
          )}
        </TouchableOpacity>
        {backUri && <Text style={styles.confirmText}>Dorso cargado</Text>}

        <View style={{ height: 24 }} />
        <Button
          title="Convertirme en Alumno"
          onPress={handleSubmit}
          color={colors.primary}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
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
  imagePicker: {
    marginTop: 8,
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa'
  },
  imageText: {
    color: colors.text
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 8
  },
  confirmText: {
    marginTop: 4,
    color: colors.primary,
    fontWeight: '500'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
