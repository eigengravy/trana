import React, { useState, createContext } from "react";

export const GlobalContext = createContext({
  url: "" as string,
  setUrl: (value: string) => {},
  text: "" as string,
  setText: (value: string) => {},
  userPrompt: "" as string,
  setUserPrompt: (value: string) => {},
  uploaded: false as boolean,
  setUploaded: (value: boolean) => {},
  windowed: false as boolean,
  setWindowed: (value: boolean) => {},
});

export const GlobalProvider = (props: any) => {
  const [url, setUrl] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [uploaded, setUploaded] = useState(false);
  const [windowed, setWindowed] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        url,
        setUrl,
        text,
        setText,
        userPrompt,
        setUserPrompt,
        uploaded,
        setUploaded,
        windowed,
        setWindowed,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
