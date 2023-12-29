import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import { get } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';

type TabType = {
  id: string;
  name: string;
};

const TABS: TabType[] = [
  {
    id: 'conversations',
    name: 'Conversations'
  },
  {
    id: 'commands',
    name: 'Commandes'
  },
  {
    id: 'cart',
    name: 'Panier'
  }
];

const MessageTabs = ({ active = 'conversations', setActive = (e: string) => {} }: any) => {
  const context = useContext(MainContext);

  return (
    <View style={styles.container}>
      {TABS.map((tab: TabType) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.bubble,
            { backgroundColor: active === tab.id ? colors.darkGreyBg : colors.disabledBg }
          ]}
          onPress={() => setActive(tab.id)}
        >
          <Text style={{ color: active === tab.id ? colors.white : colors.darkGreyFg }}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});

export default MessageTabs;
