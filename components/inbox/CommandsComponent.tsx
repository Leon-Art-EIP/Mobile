import React, { useState, useEffect, useContext } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';
import { bgGrey, cDisabled, flexRow, fwBold } from '../../constants/styles';
import { get } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import { getImageUrl } from '../../helpers/ImageHelper';
import { useNavigation } from '@react-navigation/native';
import Subtitle from '../text/Subtitle';
import Button from '../buttons/Button';

const CommandsComponent = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const context = useContext(MainContext);

  const getCommands = () => {
    if (!context?.token) {
      return console.log("Couldn't find token");
    }

    setIsRefreshing(true); // Start refreshing

    get(
      `/api/order/latest-buy-orders?limit=50&page=1`,
      context.token,
      (response) => {
        setOrders(response?.data || []);
        setIsRefreshing(false); // Stop refreshing
        console.log('🖼️ Orders:', response?.data || []);
      },
      (error) => {
        console.error('Error fetching orders: ', error);
        setIsRefreshing(false); // Stop refreshing in case of error
      }
    );

    get(
      `/api/order/latest-sell-orders?limit=50&page=1`,
      context?.token,
      (response) => {
        setSales(response?.data || []);
        setIsRefreshing(false); // Stop refreshing
        console.log('🖼️ Sales:', response?.data || []);
      },
      (error) => {
        console.error('Error fetching sales: ', error);
        setIsRefreshing(false); // Stop refreshing in case of error
      }
    );
  }

  useEffect(getCommands, [context?.token]);

  const getButtonStyle = (value: string) => {
    switch (value) {
      case 'paid':
        return styles.paidTag;
      case 'completed':
        return styles.completedTag;
      case 'shipping':
        return styles.shippingTag;
      default:
        return styles.defaultTag;
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          colors={[colors.primary]}
          onRefresh={getCommands} // Call getCommands on refresh
        />
      }
      contentContainerStyle={styles.container}
    >
      <Subtitle>Commandes</Subtitle>

      {orders.map((order, index) => (
        <TouchableOpacity
          key={order.orderId + Math.random().toString()}
          onPress={() => navigation.navigate('single_order', {
            id: order?.orderId,
            buy: true
          })}
        >
          <View key={order._id || index} style={styles.orderItem}>
            <Image
              style={styles.image}
              source={{ uri: getImageUrl(order.artPublicationImage) }}
              testID="command-img"
            />
            <View style={styles.textContainer}>
              <Text style={fwBold}>{order.artPublicationName}</Text>
              <Text>{order.orderPrice} €</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                value={order.orderState}
                style={[styles.default, getButtonStyle(order.orderState)]}
                textStyle={styles.buttonText}
                disabled={true}
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <Subtitle>Ventes</Subtitle>

      {sales.map((sale, index) => (
        <TouchableOpacity
          key={sale.saleId + Math.random().toString()}
          onPress={() => navigation.navigate('single_order', {
            id: sale?.orderId,
            buy: false
          })}
        >
          <View key={sale._id || index} style={styles.orderItem}>
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
                value={sale.orderState}
                style={[styles.default, getButtonStyle(sale.orderState)]}
                textStyle={styles.buttonText}
                disabled={true}
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
    paddingRight: 10,
  },
  image: {
    borderRadius: 5,
    marginRight: 8,
    ...bgGrey,
    width: 50,
    height: 50,
  },
  textContainer: {
    padding: 3,
    maxWidth: '60%',
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
  paidTag: {
    backgroundColor: colors.paid,
  },
  completedTag: {
    backgroundColor: colors.completed,
  },
  shippingTag: {
    backgroundColor: colors.shipping,
  },
  defaultTag: {
    backgroundColor: colors.default,
  },
});

export default CommandsComponent;
