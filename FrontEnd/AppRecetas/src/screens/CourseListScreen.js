// src/screens/CourseListScreen.js
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  StyleSheet,
  Platform,
  StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCursos } from '../api/courses';
import colors from '../theme/colors';

export default function CourseListScreen({ navigation }) {
  const [cursos, setCursos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken]     = useState(null);

  // inyectar botón "Mis Inscripciones"
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Mis Inscrip."
          onPress={() => navigation.navigate('Inscripciones')}
          color={colors.primary}
        />
      ),
    });
  }, [navigation]);

  // cargar token
  useFocusEffect(
  React.useCallback(() => {
    let isActive = true;
    AsyncStorage.getItem('jwt')
      .then(t => {
        if (isActive) setToken(t);
      })
      .catch(console.error);
    return () => { isActive = false; };
  }, [])
);

  // cargar cursos
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCursos();
        setCursos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !token && styles.cardDisabled]}
      disabled={!token}
      activeOpacity={token ? 0.7 : 1}
      onPress={() => {
        if (token) {
          navigation.navigate('CourseDetail', { curso: item });
        }
      }}
    >
      <Text style={[styles.title, !token && styles.textDisabled]}>
        {item.descripcion}
      </Text>
      <Text style={!token ? styles.textDisabled : null}>
        Precio: ${item.precio}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={cursos}
      keyExtractor={c => String(c.idCurso)}
      contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16 }}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  card: {
    backgroundColor: '#fff',
    padding:16,
    borderRadius:8,
    marginBottom:12,
    shadowColor:'#000', shadowOpacity:0.1, shadowRadius:4, elevation:2
  },
  cardDisabled: {
    backgroundColor: '#f0f0f0'
  },
  title: { fontSize:18, fontWeight:'500', marginBottom:4, color: colors.text },
  textDisabled: {
    color: colors.disabledText // define en tu theme un gris suave, por ej. '#888'
  }
});
