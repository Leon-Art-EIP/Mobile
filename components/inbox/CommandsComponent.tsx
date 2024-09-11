import React, {useState, useEffect, useContext, useCallback} from 'react';
import {Image, RefreshControl, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import colors from '../../constants/colors';
import { aiCenter, asCenter, bgRed, bgGrey, fwBold, mbAuto, mtAuto, mlAuto } from '../../constants/styles';
import { get, post } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import { getImageUrl } from '../../helpers/ImageHelper';
import { useNavigation } from '@react-navigation/native';
import Button from '../buttons/Button';
import Subtitle from '../text/Subtitle';
import { formatName } from '../../helpers/NamesHelper';


type BuyOrderType = {
  orderId: string;
  buyerId: string,
  sellerId: string;
  orderState: string;
  paymentStatus: string;
  orderPrice: string;
  createdAt: string;
  updatedAt: string;
  artPublicationId: string;
  artPublicationName: string;
  artPublicationDescription: string;
  artPublicationPrice: string;
  artPublicationImage: string;
};


const CommandsComponent = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState<BuyOrderType[]>([]);
  // Not sure sales are BuyOrderType[]. See with back-end in case of errors
  const [sales, setSales] = useState<BuyOrderType[]>([]);
  const [ordersState, setOrdersState] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const context = useContext(MainContext);


  const getCommands = () => {
    setIsRefreshing(true);

    if (!context?.token) {
      return console.log("Couldn't find token");
    }

    get(
      `/api/order/latest-sell-orders?limit=50&page=1`,
      context?.token,
      (response: any) => setSales(response?.data || []),
      (error: any) => console.error({ ...error })
    );

    get(
      `/api/order/latest-buy-orders?limit=50&page=1`,
      context.token,
      (response: any) => {
        setOrders(response?.data || []);
        setOrdersState(response?.data.order);
        setIsRefreshing(false);
      },
      (error: any) => console.error({ ...error })
    );

  }


  useEffect(getCommands, [context?.token]);


  const getButtonStyle = (value: string) => {
    switch (value) {
      case ('paid'): return { backgroundColor: colors.paid };
      case ('completed'): return { backgroundColor: colors.completed };
      case ('shipping'): return { backgroundColor: colors.shipping };
      default: return { display: 'none' };
    }
  };


  const getFrenchValue = (value: string) => {
    switch (value) {
      case ('paid'): return "Payée";
      case ('completed'): return "Terminée";
      case ('shipping'): return "Livraison"
      default: return ""
    }
  };

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl
          refreshing={isRefreshing}
          colors={[colors.primary]}
          onRefresh={getCommands}
        />}
        contentContainerStyle={styles.container}
      >
        <Subtitle>Commandes</Subtitle>

        { orders.length === 0 && (
          <View style={[ asCenter, aiCenter, mtAuto, mbAuto ]}>
            <Image
              source={require('../../assets/icons/box.png')}
              style={{ width: 80, height: 80 }}
            />
            <Text style={{ marginBottom: 'auto' }}>C'est tout vide par ici !</Text>
          </View>
        )}

        { orders.map((order, index) => (
          <TouchableOpacity
            key={order.orderId?.toString() + '_order'}
            onPress={() => navigation.navigate('single_order', {
              id: order?.orderId,
              buy: true
            })}
          >
            <View key={order.orderId || index} style={styles.orderItem}>
              <Image
                style={styles.image}
                source={{ uri: getImageUrl(order.artPublicationImage) }}
                testID="command-img"
              />
              <View style={styles.textContainer}>
                <Text style={fwBold}>{ formatName(order.artPublicationName, 20) }</Text>
                <Text>{order.orderPrice} €</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  value={getFrenchValue(order.orderState)}
                  style={[mlAuto, getButtonStyle(order.orderState)]}
                  textStyle={styles.buttonText}
                  disabled
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        refreshControl={<RefreshControl
          refreshing={isRefreshing}
          colors={[colors.primary]}
          // onRefresh={getCommands}
        />}
        contentContainerStyle={styles.container}
      >

        <Subtitle>Ventes</Subtitle>

        { sales.length === 0 && (
          <View style={[ asCenter, aiCenter, mtAuto, mbAuto ]}>
            <Image
              source={require('../../assets/icons/box.png')}
              style={{ width: 80, height: 80 }}
            />
            <Text style={{ marginBottom: 'auto' }}>C'est tout vide par ici !</Text>
          </View>
        ) }

        { sales.map((sale, index) => (
          <TouchableOpacity
            key={sale.orderId.toString() + "_sale"}
            onPress={() => navigation.navigate('single_order', {
              id: sale?.orderId,
              buy: false
            })}
          >
            <View key={sale.orderId || index} style={styles.orderItem}>
              <Image
                style={styles.image}
                source={{ uri: getImageUrl(sale.artPublicationImage) }}
                testID="command-img"
              />
              <View style={styles.textContainer}>
                <Text style={fwBold}>{sale.artPublicationName}</Text>
                <Text>{sale.orderPrice} €</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  value={getFrenchValue(sale.orderState)}
                  style={[mlAuto, getButtonStyle(sale.orderState)]}
                  textStyle={styles.buttonText}
                  disabled={true}
                />
              </View>
            </View>
          </TouchableOpacity>
        )) }

      </ScrollView>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: colors.white,
  },
  orderItem: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  orderDetailsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  title: {
    color: colors.black,
    fontSize: 27,
    fontWeight: 'bold',
    marginLeft: 8,
    marginBottom: 13,
    marginTop: 15,
  },
  image: {
    borderRadius: 5,
    marginRight: 8,
    ...bgGrey,
    width: 50,
    height: 50,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  buttonText: {
    color: colors.black,
    fontSize: 13,
    paddingLeft: 12,
    paddingRight: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  textContainer: {
    padding: 3,
    maxWidth: '60%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancel: {
    padding: 10,
    marginRight: 5,
    backgroundColor: colors.cancel,
    borderRadius: 20,
  },
  confirm: {
    padding: 10,
    backgroundColor: colors.confirm,
    borderRadius: 20,
  },
});


export default CommandsComponent;
