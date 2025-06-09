import { StyleSheet, TextInput, Image, ImageBackground, Button, Pressable } from "react-native";
import React from 'react';
import { Text, View } from "../components/Themed";

const Texto = () => {
  return <Text style={styles.testing}>Hello</Text>;
};

export default function TabOneScreen() {
  return (
    
    <View style={styles.container}>
      <View style={styles.cajaPerfil} >
        <View style={styles.fotoDeperfil}>
          <View style={styles.circulo}></View>
        </View>
        <View style={styles.TextoPerfil}>
          <Text>Jhon Lennon</Text>
          <Text>JLennon@gmail.com</Text>
        </View>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(0, 0, 0, 0)"
      />
      <View style={styles.cajaAjustes} >
        <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(0, 0, 0, 0)"
        />
        <View style={styles.botonAjustes}>
          <Button title = "Recetas Favoritas"/>
        </View>
        <View style={styles.botonAjustes}>
          <Button title = "Modificar Datos"/>
        </View>
        <View style={styles.botonAjustes}>
          <Button title = "Cambiar Contraseña"/>
        </View>
        <View style={styles.separatorR} lightColor="#eee"
        darkColor="rgba(0, 0, 0, 0)">
        </View>
        <View style={styles.botonAjustesS}>
        <Button title = "Log out"/>
        </View>
      </View>
      

      

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "Start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "start",
    marginRight: "40%",
  },
  fotoDeperfil:{
    justifyContent: "center",
    backgroundColor:"rgba(167, 162, 162, 0.8)",
  },
  circulo:{
    width: 70,
    height: 70,
    borderRadius: "50%",
    backgroundColor: "rgba(107, 105, 102, 0.98)",
    borderColor: "rgba(255, 153, 0, 0.98)",
    borderWidth: 1.5,
  },
  TextoPerfil: {
    gap: 10,
    justifyContent: "center",
    backgroundColor:"rgba(167, 162, 162, 0.8)",
  },
 
  separator: {
    marginVertical: 5,
    height: 1,
    width: "80%",
  },
  separatorR: {
    marginVertical: 25,
    height: 1,
    width: "80%",
  },
  cajaPerfil: {
    height: 80,
    width: "80%",
    backgroundColor: "rgba(206, 206, 206, 0.8)",
    borderColor: "rgba(255, 145, 0, 0.8)",
    borderRadius: "5%",
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems:"start",
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  
  cajaAjustes: {
    height: 300,
    alignItems: "center",
    justifyContent: "start",
    width: "80%",
    backgroundColor: "rgba(206, 206, 206, 0.8)",
    borderColor: "rgba(255, 145, 0, 0.8)",
    borderRadius: "5%",
    borderWidth: 1.5,
    gap: 15,

  },
  botonAjustes: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 145, 0, 0.8)",
    width: "80%",
    borderRadius: "5%",
    borderWidth: 0,
  },

  botonAjustesS: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 145, 0, 0.8)",
    width: "40%",
    borderRadius: "5%",
    borderWidth: 0,
  },

  CajasRecetas: {
    height: 130,
    width: 240,
    borderColor: "rgba(255, 145, 0, 0.8)",
    borderRadius: "5%",
    borderWidth: 1.5,
  },
  ImagenRecetas: {
    flex: 1,
    justifyContent: "flex-end",
    height: "auto",
    width: "auto",
  },
  TextoRecetas: {
    height: 35,
    backgroundColor: "rgba(255, 145, 0, 0.8)",
    justifyContent: "center",
  },
  TextoAjustes: {
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.8)"
  },
  testing: {
    color: "rgba(255, 255, 255, 0.8)",
    height: 100,
    width: 100,
  },
});
