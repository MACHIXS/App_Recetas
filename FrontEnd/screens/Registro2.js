import { StyleSheet, Button, } from "react-native";
import {useState} from "react";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { TextInput } from "react-native-gesture-handler";

export default function Registro2() {

  const [inputValue, setInputValue] = useState('');

  const handleChange = (text) => {
    // Allow only numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setInputValue(numericValue);
  };

  return (
    <View style={styles.container}>
      <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
      <Text style={styles.title}>Ingrese su clave</Text>
      <TextInput keyboardType="numeric"
        value={inputValue}
        onChangeText={handleChange} />
      <Button title = "Continuar"/>
    </View>
    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});
