import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import colors from '../constants/colors';
import Title from '../components/Title';
import TagButton from '../components/TagButton';
import Button from '../components/Button';
import ProfilingQuizzArtist1 from './ProfilingQuizzArtist1';

const ProfilingQuizz = ({ navigation }: any) => {
//   const navigation = useNavigation();

const [isArtist, setIsArtist] = useState(false);

// ... Rest of your component ...

  const nextPage = () => {
    // navigation.navigate(ProfilingQuizzArtist2); // Navigate to the 'ProfilingQuizzArtist2' screen
  };

  const selectTag = (tagValue: string) => {
    // Save user preferences 
    if (tagValue === "Vendre mes œuvres d’art") {
        setIsArtist(true);
    // console.log('Chosen Tag', tagValue);
  };

  const quizzArtistScreen = () => {
    // navigation.navigate('ProfilingQuizzArtist'); // Navigate to the '' screen
    // quizz-artist-1
  };

  const quizzArtistScreen2 = () => {
    // navigation.navigate('quizz-artist-2');
  };

    const quizzAmateurScreen1 = () => {
    // navigation.navigate('quizz-amateur-1');
  };

  const quizzAmateurScreen2 = () => {
    // navigation.navigate('quizz-amateur-2');
  };

  const quizzFinalScreen = () => {
    // navigation.navigate('quizz-final');

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
        //   onPress={selectTag('Amateur')} // Use the nextPage function to navigate
        />
        <TagButton
          style={styles.TagButton}
          value="Acheter des œuvres d’art"
        //   onPress={selectTag('Consumer')}
        />
        <TagButton
          style={styles.TagButton}
          textStyle={styles.TagButton}
          value="Vendre mes œuvres d’art"
        //   onPress={selectTag('Artist')}
        />
      </View>

      <Button value="Suivant" onPress={nextPage} />
    </View>
  );
};
}

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
