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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  getIngredientes,
  getRecetas,
  getTipos,
  getRecetasPorIngrediente,
  getRecetasSinIngrediente,
  getRecetasPorUsuario
} from '../api/recipes';
import RecipeCard from '../components/RecipeCard';
import colors from '../theme/colors';

export default function RecipeListScreen({ navigation }) {
  const [recetas, setRecetas]       = useState([]);
  const [tipos,   setTipos]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error,   setError]         = useState(null);

  // filtros y dropdowns
  const [search,      setSearch]     = useState('');
  const [openOrder,   setOpenOrder]  = useState(false);
  const [orderValue,  setOrderValue] = useState('nuevas');
  const [orderItems]                = useState([
    { label: 'Alfabético',   value: 'alfabetico' },
    { label: 'Más nuevas',    value: 'nuevas' },
    { label: 'Más antiguas',  value: 'antiguas' },
  ]);

  const [openTipo,   setOpenTipo]   = useState(false);
  const [tipoValue,  setTipoValue]  = useState('');
  const [tipoItems,  setTipoItems]  = useState([]);

  const [openIng,    setOpenIng]    = useState(false);
  const [ingValue,   setIngValue]   = useState('');
  const [ingItems,   setIngItems]   = useState([]);

  const [openExcl, setOpenExcl] = useState(false);
  const [exclValue, setExclValue] = useState('');
  const [exclItems, setExclItems] = useState([]);
  const [userFilter, setUserFilter] = useState('');
  const [showAll, setShowAll] = useState(false);

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isLogged, setIsLogged] =useState([]);


  // 1) recarga global al ganar foco
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const t = await AsyncStorage.getItem('jwt');
        if (active) setIsLogged(!!t);
      })();

      setLoading(true);
      setError(null);

      (async () => {
        try {
          const [{ data: recs }, { data: tiposData }, { data: ingData }] =
            await Promise.all([getRecetas(), getTipos(), getIngredientes()]);
          if (!active) return;

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
          setExclItems([
            {label: 'Excluir Ingrediente', value: ''},
            ...ingData.map(i => ({label: i.nombre, value: i.nombre }))
          ])
        } catch (e) {
          if (active) setError('No se pudieron cargar las recetas.');
        } finally {
          if (active) setLoading(false);
        }
      })();

      return () => { active = false; };
    }, [])
  );

  // 2) filtrado por ingrediente/reactivación
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const fetch = ingValue === ''
        ? getRecetas()
        : getRecetasPorIngrediente(ingValue);

      fetch
        .then(resp => setRecetas(resp.data))
        .catch(() => setError(ingValue ? 'Error cargando por ingrediente.' : 'No se pudieron cargar las recetas.'))
        .finally(() => setLoading(false));
    }, [ingValue])
  );


//filtro sin ingrediente
  useFocusEffect(
  useCallback(() => {
    setLoading(true);
    setError(null);

    const fetchPromise = exclValue
      ? getRecetasSinIngrediente(exclValue)
      : ingValue
        ? getRecetasPorIngrediente(ingValue)
        : getRecetas();

    fetchPromise
      .then(resp => setRecetas(resp.data))
      .catch(err => {
        console.error(err);
        setError('Error cargando recetas');
      })
      .finally(() => setLoading(false));
  }, [ingValue, exclValue])
);

