import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View, TextInput, Button, Alert, Text, StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView, ScrollView } from 'react-native';
import colors from '../theme/colors';
import { upgradeToAlumno } from '../api/alumno';
import { useNavigation } from '@react-navigation/native';


export default function UpgradeAlumnoScreen(navigation) {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [cvc, setCvc] = useState('');
  const [tramite, setTramite] = useState('');
  const [frenteUri, setFrenteUri] = useState(null);
  const [fondoUri, setFondoUri] = useState(null);

  // ① Pedir permisos al arrancar
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos para cargar el DNI.');
      }
    })();
  }, []);

  // ② Función genérica para elegir imagen
  const pickImage = async setter => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) {
        // result.assets[0].uri en SDK ≥48
        setter(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo abrir la galería.');
    }
  };

  
  // ③ Manejar envío al backend
  const handleUpgrade = async () => {
    if (!numeroTarjeta || !fechaVencimiento || !cvc || !tramite || !frenteUri || !fondoUri) {
      return Alert.alert('Error', 'Completá todos los campos y ambas fotos.');
    }
    try {
      await upgradeToAlumno({
        numeroTarjeta,
        fechaVencimientoTarjeta: fechaVencimiento,
        codigoSeguridadTarjeta: cvc,
        tramite,
        dniFrenteUri: frenteUri,
        dniFondoUri: fondoUri,
      });
      await AsyncStorage.setItem('isAlumno', 'true');
      Alert.alert('¡Éxito!', 'Ahora sos alumno.');



    } catch (err) {
      Alert.alert('Error', err.response?.data || err.message);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle = {s.container}>
      <TextInput
        placeholder="Número de tarjeta"
        style={s.input}
        value={numeroTarjeta}
        onChangeText={setNumeroTarjeta}
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="Fecha vencimiento (YYYY-MM-DD)"
        style={s.input}
        value={fechaVencimiento}
        onChangeText={setFechaVencimiento}
      />
      <TextInput
        placeholder="CVC"
        style={s.input}
        value={cvc}
        onChangeText={setCvc}
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="Número trámite DNI"
        style={s.input}
        value={tramite}
        onChangeText={setTramite}
      />

      <Button title="Seleccionar DNI Frente" onPress={() => pickImage(setFrenteUri)} />
      {frenteUri && <Text style={s.preview}>Frente cargado</Text>}

      <Button title="Seleccionar DNI Dorso" onPress={() => pickImage(setFondoUri)} />
      {fondoUri && <Text style={s.preview}>Dorso cargado</Text>}

      <Button title="Convertirme en Alumno" onPress={handleUpgrade} color={colors.primary} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 24,
    paddingTop: 48,      // empuja todo 48px hacia abajo
    backgroundColor: colors.background,
  },
  input: {
    borderWidth: 1, borderColor: colors.text, borderRadius: 8,
    padding: 12, marginBottom: 16, color: colors.text,
  },
  preview: {
    marginVertical: 8, color: colors.secondary,
  },
});