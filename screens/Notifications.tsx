import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from '../constants/colors';
import { aiCenter, cTextDark, flex1, flexRow, mb8, mbAuto, mh24, mr8, mtAuto, mv24, taCenter } from '../constants/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getNotifications, isNotificationRegistered } from '../constants/notifications';
import { MainContext } from '../context/MainContext';
import NotificationCard from '../components/NotificationCard';
import Title from '../components/text/Title';


type NotifType = {
  id: string;
  recipient: string;
  type: 'follow' | 'like' | 'order_shipping' | 'order_processing';
  content: string;
  referenceId: string;
  read: boolean;
  createdAt: Date;
  __v: number;
};


// Notification number per page
const LIMIT = 20;


const Notifications = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const [notifs, setNotifs] = useState<NotifType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isNotifErrorDisplayed, setIsNotifErrorDisplayed] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);


  const getNotifs = async () => {
    setIsRefreshing(true);
    const notifications = await getNotifications(context?.token, LIMIT, page);

    if (!notifications) {
      return ToastAndroid.show(
        "Nous n'avons pas réussi à récupérer les notifications",
        ToastAndroid.LONG
      );
    }

    setNotifs([ ...notifications ]);
    setIsRefreshing(false);
  };


  const getNextPage = () => {
    setPage(currentPage => currentPage + 1);
    return getNotifs();
  };


  const getPreviousPage = () => {
    if (page === 0) {
      return;
    }
    setPage(currentPage => currentPage - 1);
    return getNotifs();
  };


  useEffect(() => {
    if (!isNotificationRegistered()) {
      setIsNotifErrorDisplayed(true);
    }
    getNotifs();
  }, []);


  useFocusEffect(
    useCallback(() => {
      getNotifs();
    }, [navigation])
  );


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
        <Title style={mh24}>Notifications</Title>
      </View>

      {/* This shit has to be fixed one day (but not today) */}
      {/* isNotifErrorDisplayed && (
        <TouchableOpacity
          onPress={async () => {
            await setupNotifications(context?.token);
            setIsNotifErrorDisplayed(false);
          }}
        >
          <Card style={{ backgroundColor: colors.offerBg, marginHorizontal: 4 }}>
            <Text style={{ color: colors.offerFg }}>
              Les notifications sont désactivées ! Cliquez ici pour les activer !
            </Text>
          </Card>
        </TouchableOpacity>
      ) */}

      <FlatList
        data={notifs}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <NotificationCard
            key={item.id}
            item={item}
            index={index}
          />
        )}
        refreshControl={
          <RefreshControl
            tintColor={context?.userColor}
            colors={[ context?.userColor ?? colors.primary ]}
            refreshing={isRefreshing}
            onRefresh={getNotifs}
          />
        }
        style={[ flex1 ]}
      />

      <View style={[ flexRow, mv24 ]}>

        {/* Previous button */}
        <TouchableOpacity
          onPress={getPreviousPage}
          disabled={page === 0}
          style={[ flex1, aiCenter ]}
        >
          <Ionicons
            name="chevron-back-outline"
            color={page === 0 ? colors.disabledFg : colors.textDark}
            size={24}
          />
        </TouchableOpacity>

        {/* Page number */}
        <Text style={[ flex1, taCenter, cTextDark ]}>{ "Page " + (page + 1) }</Text>

        {/* Next button */}
        <TouchableOpacity
          onPress={getNextPage}
          style={[ flex1, aiCenter ]}
          disabled={notifs.length !== LIMIT}
        >
          <Ionicons
            name="chevron-forward-outline"
            color={notifs.length === LIMIT ? colors.textDark : colors.disabledFg}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 16
  }
});


export default Notifications;
