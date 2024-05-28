import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, Modal } from 'react-native';
import { get, del } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import colors from '../../constants/colors';
import ArtistCard from '../ArtistCard';
import { useNavigation } from '@react-navigation/native';
import Button from '../buttons/Button';
import { ArtistType } from '../../constants/homeValues';

const CommentsList = ({ id }) => {
  const context = useContext(MainContext);
  const [comments, setComments] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigation = useNavigation();

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
          setUserProfiles((prevProfiles) => ({
            ...prevProfiles,
            [userId]: response.data,
          }));
        } else {
          console.error('Invalid response:', response);
        }
      },
      (error) => {
        console.error("Error fetching user profile:", error);
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

  const deleteComment = () => {
    del(
      `/api/art-publication/comment/${commentToDelete}`,
      context?.token,
      () => {
        setComments((prevComments) => prevComments.filter(comment => comment._id !== commentToDelete));
        ToastAndroid.show("Commentaire supprimé", ToastAndroid.SHORT);
        setIsDeleteModalShown(false);
      },
      (error) => {
        console.error("Erreur lors de la suppression: ", error);
        setIsDeleteModalShown(false);
      }
    );
  };

  const handleDeletePress = (commentId) => {
    setCommentToDelete(commentId);
    setIsDeleteModalShown(true);
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

  const handleToArtistProfile = (artist: ArtistType) => {
    console.log('artist id: ', artist._id);
    navigation.navigate('other_profile', { id: artist._id });
  };

  const navigateToUserProfile = (userId) => {
    navigation.navigate('other_profile', { id: userId });
  };

  return (
    <View style={{ marginTop: 30, marginBottom: 40, marginLeft: 0, marginRight: 20 }}>
      {comments.map((comment, index) => (
        <View key={index} style={styles.commentContainer}>
          {/* <TouchableOpacity onPress={() => navigateToUserProfile(comment.userId)}> */}
            <ArtistCard
              item={userProfiles[comment.userId]}
              style={styles.artistCard}
              showTitle={false}
              onPress={() => handleToArtistProfile(comment.userId)}
            />
          {/* </TouchableOpacity> */}
          <View style={styles.commentContent}>
            <Text style={styles.commentAuthor}>
              {usernames[comment.userId]}
            </Text>
            <Text>{comment.text}</Text>
          </View>
          <View style={styles.commentMeta}>
            <Text style={styles.publishedTime}>{timeSince(comment.createdAt)}</Text>
            <TouchableOpacity
              onPress={() => handleDeletePress(comment._id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
          </View>

        </View>
        ))}
      <Modal
        visible={isDeleteModalShown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDeleteModalShown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ color: colors.darkGreyBg, marginBottom: 20 }}>Are you sure you want to delete this comment?</Text>
            <Button style={{ backgroundColor: colors.primary, marginBottom: 10, width: '60%' }} value="Supprimer" onPress={deleteComment} />
            <Button style={{ backgroundColor: colors.darkGreyBg, width: '60%' }} value="Annuler" onPress={() => setIsDeleteModalShown(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentsContainer: {
    marginTop: 0,
    marginBottom: 30,
    marginLeft: 0,
    marginRight: 0,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 5, // Adjusted to reduce space between comments
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginRight: 0,
    color: colors.darkGreyFg,
    fontSize: 15,
  },
  commentContent: {
    flex: 1,
    marginLeft: 5, // Reduced margin between ArtistCard and text
  },
  commentMeta: {
    alignItems: 'flex-end', // Align meta information to the right
  },
  publishedTime: {
    color: '#888',
  },
  artistCard: {
    container: {
      width: 40, // Reduced size
      height: 40, // Reduced size
      borderRadius: 20, // Adjusted for perfect circle
      justifyContent: 'center', // Center the image
      alignItems: 'center', // Center the image
    },
    image: {
      width: 40, // Match container size
      height: 40, // Match container size
      borderRadius: 20, // Adjusted for perfect circle
    },
    deleteButton: {
      padding: 10,
      backgroundColor: 'red',
      borderRadius: 5,
      marginTop: 5, // Add some space between the time and delete button
    },
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CommentsList;
