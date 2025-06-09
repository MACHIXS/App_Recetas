import { Pressable, StyleSheet, Button, Image, TextInput } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function Registro1() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete los siguientes datos</Text>
      <View>
      <Text>Alias</Text>
        <TextInput>Example</TextInput>
      </View>
      <View>
      <Text>Correo electronico</Text>
        <TextInput> correo@example.com</TextInput>
      </View>
      <Text>Se le enviara una clave para seguir con el proceso de registro</Text>
      <Button title = "Registrarse como alumno"/>
      <Button title = "Continuar"/>
      <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "start",
    justifyContent: "start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  logo: {
    Color: "rgba(89, 87, 87, 0)",
  },
});
