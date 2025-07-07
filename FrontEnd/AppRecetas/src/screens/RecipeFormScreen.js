import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getTipos, createReceta } from '../api/recipes';
import colors from '../theme/colors';

export default function RecipeFormScreen({ navigation }) {
  const [tipos, setTipos]             = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(true);

  // Form state
  const [nombre, setNombre]           = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo]               = useState(null);
  const [openTipo, setOpenTipo]       = useState(false);
  const [tipoItems, setTipoItems]     = useState([]);

  const [fotoPrincipal, setFoto]      = useState('');
  const [porciones, setPorciones]     = useState('');
  const [cantidadPersonas, setCant]   = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getTipos();
        setTipos(data);
        setTipoItems(data.map(t => ({
          label: t.descripcion,
          value: t.idTipo
        })));
      } catch (e) {
        Alert.alert('Error', 'No se pudieron cargar los tipos');
      } finally {
        setLoadingTipos(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!nombre || !tipo) {
      Alert.alert('Faltan datos', 'Completa nombre y tipo');
      return;
    }
    const dto = {
      idTipo: Number(tipo),
      nombreReceta: nombre,
      descripcionReceta: descripcion,
      fotoPrincipal,
      porciones: Number(porciones),
      cantidadPersonas: Number(cantidadPersonas),
      ingredientes: [],   // aquí luego agregas tu array real
      pasos: []           // igual para pasos
    };
    try {
      await createReceta(dto);
      Alert.alert('¡Listo!', 'Receta enviada para aprobación', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || err.message);
    }
  };

  if (loadingTipos) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      Style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.form}>
        <Text style={styles.label}>Nombre del Plato</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Tipo de Receta</Text>
        <DropDownPicker
          open={openTipo}
          value={tipo}
          items={tipoItems}
          setOpen={setOpenTipo}
          setValue={setTipo}
          setItems={setTipoItems}
          containerStyle={{ marginBottom: 16 }}
          style={styles.dropdown}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />

        <Text style={styles.label}>URL Foto Principal</Text>
        <TextInput
          style={styles.input}
          value={fotoPrincipal}
          onChangeText={setFoto}
        />

        <View style={styles.row}>
          <View style={{ flex:1, marginRight:8 }}>
            <Text style={styles.label}>Porciones</Text>
            <TextInput
              style={styles.input}
              value={porciones}
              onChangeText={setPorciones}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex:1 }}>
            <Text style={styles.label}>Cant. Personas</Text>
            <TextInput
              style={styles.input}
              value={cantidadPersonas}
              onChangeText={setCant}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Button
          title="Enviar Receta"
          onPress={handleSubmit}
          color={colors.primary}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: colors.background },
  label:     { marginBottom: 4, fontWeight: '500' },
  input:     {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 16
  },
  dropdown:  { backgroundColor: '#fff', borderRadius: 6 },
  row:       { flexDirection: 'row', marginBottom: 16 },
  center:    { flex:1, justifyContent:'center', alignItems:'center' },
});
