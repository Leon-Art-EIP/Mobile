import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native'
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg'

const nextPage = () => {
    navigation.navigate('signup');
};

const ProfilingQuizz = () => {
  return (
<View style={styles.container}>
    <View style={styles.logo}>
        <Title style={{ color: colors.primary}}>Leon</Title>
        <Title>'Art</Title>
    </View>
        <Text style={styles.homeTitle}>Bienvenue !</Text>
        <Text style={styles.homeText}>Avec Leon'Art vous souhaitez...</Text>
    <View style={styles.Tags}>
        <Button style={styles.TagButton} textStyle={styles.TagButtonText}
            value="Découvrir des œuvres d'art"
            // onPress={handleRegister}
        />
        <Button style={styles.TagButton} textStyle={styles.TagButtonText}
            value="Acheter des œuvres d'art"
            // onPress={handleRegister}
            />
        <Button style={styles.TagButton} textStyle={styles.TagButtonText}
            value="Vendre mes œuvres d'art"
            // onPress={handleRegister}
            />
        <TagButton/>
    </View>
    <Button
        value="Suivant"
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
    homeTitle: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 20,
        marginBottom: 0,
        fontSize: 30,
        // bold: true,
        // font-family: 'Inter',
        // marginBottom: 40,
        // width: 169,
        color: '#000',
    },
    homeText: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 20,
        marginBottom: 40,
        fontSize: 18,
        // font-family: 'Inter',
        // marginBottom: 40,
        // width: 169,
        color: '#000',
    },
    Tags: {
        margin: 15,
        gap: 43,
    },
    TagButton: {
        marginBottom: 20,
        backgroundColor: '#F4F4F4',
        
    },
    TagButtonText: {
        color: '#000',
    },
});


export default ProfilingQuizz;
