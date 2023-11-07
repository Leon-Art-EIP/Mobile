//* Standard imports
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text } from 'react-native';
import CartComponent from '../components/inbox/CartComponent';
import CommandsComponent from '../components/inbox/CommandsComponent';

//* Local imports
import ConversationsComponent from '../components/inbox/ConversationsComponent';
import MessageTabs from '../components/inbox/MessageTabs';
import Title from '../components/Title';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';


const InboxScreen = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState<string>('conversations');

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, paddingHorizontal: 12, paddingBottom: 80, flex: 1 }}>
      <StatusBar backgroundColor={colors.white} />
      <Title style={styles.mainTitle}>Messagerie</Title>
      <MessageTabs
        active={selectedTab}
        setActive={setSelectedTab}
      />

      {(() => {
        switch (selectedTab) {
          case ('conversations'): return (
            <ConversationsComponent navigation={navigation} />
          );
          case ('commands'): return (
            <CommandsComponent />
          );
          case ('cart'): return (
            <CartComponent />
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
    marginHorizontal: 12,
    marginVertical: 32
  }
});

export default InboxScreen;
