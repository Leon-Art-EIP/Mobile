export interface ArtTypeFilter {
  category: string;
  types: {
    type: string;
    selected: boolean;
  }[];
  collapsed: boolean;
}

export const artTypeFilters: ArtTypeFilter[] = [
  {
    category: "Peinture",
    types: [
      { type: "Huile", selected: false },
      { type: "Aquarelle", selected: false },
      { type: "Acrylique", selected: false },
      { type: "Gouache", selected: false },
      { type: "Tempera", selected: false },
      { type: "Fresque", selected: false },
    ],
    collapsed: false,
  },
  {
    category: "Dessin",
    types: [
      { type: "Crayon", selected: false },
      { type: "Fusain", selected: false },
      { type: "Encre", selected: false },
      { type: "Pastel", selected: false },
      { type: "Sanguine", selected: false },
      { type: "Craie", selected: false },
    ],
    collapsed: false,
  },
  {
    category: "Photographie",
    types: [
      { type: "Photographie argentique", selected: false },
      { type: "Photographie numérique", selected: false },
      { type: "Photographie noir et blanc", selected: false },
      { type: "Photographie couleur", selected: false },
    ],
    collapsed: false,
  },
  {
    category: "Sculpture",
    types: [
      { type: "Bronze", selected: false },
      { type: "Pierre", selected: false },
      { type: "Bois", selected: false },
      { type: "Résine", selected: false },
      { type: "Céramique", selected: false },
      { type: "Verre", selected: false },
    ],
    collapsed: false,
  },
  {
    category: "Céramique",
    types: [
      { type: "Porcelaine", selected: false },
      { type: "Faïence", selected: false },
      { type: "Grès", selected: false },
      { type: "Terre cuite", selected: false },
    ],
    collapsed: false,
  },
  {
    category: "Textile",
    types: [
      { type: "Broderie", selected: false },
      { type: "Tapisserie", selected: false },
      { type: "Art vestimentaire", selected: false },
    ],
    collapsed: false,
  },
  {
    category: "Gravure",
    types: [
      { type: "Linogravure", selected: false },
      { type: "Eau-forte", selected: false },
      { type: "Lithographie", selected: false },
      { type: "Sérigraphie", selected: false },
      { type: "Monotype", selected: false },
    ],
    collapsed: false,
  },
  {
    category: "Art du verre",
    types: [
      { type: "Soufflage de verre", selected: false },
      { type: "Vitrail", selected: false },
      { type: "Fusing", selected: false },
    ],
    collapsed: false,
  },
  {
    category: "Artisanat",
    types: [
      { type: "Joallerie", selected: false },
      { type: "Ébénisterie", selected: false },
      { type: "Marqueterie", selected: false },
      { type: "Ferronnerie d'art", selected: false },
    ],
    collapsed: false,
  },
  {
    category: "Art numérique",
    types: [
      { type: "Impressions numériques", selected: false },
      { type: "Art génératif", selected: false },
    ],
    collapsed: false,
  },
];
