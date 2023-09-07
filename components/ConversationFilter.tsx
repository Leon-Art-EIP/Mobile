import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Title from '../components/Title';

type ConversationType = {
  id: number;
  unread: boolean;
  status: 'untreated' | 'waiting' | 'finished';
  username: string;
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
              styles.image,
              { transform: !isOpened ? [{ rotate: '180deg'}] : [] }
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
      { isOpened && data.map((conversation: ConversationType) => conversation.status === status ? (
        <View>
          <Text>{ conversation.username }</Text>
        </View>
      ) : (
        <></>
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
  image: {
    height: 22,
    width: 22,
    marginLeft: 'auto'
  }
});

export default ConversationFilter;
