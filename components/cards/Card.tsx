import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import colors from '../../constants/colors';

interface CardProps {
  style?: StyleProp<ViewStyle>;
  children?: any | undefined;
  id?: number;
}

const Card = ({
  style = {},
  children = undefined,
  id = 0
}: CardProps) => {
  return (
    <View style={[ styles.container, style ]} id={id}>
      { children && children }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.disabledBg,
    borderRadius: 20,
    marginHorizontal: 24,
    marginVertical: 8,
    paddingHorizontal: 24,
    paddingVertical: 12
  }
});

export default Card;
