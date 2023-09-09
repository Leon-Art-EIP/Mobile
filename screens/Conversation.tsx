import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import colors from '../constants/colors';

type ConversationProps = {
  navigation: any;
}

const Conversation = ({ navigation, route }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleView}>
        <Image
          style={styles.ppicImage}
          source={require('../assets/images/user.png')}
        />
        <Text style={{ color: '#fff' }}>{ route?.params?.name }</Text>
      </View>

      <View style={styles.conversationContainer}>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1
  },
  conversationContainer: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  titleView: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row'
  },
  ppicImage: {
    borderRadius: 50,
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: colors.white
  }
});

export default Conversation;
