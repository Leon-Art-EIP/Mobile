import io, { Socket } from 'socket.io-client';

let storedUrl: string = process.env?.REACT_APP_API_URL ?? "https://back-dev.leonart-dev.ovh";
let socket: Socket | undefined = undefined;
let isVerbose: boolean = false;


// Starts the socket with a specific url
const start = (
  url: string = storedUrl,
  verbose: boolean = false
) => {
  console.log(url, verbose);
  socket = io(url, {forceBase64: true});
  /* socket = io(url, {transports: ['websocket'], jsonp: false, forceNew: true}); */
  isVerbose = verbose;
  storedUrl = url;

  if (isVerbose) {
    console.log('[SOCKET] socket started on URL ', url);
  }
}


// Emits a socket to KEY with object BODY
const emit = (
  key: string,
  body: any = undefined
) => {
  if (!key || !body) {
    return console.warn("[SOCKET] key or body is undefined");
  }

  if (isVerbose) {
    console.log("[SOCKET] socket with key '", key, "' emitted with value ", body);
  }

  return socket?.emit(key, body);
}


// return true if started, false otherwise
const isStarted = () => !!socket;


// Returns current url, or undefined if not started
const getUrl = () => socket ? storedUrl : undefined;


// returns the Socket object for specific case you would need it
const get = () => socket;


// Turns on the listening on a specific key
const on = (
  key: string,
  callback: (...args: any[]) => void
) => {
  if (!key) {
    return console.warn("[SOCKET] cannot on() as key is empty");
  }

  if (isVerbose) {
    console.log("[SOCKET] socket with key '", key, "' was turned on");
  }

  return socket?.on(key, callback);
}


// Turns off the listening on a specific key
const off = (key: string) => {
  if (!key) {
    return console.warn("[SOCKET] cannot off() as key is empty");
  }

  if (isVerbose) {
    console.log("[SOCKET] socket with key '", key, "' was turned off");
  }

  return socket?.off(key);
}


// That's the main object you're gonna use
const SockHelper = {
  get,
  emit,
  start,
  isStarted,
  getUrl,
  on,
  off
};

export default SockHelper;
