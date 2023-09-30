import React, { useState, useContext } from "react";
import logo from "./logo.svg";
import "./App.css";
import { GlobalContext } from "./Context/GlobalContext";
import UploadModal from "./Components/UploadModal";
import Chat from "./Components/Chat";

function App() {
  const { uploaded } = useContext(GlobalContext);

  return (
    <div className="max-w-[100vw] min-h-[100vh] flex relative items-center justify-center bg-[#0A0A0A]">
      {!uploaded ? (
        <UploadModal />
      ) : (
        <div className="absolute w-[100vw] bottom-0 right-0 h-[100vh]">
          <Chat />
        </div>
      )}
    </div>
  );
}

export default App;
