
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import colors from '../theme/colors';

// Util to pick an image from gallery
async function pickImage(setter) {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a la galería');
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
  if (!result.cancelled) {
    const uri = result.uri || (result.assets && result.assets[0]?.uri);
    if (uri) setter(uri);
  }
}

// Util to upload file and return its URL
async function uploadFile(uri, token) {
  const form = new FormData();
  form.append('file', { uri, name: 'photo.jpg', type: 'image/jpeg' });
  const res = await axios.post(
    'http://192.168.0.242:8080/api/files/upload',
    form,
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
  );
  return res.data.url;
}

// Memoized form content
const FormContent = React.memo(({
  nombre, setNombre,
  descripcion, setDescripcion,
  porciones, setPorciones,
  cantidadPersonas, setCantidadPersonas,
  principalUri, setPrincipalUri,
  tipoItems, openTipo, setOpenTipo, tipoValue, setTipoValue,
  unidadItems, openUnidadId, setOpenUnidadId,
  ingredients, addIngredient, updateIngredient, removeIngredient,
  steps, addStep, updateStepText, addImageToStep,
  handleSubmit
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>Nombre</Text>
    <TextInput
      style={styles.input}
      value={nombre}
      onChangeText={setNombre}
    />

    <Text style={styles.label}>Tipo</Text>
    <DropDownPicker
      open={openTipo}
      value={tipoValue}
      items={tipoItems}
      setOpen={setOpenTipo}
      setValue={setTipoValue}
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownList}
      dropDownContainerProps={{ nestedScrollEnabled: true }}
      keyboardShouldPersistTaps="handled"
    />

    <Text style={styles.label}>Descripción</Text>
    <TextInput
      style={[styles.input, { height: 80 }]}
      value={descripcion}
      onChangeText={setDescripcion}
      multiline
    />

    <Text style={styles.label}>Foto Principal</Text>
    <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setPrincipalUri)}>
      {principalUri ? (
        <Image source={{ uri: principalUri }} style={styles.preview} />
      ) : (
        <Text style={styles.imageText}>Seleccionar Imagen</Text>
      )}
    </TouchableOpacity>

    <Text style={styles.label}>Porciones</Text>
    <TextInput
      style={styles.input}
      value={porciones}
      onChangeText={setPorciones}
      keyboardType="number-pad"
    />

    <Text style={styles.label}>Cantidad Personas</Text>
    <TextInput
      style={styles.input}
      value={cantidadPersonas}
      onChangeText={setCantidadPersonas}
      keyboardType="number-pad"
    />

    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Ingredientes</Text>
      <Button title="+ Ingrediente" onPress={addIngredient} />
    </View>
    {ingredients.map(item => (
      <View key={item.id} style={styles.ingredientRow}>
        <TextInput
          style={[styles.input, styles.ingredientInput]}
          placeholder="Nombre"
          value={item.nombre}
          onChangeText={t => updateIngredient(item.id, 'nombre', t)}
        />
        <TextInput
          style={[styles.input, styles.qtyInput]}
          placeholder="Cantidad"
          value={item.cantidad}
          onChangeText={t => updateIngredient(item.id, 'cantidad', t)}
          keyboardType="decimal-pad"
        />
        <DropDownPicker
          open={openUnidadId === item.id}
          value={item.unidad}
          items={unidadItems}
          setOpen={o => setOpenUnidadId(o ? item.id : null)}
          setValue={cb => { const val = cb(); updateIngredient(item.id, 'unidad', val); setOpenUnidadId(null); }}
          containerStyle={styles.unitPicker}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          dropDownContainerProps={{ nestedScrollEnabled: true }}
          keyboardShouldPersistTaps="handled"
        />
        <TextInput
          style={[styles.input, styles.obsInput]}
          placeholder="Observaciones"
          value={item.observaciones}
          onChangeText={t => updateIngredient(item.id, 'observaciones', t)}
        />
        <TouchableOpacity style={styles.removeBtn} onPress={() => removeIngredient(item.id)}>
          <Text style={{ color: colors.error }}>X</Text>
        </TouchableOpacity>
      </View>
    ))}

    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Pasos</Text>
      <Button title="+ Paso" onPress={addStep} />
    </View>
    {steps.map((p, idx) => (
      <View key={p.id} style={styles.stepContainer}>
        <Text style={styles.stepLabel}>Paso {idx + 1}</Text>
        <TextInput
          style={[styles.input, { height: 60 }]}
          placeholder="Describe el paso..."
          value={p.texto}
          onChangeText={t => updateStepText(p.id, t)}
          multiline
        />
        <ScrollView horizontal nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {p.images.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.stepImage} />
          ))}
          <TouchableOpacity style={styles.addImageButton} onPress={() => addImageToStep(p.id)}>
            <Text style={{ fontSize: 24, color: colors.primary }}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    ))}

    <View style={{ height: 24 }} />
    <Button title="Guardar Receta" onPress={handleSubmit} color={colors.primary} />
    <View style={{ height: 48 }} />
  </View>
));

