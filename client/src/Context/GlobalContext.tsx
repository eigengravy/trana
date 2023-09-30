import React, { useState, createContext } from "react";

export const GlobalContext = createContext({
  text: undefined as any | undefined,
  setText: (value: any) => {},
  userPrompt: undefined as any | undefined,
  setUserPrompt: (value: any) => {},
  uploaded: undefined as any | undefined,
  setUploaded: (value: any) => {},
});

export const GlobalProvider = (props: any) => {
  const [text, setText] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [uploaded, setUploaded] = useState(false);
  return (
    <GlobalContext.Provider
      value={{
        text,
        setText,
        userPrompt,
        setUserPrompt,
        uploaded,
        setUploaded,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
