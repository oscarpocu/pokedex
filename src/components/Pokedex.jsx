import React, { useState, useEffect, useRef } from 'react';
import Toast from './Toast';

const Pokedex = () => {
  const [pokemon, setPokemon] = useState(null);
  const [search, setSearch] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [allPokemon, setAllPokemon] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isShiny, setIsShiny] = useState(false);
  const [isDescription, setIsDescription] = useState(false);
  const [description, setDescription] = useState("");
  const audioRef = useRef(null);
  const [isStatsVisible, setIsStatsVisible] = useState(true);
  const [isHabilitiesVisible, setIsHabitiesVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' o 'abilities'
  const [selectedAbility, setSelectedAbility] = useState(null); // Para la descripción
  const [abilityDescription, setAbilityDescription] = useState(""); // El texto de la descripción
  const [species, setSpecies] = useState(null);

  const addNotification = (msg) => {
    const id = Date.now(); // ID único para cada mensaje
    setToastMsg((prev) => [...prev, { id, msg }]);

    const audio = new Audio('/error.mp3');
    audio.volume = 0.5; // Ajusta el volumen a tu gusto
    audio.play().catch(error => console.log("Audio play blocked by browser"));

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setToastMsg((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1025")
      .then(res => res.json())
      .then(data => setAllPokemon(data.results));
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);

    if (value.length >= 2) {
      const filtered = allPokemon
        .filter(p => p.name.includes(value))
        .slice(0, 5)
        .map(p => { 
          const id = p.url.split('/').filter(Boolean).pop(); 
          return {
            name: p.name,
            id: id
          };
        });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const fetchPokemon = async (idOrName) => {
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName.toString().toLowerCase()}`);
      const data = await res.json();
      setPokemon(data);
      setIsShiny(false);
      setSearch(data.id);

      // Si ya hay un audio sonando, lo paramos y lo reseteamos
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // Sonido de pokémon encontrado
      if (data.cries && data.cries.latest) {
        audioRef.current = new Audio(data.cries.latest);
        audioRef.current.volume = 0.25; // Bajito para que no asuste
        // Esperamos un pelín para que la imagen cargue antes de que grite
        audioRef.current.play().catch(() => console.log("Audio play blocked by browser"));
      }

      // Obtener descripción
      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();
      setSpecies(speciesData);
      const entry = speciesData.flavor_text_entries.find(
        (el) => el.language.name === "es"
      ) || speciesData.flavor_text_entries.find(
        (el) => el.language.name === "en"
      );
      setDescription(entry ? entry.flavor_text.replace(/[\n\f]/g, " ") : "DATA NOT FOUND");
      
      
    } catch (error) {
      setSuggestions([]);
      console.error("Pokemon no encontrado");
      addNotification("Pokemon not found! Please try another name or ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(1);
  }, []);

  const statsColor = (stat) => {
    if (stat >= 150) return "bg-blue-500";
    if (stat >= 100) return "bg-green-500";
    if (stat >= 75) return "bg-yellow-500";
    if (stat >= 50) return "bg-orange-500";
    return "bg-red-500";
  }

  const toggleShiny = () => {
    if (pokemon) {
      if (!isShiny) {
        const audio = new Audio('/shiny.mp3');
        audio.volume = 0.5; // Ajusta el volumen a tu gusto
        audio.play().catch(error => console.log("Audio play blocked by browser"));
      }
      setIsShiny(prev => !prev);
    }
  };

  const handleOptions = (id) => {
    setIsStatsVisible(false);
    setIsHabitiesVisible(false);
    if (id === 0) setActiveTab('stats');
    if (id === 1) setActiveTab('abilities');
    if (id === 2) setActiveTab('data');
    
  };

  const fetchAbilityDescription = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const entry = data.flavor_text_entries.find(el => el.language.name === "es") || 
                    data.flavor_text_entries.find(el => el.language.name === "en");
      setAbilityDescription(entry ? entry.flavor_text : "No description available");
    } catch (error) {
      setAbilityDescription("Error loading description");
    }
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
        <div className={`${isShiny ? 'bg-yellow-300' : 'bg-slate-300'} p-4 rounded-bl-[40px] rounded-tr-lg shadow-inner`}>
          <div className="relative bg-slate-900 h-48 rounded-lg border-2 border-slate-800 overflow-hidden flex items-center justify-center group">
            {/* Efecto de Rejilla/Scanner */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
            
            {loading ? (
              <div className="text-cyan-500 animate-pulse">SCANNING...</div>
            ) : (
              isDescription ? (
                <div className="absolute inset-0 bg-slate-900/90 text-cyan-400 p-4 text-xs overflow-y-auto">
                  {description}
                </div>
              ) : (
                <>
                {/* ICONO SHINY (SVG de las 3 estrellitas) */}
                {isShiny && (
                  <div className="absolute top-2 right-2 z-30 animate-pulse-slow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 2L9.63 7.63L15 9L9.63 11.37L7 17L4.37 11.37L0 9L4.37 7.63L7 2Z" fill="#FFD700" className="drop-shadow-[0_0_5px_#FFD700]"/>
                      <path d="M17 11L18.63 14.63L22 15L18.63 16.37L17 20L15.37 16.37L12 15L15.37 14.63L17 11Z" fill="#FFD700" className="drop-shadow-[0_0_3px_#FFD700]"/>
                      <path d="M19 3L19.82 5.18L22 6L19.82 6.82L19 9L18.18 6.82L16 6L18.18 5.18L19 3Z" fill="#FFD700" className="drop-shadow-[0_0_2px_#FFD700]"/>
                    </svg>
                  </div>
                )}
                <img 
                  src={isShiny 
                    ? pokemon?.sprites?.other['official-artwork']?.front_shiny
                    : pokemon?.sprites?.other['official-artwork']?.front_default
                  }
                  alt={pokemon?.name}
                  onClick={toggleShiny}
                  className="w-40 z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform duration-500"
                />
                </>
              )
            )}
          </div>
        </div>

        {/* Buscador y Controles */}
        <div className="mt-6 space-y-4">
          {/* Buscador con Sugerencias */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="TYPE NAME OR ID..."
              className="w-full bg-slate-900 border-b-2 border-cyan-500 p-2 text-cyan-400 placeholder-cyan-800 outline-none focus:bg-slate-800 transition-all"
              value={inputValue} // Vinculamos el valor al estado
              onChange={handleInputChange} // Actualizamos mientras escribes
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim() !== "") {
                  fetchPokemon(inputValue); // Busca lo que hay en el input
                  setInputValue(""); // Borra la lista de pokes al dar Enter
                }
              }}
            />
          
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-slate-900 border-x-2 border-b-2 border-cyan-500 z-50 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                {suggestions.map((p) => (
                  <div 
                    key={p.id}
                    className="p-2 text-cyan-400 hover:bg-cyan-950 cursor-pointer uppercase text-xs border-b border-cyan-900/30 last:border-none italic"
                    onClick={() => {
                      fetchPokemon(p.name);
                      setInputValue("");
                      setSuggestions([]);
                    }}
                  >
                    {"> "} {p.name}
                    <span className="text-[9px] bg-cyan-900/50 px-1 rounded text-cyan-200">#{p.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          
          <div className="flex justify-between items-center">
            {/* D-PAD */}
            <div className="grid grid-cols-3 gap-0">
              <div className="col-start-2 w-8 h-8 bg-slate-800 rounded-t cursor-pointer hover:bg-slate-700 active:scale-95 flex items-center justify-center" onClick={() => fetchPokemon(search + 10)}>▲</div>
              <div className="col-start-1 w-8 h-8 bg-slate-800 rounded-l cursor-pointer hover:bg-slate-700 active:scale-95 flex items-center justify-center" onClick={() => fetchPokemon(search - 1)}>{"◀\uFE0E"}</div>
              <div className="bg-slate-900 w-8 h-8"></div>
              <div className="w-8 h-8 bg-slate-800 rounded-r cursor-pointer hover:bg-slate-700 active:scale-95 flex items-center justify-center" onClick={() => fetchPokemon(search + 1)}>{"▶\uFE0E"}</div>
              <div className="col-start-2 w-8 h-8 bg-slate-800 rounded-b cursor-pointer hover:bg-slate-700 active:scale-95 flex items-center justify-center" onClick={() => fetchPokemon(search - 10)}>▼</div>
            </div>
            
            <div className="w-12 h-12 bg-black rounded-full cursor-pointer hover:bg-slate-700 border-4 border-slate-800 shadow-lg" onClick={() => setIsDescription(!isDescription)}></div>
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
            {/* Contenedor del nombre con scroll automático si no cabe */}
            <div className="flex items-baseline gap-2 overflow-x-auto pokedex-scroll whitespace-nowrap mb-4 border-b border-cyan-900/50 pb-2">
              <h2 className="text-cyan-500 text-xl font-bold uppercase tracking-widest shrink-0">
                {pokemon.name} 
              </h2>
              <span className="text-xs text-cyan-800 shrink-0 italic">
                #{pokemon.id.toString().padStart(4, '0')}
              </span>
            </div>

            <div className="space-y-2 text-[10px] text-cyan-400">
              {activeTab === 'stats' && (
                pokemon?.stats?.map(s => (
                  <div key={s.stat.name} className="flex flex-col">
                    <div className="flex justify-between mb-1 uppercase">
                      <span>{s.stat.name}</span>
                      <span>{s.base_stat}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-cyan-900/30">
                      <div 
                        className={`${statsColor(s.base_stat)} h-full shadow-[0_0_8px_#22d3ee] transition-all duration-1000`}
                        style={{ width: `${(s.base_stat / 255) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
              {activeTab === 'abilities' && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-cyan-600 font-bold border-b border-cyan-900/30 pb-1 italic">HABILIDADES:</h3>
                  {pokemon?.abilities?.map(a => (
                    <div key={a.ability.name} className="flex flex-col">
                      <button 
                        onClick={() => {
                          setSelectedAbility(a.ability.name);
                          fetchAbilityDescription(a.ability.url);
                        }}
                        className={`text-left uppercase p-1 rounded transition-colors ${selectedAbility === a.ability.name ? 'bg-cyan-900 text-white' : 'hover:bg-cyan-950 text-cyan-400'}`}
                      >
                        {a.is_hidden && <span className="text-[8px] text-red-500 mr-1">[H]</span>}
                        {a.ability.name.replace("-", " ")}
                      </button>
                      
                      {/* Descripción desplegable si está seleccionada */}
                      {selectedAbility === a.ability.name && (
                        <div className="p-2 mt-1 bg-black/40 rounded border border-cyan-900/50 text-[9px] leading-tight text-cyan-200 animate-in fade-in slide-in-from-top-1">
                          {abilityDescription || "Cargando..."}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'data' && species && (
                <div className="flex flex-col gap-3 animate-in fade-in duration-500">
                  <h3 className="text-cyan-600 font-bold border-b border-cyan-900/30 pb-1 italic">POKÉDEX DATA:</h3>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[10px]">
                    
                    {/* TIPOS */}
                    <div className="flex flex-col gap-1">
                      <span className="text-cyan-800 uppercase font-bold">Types</span>
                      <div className="flex gap-1">
                        {pokemon.types.map(t => (
                          <span key={t.type.name} className="px-2 py-0.5 bg-cyan-900/30 border border-cyan-700/50 rounded text-cyan-300 uppercase text-[8px]">
                            {t.type.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* MEDIDAS */}
                    <div className="flex flex-col gap-1">
                      <span className="text-cyan-800 uppercase font-bold">Height / Weight</span>
                      <span className="text-cyan-400 font-mono">{pokemon.height / 10}m / {pokemon.weight / 10}kg</span>
                    </div>

                    {/* GÉNERO DINÁMICO */}
                    <div className="flex flex-col gap-1">
                      <span className="text-cyan-800 uppercase font-bold">Gender Ratio</span>
                      {species.gender_rate === -1 ? (
                        <span className="text-slate-500">Genderless</span>
                      ) : (
                        <div className="flex gap-2">
                          <span className="text-blue-400">♂ {(8 - species.gender_rate) * 12.5}%</span>
                          <span className="text-pink-400">♀ {species.gender_rate * 12.5}%</span>
                        </div>
                      )}
                    </div>

                    {/* GRUPOS HUEVO DINÁMICOS */}
                    <div className="flex flex-col gap-1">
                      <span className="text-cyan-800 uppercase font-bold">Egg Groups</span>
                      <div className="flex flex-wrap gap-1">
                        {species?.egg_groups?.map(group => (
                          <span key={group.name} className="text-cyan-400 uppercase italic">
                            {group.name}{" "}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ESPECIE (Categoría) */}
                    <div className="flex flex-col gap-1 col-span-2">
                      <span className="text-cyan-800 uppercase font-bold">Category</span>
                      <span className="text-cyan-300 italic">
                        {species?.genera?.find(g => g.language.name === "es")?.genus || 
                        species?.genera?.find(g => g.language.name === "en")?.genus}
                      </span>
                    </div>

                  </div>

                  
                </div>
              )}
            </div>
          </div>

        {/* Botonera inferior decorativa */}
        <div className="grid grid-cols-5 gap-1 mt-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-6 bg-slate-900 rounded border cursor-pointer hover:bg-slate-700 border-red-800 shadow-inner" onClick={() => handleOptions(i)}></div>
          ))}
        </div>

        <div className="flex justify-between items-end">
            <div className="w-16 h-4 bg-slate-900 rounded-full border border-red-900"></div>
            <div className="text-right">
                <div className="text-[10px] text-red-200">SYSTEM VERSION</div>
                <div className="text-xs font-bold text-white uppercase italic">Ultra-Dex v.1.0</div>
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