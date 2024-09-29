import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import Button from '../buttons/Button';


interface InfoModalProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  messageType: 'error' | 'validation' | 'success' | 'other';
}


const InfoModal: React.FC<InfoModalProps> = ({
  isVisible,
  message,
  onClose,
  messageType
}) => {
  const modalBackgroundStyle = {
    backgroundColor: colors.bg,
    borderColor: messageType === 'error' ? colors.error :
      messageType === 'success' ? colors.success :
      messageType === 'validation' ? colors.validationDark : colors.otherDark,
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        <View style={[styles.modalView, modalBackgroundStyle]}>
          <Text style={styles.modalText}>{ message }</Text>
          <Button
            value='Fermer'
            onPress={onClose}
            style={styles.buttonClose}
          />
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center"
  },
  modalText: {
    color: 'black',
    marginBottom: 15
  },
  buttonClose: {
    marginLeft: 'auto',
    marginRight: 0,
    marginBottom: 0,
    marginTop: 8
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});


export default InfoModal;