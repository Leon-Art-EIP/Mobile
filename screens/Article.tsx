import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import Button from '../components/buttons/Button';
import Content from '../components/text/Content';

const Article = ({ navigation, route }: any) => {
  const { article } = route.params;

  const previous = () => {
    navigation.navigate('homemain');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logo}>
          <Title style={{ color: colors.primary }}>Leon</Title>
          <Title>'Art</Title>
        </View>
        <View style={styles.artTitleContainer}>
          <Title style={styles.artTitle}>
            {article.title}
          </Title>
        </View>
        <Content style={styles.textInput}>
          {article.content}
        </Content>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
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
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Add some bottom padding to prevent content from being hidden behind the button
  },
  logo: {
    flexDirection: 'row',
    height: 100,
    padding: 20,
    borderRadius: 5,
  },
  artTitleContainer: {
    flexDirection: 'row',
    paddingRight: 20,
    paddingLeft: 20,
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
    color: colors.black,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 16,
  },
  button: {
    backgroundColor: colors.secondary,
  },
});

export default Article;