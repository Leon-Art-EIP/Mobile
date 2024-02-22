import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { post } from '../constants/fetch';
import { StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';

const CommentInput = ({ id }) => {
  const [commentInput, setCommentInput] = useState('');
  const context = useContext(MainContext);

  const handleCommentInput = (text) => {
    setCommentInput(text);
  };

  const postComment = async () => {
    // Check if empty
    if (!commentInput.trim()) {
      console.warn('Comment cannot be empty');
      return;
    }

    const body = {
      text: commentInput, // Use the commentInput state here
    };

    post(
      `/api/art-publication/comment/${id}`,
      body,
      context?.token,
      (response) => {
        if (response && response.data) {
          setCommentInput(''); // Clear the input after successful post
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
          style={styles.commentInput}
          onChangeText={(text) => handleCommentInput(text)}
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
  commentsContainer: {
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  commentContent: {
    flex: 1,
  },
  publishedTime: {
    marginLeft: 'auto',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
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
