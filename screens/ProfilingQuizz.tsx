import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, StatusBar } from 'react-native';

import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import { cBlack, flexRow, br50, flex1 } from '../constants/styles';
import { MainContext } from '../context/MainContext';
import { useRoute } from '@react-navigation/native';


const ProfilingQuizz = ({ navigation }): any => {
  const [objective, setObjective] = useState<string | undefined>(undefined);
  const route = useRoute();
  const redo: boolean = route?.params?.redo ?? false;
  const context = useContext(MainContext);



  const handleSubmit = () => {
    if (!objective) {
      return console.log('No objective selected');
    }

    if (objective === 'sell') {
      context?.setisArtist(true);
      navigation.navigate('profilingArtist', { objective: 'sell', redo });
    } else if (objective === 'discover') {
      context?.setisArtist(false);
      navigation.navigate('profilingAmateur', { objective: 'discover', redo });
    }
  };


  const getButtonStyle = (choice: string) => {
    if (objective === choice) {
      return {
        ...styles.tagButton,
        backgroundColor: colors.primary
      };
    } else {
      return styles.tagButton;
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.bg} barStyle='dark-content' />

      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>

      <Text style={styles.homeTitle}>Bienvenue !</Text>
      <Text style={styles.homeText}>Avec Leon'Art vous souhaitez...</Text>

      <View style={styles.tags}>

        <TouchableOpacity
          style={getButtonStyle("sell")}
          onPress={() => setObjective("sell")}
        >
          <Text style={[
            styles.buttonText,
            objective === "sell" && { color: 'white' }
          ]}>
            Vendre mes œuvres d’art
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getButtonStyle("discover")}
          onPress={() => setObjective("discover")}
        >
          <Text style={[styles.buttonText, objective === "discover" && { color: 'white' }]}>
            Découvrir des œuvres d’art
          </Text>
        </TouchableOpacity>
      </View>

      <View style={flexRow}>
        <Button
          style={[ br50, flex1 ]}
          disabled={!objective}
          value="Suivant"
          onPress={handleSubmit}
        />
      </View>

    </View>
  );
};


const styles = StyleSheet.create({
  tagButton: {
    padding: 10,
    borderRadius: 50,
    marginVertical: 12,
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
  tags: {
    marginBottom: 70,
    flex: 1,
  },
});

export default ProfilingQuizz;
