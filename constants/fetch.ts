import axios from "axios";

// const BACKEND: string = "http://127.0.0.1:5000";
const BACKEND: string = "http://10.0.2.2:5000";

const get = (
  url: string = "/",
  callback: ((response: any) => void) = () => {}
) => {
  const requestUrl = BACKEND + url;

  axios.get(requestUrl)
  .then(callback)
  .catch((error: any) => {
    console.error('Catched error: ', error);
  });
}


const post = (
  url: string = "/",
  body: any = undefined,
  callback: ((response: any) => void) = () => {}
) => {
  if (!body) {
    console.warn("[WARNING] Empty body for post request");
  }

  const requestUrl = BACKEND + url;
  console.log("calling : ", requestUrl);

  axios.post(requestUrl, body)
  .then(callback)
  .catch((error: any) => {
    console.error('Catched error: ', error);
  });
}


export {
  get,
  post
};
