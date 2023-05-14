import React from 'react';
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native'
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

const Button = ({
  onPress = () => {},
  style = {},
  value = "Click here",
  textStyle = {},
  secondary = false,
  tertiary = false,
  disabled = false
}: ButtonProps) => {
  const getContainerStyle = () => {
    let a = (tertiary ? styles.tertiaryContainerStyle :
      secondary ? styles.secondaryContainerStyle :
      styles.primaryContainerStyle
    );
    a.backgroundColor = a.backgroundColor.toString() + (disabled ? '77' : 'ff');
    return a;
  }

  const getTextStyle = () => {
    let a = (tertiary ? styles.tertiaryTextStyle :
      secondary ? styles.secondaryTextStyle :
      styles.primaryTextStyle
    );
    a.color = a.color.toString() + (disabled ? '99' : 'ff');
    return a;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        getContainerStyle(),
        style
      ]}
    >
      <Text style={[getTextStyle(), textStyle]}>
        { value }
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  primaryContainerStyle: {
    backgroundColor: colors.primary,
    margin: 16,
    borderRadius: 50,
    alignItems: 'center',
    elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  secondaryContainerStyle: {
    backgroundColor: colors.secondary,
    margin: 16,
    borderRadius: 50,
    alignItems: 'center',
    elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  tertiaryContainerStyle: {
    backgroundColor: colors.tertiary,
    margin: 16,
    borderRadius: 50,
    alignItems: 'center',
    elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  primaryTextStyle: {
    color: colors.primaryText,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18
  },
  secondaryTextStyle: {
    color: colors.secondaryText,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18
  },
  tertiaryTextStyle: {
    color: colors.tertiaryText,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18
  }
});

export default Button;
export type { ButtonProps };
