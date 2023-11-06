import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import colors from '../../constants/colors';
import { MessageType } from '../../constants/conversations';
import { flex1, flexRow, fwBold, mlAuto, mrAuto, noVMargin } from '../../constants/styles';
import { dateToHour } from '../../helpers/DateHelper';
import Button from '../Button';


type TextBubbleType = {
  message: MessageType;
};

type MessageType = {
  "_id": string,
  "content": string,
  "contentType": string,
  "dateTime": string,
  "id": number,
  "read": boolean,
  "sender": number
};

const TextBubble = ({
  message
}: TextBubbleType) => {
  const [isHourDisplayed, setIsHourDisplayed] = useState<boolean>(false);

  switch (message.contentType) {
    case ('text'): return (
      <TouchableOpacity
        onPress={() => setIsHourDisplayed(current => !current)}
        activeOpacity={1}
      >
        <View style={[
          styles.bubbleView,
          message.read ? styles.bubbleLeftView : styles.bubbleRightView
        ]}>
          <Text style={
            message.read ? styles.bubbleLeftText : styles.bubbleRighText
          }>{ message.content }</Text>
        </View>
        { isHourDisplayed && (
          <Text style={message.read ? mrAuto : mlAuto}>
            { dateToHour(message.dateTime) }
          </Text>
        ) }
      </TouchableOpacity>
    );
    case ('offer'): return (
      <View style={styles.offerView}>
        <View style={flexRow}>
          <Text style={styles.offerText}>
            Vous avez reçu une offre à
          </Text>
          <Text style={[ styles.offerText, fwBold ]}>
            { ' ' + message.content.toString() + ' ' }
          </Text>
          <Text style={styles.offerText}>€</Text>
        </View>
        <View style={[flexRow, noVMargin]}>
          <Button
            value='Refuser'
            secondary
            style={flex1}
          />
          <Button
            value='Accepter'
            style={flex1}
        />
        </View>
      </View>
    );
    default: return (
      <TouchableOpacity
        onPress={() => setIsHourDisplayed(current => !current)}
        activeOpacity={1}
      >
        <Image
          source={{ uri: message.content.toString() }}
          style={[
            styles.image,
            message.read ? mrAuto : mlAuto
          ]}
        />
        { isHourDisplayed && (
          <Text style={message.read ? mrAuto : mlAuto}>
            { dateToHour(message.dateTime) }
          </Text>
        ) }
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  bubbleView: {
    maxWidth: '70%',
    borderRadius: 12,
    marginVertical: 2,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  bubbleLeftView: {
    marginRight: 'auto',
    backgroundColor: colors.bubbleBgReceived,
    color: colors.bubbleFgReceived
  },
  bubbleRightView: {
    marginLeft: 'auto',
    backgroundColor: colors.bubbleBgSent,
    color: colors.bubbleFgSent
  },
  offerView: {
    backgroundColor: colors.offerBg,
    width: '80%',
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 12,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  bubbleLeftText: {
    color: colors.bubbleFgReceived
  },
  bubbleRighText: {
    color: colors.bubbleFgSent
  },
  offerText: {
    marginVertical: 5,
    color: colors.offerFg
  },
  image: {
    borderRadius: 12,
    width: '70%'
  }
});

export default TextBubble;
