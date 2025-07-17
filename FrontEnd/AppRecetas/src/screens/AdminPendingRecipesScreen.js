import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminPendingRecipesScreen() {
  const [recipes, setRecipes] = useState([]);
  const [token, setToken]     = useState(null);
  const BACKEND = 'http://192.168.0.242:8080/api/recetas';

  // 1) leo token
  useEffect(() => {
    AsyncStorage.getItem('jwt')
      .then(t => setToken(t))
      .catch(console.error);
  }, []);

  // 2) cargo pendientes
  useEffect(() => {
    if (token) fetchPendientes();
  }, [token]);

  const fetchPendientes = async () => {
    try {
      const res = await axios.get(
        `${BACKEND}/pendientes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecipes(res.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No pude obtener recetas pendientes');
    }
  };

  const handleAction = async (id, action) => {
  try {
    await axios({
      method: action === 'aprobar' ? 'patch' : 'delete',
      url: `${BACKEND}/${id}/${action}`,
      headers: { Authorization: `Bearer ${token}` },
      // body en patch; en delete no hace falta
      data: action === 'aprobar' ? {} : undefined
    });
    Alert.alert('Ok', `Receta ${action}ada`);
    fetchPendientes();
  } catch (e) {
    console.error(e);
    Alert.alert('Error', `No se pudo ${action}`);
  }
};

  const renderItem = ({ item }) => (
    <View style={s.card}>
      <Image
        source={{ uri: item.fotoPrincipal }}
        style={s.thumb}
        resizeMode="cover"
      />
      <View style={s.info}>
        <Text style={s.title}>{item.nombreReceta}</Text>
        <Text style={s.sub}>{item.nickname}</Text>
        <View style={s.buttons}>
          <TouchableOpacity
            style={[s.btn, { backgroundColor: '#4CAF50' }]}
            onPress={() => handleAction(item.idReceta, 'aprobar')}
          >
            <Text style={s.btnText}>Aprobar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, { backgroundColor: '#F44336' }]}
            onPress={() => handleAction(item.idReceta, 'rechazar')}
          >
            <Text style={s.btnText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <Text style={s.header}>Recetas Pendientes</Text>
      <FlatList
        data={recipes}
        keyExtractor={r => r.idReceta.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={s.empty}>No hay recetas pendientes</Text>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:16 },
  header:    { fontSize:22, fontWeight:'bold', marginBottom:12 },
  card:      {
    flexDirection:'row',
    marginBottom:12,
    borderWidth:1,
    borderColor:'#ddd',
    borderRadius:8,
    overflow:'hidden'
  },
  thumb:     { width:100, height:100 },
  info:      { flex:1, padding:8, justifyContent:'space-between' },
  title:     { fontSize:16, fontWeight:'600' },
  sub:       { color:'#666', marginBottom:8 },
  buttons:   { flexDirection:'row' },
  btn:       {
    flex:1,
    paddingVertical:6,
    marginRight:8,
    borderRadius:4,
    alignItems:'center'
  },
  btnText:   { color:'#fff', fontWeight:'600' },
  empty:     { textAlign:'center', marginTop:20, color:'#666' }
});
