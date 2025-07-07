import React, { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { getIngredientes, getRecetas, getTipos, getRecetasPorIngrediente} from '../api/recipes';
import RecipeCard from '../components/RecipeCard';
import colors from '../theme/colors';

export default function RecipeListScreen({ navigation }) {
  const [recetas, setRecetas]       = useState([]);
  const [tipos,   setTipos]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error,   setError]         = useState(null);

  // filtros/ordenamientos
  const [search,     setSearch]     = useState('');
  
// ► dropdown de orden
const [openOrder, setOpenOrder]   = useState(false);
const [orderValue, setOrderValue] = useState('nuevas');
const [orderItems, setOrderItems] = useState([
    { label: 'Alfabético', value: 'alfabetico' },
    { label: 'Más nuevas', value: 'nuevas' },
]);

// ► dropdown de categoría
const [openTipo, setOpenTipo]       = useState(false);
const [tipoValue, setTipoValue]     = useState('');
const [tipoItems, setTipoItems]     = useState([]);


const [ingredientes, setIngredientes] = useState([]);
const [openIng, setOpenIng]           = useState(false);
const [ingValue, setIngValue]         = useState('');
const [ingItems, setIngItems]         = useState([]);



  // cargar datos y tipos
  useEffect(() => {
    (async () => {
      try {
        const [{ data: recs }, { data: tiposData }, { data: ingData }] = 
        await Promise.all([
        getRecetas(),
        getTipos(),
        getIngredientes()
  ]);


        setRecetas(recs);
        
        setTipos(tiposData);
        // inicializar items de categoria *después* de cargar tipos
        setTipoItems([
        { label: 'Todas las categorías', value: '' },
        ...tiposData.map(t => ({ label: t.descripcion, value: t.idTipo })),
        ]);

        setIngredientes(ingData);
        setIngItems([
        { label: 'Todos los ingredientes', value: '' },
        ...ingData.map(i => ({ label: i.nombre, value: i.nombre }))
        ]);


      } catch (e) {
        setError('No se pudieron cargar las recetas.');
      } finally {
        setLoading(false);
      }


    })();
  }, []);

  useEffect(() => {
  // Si quita el filtro (ingValue === ''), recargamos todas las recetas
  if (!ingValue) {
    setLoading(true);
    getRecetas()
      .then(resp => {
        setRecetas(resp.data);
        setError(null);
      })
      .catch(() => {
        setError('No se pudieron cargar las recetas.');
      })
      .finally(() => {
        setLoading(false);
      });
    return;
  }

  // Caso filtro activo
  setLoading(true);
  getRecetasPorIngrediente(ingValue)
    .then(resp => {
      setRecetas(resp.data);
      setError(null);
    })
    .catch(() => {
      setError('Error cargando por ingrediente.');
    })
    .finally(() => {
      setLoading(false);
    });
}, [ingValue]);

  // resultados filtrados + ordenados
  const displayList = useMemo(() => {
    let list = recetas;

    if (tipoValue) {
        list = list.filter(r => r.idTipo === tipoValue);
    }

    // búsqueda por nombre
    if (search) {
      const term = search.toLowerCase();
      list = list.filter(r => 
        r.nombreReceta.toLowerCase().includes(term)
      );
    }

    // ordenamiento
    list = [...list].sort((a, b) => {
    if (orderValue === 'nuevas') {
        return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      } else {
        return a.nombreReceta.localeCompare(b.nombreReceta);
      }
    });

   // Mostrar solo las 3 más recientes si NO hay búsqueda ni filtro de categoría
    if (!search && !tipoValue) {
     list = list.slice(0, 3);
    } 


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

    {/* BARRA DE BÚSQUEDA */}
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

    {/* DROPDOWN ORDEN */}
    <DropDownPicker
        open={openOrder}
        value={orderValue}
        items={orderItems}
        setOpen={setOpenOrder}
        setValue={setOrderValue}
        setItems={setOrderItems}
        containerStyle={[s.dropdownContainer, { zIndex: 1000 }]}
        style={s.dropdown}
        dropDownContainerStyle={s.dropdownList}
    />

          {/* DROPDOWN CATEGORÍA */}
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

        {/* DROP DOWN INGREDIENTE */}
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8}}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  searchWrapper: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#fff',
     borderRadius: 8,
     paddingHorizontal: 8,
     height: 40,
     marginBottom: 12,
   },
   searchIcon: {marginRight: 6},
   searchInput: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 0 },

   dropdownContainer: { marginBottom: 12 },
   dropdown:          { backgroundColor: '#fff', borderRadius: 8, height: 40 },
   dropdownList:      { backgroundColor: '#fff', borderRadius: 8 },
  
});
