import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Image, Dimensions, View, Text, TouchableOpacity, ScrollView, ToastAndroid, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/buttons/Button';
import Card from '../components/cards/Card';
import Title from '../components/text/Title';
import colors from '../constants/colors';
import { get, post, put } from '../constants/fetch';
import {
  aiCenter,
  asCenter,
  bgGrey,
  cBlack,
  cTextDark,
  flex1,
  flexRow,
  mb4,
  mh0,
  mh8,
  ml4,
  mr4,
  mr8,
  mtAuto,
  mv4,
  mv8,
  noHMargin
} from '../constants/styles';
import { MainContext } from '../context/MainContext';
import { getImageUrl } from '../helpers/ImageHelper';
import { formatName } from '../helpers/NamesHelper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RatingModal from '../components/modals/RatingModal';
import ImageViewer from 'react-native-image-zoom-viewer';
import Input from '../components/textInput/Input';


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
  const [ratingText, setRatingText] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);


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
      () => {
        ToastAndroid.show("Order canceled", ToastAndroid.SHORT);
        return navigation.goBack();
      },
      (err: any) => console.warn({ ...err })
    );
  }


  // When the art is received by the buyer
  const validateOrder = () => {
    const body = {
      rating: rating,
      orderId: order?.orderId,
      comment: ratingText
    };

    post(
      `/api/order/confirm-delivery-rate`,
      body,
      context?.token,
      () => {
        ToastAndroid.show("Commande validée. Félicitations !", ToastAndroid.SHORT);
        return navigation.goBack();
      },
      (err: any) => console.warn({ ...err })
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
      (res: any) => {
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
      (err: any) => console.warn({ ...err })
    );
  }


  const refreshData = () => {
    get(
      `/api/order/${params?.buy ? "buy" : "sell"}/${params.id}`,
      context?.token,
      (res: any) => setOrder(res?.data),
      (err: any) => console.warn({ ...err })
    );
  }


  useEffect(refreshData, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} />

      <View style={[flexRow, aiCenter]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={mh8}
        >
          <Ionicons name="chevron-back-outline" color={colors.black} size={32} />
        </TouchableOpacity>
        <Title style={[ mv8, mh8 ]}>Commande</Title>


      </View>

      {/* Art picture */}
      { order?.artPublicationImage ? (
        <ImageViewer
          loadingRender={() => <View style={styles.orderImage} />}
          style={styles.orderImage}
          backgroundColor={colors.disabledBg}
          imageUrls={[{ url: getImageUrl(order?.artPublicationImage) ?? '' }]}
          renderIndicator={() => <></>}
        />
      ) : (
        <View style={styles.orderImage} />
      ) }

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshData}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={flex1}
      >

        {/* Title and artist */}
        <Card style={{ marginHorizontal: 0 }}>
          <View style={[flexRow, aiCenter]}>
            <Title
              size={22}
              bold={false}
              style={[mb4, flex1]}
            >{ formatName(order?.artPublicationName) }</Title>
            <Text style={mr8}>{ order?.orderPrice?.toString() ?? "0" } €</Text>
          </View>

          <TouchableOpacity
            style={[flexRow, aiCenter, mb4]}
            onPress={() => navigation.navigate('single_profile', {
              id: params?.buy ? order?.sellerId : order?.buyerId
            })}
          >
            <Text style={cTextDark}>{
              formatName(params?.buy ? order?.sellerName : order?.buyerName, 30)
            }</Text>
          </TouchableOpacity>
        </Card>

        <Card style={[mh0, flex1]}>
          <Text style={cTextDark}>{ order?.artPublicationDescription }</Text>
        </Card>
      </ScrollView>

      {params.buy && (
        <View style={{
          backgroundColor: colors.deepyellow,
          padding: 0,
          borderRadius: 30,
        }}>

          <TouchableOpacity
            onPress={navigateToConversation}
            style={{
              backgroundColor: colors.deepyellow,
              borderRadius: 20,
              padding: 12,
              flexDirection: 'row',  // Align children (icon and text) in a row
              alignItems: 'center',  // Center align items vertically within the touchable opacity
              justifyContent: 'center'  // Center align items horizontally within the touchable opacity
            }}
          >
            <MaterialCommunityIcons
              name="message-reply-text-outline"
              size={24}
              color={colors.darkGreyFg}
            />
            <Text style={[ml4, cBlack, { fontSize: 16 }]}>
              Contacter le vendeur
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!params?.buy ? (
        <Card style={{
          marginHorizontal: 0,
          backgroundColor: colors.offerBg,
          marginVertical: 0,
          marginTop: 5,
          marginBottom: 20,
        }}>
          <Text style={{ color: colors.offerFg }}>{
            order?.orderState === 'shipping' ?
              "L'oeuvre a été envoyée ! Veuillez patienter que l'acheteur la recoive !" :
              "L'oeuvre est prête ? Appuyez sur \"Envoyer l'oeuvre\" après l'avoir envoyée à votre acheteur !"
          }</Text>
        </Card>
      ) : order?.orderState !== 'completed' ? (
        <Card style={styles.ratingCard}>

          <Text style={{ color: colors.darkGreyFg, fontSize: 16, }}>
            Notez votre transaction avant de l'achever !
          </Text>

          <View style={[flexRow, asCenter, mv4]}>
            {[1, 2, 3, 4, 5].map((item: number) => (
              <AntDesign
                key={item}
                onPress={() => setRating(item)}
                name={rating && rating >= item ? 'star' : 'staro'}
                color={colors.deepyellow}
                size={32}
              />
            ))}
          </View>

          <Input
            placeholder='Vos impressions sur cette commande ?'
            onTextChanged={setRatingText}
            multilines={3}
            style={styles.ratingInput}
          />
        </Card>
      ) : (<></>)}


      {/* Back and goToMessage buttons */}
      <View style={[mtAuto, flexRow]}>

        {/* If seller */}
        {!params.buy ? (
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
            value={order?.orderState === 'completed' ? "Oeuvre reçue" : "J'ai reçu l'oeuvre"}
            disabled={order?.orderState === 'completed' || !rating || ratingText === ""}
            onPress={validateOrder}
            style={[flex1, noHMargin, ml4]}
          />
        )}

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
  },
  ratingCard: {
    marginHorizontal: 0,
    alignContent: 'center',
    flex: 1
  },
  ratingInput: {
    borderRadius: 18,
    marginHorizontal: 0,
    marginTop: 'auto',
    marginBottom: 'auto',
    textAlignVertical: 'top'
  }
});


export default SingleOrder;
