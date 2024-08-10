import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import TagButton from '../components/tags/TagButton';
import { flex1, flexRow, mh4, ml0, mr0, mt4 } from '../constants/styles';


const ART_TYPES: string[] = [
  "Peinture", "Calligraphie", "Photographie", "Mode", "Design Graphique",
  "Tattoo", "Dessin", "Illustration", "Sculpture", "Ecriture", "Vidéo", "Autre"
];


const ProfilingQuizzArtist = ({ route, navigation } : any) => {
  const { objective } = route.params;
  const [artSellingType, setArtSelling] = useState([]);


  const selectTag = (value) => {
    setArtSelling((currentArtSellingType) => {
      console.log
      if (currentArtSellingType.includes(value)) {
        return currentArtSellingType.filter((tag) => tag !== value);
      }
      else {
        return [...currentArtSellingType, value];
      }
    });
    console.log('🟣 ArtSelling Datas;', artSellingType);
  };


  const next = () => {
    console.log('Selected Selling Types:', artSellingType);
    if (artSellingType.length === 0) {
      console.log('No parameter found');
      return;
    }

    navigation.navigate('profilingArtist2', {
      objective: objective,
      artSellingType: artSellingType,
    });
  };


  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>

      <Text style={styles.question}>1/3 - Que comptez-vous vendre ?</Text>

      <ScrollView style={styles.tags}>
        { ART_TYPES.map((type: string) => (
          <TagButton
            key={type}
            value={type}
            style={styles.tagButton}
            onPress={selectTag}
          />
        )) }
      </ScrollView>

      <View style={[ flexRow, mh4 ]}>
        <Button
          secondary
          style={[ flex1, ml0]}
          value="Retour"
          onPress={navigation.goBack}
        />

        <Button
          disabled={!artSellingType}
          value="Suivant"
          onPress={next}
          style={[flex1, mr0]}
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
    marginBottom: 6,
  },
  tagButton: {
    marginHorizontal: 5,
    marginVertical: 3,
  },
});

export default ProfilingQuizzArtist;
