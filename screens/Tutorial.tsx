import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';


const Tutorial = ({ navigation }) => {
  const next = () => {
    navigation.navigate('tutorial2');
  };


  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>

      <Text style={styles.homeTitle}>1. Explorez</Text>
      <Text style={styles.text2}>
        Découvrez une infinité de galeries et leurs créateurs, filtrées selon vos goûts et préférences.
      </Text>
      <View style={styles.imageContainer}>
        <Image
          source={require('../components/assets/homescreen2.png')}
          style={styles.image}
        />
      </View>

      <Button
        value="Suivant"
        onPress={() => navigation.navigate('tutorial2')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 40,
    marginTop: 30,
    marginBottom: 10,
  },
  homeTitle: {
    fontSize: 30,
    color: '#000',
    marginTop: 10,
  },
  text2: {
    color: colors.black,
    marginBottom: 20,
  },
  homeText: {
    fontSize: 18,
    color: colors.black,
    marginTop: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: Dimensions.get('window').width - 32, // 16 padding on each side
    height: (Dimensions.get('window').width - 32) * 0.83, // Aspect ratio 5:4
    resizeMode: 'contain',
  }
});

export default Tutorial;
