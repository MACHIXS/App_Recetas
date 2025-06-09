import { Pressable, StyleSheet, Button, Image, TextInput } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function Registro1() {
  return (
    <View style={styles.container}>
      <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
      <Text style={styles.title}>Complete los siguientes datos</Text>
      <View>
      <Text>Correo Electronico</Text>
        <TextInput>correo@example.com</TextInput>
      </View>
      <View>
      <Text>Contraseña</Text>
        <TextInput>*******</TextInput>
      </View>
      <Pressable> <Text>Ha olvidado la contraseña?</Text> </Pressable>
      <Button title = "Iniciar sesion"/>
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
