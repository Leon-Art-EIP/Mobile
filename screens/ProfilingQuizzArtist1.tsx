import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg';
import { Image } from 'react-native-svg';

const ProfilingQuizzArtist = ({ navigation }: any) => {
  const [artSellingType, setArtSelling] = useState<string[]>([]);

  const selectTag = (value: string) => {
    if (artSellingType.includes(value)) {
      // If yes, remove it
      const updatedSellingType = artSellingType.filter((tag) => tag !== value);
      setArtSelling(updatedSellingType);
    } else {
      // If not, add it
      setArtSelling([...artSellingType, value]);
    }
  };

  const next = () => {
    console.log('Selected Selling Types:', artSellingType);
    if (artSellingType.length === 0) {
      console.log('No parameter found');
      return;
    }
    post(
      '/api/quizz/submit/',
      { artSellingType },
      () => navigation.navigate('profilingArtist2'),
      () => {
        console.log('Objective', artSellingType)
        navigation.navigate('profilingArtist2');
      }
    );
  };

  const previous = () => {
    navigation.navigate('profiling');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <Text style={styles.question}>1/3 - Que comptez-vous vendre ?</Text>
      <ScrollView style={styles.Tags}>
        <TagButton
          value="Peinture"
          style={styles.TagButton}
          onPress={() => selectTag('peinture')}
        //   selected={artSellingType.includes('peinture')}
        />
        <TagButton
          value="Calligraphie"
          style={styles.TagButton}
          onPress={selectTag}
        //   onPress={() => selectTag('calligraphie')}
        //   selected={artSellingType.includes('calligraphie')}
        />
        <TagButton
          value="Photographie"
          style={styles.TagButton}
          onPress={selectTag}
        //   onPress={() => selectTag('photographie')}
        //   selected={artSellingType.includes('photographie')}
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
      <View style={{ flexDirection: 'row' }}>
          <TagButton 
              style={ styles.toggle }
              value="Oui"
            //   onPress={getArtInterest}
          />
          <Text style={{paddingRight: 20}}>
          Localiser ma position et optimise mon référencement sur l’application
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
    // justifyContent: 'space-between',
    // alignItems: 'center',
    margin: 50,
    // flex: 1,
    // padding: 15,
    // justifyContent: 'space-between',
    // margin: 50,
},
TagButton: {
    // marginBottom:10,
    // alignItems: 'center',
    // margin: 50,
  },
  toggle: {},
});

export default ProfilingQuizzArtist;
