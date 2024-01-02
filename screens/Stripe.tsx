import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import { get, post } from '../constants/fetch';
import { MainContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stripe = ({ navigation, route }) => {
  // const { article } = route.params;
  const [article, setArticle] = useState([]);
  const [order, setOrder] = useState([]);
  const context = useContext(MainContext);

  // Hardcoded ID for demonstration. Replace with dynamic ID as needed.
  const hardcodedId = "658efe47178612d48a93c216";

  useEffect(() => {
    if (context?.token) {
      get(
        `/api/art-publication/${hardcodedId}`,
        context.token,
        (response) => {
          console.log("🖼️ Fetched Article", response.data);
          setArticle(response?.data || []);
        },
        (error) => {
          console.error('Error fetching article:', error);
        }
      );
    }
  }, [context?.token]);

  const storePaiementIntent = async (value) => {
    try {
      await AsyncStorage.setItem('@stripe_payment_intent_id', value)
      console.log("VALUE", value);
    } catch (e) {
      console.error('Error saving data', e);
    }
  }

  const pay = () => {
    const requestData = { artPublicationId: hardcodedId };

    if (context?.token) {
      post(
        `/api/order/create`,
        requestData,
        context.token,
        (response) => {
          console.log("📦 Order created", response.data);
          setOrder(response?.data || []);
          console.log("📦 Stripe paiement intent created", response.data.order.stripePaymentIntentId);
          storePaiementIntent(response.data.order.stripePaymentIntentId);
        },
        (error) => {
          console.error('Error creating order:', error);
        }
      );
    }
  };

  const previous = () => {
    navigation.navigate('singleart');
  };

  return (
    <View style={styles.container}>
        <Title>Stripe Payment</Title>
        <Image
        style={{ marginLeft: 150, marginTop: 150, height: 70, width: 70 }}
        source={require('../assets/stripe.jpeg')}>
        </Image>
        <Button
          style={{ backgroundColor: colors.secondary, marginTop: 70 }}
          textStyle={{ color: colors.black }}
          value="Pay"
          onPress={pay}
        />
        <Button
          style={{ backgroundColor: colors.secondary, marginTop: 0 }}
          textStyle={{ color: colors.black }}
          value="Back"
          onPress={previous}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
  },
  // Add more styles as needed
});

export default Stripe;