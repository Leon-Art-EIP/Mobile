import React, { useContext, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, ToastAndroid, View, _ScrollView } from 'react-native';
import colors from '../constants/colors';
import { bgGrey, bgRed, br12, br20, cTextDark, flex1, flexRow, mb24, mbAuto, mh0, mh8, mt8, pv24 } from '../constants/styles';
import Button from '../components/buttons/Button';
import Card from '../components/cards/Card';
import Title from '../components/text/Title';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { get, post } from '../constants/fetch';
import { MainContext } from '../context/MainContext';
import Input from '../components/textInput/Input';


const ReportScreen = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const route = useRoute();
  const params = route.params;
  const [reasons, setReasons] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState<string | undefined>(undefined);
  const [comment, setComment] = useState<string>('');


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
        message: comment
      };
    } else {
      object = {
        artPublicationId: params?.id,
        infraction: selectedReason,
        message: comment
      };
    }

    post(
      url,
      object,
      context?.token,
      () => {
        ToastAndroid.show("Merci pour votre signalement !", ToastAndroid.SHORT);
        return navigation.goBack();
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

      <Text style={[cTextDark, mb24, mh8]}>
        Pourquoi voulez-vous signaler ce contenu ?
      </Text>

      <View style={{ flex: 2 }}>
        <FlatList
          data={reasons}
          renderItem={({ item }) => (
            <Card
              style={{
                backgroundColor: selectedReason === item ? colors.offerBg : colors.default,
                marginHorizontal: 0,
              }}
              pressable
              onPress={() => setSelectedReason(item)}
            >
              <ScrollView horizontal>
                <Text
                  style={{ color: selectedReason === item ? colors.offerFg : colors.textDark }}
                >{ item.toString() }</Text>
              </ScrollView>
            </Card>
          )}
        />
      </View>

      <View style={[mbAuto, flex1]}>
        <Text style={[cTextDark, mb24, mh8, mt8]}>
          Pouvez-vous nous donner plus d'information sur la nature de l'infraction ?
        </Text>

        <Input
          placeholder='Dites-nous en plus...'
          onTextChanged={setComment}
          style={[{ backgroundColor: colors.default }, br20, mh0]}
          multilines={3}
        />
      </View>

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
