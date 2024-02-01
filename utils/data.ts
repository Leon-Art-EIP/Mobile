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