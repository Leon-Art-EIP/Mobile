import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import ArticleCard from '../components/cards/ArticleCard';

const ArticlesList = ({ navigation, route }: any) => {
  const { articles } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <ScrollView contentContainerStyle={styles.articlesContainer}>
        {articles.map((article: any) => (
          <ArticleCard
            key={article.id}
            onPress={() => navigation.navigate('article', { article })}
            item={article}
            path="article"
          />
        ))}
      </ScrollView>
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
  articlesContainer: {
    paddingBottom: 20,
  },
});

export default ArticlesList;
