import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from '../constants/colors';
import { acCenter, aiCenter, asCenter, bgRed, cTextDark, flex1, flexRow, jcCenter, mb8, mbAuto, mh4, mr8, mtAuto, mv4, mv8, taCenter } from '../constants/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { getNotifications, isNotificationRegistered, setupNotifications } from '../constants/notifications';
import { MainContext } from '../context/MainContext';
import Card from '../components/cards/Card';
import NotificationCard from '../components/NotificationCard';
import Title from '../components/text/Title';


const Notifications = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const [notifs, setNotifs] = useState<NotificationsType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isNotifErrorDisplayed, setIsNotifErrorDisplayed] = useState<boolean>(false);


  const getNotifs = async () => {
    let notifications = await getNotifications(context?.token, 20, page);
    setNotifs(notifications);
  }


  const getNextPage = () => {
    setPage(currentPage => currentPage + 1);
    return getNotifs();
  }


  const getPreviousPage = () => {
    if (page === 0) {
      return;
    }
    setPage(currentPage => currentPage - 1);
    return getNotifs();
  }


  useEffect(() => {
    if (!isNotificationRegistered()) {
      setIsNotifErrorDisplayed(true);
    }
    getNotifs();
  }, []);


  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={[ flexRow, mb8 ]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[ mtAuto, mbAuto, mr8 ]}
        >
          <Ionicons name="chevron-back-outline" color={colors.black} size={32} />
        </TouchableOpacity>
        <Title>Notifications</Title>
      </View>

      { isNotifErrorDisplayed && (
        <TouchableOpacity
          onPress={async () => {
            await setupNotifications(context?.token)
            setIsNotifErrorDisplayed(false);
          }}
        >
          <Card style={{ backgroundColor: colors.offerBg }}>
            <Text style={{ color: colors.offerFg }}>
              Les notifications sont désactivées ! Cliquez ici pour les activer !
            </Text>
          </Card>
        </TouchableOpacity>
      ) }

      <FlatList
        data={notifs}
        keyExtractor={item => item._id}
        renderItem={({ item, index }) => <NotificationCard item={item} index={index} />}
        contentContainerStyle={[ flex1 ]}
        ListFooterComponent={() => (
          <View style={[ flexRow, mv8, mtAuto ]}>
            {/* Previous button */}
            <TouchableOpacity
              onPress={getPreviousPage}
              disabled={page === 0}
              style={[ flex1, aiCenter ]}
            >
              <Ionicons
                name="chevron-back-outline"
                color={page === 0 ? colors.disabledFg : colors.black}
                size={24}
              />
            </TouchableOpacity>

            {/* Page number */}
            <Text style={[ flex1, taCenter, cTextDark ]}>{ "Page " + (page + 1) }</Text>

            {/* Next button */}
            <TouchableOpacity
              onPress={getNextPage}
              style={[ flex1, aiCenter ]}
            >
              <Ionicons
                name="chevron-forward-outline"
                color={colors.textDark}
                size={24}
              />
            </TouchableOpacity>
          </View>
        )}
      />

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 16
  }
});


export default Notifications;
