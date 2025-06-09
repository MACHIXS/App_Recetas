import { StyleSheet, Button, Pressable } from "react-native";
import {useState} from "react";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { TextInput } from "react-native-gesture-handler";

export default function CodigoContraseña() {

  const [inputValue, setInputValue] = useState('');

  const handleChange = (text) => {
    // Allow only numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setInputValue(numericValue);
  };

  return (
      <View style={styles.container}>
        <View style={styles.home}>
        <Pressable>
        </Pressable>
        </View>
        <Text style={styles.title}>Recupero de contraseña</Text>
        <Text>Ingrese el PIN de 4 dígitos enviado a su correo electrónico</Text>
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