//Filtrar usuario
useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const fetchPromise = userFilter
      ? getRecetasPorUsuario(userFilter)
      : ingValue
        ? getRecetasPorIngrediente(ingValue)
        : exclValue
          ? getRecetasSinIngrediente(exclValue)
          : getRecetas();

    fetchPromise
      .then(resp => { if (active) setRecetas(resp.data) })
      .catch(() => { if (active) setError('Error cargando recetas'); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [ingValue, exclValue]));


  // 3) composición + búsqueda + orden + slice 3
  const displayList = useMemo(() => {
    let list = recetas;

    // filtro por tipo
    if (tipoValue) {
      list = list.filter(r => r.idTipo === tipoValue);
    }
    // búsqueda por nombre
    if (search) {
      const term = search.toLowerCase();
      list = list.filter(r => r.nombreReceta.toLowerCase().includes(term));
    }
    if (userFilter) {
      const term = userFilter.toLowerCase();
      list = list.filter(r => r.nickname.toLowerCase().includes(term)
  );
}

    // orden
    list = [...list].sort((a, b) => {
      if (orderValue === 'nuevas') {
        return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      }
      if (orderValue === 'antiguas') {
        return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
      }
      // alfabetico
      return a.nombreReceta.localeCompare(b.nombreReceta);
    });


    const noFilters = !search && !tipoValue && !ingValue && !exclValue && !userFilter;
   if (noFilters && !showAll) {
     list = list.slice(0, 3);
   }
  return list;
  }, [recetas, search, tipoValue, ingValue, exclValue, orderValue, showAll, userFilter]);

  // estados de carga/error
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

  // cabecera con filtros
  const renderHeader = () => (
    <View style={s.filtersContainer}>
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
        <TextInput
        style={[s.searchInput, { marginBottom: 0 , borderWidth: 1, borderRadius: 8, borderColor: '#ddd', paddingVertical: 10, paddingLeft: 9, paddingRight: 20}]}
        placeholder="Filtrar por autor..."
        placeholderTextColor={colors.secondary}
        value={userFilter}
        onChangeText={setUserFilter}
        autoCapitalize="none"
        returnKeyType='done'
      />
      </View>

      
    {/* Toggle Accordion */}
    <TouchableOpacity
      style={s.filtersToggle}
      onPress={() => setFiltersVisible(v => !v)}
    >
      <Text style={s.filtersToggleText}>
        {filtersVisible ? 'Ocultar filtros ▲' : 'Mostrar filtros ▼'}
      </Text>
    </TouchableOpacity>

    {filtersVisible && (
      <>
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

        {/* Tipo de receta */}
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

        {/* Con ingrediente */}
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

        {/* Sin ingrediente */}
        <DropDownPicker
          open={openExcl}
          value={exclValue}
          items={exclItems}
          setOpen={setOpenExcl}
          setValue={setExclValue}
          setItems={setExclItems}
          placeholder="Excluir ingrediente"
          containerStyle={[s.dropdownContainer, { zIndex: 700 }]}
          style={s.dropdown}
          dropDownContainerStyle={s.dropdownList}
        />
      </>
    )}
    </View>
  );

  // render de cada receta
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 }}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"

           ListFooterComponent={() => {
      // sólo mostrar si NO hay filtros activos
      const noFilters = !search && !tipoValue && !ingValue && !exclValue && !userFilter;
      if (!noFilters) return null;

      return (
        <View style={s.footerContainer}>
          <TouchableOpacity onPress={() => setShowAll(v => !v)}>
            <Text style={s.footerText}>
              {showAll
                ? 'Ver sólo 3 recetas ▲'
                : 'Ver todas las recetas ▼'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }}
      />

      {/* FAB para crear receta */}
      {isLogged && (
        
      <TouchableOpacity
        style={s.fab}
        onPress={() => navigation.navigate('RecipeForm')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: colors.background },
  center:            { flex:1, justifyContent: 'space-evenly', alignItems:'center' },
  filtersContainer:  { marginBottom: 16 },
  footerContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  filtersContainer:  { marginBottom: 1, paddingHorizontal: 16},
  filtersToggle:     { borderWidth: 1,
  borderColor: '#ddd',       
  borderRadius: 8,           
  paddingVertical: 8,
  paddingHorizontal: 12,
  backgroundColor: '#fff',   
  alignItems: 'center',
  marginBottom: 12},
  
  filtersToggleText: { color: colors.primary, fontWeight: '600'},
  dropdownContainer: { marginBottom: 12 },
  dropdown:          { backgroundColor: '#fff', borderRadius: 8, height: 40 },
  dropdownList:      { backgroundColor: '#fff', borderRadius: 8 },
  footerText: {
    color: colors.primary,
    fontWeight: '600', 
  },
  searchWrapper:     {
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#fff',
    borderRadius:8,
    paddingHorizontal:8,
    height:40,
    marginBottom:12, marginTop:10
    , borderWidth: 1, borderRadius: 8, borderColor: '#ddd'
  },
  searchIcon:        { marginRight:6 },
  searchInput:       { flex:1, fontSize:16, color:colors.text, paddingVertical:0},
  dropdownContainer: { marginBottom:12 },
  dropdown:          { backgroundColor:'#fff', borderRadius:8, height:40 },
  dropdownList:      { backgroundColor:'#fff', borderRadius:8 },
  loadMoreBtn:       { padding: 16, alignItems: 'center'},
  loadMoreText:      {color: colors.primary, fontWeight: '600'},
  fab:               {
    position: 'absolute',
    bottom: 24, right: 24,
    backgroundColor: colors.primary,
    width: 56, height: 56,
    borderRadius: 28,
    justifyContent:'center', alignItems:'center',
    elevation:4
  }
});
