import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { aiCenter, bgColor, cText, cTextDark, flex1, hFull, mbAuto, wFull } from "../../constants/styles"
import { Image, Text, View } from "react-native"
import Button from "../../components/buttons/Button"
import { useNavigation } from "@react-navigation/native"


const PaymentFailed = () => {
  const navigation = useNavigation();


  return (
    <SafeAreaView style={[bgColor, flex1]}>
      <View style={[wFull, aiCenter, flex1]}>
        <Image
          source={require('../../assets/icons/failed.png')}
          style={{
            width: 300,
            height: 300,
            marginTop: 'auto'
          }}
        />

        <Text style={[cTextDark]}>
          Paiement échoué !
        </Text>

        <Text style={[cText, mbAuto]}>
          Quelque chose s'est mal passé !
        </Text>
      </View>

      <Button
        value="Revenir en arrière"
        onPress={() => navigation.goBack()}
      />
    </SafeAreaView>
  )
}


export default PaymentFailed;