import React, { useContext, useEffect, useState } from 'react';
import Card from './cards/Card';
import { NotificationsType } from '../constants/notifications';
import { Text, Touchable, TouchableOpacity, TouchableOpacityBase, View, ViewBase } from 'react-native';
import { cBlack, cText, flexRow, mh24, mh4, mv4, ph24, ph8 } from '../constants/styles';
import { useNavigation } from '@react-navigation/native';
import { get, put } from '../constants/fetch';
import { MainContext } from '../context/MainContext';
import colors from '../constants/colors';
import { capitalize, formatName } from '../helpers/NamesHelper';


type NotifType = {
  __v: number;
  id: string;
  content: string;
  createdAt: Date;
  read: boolean;
  recipient: string;
  referenceId: string;
  type: 'follow' | 'like' | 'order_shipping' | 'order_processing';
};

type NotificationCardProps = {
  item: NotifType | undefined;
  index: number
};


const NotificationCard = ({
  item = undefined,
  index = -1
}: NotificationCardProps) => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const [text, setText] = useState<string>("");
  console.log(item);


  const setNotifText = () => {
    switch (item?.type) {
      case ('follow'): return setText(item.content + ' a commencé à vous suivre');
      case ('like'): return setText(item.content + ' a liké votre publication');
      case ('order_shipping'): return setText("Votre commande est partie de chez l'artiste");
      case ('order_processing'): return setText("L'artiste a commencé votre commande");
      default: setText("empty");
    }
  }


  const callback = () => {
    return put(
      `/api/notifications/${item?.id}/read`,
      { id: item?.id },
      context?.token,
      () => {
        switch (item?.type) {
          case ('follow'): return navigation.navigate('other_profile', { id: item?.referenceId });
          case ('like'): return navigation.navigate('singleart', { id: item?.referenceId });
          case ('order_processing'): return navigation.navigate(
            'single_order',
            { id: item?.referenceId, buy: true }
          );
          case ('order_shipping'): return navigation.navigate(
            'single_order',
            { id: item?.referenceId, buy: true }
          );
          default: return;
        }
      },
      (err: any) => console.error({ ...err })
    );
  }


  useEffect(setNotifText, []);


  /*
    * For some reason, sometimes, the back end sends an empty notification
    * with only " " as item.content. In this case, we just want to skip it
  */
  return item && index !== -1 ? (
    <TouchableOpacity
      onPress={callback}
      key={item.id}
    >
      <Card style={[ mh4, mv4, flexRow, ph24 ]}>

        <View style={{
          backgroundColor: item.read ? colors.transparent : colors.primary,
          borderRadius: 50,
          height: 7,
          width: 7,
          marginTop: 'auto',
          marginBottom: 'auto',
          marginRight: 12
        }} />

        <Text
          style={{
            fontWeight: !item.read ? 'bold' : 'normal',
            color: colors.black,
            marginRight: 8
          }}
          numberOfLines={5}
          lineBreakMode='tail'
        >{ capitalize(text) }</Text>
      </Card>
    </TouchableOpacity>
  ) : (
    <></>
  );
}


export default NotificationCard;
