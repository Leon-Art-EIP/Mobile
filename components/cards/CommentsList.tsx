import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, Modal, TextInput, Keyboard, ScrollView } from 'react-native';
import { get, del, post, put } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import colors from '../../constants/colors';
import ArtistCard from '../ArtistCard';
import { useNavigation } from '@react-navigation/native';
import Button from '../buttons/Button';
import { cTextDark } from '../../constants/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';


const CommentsList = ({ id }) => {
  const context = useContext(MainContext);
  const [comments, setComments] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string>();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [nestedCommentsVisible, setNestedCommentsVisible] = useState({});
  const [likes, setLikes] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    fetchComments();
  }, [id]);

  const getUsername = (userId: string) => {
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
          return console.error('Invalid response:', response);
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
            comment.nestedComments.forEach((nestedComment) => {
              getUsername(nestedComment.userId);
            });
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
        setComments((prevComments) => prevComments.filter(comment => comment.id !== commentToDelete));
        ToastAndroid.show("Commentaire supprimé", ToastAndroid.SHORT);
        setIsDeleteModalShown(false);
      },
      (error) => {
        console.error("Erreur lors de la suppression: ", error);
        setIsDeleteModalShown(false);
      }
    );
  };

  const handleDeletePress = (commentId: string) => {
    setCommentToDelete(commentId);
    setIsDeleteModalShown(true);
  };

  const timeSince = (date: Date | string | number) => {
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


  const handleToArtistProfile = (_id) => {
    navigation.navigate('other_profile', { id: _id });
  };

  const handleReplyPress = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleReplySubmit = () => {
    if (!context?.token || !replyText.trim()) {
      return;
    }
    const url = `/api/art-publication/comment/${id}`;
    const body = { text: replyText, parentCommentId: replyingTo };

    post(
      url,
      body,
      context?.token,
      (response) => {
        fetchComments();
        setReplyText("");
        setReplyingTo(null);
        Keyboard.dismiss();
      },
      (error) => {
        console.error('Error posting reply:', error);
      }
    );
  };

  const toggleNestedComments = (commentId) => {
    setNestedCommentsVisible((prevVisible) => ({
      ...prevVisible,
      [commentId]: !prevVisible[commentId],
    }));
  };

  const handleLikePress = (commentId) => {
    if (!context?.token) {
      return;
    }
    const url = `/api/art-publication/comment/${commentId}/like`;
    put(
      url,
      {},
      context?.token,
      () => {
        setLikes((prevLikes) => ({
          ...prevLikes,
          [commentId]: !prevLikes[commentId],
        }));
      },
      (error) => {
        console.error("Error liking comment:", error);
      }
    );
  };
>>>>>>> dev_testing

  return (
    <ScrollView>
      <View style={{ marginTop: 30, marginBottom: 40, marginLeft: 0, marginRight: 20 }}>
        {comments.map((comment, index) => (
          <>
          <View key={index} style={styles.commentContainer}>
            <ArtistCard
              item={userProfiles[comment.userId]}
              style={styles.artistCard}
              showTitle={false}
              onPress={() => handleToArtistProfile(comment.userId)}
            />
            <View style={styles.commentContent}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>
                  {usernames[comment.userId]}
                </Text>
                <View style={styles.commentMeta}>
                  <TouchableOpacity
                    onPress={() => handleDeletePress(comment.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={cTextDark}>{comment?.text ?? "Commentaire supprimé"}</Text>
              <View style={styles.commentFooter}>
                <Text style={styles.publishedTime}>{timeSince(comment.createdAt)}</Text>
                <TouchableOpacity
                  onPress={() => handleLikePress(comment.id)}
                  style={styles.likeButton}
                >
                  <AntDesign
                    name={likes[comment.id] ? 'heart' : 'hearto'}
                    size={20}
                    color={likes[comment.id] ? 'red' : colors.darkGreyFg}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => handleReplyPress(comment.id)}
                style={styles.replyButton}
              >
                <Text style={styles.replyButtonText}>Répondre</Text>
              </TouchableOpacity>
              {comment.nestedComments && comment.nestedComments.length > 0 && (
                <TouchableOpacity
                  onPress={() => toggleNestedComments(comment.id)}
                  style={styles.toggleNestedCommentsButton}
                >
                  <Ionicons
                    name={nestedCommentsVisible[comment.id] ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.darkGreyFg}
                  />
                </TouchableOpacity>
              )}
              {nestedCommentsVisible[comment.id] && comment.nestedComments.map((nestedComment, nestedIndex) => (
                <View key={nestedIndex} style={styles.nestedCommentContainer}>
                  <ArtistCard
                    item={userProfiles[nestedComment.userId]}
                    style={styles.artistCard}
                    showTitle={false}
                    onPress={() => handleToArtistProfile(nestedComment.userId)}
                  />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>
                        {usernames[nestedComment.userId]}
                      </Text>
                      <View style={styles.commentMeta}>
                        <TouchableOpacity
                          onPress={() => handleDeletePress(nestedComment.id)}
                          style={styles.deleteButton}
                        >
                          <Text style={styles.deleteButtonText}>Supprimer</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={cTextDark}>{nestedComment?.text ?? "Commentaire supprimé"}</Text>
                    <View style={styles.commentFooter}>
                      <Text style={styles.publishedTime}>{timeSince(nestedComment.createdAt)}</Text>
                      <TouchableOpacity
                        onPress={() => handleLikePress(nestedComment.id)}
                        style={styles.likeButton}
                      >
                        <AntDesign
                          name={likes[nestedComment.id] ? 'heart' : 'hearto'}
                          size={20}
                          color={likes[nestedComment.id] ? 'red' : colors.darkGreyFg}
                        />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleReplyPress(nestedComment.id)}
                      style={styles.replyButton}
                    >
                      <Text style={styles.replyButtonText}>Répondre</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {replyingTo === comment.id && (
                <View style={styles.replyInputContainer}>
                  <TextInput
                    style={styles.replyInput}
                    value={replyText}
                    onChangeText={setReplyText}
                    placeholder="Votre réponse..."
                  />
                  <TouchableOpacity
                    onPress={handleReplySubmit}
                    style={styles.replyButton}
                  >
                    <Text style={styles.sendButtonText}>Poster</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={styles.commentMeta}>
            <Text style={styles.publishedTime}>{timeSince(comment?.createdAt)}</Text>

            { comment?.userId === context?.userId && (
              <TouchableOpacity
                onPress={() => handleDeletePress(comment?._id)}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            ) }
          </View>

          </>
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
    </ScrollView>
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
    marginBottom: 5,
  },
  nestedCommentContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 15,
    borderRadius: 5,
    padding: 5,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginRight: 5,
    color: colors.darkGreyFg,
    fontSize: 15,
  },
  commentContent: {
    flex: 1,
    marginLeft: 5,
    marginBottom: 30,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  publishedTime: {
    color: '#888',
    marginRight: 10,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  artistCard: {
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
  replyButton: {
    marginTop: 5,
  },
  replyButtonText: {
    color: colors.darkGreyFg,
  },
  sendButtonText: {
    color: colors.primary,
    marginLeft: 50,
  },
  toggleNestedCommentsButton: {
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  replyInput: {
    flex: 1,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginRight: 5,
  },
  likeButton: {
    padding: 5,
    marginLeft: 5,
  },
});

export default CommentsList;
