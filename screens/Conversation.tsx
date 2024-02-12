import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  FlatList
} from 'react-native';
import TextBubble from '../components/inbox/TextBubble';
import colors from '../constants/colors';
import { MessageType } from '../constants/conversations';
import { get, post } from '../constants/fetch';
import { MainContext } from '../context/MainContext';
import SockHelper from '../helpers/SocketHelper';
import Ionicons from 'react-native-vector-icons/Ionicons';


type ConversationParams = {
  /*
   * name: name of the correspondant
   */
  name: string;

  /*
   * ids:
   * [0]: conversation ID
   * [1]: user ID
   * [2]: correspondant ID
   */
  ids: number[];
} | undefined;


const Conversation = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const route: any = useRoute();
  const params = route?.params as ConversationParams;
  const context = useContext(MainContext);
  const scrollView = useRef<ScrollView>(null);


  const sendMessage = () => {
    if (!newMessage) {
      return
    }

    const body = {
      convId: params?.ids[0],
      userId: context?.userId,
      contentType: 'string',
      content: newMessage.toString()
    };

    const socketBody = {
      to: params?.ids[1] === context?.userId ? params?.ids[2] : params?.ids[1],
      from: context?.userId,
      convId: params?.ids[0],
      msg: newMessage.toString()
    }

    // use newMessage to send the message via the backend
    SockHelper.emit('send-msg', socketBody);
    post(
      `/api/conversations/messages/new`,
      body,
      context?.token,
      () => {
        getConversation();
        setNewMessage("");
      },
      (err) => console.warn({ ...err })
    );
  }


  const getConversation = () => {
    get(
      `/api/conversations/messages/${params?.ids[0]}`,
      context?.token,
      (res: any) => setMessages(res?.data?.messages),
      (err: any) => console.warn({...err})
    );
  }


  const goBack = () => {
    SockHelper.off('msg-receive');
    return navigation.goBack();
  }

  useEffect(() => {
    getConversation();

    SockHelper.start(process.env.REACT_APP_API_URL, true);
    SockHelper.emit('add-user', context?.userId);
    SockHelper.on('msg-recieve', getConversation);
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.disabledBg} barStyle='dark-content' />

      {/* Title view */}
      <View style={styles.titleView}>
        <TouchableOpacity
          style={styles.arrowView}
          onPress={goBack}
        >
          <Ionicons
            name="chevron-back"
            color={colors.black}
            size={24}
            style={styles.arrowImage}
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
      </View>

      {/* Messages */}
      {/* <ScrollView */}
      {/*   contentContainerStyle={styles.conversationContainer} */}
      {/*   ref={scrollView} */}
      {/*   onContentSizeChange={(_, height) => scrollView.current?.scrollTo({ y: height, animated: true })} */}
      {/* > */}
      {/*   { messages && messages.map((msg: MessageType) => ( */}
      {/*       <TextBubble message={msg} key={msg._id} /> */}
      {/*   )) } */}
      {/* </ScrollView> */}

      {/* Messages FlatList */}
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <TextBubble message={item} key={item._id} />
        )}
        keyExtractor={(msg: MessageType) => msg._id.toString()}
        contentContainerStyle={styles.conversationContainer}
      />

      {/* Input view */}
      <View style={styles.messageContainer}>
        <View style={styles.messageView}>

          {/* Input message */}
          <TextInput
            style={styles.messageInput}
            placeholder="Message ..."
            onChangeText={(newMsg: string) => setNewMessage(newMsg)}
            value={newMessage}
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
    backgroundColor: colors.disabledBg,
    flex: 1,
  },
  conversationContainer: {
    backgroundColor: colors.white,
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    paddingBottom: 12
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
    color: colors.darkGreyFg,
    fontSize: 16
  },
  arrowView: {
    /* backgroundColor: '#302D2B', */
    backgroundColor: colors.disabledBg,
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
    marginRight: 'auto'
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
    paddingBottom: 12
  },
  messageView: {
    backgroundColor: '#F8F8F9',
    borderRadius: 50,
    flexDirection: 'row',
    marginHorizontal: 12,
    paddingHorizontal: 4,
    alignItems: 'center'
  },
  messageInput: {
    paddingHorizontal: 12,
    backgroundColor: colors.transparent,
    shadowColor: colors.transparent,
    borderRadius: 0,
    placeholderColor: '#B1B1B1',
    flex: 1,
    marginLeft: 0
  },
  micView: {
    width: 40,
    height: 40,
    backgroundColor: '#F4CCCC',
    alignItems: 'center',
    borderRadius: 50
  },
  micImage: {
    width: 24,
    height: 24,
    marginTop: 'auto',
    marginBottom: 'auto'
  }
});

export default Conversation;
