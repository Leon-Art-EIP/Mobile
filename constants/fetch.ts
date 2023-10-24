import axios from "axios";

// const BACKEND: string = "http://127.0.0.1:5000";
// const BACKEND: string = "http://10.0.2.2:5000";
const BACKEND: string = "http://localhost:5001";

const get = (
  url: string = "/",
  callback: ((response: any) => void) = () => {},
  onErrorCallback: ((error: any) => void) = (e: any) => {
    console.error("get failed with code ", e.response.status);
  }
) => {
  const requestUrl = BACKEND + url;

  axios.get(requestUrl)
  .then(callback)
  .catch(onErrorCallback);
}


const post = (
  url: string = "/",
  body: any = undefined,
  callback: ((response: any) => void) = () => {},
  onErrorCallback: ((error: any) => void) = (e: any) => {
    console.error("get failed with code ", e.response.status);
  }
) => {
  if (!body) {
    console.warn("[WARNING] Empty body for post request");
  }

  const requestUrl = BACKEND + url;
  console.log("calling : ", requestUrl);

  axios.post(requestUrl)
  // .post(requestUrl, body)
  .then(callback)
  .catch(onErrorCallback);
}

export {
  get,
  post
};
