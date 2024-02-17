// CommentSection.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { get } from '../constants/fetch';
import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const CommentsList = ({ id }) => {
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

  const fakeComments = [
    { author: 'John Doe', text: 'This is an amazing piece of art!', publishedTime: '1h' },
    { author: 'Jane Smith', text: 'I love the colors used in this artwork.', publishedTime: '2d' },
    { author: 'Anonymous', text: 'Great job!', publishedTime: '3h' },
    { author: 'John Doe', text: 'This is an amazing piece of art!', publishedTime: '1h' },
    { author: 'Jane Smith', text: 'I love the colors used in this artwork.', publishedTime: '2d' },
    { author: 'Anonymous', text: 'Great job!', publishedTime: '3h' },
    { author: 'John Doe', text: 'This is an amazing piece of art!', publishedTime: '1h' },
    { author: 'Jane Smith', text: 'I love the colors used in this artwork.', publishedTime: '2d' },
    { author: 'Anonymous', text: 'Great job!', publishedTime: '3h' },
  ];

  // ❗️ Always put this into a scrollview. ❗️
  // It must be able to scroll through a list of comments.

  return (
    <View style={{ marginTop: 5, marginBottom: 65, marginLeft: 20, marginRight: 20 }}>
        {/* Display Fake Comments with Published Time */}
        {fakeComments.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <View style={styles.commentContent}>
              <Text style={{ fontWeight: 'bold', marginRight: 5 }}>{comment.author}:</Text>
              <Text>{comment.text}</Text>
            </View>
            <Text style={styles.publishedTime}>{comment.publishedTime}</Text>
          </View>
        ))}
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

export default CommentsList;