export default function RecipeFormScreen({ navigation }) {
  const [tipoItems, setTipoItems] = useState([]);
  const [openTipo, setOpenTipo] = useState(false);
  const [tipoValue, setTipoValue] = useState(null);
  const [unidadItems, setUnidadItems] = useState([]);
  const [openUnidadId, setOpenUnidadId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [porciones, setPorciones] = useState('');
  const [cantidadPersonas, setCantidadPersonas] = useState('');
  const [principalUri, setPrincipalUri] = useState(null);
  const [ingredients, setIngredients] = useState([{ id: Date.now(), nombre: '', cantidad: '', unidad: null, observaciones: '' }]);
  const [steps, setSteps] = useState([{ id: Date.now() + 1, texto: '', images: [] }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const headers = { Authorization: `Bearer ${token}` };
        const [tRes, uRes] = await Promise.all([
          axios.get('http://192.168.0.242:8080/api/tiposReceta', { headers }),
          axios.get('http://192.168.0.242:8080/api/unidades',   { headers })
        ]);
        setTipoItems(tRes.data.map(t => ({ label: t.descripcion, value: t.idTipo })));
        setUnidadItems(uRes.data.map(u => ({ label: u.descripcion, value: u.idUnidad })));
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'No se pudieron cargar tipos o unidades.');
      }
    })();
  }, []);

  const addIngredient = () => setIngredients(list => [...list, { id: Date.now(), nombre: '', cantidad: '', unidad: null, observaciones: '' }]);
  const removeIngredient = id => setIngredients(list => list.filter(i => i.id !== id));
  const updateIngredient = (id, field, val) => setIngredients(list => list.map(i => i.id === id ? { ...i, [field]: val } : i));
  const addStep = () => setSteps(list => [...list, { id: Date.now(), texto: '', images: [] }]);
  const updateStepText = (id, text) => setSteps(list => list.map(p => p.id === id ? { ...p, texto: text } : p));
  const addImageToStep = async id => {
    await pickImage(uri => {
      if (uri) setSteps(l => l.map(p => p.id === id ? { ...p, images: [...p.images, uri] } : p));
    });
  };

