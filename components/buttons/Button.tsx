import React, {useContext} from 'react';
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle, StyleSheet, } from 'react-native';
import colors from '../../constants/colors';
import { mAuto } from '../../constants/styles';
import {MainContext} from "../../context/MainContext";

interface ButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  value?: string;
  textStyle?: StyleProp<TextStyle>;
  secondary?: boolean;
  tertiary?: boolean;
  disabled?: boolean;
  color?: string;
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
  const context = useContext(MainContext);


  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.primaryContainerStyle,
        { backgroundColor: context?.userColor ?? colors.primary },
        disabled && styles.primaryContainerDisabledStyle,
        secondary && styles.secondaryContainerStyle,
        tertiary && styles.tertiaryContainerStyle,
        style
      ]}
    >
      <Text style={[
        styles.primaryTextStyle,
        secondary && styles.secondaryTextStyle,
        tertiary && styles.tertiaryTextStyle,
        textStyle
      ]}>
        {value}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryContainerDisabledStyle: {
    opacity: 0.5
  },
  primaryContainerStyle: {
    margin: 16,
    borderRadius: 50,
    alignItems: 'center',
    elevation: 0,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  secondaryContainerStyle: {
    backgroundColor: colors.secondary,
  },
  tertiaryContainerStyle: {
    backgroundColor: colors.tertiary,
  },
  primaryTextStyle: {
    color: colors.primaryText,
    ...mAuto,
    textAlign: 'center',
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    fontSize: 16,
  },
  secondaryTextStyle: {
    color: colors.secondaryText,
  },
  tertiaryTextStyle: {
    color: colors.tertiaryText,
  }
});

export default Button;
export type { ButtonProps };
