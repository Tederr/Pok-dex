async function fetchPokemonData(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    return data;
}

// Função para exibir os detalhes do Pokémon
const backgraudColor = document.querySelector('.content-details');
function convertType(pokemon) {
    backgraudColor.classList.add(pokemon.types[0].type.name);
    return `${pokemon.types.map((type) => `<li class="type-details ${type.type.name}">${type.type.name}</li>`).join('')}`;
}

const types = document.getElementById('pokemon-types');
function displayPokemonDetails(pokemon) {
    document.getElementById('pokemon-name').textContent = pokemon.name;
    document.getElementById('pokemon-id').textContent = `#${pokemon.id}`;
    types.innerHTML = convertType(pokemon);

    document.getElementById('pokemon-image').src = pokemon.sprites.other['official-artwork'].front_default;
    document.getElementById('pokemon-height').textContent = `Altura: ${pokemon.height / 10}m`;
    // document.getElementById('pokemon-weight').textContent = `Peso: ${pokemon.weight / 10}kg`;
}

// Função principal para carregar os detalhes do Pokémon
async function loadPokemonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');

    if (pokemonId) {
        const pokemon = await fetchPokemonData(pokemonId);
        displayPokemonDetails(pokemon);
    } else {
        alert('Pokémon não encontrado!');
    }
}

// Carrega os detalhes do Pokémon quando a página é carregada
loadPokemonDetails();