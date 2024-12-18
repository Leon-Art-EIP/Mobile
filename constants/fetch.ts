import axios from "axios";

const BACKEND: string | undefined = process.env.REACT_APP_API_URL;


const getAsync = async (
  url: string = "/",
  token: string | undefined = undefined
) => {
  if (!token) {
    console.warn("Token is empty");
  }

  if (!BACKEND) {
    return console.warn("Backend url is empty");
  }

  const requestUrl = BACKEND + url;
  console.log(requestUrl);

  return new Promise((resolve, reject) => {
    try {
      axios.get(
        requestUrl,
        { 'headers': { 'Authorization': 'Bearer ' + token } }
      ).then((response: any) => {
        resolve(response);
      });
    } catch (e) {
      reject(e);
    }
  });
}


const get = (
  url: string = "/",
  token: string | undefined = undefined,
  callback: ((response: any) => void) = () => {},
  onErrorCallback: ((error: any) => void) = (e: any) => {
    console.error("get failed: ", { ...e });
  }
) => {
  if (!token) {
    console.log("Token is empty");
  }
  if (!BACKEND) {
    return console.warn('Backend url is empty');
  }

  const requestUrl = BACKEND + url;
  console.log(requestUrl);

  axios.get(requestUrl, { 'headers': { 'Authorization': 'Bearer ' + token } })
  .then(callback)
  .catch(onErrorCallback);
}


const post = (
  url: string = '/',
  body: any | undefined = undefined,
  token: string | undefined = undefined,
  callback = (resp: any) => {},
  onErrorCallback = (e: any) => {
    console.error('post failed with code ', e.response ? e.response.status : e);
  }
) => {
  if (!token) {
    console.log('Token is empty');
  }
  if (!BACKEND) {
    return console.warn('Backend url is empty');
  }

  const requestUrl = BACKEND + url;
  console.log(requestUrl);

  // Setting up headers
  let headers = {
    Authorization: 'Bearer ' + token,
  };

  // If body is FormData, set Content-Type to multipart/form-data
  if (body instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }

  axios.post(requestUrl, body, {
    headers: headers
  })
  .then(callback)
  .catch(onErrorCallback);
}


const put = (
  url = '/',
  body = undefined,
  token = undefined,
  callback = () => {},
  onErrorCallback = (e) => {
    console.error('post failed with code ', e.response ? e.response.status : e);
  }
) => {
  if (!token) {
    console.warn('Token is empty');
  }
  if (!BACKEND) {
    return console.warn('Backend url is empty');
  }

  const requestUrl = BACKEND + url;
  console.log(requestUrl);

  // Setting up headers
  let headers = {
    Authorization: 'Bearer ' + token,
  };

  axios.put(requestUrl, body, {
    headers: headers
  })
  .then(callback)
  .catch(onErrorCallback);
}


const del = (
  url: string = "/",
  token: string | undefined = undefined,
  callback: ((response: any) => void) = () => {},
  onErrorCallback: ((error: any) => void) = (e: any) => {
    console.error("get failed with code ", e.response.status);
  }
) => {
  let headers = { 'headers': { 'Authorization': 'Bearer ' + token }};

  if (!token) {
    // console.warn("Token is empty");
  }
  if (!BACKEND) {
    return console.warn('Backend url is empty');
  }

  const requestUrl = BACKEND + url;
  console.log(requestUrl);

  axios.delete(requestUrl, token ? headers : {})
  .then(callback)
  .catch(onErrorCallback);
}


export {
  get,
  post,
  del,
  put,
  getAsync
};
