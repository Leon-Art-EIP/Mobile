import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import { flex1, flexRow } from '../constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';


const ProfilingQuizzArtist2 = ({ route, navigation }: any) => {
  const { objective, artSellingType } = route.params;
  const [error, setError] = useState<string | undefined>(undefined);
  const [customCommands, setCustomCommands] = useState<string | null>(null);


  const next = () => {
    if (customCommands === null) {
      return setError('Veuillez sélectionner une option');
    }

    navigation.navigate('profilingLast', {
      objective,
      artSellingType,
      customCommands,
    });
  };


  const selectTag = (value: string) => {
    setCustomCommands(customCommands === value ? null : value);
  };


  const getButtonStyle = (choice: string) => {
    if (customCommands === choice) {
      return {
        ...styles.tagButton,
        backgroundColor: colors.primary
      };
    } else {
      return styles.tagButton;
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>

      <Text style={styles.question}>
        2/3 - Souhaitez-vous proposer des créations personnalisées ?
      </Text>

      <View style={styles.tags}>

        <Button
          value='Oui'
          style={[
            getButtonStyle('Yes'),
            { marginTop: 'auto' }
          ]}
          onPress={() => selectTag('Yes')}
          secondary={customCommands !== 'Yes'}
        />

        <Button
          value='Non'
          style={getButtonStyle('No')}
          onPress={() => selectTag('No')}
          secondary={customCommands !== 'No'}
        />

        <Button
          value='Peut-être plus tard'
          onPress={() => selectTag('Maybe')}
          secondary={customCommands !== 'Maybe'}
          style={[
            getButtonStyle('Maybe'),
            { marginBottom: 'auto' }
          ]}
        />
      </View>

      <View style={[flexRow]}>
        <Button
          secondary
          style={flex1}
          textStyle={{ color: colors.black }}
          value="Retour"
          onPress={navigation.goBack}
        />

        <Button
          disabled={!customCommands}
          value="Suivant"
          onPress={next}
          style={flex1}
        />
      </View>
    </SafeAreaView>
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
  },
  tagButton: {
    padding: 8,
    width: '90%',
    margin: 5,
    borderRadius: 50,
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
