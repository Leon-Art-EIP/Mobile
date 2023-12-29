import { useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import { get } from '../constants/fetch';
import { MainContext } from '../context/MainContext';


type ResultsScreenProps = {
  url: string;
}

const ResultsScreen = () => {
  const route = useRoute();
  const params = route?.params as ResultsScreenProps;
  const context = useContext(MainContext);
  const [posts, setPosts] = useState<any[]>([]);


  useEffect(() => {
    get(
      "/api/explorer/search?" + params?.url,
      context?.token,
      (res: any) => setPosts(res?.data),
      (err: any) => console.error({ ...err })
    );
   }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      <Text>{ params?.url }</Text>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1
  }
});


export default ResultsScreen;
