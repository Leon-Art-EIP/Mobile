import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native'
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg'

// const nextPage = ({ navigation }: any) => {
//     navigation.navigate('profilingQuizzArtist2');
    
// };

const ProfilingQuizzAmateur2 = ({ navigation }: any) => {

    const [budget, setBudget] = useState<Number | null>(null);

    const next = () => {
        if (budget === null) {
          console.log('Budget is empty');
          return;
        }
        post(
          '/api/quizz/submit/',
          { budget },
          () => navigation.navigate(),
          () => {
          console.log('budget', budget)
            navigation.navigate('profilingLast');
          }
        )
      };

    const previous = () => {
        navigation.navigate('profilingAmateur');
    };

    useEffect(() => {
        console.log('Budget min:', budget);
      }, [budget]); 

    const getBudget = (value: number) => {
        if (budget === value) {
          setBudget(null);
        }
        else
          setBudget(value);
    };

  return (
<View style={styles.container}>
    <View style={styles.logo}>
        <Title style={{ color: colors.primary}}>Leon</Title>
        <Title>'Art</Title>
    </View>
    <Text style={styles.question}>2/3 - Quel est votre budget ?</Text>
    <View style={styles.Tags}>
      <TagButton style={styles.TagButton}
        value="0 - 100€"
        onPress={() => getBudget(99)}
      />
      <TagButton style={styles.TagButton}
        value="100 - 1 000€"
        onPress={() => getBudget(100)}
        />
      <TagButton style={styles.TagButton}
        textStyle={styles.TagButton}
        value="1 000 - 10 000€"
        onPress={() => getBudget(1000)}
      />
    <TagButton style={styles.TagButton}
        textStyle={styles.TagButton}
        value="+ 10 000€"
        onPress={() => getBudget(10000)}
        />
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
        marginTop: 0,
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
        // justifyContent: 'space-between',
        // padding: 20,
        // margin: 15,
    },

    TagButtonText: {
        color: '#000',
    },
});


export default ProfilingQuizzAmateur2;
