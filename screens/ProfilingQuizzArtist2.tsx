import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';

const ProfilingQuizzArtist2 = ({ route, navigation }: any) => {
  const { objective, artSellingType } = route.params;
  const [customCommands, setCustomCommands] = useState<string | null>(null);

  console.log('received datas', objective, artSellingType);

  const next = () => {
    if (customCommands == null)
      return;
    navigation.navigate('profilingLast', {
      objective,
      artSellingType,
      customCommands,
    });
  };

  const previous = () => {
    navigation.navigate('profilingArtist', {
      objective: objective,
      artSellingType: artSellingType,
    });
  };

  useEffect(() => {
    console.log('customCommands', customCommands);
  }, [customCommands]); 

  const selectTag = (value: string) => {
    setCustomCommands(customCommands === value ? null : value);
  };

  const getButtonStyle = (choice) => (
    customCommands === choice ? 
      { ...styles.TagButton, backgroundColor: colors.primary } : 
      styles.TagButton
  );

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <Text style={styles.question}>2/3 - Souhaitez-vous proposer des créations personnalisées ?</Text>
      <View style={styles.Tags}>
      <View style={styles.Tags}>
        <TouchableOpacity
          style={getButtonStyle('Yes')}
          onPress={() => selectTag('Yes')}>
          <Text style={[styles.buttonText, customCommands === 'Yes' && { color: 'white' }]}>
            Oui
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle('No')}
          onPress={() => selectTag('No')}>
          <Text style={[styles.buttonText, customCommands === 'No' && { color: 'white' }]}>
            Non
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle('Maybe')}
          onPress={() => selectTag('Maybe')}>
          <Text style={[styles.buttonText, customCommands === 'Maybe' && { color: 'white' }]}>
            Peut-être plus tard
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
