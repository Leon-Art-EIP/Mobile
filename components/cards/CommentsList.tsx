import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, Modal, TextInput, Keyboard, ScrollView, RefreshControl } from 'react-native';
import { get, del, post } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import colors from '../../constants/colors';
import ArtistCard from '../ArtistCard';
import { useNavigation } from '@react-navigation/native';
import Button from '../buttons/Button';
import { cTextDark, flex1, flexRow, mb24, mh8, ml0, ml8, mlAuto, mr20, mr8 } from '../../constants/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Card from './Card';


interface UserProfileType {
  id: string;
  username: string;
  is_artist: boolean;
  biography: string;
  availability: string;
  subscription: string;
  profilePicture: string;
  bannerPicture: string;
  emailNotificationEnabled: boolean;
  socialMediaLinks: {
    instagram: string;
    twitter: string;
    facebook: string;
    tiktok: string;
  }
}


interface NestedComment {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
  likes: string[];
  isLiked: boolean;
  parentCommentId: string;
}


interface CommentType {
  id: string;
  userId: string;
  artPublicationId: string;
  text: string;
  createdAt: Date;
  likes: string[];
  isLiked: boolean;
  parentCommentId: string;
  nestedComments: NestedComment[];
}


interface RenderComponentProps {
  comment: CommentType | NestedComment;
  index: number;
  isNested?: boolean;
}


interface AnsweringToType {
  commentId: string;
  userId: string;
  username: string;
}


interface CommetListProps {
  id: string;
  setNestedId: (e: string | undefined) => void;
  setAnsweringTo: (e: AnsweringToType | undefined) => void;
  nestedId: string | undefined;
  answeringTo: AnsweringToType | undefined;
  trigger: number;
}


interface NestedCommentVisibleType {
  parentId: string;
  id: string;
  userId: string;
  visible: boolean;
}


