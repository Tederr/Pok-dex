let pokemonList = [];
let pokemonListData = [];
const listElement = document.getElementById("pokemonList");
class Pokemon {
    number;
    name;
    type;
    types = [];
    photo;
}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other['official-artwork'].front_default

    return pokemon
}

async function getPokemonDetail(pokemon) {
    let response = await fetch(pokemon.url);
    let data = await response.json();
    const pokemonFormat = convertPokeApiDetailToPokemon(data);
    loadPokemonItens(pokemonFormat);
}

function convertPokemonToLi(pokemon) {
    return `
        <button type="button">
            <li class="pokemon ${pokemon.type}">
                <span id="pokemonId" class="number">#${pokemon.number}</span>
                <span id="pokemonName" class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">    
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
            </li>
        </button>
    `
}


function loadPokemonItens(toLI) {
    const newHtml = convertPokemonToLi(toLI);
    listElement.innerHTML += newHtml;
    listElement.addEventListener('click', (event) => {
        const pokemon = event.target.closest('button').querySelector('#pokemonName').textContent;
        window.location.href = `detalhesPokemon.html?id=${pokemon}`;
    })
}
    

async function fetchPokemon() {
    try {
        let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
        let data = await response.json();
        pokemonList = data.results;
    } catch (error) {
        console.error("Erro ao buscar Pokémon", error);
    }
}

function filterPokemon() {

    if (listElement.length !== 0) {
        listElement.innerHTML = '';
    }

    let searchTerm = document.getElementById("inputPokemon").value.toLowerCase();
    let filtered = pokemonList.filter(name => name.name.toLowerCase().includes(searchTerm));
    
    filtered.forEach(pokemon => {
       getPokemonDetail(pokemon);
    });
    
}

fetchPokemon()