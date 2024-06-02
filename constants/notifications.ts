import notifee, { AuthorizationStatus } from "@notifee/react-native";
import messaging from '@react-native-firebase/messaging';
import { ToastAndroid } from "react-native";
import { get, put } from "./fetch";


type NotificationsType = {
  collapseKey: string;
  data: any,
  from: string,
  messageId: string;
  notification: {
    android: any,
    body: string;
    title: string;
  },
  sentTime: number;
  ttl: number;
};

let channelId: any = undefined;
let isNotificationAuthorized: boolean = false;
let token: string | undefined = undefined;


/*
  * This function creates an android notification from
  * the back-end push notification
  */
const postNotification = async (message: NotificationsType | any) => {
  if (!isNotificationAuthorized) {
    return;
  }

  if (!channelId) {
    console.error("Notification was not setup. Setting up...");
    await setupNotifications();
  }

  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    android: {
      channelId,
      smallIcon: 'icon',
      pressAction: {
        id: 'default',
      },
    },
  });
}


const togglePermission = async () => {
  if (isNotificationAuthorized) {
    isNotificationAuthorized = false;
    return false;
  }

  isNotificationAuthorized = true;
  return true;
}


/*
  * Asks the user for notification permissions
  */
const getPermission = async () => {
  const permission = await notifee.getNotificationSettings();
  if (permission) {
    isNotificationAuthorized = true;
    return true;
  }

  const isAuthorized = await notifee.requestPermission()

  if (isAuthorized.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    isNotificationAuthorized = true;
    return true;
  }
  isNotificationAuthorized = false;
  return false;
}

/*
  * This function sets up the notification channel
  * It has to be called in the start of the app
  */
const setupNotifications = async (
  api_token: string | undefined = undefined,
  postToBack: boolean = true
) => {
  channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  await getPermission();

  await messaging().registerDeviceForRemoteMessages();
  token = await messaging().getToken();

  if (!token) {
    return console.warn("Could not register for notifications: notification token is empty");
  }

  if (!postToBack) {
    return token;
  }

  if (!api_token) {
    return console.warn("Could not register for notifications: API Token is empty");
  }

  put(
    "/api/notifications/update-fcm-token",
    { fcmToken: token },
    api_token,
    () => {
      console.log("Notifications set up")
      messaging().onMessage(postNotification);
      messaging().setBackgroundMessageHandler(postNotification);
    },
    (err: any) => console.error("Notifications setup error: ", { ...err })
  );

}


/*
  * Returns true if the notifications are already registered
  * returns false otherwise
  */
const isNotificationRegistered = () => {
  return !!isNotificationAuthorized;
}


const getNotificationCount = (api_token: string | undefined) => {
  if (!api_token) {
    return;
  }

  return new Promise((resolve, revoke) => get(
    "/api/notifications/count",
    api_token,
    (res: any) => resolve(res?.data?.unreadCount),
    (err: any) => revoke(err)
  ));
}


export {
  getPermission,
  setupNotifications,
  isNotificationRegistered,
  postNotification,
  togglePermission,
  getNotificationCount
};

export type { NotificationsType };
