//* Standard imports
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, TouchableOpacity, Alert, View } from 'react-native';
import CartComponent from '../components/inbox/CartComponent';

//* Local imports
import CommandsComponent from '../components/inbox/CommandsComponent';
import ConversationsComponent from '../components/inbox/ConversationsComponent';
import FollowersTabs from '../components/followers/FollowsTabs';
import Title from '../components/Title';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import FollowersComponent from '../components/followers/FollowersComponent';  // Importez le composant FollowersComponent
import FollowedComponent from '../components/followers/FollowedComponent';  // Importez le composant FollowersComponent

const FollowerList = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState<string>('followers');

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, paddingHorizontal: 12, paddingBottom: 80, flex: 1 }}>
      <StatusBar backgroundColor={colors.white} />
      <Title style={styles.mainTitle}>Follows</Title>
      <FollowersTabs
        active={selectedTab}
        setActive={setSelectedTab}
      />

      {(() => {
        switch (selectedTab) {
          case ('followers'): return (
            <FollowersComponent navigation={navigation} />
          );
          case ('followed'): return (
            <FollowedComponent navigation={navigation} />
          );
        }
      })() }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    marginHorizontal: 12,
    marginVertical: 32,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  selectedTab: {
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.primary,
  },
});

export default FollowerList;
