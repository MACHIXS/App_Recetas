// src/screens/PaymentScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import { createPaymentPreference } from '../api/payments'; // tu cliente
import colors from '../theme/colors';

export default function PaymentScreen({ route, navigation }) {
  const { cronogramaId, price } = route.params;
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      // Llamás al endpoint POST /api/payments/create-preference
      // que te devuelve un objeto { initPoint: 'https://....' }
      const { data } = await createPaymentPreference({
        cronogramaId,
        amount: price,
        // podés pasarle cualquier otro dato que tu backend necesite
      });

      if (!data.initPoint) {
        throw new Error('No vino URL de checkout');
      }

      // Navegás al WebView, que pusimos en CourseStack como "WebviewScreen"
      navigation.navigate('WebviewScreen', {
        url: data.initPoint,
        cronogramaId
      });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo iniciar el pago.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Vas a pagar ${price} por este curso.
      </Text>
      <Button
        title="Pagar con Mercado Pago"
        onPress={handlePay}
        color={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    marginBottom: 16,
    fontSize: 18
  }
});
