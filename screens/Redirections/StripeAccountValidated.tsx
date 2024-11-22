import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { aiCenter, bgColor, cText, cTextDark, displayFlex, flex1, hFull, mbAuto, mtAuto, wFull } from "../../constants/styles";
import Button from '../../components/buttons/Button';
import { useNavigation } from '@react-navigation/native';


const StripeAccountValidated = () => {
  const navigation = useNavigation();


  return (
    <SafeAreaView style={[bgColor, flex1]}>
      <View style={[wFull, hFull, displayFlex, aiCenter]}>
        <Image
          source={require('../../assets/icons/validated.png')}
          style={{
            width: 300,
            height: 300,
            marginTop: 'auto'
          }}
        />

        <Text style={[cTextDark]}>
          Votre compte de paiement a été validé !
        </Text>
        <Text style={[cText, mbAuto]}>
          Vous pouvez acheter des oeuvres dès à présent !
        </Text>
      </View>

      <Button
        value="Retourner à l'accueil"
        onPress={() => navigation.navigate('homemain')}
        style={[mtAuto]}
      />
    </SafeAreaView>
  );
}


export default StripeAccountValidated;