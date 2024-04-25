import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';

const Article = ({ navigation, route }: any) => {
  const { article } = route.params;

  const previous = () => {
    navigation.navigate('homemain');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <View style={{ flexDirection: 'row', paddingRight: 20, paddingLeft: 20 }}>
        <Title style={styles.artTitle}>
          {article.title}
        </Title>
      </View>
      <View>
        <Text
          style={styles.textInput}
        >
          {article.content}
        </Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          style={{ backgroundColor: colors.secondary, marginTop: 400 }}
          textStyle={{ color: colors.black }}
          value="Retour"
          onPress={previous}
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
  artTitle: {
    textAlign: 'center',
    marginBottom: 0,
    fontSize: 40,
    color: colors.black,
    fontWeight: 'bold',
  },
  textInput: {
    marginLeft: 25,
    marginRight: 15,
    marginBottom: 20,
    marginTop: 20,
    color: colors.black
  },
});

export default Article;
