import React, { useState, useEffect } from 'react';
import Toast from './Toast';

const Pokedex = () => {
  const [pokemon, setPokemon] = useState(null);
  const [search, setSearch] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState([]);

  const addNotification = (msg) => {
    const id = Date.now(); // ID único para cada mensaje
    setToastMsg((prev) => [...prev, { id, msg }]);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setToastMsg((prev) => prev.filter((n) => n.id !== id));
  };

  const fetchPokemon = async (idOrName) => {
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName.toString().toLowerCase()}`);
      const data = await res.json();
      setPokemon(data);
      setSearch(data.id);
    } catch (error) {
      console.error("Pokemon no encontrado");
      addNotification("Pokemon not found! Please try another name or ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(1);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchPokemon(e.target.value);
  };

  if (!pokemon) return null;

  return (
    <div className="min-h-screen w-full bg-slate-950 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black flex items-center justify-center p-4">
      
      {/* PANEL IZQUIERDO: La Carcasa Clásica */}
      <div className="relative w-96 h-[550px] bg-red-600 rounded-l-3xl border-8 border-red-800 shadow-[20px_20px_60px_rgba(0,0,0,0.8),inset_-10px_-10px_20px_rgba(0,0,0,0.5)] p-6 flex flex-col z-10">
        
        {/* Luces Superiores */}
        <div className="flex gap-4 mb-6 items-start">
          <div className="w-16 h-16 bg-cyan-400 rounded-full border-4 border-white shadow-[0_0_20px_#22d3ee] animate-pulse"></div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-900"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-700"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-900"></div>
          </div>
        </div>

        {/* PANTALLA PRINCIPAL FUTURISTA */}
        <div className="bg-slate-300 p-4 rounded-bl-[40px] rounded-tr-lg shadow-inner">
          <div className="relative bg-slate-900 h-48 rounded-lg border-2 border-slate-800 overflow-hidden flex items-center justify-center group">
            {/* Efecto de Rejilla/Scanner */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
            
            {loading ? (
              <div className="text-cyan-500 animate-pulse">SCANNING...</div>
            ) : (
              <img 
                src={pokemon.sprites.other['official-artwork'].front_default} 
                alt={pokemon.name}
                className="w-40 z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform duration-500"
              />
            )}
          </div>
        </div>

        {/* Buscador y Controles */}
        <div className="mt-6 space-y-4">
          <input 
            type="text" 
            placeholder="TYPE NAME OR ID..."
            className="w-full bg-slate-900 border-b-2 border-cyan-500 p-2 text-cyan-400 placeholder-cyan-800 outline-none focus:bg-slate-800 transition-all"
            onKeyDown={handleSearch}
          />
          
          <div className="flex justify-between items-center">
            {/* D-PAD */}
            <div className="grid grid-cols-3 gap-0">
              <div className="col-start-2 w-8 h-8 bg-slate-800 rounded-t cursor-pointer hover:bg-slate-700 active:scale-95 flex items-center justify-center" onClick={() => fetchPokemon(search + 10)}>▲</div>
              <div className="col-start-1 w-8 h-8 bg-slate-800 rounded-l cursor-pointer hover:bg-slate-700 active:scale-95 flex items-center justify-center" onClick={() => fetchPokemon(search - 1)}>{"◀\uFE0E"}</div>
              <div className="bg-slate-900 w-8 h-8"></div>
              <div className="w-8 h-8 bg-slate-800 rounded-r cursor-pointer hover:bg-slate-700 active:scale-95 flex items-center justify-center" onClick={() => fetchPokemon(search + 1)}>{"▶\uFE0E"}</div>
              <div className="col-start-2 w-8 h-8 bg-slate-800 rounded-b cursor-pointer hover:bg-slate-700 active:scale-95 flex items-center justify-center" onClick={() => fetchPokemon(search - 10)}>▼</div>
            </div>
            
            <div className="w-12 h-12 bg-black rounded-full border-4 border-slate-800 shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* BISAGRA */}
      <div className="hidden md:block w-10 h-[480px] bg-gradient-to-r from-red-900 via-red-600 to-red-900 border-y-8 border-red-950 shadow-2xl"></div>

      {/* PANEL DERECHO: Pantalla de Datos High-Tech */}
      <div className="w-80 h-[450px] bg-red-600 rounded-r-3xl border-8 border-red-800 shadow-[inset_10px_-10px_20px_rgba(0,0,0,0.5)] p-6 flex flex-col justify-between overflow-hidden">
        
        {/* Pantalla de Stats Tecno */}
        <div className="bg-slate-950 border-2 border-cyan-900 rounded-md p-4 relative overflow-hidden">
            {/* Glow de fondo */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-3xl"></div>
            
            <h2 className="text-cyan-500 text-xl font-bold uppercase tracking-widest mb-4 border-b border-cyan-900/50">
              {pokemon.name} <span className="text-xs text-cyan-800">#{pokemon.id}</span>
            </h2>

            <div className="space-y-2 text-[10px] text-cyan-400">
              {pokemon.stats.map(s => (
                <div key={s.stat.name} className="flex flex-col">
                  <div className="flex justify-between mb-1 uppercase">
                    <span>{s.stat.name}</span>
                    <span>{s.base_stat}</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-cyan-900/30">
                    <div 
                      className="bg-cyan-500 h-full shadow-[0_0_8px_#22d3ee] transition-all duration-1000"
                      style={{ width: `${(s.base_stat / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* Botonera inferior decorativa */}
        <div className="grid grid-cols-5 gap-1 mt-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-6 bg-slate-900 rounded border border-red-800 shadow-inner"></div>
          ))}
        </div>

        <div className="flex justify-between items-end">
            <div className="w-16 h-4 bg-slate-900 rounded-full border border-red-900"></div>
            <div className="text-right">
                <div className="text-[10px] text-red-200">SYSTEM VERSION</div>
                <div className="text-xs font-bold text-white uppercase italic">Ultra-Dex v.3.0</div>
            </div>
        </div>
      </div>
      {/* Renderizamos el Toast si hay error */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col-reverse gap-3 items-end">
        {toastMsg.map((n) => (
          <Toast 
            key={n.id} 
            message={n.msg} 
            onClose={() => removeNotification(n.id)} 
          />
        ))}
      </div>
    </div>
    
  );
};

export default Pokedex;