import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { aiCenter, bgColor, cText, cTextDark, flex1, hFull, mbAuto, wFull } from "../../constants/styles"
import { Image, Text, View } from "react-native"
import Button from "../../components/buttons/Button"
import { useNavigation } from "@react-navigation/native"


const PaymentValidated = () => {
  const navigation = useNavigation();


  return (
    <SafeAreaView style={[bgColor, flex1]}>
      <View style={[wFull, aiCenter, flex1]}>
        <Image
          source={require('../../assets/icons/validated.png')}
          style={{
            width: 300,
            height: 300,
            marginTop: 'auto'
          }}
        />

        <Text style={[cTextDark]}>
          Paiement réussi !
        </Text>

        <Text style={[cText, mbAuto]}>
          Votre commande va arriver bientôt !
        </Text>
      </View>

      <Button
        value="Revenir en arrière"
        onPress={() => navigation.goBack()}
      />
    </SafeAreaView>
  )
}


export default PaymentValidated;