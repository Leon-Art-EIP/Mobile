import React, { useState, useEffect, useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';
import { bgGrey, flexRow, fwBold, ml8, mt4 } from '../../constants/styles';
import { get } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import { getImageUrl } from '../../helpers/ImageHelper';
import { useNavigation } from '@react-navigation/native';


const CommandsComponent = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const context = useContext(MainContext);


  useEffect(() => {
    if (context?.token) {
      get(
        `/api/order/latest-buy-orders?limit=10&page=1`,
        context.token,
        (response) => {
          console.log("🎁 Fetched Orders", response.data);
          setOrders(response?.data || []);
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
      get(
        `/api/order/latest-sell-orders?limit=10&page=1`,
        context.token,
        (response) => {
          console.log("🎉 Fetched Sales", response.data);
          setSales(response?.data || []);
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
    }
  }, [context?.token]);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Orders
      </Text>

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
        </View>
        </TouchableOpacity>
      )) }

      <Text style={styles.title}>
        Sales
      </Text>

      { sales.map((sales, index) => (
        <TouchableOpacity
          key={sales._id}
          onPress={() => navigation.navigate('single_order', { id: sales.orderId, buy: false })}
        >
          <View key={sales._id || index} style={styles.orderItem}>
            <Image
              style={styles.image}
              source={{ uri: getImageUrl(sales.artPublicationImage) }}
              testID="command-img"
            />
            <View style={styles.textContainer}>
              <Text style={fwBold}>{sales.artPublicationName}</Text>
              <Text>{sales.orderPrice} €</Text>
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
    marginLeft: 20,
    backgroundColor: colors.white,
  },
  orderItem: {
    ...flexRow,
    marginVertical: 10
  },
  title: {
    color: colors.black,
    fontSize: 25,
    marginBottom: 13,
    marginTop: 13,

  },
  image: {
    borderRadius: 50,
    ...bgGrey,
    width: 50,
    height: 50,
  },
  textContainer: {
    ...ml8,
    ...mt4,
  },
});


export default CommandsComponent;
