// Standard imports
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text } from 'react-native';
import CartComponent from '../components/inbox/CartComponent';
import CommandsComponent from '../components/inbox/CommandsComponent';
import Ionicons from "react-native-vector-icons/Ionicons";
import { View } from 'react-native';

// Local imports
import ConversationsComponent from '../components/inbox/ConversationsComponent';
import MessageTabs from '../components/inbox/MessageTabs';
import Title from '../components/text/Title';
import colors from '../constants/colors';
import { TouchableOpacity } from 'react-native';
import { flexRow, mv24, aiCenter, mh8 } from '../constants/styles';

const InboxScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState<string>('conversations');

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, paddingHorizontal: 12, paddingBottom: 80, flex: 1 }}>
      <StatusBar backgroundColor={colors.white} barStyle='dark-content' />
      <View style={[ flexRow, mv24, aiCenter, mh8 ]}>
      <TouchableOpacity
          onPress={() => navigation.goBack()}
          >
          <Ionicons name="chevron-back-outline" color={colors.black} size={32} />
        </TouchableOpacity>
      <Title style={styles.mainTitle}>Messagerie</Title>
      </View>
      <MessageTabs
        active={selectedTab}
        setActive={setSelectedTab}
      />

      {(() => {
        switch (selectedTab) {
          case ('conversations'): return (
            <ConversationsComponent />
          );
          case ('commands'): return (
            <CommandsComponent />
          );
        }
      })() }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1
  },
  mainTitle: {
    marginLeft: 12,
  },
  logo: {
    alignItems: 'center',
    borderColor: 'red',
    flexDirection: 'row',
  },
});

export default InboxScreen;
