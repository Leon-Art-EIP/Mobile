import React, { useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;

const Tutorial_3 = ({ navigation }) => {
  const [objective, setObjective] = useState(null);

  const handleUserChoice = (choice) => {
    console.log('🤩 Choice :', choice);
    setObjective(choice);
  };

  const previous = () => {
    navigation.navigate('tutorial2');
  };

  const next = () => {
    // navigation.navigate('profiling');
    navigation.navigate('mainNav');
  };

  const handleSubmit = () => {
    if (!objective) {
      console.log('No objective selected');
      return;
    }
    if (objective === 'sell') {
      console.log('🤩 choice :', objective);
      navigation.navigate('profilingArtist', { objective: 'sell' });
    } else if (objective === 'discover') {
      console.log('🤩 choice :', objective);
      navigation.navigate('profilingAmateur', { objective: 'discover' });
    }
  };

  const getButtonStyle = (choice) => (
    objective === choice ?
      { ...styles.TagButton, backgroundColor: colors.primary } :
      styles.TagButton
  );

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <Text style={styles.homeTitle}>Échangez</Text>
      <Text style={styles.homeText}>Achats et Ventes Simplifiés</Text>
      <Text style={styles.text}>
        Que vous souhaitiez enrichir votre collection ou vendre vos créations, LeonArt facilite les transactions sécurisées. Achetez et vendez des œuvres directement, grâce à une plateforme intuitive qui supporte les artistes et les collectionneurs.
      </Text>
      <View style={styles.imageContainer}>
        <Image
          source={require('../components/assets/CommandScreenEx.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          textStyle={{ color: 'black' }}
          value="Retour"
          onPress={previous}
        />
        <Button
          style={styles.button}
          textStyle={{ color: 'black' }}
          value="Suivant"
          onPress={next}
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
    textAlign: 'center',
    fontSize: 30,
    color: '#000',
    marginVertical: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 15,
    color: '#000',
    marginVertical: 10,
  },
  homeText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    marginVertical: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
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

export default Tutorial_3;