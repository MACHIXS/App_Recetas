import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Alert, StyleSheet
} from 'react-native';
import { getPendingRatings, approveRating, rejectRating } from '../api/recipes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../theme/colors';

export default function AdminPendingRatingsScreen() {
  const [list, setList] = useState([]);

  const fetch = async () => {
    try {
      const { data } = await getPendingRatings();
      setList(data);
    } catch {
      Alert.alert('Error', 'No pude cargar calificaciones pendientes');
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const onApprove = async id => {
    try {
      await approveRating(id);
      Alert.alert('Ok', 'Calificación aprobada');
      fetch();
    } catch {
      Alert.alert('Error', 'No se pudo aprobar');
    }
  };

  const onReject = async id => {
    try {
      await rejectRating(id);
      Alert.alert('Ok', 'Calificación rechazada');
      fetch();
    } catch {
      Alert.alert('Error', 'No se pudo rechazar');
    }
  };

  const renderItem = ({ item }) => (
    <View style={s.row}>
      <View style={{ flex:1 }}>
        <Text style={s.title}>{item.nombreReceta}</Text>
        <Text>{item.nickname} — ⭐ {item.calificacion}</Text>
        {item.comentarios ? <Text style={s.comment}>{item.comentarios}</Text> : null}
      </View>
      <View style={s.buttons}>
        <TouchableOpacity onPress={() => onApprove(item.id)} style={[s.btn, {backgroundColor: '#4CAF50'}]}>
          <Text style={s.btnText}>Aprobar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onReject(item.id)} style={[s.btn, {backgroundColor: colors.error}]}>
          <Text style={s.btnText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <Text style={s.header}>Calificaciones Pendientes</Text>
      <FlatList
        data={list}
        keyExtractor={i => String(i.id)}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={s.empty}>No hay pendientes</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#fff' },
  header:    { fontSize:22, fontWeight:'600', marginBottom:12 },
  row:       { flexDirection:'row', marginBottom:12, padding:12, borderWidth:1, borderColor:'#ddd', borderRadius:8 },
  title:     { fontSize:16, fontWeight:'500' },
  comment:   { fontStyle:'italic', marginTop:4 },
  buttons:   { justifyContent:'space-between' },
  btn:       { padding:8, borderRadius:4, marginVertical:2 },
  btnText:   { color:'#fff', fontWeight:'600' },
  empty:     { textAlign:'center', marginTop:20, color:'#666' }
});
