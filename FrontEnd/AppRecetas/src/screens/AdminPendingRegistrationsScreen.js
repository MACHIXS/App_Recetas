// AppRecetas/screens/AdminPendingRegistrationsScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

export default function AdminPendingRegistrationsScreen() {
  const [mails, setMails]     = useState([]);
  const [token, setToken]     = useState(null);
  const navigation            = useNavigation();
  const isFocused             = useIsFocused();
  const BACKEND               = 'http://192.168.0.242:8080/api';

  // 1) Leer token guardado como 'jwt' en LoginScreen
  useEffect(() => {
    AsyncStorage.getItem('jwt')
      .then(t => {
        console.log('🔑 Token leido en AdminScreen:', t);
        setToken(t);
      })
      .catch(err => {
        console.error('Error leyendo token', err);
        Alert.alert('Error', 'No pude leer el token');
      });
  }, []);

  // 2) Al volver a foco y si tenemos token, llamar fetchPending
  useEffect(() => {
    if (isFocused && token) {
      console.log('AdminScreen focus y token presente, fetchPending');
      fetchPending();
    }
  }, [isFocused, token]);

  // 3) Traer lista de mails pendientes
  const fetchPending = async () => {
    try {
      const res = await axios.get(
        `${BACKEND}/admin/registro-pendiente`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );
      console.log('📬 fetchPending:', res.data);
      setMails(res.data);
    } catch (e) {
      console.error('fetchPending error', e.response || e);
      Alert.alert(
        'Error ' + (e.response?.status || ''),
        e.response?.data?.message || 'No pude obtener registros pendientes'
      );
    }
  };

  // 4) Liberar mail
  const liberar = async (mail) => {
    try {
      await axios.delete(
        `${BACKEND}/admin/registro-pendiente/${encodeURIComponent(mail)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );
      Alert.alert('Ok', `Mail ${mail} liberado`);
      fetchPending();
    } catch (e) {
      console.error('liberar error', e.response || e);
      Alert.alert(
        'Error ' + (e.response?.status || ''),
        e.response?.data?.message || `No se pudo liberar ${mail}`
      );
    }
  };

  // 5) Render de cada fila
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.mail}>{item}</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          Alert.alert(
            'Confirmar',
            `¿Liberar ${item}?`,
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sí', onPress: () => liberar(item) }
            ]
          )
        }
      >
        <Text style={styles.btnText}>Liberar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registros Pendientes</Text>
      <FlatList
        data={mails}
        keyExtractor={mail => mail}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No hay registros</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title:     { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  row:       {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd'
  },
  mail:     { fontSize: 16, flex: 1 },
  btn:      {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8
  },
  btnText:  { color: '#fff', fontWeight: '600' },
  empty:    { textAlign: 'center', marginTop: 20, color: '#666' }
});
