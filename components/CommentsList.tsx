// CommentSection.js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { get } from '../constants/fetch';
import { StyleSheet } from 'react-native';
import { useContext } from 'react';
import { MainContext } from '../context/MainContext';
import colors from '../constants/colors';

const CommentsList = ({ id }) => {
  const context = useContext(MainContext);
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState([]);
  useEffect(() => {
    fetchComments();
  }, [id]);

  const getUsername = (userId) => {
    if (!context?.token) {
      return
    }
    get(
      `/api/user/profile/${userId}`,
      context?.token,
      (response) => {
        if (response && response.data) {
          setUsername(response.data.username);
          console.log("username", response.data.username);
        } else {
          console.error('Invalid response:', response);
        }
      },
      (error) => {
        console.error("Error fetching comments:", error);
      }
    );
  };

  const fetchComments = () => {
    if (!context?.token) {
      return
    }
    get(
      `/api/art-publication/comment/${id}`,
      context?.token,
      (response) => {
        if (response && response.data) {
          setComments(response.data);
          getUsername(response?.data.userId);
          console.log(response.data);
        } else {
          console.error('Invalid response:', response);
        }
      },
      (error) => {
        console.error("Error fetching comments:", error);
      }
    );
  };
  
  const timeSince = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const timeDifference = now - commentDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds}sec`;
    } else if (minutes < 60) {
      return `${minutes}min`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  // ❗️ Always put this into a scrollview. ❗️
  // It must be able to scroll through a list of comments.

    return (
      <View style={{ marginTop: 5, marginBottom: 65, marginLeft: 20, marginRight: 20 }}>
        {comments.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <View style={styles.commentContent}>
              <Text style={{ fontWeight: 'bold', marginRight: 5 }}>{(username)}</Text>
              <Text>{comment.text}</Text>
            </View>
            <Text style={styles.publishedTime}>{timeSince(comment.createdAt)}</Text>
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
