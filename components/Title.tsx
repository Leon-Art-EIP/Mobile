import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import colors from '../constants/colors';

interface TitleProps {
  children?: string;
  style?: StyleProp<TextStyle>;
  bold?: boolean;
  size?: number;
}

const Title = ({
  children = "Title",
  style = {},
  bold = true,
  size = 35
}: TitleProps) => {
  const getFontSize = () => {
    return {
      fontSize: size
    }
  }

  return (
    <Text style={[
      styles.text,
      bold && styles.bold,
      size !== 42 && getFontSize(),
      style
    ]}>
      { children }
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Manrope-Bold',
    fontSize: 42,
    color: colors.title
  },
  bold: {
    fontWeight: 'bold'
  }
});

export default Title;
export type { TitleProps };
