import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Image, Dimensions, View, Text, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import Title from '../components/Title';
import colors from '../constants/colors';
import { get, post } from '../constants/fetch';
import { aiCenter, flex1, flexRow, mb8, mh8, ml4, mr4, mr8, mtAuto, mv8, noHMargin, noMargin } from '../constants/styles';
import { MainContext } from '../context/MainContext';
import { getImageUrl } from '../helpers/ImageHelper';
import { formatName } from '../helpers/NamesHelper';
import AntDesign from 'react-native-vector-icons/AntDesign';


/* type OrderType = { */
/*   _id: string; */
/*   artPublicationId: string; */
/*   buyerId: string; */
/*   sellerId: string; */
/*   orderState: string; // 'pending' */
/*   paymentStatus: string; // 'pending' */
/*   orderPrice: number; */
/*   createdAt: string; */
/*   updatedAt: string; */
/*   __v: number; */
/*   stripePaymentIntentId: string; */
/* }; */

type OrderType = {
  artPublicationDescription: string;
  artPublicationImage: string;
  artPublicationName: string;
  artPublicationPrice: number;
  createdAt: string;
  orderId: string;
  orderPrice: number;
  orderState: string;
  sellerId: string;
  sellerName: string;
  updatedAt: string;
};


type SingleOrderProps = {
  // ID of the order
  id: string;

  // is "buy" or "sell"
  buy: boolean;
};


const SingleOrder = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const route = useRoute();
  const params = route.params as SingleOrderProps;
  const [order, setOrder] = useState<OrderType | undefined>(undefined);


  const cancelOrder = () => {
    post(
      `/api/order/cancel/${params?.id}`,
      {},
      context?.token,
      (res) => {
        ToastAndroid.show("Order canceled", ToastAndroid.SHORT);
        return navigation.goBack();
      },
      (err) => console.warn(err)
    );
  }


  const validateOrder = () => {
    post(
      `/api/order/confirm-delivery-rate`,
      { rating: 5, orderId: order?.orderId },
      context?.token,
      (res) => {
        ToastAndroid.show("Order validated", ToastAndroid.SHORT);
        return navigation.goBack();
      },
      (err) => console.warn(err)
    );
  }


  useEffect(() => {
    get(
      `/api/order/${params?.buy ? "buy" : "sell"}/${params.id}`,
      context?.token,
      (res: any) => setOrder(res?.data),
      (err: any) => console.error(err)
    );
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} />

      <View style={[flexRow, aiCenter]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={mr8}
        >
          <AntDesign
            name="left"
            color={colors.black}
            onPress={() => navigation.goBack()}
            size={32}
          />
        </TouchableOpacity>
        <Title style={mv8}>Your order</Title>
      </View>

      {/* Art picture */}
      <Image
        source={{ uri: getImageUrl(order?.artPublicationImage) }}
        style={styles.orderImage}
      />

      {/* Title and artist */}
      <Card style={{ marginHorizontal: 0 }}>
        <View style={[flexRow, aiCenter]}>
          <Title
            size={22}
            bold={false}
            style={[mb8, flex1]}
          >{ formatName(order?.artPublicationName) }</Title>
          <Text style={mr8}>{ order?.orderPrice.toString() } €</Text>
        </View>

        <TouchableOpacity
          style={[flexRow, aiCenter]}
          /* navigate to user profile */
          onPress={() => navigation.navigate('single_profile', { id: order?.sellerId })}
        >
          <Image
            /* artist profile picture */
            /* source={{ uri:  }} */
            style={styles.sellerImage}
          />
          <Text style={[mh8]}>{ formatName(order?.sellerName, 30) }</Text>
        </TouchableOpacity>
      </Card>

      <Card style={{ marginHorizontal: 0, flex: 1 }}>
        <ScrollView>
          <Text>{ order?.artPublicationDescription }</Text>
        </ScrollView>
      </Card>

      {/* Back and goToMessage buttons */}
      <View style={[mtAuto, flexRow]}>
        <Button
          value='Cancel'
          onPress={cancelOrder}
          style={[flex1, noHMargin, mr4]}
          secondary
        />

        <Button
          value='Validate'
          /* Fill with conversation object when back-end is available */
          onPress={validateOrder}
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
