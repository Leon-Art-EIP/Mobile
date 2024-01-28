import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Image, Dimensions, View, Text, TouchableOpacity, ScrollView, ToastAndroid, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import Title from '../components/Title';
import colors from '../constants/colors';
import { get, post, put } from '../constants/fetch';
import { acCenter, aiCenter, asCenter, displayFlex, flex1, flexRow, mb8, mh8, ml4, mr4, mr8, mtAuto, mv4, mv8, noHMargin, noMargin } from '../constants/styles';
import { MainContext } from '../context/MainContext';
import { getImageUrl } from '../helpers/ImageHelper';
import { formatName } from '../helpers/NamesHelper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RatingModal from '../components/RatingModal';


type OrderType = {
  artPublicationDescription: string;
  artPublicationImage: string;
  artPublicationName: string;
  artPublicationPrice: number;
  createdAt: string;
  orderId: string;
  orderPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  orderState: 'pending' | 'paid' | 'cancelled' | 'shipping' | 'completed';
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
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
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number | undefined>(undefined);


  const setOrderAsSent = () => {
    return post(
      `/api/order/confirm-shipping`,
      { orderId: params.id },
      context?.token,
      () => ToastAndroid.show("Commande marquée comme envoyée !", ToastAndroid.SHORT),
      (err) => {
        Alert.alert("Erreur", "Nous n'avons pas pu marquer la commande comme 'envoyée'. Veuillez réessayer plus tard.");
        console.error({ ...err });
      }
    );
  }


  const cancelOrder = () => {
    if (order?.orderState === 'shipping') {
      return ToastAndroid.show(
        "Vous ne pouvez pas annuler la commande si l'oeuvre est déjà envoyée",
        ToastAndroid.LONG
      );
    }

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


  // When the art is received by the buyer
  const validateOrder = () => {
    post(
      `/api/order/confirm-delivery-rate`,
      { rating: rating, orderId: order?.orderId },
      context?.token,
      (res) => {
        ToastAndroid.show("Order validated", ToastAndroid.SHORT);
        return navigation.goBack();
      },
      (err) => console.warn(err)
    );
  }


  const navigateToConversation = () => {
    let convBody = {
      UserOneId: context?.userId,
      UserTwoId: params.buy ? order?.sellerId : order?.buyerId
    };

    put(
      `/api/conversations/create`,
      convBody,
      context?.token,
      (res) => {
        if (res?.data?.convId) {
          navigation.navigate('single_conversation', {
            name: params?.buy ? order?.sellerName : order?.buyerName,
            ids: [
              res?.data?.convId,
              context?.userId,
              params?.buy ? order?.sellerId : order?.buyerId
            ]
          });
        }
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
        <Title style={mv8}>Commande</Title>

        <TouchableOpacity
          onPress={navigateToConversation}
          style={{ marginLeft: 'auto' }}
        >
          <MaterialCommunityIcons
            name="message-reply-text-outline"
            onPress={navigateToConversation}
            size={32}
            color={colors.primary}
          />
        </TouchableOpacity>
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
          onPress={() => navigation.navigate('single_profile', {
            id: params?.buy ? order?.sellerId : order?.buyerId
          })}
        >
          <Text>{
            'by ' + formatName(params?.buy ? order?.sellerName : order?.buyerName, 30)
          }</Text>
        </TouchableOpacity>
      </Card>

      <Card style={{ marginHorizontal: 0, flex: 1 }}>
        <ScrollView>
          <Text>{ order?.artPublicationDescription }</Text>
        </ScrollView>
      </Card>


      { !params?.buy ? (
        <Card style={{
          marginHorizontal: 0,
          backgroundColor: colors.offerBg,
          marginVertical: 0
        }}>
          <Text style={{ color: colors.offerFg }}>{
            order?.orderState === 'shipping' ?
            "L'oeuvre a été envoyée ! Veuillez patienter que l'acheteur la recoive !" :
            "L'oeuvre est prête ? Appuyez sur \"Envoyer l'oeuvre\" après l'avoir envoyée à votre acheteur !"
          }</Text>
        </Card>
      ) : (
        <Card style={{ marginHorizontal: 0, backgroundColor: colors.offerBg }}>
          <Text style={{ color: colors.offerFg }}>Notez votre transaction avant de l'achever !</Text>
          <View style={[flexRow, asCenter, mv4]}>
            { [1, 2, 3, 4, 5].map((item: number) => (
              <AntDesign
                onPress={() => setRating(item)}
                name={rating && rating >= item ? 'star' : 'staro'}
                color={rating && rating >= item ? colors.primary : colors.offerFg}
                size={32}
              />
            )) }
          </View>
        </Card>
      ) }


      {/* Back and goToMessage buttons */}
      <View style={[mtAuto, flexRow]}>

        {/* If seller */}
        { !params.buy ? (
          <>
            <Button
              value='Cancel'
              onPress={cancelOrder}
              style={[flex1, noHMargin, mr4]}
              secondary
            />

            <Button
              disabled={order?.orderState === 'shipping'}
              value={order?.orderState !== 'shipping' ? "Envoyer l'oeuvre" : "Envoyée"}
              onPress={setOrderAsSent}
              style={[flex1, noHMargin, mr4]}
            />
          </>
        ) : (
          <Button
            value="J'ai reçu l'oeuvre"
            disabled={!rating}
            onPress={validateOrder}
            style={[flex1, noHMargin, ml4]}
          />
        ) }

      </View>

      {/* Rating modal */}
      <RatingModal
        isDisplayed={displayModal}
        setDisplayed={setDisplayModal}
        setRating={setRating}
      />

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
