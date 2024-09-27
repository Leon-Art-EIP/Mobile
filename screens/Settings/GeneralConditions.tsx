import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  ScrollView, View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';

// Local imports
import Title from '../../components/text/Title';
import colors from '../../constants/colors';
import { MainContext } from '../../context/MainContext';
import { get } from '../../constants/fetch';
import {aiCenter, flex1, flexRow, mv24} from "../../constants/styles";
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
      <StatusBar
        backgroundColor={colors.white}
        barStyle='dark-content'
      />

      <View style={[flexRow, aiCenter, mv24]}>
        {/* Go back button */}
        <TouchableOpacity onPress={navigation.goBack}>
          <Ionicons
            name="chevron-back-outline"
            color={colors.textDark}
            size={32}
          />
        </TouchableOpacity>

        <Title style={styles.mainTitle}>
          Conditions générales de vente
        </Title>
      </View>

      <ScrollView contentContainerStyle={flex1}>
        <Text style={styles.textContent}>
          { conditions }
        </Text>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    height: '100%'
  },
  mainTitle: {
    marginHorizontal: 12,
    fontSize: 20,
    color: colors.textDark
  },
  textContent: {
    marginTop: 5,
    marginHorizontal: 12,
    marginVertical: 32,
    fontSize: 15,
    color: colors.textDark
  }
});

export default GeneralConditions;