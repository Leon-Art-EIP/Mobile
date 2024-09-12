//* Standard imports
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Text, Image, StyleSheet, ScrollView, TouchableOpacity, View, FlatList, RefreshControl, ToastAndroid } from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel'; // Import du panneau SlidingUpPanel

//* Local imports
import colors from '../../constants/colors';
import { get, del } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import SockHelper from '../../helpers/SocketHelper';
import Title from '../text/Title';
import Ionicons from "react-native-vector-icons/Ionicons";
import InfoModal from '../components/infos/InfoModal';
import Button from '../buttons/Button'; // Import du bouton utilisé dans le panneau

const CONV_NOT_FOUND = "Error: couldn't find conversation to navigate to";


type ConversationType = {
  id: string;
  lastMessage: string;
  unreadMessages: boolean;
  UserOneId: string;
  UserOneName: string;
  UserOnePicture: string;
  UserTwoId: string;
  UserTwoName: string;
  UserTwoPicture: string;
};


const ConversationsComponent = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const [isDeletePanelVisible, setIsDeletePanelVisible] = useState<boolean>(false); // Nouvel état pour le panneau
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null); // Conversation sélectionnée
  const _slidingPanel = useRef<SlidingUpPanel>(null); // Référence au panneau

  // Fonction pour récupérer les conversations
  const getConversations = () => {
    setIsRefreshing(true);
    get(
      `/api/conversations/${context?.userId}`,
      context?.token,
      (res: any) => {
        setConversations([ ...(res.data['chats'] as ConversationType[]) ]);
        return setIsRefreshing(false);
      },
      (err: any) => console.error("Couldn't get conversations: ", err)
    );
  }

  const deleteConversation = (convId: string) => {
    const url = `/api/conversations/delete/${convId}`;
    del(
      url,
      context?.token,
      () => {
        getConversations();
        ToastAndroid.show("Conversation supprimée", ToastAndroid.SHORT);
      },
      (error) => {
        console.error("Erreur lors de la suppression: ", error);
      }
    );
  };

  // Fonction pour afficher le panneau de suppression
  const handleDeleteConversation = (convId: string) => {
    setSelectedConversationId(convId);
    setIsDeletePanelVisible(true);
    _slidingPanel.current?.show();
  };

  const confirmDeleteConversation = () => {
    if (selectedConversationId) {
      deleteConversation(selectedConversationId);
    }
    setIsDeletePanelVisible(false);
    _slidingPanel.current?.hide();
  };

  const toggleRead = (id: string) => {
    const mapCallback = (conv: ConversationType) => {
      if (conv._id === id) {
        conv.unreadMessages = !(conv.unreadMessages);
      }
      return conv;
    }
    const new_conversations: ConversationType[] = conversations.map(mapCallback);
    return setConversations([ ...new_conversations ]);
  }

  const goToConversation = (convId: string) => {
    const conv = conversations.find((c: ConversationType) => c._id === convId);
    if (!conv) {
      ToastAndroid.show(CONV_NOT_FOUND, ToastAndroid.LONG);
      return console.error(CONV_NOT_FOUND);
    }

    const navObject = {
      name: conv?.UserOneId === context?.userId ?
        conv.UserTwoName : conv.UserOneName,
      ids: [
        conv._id,           // conversation ID
        conv.UserOneId,     // user ID
        conv.UserTwoId      // correspondant ID
      ]
    };

    toggleRead(convId);
    navigation?.navigate('single_conversation', navObject);
  }

  useEffect(() => {
    if (isFocused) {
      return getConversations();
    }
  }, [isFocused]);

  useEffect(() => {
    getConversations();
    if (!SockHelper.isStarted()) {
      SockHelper.start(process.env.REACT_APP_API_URL, true);
    }
    SockHelper.off('msg-recieve');
    SockHelper.on('msg-recieve', getConversations);
  }, []);

  useEffect(() => {
    if (isDeletePanelVisible) {
      _slidingPanel.current?.show();
    } else {
      _slidingPanel.current?.hide();
    }
  }, [isDeletePanelVisible]);

  return (
    <>
      {conversations && conversations.length !== 0 ? (
        <FlatList
          data={conversations}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item?.id?.toString() ?? (Math.random()).toString()}
              style={styles.conversationView}
              onPress={() => goToConversation(item._id)}
            >
              <View style={{ flexDirection: 'row', height: 60 }}>

                {/* Unread dot */}
                <View style={[
                  styles.unreadDot,
                  { backgroundColor: item.unreadMessages ? colors.primary : colors.white }
                ]} />

                <Image
                  source={require('../../assets/images/user.png')}
                  style={styles.conversationPicture}
                />
                <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <Title size={16}>{
                    context?.userId === item.UserTwoId ? item.UserOneName : item.UserTwoName
                  }</Title>
                  <Text numberOfLines={1} style={{
                    fontWeight: item.unreadMessages ? 'bold' : 'normal',
                    flexShrink: 1,
                    color: colors.textDark
                  }}>{ item.lastMessage }</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteConversation(item._id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      color={colors.black}
                      size={32}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.lineView} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item?._id?.toString() ?? (Math.random()).toString()}
          refreshing={isRefreshing}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={getConversations}
              colors={[colors.primary]}
            />
          }
        />
      ) : (
        <View style={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}>
          <Image
            source={require('../../assets/icons/box.png')}
            style={styles.emptyImg}
          />
          <Text style={{ marginBottom: 'auto' }}>C'est tout vide par ici !</Text>
        </View>
      )}

      <SlidingUpPanel
        ref={_slidingPanel}
        draggableRange={{ top: 200, bottom: 0 }}
        snappingPoints={[0, 200]}
        height={200}
        friction={0.5}
      >
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Supprimer la conversation ?</Text>
          <View style={styles.panelButtonContainer}>
            <Button 
              value="Non" 
              onPress={() => setIsDeletePanelVisible(false)} 
              style={styles.panelButton} 
              secondary
            />
            <Button 
              value="Oui" 
              onPress={confirmDeleteConversation} 
              style={styles.panelButton}
            />
          </View>
        </View>
      </SlidingUpPanel>
    </>
  );
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
  },
  emptyImg: {
    height: 100,
    width: 100,
    marginTop: 'auto',
    marginBottom: 12
  },
  deleteButton: {
    position: 'absolute',
    left: 250,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  panel: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.textDark,
    textAlign: 'center'
  },
  panelButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  panelButton: {
    width: 100,
  }
});

export default ConversationsComponent;
