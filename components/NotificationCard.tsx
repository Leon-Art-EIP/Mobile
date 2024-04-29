import React, { useEffect, useState } from 'react';
import Card from './Card';
import { NotificationsType } from '../constants/notifications';
import { Text } from 'react-native';
import { mh4, mv4 } from '../constants/styles';


type NotificationCardProps = {
  item: NotificationsType | undefined;
  index: number
};


const NotificationCard = ({
  item = undefined,
  index = -1
}: NotificationCardProps) => {
  const [text, setText] = useState<string>("");


  const setNotifText = () => {
    if (item?.type === 'follow') {
      setText(item.content + ' a commencé à vous suivre');
    } else if (item?.type === 'like') {
      setText(item.content + ' a liké votre publication');
    } else {
      setText('Notification surprise');
    }
  }


  useEffect(setNotifText, []);


  return item && index !== -1 ? (
    <Card style={[ mh4, mv4 ]}>
      <Text>{ text }</Text>
    </Card>
  ) : (
    <Text>Error rendering notification</Text>
  );
}


export default NotificationCard;
