import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native'
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg';

const ProfilingQuizzFinal = ({ navigation }: any) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const next = () => {
    if (selectedTag === null) {
        console.log('selectedTag is empty');
        return;
      }
      post(
        '/api/quizz/submit/',
        { selectedTag },
        () => navigation.navigate(),
        () => {
        console.log('selectedTag', selectedTag)
          navigation.navigate('home');
        }
      )
    // if (selectedTag !== null) {
    //   // Post the selected tag to the API
    //   post('/api/quizz/submit/', { selectedTag }, () => {
    //     // Handle successful API post if needed
    //     // Then navigate to the next screen
    //     // () => navigation.navigate(),
    //     () => {
    //     navigation.navigate('main');
    //     }
    //   });
    // } else {
    //   // If no tag is selected, prevent navigation
    //   console.log('No tag selected');
    // }
  };

  useEffect(() => {
    console.log('selectedTag:', selectedTag);
    },
  ); 

  const selectTag = (tag: string) => {
    console.log('Tag:', selectedTag);
    // Save the selected tag in the state
    if (selectedTag != tag)
        setSelectedTag(tag);
    else
    setSelectedTag(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <Text style={styles.question}>3/3 - Comment avez-vous découvert Leon'Art ?</Text>
      <View style={styles.Tags}>
        <TagButton
          style={styles.TagButton}
          value="Réseaux sociaux"
          onPress={() => selectTag("Réseaux sociaux")}
          selected={selectedTag === "Réseaux sociaux"}
        />
        <TagButton
          style={styles.TagButton}
          value="Salon Professionnel"
          onPress={() => selectTag("Salon Professionnel")}
          selected={selectedTag === "Salon Professionnel"}
        />
        <TagButton
          style={styles.TagButton}
          textStyle={styles.TagButton}
          value="Bouche à oreilles"
          onPress={() => selectTag("Bouche à oreilles")}
          selected={selectedTag === "Bouche à oreilles"}
        />
        <TagButton
          style={styles.TagButton}
          textStyle={styles.TagButton}
          value="Autre"
          onPress={() => selectTag("Autre")}
          selected={selectedTag === "Autre"}
        />
      </View>
      <Button
        value="Terminé"
        onPress={next}
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
    alignItems: 'center',
    margin: 15,
    padding: 20,
    flex: 1,
  },
  TagButton: {
    margin: 15,
  },
});

export default ProfilingQuizzFinal;
