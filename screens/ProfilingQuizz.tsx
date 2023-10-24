 import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { get, post} from '../constants/fetch';

import colors from '../constants/colors';
import Title from '../components/Title';
import TagButton from '../components/TagButton';
import Button from '../components/Button';

import ProfilingArtist from './ProfilingQuizzArtist1';

const ProfilingQuizz = ({ navigation }: any) => {
   
  const [objective, setPurpose] = useState<string | null>(null);

const handleUserStatus = () => {
  console.log('User Purpose', objective)
  if (objective === null) {
    console.log('No prarameter found');
    return;
  }
    post(
        '/api/quizz/submit/',
        { objective },
        () => navigation.navigate(''),
        () => {
    console.log('Objective', objective)
          if (objective === 'sell') {
            navigation.navigate('profilingArtist');
          } else if (objective === 'both' || objective === 'discover') {
            navigation.navigate('profilingAmateur');
          }
        }
    )
};

  useEffect(() => {
    console.log('OBJECTIF', objective);
  }, [objective]); 

  const getPurpose = (value: string) => {
    console.log('value before', objective);
    if (objective === value)
      setPurpose(null);
    else
      setPurpose(value);
  };

return (
  <View style={styles.container}>
    <View style={styles.logo}>
      <Title style={{ color: colors.primary }}>Leon</Title>
      <Title>'Art</Title>
    </View>
    <Text style={styles.homeTitle}>Bienvenue !</Text>
    <Text style={styles.homeText}>Avec Leon'Art vous souhaitez...</Text>

    <View style={styles.Tags}>
      <TagButton
        style={styles.TagButton}
        value="Découvrir des œuvres d’art"
        onPress={() => getPurpose("discover")}
        selected={objective === "discover"}
        testID="discover-button"
      />
      <TagButton
        style={styles.TagButton}
        textStyle={styles.TagButton}
        value="Vendre mes œuvres d’art"
        onPress={() => getPurpose("sell")}
        selected={objective === "sell"}
        testID="sell-button"
      />
      <TagButton
        style={styles.TagButton}
        value="Les deux"
        onPress={() => getPurpose("both")}
        selected={objective === "both"}
        testID="both-button"
      />
    </View>

    <Button value="Suivant" onPress={handleUserStatus} testID="suivant-button" />
  </View>
);

};

const styles = StyleSheet.create({
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
    margin: 50,
    flex: 1,
  },
  TagButton: {
    backgroundColor: '#F4F4F4',
  },
  TagButtonText: {
    color: '#000',
  },
});

export default ProfilingQuizz;