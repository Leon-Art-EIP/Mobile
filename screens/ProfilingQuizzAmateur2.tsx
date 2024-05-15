import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import TagButton from '../components/tags/TagButton';

const ProfilingQuizzArtist2 = ({ route, navigation }: any) => {
  const { objective, artInterestType } = route.params;  
  const [budget, setBudget] = useState<string | null>(null);
  const customCommands = false;
  const location = '';

  console.log('received datas', objective, artInterestType);

  const next = () => {
    if (budget == null)
      return;
    navigation.navigate('profilingLast', { objective, artInterestType, budget });
  };

  const previous = () => {
    navigation.navigate('profilingAmateur', {
      objective: objective,
      artInterestType: artInterestType,
      location: location,
      customCommands: customCommands,
    });
  };

  useEffect(() => {
    console.log('budget', budget);
  }, [budget]); 

  const selectTag = (value: string) => {
    setBudget(budget === value ? null : value);
  };

  const getButtonStyle = (choice) => (
    budget === choice ? 
      { ...styles.TagButton, backgroundColor: colors.primary } : 
      styles.TagButton
  );

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <Text style={styles.question}>
        2/3 - Quel est votre budget ?
      </Text>
    <View style={styles.Tags}>
      <View style={styles.Tags}>
        <TouchableOpacity
            style={getButtonStyle('0-100')}
            onPress={() => selectTag('0-100')}>
            <Text style={[styles.buttonText, budget === '0-100' && { color: 'white' }]}>
            0 - 100€
            </Text>
          </TouchableOpacity>
        <TouchableOpacity
            style={getButtonStyle('100-1000')}
            onPress={() => selectTag('100-1000')}>
            <Text style={[styles.buttonText, budget === '100-1000' && { color: 'white' }]}>
            100 - 1 000€
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getButtonStyle('1000-10 000')}
            onPress={() => selectTag('1000-10 000')}>
            <Text style={[styles.buttonText, budget === '1000-10 000' && { color: 'white' }]}>
            1 000 - 10 000€
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getButtonStyle('+10 000')}
            onPress={() => selectTag('+10 000')}>
            <Text style={[styles.buttonText, budget === '+10 000' && { color: 'white' }]}>
              + 10 000€
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button value="Suivant" onPress={next} />
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

export default ProfilingQuizzArtist2;
