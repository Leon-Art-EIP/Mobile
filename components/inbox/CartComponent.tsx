import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';
import { flexRow, fwBold, ml4, ml8, mt4, mt8 } from '../../constants/styles';


const HARD_ID: string = "65945d3ccd2277f546356014";


const CartComponent = () => {
  const navigation = useNavigation();


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={[flexRow, mt8, ml4]}
        onPress={() => navigation.navigate('single_order', { id: HARD_ID })}
      >
        <Image
          style={{ width: 50, height: 50, borderRadius: 5 }}
          source={require('../../assets/images/merDeNuages.webp')}
          testID="cart-img"
        />
        <View style={[ml8, mt4]}>
          <Text style={fwBold}>Mer de nuages</Text>
          <Text>40€</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white
  }
});

export default CartComponent;
