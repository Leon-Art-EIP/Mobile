import React, { useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { post } from '../constants/fetch';
import colors from '../constants/colors';
import Title from '../components/Title';
import Button from '../components/Button';
import TagButton from '../components/TagButton';
import Toggle from '../assets/images/toggle.svg';

const nextPage = () => {
};

const selectTag = () => {
};

const SingleArt = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <View style={{ flexDirection: 'row', paddingRight: 20, paddingLeft: 20 }}>
        <TagButton
          value="<"
          onPress={selectTag}
        />
        <Text style={styles.artTitle}>Les voix du Néant</Text>
      </View>
      <View>
        <Image style={styles.img} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 20, paddingLeft: 20 }}>
        <TagButton value="" />
        <Text style={{ marginLeft: 170, fontSize: 20 }}/>
        <TagButton value="Save" />
        <TagButton value="Like" />
      </View>
      <View>
      <Text style={{ marginLeft: 20, fontSize: 20 }}>
          200€
        </Text>
      <Text style={{ marginLeft: 20, fontSize: 15 }}>
        Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
      </Text>
      </View>
      <View style={{ marginTop: 20 }}>

        <Button
          value="Acheter"
          onPress={nextPage}
        />
        <Button
          style={{ backgroundColor: colors.secondary }}
          textStyle={{ color: colors.black }}
          value="Retour"
          onPress={nextPage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.white,
    },
    logo: {
        flexDirection: 'row',
        height: 100,
        paddingLeft: 20,
        padding: 20,
        borderRadius: 5,
    },
    img: {
        margin: 13,
        height: 300,
        borderRadius: 4.5,
        backgroundColor: colors.placeholder,
    },
    artTitle: {
        textAlign: 'center',
        marginBottom: 0,
        fontSize: 30,
        color: '#000',
    },
    artText: {
        fontSize: 55,
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
    favorite: {
    margin: 10,
    },
    vector: {
        width: 25,
        height: 31,
    }
});


export default SingleArt;
