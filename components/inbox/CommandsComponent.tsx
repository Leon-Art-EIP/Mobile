import React, { useState, useEffect, useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';
import { flexRow, fwBold, ml8, mt4 } from '../../constants/styles';
import { get, post } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';

const CommandsComponent = () => {
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [publicationNames, setPublicationNames] = useState({});
  const context = useContext(MainContext);

  const cancelOrder = (orderId) => {
    console.log('Cancel order:', orderId);
    if (context?.token) {
      post(
        `/api/order/cancel/${orderId}`, 
        context.token,
        (response) => {
          console.log("Order cancelled successfully", response.data);
          setOrders(orders.filter(order => order._id !== orderId));
        },
        (error) => {
          console.error('Error cancelling order:', error);
        }
      );
    } else {
      console.error('Error: No authentication token found');
    }
  };

  const confirmOrder = (orderId) => {
    console.log('Cancel order:', orderId);
    if (context?.token) {
      console.log('token',token);
      post(
        `/api/order/cancel/${orderId}`, 
        context.token,
        (response) => {
          console.log("Order cancelled successfully", response.data);
          setOrders(orders.filter(order => order._id !== orderId));
        },
        (error) => {
          console.error('Error cancelling order:', error);
        }
      );
    } else {
      console.error('Error: No authentication token found');
    }
  };

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
        context?.token,
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
          <View style={styles.orderDetailsContainer}>
            <View style={styles.textContainer}>
              <Text style={fwBold}>{publicationNames[order.artPublicationId] || 'Loading...'}</Text>
              <Text style={styles.fwId}>{order._id}</Text>
              <Text>{order.orderPrice} €</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.cancel}
                onPress={() => cancelOrder(order._id)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirm}
                onPress={() => confirmOrder(order._id)}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
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
    ...flexRow,
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