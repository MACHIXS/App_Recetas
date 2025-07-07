import React, { useEffect, useRef } from 'react';
import { SafeAreaView, ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen({ route, navigation }) {
  const { url, cronogramaId } = route.params;
  const webviewRef = useRef(null);

  // Opcional: mostrar un loading spinner al cargar la WebView
  const [loading, setLoading] = React.useState(true);

  const onNavigationStateChange = (navState) => {
    // Detectar cuando la URL cambie a tu esquema deep-link, ej:
    // apprecetas://payment/success o failure
    if (navState.url.startsWith('apprecetas://payment/')) {
      const [, , status] = navState.url.split('/'); // ["apprecetas:","", "payment","success"]
      navigation.replace('Inscripciones'); // o donde quieras regresar
      // También podrías llamar a tu endpoint de inscripción aquí, p.ej:
      // if (status === 'success') inscribirCurso(cronogramaId)
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <WebView
        ref={webviewRef}
        source={{ uri: url }}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={onNavigationStateChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1 },
  loader:{ position: 'absolute', top:0, bottom:0, left:0, right:0, justifyContent:'center', alignItems:'center', zIndex:1 },
});
