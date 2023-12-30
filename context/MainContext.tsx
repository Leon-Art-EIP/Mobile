import React, { createContext, useState } from 'react';

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
  // Add your new type value here
};


const MainContext = createContext<MainContextType | null>(null);


const MainContextProvider = ({
  children = <></>
}) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  // Add your new value with a useState variable

  return (
    <MainContext.Provider
      value={{
        token,
        setToken,
        userId,
        setUserId
        // add your value and your setValue here
      }}
    >
      { children }
    </MainContext.Provider>
  );
}


export { MainContextProvider, MainContext }
export type { MainContextType };
