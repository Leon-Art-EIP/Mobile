import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';

const ProfilingQuizzArtist2 = ({ navigation }: any) => {
    const [customCommands, setCustomCommands] = useState<string | null>(null);

  const next = () => {
    console.log('NEXT customCommands 1', customCommands);

    if (customCommands === null) {
      console.log('Choice not selected');
      return;
    }

    post(
      '/api/quizz/submit/',
      { customCommands },
      () => navigation.navigate('ProfilingQuizzFinal'),
      () => {
        console.log('Offer Custom Creations:', customCommands);
        navigation.navigate('ProfilingQuizzFinal');

      }
    );
  };

  const previous = () => {
    navigation.navigate('ProfilingQuizzArtist');
  };

  useEffect(() => {
    console.log('customCommands', customCommands);
  }, [customCommands]); 

  const selectTag = (value: string) => {
    // console.log('customCommands 1', customCommands);
    if (customCommands === value) {
        setCustomCommands(null);
      }
      else
        setCustomCommands(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <Text style={styles.question}>2/3 - Souhaitez-vous proposer des créations personnalisées ?</Text>
      <View style={styles.Tags}>
        <TagButton
          style={styles.TagButton}
          value="Oui"
          onPress={() => selectTag('yes')}
        //   selected={customCommands === ''}
        />
        <TagButton
          style={styles.TagButton}
          value="Non"
          onPress={() => selectTag('no')}
        //   selected={customCommands === ''}
        />
        <TagButton
          style={styles.TagButton}
          textStyle={styles.TagButton}
          value="Peut-être plus tard"
          onPress={() => selectTag('maybe')}
        //   selected={customCommands === ''}
        />
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
    margin: 35,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  TagButton: {
    margin: 15,
  },
});

export default ProfilingQuizzArtist2;
