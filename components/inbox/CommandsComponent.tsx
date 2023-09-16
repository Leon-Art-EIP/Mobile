import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import colors from '../../constants/colors';

const CommandsComponent = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{ color: colors.black }}>Command screen</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white
  }
});

export default CommandsComponent;
