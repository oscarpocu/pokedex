import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState("pikachu");
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(false);
  // para el desplegable de pokemons, guardar el pokemon para pintar el fondo del color del pokemon
  const pokemonColors = {
    pikachu: 'yellow',
    bulbasaur: 'green',
    charmander: 'red',
    squirtle: 'blue'
  };

  // Gestionar el fondo dinámico basado en el pokemon seleccionado
  const [backgroundColor, setBackgroundColor] = useState(pokemonColors["pikachu"]);



  useEffect(() => {
    // Cargar un pokemon por defecto al iniciar la aplicación
    const loadDefaultPokemon = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/pokemon/bulbasaur/`);
        setPokemonData(response.data);
      } catch (err) {
        setError(true);
      }
    };

    loadDefaultPokemon();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/pokemon/${searchTerm}/`);
      setPokemonData(response.data);
    } catch (err) {
      setPokemonData(null);
      setError(true);
    }
  };

  const handleSelectChange = (e) => {
    setSearchTerm(e.target.value);
    setBackgroundColor(pokemonColors[e.target.value] || 'white');
  };


  return (
    <div className="main-container">
      <header>
        <h1>POKÉDEX</h1>
        <img src="/pokedex-image.png" className="image" style={{ width: '100px' }} alt="Pokedex" />
      </header>

      <main>
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search Your Pokemon..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="results">
          {/* Caso: Error 404 */}
          {error && (
            <div>
              <h2>Pokemon no encontrado, trata de regresar a <a href="/">home.</a></h2>
            </div>
          )}

          {/* Caso: Pokémon Encontrado (Tus estadísticas originales) */}
          {pokemonData ? (
            <div className="info">
              <h2>Number: {pokemonData.number}</h2>
              <h2>Name: {pokemonData.name}</h2>
              <h2>Height: {pokemonData.height}</h2>
              <h2>Weight: {pokemonData.weight}</h2>
              <h2>Default sprite:</h2>
              <img src={pokemonData.sprite} alt={pokemonData.name} style={{ width: '70px' }} />
              <h2>HP: {pokemonData.hp}</h2>
              <h2>Attack: {pokemonData.attack}</h2>
              <h2>Defense: {pokemonData.defense}</h2>
              <h2>Special Attack: {pokemonData.special_attack}</h2>
              <h2>Special Defense: {pokemonData.special_defense}</h2>
              <h2>Speed: {pokemonData.speed}</h2>
              <h2>Type: {pokemonData.type}</h2>
              <h2>Ability: {pokemonData.ability}</h2>
              <h2>Base Experience: {pokemonData.base_experience}</h2>
            </div>
          ) : (
            !error && <h2>Escribe el nombre o ID de tu pokemon.</h2>
          )}
        </div>
      </main>
      <div>
        <h3>Pokemons Disponibles:</h3>
        <select onChange={handleSelectChange} value={searchTerm}>
          <option value="pikachu">Pikachu</option>
          <option value="bulbasaur">Bulbasaur</option>
          <option value="charmander">Charmander</option>
          <option value="squirtle">Squirtle</option>
        </select>
        <div style={{ backgroundColor: backgroundColor, padding: '10px' }}>
          <p>Selecciona un pokemon para ver su información.</p>
        </div>

      </div>
    </div>
  );
}

export default App;