import { Pressable, StyleSheet, Button, Image, TextInput } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function Registro3() {
  return (
    <View style={styles.container}>
      <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
      <Text style={styles.title}>Complete los siguientes datos</Text>
      <View>
        <View>
        <Text>Nombre</Text>
          <TextInput>Example</TextInput>
        </View>
        <View>
        <Text>Apellido</Text>
          <TextInput> Example</TextInput>
        </View>
      </View>
      <View>
      <Text>Contraseña</Text>
        <TextInput>**********</TextInput>
      </View>
      <View>
      <Text>Fecha de nacimiento</Text>
        <TextInput>DD/MM/AAAA</TextInput>
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
  logo: {
    Color: "rgba(89, 87, 87, 0)",
  },
});
