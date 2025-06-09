import { StyleSheet, Button, Pressable } from "react-native";
import {useState} from "react";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { TextInput } from "react-native-gesture-handler";

export default function RegistroAlumno2() {
  return (
        <View style={styles.container}>
          <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
          <Text style={styles.title}>Complete los siguientes datos</Text>
          
          <View>
            <Text>Foto delantera DNI</Text>
            <Button title = "Cargar imagen"/>
          </View>
          <View>
            <Text>Foto trasera DNI</Text>
            <Button title = "Cargar imagen"/>
          </View>
          <View>
          <Text>Numero del tramite</Text>
            <TextInput>Example</TextInput>
          </View>
          <Button title = "Finalizar"/>
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
