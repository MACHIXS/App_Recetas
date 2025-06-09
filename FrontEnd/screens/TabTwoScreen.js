import { Pressable, StyleSheet, Button, Image, TextInput } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function TabTwoScreen() {
  return (
      <View style={styles.container}>
        <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
        <Text style={styles.title}>Complete los siguientes datos</Text>
        
        <View>
        <Text>Numero de targeta</Text>
          <TextInput>Example</TextInput>
        </View>
        <View>
        <Text>Nombre del titular</Text>
          <TextInput> Example</TextInput>
        </View>
        <View>
          <View>
          <Text>Vencimiento</Text>
            <TextInput>MM/AA</TextInput>
          </View>
          <View>
          <Text>Codigo de seguridad</Text>
            <TextInput>CVV</TextInput>
          </View>
        </View>
        <Button title = "Continuar"/>
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
