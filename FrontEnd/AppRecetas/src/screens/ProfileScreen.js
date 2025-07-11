import React, { useState, useEffect } from 'react';
import { useFocusEffect, useNavigation , CommonActions, } from '@react-navigation/native';
import {
  View, Text, Button, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../theme/colors';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [token,    setToken]  = useState(null);
  const [mail,     setMail]   = useState('');
  const [nickname,setNickname]= useState('');
  const [isAlumno, setIsAlumno] = useState(false);

const navigation2 = useNavigation();

const goToMyRecipes = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Recetas',         // el nombre de la pestaña
        params: {
          screen: 'MyRecipes',   // el nombre dentro del stack
        },
      })
    );
  };

  useFocusEffect(
   React.useCallback(() => {
     let isActive = true;
     (async () => {
       const t = await AsyncStorage.getItem('jwt');
       if (!isActive) return;
       setToken(t);
       if (t) {
         setMail(await AsyncStorage.getItem('userMail'));
         setNickname(await AsyncStorage.getItem('userNickname'));
         setIsAlumno((await AsyncStorage.getItem('isAlumno')) === 'true');
       }
       setLoading(false);
     })();
     return () => { isActive = false; };
   }, [])
 );

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Usuario NO autenticado
  if (!token) {
    return (
        <View style={s.container}>
        <Text style={s.title}>Bienvenido</Text>
        <Button title="Iniciar Sesión"
                onPress={() => navigation.navigate('Login')}
                color={colors.primary} />
        <View style={{ height:16 }} />
        <Button title="Registrarse"
                onPress={() => navigation.navigate('RegistroIniciar')}
                color={colors.secondary} />
        </View>
    );    
  }


  // Usuario autenticado
  return (
    <View style={s.container}>
      <Text style={s.label}>Nombre</Text>
      <Text style={s.value}>{nickname}</Text>

      <Text style={s.label}>Correo</Text>
      <Text style={s.value}>{mail}</Text>


   {!isAlumno && (
     <>
       <View style={{ height:32 }} />
       <Button
         title="Convertirme en alumno"
         onPress={() => navigation.navigate('UpgradeAlumno')}
         color={colors.primary}
       />
     </>
   )}

      <View style={{ height:32 }} />

      <Button
        title="Cambiar contraseña"
        onPress={() => navigation.navigate('PasswordResetRequest')}
        color={colors.primary}
      />
      <View style={{ height:16 }} />
      <Button
        title="Cerrar sesión"
        onPress={async () => {
          await AsyncStorage.clear();
          navigation.navigate('Recetas');
        }}
        color={colors.error}
      />
       <View style={{ height:16 }} />
     <Button
        title="Mis recetas"
        onPress={goToMyRecipes}
        color={colors.primary}
      />
    </View>
  );
}

const s = StyleSheet.create({
  center:    { flex:1, justifyContent:'center', alignItems:'center' },
  container: { flex:1, padding:24, backgroundColor:colors.background },
  title:     { fontSize:24, fontWeight:'600', color:colors.primary, marginBottom:32, textAlign:'center' },
  label:     { fontSize:14, color:colors.text, marginTop:12 },
  value:     { fontSize:18, color:colors.text, fontWeight:'500', marginBottom:8 },
});
