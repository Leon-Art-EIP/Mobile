import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';

interface TitleProps {
  children?: string;
  style?: StyleProp<TextStyle>;
  bold?: boolean;
  size?: 42 | 36 | 24 | 18;
};

const Title = ({
  children = "Title",
  style = {},
  bold = true,
  size = 42
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
  },
  bold: {
    fontWeight: 'bold'
  }
});

export default Title;
