import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Image, Dimensions, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import Title from '../components/Title';
import colors from '../constants/colors';
import { get } from '../constants/fetch';
import { aiCenter, flex1, flexRow, mb8, mh8, ml4, mr4, mr8, mtAuto, mv8, noHMargin, noMargin } from '../constants/styles';
import { MainContext } from '../context/MainContext';
import { formatName } from '../helpers/NamesHelper';


type OrderType = {
  _id: string;
  artPublicationId: string;
  buyerId: string;
  sellerId: string;
  orderState: string; // 'pending'
  paymentStatus: string; // 'pending'
  orderPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  stripePaymentIntentId: string;
};


type SingleOrderProps = {
  // ID of the order
  id: string;
};


const SingleOrder = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const route = useRoute();
  const params = route.params as SingleOrderProps;
  const [order, setOrder] = useState<OrderType | undefined>(undefined);


  useEffect(() => {
    console.log("ID: ", params.id);
    get(
      /* `/api/order/buy/${params.id}`, */
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

      {/* Art picture */}
      <Image
        /* source={{ uri:  }} */
        style={styles.orderImage}
      />

      {/* Title and artist */}
      <Card style={{ marginHorizontal: 0 }}>
        <View style={[flexRow, aiCenter]}>
          <Title
            size={22}
            bold={false}
            style={[mb8, flex1]}
          >{ formatName('This this the title') }</Title>
          <Text style={mr8}>120€</Text>
        </View>

        <TouchableOpacity
          style={[flexRow, aiCenter]}
          /* navigate to user profile */
          /* onPress={() => navigation.navigate('single_profile', { object })} */
        >
          <Image
            /* artist profile picture */
            /* source={{ uri:  }} */
            style={styles.sellerImage}
          />
          <Text style={[mh8]}>{ formatName('Seller name') }</Text>
        </TouchableOpacity>
      </Card>

      <Card style={{ marginHorizontal: 0, flex: 1 }}>
        <ScrollView>
          <Text>{ "This is a description" }</Text>
        </ScrollView>
      </Card>

      {/* Back and goToMessage buttons */}
      <View style={[mtAuto, flexRow]}>
        <Button
          value='Retour'
          onPress={() => navigation.goBack()}
          style={[flex1, noHMargin, mr4]}
          secondary
        />
        <Button
          value='Message'
          /* Fill with conversation object when back-end is available */
          onPress={() => navigation.navigate('single_conversation', { object })}
          style={[flex1, noHMargin, ml4]}
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
    borderRadius: 20,
    marginBottom: 8,
    backgroundColor: colors.disabledBg,
  },
  sellerImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: colors.offerBg
  }
});


export default SingleOrder;
