export interface Artwork {
    _id: string;
    userId: string;
    image: string;
    artType: string;
    name: string;
    description: string;
    dimension: string;
    isForSale: boolean;
    price: number;
    location: string;
    likes: any[];
    comments: any[];
    __v: number;
  }

export interface UserData {
    _id: string;
    username: string;
    is_artist: boolean;
    availability: string;
    subscription: string;
    collections: any[];
    subscriptions: any[];
    subscribers: any[];
    subscribersCount: number;
    likedPublications: any[];
    canPostArticles: boolean;
    __v: number;
    bannerPicture: string;
    profilePicture: string;
    biography: string;
  }

export interface Conversation {
  _id: "string",
  lastMessage: "string",
  unreadMessages: true,
  UserOneId: "string",
  UserOneName: "string",
  UserOnePicture: "string",
  UserTwoId: "string",
  UserTwoName: "string",
  UserTwoPicture: "string"
}

export type ConversationType = {
  "_id": string;
  "lastMessage": string;
  "unreadMessages": boolean;
  "UserOneId": string;
  "UserOneName": string;
  "UserOnePicture": string;
  "UserTwoId": string;
  "UserTwoName": string;
  "UserTwoPicture": string;
};