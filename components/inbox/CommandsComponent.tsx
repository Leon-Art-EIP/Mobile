import React, {useState, useEffect, useContext, useCallback} from 'react';
import {Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import colors from '../../constants/colors';
import { bgGrey, flexRow, fwBold } from '../../constants/styles';
import { get, post } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import { getImageUrl } from '../../helpers/ImageHelper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';


const CommandsComponent = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [publicationNames, setPublicationNames] = useState({});
  const context = useContext(MainContext);


  const getCommands = () => {
    if (!context?.token) {
      ToastAndroid.show("Error getting your token. Please log in", ToastAndroid.SHORT);
      return navigation.navigate('login');
    }

    get(
      `/api/order/latest-buy-orders?limit=50&page=1`,
      context.token,
      (response) => setOrders(response?.data || []),
      (error) => console.error('Error fetching orders: ', error)
    );

    get(
      `/api/order/latest-sell-orders?limit=10&page=1`,
      context?.token,
      (response) => setSales(response?.data || []),
      (error) => console.error('Error fetching orders:', error)
    );
  };


  useFocusEffect(
    useCallback(getCommands, [navigation])
  );


  useEffect(getCommands, []);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Commandes</Text>

      { orders.map((order, index) => (
        <TouchableOpacity
          key={order.orderId + Math.random().toString()}
          onPress={() => navigation.navigate('single_order', { id: order.orderId, buy: true })}
        >
        <View key={order._id || index} style={styles.orderItem}>
          <Image
            style={styles.image}
            source={{ uri: getImageUrl(order?.artPublicationImage) }}
            testID="command-img"
          />
          <View style={styles.textContainer}>
            <Text style={fwBold}>{order?.artPublicationName}</Text>
            <Text>{order?.orderPrice} €</Text>
          </View>
        </View>
        </TouchableOpacity>
      )) }

      <Text style={styles.title}>Ventes</Text>

      { sales.map((sales, index) => (
        <TouchableOpacity
          key={sales._id}
          onPress={() => navigation.navigate('single_order', { id: sales?.orderId, buy: false })}
        >
          <View key={sales._id || index} style={styles.orderItem}>
            <Image
              style={styles.image}
              source={{ uri: getImageUrl(sales?.artPublicationImage) }}
              testID="command-img"
            />
            <View style={styles.textContainer}>
              <Text style={fwBold}>{sales?.artPublicationName}</Text>
              <Text>{sales?.orderPrice} €</Text>
            </View>
          </View>
        </TouchableOpacity>
      )) }
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
    fontSize: 25,
    marginLeft: 8,
    marginBottom: 13,
    marginTop: 15,

  },
  image: {
    borderRadius: 50,
    marginRight: 8,
    ...bgGrey,
    width: 50,
    height: 50,
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
  buttonText: {
    color: 'white',
  },
});


export default CommandsComponent;