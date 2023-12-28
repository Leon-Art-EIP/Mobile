import { useRoute } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { get } from '../constants/fetch';
import { MainContext } from '../context/MainContext';


type ResultsScreenProps = {
  url: string;
}

const ResultsScreen = () => {
  const route = useRoute();
  const params = route?.params as ResultsScreenProps;
  const context = useContext(MainContext);


  useEffect(() => {
    get(
      "/api/explorer/search?" + params?.url,
      context?.token,
      (res: any) => console.log(res),
      (err: any) => console.error({ ...err })
    );
   }, []);


  return (
    <Text>{ params?.url }</Text>
  );
}


const styles = StyleSheet.create({
});


export default ResultsScreen;
