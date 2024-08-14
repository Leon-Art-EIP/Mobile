import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { post } from '../constants/fetch';
import { StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CommentInput = ({ id }) => {
  const [commentInput, setCommentInput] = useState('');
  const context = useContext(MainContext);

  const handleCommentInput = (text) => {
    setCommentInput(text);
  };

  const postComment = async () => {
    if (!commentInput.trim()) {
      console.warn('Comment cannot be empty');
      return;
    }

    const body = {
      text: commentInput,
    };

    post(
      `/api/art-publication/comment/${id}`,
      body,
      context?.token,
      (response) => {
        if (response && response.data) {
          setCommentInput('');
          console.log(response.data);
        } else {
          console.error('Invalid response:', response);
        }
      },
      (error) => {
        console.error('Error posting comments:', error);
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.commentInputContainer}>
        <TextInput
          placeholder="Commenter..."
          placeholderTextColor={colors.disabledFg}
          style={styles.commentInput}
          onChangeText={handleCommentInput}
          value={commentInput}
        />
        <TouchableOpacity
          style={styles.sendButtonView}
          onPress={postComment}
        >
          <Ionicons
            name="send"
            color={colors.offerFg}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Any styles for the container, if needed
  },
  commentInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    bottom: 2,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  commentInput: {
    color: colors.textDark,
    flex: 1,
    backgroundColor: colors.disabledBg,
    borderRadius: 30,
    padding: 9,
    paddingLeft: 15,
  },
  sendButtonView: {
    backgroundColor: colors.offerBg,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 50,
    marginLeft: 8,
  }
});

export default CommentInput;