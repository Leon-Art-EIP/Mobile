import React from 'react';


const getImageUrl = (urlFromBack: string | undefined) => {
  if (!urlFromBack) {
    return undefined;
  }

  const back_end = process.env.REACT_APP_API_URL;
  return (back_end + '/api/' + urlFromBack).toString();
}


export {
  getImageUrl
};
