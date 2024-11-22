import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';

interface CardProps {
  style?: StyleProp<ViewStyle>;
  children?: any | undefined;
  id?: number;
  pressable?: boolean;
  onPress?: () => void;
}

const Card = ({
  style = {},
  children = undefined,
  id = 0,
  pressable = false,
  onPress = () => {}
}: CardProps) => {
  return (
    <TouchableOpacity
      style={[ styles.container, style ]}
      id={id}
      disabled={!pressable}
      onPress={onPress}
    >
      { children && children }
    </TouchableOpacity>
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