const handleSubmit = async () => {
  // 1) Validaciones previas
  if (
    !nombre ||
    !tipoValue ||
    !descripcion ||
    !porciones ||
    !cantidadPersonas ||
    !principalUri
  ) {
    Alert.alert('Error', 'Completa todos los campos obligatorios');
    return;
  }
  for (let ing of ingredients) {
    if (!ing.nombre || !ing.cantidad || !ing.unidad) {
      Alert.alert('Error', 'Completa todos los campos de los ingredientes');
      return;
    }
  }
  for (let p of steps) {
    if (!p.texto) {
      Alert.alert('Error', 'Describe todos los pasos');
      return;
    }
  }

  setLoading(true);
  const token = await AsyncStorage.getItem('jwt');
  const headers = { Authorization: `Bearer ${token}` };

  // 2) Subo la foto principal y construyo el payload (DTO)
  let payload;
  try {
    const urlPrincipal = await uploadFile(principalUri, token);

    const ingredDto = ingredients.map(i => ({
      nombre:       i.nombre,
      cantidad:     parseFloat(i.cantidad),
      idUnidad:     i.unidad,
      observaciones:i.observaciones
    }));

    const pasosDto = await Promise.all(
      steps.map(async (p, idx) => ({
        nroPaso:        idx + 1,
        texto:          p.texto,
        multimediaUrls: await Promise.all(p.images.map(u => uploadFile(u, token)))
      }))
    );

    payload = {
      nombreReceta:      nombre,
      descripcionReceta: descripcion,
      fotoPrincipal:     urlPrincipal,
      porciones:         parseInt(porciones, 10),
      cantidadPersonas:  parseInt(cantidadPersonas, 10),
      idTipo:            tipoValue,
      ingredientes:      ingredDto,
      pasos:             pasosDto
    };
  } catch (errUpload) {
    setLoading(false);
    return Alert.alert(
      'Error',
      'No se pudieron subir las imágenes: ' + errUpload.message
    );
  }

  // 3) Intento crear sin replace
  try {
    await axios.post(
      'http://192.168.0.242:8080/api/recetas',
      payload,
      { headers }
    );
    Alert.alert('Éxito', 'Receta creada correctamente');
    navigation.goBack();

  } catch (e) {
    // 4) Si ya existe (409), preguntar al usuario
    if (e.response?.status === 409) {
      Alert.alert(
        'Receta existe',
        e.response.data,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Reemplazar',
            onPress: async () => {
              try {
                await axios.post(
                  'http://192.168.0.242:8080/api/recetas?replace=true',
                  payload,
                  { headers }
                );
                Alert.alert('Éxito', 'Receta reemplazada correctamente');
                navigation.goBack();
              } catch (err2) {
                Alert.alert('Error', err2.response?.data || err2.message);
              }
            }
          }
        ]
      );
    } else {
      console.error(e);
      Alert.alert('Error', e.response?.data || e.message);
    }
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={[]}
        ListHeaderComponent={<FormContent
          nombre={nombre} setNombre={setNombre}
          descripcion={descripcion} setDescripcion={setDescripcion}
          porciones={porciones} setPorciones={setPorciones}
          cantidadPersonas={cantidadPersonas} setCantidadPersonas={setCantidadPersonas}
          principalUri={principalUri} setPrincipalUri={setPrincipalUri}
          tipoItems={tipoItems} openTipo={openTipo} setOpenTipo={setOpenTipo} tipoValue={tipoValue} setTipoValue={setTipoValue}
          unidadItems={unidadItems} openUnidadId={openUnidadId} setOpenUnidadId={setOpenUnidadId}
          ingredients={ingredients} addIngredient={addIngredient} updateIngredient={updateIngredient} removeIngredient={removeIngredient}
          steps={steps} addStep={addStep} updateStepText={updateStepText} addImageToStep={addImageToStep}
          handleSubmit={handleSubmit}
        />}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        renderItem={null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { padding: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8, color: colors.text },
  input: { borderWidth: 1, borderColor: colors.text, borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: '#fff', color: colors.text },
  dropdown: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 12 },
  dropdownList: { backgroundColor: '#fff', borderRadius: 8 },
  imagePicker: { width: 120, height: 120, borderWidth: 1, borderColor: colors.text, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa', marginBottom: 12 },
  imageText: { color: colors.text },
  preview: { width: 120, height: 120, borderRadius: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  ingredientRow: { backgroundColor: '#fff', padding: 8, borderRadius: 8, marginBottom: 12 },
  ingredientInput: { flex: 2, marginBottom: 4 },
  qtyInput: { flex: 1, marginBottom: 4, marginRight: 4 },
  unitPicker: { flex: 1, marginBottom: 4 },
  obsInput: { height: 40, marginBottom: 4 },
  removeBtn: { position: 'absolute', top: 8, right: 8 },
  stepContainer: { backgroundColor: '#fff', padding: 8, borderRadius: 8, marginBottom: 12 },
  stepLabel: { fontWeight: '600', marginBottom: 4, color: colors.text },
  stepImage: { width: 80, height: 80, borderRadius: 8, marginRight: 8 },
  addImageButton: { width: 80, height: 80, borderWidth: 1, borderColor: colors.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
