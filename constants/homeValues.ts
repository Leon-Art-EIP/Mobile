type NewsType = {
  id: number;
  title: string;
  imgUrl: string;
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

export type { NewsType };
export {
  const_news,
  const_artists
};