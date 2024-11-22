import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState } from 'react';
import colors from "../constants/colors";
import {TokenObjectType} from "../constants/artTypes";

/*
 * If you want to add a value to the context, follow these simple steps:
 *
 *  - add your variable in the type object by precising its type
 *  - add a useState variable for the new value
 *  - add BOTH your value and its setValue to the MainContext.Provider
 *
 */


type MainContextType = {
  token: string | undefined;
  setToken: (e: string | undefined) => void;
  userId: string | undefined;
  setUserId: (e: string | undefined) => void;
  userEmail: string | undefined;
  setUserEmail: (e: string | undefined) => void;
  isArtist: boolean | undefined;
  setisArtist: (e: boolean | undefined) => void;
  logOut: () => void;
  username: string | undefined;
  setUsername: (e: string | undefined) => void;
  isKeyboard: boolean;
  setIsKeyboard: (e: boolean) => void;
  userColor: string;
  setUserColor: (e: string) => void;
  saveContextToJwt: () => void;
  // Add your new type value here
};


const MainContext = createContext<MainContextType | null>(null);


const MainContextProvider = ({
  children = <></>
}) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [isArtist, setisArtist] = useState<boolean | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [isKeyboard, setIsKeyboard] = useState<boolean>(false);
  const [userColor, setUserColor] = useState<string>(colors.primary);


  const logOut = () => {
    AsyncStorage.removeItem('jwt', () => console.log("Storage cleared"));
    setToken(undefined);
    setUserEmail(undefined);
    setUserId(undefined);
    setisArtist(undefined);
    setUsername(undefined);
    setUserColor(colors.primary);
  };


  const saveContextToJwt = () => {
    if (!token || !userEmail || !userId || !isArtist || !username || !userColor) {
      console.warn('Failed saving context to JWT: a field may be undefined');
    }

    const tokenObject: TokenObjectType = {
      token: token ?? "",
      email: userEmail ?? "",
      id: userId ?? "",
      isArtist: !!isArtist,
      username: username ?? "",
      userColor
    };
    console.log("tokenObject: ", tokenObject);

    AsyncStorage.setItem('jwt', JSON.stringify(tokenObject))
    .catch((err: any) => console.error('Failed setting JWT in storage: ', err, tokenObject));
  };


  return (
    <MainContext.Provider
      value={{
        token,
        setToken,
        userId,
        setUserId,
        userEmail,
        setUserEmail,
        isArtist,
        setisArtist,
        logOut,
        username,
        setUsername,
        isKeyboard,
        setIsKeyboard,
        userColor,
        setUserColor,
        saveContextToJwt
        // add your value and your setValue here
      }}
    >
      { children }
    </MainContext.Provider>
  );
};


export { MainContextProvider, MainContext };
export type { MainContextType };
