import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, Modal, TextInput, Keyboard, ScrollView, RefreshControl } from 'react-native';
import { get, del, post } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import colors from '../../constants/colors';
import ArtistCard from '../ArtistCard';
import { useNavigation } from '@react-navigation/native';
import Button from '../buttons/Button';
import { cTextDark, flexRow, mh8, ml0, ml8, mlAuto, mr8 } from '../../constants/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Card from './Card';


interface CommetListProps {
  id: number;
  setNestedId: (e: number) => void;
  setAnsweringTo: (e: any) => void; // Supposed to be a profile, but cannot find its type
  nestedId: number | undefined;
  answeringTo: any; // Supposed to be a profile, but cannot find its type
}


const CommentsList = ({
  id,
  setNestedId,
  setAnsweringTo,
  nestedId = undefined,
  answeringTo = -1
}: CommetListProps) => {
  const context = useContext(MainContext);
  const [comments, setComments] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
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

    setIsRefreshing(true);
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
        return setIsRefreshing(false);
      },
      (error) => {
        console.error("Error fetching comments:", error);
      }
    );
  };


  useEffect(() => {
    if (!nestedId) {
      fetchComments();
    }
  }, [nestedId]);


  useEffect(() => {

  }, []);


  const deleteComment = () => {
    del(
      `/api/art-publication/comment/${commentToDelete}`,
      context?.token,
      () => {
        fetchComments();
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
      (_) => {
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

  const toggleNestedComments = (commentId: string) => {
    setNestedCommentsVisible((prevVisible) => ({
      ...prevVisible,
      [commentId]: !prevVisible[commentId],
    }));
  };

  const handleLikePress = (commentId: string) => {
    if (!context?.token) {
      return;
    }

    post(
      `/api/art-publication/comment/${commentId}/like`,
      {},
      context?.token,
      () => {
        fetchComments();
        setLikes((prevLikes) => ({
          ...prevLikes,
          [commentId]: !prevLikes[commentId],
        }));
      },
      (error) => {
        console.error("Error liking comment:", { ...error });
      }
    );
  };


  /* A single comment */
  const RenderComment = ({
    comment,
    index,
    isNested = false
  }) => (
    <View key={index} style={styles.commentContainer}>
      <ArtistCard
        item={userProfiles[comment.userId]}
        style={{
          image: { height: 40, width: 40 },
        }}
        showTitle={false}
        onPress={() => console.log(comment)}//handleToArtistProfile(comment.userId)}
      />

      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>
            {usernames[comment.userId]}
          </Text>
          <View style={styles.commentMeta}>
            <Text style={styles.publishedTime}>{
              timeSince(comment?.createdAt)}
            </Text>
            { comment?.userId === context?.userId && (
              <TouchableOpacity
                onPress={() => handleDeletePress(comment?.id)}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            ) }
          </View>
        </View>

        <Text style={cTextDark}>{comment?.text ?? "Commentaire supprimé"}</Text>

        {/* Footer */}
        <View style={styles.commentFooter}>

          {/* Nested comments */}
          { comment.nestedComments && comment.nestedComments.length > 0 && (
            <TouchableOpacity
              onPress={() => toggleNestedComments(comment.id)}
              style={[flexRow]}
            >
              <Ionicons
                name={nestedCommentsVisible[comment.id] ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={colors.darkGreyFg}
              />
            </TouchableOpacity>
          ) }

          {/* Report */}
          <TouchableOpacity
            onPress={() => navigation.navigate('report', { id: comment?.id, type: 'post' })}
            style={[mlAuto, mr8]}
          >
            <AntDesign
              name="warning"
              color={colors.darkGreyFg}
              size={20}
            />
          </TouchableOpacity>

          {/* Reply button */}
          { !isNested && (
            <TouchableOpacity
              onPress={() => {
                if (!nestedId) {
                  setNestedId(comment?.id);
                  setAnsweringTo(userProfiles[comment.userId]);
                } else {
                  setAnsweringTo(undefined);
                  setNestedId(undefined);
                }
              }}
              style={[mh8]}
            >
              <Octicons
                name='reply'
                color={comment.userId === answeringTo.id ?
                  context?.userColor ?? colors.primary :
                  colors.darkGreyFg
                }
                size={20}
              />
            </TouchableOpacity>
          ) }

          {/* Like */}
          <TouchableOpacity
            onPress={() => handleLikePress(comment.id)}
            style={ml8}
          >
            <AntDesign
              name={likes[comment.id] ? 'heart' : 'hearto'}
              size={20}
              color={likes[comment.id] ? context?.userColor ?? colors.primary : colors.darkGreyFg}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );


  return (
    <ScrollView
      refreshControl={<RefreshControl
        colors={[context?.userColor ?? colors.primary]}
        tintColor={context?.userColor ?? colors.primary}
        refreshing={isRefreshing}
        onRefresh={fetchComments}
      />}
    >
      <View style={{
        marginBottom: 40
      }}>
        { comments.map((comment: any, index: number) => (
          <Card
            key={comment.id}
            style={[ styles.resetCard ]}
          >
            <RenderComment comment={comment} index={index} />

            { nestedCommentsVisible[comment.id] && comment.nestedComments.map((nestedComment, nestedIndex) => (
              <RenderComment
                key={nestedComment.id}
                comment={nestedComment}
                index={nestedIndex}
                isNested={true}
              />
            )) }


            { replyingTo === comment.id && (
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
            ) }
          </Card>
        )) }

        {/* Delete modal */}
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
  resetCard: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 2,
    marginHorizontal: 8,
    borderRadius: 20
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
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginRight: 5,
    color: colors.darkGreyFg,
    fontSize: 15,
  },
  commentContent: {
    flex: 1
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
    alignItems: 'center',
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
  },
  replyButtonText: {
    color: colors.darkGreyFg,
  },
  sendButtonText: {
    color: colors.primary,
    marginLeft: 50,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 6
  },
  replyInput: {
    flex: 1,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 5,
    marginRight: 5,
  },
  likeButton: {
    padding: 5,
    marginLeft: 5,
  },
});

export default CommentsList;
