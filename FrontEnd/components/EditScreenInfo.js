import * as WebBrowser from "expo-web-browser";
import { StyleSheet, Pressable, Image, Button } from "react-native";

import Colors from "../constants/Colors";
import { MonoText } from "./StyledText";
import { Text, View } from "./Themed";

export default function EditScreenInfo({ path }) {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Pressable style={styles.logo}>
            <Image source = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW_zRAPzHn9JvkzyA4aG-P3QowpYtsd2GZyA&s"></Image>
        </Pressable>
        <Button title = "Registrarse"/>
        <Button title = "Iniciar sesion"/>
      </View>
    </View>
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.dev/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet"
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
});
