// Función que inicializa la página de inicio (index.html)
function initIndexPage() {
  if (window.location.pathname === "/index.html") {
    const pokemonContainer = document.getElementById("pokemon-container");
    const typeContainer = document.getElementById("type-container");

    let paginaActual: number = 0;

    // Carga inicial de Pokémon y tipos
    getPokemons(paginaActual);
    getTypes();

    // Eventos de paginación
    document.getElementById("siguiente")?.addEventListener("click", () => {
      paginaActual++;
      getPokemons(paginaActual);
    });
    document.getElementById("anterior")?.addEventListener("click", () => {
      if (paginaActual > 0) {
        paginaActual--;
        getPokemons(paginaActual);
      } else {
        console.error("No hay páginas anteriores.");
      }
    });
  }
}

// Función para obtener los tipos de Pokémon
async function getTypes() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type");
    const data = await response.json();
    const promises = data.results.map((type: { url: string }) =>
      fetch(type.url).then((res) => res.json())
    );
    const typeDetails = await Promise.all(promises);
    renderTypes(typeDetails);
  } catch (error) {
    console.error("❌ Error al obtener los tipos:", error);
  }
}

// Función para obtener los Pokémon
async function getPokemons(pagina: number) {
  try {
    const limite: number = 21;
    const offset = pagina * limite;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limite}`
    );
    const data = await response.json();
    const pokemonDetails = await Promise.all(
      data.results.map((pokemon: { url: string }) =>
        fetch(pokemon.url).then((res) => res.json())
      )
    );
    renderPokemons(pokemonDetails);
  } catch (error) {
    console.error("❌ Error al obtener los Pokémon:", error);
  }
}

// Función para renderizar Pokémon en la página
function renderPokemons(pokemonArray: any[]) {
  const pokemonContainer = document.getElementById("pokemon-container");
  if (!pokemonContainer) return;

  pokemonContainer.innerHTML = ""; // Limpiar contenedor

  pokemonArray.forEach((pokemon) => {
    if (!pokemon.sprites.front_default) return;

    const name = capitalize(pokemon.name);
    const div = document.createElement("div");
    div.classList.add("pokemon-carta");
    div.innerHTML = `
      <h3>${name}</h3>
      <img src="${pokemon.sprites.front_default}" alt="${name}">
      <p>${pokemon.id}</p>
    `;
    div.addEventListener("click", () => {
      window.location.href = `pagina_detalles.html?id=${pokemon.id}`;
    });

    pokemonContainer.appendChild(div);
  });
}

// Función para renderizar los tipos de Pokémon
function renderTypes(typeArray: any[]) {
  const typeContainer = document.getElementById("type-container");
  if (!typeContainer) return;

  typeArray.forEach((type) => {
    const div = document.createElement("div");
    div.classList.add("tipo-div");
    const name = capitalize(type.name);
    const color = type.color || "#ffffff"; // Color de fondo del tipo
    const spriteUrl =
      type.sprites?.["generation-viii"]?.["sword-shield"]?.["name_icon"] || "";
    if (!spriteUrl) {
      console.log(
        `El tipo ${type.name} no tiene imagen disponible, se omitirá.`
      );
      return; // Si no tiene imagen, no lo mostramos
    }
    div.innerHTML = `
      ${
        spriteUrl
          ? `<img src="${spriteUrl}" alt="${name}" />`
          : "Sin imagen disponible"
      }
    `;
    div.addEventListener("click", () => {
      filtradoTipo(type.name);
    });
    typeContainer.appendChild(div);
  });
}

// Función para filtrar Pokémon por tipo
async function filtradoTipo(tipo: string) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
    const data = await response.json();
    const pokemonList = data.pokemon.map((p: any) => p.pokemon);
    const pokemonDetails = await Promise.all(
      pokemonList.map((pokemon: { url: string }) =>
        fetch(pokemon.url).then((res) => res.json())
      )
    );
    renderPokemons(pokemonDetails);
  } catch (error) {
    console.error(`Error al filtrar los Pokémon de tipo ${tipo}:`, error);
  }
}

// Función para obtener y mostrar los detalles de un Pokémon
function initDetailPage() {
  if (window.location.pathname === "/pagina_detalles.html") {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get("id");

    if (pokemonId) {
      getPokemonDetails(pokemonId);
    } else {
      console.error("No se proporcionó un ID de Pokémon.");
    }
  }
}

// Función para obtener los detalles de un Pokémon
async function getPokemonDetails(pokemonId: string) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const pokemon = await response.json();
    renderPokemonDetails(pokemon);
  } catch (error) {
    console.error("❌ Error al obtener los detalles del Pokémon:", error);
  }
}

// Función para mostrar los detalles del Pokémon
function renderPokemonDetails(pokemon: any) {
  const pokemonDetailContainer = document.getElementById(
    "pokemon-detail-container"
  );
  if (!pokemonDetailContainer) return;

  const name = capitalize(pokemon.name);
  const sprite = pokemon.sprites.front_default;
  const types = pokemon.types
    .map((type: { type: { name: string } }) => type.type.name)
    .join(", ");
  const stats = pokemon.stats
    .map(
      (stat: { stat: { name: string }; base_stat: number }) =>
        `${stat.stat.name}: ${stat.base_stat}`
    )
    .join("<br>");

  pokemonDetailContainer.innerHTML = `
    <h2>${name}</h2>
    <img src="${sprite}" alt="${name}">
    <p class="types"><strong>Tipo(s):</strong> ${types}</p>
    <p class="stats"><strong>Estadísticas:</strong><br> ${stats}</p>
  `;
}

// Función auxiliar para capitalizar el nombre
function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Inicialización de las páginas
initIndexPage();
initDetailPage();
