import React from "react";
import { StyleSheet, Image, Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../constants/colors";
import { cPrimary, flexRow, mb24, mtAuto } from "../constants/styles";


const Splash = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.bg}
        barStyle='dark-content'
      />
      <View style={styles.center}>
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.image}
        />

        <View style={[flexRow, mtAuto, mb24]}>
          <Text style={styles.text}>Leon'</Text>
          <Text style={[styles.text, cPrimary]}>Art</Text>
        </View>
      </View>

    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg
  },
  image: {
    height: 150,
    width: 150,
    borderColor: '#2C2C2C',
    borderWidth: 3,
    borderRadius: 200,
    marginBottom: 24,
    marginTop: 'auto'
  },
  text: {
    color: '#2C2C2C',
    fontWeight: 'bold',
    fontSize: 32,
  },
  center: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center'
  }
});


export default Splash;
