import React, { useState } from "react"; // Importamos React y useState desde la librería de React
import { translations } from "./translations.jsx"; // Importamos las traducciones de un archivo externo
import './PokemonAPI.css'; // Importamos el archivo de estilos CSS

export const PokemonAPI = () => {
  // Inicializamos el estado para el nombre de búsqueda, datos del pokemon, error, y el estado de carga.
  const [search, setSearch] = useState(""); // Almacena el valor que el usuario escribe para buscar un Pokémon
  const [pokemon, setPokemon] = useState(null); // Almacena los datos del Pokémon encontrado
  const [error, setError] = useState(""); // Almacena el mensaje de error si algo falla
  const [loading, setLoading] = useState(false); // Almacena el estado de carga para mostrar un mensaje mientras se cargan los datos

  // Función asincrónica para obtener la información del Pokémon desde la API
  const fetchPokemon = async (pokemonName) => {
    setLoading(true); // Indicamos que estamos cargando
    setError(""); // Limpiamos cualquier error previo

    try {
      // Realizamos una llamada a la API para obtener los datos del Pokémon (especie)
      const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}/`
      );
      if (!speciesResponse.ok) {
        throw new Error("Pokémon no encontrado. Intenta con otro nombre.");
      }
      const speciesData = await speciesResponse.json(); // Obtenemos los datos de la especie

      // Realizamos otra llamada a la API para obtener los datos del Pokémon (detalles del Pokémon)
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}/`
      );
      if (!response.ok) {
        throw new Error("Pokémon no encontrado. Intenta con otro nombre.");
      }
      const pokemonData = await response.json(); // Obtenemos los detalles del Pokémon

      // Traducimos el nombre y la descripción al español (si existe la traducción en la API)
      const nameInSpanish =
        speciesData.names.find((n) => n.language.name === "es")?.name ||
        pokemonName;
      const descriptionInSpanish =
        speciesData.flavor_text_entries
          .find((entry) => entry.language.name === "es")
          ?.flavor_text.replace(/\n/g, " ") || "Descripción no disponible.";

      // Convertimos los tipos y habilidades usando las traducciones proporcionadas
      const types = pokemonData.types
        .map((type) => translations.types[type.type.name] || type.type.name) // Usamos traducciones para los tipos de Pokémon
        .join(", ");
      const abilities = pokemonData.abilities
        .map(
          (ability) =>
            translations.abilities[ability.ability.name] ||
            ability.ability.name // Usamos traducciones para las habilidades de Pokémon
        )
        .join(", ");
      
      // Creamos un arreglo de estadísticas del Pokémon con su nombre y valor
      const stats = pokemonData.stats.map(
        (stat) =>
          `${translations.stats[stat.stat.name] || stat.stat.name}: ${
            stat.base_stat
          }`
      );

      // Convertimos el peso y la altura a las unidades correctas (kg y metros)
      const weightInKg = pokemonData.weight / 10; // Convertimos el peso a kilogramos (de hectogramos a kg)
      const heightInMeters = pokemonData.height / 10; // Convertimos la altura a metros (de decímetros a metros)

      // Actualizamos el estado con la información obtenida
      setPokemon({
        name: nameInSpanish,
        description: descriptionInSpanish,
        image: pokemonData.sprites.front_default, // Usamos la imagen por defecto del Pokémon
        types,
        abilities,
        stats,
        weight: weightInKg,
        height: heightInMeters,
      });
    } catch (error) {
      // Si ocurre un error durante la obtención de los datos, actualizamos el estado de error
      setError(error.message);
      setPokemon(null); // Limpiamos los datos del Pokémon
    } finally {
      setLoading(false); // Finalizamos el estado de carga
    }
  };

  // Función que maneja el envío del formulario de búsqueda
  const handleSearch = (e) => {
    e.preventDefault(); // Prevenimos que el formulario recargue la página
    if (search.trim() === "") { // Si no se ha introducido nada en el campo de búsqueda
      setError("Por favor, ingresa el nombre de un Pokémon.");
      setPokemon(null);
      return;
    }
    fetchPokemon(search); // Llamamos a la función que obtiene el Pokémon
  };

  return (
    <div className="pokemon-container"> {/* Contenedor principal del buscador */}
      <h1 className="pokemon-title">Buscador de Pokémon</h1> {/* Título principal */}
      <form onSubmit={handleSearch} className="pokemon-form"> {/* Formulario para la búsqueda */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Actualizamos el estado de búsqueda
          placeholder="Escribe el nombre del Pokémon"
          className="pokemon-input" // Clase de estilo para el input
        />
        <button type="submit" className="pokemon-button"> {/* Botón para enviar la búsqueda */}
          Buscar
        </button>
      </form>
      {loading && <p className="pokemon-loading">Cargando...</p>} {/* Mensaje de carga mientras se obtienen los datos */}
      {error && <p className="pokemon-error">{error}</p>} {/* Mensaje de error si ocurre un problema */}
      {pokemon && (  // Si hay datos del Pokémon, mostramos la información
        <div className="pokemon-card"> {/* Contenedor de la tarjeta del Pokémon */}
          <h2 className="pokemon-name">{pokemon.name.toUpperCase()}</h2> {/* Nombre del Pokémon */}
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="pokemon-image"  // Imagen del Pokémon
          />
          <p className="pokemon-description"><strong>Descripción:</strong> {pokemon.description}</p>
          <p className="pokemon-types"><strong>Tipos:</strong> {pokemon.types}</p>
          <p className="pokemon-abilities"><strong>Habilidades:</strong> {pokemon.abilities}</p>
          <p className="pokemon-stats"><strong>Estadísticas Base:</strong></p>
          <ul className="pokemon-list"> {/* Lista de estadísticas del Pokémon */}
            {pokemon.stats.map((stat, index) => (
              <li key={index}>{stat}</li> // Mostramos cada estadística en la lista
            ))}
          </ul>
          <p className="pokemon-stats"><strong>Peso:</strong> {pokemon.weight} kg</p> {/* Peso del Pokémon */}
          <p className="pokemon-stats"><strong>Altura:</strong> {pokemon.height} m</p> {/* Altura del Pokémon */}
        </div>
      )}
    </div>
  );
};