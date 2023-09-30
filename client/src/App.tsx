import React, { useState, useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import { GlobalContext } from './Context/GlobalContext';
import UploadModal from './Components/UploadModal';
import Chat from './Components/Chat';

function App() {

  const {uploaded} = useContext(GlobalContext)
  
  return (
    <div className="max-w-[100vw] min-h-[100vh] flex items-center justify-center bg-[#0A0A0A]">
      {!uploaded ? (
        <UploadModal />
      ) : (
        <Chat />
      )}
    </div>
  );
}

export default App;
