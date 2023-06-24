import axios from "axios";

const BACKEND: string = "http://localhost:5000";


const get = (
  url: string = "/",
  callback: ((response: any) => void) = () => {}
) => {
  axios.get(BACKEND + url)
  .then(callback)
}


const post = (
  url: string = "/",
  body: any = undefined,
  callback: ((response: any) => void) = () => {}
) => {
  if (!body) {
    console.warn("[WARNING] Empty body for post request");
  }

  axios.post(BACKEND + url, body)
  .then(callback);
}


export {
  get,
  post
};
