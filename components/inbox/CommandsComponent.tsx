import React, {useState, useEffect, useContext, useCallback} from 'react';
import {Image, RefreshControl, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import colors from '../../constants/colors';
import { bgGrey, cDisabled, flexRow, fwBold } from '../../constants/styles';
import { get, post } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import { getImageUrl } from '../../helpers/ImageHelper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Title from '../text/Title';
import Button from '../buttons/Button';
import Subtitle from '../text/Subtitle';

const CommandsComponent = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [ordersState, setOrdersState] = useState([]);
  const [salesState, setSalesState] = useState([]);
  const [publicationNames, setPublicationNames] = useState({});
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const context = useContext(MainContext);


  useEffect(() => {
    if (context?.token) {
      get(
        `/api/order/latest-buy-orders?limit=50&page=1`,
        context.token,
        (response) => {
          setOrders(response?.data || []);
          setOrdersState(response?.data.order);
          console.log('🖼️ Orders:', response?.data || []);
        },
        (error) => console.error('Error fetching orders: ', error)
      );
  
      get(
        `/api/order/latest-sell-orders?limit=50&page=1`,
        context?.token,
        (response) => {
          setSales(response?.data || []);
          console.log('🖼️ Sales:', response?.data || []);
        },
        (error) => console.error('Error fetching sales:', error)
      );
    }
  }, [context?.token]);
  
  const getButtonStyle = (value) => {
    console.log('VALUUUE',value);
    switch (value) {
      case 'paid':
        return styles.paidTag; // Define paidButton style in your stylesheet
      case 'completed':
        return styles.completedTag; // Define completedButton style in your stylesheet
      case 'shipping':
        return styles.shippingTag; // Define shippingButton style in your stylesheet
      default:
        return styles.defaultTag; // Define defaultButton style in your stylesheet
    }
  };

  return (
    <ScrollView
      refreshControl={<RefreshControl
        refreshing={isRefreshing}
        colors={[colors.primary]}
        onRefresh={getCommands}
      />}
      contentContainerStyle={styles.container}
    >
    <Subtitle>Commandes</Subtitle>

      { orders.map((order, index) => (
        <TouchableOpacity
          key={order.orderId + Math.random().toString()}
          onPress={() => navigation.navigate('single_order', { id: order.orderId, buy: true })}
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
                value={order.orderState} // Setting the button text to orderState
                style={[styles.default, getButtonStyle(order.orderState)]}                textStyle={styles.buttonText}
                // disabled={false}
                disabled={true}
                // onPress={cDisabled}
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
  
    <Subtitle>Ventes</Subtitle>

      {sales.map((sale, index) => (
        <TouchableOpacity
          key={sale._id}
          onPress={() => navigation.navigate('single_order', { id: sale.orderId, buy: false })}
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
                value={sale.orderState} // Setting the button text to orderState
                // style={[styles.tag, getButtonStyle(order.orderState)]}
                style={[styles.default, getButtonStyle(sale.orderState)]}                textStyle={styles.buttonText}
                textStyle={styles.buttonText}
                disabled={true}
                // onPress={cDisabled}
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

  // Tags

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