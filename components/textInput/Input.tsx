import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TextInput, StyleProp, ViewStyle, Keyboard } from 'react-native';
import colors from '../../constants/colors';
import { MainContext } from '../../context/MainContext';

interface InputProps {
  placeholder?: string;
  placeholderTextColor?: string;
  value?: string;
  onTextChanged?: (e: string) => void;
  secureTextEntry?: boolean;
  ref?: any;
  style?: StyleProp<ViewStyle>;
  onError?: () => void;
  error?: boolean;
  disabled?: boolean;
  multilines?: number;
};

const Input = ({
  placeholder = "Enter your text here ...",
  placeholderTextColor = colors.text,
  value = "",
  onTextChanged = (_: string) => {},
  secureTextEntry = false,
  ref = null,
  style = {},
  onError = () => {},
  error = false,
  disabled = false,
  multilines = 1
}: InputProps) => {
  const [textValue, setTextValue] = useState<string>(value);
  const context = useContext(MainContext);

  const changeText = (new_value: string) => {
    setTextValue(new_value);
    return onTextChanged(new_value);
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => context?.setIsKeyboard(true));
    Keyboard.addListener('keyboardDidHide', () => context?.setIsKeyboard(false));

    if (error) {
      return onError();
    }
  }, [error]);

  return (
    <TextInput
      ref={ref}
      editable={!disabled}
      placeholder={placeholder}
      value={textValue}
      onChangeText={changeText}
      placeholderTextColor={disabled ? colors.disabledFg : placeholderTextColor}
      multiline={multilines > 1}
      secureTextEntry={secureTextEntry}
      numberOfLines={multilines}
      style={[
        styles.container,
        error && styles.error,
        disabled && styles.disabled,
        style
      ]}
      onFocus={() => context?.setIsKeyboard(true)}
      onBlur={() => context?.setIsKeyboard(false)}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 16,
    color: colors.black
  },
  error: {
    borderWidth: 2,
    borderColor: colors.error,
    backgroundColor: colors.bg,
  },
  disabled: {
    backgroundColor: colors.disabledBg
  }
});

export default Input;
export type { InputProps };
