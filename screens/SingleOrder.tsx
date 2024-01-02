import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import { StatusBar, StyleSheet, Image, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Title from '../components/Title';
import colors from '../constants/colors';
import { get } from '../constants/fetch';
import { aiCenter, asCenter, flex1, flexRow, mh8, ml8, mr8, mtAuto, mv8 } from '../constants/styles';
import { MainContext } from '../context/MainContext';
import { formatName } from '../helpers/NamesHelper';


type SingleOrderProps = {
  // ID of the order
  id: string;
};


const SingleOrder = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const route = useRoute();
  const params = route.params as SingleOrderProps;


  useEffect(() => {
    get(
      "/api/order/latest-buy-orders",
      context?.token,
      (res: any) => console.log(res?.data),
      (err: any) => console.error(err)
    );
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} />

      <Title style={mv8}>Votre commande</Title>

      <Image
        /* source={{ uri:  }} */
        style={styles.orderImage}
      />

      <View style={[flexRow, aiCenter]}>
        <Title
          size={22}
          bold={false}
          style={[mv8, flex1, ml8]}
        >{ formatName('This this the title') }</Title>
        <Text style={mr8}>120€</Text>
      </View>

      <TouchableOpacity
        style={[flexRow, aiCenter]}
        onPress={() => navigation.navigate('')}
      >
        <Image
          /* source={{ uri:  }} */
          style={styles.sellerImage}
        />
        <Text style={[mh8]}>{ formatName('Seller name') }</Text>
      </TouchableOpacity>

      <View style={[mtAuto, flexRow]}>
        <Button
          value='Retour'
          onPress={() => navigation.goBack()}
          style={flex1}
          secondary
        />
        <Button
          value='Message'
          /* Fill with conversation object when back-end is available */
          /* onPress={() => navigation.navigate('single_conversation', { object })} */
          style={flex1}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  orderImage: {
    width: Dimensions.get('window').width - 24,
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.disabledBg,
  },
  sellerImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: colors.disabledBg
  }
});


export default SingleOrder;
