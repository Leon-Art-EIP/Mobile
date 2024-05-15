import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import Card from "../cards/Card";
import PropTypes from 'prop-types';

const ModalMessage = ({
  onPress = () => {},
  message,
  messageType = 'info', // could be 'error', 'info', 'success'
}) => (
  <TouchableOpacity
    style={styles.overlay}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="Close modal"
    accessibilityHint="Closes the message modal"
  >
    <Card style={[styles.container, styles[messageType]]}>
      <Text style={styles.text}>{message}</Text>
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  container: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    width: 280,
    maxWidth: '80%',
    alignItems: 'center',
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  info: {
    backgroundColor: colors.infoColor,
  },
  error: {
    backgroundColor: colors.errorColor,
  },
  success: {
    backgroundColor: colors.successColor,
  }
});

ModalMessage.propTypes = {
  onPress: PropTypes.func,
  message: PropTypes.string.isRequired,
  messageType: PropTypes.oneOf(['info', 'error', 'success']),
};

export default ModalMessage;
