import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';

// Local imports
import Title from '../../components/text/Title';
import colors from '../../constants/colors';
import { MainContext } from '../../context/MainContext';
import { get } from '../../constants/fetch';
import {flex1} from "../../constants/styles";
import Ionicons from "react-native-vector-icons/Ionicons";


const GeneralConditions = () => {
  const navigation = useNavigation();
  const [conditions, setConditions] = useState<string | null>(null);
  const context = useContext(MainContext);


  const fetchGeneralCondition = () => {
    get(
      '/api/conditions',
      context?.token,
      (res: any) => setConditions(res.data?.conditions),
      (err: any) => console.error({ ...err })
    );
  };

  useEffect(() => {
    fetchGeneralCondition();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} />

      {/* Go back button */}
      <TouchableOpacity
        onPress={navigation.goBack}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back-outline" color={colors.black} size={32} />
      </TouchableOpacity>

      <Title style={styles.mainTitle}>Conditions générales de vente</Title>

      <ScrollView contentContainerStyle={flex1}>
        <Text style={styles.textContent}>{ conditions }</Text>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    flex: 1
  },
  mainTitle: {
    marginTop: 70,
    marginHorizontal: 12,
    marginVertical: 32,
    fontSize: 25,
  },
  textContent: {
    marginTop: 5,
    marginHorizontal: 12,
    marginVertical: 32,
    fontSize: 15,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    color: colors.tertiary,
  },
});

export default GeneralConditions;
