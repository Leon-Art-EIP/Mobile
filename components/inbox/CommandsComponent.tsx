import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../constants/colors';
import { flexRow, fwBold, ml8, mt4, mt8 } from '../../constants/styles';

const CommandsComponent = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={flexRow}>
        <Image
          style={{ width: 50, height: 50 }}
          source={require('../../assets/images/user.png')}
          testID="command-img"
        />
        <View style={[ml8, mt4]}>
          <Text style={fwBold}>Mer de nuages</Text>
          <Text>40€</Text>
        </View>
      </View>
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
