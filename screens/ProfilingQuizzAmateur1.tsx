import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';

const ProfilingQuizzAmateur = ({ route, navigation } : any) => {
  const { objective } = route.params;
  const [artSellingType, setArtSelling] = useState([]);
  const [artInterestType, setArtInterest] = useState([]);

  const selectTag = (value) => {
    setArtInterest((currentartInterestType) => {
      console.log
      if (currentartInterestType.includes(value)) {
        console.log('🟠CuurentArtInteresttype1;', currentartInterestType);
        console.log('🟣Value;', value);
        return currentartInterestType.filter((tag) => tag !== value);
      } else {
        console.log('🟣CuurentArtInteresttype;', currentartInterestType);
        console.log('🟠Value;', value);
        return [...currentartInterestType, value];
      }
    });
    console.log('☘️ CuurentArtInteresttype2;', artInterestType);
  };

  const next = () => {
    console.log('Selected Selling Types:', artInterestType);
    if (artInterestType.length === 0) {
      console.log('No parameter found');
      return;
    }

    navigation.navigate('profilingAmateur2', {
      objective: objective,
      artInterestType: artInterestType,
    });
  };

  const previous = () => {
    navigation.navigate('profiling', { objective });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <Text style={styles.question}>1/3 - Quel type d'art souhaitez-vous découvrir ?</Text>
      <ScrollView style={styles.Tags}>
        <TagButton
          value="Peinture"
          style={styles.TagButton}
          onPress={() => selectTag('Peinture')}
        />
        <TagButton
          value="Calligraphie"
          style={styles.TagButton}
          onPress={selectTag}
        />
        <TagButton
          value="Photographie"
          style={styles.TagButton}
          onPress={selectTag}
        />
        <TagButton 
          value="Mode"
          style={styles.TagButton}
          onPress={selectTag}
          />
          <TagButton 
          value="Design Graphique"
          style={styles.TagButton}
          onPress={selectTag}
          />
          <TagButton 
          value="Tattoo"
          style={styles.TagButton}
          onPress={selectTag}
          />
          <TagButton 
          value="Dessin"
          style={styles.TagButton}
          onPress={selectTag}
          />
          <TagButton 
          value="Illustration"
          style={styles.TagButton}
          onPress={selectTag}
          />
          <TagButton 
          value="Sculpture"
          style={styles.TagButton}
          onPress={selectTag}
          />
          <TagButton 
          value="Ecriture"
          style={styles.TagButton}
          onPress={selectTag}
          />
          <TagButton 
          value="Video"
          style={styles.TagButton}
          onPress={selectTag}
          />
          <TagButton 
          value="Autre"
          style={styles.TagButton}
          onPress={selectTag}
          />
      </ScrollView>
      <View style={{ flexDirection: 'row', marginTop: 5, marginRight: 70 }}>
          <TagButton 
              style={ styles.toggle }
              value="Oui"
          />
          <Text style={{paddingRight: 20}}>
          Localiser ma position et optimiser mon référencement sur l’application
          </Text>
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
  flex: 1,
  marginHorizontal: 60,
  marginBottom: 6,
},
TagButton: {
  marginHorizontal: 5,
  marginVertical: 3,
},
  toggle: {},
});

export default ProfilingQuizzAmateur;
