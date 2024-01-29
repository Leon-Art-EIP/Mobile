import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

import colors from '../constants/colors';
import { get, post } from '../constants/fetch';
import { MainContext } from '../context/MainContext';

import Title from '../components/Title';
import Button from '../components/Button';

const Stripe = ({ navigation, route }) => {
  const [article, setArticle] = useState([]);
  const [order, setOrder] = useState([]);
  const context = useContext(MainContext);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const publicationId = "658efe47178612d48a93c216";

  useEffect(() => {
    if (context?.token) {
      get(
        `/api/art-publication/${publicationId}`,
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

  const initializePaymentSheet = async (paymentIntentId) => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntentId,
    });
    if (!error) {
      console.log('Payment sheet initialized');
    } else {
      console.error('Error initializing payment sheet', error);
    }
  };

  useEffect(() => {
    const fetchPaymentIntentId = async () => {
      const paymentIntentId = await AsyncStorage.getItem('@stripe_payment_intent_id');
      if (paymentIntentId) {
        await initializePaymentSheet(paymentIntentId);
      }
    };
    fetchPaymentIntentId();
  }, []);

  const storePaiementIntent = async (value) => {
    try {
      await AsyncStorage.setItem('@stripe_payment_intent_id', value)
      console.log("VALUE", value);
    } catch (e) {
      console.error('Error saving data', e);
    }
  }

  const pay = () => {
    const requestData = { artPublicationId: publicationId };
  
    if (context?.token) {
      post(
        `/api/order/create`,
        requestData,
        context.token,
        (response) => {
          console.log("📦 Commande créée", response.data);
          setOrder(response?.data || []);
          console.log("📦 Intent de paiement Stripe créé", response.data.order.stripePaymentIntentId);
          
          storePaiementIntent(response.data.order.stripePaymentIntentId);
  
          const clientSecret = response.data.order.stripePaymentIntentId;
          presentPaymentSheet({ clientSecret })
            .then((paymentResult) => {
              if (paymentResult.error) {
                Alert.alert(`Code d'erreur: ${paymentResult.error.code}`, paymentResult.error.message);
              } else {
                Alert.alert('Succès', 'Paiement réussi');
              }
            })
            .catch((error) => {
              console.error('Erreur lors de la présentation de la feuille de paiement:', error);
            });
        },
        (error) => {
          console.error('Erreur lors de la création de la commande:', error);
        }
      );
    }
  };
  
  const previous = () => {
    navigation.navigate('singleart');
  };

  return (
    <View style={styles.container}>
        <Title style={{ marginLeft: 50, marginTop: 20 }}>Stripe Payment</Title>
        <Image
        style={{ marginLeft: 130, marginTop: 150, height: 120, width: 120 }}
        // source={require('../art_database/FSH-1702138198927-desktoppushlook.webp')}>
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
});

export default Stripe;