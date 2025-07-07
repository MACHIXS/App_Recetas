import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import {
  getIngredientes,
  getRecetas,
  getTipos,
  getRecetasPorIngrediente,
} from '../api/recipes';
import RecipeCard from '../components/RecipeCard';
import colors from '../theme/colors';

export default function RecipeListScreen({ navigation }) {
  const [recetas, setRecetas]       = useState([]);
  const [tipos,   setTipos]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error,   setError]         = useState(null);

  // filtros y estados de dropdowns
  const [search,     setSearch]     = useState('');
  const [openOrder, setOpenOrder]   = useState(false);
  const [orderValue, setOrderValue] = useState('nuevas');
  const [orderItems] = useState([
    { label: 'Alfabético', value: 'alfabetico' },
    { label: 'Más nuevas', value: 'nuevas' },
  ]);

  const [openTipo, setOpenTipo]       = useState(false);
  const [tipoValue, setTipoValue]     = useState('');
  const [tipoItems, setTipoItems]     = useState([]);

  const [openIng, setOpenIng]         = useState(false);
  const [ingValue, setIngValue]       = useState('');
  const [ingItems, setIngItems]       = useState([]);

  // 1) Cada vez que la pantalla gana foco, recargamos recetas, tipos e ingredientes
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);
      setError(null);

      (async () => {
        try {
          console.log('🔄 Cargando recetas, tipos e ingredientes…');
          const [{ data: recs }, { data: tiposData }, { data: ingData }] =
            await Promise.all([getRecetas(), getTipos(), getIngredientes()]);

          if (!isActive) return;
          console.log('✅ Datos recibidos:', recs.length, 'recetas,', tiposData.length, 'tipos,', ingData.length, 'ingredientes');
          setRecetas(recs);
          setTipos(tiposData);
          setTipoItems([
            { label: 'Todas las categorías', value: '' },
            ...tiposData.map(t => ({ label: t.descripcion, value: t.idTipo })),
          ]);
          setIngItems([
            { label: 'Todos los ingredientes', value: '' },
            ...ingData.map(i => ({ label: i.nombre, value: i.nombre })),
          ]);
        } catch (e) {
          console.error('❌ Error cargando datos:', e);
          if (isActive) setError('No se pudieron cargar las recetas.');
        } finally {
          if (isActive) setLoading(false);
        }
      })();

      return () => { isActive = false; };
    }, [])
  );

  // 2) Cuando cambia ingValue, filtramos (o recargamos todo si vació)
  useFocusEffect(
    useCallback(() => {
      if (ingValue === '') {
        setLoading(true);
        getRecetas()
          .then(resp => setRecetas(resp.data))
          .catch(() => setError('No se pudieron cargar las recetas.'))
          .finally(() => setLoading(false));
      } else {
        setLoading(true);
        getRecetasPorIngrediente(ingValue)
          .then(resp => setRecetas(resp.data))
          .catch(() => setError('Error cargando por ingrediente.'))
          .finally(() => setLoading(false));
      }
    }, [ingValue])
  );

  // 3) Composición final + búsqueda + orden + (slice de 3 comentado)
  const displayList = useMemo(() => {
    let list = recetas;

    if (tipoValue) {
      list = list.filter(r => r.idTipo === tipoValue);
    }
    if (search) {
      const term = search.toLowerCase();
      list = list.filter(r => r.nombreReceta.toLowerCase().includes(term));
    }
    list = [...list].sort((a, b) => {
      if (orderValue === 'nuevas') {
        return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      } else {
        return a.nombreReceta.localeCompare(b.nombreReceta);
      }
    });

    // Mostrar solo las 3 más recientes si NO hay búsqueda ni filtro de tipo
    // if (!search && !tipoValue) {
    //   list = list.slice(0, 3);
    // }

    return list;
  }, [recetas, search, tipoValue, orderValue]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={s.center}>
        <Text style={{ color: colors.error }}>{error}</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={s.filtersContainer}>
      {/* Barra de búsqueda */}
      <View style={s.searchWrapper}>
        <Ionicons name="search" size={20} color={colors.secondary} style={s.searchIcon} />
        <TextInput
          style={s.searchInput}
          placeholder="Buscar receta..."
          placeholderTextColor={colors.secondary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {/* Orden */}
      <DropDownPicker
        open={openOrder}
        value={orderValue}
        items={orderItems}
        setOpen={setOpenOrder}
        setValue={setOrderValue}
        containerStyle={[s.dropdownContainer, { zIndex: 1000 }]}
        style={s.dropdown}
        dropDownContainerStyle={s.dropdownList}
      />

      {/* Tipo */}
      <DropDownPicker
        open={openTipo}
        value={tipoValue}
        items={tipoItems}
        setOpen={setOpenTipo}
        setValue={setTipoValue}
        setItems={setTipoItems}
        containerStyle={[s.dropdownContainer, { zIndex: 900 }]}
        style={s.dropdown}
        dropDownContainerStyle={s.dropdownList}
      />

      {/* Ingrediente */}
      <DropDownPicker
        open={openIng}
        value={ingValue}
        items={ingItems}
        setOpen={setOpenIng}
        setValue={setIngValue}
        setItems={setIngItems}
        containerStyle={[s.dropdownContainer, { zIndex: 800 }]}
        style={s.dropdown}
        dropDownContainerStyle={s.dropdownList}
      />
    </View>
  );

  const handlePress = receta => {
    navigation.navigate('RecipeDetail', { recetaId: receta.idReceta });
  };

  return (
    <SafeAreaView style={s.safe}>
      {renderHeader()}
      <FlatList
        data={displayList}
        keyExtractor={r => String(r.idReceta)}
        renderItem={({ item }) => <RecipeCard receta={item} onPress={handlePress} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
      />

      {/* FAB para crear receta */}
      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate('RecipeForm')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: colors.background },
  center:            { flex:1, justifyContent:'center', alignItems:'center' },
  filtersContainer:  { marginBottom: 16 },
  searchWrapper:     { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:8, paddingHorizontal:8, height:40, marginBottom:12 },
  searchIcon:        { marginRight:6 },
  searchInput:       { flex:1, fontSize:16, color:colors.text, paddingVertical:0 },
  dropdownContainer: { marginBottom:12 },
  dropdown:          { backgroundColor:'#fff', borderRadius:8, height:40 },
  dropdownList:      { backgroundColor:'#fff', borderRadius:8 },
  fab:               {
    position: 'absolute',
    bottom: 24, right: 24,
    backgroundColor: colors.primary,
    width: 56, height: 56,
    borderRadius: 28,
    justifyContent:'center', alignItems:'center',
    elevation:4
  },
});
