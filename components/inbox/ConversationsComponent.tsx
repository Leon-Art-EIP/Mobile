//* Standard imports
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, Image, StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native'

//* Local imports
import colors from '../../constants/colors';
import { CONVERSATIONS } from '../../constants/conversations';
import Title from '../Title';

type ConversationType = {
  id: number;
  unread: boolean;
  status: 'untreated' | 'waiting' | 'finished';
  username: string;
  lastMessage: string;
};

const ConversationsComponent = () => {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState<ConversationType[]>(CONVERSATIONS);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      { conversations.map((conversation: ConversationType) => (
        <TouchableOpacity
          key={conversation.id.toString()}
          style={styles.conversationView}
          onPress={() => navigation?.navigate('single_conversation', { id: conversation.id, name: conversation.username })}
        >
          <View style={{ flexDirection: 'row', height: 60 }}>

            {/* Unread dot */}
            <View style={[
              styles.unreadDot,
              { backgroundColor: conversation.unread ? colors.primary : colors.white }
            ]} />

            <Image
              source={require('../../assets/images/user.png')}
              style={styles.conversationPicture}
            />
            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Title size={16}>{ conversation.username }</Title>
              <Text numberOfLines={1} style={{
                fontWeight: conversation.unread ? 'bold' : 'normal',
                flexShrink: 1
              }}>{ conversation.lastMessage }</Text>
            </View>
          </View>
          <View style={styles.lineView} />
        </TouchableOpacity>
      )) }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  conversationPicture: {
    borderWidth: 1,
    borderColor: colors.white,
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

export default ConversationsComponent;
