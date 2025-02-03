const types = document.getElementById('pokemon-types');
const backgraudColor = document.querySelector('.content-details');

async function fetchPokemonData(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    return data;
}

// Função para exibir os detalhes do Pokémon

function formatId(pokemonId){
    if(pokemonId < 10){
        return `#00${pokemonId}`
    }else if(pokemonId < 100){
        return `#0${pokemonId}`
    }else{
        return `#${pokemonId}`
    }
}

function convertMeters(Altura) {
    const height = Altura / 10;
    return `${height}m`;
}

function convertKg(peso) {
    const weight = peso / 10;
    return `${weight}kg`;
}

function convertType(pokemon) {
    backgraudColor.classList.add(pokemon.types[0].type.name);
    return `${pokemon.types.map((type) => `<li class="type-details ${type.type.name}">${type.type.name}</li>`).join('')}`;
}

function displayPokemonDetails(pokemon) {
    document.getElementById('pokemon-name').textContent = pokemon.name;
    document.getElementById('pokemon-id').textContent = `${formatId(pokemon.id)}`;
    types.innerHTML = convertType(pokemon);
    document.getElementById('pokemon-image').src = pokemon.sprites.other['official-artwork'].front_default;

    document.getElementById('pokemon-height').textContent = `${convertMeters(pokemon.height)}`;
    document.getElementById('pokemon-weight').textContent = `${convertKg(pokemon.weight)}`;
    document.getElementById('pokemon-abilities').textContent = `${pokemon.abilities.map((ability) => ability.ability.name).join(', ')}`;

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