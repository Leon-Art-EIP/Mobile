import React, { useState, useEffect, useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';
import { flexRow, fwBold, ml8, mt4 } from '../../constants/styles';
import { get } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';

const CommandsComponent = () => {
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [publicationNames, setPublicationNames] = useState({});
  const context = useContext(MainContext);

  useEffect(() => {
    if (context?.token) {
      get(
        `/api/order/latest-buy-orders?limit=10&page=1`,
        context.token,
        (response) => {
          console.log("🎁 Fetched Orders", response.data);
          setOrders(response?.data || []);
          response?.data.forEach(order => {
            get(
              `/api/art-publication/${order.artPublicationId}`,
              context.token,
              (publicationResponse) => {
                setPublicationNames(prev => ({ ...prev, [order.artPublicationId]: publicationResponse.data.name }));
              },
              (error) => {
                console.error('Error fetching publication:', error);
              }
            );
          });
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
      {orders.map((order, index) => (
        <TouchableOpacity>
        <View key={order._id || index} style={styles.orderItem}>
          <Image
            style={styles.image}
            source={require('../../assets/images/user.png')}
            testID="command-img"
          />
          <View style={styles.textContainer}>
            <Text style={fwBold}>{publicationNames[order.artPublicationId] || 'Loading...'}</Text>
            <Text style={styles.fwId}>{order._id}</Text>
            <Text>{order.orderPrice} €</Text>
          </View>
        </View>
        </TouchableOpacity>
      ))}
      <Text style={styles.title}>
        Sales
      </Text>
      {sales.map((sales, index) => (
        <TouchableOpacity>
        <View key={sales._id || index} style={styles.orderItem}>
          <Image
            style={styles.image}
            source={require('../../assets/images/user.png')}
            testID="command-img"
          />
          <View style={styles.textContainer}>
            <Text style={fwBold}>{sales._id}</Text>
            <Text>{sales.orderPrice} €</Text>
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
    marginLeft: 20,
    backgroundColor: colors.white,
  },
  orderItem: {
    ...flexRow,
    marginVertical: 10,
  },
  title: {
    color: colors.black,
    fontSize: 25,
    marginBottom: 13,
    marginTop: 13,

  },
  image: {
    width: 50,
    height: 50,
  },
  textContainer: {
    ...ml8,
    ...mt4,
  },
  fwId: {
    color: colors.black,
  },
});

export default CommandsComponent;