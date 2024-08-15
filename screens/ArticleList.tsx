import React from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import colors from '../constants/colors';
import Title from '../components/text/Title';
import ArticleCard from '../components/cards/ArticleCard';

const { width } = Dimensions.get('window');

const ArticlesList = ({ navigation, route }: any) => {
  const { articles } = route.params;

  console.log('Articles data:', articles);

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Title style={{ color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>
      <Title style={{ marginLeft: 20, marginBottom: 20 }} size={28}>
        Tous les articles
      </Title>
      <ScrollView contentContainerStyle={styles.articlesContainer}>
        {articles.map((article: any) => {
          const author = article.author ? article.author.username : 'Unknown Author';
          const publicationDate = article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Unknown Date';

          return (
            <View key={article._id} style={styles.articleWrapper}>
              <ArticleCard
                onPress={() => navigation.navigate('article', { article })}
                item={article}
                path="article"
                style={styles.articleCard}
                imageStyle={styles.articleImage}
              />
              <Text style={styles.articleInfo}>
                {`Published on: ${publicationDate} by ${author}`}
              </Text>
            </View>
          );
        })}
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
  articleWrapper: {
    width: width - 32,
    marginBottom: 20,
  },
  articleInfo: {
    marginTop: 10,
    fontSize: 14,
    color: colors.gray,
    marginLeft: 16,
  },
  articleCard: {
    width: '100%',
  },
  articleImage: {
    width: '100%',
    height: 150,
  },
});

export default ArticlesList;