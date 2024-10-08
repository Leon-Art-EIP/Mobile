import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';

// Local imports
import FollowersTabs from '../components/followers/FollowsTabs';
import Title from '../components/text/Title';
import colors from '../constants/colors';
import FollowersComponent from '../components/followers/FollowersComponent';
import FollowedComponent from '../components/followers/FollowedComponent';
import { useBackHandler } from '@react-native-community/hooks';


const FollowerList = ({ navigation }: any) => {
  const [selectedTab, setSelectedTab] = useState<string>('followers');


  useBackHandler(() => navigation.goBack());


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.white} />
      <Title style={styles.mainTitle}>Follows</Title>
      <FollowersTabs
        active={selectedTab}
        setActive={setSelectedTab}
      />

      {(() => {
        switch (selectedTab) {
          case ('followers'): return (
            <FollowersComponent isFollower={true} listener={selectedTab} />
          );
          case ('followed'): return (
            <FollowersComponent isFollower={false} listener={selectedTab} />
          );
        }
      })() }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingBottom: 80,
    flex: 1
  },
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