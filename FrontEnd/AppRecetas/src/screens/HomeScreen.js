import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../theme/colors';
import logo from '../../assets/images/logo.png'; // tu logo

export default function HomeScreen({ route, navigation }) {
  const [nickname, setNickname] = useState(route.params?.nickname || '');

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  const menu = [
    { label: 'Buscar recetas',       action: () => navigation.navigate('RecipeSearch') },
    { label: 'Mis recetas',          action: () => navigation.navigate('MyRecipes') },
    { label: 'Lista para intentar',  action: () => navigation.navigate('RecipeList') },
    { label: 'Multiplicar receta',   action: () => navigation.navigate('MultiplyRecipe') },
    { label: 'Buscar cursos',        action: () => navigation.navigate('Courses')   },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container}>
        {/* Header con logo y bienvenida */}
        <View style={s.header}>
          <Image source={logo} style={s.logo} resizeMode="contain" />
          <Text style={s.welcome}>
            ¡Hola{nickname ? `, ${nickname}` : ''}!
          </Text>
        </View>

        {/* Menú principal */}
        {menu.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={s.card}
            onPress={item.action}
            activeOpacity={0.7}
          >
            <Text style={s.cardText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

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
    alignItems: 'stretch',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    color: colors.text,
  },
  upgradeCard: {
    backgroundColor: colors.secondary,
  },
  upgradeText: {
    color: '#fff',
    fontWeight: '600',
  },
  logout: {
    marginTop: 32,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
  },
});