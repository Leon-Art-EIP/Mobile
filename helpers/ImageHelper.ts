import colors from '../constants/colors';


const getImageUrl = (urlFromBack: string | undefined) => {
  if (!urlFromBack || urlFromBack === "") {
    return undefined;
  }

  const back_end = process.env.REACT_APP_API_URL;
  return (back_end + '/api/' + urlFromBack).toString();
}


const getRandomBgColor = () => {
  const rdColors = [
    colors.platinium,
    colors.oldrose,
    colors.tag,
    colors.offerBg,
    "#cefbff",
    "#cfffc6",
    "#f3d5ff",
    "#cbd5ff",
    "#ffebd3",
    "#f7ffdb"
  ];

  return rdColors[Math.floor(Math.random() * rdColors.length)];
}


export {
  getImageUrl,
  getRandomBgColor
};
