import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ConversationFilter from '../components/ConversationFilter';
import MessageTabs from '../components/MessageTabs';
import Title from '../components/Title';
import colors from '../constants/colors';
import CONVERSATIONS from '../constants/conversations';

type ConversationType = {
  id: number;
  unread: boolean;
  status: 'untreated' | 'waiting' | 'finished';
  username: string;
};

const InboxScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={{ backgroundColor: colors.white }}>
      <Title>Messagerie</Title>
      <MessageTabs
        navigation={navigation}
        active='conversations'
      />
      <ScrollView>
        <ConversationFilter name="Non traitées" status="untreated" data={CONVERSATIONS} />
        <ConversationFilter name="En cours" status="waiting" data={CONVERSATIONS} />
        <ConversationFilter name="Terminées" status="finished" data={CONVERSATIONS} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1
  }
});

export default InboxScreen;
