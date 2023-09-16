import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import colors from '../constants/colors';
import { MESSAGES, MessageType } from '../constants/conversations';


type Message = {
  senderId: number;
  receiverId: number;
  bodyType: string; // either 'text', 'image', or 'offer'
  body: string | number;
};

const Conversation = ({ navigation, route }: any) => {
  const [messages, setMessages] = useState<Message[]>([ ...MESSAGES ]);
  const [newMessage, setNewMessage] = useState<string>("");

  const sendMessage = () => {
    // use newMessage to send the message via the backend
    return undefined;
  }


  useEffect(() => {
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.black} />

      {/* Title view */}
      <View style={styles.titleView}>
        <TouchableOpacity
          style={styles.arrowView}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={styles.arrowImage}
            source={require('../assets/icons/light_arrow.png')}
          />
        </TouchableOpacity>
        <Image
          style={styles.ppicImage}
          source={require('../assets/images/user.png')}
        />
        <View style={styles.usernameView}>
          <Text style={styles.usernameText}>{ route?.params?.name }</Text>
          <Text style={{ color: colors.disabledFg }}>Online</Text>
        </View>
        <TouchableOpacity style={styles.menuTouchable}>
          <Image
            style={styles.menuImage}
            source={require('../assets/icons/hamburger.png')}
          />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView style={styles.conversationContainer}>
        <Button value='Charger plus de messages' />
        { messages.map((msg: Message) => (
          <View key={msg.body.toString()}>
            <Text>{ msg.body }</Text>
          </View>
        )) }
      </ScrollView>

      {/* Input view */}
      <View style={styles.messageContainer}>
        <View style={styles.messageView}>

          {/* Micro */}
          <TouchableOpacity style={styles.micView}>
            <Image
              style={styles.micImage}
              source={require('../assets/icons/Microphone.png')}
            />
          </TouchableOpacity>

          {/* Input message */}
          <Input
            style={styles.messageInput}
            placeholder="Message ..."
            onTextChanged={(newMsg: string) => setNewMessage(newMsg)}
          />

          {/* Send button */}
          <TouchableOpacity
            style={[
              styles.micView,
              { backgroundColor: '#E3F3FF', marginLeft: 'auto' }
            ]}
            onPress={sendMessage}
          >
            <Image
              style={styles.micImage}
              source={require('../assets/icons/Sent.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
  },
  conversationContainer: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  titleView: {
    paddingVertical: 12,
    flexDirection: 'row',
  },
  ppicImage: {
    borderRadius: 50,
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: colors.white
  },
  usernameView: {
    marginHorizontal: 12,
    marginTop: 'auto',
    marginBottom: 'auto',
    alignItems: 'flex-start'
  },
  usernameText: {
    color: '#fff',
    fontSize: 16
  },
  arrowView: {
    backgroundColor: '#302D2B',
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 12,
    width: 50,
    height: 50
  },
  arrowImage: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 32,
    height: 32
  },
  menuTouchable: {
    marginLeft: 'auto',
    marginRight: 12,
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  menuImage: {
    width: 24,
    height: 24,
    marginLeft: 'auto'
  },
  messageContainer: {
    backgroundColor: colors.white,
    paddingBottom: 20
  },
  messageView: {
    backgroundColor: '#F8F8F9',
    borderRadius: 50,
    flexDirection: 'row',
    marginHorizontal: 12,
    padding: 8,
  },
  messageInput: {
    backgroundColor: colors.transparent,
    shadowColor: colors.transparent,
    borderRadius: 0,
    placeholderColor: '#B1B1B1'
  },
  micView: {
    width: 50,
    height: 50,
    backgroundColor: '#F4CCCC',
    alignItems: 'center',
    borderRadius: 50
  },
  micImage: {
    width: 32,
    height: 32,
    marginTop: 'auto',
    marginBottom: 'auto'
  }
});

export default Conversation;
