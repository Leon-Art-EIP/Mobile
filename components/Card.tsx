import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import colors from '../constants/colors';

interface CardProps {
  style?: StyleProp<ViewStyle>;
  children?: any | undefined;
}

const Card = ({
  style = {},
  children = undefined
}: CardProps) => {
  return (
    <View style={[ styles.container, style ]}>
      { children && children }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.disabledBg,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 13
  }
});

export default Card;
