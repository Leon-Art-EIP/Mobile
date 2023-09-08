import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Title from '../components/Title';
import colors from '../constants/colors';

type ConversationType = {
  id: number;
  unread: boolean;
  status: 'untreated' | 'waiting' | 'finished';
  username: string;
  lastMessage: string;
};

type ConversationFilterType = {
  status: 'untreated' | 'waiting' | 'finished';
  name: string;
  data: ConversationType[]
};

const ConversationFilter = ({
  status = 'untreated',
  name = "Non traitées",
  data = []
}: ConversationFilterType) => {
  const [isOpened, setIsOpened] = useState<boolean>(true);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setIsOpened(current => !current)}>
        <View style={styles.container}>
          <Title size={18} bold={false}>{ name }</Title>
          <Image
            source={require('../assets/icons/arrow.png')}
            style={[
              styles.arrowImage,
              { transform: !isOpened ? [{ rotate: '180deg'}] : [] }
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
      { isOpened && data.map((conversation: ConversationType) => conversation.status === status ? (
        <View key={conversation.id.toString()} style={styles.conversationView}>
          <View style={{ flexDirection: 'row', height: 60 }}>

            {/* Unread dot */}
            <View style={[
              styles.unreadDot,
              { backgroundColor: conversation.unread ? colors.primary : colors.white }
            ]} />

            <Image
              style={styles.conversationPicture}
              source={require('../assets/images/user.png')}
            />
            <View>
              <Title size={16}>{ conversation.username }</Title>
              <Text style={{
                fontWeight: conversation.unread ? 'bold' : 'normal' }}>{ conversation.lastMessage }</Text>
            </View>
          </View>
          <View style={styles.lineView} />
        </View>
      ) : (
        <View key={Math.random().toString()}></View>
      )) }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  arrowImage: {
    height: 22,
    width: 22,
    marginLeft: 'auto'
  },
  conversationPicture: {
    width: 50,
    height: 50,
    marginHorizontal: 12
  },
  conversationView: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lineView: {
    marginTop: 8,
    marginLeft: 24,
    backgroundColor: '#00000044',
    height: 1
  },
  unreadDot: {
    backgroundColor: colors.primary,
    height: 6,
    width: 6,
    borderRadius: 50,
    marginTop: 'auto',
    marginBottom: 'auto'
  }
});

export default ConversationFilter;
