/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState, type PropsWithChildren } from 'react';
import {
    Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import Title from './components/Title';
import colors from './constants/colors';

const App = () => {
  const [text, setText] = useState<string>("");

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <Card>
        <Title>Leon'Art</Title>
        <Button style={{ margin: 0 }} />
        <Input
          value={text}
          onTextChanged={setText}
          style={{ marginHorizontal: 0 }}
        />
      </Card>
    </SafeAreaView>
);
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: colors.white
  }
});

export default App;
