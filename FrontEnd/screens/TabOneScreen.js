import { StyleSheet, TextInput, Image, ImageBackground, Button } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.searchingBar}>
      <TextInput></TextInput>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(0, 0, 0, 0)"
      />
      <Text style={styles.title}>Ultimas recetas</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(0, 0, 0, 0)"
      />
      
      <View style={styles.CajasRecetas}>
          <ImageBackground style={styles.ImagenRecetas} source={"D:/Users/Usuario/Desktop/App_Recetas-main2/App_Recetas-main/FrontEnd/assets/images/Pasta.jpg"}>
            <View style={styles.TextoRecetas}>
              <TextInput textAlign="center">Sheet Pan Salmon With Asparagus</TextInput>
            </View>
          </ImageBackground>
      </View>
      
      <View
        style={styles.separatorR}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.CajasRecetas}>
          <ImageBackground style={styles.ImagenRecetas} source={"https://cloudfront-us-east-1.images.arcpublishing.com/infobae/7VEGFDIQAJDKNEYEXRX3BK7DAU.jpg"}>
            <View style={styles.TextoRecetas}>
              <TextInput textAlign="center" >Ham And Asparagus Strata</TextInput>
            </View>
          </ImageBackground>
      </View>
      <View
        style={styles.separatorR}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.CajasRecetas}>
          <ImageBackground style={styles.ImagenRecetas} source={"https://cloudfront-us-east-1.images.arcpublishing.com/infobae/7VEGFDIQAJDKNEYEXRX3BK7DAU.jpg"}>
            <View style={styles.TextoRecetas}>
              <TextInput textAlign="center">Corned Beef Tater Tot Casserole</TextInput>
            </View>
          </ImageBackground>
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

});
