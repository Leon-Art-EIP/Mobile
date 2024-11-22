import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { post } from '../constants/fetch';
import { StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { MainContext } from '../context/MainContext';
import Ionicons from 'react-native-vector-icons/Ionicons';


type AnsweringToType = {
  userId: string;
  commentId: string;
  username: string;
};

type CommentInputProps = {
  id: string;
  nestedId: number | undefined;
  answeringTo: AnsweringToType | undefined; // Profile type
  setNestedId: (e: number | undefined) => void;
  setAnsweringTo: (e: AnsweringToType | undefined) => void;
  trigger: Function;
}


const CommentInput = ({
  id,
  nestedId = undefined,
  answeringTo = undefined,  // Comment ID you are answering to
  setAnsweringTo = () => {},
  setNestedId = () => {},
  trigger = (curr: number) => curr + 1
}: CommentInputProps) => {
  const [commentInput, setCommentInput] = useState('');
  const context = useContext(MainContext);


  const handleCommentInput = (text: string) => {
    setCommentInput(text);
  };


  const postComment = async () => {
    if (!commentInput.trim()) {
      console.warn('Comment cannot be empty');
      return;
    }

    let body: any = {
      text: commentInput,
    };

    if (nestedId) {
      body = { ...body, parentCommentId: answeringTo?.commentId };
    }

    post(
      `/api/art-publication/comment/${id}`,
      body,
      context?.token,
      (_) => {
        setCommentInput('');
        setAnsweringTo(undefined);
        setNestedId(undefined);
        trigger((curr: number) => curr + 1);
      },
      (error) => {
        console.error('Error posting comments:', error);
      }
    );
  };


  useEffect(() => {
    const regex = /^@\S+\s*/;
    let newInput: string = (commentInput ?? "").replace(regex, "").trim();

    if (!!answeringTo) {
      setCommentInput('@' + answeringTo?.username + ' ' + newInput);
    } else {
      setCommentInput(newInput);
    }
  }, [answeringTo])


  return (
    <View style={styles.commentInputContainer}>
      <TextInput
        placeholder={!!answeringTo ? "Répondre à " + answeringTo?.userId + "..." : "Commenter..."}
        placeholderTextColor={colors.disabledFg}
        style={styles.commentInput}
        onChangeText={(text) => handleCommentInput(text)}
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
  );
};


const styles = StyleSheet.create({
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
    bottom: 2,
  },
  commentInput: {
    color: colors.textDark,
    flex: 1,
    backgroundColor: colors.disabledBg,
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
    color: colors.black
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
