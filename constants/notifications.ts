import { Notifications, Registered } from "react-native-notifications";
import { get, put } from "./fetch";



type NotificationsType = {
  _id: string;
  recipient: string;
  type: string;
  content: string;
  referenceId: string;
  read: boolean;
  createdAt: Date;
  __v: number
};


/*
  * This function sets up the notification channel
  * It has to be called in the start of the app
  */
const setupNotifications = (
  postToBack: boolean = true,
  token: string | undefined = undefined
) => {
  let isRegistered: boolean = false;

  Notifications.isRegisteredForRemoteNotifications().then((alreadyRegistered) => {
    isRegistered = alreadyRegistered;
  });

  if (isRegistered) {
    return console.warn("Notifications are already registered. No need to do it again. Aborting...");
  }

  Notifications.registerRemoteNotifications()
  Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
    if (!postToBack) {
      return
    }

    put(
      "/api/notifications/update-fcm-token",
      { fcmToken: event.deviceToken },
      token,
      () => console.log("Notifications set up"),
      (err: any) => console.error("Notifications setup error: ", err)
    );
  });
}


/*
  * This function checks if the user granted the notifications right
  * IOS only !
  */
const checkNotificationRights = () => {
  Notifications.ios.checkPermissions()
  .then((currentPermissions) => {
    console.log('IOS Permission check:');
    console.log('Badges enabled: ' + !!currentPermissions.badge);
    console.log('Sounds enabled: ' + !!currentPermissions.sound);
    console.log('Alerts enabled: ' + !!currentPermissions.alert);
    console.log('Car Play enabled: ' + !!currentPermissions.carPlay);
    console.log('Critical Alerts enabled: ' + !!currentPermissions.criticalAlert);
    console.log('Provisional enabled: ' + !!currentPermissions.provisional);
    console.log('Provides App Notification Settings enabled: ' + !!currentPermissions.providesAppNotificationSettings);
    console.log('Announcement enabled: ' + !!currentPermissions.announcement);
  });
}


/*
  * Returns true if the notifications are already registered
  * returns false otherwise
  */
const isNotificationRegistered = async () => {
  return Notifications.isRegisteredForRemoteNotifications()
  .then((result: boolean) => result);
}


/*
  * Marks a notification as read
  * Takes two parameters:
  *     - notifId: the ID of the read notification,
  *     - token: the user token to do the API call
  */
const readNotification = (
  notifId: string | undefined = undefined,
  token: string | undefined = undefined
) => {
  if (!notifId) {
    return console.error("Read notification error: empty notification ID");
  }

  if (!token) {
    return console.error("Read notification error: empty user token");
  }

  put(
    `/api/notifications/${notifId}/read`,
    { id: notifId },
    token,
    () => {},
    (err) => console.error("Read notification error: ", err)
  );
}


/*
  * Returns the number of unread notifications (for badge)
  * Takes one parameter:
  *     - token: user token for API call
  */
const getUnreadNotifCount = async (
  token: string | undefined = undefined
): Promise<number> => {
  if (!token) {
    console.error("Read notification error: empty user token");
    return new Promise((_, reject) => reject(-1));
  }

  return new Promise((resolve, reject) => {
    get(
      "/api/notifications/count",
      token,
      (res) => resolve(res.unreadCount ?? -1),
      (err) => {
        console.error("Unread notification number error: ", err);
        reject(err);
      }
    );
  });
}


/*
  * Returns an array containing the LIMIT last notifications of this user
  * Takes 3 parameters:
  *     - token: user token to do the API call,
  *     - limit: how many notifications you want to get,
  *     - page: if you want to render older notifications
  */
const getNotifications = (
  token: string | undefined = undefined,
  limit: number = 20,
  page: number = 1
): Promise<NotificationsType[]> => {
  if (!token) {
    console.error("Read notification error: empty user token");
    return new Promise((_, reject) => reject([]));
  }

  return new Promise((resolve, reject) => {
    get(
      `/api/notifications?limit=${limit}&page=${page}`,
      token,
      (res) => {
        resolve(res?.data);
      },
      (err) => {
        reject([])
        console.error("Get notification error: ", err);
      }
    );
  });
}


export {
  checkNotificationRights,
  setupNotifications,
  readNotification,
  getUnreadNotifCount,
  getNotifications,
  isNotificationRegistered
};

export type { NotificationsType };
