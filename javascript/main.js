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
// Obtengo el contenedor del HTML
const pokemonContainer = document.getElementById("pokemon-container");
const typeContainer = document.getElementById("type-container");
// Verifico si el contenedor existe para evitar errores
if (!pokemonContainer) {
    console.error("No se encontró el contenedor en el HTML.");
}
else {
    // Llamo a la función principal
    getPokemons();
}
if (!typeContainer) {
    console.error("No se encontro el contenedor en el HTML.");
}
else {
    getTypes();
}
function getTypes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const respuesta = yield fetch("https://pokeapi.co/api/v2/type");
            const data = yield respuesta.json();
            const dataList = data.results;
            const promises = dataList.map((type) => __awaiter(this, void 0, void 0, function* () {
                const res = yield fetch(type.url);
                const data = yield res.json();
                console.log(`Cargando ${data.name}`);
                return data;
            }));
            const typeDetalles = yield Promise.all(promises);
            renderType(typeDetalles);
        }
        catch (error) {
            console.error("❌ Error al obtener los tipos:", error);
        }
    });
}
// Función async para obtener los Pokémon
function getPokemons() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const respuesta = yield fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20");
            const data = yield respuesta.json();
            const pokemonList = data.results;
            // Obtengo detalles de cada Pokémon
            const promises = pokemonList.map((pokemon) => __awaiter(this, void 0, void 0, function* () {
                const res = yield fetch(pokemon.url);
                const data = yield res.json();
                console.log(`📥 Cargando: ${data.name}`);
                return data;
            }));
            const pokemonDetalles = yield Promise.all(promises);
            // Renderizo los Pokémon en la página
            renderPokemon(pokemonDetalles);
        }
        catch (error) {
            console.error("❌ Error al obtener los Pokémon:", error);
        }
    });
}
// Función para mostrar los Pokémon en la página
function renderPokemon(pokemonArray) {
    if (!pokemonContainer)
        return; // Evita errores si no hay contenedor
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
function renderType(typeArray) {
    typeArray.forEach((type) => {
        var _a, _b, _c;
        const button = document.createElement("div");
        button.classList.add("tipo-div");
        const name = type.name.charAt(0).toUpperCase() + type.name.slice(1);
        const color = type.color; // Color del tipo
        // Logo del tipo (o puedes usar otro sprite)
        button.style.backgroundColor = color;
        const spriteUrl = ((_c = (_b = (_a = type.sprites) === null || _a === void 0 ? void 0 : _a["generation-viii"]) === null || _b === void 0 ? void 0 : _b["sword-shield"]) === null || _c === void 0 ? void 0 : _c["name_icon"]) || ""; // URL del sprite
        if (!spriteUrl) {
            console.log(`El tipo ${type.name} no tiene sprite disponible, se omitirá.`);
            return; // Si no tiene sprite, no lo mostramos
        }
        console.log(type);
        button.innerHTML = `
    ${spriteUrl ? `<img src="${spriteUrl}" alt="${name}" />` : "Sin imagen disponible"}
        `;
        typeContainer === null || typeContainer === void 0 ? void 0 : typeContainer.appendChild(button);
    });
}
