import axios from "axios";

/* const BACKEND: string = "http://localhost:5000"; */
const BACKEND: string = "http://10.0.2.2:5000";

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
  const requestUrl = BACKEND + url;
  console.log('Calling: ', requestUrl);

  axios.get(requestUrl, { 'headers': { 'Authorization': 'Bearer ' + token } })
  .then(callback)
  .catch((error) => {
    onErrorCallback(error);
    return console.error(error);
  });
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
  if (!body) {
    console.warn("Empty body for post request");
  }
  if (!token) {
    console.warn("Token is empty");
  }

  const requestUrl = BACKEND + url;

  axios.post(requestUrl, { 'headers': { 'Authorization': 'Bearer ' + token }})
  .then(callback)
  .catch(onErrorCallback);
}

export {
  get,
  post
};
