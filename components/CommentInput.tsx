// CommentSection.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { get } from '../constants/fetch';
import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const CommentInput = ({ id }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    
    try {
      const response = await get(`/api/art-publication/comments/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // ❗️ Always put this just after a scrollview on LeonArt App. ❗️
  // It must be displayed as a fixed component at the bottom of the screen.

  return (
    <View style={styles.container}>
      {/* Comment Input */}
      <View style={styles.commentInputContainer}>
        <TextInput
          placeholder="Commenter..."
          style={styles.commentInput}
          onChangeText={(text) => handleCommentInput(text)}
        />
        <TouchableOpacity style={styles.commentButton}>
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
