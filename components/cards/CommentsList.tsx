// CommentSection.js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { get } from '../../constants/fetch';
import { StyleSheet } from 'react-native';
import { useContext } from 'react';
import { MainContext } from '../../context/MainContext';
import colors from '../../constants/colors';

const CommentsList = ({ id }) => {
  const context = useContext(MainContext);
  const [comments, setComments] = useState([]);
  const [usernames, setUsernames] = useState([]);
  useEffect(() => {
    fetchComments();
  }, [id]);


  const getUsername = (userId) => {
    if (!context?.token) {
      return;
    }
    get(
      `/api/user/profile/${userId}`,
      context?.token,
      (response) => {
        if (response && response.data) {
          setUsernames((prevUsernames) => ({
            ...prevUsernames,
            [userId]: response.data.username,
          }));
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
      return;
    }
    get(
      `/api/art-publication/comment/${id}`,
      context?.token,
      (response) => {
        if (response && response.data) {
          setComments(response.data);
          response.data.forEach((comment) => {
            getUsername(comment.userId);
          });
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

  return (
    <View style={{ marginTop: 5, marginBottom: 65, marginLeft: 20, marginRight: 20 }}>
      {comments.map((comment, index) => (
        <View key={index} style={styles.commentContainer}>
          <View style={styles.commentContent}>
            <Text style={{ fontWeight: 'bold', marginRight: 5, color: colors.darkGreyFg, fontSize: 15, }}>
              {usernames[comment.userId]}
            </Text>
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
    marginBottom: 7,
  },
  publishedTime: {
    marginLeft: 'auto',
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
});

export default CommentsList;
