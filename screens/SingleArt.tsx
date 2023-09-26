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
  // navigation.navigate('profilingQuizzArtist2');
};

const selectTag = () => {
  // Save user preferences
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
        {/* <Icon name="heart" size={20} color="red" style={{ marginLeft: 10 }} /> Heart icon */}
        {/* <Text style={{ marginLeft: 10, fontSize: 20 }}>
          200€
        </Text> */}
        <Text style={{ marginLeft: 240, fontSize: 20 }}/>
          <Image
            style={styles.vector}
            source={require('../assets/icons/Vector.png')}
            // style={[
                //   styles.arrowImage,
            //   { transform: !isOpened ? [{ rotate: '180deg'}] : [] }
            // ]}
          />
                <Image
                    style={styles.favorite}
                    source={require('../assets/icons/favorite.png')}
                    // style={[
                    //   styles.arrowImage,
                    //   { transform: !isOpened ? [{ rotate: '180deg'}] : [] }
                    // ]}
                  />
        {/* <TagButton value="like" /> */}
        {/* <TagButton value="save" /> */}
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
        // width: 350,
        height: 100,
        paddingLeft: 20,
        padding: 20,
        // backgroundColor: colors.darkGreyBg,
        borderRadius: 5,
    },
    img: {
        margin: 13,
        height: 300,
        borderRadius: 4.5,
        backgroundColor: colors.placeholder,
    },
    artTitle: {
        // marginLeft: 'auto',
        textAlign: 'center',
        // marginTop: 20,
        marginBottom: 0,
        fontSize: 30,
        // bold: true,
        // font-family: 'Inter',
        // marginBottom: 40,
        // width: 169,
        color: '#000',
    },
    artText: {
        // marginLeft: 'auto',
        // marginRight: 'auto',
        // marginTop: 20,
        // marginBottom: 40,
        fontSize: 55,
        // fontFamily: 'Inter',
        // marginBottom: 40,
        // width: 169,
        color: '#000',
    },
    Tags: {
        justifyContent: 'space-between',
        margin: 50,
        flex: 1,
        // alignItems: 'center',
        // gap: 43,
        // padding: 20,

    },
    TagButton: {
        // marginBottom: 20,
        // padding: 20,
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
        // marginTop: 'auto',
        // marginBottom: 'auto'
    }
});


export default SingleArt;
