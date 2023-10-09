import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle, StyleSheet, Dimensions } from 'react-native';
import colors from '../constants/colors';

interface ButtonProps {
  // onPress?: (parameter: any) => void;
  onPress?: (parameter: string) => void;
  style?: StyleProp<ViewStyle>;
  value?: string;
  textStyle?: StyleProp<TextStyle>;
  secondary?: boolean;
  tertiary?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

const TagButton = ({
  onPress = () => {},
  style = {},
  value = "",
  textStyle = {},
  secondary = false,
  tertiary = false,
  disabled = false
}: ButtonProps) => {
  const [isPressed, setIsPressed] = useState(false); // State to track if the button is pressed

  const handlePress = () => {
    setIsPressed(!isPressed); // Toggle the pressed state
    onPress(value); // Call the provided onPress function
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={handlePress} // Call the new handlePress function
      disabled={disabled}
      style={[
        styles.containerStyle,
        isPressed && { backgroundColor: colors.pressedTag },
      ]}
    >
      <Text 
        style={[
          styles.textStyle,
          isPressed && { color: colors.white }, // Set the text color to white when pressed
        ]}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 50,
    alignItems: 'center',
    // elevation: 0,
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingLeft: 18.5,
    paddingRight: 18.5,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 40,
    // gap: 19,
    color: colors.black,
  },
  textStyle: {
    text: '',
    textAlign: 'center',
    fontFamily: 'Manrope',
    fontSize: 16,
    color: '#000',
  },
});

export default TagButton;
export type { ButtonProps };
