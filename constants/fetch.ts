import axios from "axios";

const BACKEND: string | undefined = process.env.REACT_APP_API_URL;

const get = (
  url: string = "/",
  token: string | undefined = undefined,
  callback: ((response: any) => void) = () => {},
  onErrorCallback: ((error: any) => void) = (e: any) => {
    console.error("get failed: ", { ...e });
  }
) => {
  if (!token) {
    console.warn("Token is empty");
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
  url: string = "/",
  body: any = undefined,
  token: string | undefined = undefined,
  callback: ((response: any) => void) = () => {},
  onErrorCallback: ((error: any) => void) = (e: any) => {
    console.error("get failed with code ", e.response.status);
  }
) => {
  let headers = { 'headers': { 'Authorization': 'Bearer ' + token }};

  if (!BACKEND) {
    return console.warn('Backend url is empty');
  }

  const requestUrl = BACKEND + url;
  console.log(requestUrl);

  axios.post(requestUrl, body, token ? headers : {})
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


const put = (
  url: string = "/",
  body: any = undefined,
  token: string | undefined = undefined,
  callback: ((response: any) => void) = () => {},
  onErrorCallback: ((error: any) => void) = (e: any) => {
    console.error("get failed with code ", e.response.status);
  }
) => {
  let headers = { 'headers': { 'Authorization': 'Bearer ' + token }};

  if (!BACKEND) {
    return console.warn('Backend url is empty');
  }

  const requestUrl = BACKEND + url;
  console.log(requestUrl);

  axios.put(requestUrl, body, token ? headers : {})
  .then(callback)
  .catch(onErrorCallback);
}


export {
  get,
  post,
  del,
  put
};
