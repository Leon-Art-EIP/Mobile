// InfoModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../constants/colors';  // Adjust the import path as necessary

interface InfoModalProps {
    isVisible: boolean;
    message: string;
    onClose: () => void;
    messageType: 'error' | 'validation' | 'other';
}

const InfoModal: React.FC<InfoModalProps> = ({ isVisible, message, onClose, messageType }) => {
    const backgroundColor = messageType === 'error' ? colors.errorColor : 
                            messageType === 'validation' ? colors.validationColor : colors.otherColor;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modal}>
                <View style={[styles.modalView, {borderColor: backgroundColor}]}>
                    <Text style={styles.modalText}>{message}</Text>
                    <TouchableOpacity
                        style={[styles.buttonClose, {backgroundColor}]}
                        onPress={onClose}
                    >
                        <Text style={styles.textStyle}>Fermer</Text>
                    </TouchableOpacity>
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
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        borderWidth: 2,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    buttonClose: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
});

export default InfoModal;
