import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { flex1 } from '../constants/styles';


const Tutorial_2 = () => {
  const navigation = useNavigation();
  const route = useRoute();


  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <Text style={styles.homeTitle}>2. Partagez</Text>
      <Text style={styles.text}>
        Exprimez votre créativité et inspirez les amateurs et professionnels de l'art du monde entier.
      </Text>
      <View style={styles.imageContainer}>
        <Image
          source={require('../components/assets/profile2.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={flex1}
          secondary
          value="Retour"
          onPress={() => navigation.goBack()}
        />
        <Button
          style={flex1}
          value="Suivant"
          onPress={() => navigation.navigate(
            'tutorial3',
            { comesFromSettings: route?.params?.comesFromSettings }
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TagButton: {
    padding: 10,
    margin: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whitesmoke,
  },
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
    color: colors.black,
    marginVertical: 10,
  },
  text: {
    fontSize: 15,
    color: '#000',
    marginVertical: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: Dimensions.get('window').width - 32, // 16 padding on each side
    height: (Dimensions.get('window').width - 32) * 0.83, // Aspect ratio 5:4
    resizeMode: 'contain',
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.whitesmoke,
  },
});

export default Tutorial_2;
