// Obtengo el contenedor del HTML
const pokemonContainer = document.getElementById("pokemon-container");
const typeContainer = document.getElementById("type-container");

// Verifico si el contenedor existe para evitar errores
if (!pokemonContainer) {
  console.error("No se encontró el contenedor en el HTML.");
} else {
  // Llamo a la función principal
  getPokemons();
}

if (!typeContainer) {
  console.error("No se encontro el contenedor en el HTML.");
} else {
  getTypes();
}

async function getTypes() {
  try {
    const respuesta = await fetch("https://pokeapi.co/api/v2/type");
    const data = await respuesta.json();

    const dataList = data.results;
    const promises = dataList.map(async (type: { url: RequestInfo | URL; }) => {
      const res = await fetch(type.url);
      const data = await res.json();
      console.log(`Cargando ${data.name}`);
      return data;
    });

    const typeDetalles = await Promise.all(promises);

    renderType(typeDetalles);
  } catch (error) {
    console.error("❌ Error al obtener los tipos:", error);
  }
}
// Función async para obtener los Pokémon
async function getPokemons() {
  try {
    const respuesta = await fetch(
      "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"
    );
    const data = await respuesta.json();

    const pokemonList = data.results;

    // Obtengo detalles de cada Pokémon
    const promises = pokemonList.map(
      async (pokemon: { url: RequestInfo | URL }) => {
        const res = await fetch(pokemon.url);
        const data = await res.json();
        console.log(`📥 Cargando: ${data.name}`);
        return data;
      }
    );

    const pokemonDetalles = await Promise.all(promises);

    // Renderizo los Pokémon en la página
    renderPokemon(pokemonDetalles);
  } catch (error) {
    console.error("❌ Error al obtener los Pokémon:", error);
  }
}

// Función para mostrar los Pokémon en la página
function renderPokemon(pokemonArray: any[]) {
  if (!pokemonContainer) return; // Evita errores si no hay contenedor

  pokemonContainer.innerHTML = ""; // Limpio el contenedor antes de agregar nuevos Pokémon

  pokemonArray.forEach((pokemon) => {
    const div = document.createElement("div");
    div.classList.add("pokemon-carta");
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    div.innerHTML = `
      <h3>${name}</h3>
      <img src="${pokemon.sprites.front_default}" alt="${name}">
      <p>${pokemon.id}</p>
    `;

    pokemonContainer.appendChild(div);
  });
}
// Función para mostrar los tipos
function renderType(typeArray: any[]) {
  typeArray.forEach((type) => {
    const button = document.createElement("div");
    button.classList.add("tipo-div");
    const name = type.name.charAt(0).toUpperCase() + type.name.slice(1);
    const color = type.color;  // Color del tipo
     // Logo del tipo (o puedes usar otro sprite)
    button.style.backgroundColor = color;
    const spriteUrl = type.sprites?.["generation-viii"]?.["sword-shield"]?.["name_icon"] || "";  // URL del sprite
    if (!spriteUrl) {
        console.log(`El tipo ${type.name} no tiene sprite disponible, se omitirá.`);
        return;  // Si no tiene sprite, no lo mostramos
      }
    console.log(type);
    button.innerHTML = `
    ${spriteUrl ? `<img src="${spriteUrl}" alt="${name}" />` : "Sin imagen disponible"}
        `;
    typeContainer?.appendChild(button);
  });
}