const CommentsList = ({
  id,
  setNestedId,
  setAnsweringTo,
  nestedId = undefined,
  answeringTo = undefined,
  trigger = 0
}: CommetListProps) => {
  const context = useContext(MainContext);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [userProfiles, setUserProfiles] = useState<UserProfileType[]>([]);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string>();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [nestedCommentsVisible, setNestedCommentsVisible] = useState<NestedCommentVisibleType[]>([]);
  const navigation = useNavigation();


  useEffect(() => {
    fetchComments();
  }, [id]);


  // Gets user profiles for comments
  const getUser = (userId: string) => {
    if (!context?.token || !userId) {
      return;
    }

    get(
      `/api/user/profile/${userId}`,
      context?.token,
      (response) => {
        if (!response || !response.data) {
          return console.error('Invalid response:', response);
        }

        const currId: number = userProfiles.findIndex(
          (user: UserProfileType) => user.username === response.data.username
        );

        if (currId === -1) {
          let newUsernames: UserProfileType[] = [...userProfiles, response.data ];
          return setUserProfiles([ ...newUsernames ]);
        } else {
          let tmpNewUserProfiles: UserProfileType[] = [ ...userProfiles ];
          tmpNewUserProfiles[currId] = response.data;
          setUserProfiles([ ...tmpNewUserProfiles ]);
        }
      },
      (error) => {
        console.error("Error fetching user profile:", error);
      }
    );
  };


  /* Returns a correctly formatted NestedCommentVisibleType
  *  From a NestedComment object
  */
  const nestedToNestedCommentType = (
    comm: NestedComment
  ): NestedCommentVisibleType => {
    return {
      userId: comm.userId,
      parentId: comm.parentCommentId,
      id: comm.id,
      visible: false
    };
  }


  // Fetches comments from the back-end
  const fetchComments = () => {
    if (!context?.token) {
      return;
    }

    setIsRefreshing(true);
    get(
      `/api/art-publication/comment/${id}`,
      context?.token,
      (response: any) => {
        if (!response || !response.data) {
          setIsRefreshing(false);
          ToastAndroid.show("Une erreur est survenue", ToastAndroid.SHORT);
          return console.error('Invalid response:', response);
        }

        setComments(response.data);
        let nested: NestedCommentVisibleType[] = [];

        response.data.forEach((comment: CommentType) => {
          getUser(comment.userId);
          comment.nestedComments.forEach((nestedComment: NestedComment) => {
            nested.push(nestedToNestedCommentType(nestedComment));
            getUser(nestedComment.userId);
          });
        });

        setNestedCommentsVisible([ ...nested ]);
        return setIsRefreshing(false);
      },
      (error: any) => {
        console.error("Error fetching comments:", error);
      }
    );
  };


  useEffect(() => {
    fetchComments();
  }, [trigger]);


  useEffect(() => {
    if (!nestedId) {
      fetchComments();
    }
  }, [nestedId]);


  // Deletes a comment with the back-end
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


  // Calculates the time spent since a comment was posted
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


  // Sets the AnsweringTo object
  const handleReplySubmit = () => {
    if (!context?.token || !replyText.trim()) {
      return console.warn('empty reply');
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


  // Opens the nested comments view on click
  const toggleNestedComments = (parentId: string) => {
    const currId: number = nestedCommentsVisible.findIndex(
      (comm: NestedCommentVisibleType) => comm.parentId === parentId
    );

    if (currId === -1) {
      ToastAndroid.show("Une erreur est survenue", ToastAndroid.SHORT);
      return console.warn(
        "Nested comment error: could not find nested comments for comment ID ",
        parentId
      );
    }

    const newNested: NestedCommentVisibleType = {
      parentId: parentId,
      id: nestedCommentsVisible[currId].id,
      userId: nestedCommentsVisible[currId].userId,
      visible: !nestedCommentsVisible[currId].visible
    };

    let tmpNewNested = [...nestedCommentsVisible];
    tmpNewNested[currId] = { ...newNested };

    setNestedCommentsVisible([ ...tmpNewNested ]);
  };


  // Likes a comment with the back-end
  const handleLikePress = (commentId: string) => {
    if (!context?.token || !commentId) {
      return;
    }

    post(
      `/api/art-publication/comment/${commentId}/like`,
      {},
      context?.token,
      fetchComments,
      (error) => {
        console.error("Error liking comment:", { ...error });
      }
    );
  };


  // Returns a user by its ID, or undefined in case it does not exist
  const getUserById = (
    userId: string
  ): UserProfileType | undefined => {
    if (!userId) {
      return undefined;
    }

    const user: UserProfileType | undefined = userProfiles.find(
      (user: UserProfileType) => user.id === userId
    )

    return user;
  }


  // Returns true if comment and answeringTo are refering
  // to the same comment
  const getIfAnsweringTo = (
    comment: CommentType | undefined,
    answeringTo: AnsweringToType | undefined
  ): boolean => {
    if (!comment || !answeringTo) {
      return false;
    }

    const isUserEqual: boolean = comment?.userId === answeringTo.userId;
    const isCommentEqual: boolean = comment.id === answeringTo.commentId;
    return isUserEqual && isCommentEqual;
  }


  // Returns a Nested comment from its ID, or undefined in case it does not exist
  const getNestedCommentByParentId = (
    commentId: string
  ): NestedCommentVisibleType | undefined => {
    if (!commentId) {
      return undefined
    }

    const comm: NestedCommentVisibleType | undefined = nestedCommentsVisible.find(
      (comm: NestedCommentVisibleType) => comm.parentId === commentId
    );

    return comm;
  }


  /* A single comment */
  const RenderComment = ({
    comment,
    index = -1,
    isNested = false
  }: RenderComponentProps) => (
    <View key={index} style={styles.commentContainer}>
      <ArtistCard
        item={getUserById(comment.userId)}
        style={{
          image: { height: 40, width: 40 },
        }}
        showTitle={false}
      />

      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>
            { getUserById(comment.userId)?.username }
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
          { 'nestedComments' in comment && comment?.nestedComments?.length > 0 && (
            <TouchableOpacity
              onPress={() => toggleNestedComments(comment.id)}
              style={[flexRow]}
            >
              <Ionicons
                name={getNestedCommentByParentId(comment.id)?.visible ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={colors.darkGreyFg}
              />
            </TouchableOpacity>
          ) }

          {/* Report */}
          <TouchableOpacity
            onPress={() => navigation.navigate(
              'report',
              { id: comment?.id, type: 'post' }
            )}
            style={[mlAuto, mr20]}
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
                if (!nestedId || !getIfAnsweringTo(comment, answeringTo)) {
                  setNestedId(comment?.id);
                  setAnsweringTo({
                    userId: comment.userId,
                    commentId: comment.id,
                    username: getUserById(comment.userId)?.username ?? ""
                  });
                } else {
                  setAnsweringTo(undefined);
                  setNestedId(undefined);
                }
              }}
              style={[mh8]}
            >
              <Octicons
                name="reply"
                color={getIfAnsweringTo(comment, answeringTo) ?
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
              name={comment.isLiked ? 'heart' : 'hearto'}
              size={20}
              color={comment.isLiked ? context?.userColor ?? colors.primary : colors.darkGreyFg}
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
            <RenderComment
              comment={comment}
              index={index}
            />

            { getNestedCommentByParentId(comment.id)?.visible && comment.nestedComments.map(
              (nestedComment: NestedComment, nestedIndex: number) => (
                <RenderComment
                  key={nestedComment.id}
                  comment={nestedComment}
                  index={nestedIndex}
                  isNested={true}
                />
              )
            ) }

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
                  <Text style={styles.sendButtonText}>
                    Poster
                  </Text>
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
              <Text style={[cTextDark, mb24]}>
                Are you sure you want to delete this comment?
              </Text>

              <View style={[flexRow]}>
                <Button
                  style={[flex1]}
                  value="Annuler"
                  secondary
                  onPress={() => setIsDeleteModalShown(false)}
                />

                <Button
                  style={[flex1]}
                  value="Supprimer"
                  onPress={deleteComment}
                />
              </View>
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
