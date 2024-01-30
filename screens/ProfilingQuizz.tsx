import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';

const API_URL: string | undefined = process.env.REACT_APP_API_URL;


const ProfilingQuizz = ({ navigation }): any => {
  // const { objective } = route.params || { objective: 'defaultObjective' };
  const [objective, setObjective] = useState(null);

  
  const handleUserChoice = (choice) => {
    console.log('🤩 Choice :', choice);
    setObjective(choice);
  };

  const previous = () => {
    navigation.navigate('homemain');
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
      { ...styles.TagButton, backgroundColor: colors.primary  } : 
      styles.TagButton
  );

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <Text style={styles.homeTitle}>Bienvenue !</Text>
      <Text style={styles.homeText}>Avec Leon'Art vous souhaitez...</Text>      
      <View style={styles.Tags}>
        <TouchableOpacity
          style={getButtonStyle("sell")}
          onPress={() => handleUserChoice("sell")}
        >
          <Text style={[styles.buttonText, objective === "sell" && { color: 'white' }]}>
            Vendre mes œuvres d’art
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle("discover")}
          onPress={() => handleUserChoice("discover")}
        >
          <Text style={[styles.buttonText, objective === "discover" && { color: 'white' }]}>
            Découvrir des œuvres d’art
          </Text>
        </TouchableOpacity>
      </View>
      <Button
        style={{ borderRadius: 12 }}
        value="Suivant"
        onPress={handleSubmit} />
      <Button
        style={{ borderRadius: 12, backgroundColor: colors.whitesmoke}}
        textStyle={{ color: 'black' }}
        value="Retour"
        onPress={previous} />
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
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 40,
    marginTop: 70,
    marginBottom: 30,
  },
  homeTitle: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom: 0,
    fontSize: 30,
    color: '#000',
  },
  homeText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom: 40,
    fontSize: 18,
    color: '#000',
  },
  Tags: {
    justifyContent: 'space-between',
    margin: 40,
    marginBottom: 70,
    flex: 1,
  },
});

export default ProfilingQuizz;