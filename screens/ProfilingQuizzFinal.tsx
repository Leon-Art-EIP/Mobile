import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native'
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import { MainContext } from '../context/MainContext';
import { flex1, flexRow } from '../constants/styles';


const ProfilingQuizzFinal = ({ route, navigation }: any) => {
  const {
    objective,
    artInterestType,
    artSellingType,
    location,
    customCommands,
    budget,
    redo
  } = route.params;
  const [discoveryMethod, setSelectedTag] = useState<string | null>(null);
  const context = useContext(MainContext);

  const next = () => {
    if (discoveryMethod == null) {
      return;
    }
    postQuizDatas();
  };

  const postQuizDatas = () => {
    const quizDatas = {
      artInterestType,
      artSellingType,
      budget,
      customCommands,
      discoveryMethod,
      location,
      objective,
    };

    const requestData = {
      objective,
      artInterestType: Array.isArray(quizDatas.artInterestType) && quizDatas.artInterestType.length > 0 ? quizDatas.artInterestType : [''],
      artSellingType: Array.isArray(quizDatas.artSellingType) && quizDatas.artSellingType.length > 0 ? quizDatas.artSellingType : [''],
      location: quizDatas.location || '',
      customCommands: quizDatas.customCommands || 'No',
      budget: quizDatas.budget || '',
      discoveryMethod,
    };

    post(
      '/api/quizz/submit',
      requestData,
      context?.token,
      () => {
        navigation.navigate(redo ? 'homemain' : 'tutorial')
      },
      (error: any) => {
        console.error('Error publishing quiz data:', error);
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach((err: any) => {
            console.error(`Validation error - ${err.param}: ${err.msg}`);
          });
        }
      }
    );
  };


  const previous = () => {
    if (objective === 'sell') {
      navigation.navigate('profilingArtist2', {objective, artSellingType});
    } else if (objective === 'discover') {
      navigation.navigate('profilingAmateur2', {objective, artSellingType});
    }
  };


  const selectTag = (tag: string) => {
    setSelectedTag(discoveryMethod === tag ? null : tag);
  };


  const getButtonStyle = (choice: string) => {
    if (discoveryMethod === choice) {
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
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>

      <Text style={styles.question}>
        3/3 - Comment avez-vous découvert Leon'Art ?
      </Text>

      <View style={styles.tags}>

        <Button
          style={[
            { marginTop: 'auto' },
            getButtonStyle("Réseaux sociaux")
          ]}
          onPress={() => selectTag("Réseaux sociaux")}
          secondary={discoveryMethod !== 'Réseaux sociaux'}
          value='Réseaux sociaux'
        />

        <Button
          style={getButtonStyle("Salon Professionnel")}
          onPress={() => selectTag("Salon Professionnel")}
          secondary={discoveryMethod !== 'Salon Professionnel'}
          value='Salon Professionnel'
        />

        <Button
          style={getButtonStyle("Bouche à oreilles")}
          onPress={() => selectTag("Bouche à oreilles")}
          secondary={discoveryMethod !== 'Bouche à oreilles'}
          value='Bouche à oreilles'
        />

        <Button
          style={[
            { marginBottom: 'auto' },
            getButtonStyle("Autre")
          ]}
          onPress={() => selectTag("Autre")}
          secondary={discoveryMethod !== 'Autre'}
          value='Autre'
        />

      </View>

      <View style={[flexRow]}>
        <Button
          secondary
          style={[flex1]}
          value="Retour"
          onPress={previous}
        />

        <Button
          value="Suivant"
          style={[flex1]}
          onPress={next}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    color: '#FFFF',
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
  question: {
    height: 60,
    marginLeft: 18,
    marginTop: 20,
    marginBottom: 0,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  tags: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  tagButton: {
    padding: 13,
    margin: 5,
    borderRadius: 50,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whitesmoke,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ProfilingQuizzFinal;
