import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native'
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg'

const nextPage = ({ navigation }: any) => {
    navigation.navigate('profilingQuizzArtist2');
    
};
const selectTag = () => {
    // Save user preferences
};
const ProfilingQuizz = () => {
  return (
<View style={styles.container}>
    <View style={styles.logo}>
        <Title style={{ color: colors.primary}}>Leon</Title>
        <Title>'Art</Title>
    </View>
    <Text style={styles.question}>2/3 - Souhaitez-vous proposer des créations personnalisées ?</Text>
    <View style={styles.Tags}>
        <TagButton
        value="Oui"
        style={styles.TagButton}
        textStyle={styles.TagButtonText}
        onPress={selectTag}
        />
        <TagButton 
        value="Non"
        style={styles.TagButton}
        textStyle={styles.TagButtonText}
        onPress={selectTag}
        />
        <TagButton 
        value="Peut-être plus tard"
        style={styles.TagButton}
        textStyle={styles.TagButtonText}
        onPress={selectTag}
        />
    </View>
    <Button
        value="Suivant"
        onPress={nextPage}
        // onPress={handleRegister}
    />
    <Button  style={styles.backButton}
        value="Retour"
        onPress={nextPage}
        // onPress={handleRegister}
    />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        color: '#FFFF',
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
        // flexDirection: 'center/',
        flex: 1,
        padding: 20,
    },
    TagButton: {
        marginBottom: 20,
        backgroundColor: '#F4F4F4',
        
    },
    TagButtonText: {
        color: '#000',
    },
    backButton: {
        backgroundColor: '#F4F4F4',
        color: '#000',
    }
});


export default ProfilingQuizz;
