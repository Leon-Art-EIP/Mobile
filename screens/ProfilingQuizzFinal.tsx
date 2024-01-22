import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native'
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg';
import { MainContext } from '../context/MainContext';


const ProfilingQuizzFinal = ({ route, navigation }: any) => {
  const { objective, artInterestType, artSellingType,  location, customCommands, budget } = route.params;
  const [discoveryMethod, setSelectedTag] = useState<string | null>(null);
  const context = useContext(MainContext);

  const next = () => {
    if (discoveryMethod == null)
      return;
    // Alert.alert('Your preferences have been saved !');
    postQuizDatas();
    navigation.navigate('profiling');
    navigation.navigate('homemain');
    
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
      objective: quizDatas.objective || 'sell',
      artInterestType: Array.isArray(quizDatas.artInterestType) && quizDatas.artInterestType.length > 0 ? quizDatas.artInterestType : ['default_artInterestType'],
      artSellingType: Array.isArray(quizDatas.artSellingType) && quizDatas.artSellingType.length > 0 ? quizDatas.artSellingType : ['default_artSellingType'],
      location: quizDatas.location || '',
      customCommands: quizDatas.customCommands || 'yes',
      budget: quizDatas.budget || '0-100',
      discoveryMethod: quizDatas.discoveryMethod || 'default_discoveryMethod'
    };
    // requestData = Object.entries(quizDatas).reduce((acc, [key, value]) => {
    //   acc[key] = value ?? '';  // If value is null or undefined, set it to an empty string
    //   return acc;
    // }, {});

    console.log('🥸 RequestDatas beforePost: ', requestData);
    
    // const headers = {
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${context?.token}` // or however your token is passed
    // };

    const token = context?.token || '';

    post('/api/quizz/submit', requestData, token,
    // context?.token,
    (response) => {
      console.log('Quiz successfully posted', response);
      navigation.navigate('main');
    },
    (error) => {
      console.error('Error publishing quiz data:', error);
    }
  );
    // post(
    //   '/api/quizz/submit',
    //   { requestData },
    //   context?.token,
    //   () => navigation.navigate('main'),
    //   (error) => {
    //     console.error('Error publishing quizdatas:', error);
    //   }
    // );
    console.log('😇 RequestDatas afterPost: ', requestData);
    console.log(requestData)
  };

  const previous = () => {
    navigation.navigate('profilingArtist2', {objective, artSellingType});
  };

  useEffect(() => {
    console.log('selectedTag:', discoveryMethod);
    },
  ); 

  const selectTag = (tag: string) => {
    setSelectedTag(discoveryMethod === tag ? null : tag);
  };

  const getButtonStyle = (choice) => (
    discoveryMethod === choice ? 
      { ...styles.TagButton, backgroundColor: colors.primary } : 
      styles.TagButton
  );

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <Text style={styles.question}>3/3 - Comment avez-vous découvert Leon'Art ?</Text>
      <View style={styles.Tags}>
        <TouchableOpacity
          style={getButtonStyle("Réseaux sociaux")}
          onPress={() => selectTag("Réseaux sociaux")}>
          <Text style={[styles.buttonText, discoveryMethod === "Réseaux sociaux" && { color: 'white' }]}>
            Réseaux sociaux
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getButtonStyle("Salon Professionnel")}
          onPress={() => selectTag("Salon Professionnel")}>
          <Text style={[styles.buttonText, discoveryMethod === "Salon Professionnel" && { color: 'white' }]}>
            Salon Professionnel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getButtonStyle("Bouche à oreilles")}
          onPress={() => selectTag("Bouche à oreilles")}>
          <Text style={[styles.buttonText, discoveryMethod === "Bouche à oreilles" && { color: 'white' }]}>
            Bouche à oreilles
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getButtonStyle("Autre")}
          onPress={() => selectTag("Autre")}>
          <Text style={[styles.buttonText, discoveryMethod === "Autre" && { color: 'white' }]}>
            Autre
          </Text>
        </TouchableOpacity>
      </View>
      <Button
        value="Terminé"
        onPress={next}
      />
      <Button
        style={{ backgroundColor: colors.secondary }}
        textStyle={{ color: colors.black }}
        value="Retour"
        onPress={previous}
      />
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
  Tags: {
    justifyContent: 'space-between',
    margin: 23,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  TagButton: {
    padding: 13,
    margin: 5,
    borderRadius: 25,
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
