"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Función que inicializa la página de inicio (index.html)
function initIndexPage() {
    var _a, _b;
    if (window.location.pathname === "/index.html") {
        const pokemonContainer = document.getElementById("pokemon-container");
        const typeContainer = document.getElementById("type-container");
        let paginaActual = 0;
        // Carga inicial de Pokémon y tipos
        getPokemons(paginaActual);
        getTypes();
        // Eventos de paginación
        (_a = document.getElementById("siguiente")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            paginaActual++;
            getPokemons(paginaActual);
        });
        (_b = document.getElementById("anterior")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            if (paginaActual > 0) {
                paginaActual--;
                getPokemons(paginaActual);
            }
            else {
                console.error("No hay páginas anteriores.");
            }
        });
    }
}
// Función para obtener los tipos de Pokémon
function getTypes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://pokeapi.co/api/v2/type");
            const data = yield response.json();
            const promises = data.results.map((type) => fetch(type.url).then((res) => res.json()));
            const typeDetails = yield Promise.all(promises);
            renderTypes(typeDetails);
        }
        catch (error) {
            console.error("❌ Error al obtener los tipos:", error);
        }
    });
}
// Función para obtener los Pokémon
function getPokemons(pagina) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const limite = 21;
            const offset = pagina * limite;
            const response = yield fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limite}`);
            const data = yield response.json();
            const pokemonDetails = yield Promise.all(data.results.map((pokemon) => fetch(pokemon.url).then((res) => res.json())));
            renderPokemons(pokemonDetails);
        }
        catch (error) {
            console.error("❌ Error al obtener los Pokémon:", error);
        }
    });
}
// Función para renderizar Pokémon en la página
function renderPokemons(pokemonArray) {
    const pokemonContainer = document.getElementById("pokemon-container");
    if (!pokemonContainer)
        return;
    pokemonContainer.innerHTML = ""; // Limpiar contenedor
    pokemonArray.forEach((pokemon) => {
        if (!pokemon.sprites.front_default)
            return;
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
function renderTypes(typeArray) {
    const typeContainer = document.getElementById("type-container");
    if (!typeContainer)
        return;
    typeArray.forEach((type) => {
        var _a, _b, _c;
        const div = document.createElement("div");
        div.classList.add("tipo-div");
        const name = capitalize(type.name);
        const color = type.color || "#ffffff"; // Color de fondo del tipo
        const spriteUrl = ((_c = (_b = (_a = type.sprites) === null || _a === void 0 ? void 0 : _a["generation-viii"]) === null || _b === void 0 ? void 0 : _b["sword-shield"]) === null || _c === void 0 ? void 0 : _c["name_icon"]) || "";
        if (!spriteUrl) {
            console.log(`El tipo ${type.name} no tiene imagen disponible, se omitirá.`);
            return; // Si no tiene imagen, no lo mostramos
        }
        div.innerHTML = `
      ${spriteUrl
            ? `<img src="${spriteUrl}" alt="${name}" />`
            : "Sin imagen disponible"}
    `;
        div.addEventListener("click", () => {
            filtradoTipo(type.name);
        });
        typeContainer.appendChild(div);
    });
}
// Función para filtrar Pokémon por tipo
function filtradoTipo(tipo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
            const data = yield response.json();
            const pokemonList = data.pokemon.map((p) => p.pokemon);
            const pokemonDetails = yield Promise.all(pokemonList.map((pokemon) => fetch(pokemon.url).then((res) => res.json())));
            renderPokemons(pokemonDetails);
        }
        catch (error) {
            console.error(`Error al filtrar los Pokémon de tipo ${tipo}:`, error);
        }
    });
}
// Función para obtener y mostrar los detalles de un Pokémon
function initDetailPage() {
    if (window.location.pathname === "/pagina_detalles.html") {
        const urlParams = new URLSearchParams(window.location.search);
        const pokemonId = urlParams.get("id");
        if (pokemonId) {
            getPokemonDetails(pokemonId);
        }
        else {
            console.error("No se proporcionó un ID de Pokémon.");
        }
    }
}
// Función para obtener los detalles de un Pokémon
function getPokemonDetails(pokemonId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const pokemon = yield response.json();
            renderPokemonDetails(pokemon);
        }
        catch (error) {
            console.error("❌ Error al obtener los detalles del Pokémon:", error);
        }
    });
}
// Función para mostrar los detalles del Pokémon
function renderPokemonDetails(pokemon) {
    const pokemonDetailContainer = document.getElementById("pokemon-detail-container");
    if (!pokemonDetailContainer)
        return;
    const name = capitalize(pokemon.name);
    const sprite = pokemon.sprites.front_default;
    const types = pokemon.types
        .map((type) => type.type.name)
        .join(", ");
    const stats = pokemon.stats
        .map((stat) => `${stat.stat.name}: ${stat.base_stat}`)
        .join("<br>");
    pokemonDetailContainer.innerHTML = `
    <h2>${name}</h2>
    <img src="${sprite}" alt="${name}">
    <p class="types"><strong>Tipo(s):</strong> ${types}</p>
    <p class="stats"><strong>Estadísticas:</strong><br> ${stats}</p>
  `;
}
// Función auxiliar para capitalizar el nombre
function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
// Inicialización de las páginas
initIndexPage();
initDetailPage();
