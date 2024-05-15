import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import colors from '../../constants/colors';

interface ContentProps {
  children?: string;
  style?: StyleProp<TextStyle>;
  bold?: boolean;
  size?: number;
}

const Content = ({
  children = "Content",
  style = {},
  bold = false,
  size = 17
}: ContentProps) => {
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
    fontFamily: 'Manrope',
    fontSize: 42,
    color: colors.black
  },
  bold: {
    fontWeight: 'bold'
  }
});

export default Content;
export type { ContentProps };
