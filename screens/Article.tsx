import React, {useEffect} from 'react';
import {StyleSheet, ScrollView, TouchableOpacity, Text, Image} from 'react-native';
import colors from '../constants/colors';
import HTMLView from 'react-native-htmlview';
import {aiCenter, br12, cText, cTextDark, flexRow, fwBold, mb24, mb4, ml8, mv24} from "../constants/styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation, useRoute} from "@react-navigation/native";
import {getImageUrl} from "../helpers/ImageHelper";
import {formatName} from "../helpers/NamesHelper";

const Article = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { article } = route.params;


  useEffect(() => {
    console.log(article);
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[mb4, flexRow, aiCenter]}
      >
        <Ionicons
          name='chevron-back'
          size={32}
          color={colors.textDark}
        />
        <Text style={[cTextDark, { fontSize: 20 }, fwBold, ml8]}>
          { formatName(article.title, 30) }
        </Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={{ uri: getImageUrl(article?.mainImage) }}
          style={[{ height: 200}, mv24, br12]}
        />

        <Text style={styles.artTitle}>
          {article.title}
        </Text>

        <Text style={[cTextDark, mb24]}>
          Écrit par {article.author?.username ?? "un inconnu"}
        </Text>

        <HTMLView
          value={article.content}
          stylesheet={htmlStyles}
        />
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 8
  },
  logo: {
    flexDirection: 'row',
    height: 100,
    paddingLeft: 20,
    padding: 20,
    borderRadius: 5,
  },
  artTitle: {
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


const htmlStyles = StyleSheet.create({
  p: {
    color: colors.textDark
  },
  a: {
    color: colors.primary
  }
});

export default Article;
