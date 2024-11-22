export type TokenObjectType = {
  token: string;
  email: string;
  id: string;
  isArtist: boolean;
  username: string;
  userColor: string;
};

export interface ArtTypeFilter {
  category: string;
  types: string[];
  collapsed: boolean;
}

export type CollectionType = {
  _id: string;
  name: string;
  user: string; // user id
  __v: 0;
  artPublications: string[]; // publication IDs
  isPublic: boolean;
};

export const artTypeFilters: ArtTypeFilter[] = [
  {
    category: "Peinture",
    types: [
      "Huile",
      "Aquarelle",
      "Acrylique",
      "Gouache",
      "Tempera",
      "Fresque"
    ],
    collapsed: false,
  },
  {
    category: "Dessin",
    types: [
      "Crayon",
      "Fusain",
      "Encre",
      "Pastel",
      "Sanguine",
      "Craie"
    ],
    collapsed: false,
  },
  {
    category: "Photographie",
    types: [
      "Photographie argentique",
      "Photographie numérique",
      "Photographie noir et blanc",
      "Photographie couleur"
    ],
    collapsed: false,
  },
  {
    category: "Sculpture",
    types: [
      "Bronze",
      "Pierre",
      "Bois",
      "Résine",
      "Céramique",
      "Verre"
    ],
    collapsed: false,
  },
  {
    category: "Céramique",
    types: [
      "Porcelaine",
      "Faïence",
      "Grès",
      "Terre cuite"
    ],
    collapsed: false,
  },
  {
    category: "Textile",
    types: [
      "Broderie",
      "Tapisserie",
      "Art vestimentaire"
    ],
    collapsed: false,
  },
  {
    category: "Gravure",
    types: [
      "Linogravure",
      "Eau-forte",
      "Lithographie",
      "Sérigraphie",
      "Monotype"
    ],
    collapsed: false,
  },
  {
    category: "Art du verre",
    types: [
      "Soufflage de verre",
      "Vitrail",
      "Fusing"
    ],
    collapsed: false,
  },
  {
    category: "Artisanat",
    types: [
      "Joallerie",
      "Ébénisterie",
      "Marqueterie",
      "Ferronnerie d'art"
    ],
    collapsed: false,
  },
  {
    category: "Art numérique",
    types: [
      "Impressions numériques",
      "Art génératif"
    ],
    collapsed: false,
  },
];