import { Pressable, StyleSheet, Button, Image, TextInput } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.home}>
      <Pressable>
      </Pressable>
      </View>
      <Text style={styles.title}>Cambiar contraseña</Text>

      <View>
      <Text>Contraseña</Text>
        <TextInput>*********</TextInput>
      </View>
      <View>
      <Text>Confirmar Contraseña</Text>
        <TextInput>*********</TextInput>
      </View>
      <Button title = "Finalizar"/>
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
  home: {
    width: 50,
    height: 50,
    Color: "rgba(175, 145, 145, 0)",
  },
});
