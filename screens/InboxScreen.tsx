import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
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
  lastMessage: string;
};

const InboxScreen = ({ navigation }: any) => {
  const [conversations, setConversations] = useState<ConversationType[]>(CONVERSATIONS);

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, paddingHorizontal: 12, paddingBottom: 80 }}>
      <Title style={styles.mainTitle}>Messagerie</Title>
      <MessageTabs
        navigation={navigation}
        active='conversations'
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        { conversations.map((conversation: ConversationType) => (
          <TouchableOpacity
            key={conversation.id.toString()}
            style={styles.conversationView}
            onPress={() => navigation.navigate('single_conversation', { id: conversation.id, name: conversation.username })}
          >
            <View style={{ flexDirection: 'row', height: 60 }}>

              {/* Unread dot */}
              <View style={[
                styles.unreadDot,
                { backgroundColor: conversation.unread ? colors.primary : colors.white }
              ]} />

              <Image
                source={require('../assets/images/user.png')}
                style={styles.conversationPicture}
              />
              <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                <Title size={16}>{ conversation.username }</Title>
                <Text style={{
                  fontWeight: conversation.unread ? 'bold' : 'normal' }}>{ conversation.lastMessage }</Text>
              </View>
            </View>
            <View style={styles.lineView} />
          </TouchableOpacity>
        )) }
      </ScrollView>
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
  },
  conversationPicture: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginHorizontal: 12,
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  conversationView: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lineView: {
    marginTop: 4,
    marginLeft: 24,
    backgroundColor: '#00000022',
    height: 1
  },
  unreadDot: {
    backgroundColor: colors.primary,
    height: 6,
    width: 6,
    borderRadius: 50,
    marginTop: 'auto',
    marginBottom: 'auto',
  }
});

export default InboxScreen;
