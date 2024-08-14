import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, _ScrollView } from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import colors from '../constants/colors';
import reportValues from '../constants/reportValues';
import { flex1, flexRow } from '../constants/styles';
import Button from '../components/buttons/Button';
import Card from '../components/cards/Card';
import Title from '../components/text/Title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationRouteContext, useNavigation, useRoute } from '@react-navigation/native';
import { get, post } from '../constants/fetch';
import Content from '../components/text/Content';
import { MainContext } from '../context/MainContext';


interface ReportPanelProps {
  type: 'account' | 'post';
  id: string | undefined;
}


const ReportScreen = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const route = useRoute();
  const params = route.params;
  const [reasons, setReasons] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState<string | undefined>(undefined);


  const getReasonsFromBack = () => {
    return get(
      "/api/signalments/infractions",
      context?.token,
      (res: any) => setReasons(res.data),
      (err: any) => console.error({ ...err })
    );
  }


  const submit = () => {
    const url = `/api/signalments/${params?.type === "account" ? "user" : "art-publication"}`;
    let object = undefined;

    if (params?.type === 'account') {
      object = {
        userId: params?.id,
        infraction: selectedReason,
        message: "MESSAGE"
      };
    } else {
      object = {
        artPublicationId: params?.id,
        infraction: selectedReason,
        message: "MESSAGE"
      };
    }

    post(
      url,
      object,
      context?.token,
      () => {
        ToastAndroid.show("Votre signalement a été pris en compte", ToastAndroid.SHORT);
        return navigation.navigate("home");
      },
      (err: any) => console.error({ ...err })
    );
  }


  useEffect(() => {
    getReasonsFromBack();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>Signaler</Title>

      <FlatList
        data={reasons}
        renderItem={({ item }) => (
          <Card style={{
            backgroundColor: selectedReason === item ? colors.offerBg : colors.default,
            marginHorizontal: 0,
          }}>
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

      <View style={[ flexRow ]}>

        {/* Cancel */}
        <Button
          secondary
          value="Annuler"
          onPress={() => navigation.goBack()}
          style={[ flex1, { marginLeft: 0 } ]}
        />

        {/* Submit */}
        <Button
          value="Signaler"
          disabled={!selectedReason}
          onPress={submit}
          style={[ flex1, { marginRight: 0 } ]}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 24
  },
  title: {
    marginBottom: 24
  }
});


export default ReportScreen;
