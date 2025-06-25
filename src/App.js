import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ClienteList from "./components/ClienteList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* Quité la ruta /panel porque no tienes Panel.js */}
      <Route path="/clientes" element={<ClienteList />} />
    </Routes>
  );
}

export default App;




/*import AuthorList from './components/ClienteList';
import Panel from "./components/Panel";


import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ClienteList from './components/ClienteList';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        
        <Route path="/ClienteList" element={<ClienteList/>}/>
        
        
      </Routes>
    </Router>
  );
}
export default App;*/