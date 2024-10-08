import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';

type TabType = {
  id: string;
  name: string;
};

const TABS: TabType[] = [
  {
    id: 'followers',
    name: 'Followers'
  },
  {
    id: 'followed',
    name: 'Suivi(e)s'
  }
];

const FollowsTabs = ({
  active = 'followers',
  setActive = (e: string) => {}
}: any) => {
  return (
    <View style={styles.container}>
      { TABS.map((tab: TabType) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.bubble,
            { backgroundColor: active === tab.id ? colors.darkGreyBg : colors.disabledBg }
          ]}
          onPress={() => setActive(tab.id)}
        >
          <Text
            style={{ color: active === tab.id ? colors.white : colors.darkGreyFg }}
          >{ tab.name }</Text>
        </TouchableOpacity>
      )) }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    display: 'flex',
    marginBottom: 12
  },
  bubble: {
    borderRadius: 50,
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 8,
    alignItems: 'center'
  }
});

export default FollowsTabs;
