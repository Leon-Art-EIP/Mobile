import React from 'react';
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle, StyleSheet, Dimensions } from 'react-native';
import colors from '../constants/colors';

interface ButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  value?: string;
  textStyle?: StyleProp<TextStyle>;
  secondary?: boolean;
  tertiary?: boolean;
  disabled?: boolean;
}

const TagButton = ({
  onPress = () => {},
  style = {},
  value = "Click here",
  textStyle = {},
  secondary = false,
  tertiary = false,
  disabled = false
}: ButtonProps) => {
  // Calculate the width and height based on the text size
  const { width, height } = Dimensions.get('window');
  const buttonWidth = width * 0.2; // Adjust the multiplier as needed
  const buttonHeight = height * 0.04; // Adjust the multiplier as needed

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.primaryContainerStyle,
        secondary && styles.secondaryContainerStyle,
        tertiary && styles.tertiaryContainerStyle,
        style,
        { width: buttonWidth, height: buttonHeight }
      ]}
    >
      <Text style={[
        styles.primaryTextStyle,
        secondary && styles.secondaryTextStyle,
        tertiary && styles.tertiaryTextStyle,
        textStyle
      ]}>
        { value }
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryContainerStyle: {
    borderRadius: 50,
    alignItems: 'center',
    elevation: 1,
    justifyContent: 'center',
  },
  secondaryContainerStyle: {
    backgroundColor: colors.secondary,
  },
  tertiaryContainerStyle: {
    backgroundColor: colors.tertiary,
  },
  primaryTextStyle: {
    color: colors.primaryText,
    fontFamily: 'Manrope',
    fontSize: 16
  },
  secondaryTextStyle: {
    color: colors.secondaryText,
  },
  tertiaryTextStyle: {
    color: colors.tertiaryText,
  }
});

export default TagButton;
export type { ButtonProps };
