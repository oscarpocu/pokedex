import { useState, useEffect } from "react";
import "./App.css";
import React from 'react';
import Pokedex from './components/Pokedex';

function App() {
  return (
    <div className="min-h-screen w-full bg-slate-950 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black flex items-center justify-center p-4">
      {/* El componente Pokedex ya tiene el fondo oscuro y centrado */}
      <Pokedex />
    </div>
  );
}

export default App;