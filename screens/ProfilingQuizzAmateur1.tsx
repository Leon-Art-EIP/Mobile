import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { post } from '../constants/fetch';

import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg'
import { Image } from 'react-native-svg';

const ProfilingQuizzAmateur = ({ navigation }: any) => {

  const [artInterestType, setArtInterest] = useState<string[]>([]);

  const getArtInterest = (value: string) => {
    if (artInterestType.includes(value)) {
      // If yes, remove it
      const updatedInterestType = artInterestType.filter((tag) => tag !== value);
      setArtInterest(updatedInterestType);
    } else {
      // If not, add it
      setArtInterest([...artInterestType, value]);
    }
  };

  const next = () => {
    console.log('ici', artInterestType);
    console.log('Art Interest Types:', artInterestType);
    if (artInterestType.length === 0) {
      console.log('No parameter found');
      return;
    }
    post(
      '/api/quizz/submit/',
      { artInterestType },
      () => navigation.navigate(''),
      () => {
      console.log('Objective', artInterestType)
          navigation.navigate('profilingAmateur2');
        }
      )
  };

  const previous = () => {
      navigation.navigate('profiling');      
  };

return (
  <View style={styles.container}>
      <View style={styles.logo}>
          <Title style={{ color: colors.primary}}>Leon</Title>
          <Title>'Art</Title>
      </View>
      <Text style={styles.question}>1/3 - Quel type d'art vous intéresse ?</Text>
      <ScrollView style={styles.Tags}>
          <TagButton
          value="Peinture"
          style={styles.TagButton}
          onPress={() => getArtInterest("peinture")}
          // selected={artInterestType.includes("peinture")}
          />
          <TagButton 
          value="Calligraphie"
          style={styles.TagButton}
          onPress={() => getArtInterest("calligraphie")}
          // selected={artInterestType.includes("calligraphie")}
          />
          <TagButton 
          value="Photographie"
          style={styles.TagButton}
          onPress={getArtInterest}
          />
          <TagButton 
          value="Mode"
          style={styles.TagButton}
          onPress={getArtInterest}
          />
          <TagButton 
          value="Design Graphique"
          style={styles.TagButton}
          onPress={getArtInterest}
          />
          <TagButton 
          value="Tattoo"
          style={styles.TagButton}
          onPress={getArtInterest}
          />
          <TagButton 
          value="Dessin"
          style={styles.TagButton}
          onPress={getArtInterest}
          />
          <TagButton 
          value="Illustration"
          style={styles.TagButton}
          onPress={getArtInterest}
          />
          <TagButton 
          value="Sculpture"
          style={styles.TagButton}
          onPress={getArtInterest}
          />
          <TagButton 
          value="Ecriture"
          style={styles.TagButton}
          onPress={getArtInterest}
          />
          <TagButton 
          value="Video"
          style={styles.TagButton}
          onPress={getArtInterest}
          />
          <TagButton 
          value="Autre"
          style={styles.TagButton}
          onPress={getArtInterest}
          />
      </ScrollView>
      {/* <Image source={{'../assets/images'}}/> */}
      <View style={{ flexDirection: 'row' }}>
          <TagButton 
              style={ styles.toggle }
              value="Oui"
              // onPress={getArtInterest}
          />
          <Text style={{paddingRight: 20}}>
          Localiser ma position et optimise mon référencement sur l’application
          </Text>
      </View>
      <Button
          value="Suivant"
          onPress={next}
      />
      <Button
          style={{ backgroundColor: colors.secondary }}
          textStyle={{ color: colors.black}}
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
        // padding: 20,     
        margin: 50,   
        // flex: 1,

    },
    TagButton: {
        // alignItems: 'center',
        // justifyContent: 'space-between',
        // padding: 20,
        // margin: 15,
        // color: colors.white,
    },
    backButton: {
        backgroundColor: colors.primary,
    },
    toggle:
    {
        // borderRadius: 55,
        // minHeight: 14,
    }
});

export default ProfilingQuizzAmateur;