// Standard imports
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text } from 'react-native';
import CommandsComponent from '../components/inbox/CommandsComponent';
import { View } from 'react-native';

// Local imports
import ConversationsComponent from '../components/inbox/ConversationsComponent';
import MessageTabs from '../components/inbox/MessageTabs';
import Title from '../components/text/Title';
import colors from '../constants/colors';
import { flexRow, aiCenter, cTextDark } from '../constants/styles';


type TabType = 'conversations' | 'commands' | undefined;


const InboxScreen = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>('conversations');


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.white}
        barStyle='dark-content'
      />

      <Title style={styles.mainTitle}>
        Messagerie
      </Title>

      <MessageTabs
        active={selectedTab}
        setActive={setSelectedTab}
      />

      { selectedTab === 'conversations' ? (
        <ConversationsComponent />
      ) : selectedTab === 'commands' ? (
        <CommandsComponent />
      ) : (
        <View style={[flexRow, aiCenter]}>
          {/* Empty category case */}
          <Text style={cTextDark}>
            Bienvenue dans votre messagerie !
          </Text>
        </View>
      ) }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingBottom: 80,
    flex: 1
  },
  mainTitle: {
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 16
  },
  logo: {
    alignItems: 'center',
    borderColor: 'red',
    flexDirection: 'row',
  },
});

export default InboxScreen;
