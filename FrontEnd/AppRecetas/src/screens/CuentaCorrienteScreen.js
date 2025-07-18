// src/screens/CuentaCorrienteScreen.js
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import colors from '../theme/colors'
import { getInscripciones } from '../api/courses'  // tu helper para /api/cursos/inscripciones

export default function CuentaCorrienteScreen() {
  const [inscripciones, setInscripciones] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const token = await AsyncStorage.getItem('jwt')
        const { data } = await getInscripciones({ 
          headers: { Authorization: `Bearer ${token}` }
        })
        //console.log('>>> inscripciones raw:', data)
        setInscripciones(data)
      } catch (e) {
        console.error(e)
        setError('No se pudo cargar la cuenta corriente.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  )
  if (error) return (
    <View style={styles.center}>
      <Text style={{ color: colors.error }}>{error}</Text>
    </View>
  )

  // 1) Calcular total gastado sumando el precio de cada curso
  const total = inscripciones.reduce((sum, item) => {
    const precio = item.cronograma?.curso?.precio ?? 0
    return sum + (isNaN(precio) ? 0 : precio)
  }, 0)

  // 2) Helper para formatear las fechas en iOS/Android
  const fmtFecha = raw => {
    if (!raw) return ''
    // converimos "2025-08-05" => "2025/08/05" para que new Date(...) no explote en iOS
    const safe = raw.replace(/-/g, '/').split('T')[0]
    const d = new Date(safe)
    return isNaN(d) ? raw : d.toLocaleDateString()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalLabel}>Total Gastado:</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>

      <FlatList
        data={inscripciones}
        keyExtractor={item => String(item.idAsistencia)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const curso     = item.cronograma.curso
          const monto     = curso.precio ?? 0
          const inscFecha = fmtFecha(item.fecha)
          const inicio    = fmtFecha(item.cronograma.fechaInicio)
          const fin       = fmtFecha(item.cronograma.fechaFin)
          const horario   = item.cronograma.horario ?? curso.horario ?? ''
          const estadoCC  = item.alumno.cuentaCorriente

          return (
            <View style={styles.card}>
              <Text style={styles.courseTitle}>{curso.descripcion}</Text>
              <Text>💳 Monto pagado: ${monto}</Text>
              <Text>📅 Inscripción: {inscFecha}</Text>
              <Text>🗓 Inicio: {inicio} • Fin: {fin}</Text>
              <Text>⏰ Horario: {horario}</Text>
              <Text>🔒 Saldo CC: ${estadoCC}</Text>
            </View>
          )
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay movimientos.</Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.background },
  center:      { flex:1, justifyContent:'center', alignItems:'center' },
  header:      {
    backgroundColor:'#fff',
    padding:16,
    borderBottomWidth:1,
    borderColor:'#eee'
  },
  totalLabel:  { fontSize:16, color:colors.secondary },
  totalValue:  {
    fontSize:24,
    fontWeight:'600',
    color:colors.primary,
    marginTop:4
  },
  card: {
    backgroundColor:'#fff',
    padding:12,
    borderRadius:8,
    marginBottom:12,
    shadowColor:'#000',
    shadowOpacity:0.05,
    shadowRadius:4,
    elevation:2
  },
  courseTitle: {
    fontSize:18,
    fontWeight:'600',
    marginBottom:4
  },
  empty: {
    textAlign:'center',
    color:colors.secondary,
    marginTop:32
  }
})
