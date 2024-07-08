type NewsType = {
  id: number;
  title: string;
  imgUrl: string;
}

type ArticleType = {
  id: number;
  title: string;
  mainImage: string;
  content: string;
};

type PublicationType = {
  id: number;
  title: string;
  mainImage: string;
  content: string;
};

type RedditPostType = {
  _id: string;
  // still a thing to see with the back end
};

type ArtistType = {
  _id: string;
  username: string;
  email: string;
  is_artist: boolean;
  biography: string;
  availability: string;
  subscription: string;
  collection: [
    {
      name: string;
    }
  ];
  subscriptions: string[];
  subscribersCount: number;
  likedPublications: string[];
  profilePicture: string | undefined;
};

type PostType = {
  _id: string;
  userId: string;
  image: string;
  artType: string;
  name: string;
  description: string;
  dimension: string;
  isForSale: boolean;
  isSold: boolean;
  price: number;
  location: string;
  likes: [];
  comments: []
}

const const_news: NewsType[] = [
  {
    id: 0,
    title: "L.Torvalds fait une exposition à l'abbaye de Maubuisson",
    imgUrl: "https://static.apidae-tourisme.com/filestore/objets-touristiques/images/77/188/8830029-diaporama.jpg"
  },
  {
    id: 1,
    title: "M.Weber expose au centre Pompidou de Metz",
    imgUrl: "https://upload.wikimedia.org/wikipedia/en/4/44/Metz_%28F%29_-_Centre_Pompidou_-_Au%C3%9Fenansicht.jpg"
  },
  {
    id: 2,
    title: "V.Garrigues donne un concert au Galaxie d'Amnéville",
    imgUrl: "https://lequotidien.lu/wp-content/uploads/2015/11/galaxie-620x330.jpg"
  }
];

const const_artists: NewsType[] = [
  {
    id: 0,
    title: "Marine Weber",
    imgUrl: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?cs=srgb&dl=pexels-mohamed-abdelghaffar-771742.jpg&fm=jpg"
  },
  {
    id: 1,
    title: "Evan Koehler",
    imgUrl: "https://e1.pxfuel.com/desktop-wallpaper/903/679/desktop-wallpaper-97-aesthetic-best-profile-pic-for-instagram-for-boy-instagram-dp-boys.jpg",
  },
  {
    id: 2,
    title: "Vivant Garrigues",
    imgUrl: "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
  }
];

export type { NewsType, ArtistType, ArticleType, PublicationType, PostType, RedditPostType };
export {
  const_news,
  const_artists,
};
