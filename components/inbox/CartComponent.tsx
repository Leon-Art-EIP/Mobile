import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native'
import colors from '../../constants/colors';

const CartComponent = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Cart</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white
  }
});

export default CartComponent;
