import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, _ScrollView } from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import colors from '../constants/colors';
import reportValues from '../constants/reportValues';
import { flex1, flexRow } from '../constants/styles';
import Button from '../components/buttons/Button';
import Card from '../components/cards/Card';
import Title from '../components/text/Title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationRouteContext, useNavigation, useRoute } from '@react-navigation/native';


interface ReportPanelProps {
  type: 'account' | 'post';
  id: string | undefined;
}


const ReportScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params;
  const _panel = useRef<SlidingUpPanel>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState<string | undefined>(undefined);


  const getReasonsFromBack = () => {
    // Call the back end for the values
    return setReasons(reportValues);
  }


  const submit = () => {
    // API call to submit the report
    return;
  }


  useEffect(() => {
    getReasonsFromBack();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <Title>Signaler</Title>

      <FlatList
        data={reasons}
        renderItem={({ item }) => (
          <Card
            style={{ backgroundColor: selectedReason === item ? colors.offerBg : colors.default }}
          >
            <TouchableOpacity
              onPress={() => setSelectedReason(item)}
            >
              <ScrollView horizontal>
                <Text
                  style={{ color: selectedReason === item ? colors.offerFg : colors.textDark }}
                >{ item.toString() }</Text>
              </ScrollView>
            </TouchableOpacity>
          </Card>
        )}
      />

      <View style={[ flexRow, flex1 ]}>

        {/* Cancel */}
        <Button
          secondary
          value="Annuler"
          onPress={() => navigation.goBack()}
          style={flex1}
        />

        {/* Submit */}
        <Button
          value="Signaler"
          disabled={!selectedReason}
          onPress={submit}
          style={flex1}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg
  }
});


export default ReportScreen;
