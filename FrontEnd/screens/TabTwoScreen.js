import { StyleSheet, TextInput, Image, ImageBackground, Button, Pressable } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

const Texto = () => {
  return <Text style={styles.testing}>Hello</Text>;
};

export default function TableTwoScreen() {
  return (
    
    <View style={styles.container}>
      <View style={styles.searchingBar}>
      <TextInput></TextInput>
      </View>
      <View
        style={styles.separatorR}
        lightColor="#eee"
        darkColor="rgba(0, 0, 0, 0)"
      />
      <View style={styles.cursos}>
        <Button style={styles.cursos} title = "Mis cursos"/>
      </View>
      <View
        style={styles.separatorR}
        lightColor="#eee"
        darkColor="rgba(0, 0, 0, 0)"
      />
      <Text style={styles.title}>Ultimos cursos</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(0, 0, 0, 0)"
      />
      
      <Pressable onPress={Texto} style={styles.CajasRecetas}>
          <ImageBackground style={styles.ImagenRecetas} source={"FrontEnd.assets.images.Pasta.jpg"}>
            <View style={styles.TextoRecetas}>
              <Text style={styles.TextoAjustes}>Matering the argentinian "Asado"</Text>
            </View>
          </ImageBackground>
          
      </Pressable>
      
      <View
        style={styles.separatorR}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Pressable onPress={Texto} style={styles.CajasRecetas}>
          <ImageBackground style={styles.ImagenRecetas} source={"https://cloudfront-us-east-1.images.arcpublishing.com/infobae/7VEGFDIQAJDKNEYEXRX3BK7DAU.jpg"}>
            <View style={styles.TextoRecetas}>
              <Text style={styles.TextoAjustes} > Cooking 101</Text>
            </View>
          </ImageBackground>
      </Pressable>
      <View
        style={styles.separatorR}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
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
 
  separator: {
    marginVertical: 5,
    height: 1,
    width: "80%",
  },
  separatorR: {
    marginVertical: 15,
    height: 1,
    width: "80%",
  },
  searchingBar: {
    height: 30,
    width: "80%",
    backgroundColor: "rgba(206, 206, 206, 0.8)",
    borderColor: "rgba(255, 145, 0, 0.8)",
    borderRadius: "5%",
    borderWidth: 1.5,
  },
  cursos: {
    height: 40,
    width: "70%",
    backgroundColor: "rgba(206, 206, 206, 0.8)",
    borderColor: "rgba(255, 145, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "5%",
    borderWidth: 1.5,
  },
  cursosTexto:{
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(0,0,0,0)"
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