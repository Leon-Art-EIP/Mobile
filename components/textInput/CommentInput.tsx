// CommentInput.tsx
import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { post } from '../../constants/fetch';
import colors from '../../constants/colors';
import { MainContext } from '../../context/MainContext';
import InfoModal from '../infos/InfoModal';

interface CommentInputProps {
    id: string;
}

const CommentInput: React.FC<CommentInputProps> = ({ id }) => {
    const [commentInput, setCommentInput] = useState<string>('');
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const context = useContext(MainContext);

    const handleCommentInput = (text: string) => {
        setCommentInput(text);
    };

    const postComment = async () => {
        if (!commentInput.trim()) {
            setModalVisible(true);
            return;
        }

        const body = { text: commentInput };
        post(
            `/api/art-publication/comment/${id}`,
            body,
            context?.token,
            (response: any) => {
                if (response && response.data) {
                    setCommentInput('');
                } else {
                    console.error('Invalid response:', response);
                }
            },
            (error: any) => {
                console.error('Error posting comments:', error);
            }
        );
    };

    return (
        <View style={styles.container}>
            <InfoModal
                isVisible={isModalVisible}
                message="Le commentaire ne peut pas être vide"
                onClose={() => setModalVisible(false)}
                messageType="error"
            />
            <View style={styles.commentInputContainer}>
                <TextInput
                    placeholder="Commenter..."
                    style={styles.commentInput}
                    onChangeText={handleCommentInput}
                    value={commentInput}
                />
                <TouchableOpacity style={styles.commentButton} onPress={postComment}>
                    <Text style={styles.commentButtonText}>Envoyer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    commentInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        bottom: 2,
        width: '100%',
    },
    commentInput: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: 'gray',
        backgroundColor: colors.white,
        borderRadius: 30,
        padding: 9,
        paddingLeft: 15,
    },
    commentButton: {
        marginLeft: 10,
        padding: 15,
        borderRadius: 50,
        backgroundColor: colors.forYouPlHolder,
    },
    commentButtonText: {
        color: 'black',
    },
});

export default CommentInput;
