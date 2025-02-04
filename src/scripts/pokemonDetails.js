const types = document.getElementById('pokemon-types');
const backgraudColor = document.querySelector('.content-details');

async function fetchPokemonData(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    return data;
}

// Função para exibir os detalhes do Pokémon

function formatId(pokemonId) {
    if (pokemonId < 10) {
        return `#00${pokemonId}`
    } else if (pokemonId < 100) {
        return `#0${pokemonId}`
    } else {
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
    return `${pokemon.types.map((type) => `<li class="type-details-name ${type.type.name}">${type.type.name}</li>`).join('')}`;
}

function status(stats) {
    let conta = 0
    stats.map((stats) =>
        conta += stats.base_stat
    );
    return conta
}

async function getEvolutions(pokemon) {
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
    const speciesData = await speciesResponse.json();

    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();

    const evolutions = [];
    let currentEvolution = evolutionData.chain;

    while (currentEvolution) {
        const pokemonName = currentEvolution.species.name;
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
        const pokemonData = await pokemonResponse.json();
        evolutions.push(pokemonData);

        currentEvolution = currentEvolution.evolves_to[0];
    }

    const evolutionsContainer = document.getElementById("evolutions");
    evolutionsContainer.innerHTML = "";

    evolutions.forEach(pokemon => {
        const card = document.createElement("div");
        card.className = "pokemon-card";

        const name = document.createElement("span");
        name.className = `name-evolutions seta-${pokemon.types[0].type.name}`;
        name.textContent = pokemon.name;

        const image = document.createElement("img");
        image.className = "image-evolutions";
        image.src = pokemon.sprites.front_default;
        image.alt = pokemon.name;

        const seta = document.createElement("i");
        seta.className = `fa-solid fa-right-long seta-${pokemon.types[0].type.name}`;
        

        card.appendChild(name);
        card.appendChild(image);
        card.appendChild(seta);
        evolutionsContainer.appendChild(card);
    });

}

function displayPokemonDetails(pokemon) {
    document.getElementById('pokemon-name').textContent = pokemon.name;
    document.getElementById('pokemon-id').textContent = `${formatId(pokemon.id)}`;
    types.innerHTML = convertType(pokemon);
    document.getElementById('pokemon-image').src = pokemon.sprites.other['official-artwork'].front_default;

    document.getElementById('pokemon-height').textContent = `${convertMeters(pokemon.height)}`;
    document.getElementById('pokemon-weight').textContent = `${convertKg(pokemon.weight)}`;
    document.getElementById('pokemon-abilities').textContent = `${pokemon.abilities.map((ability) => ability.ability.name).join(', ')}`;

    document.getElementById('pokemon-hp').textContent = pokemon.stats[0].base_stat;
    document.getElementById('pokemon-attack').textContent = pokemon.stats[1].base_stat;
    document.getElementById('pokemon-defense').textContent = pokemon.stats[2].base_stat;
    document.getElementById('pokemon-sp-attack').textContent = pokemon.stats[3].base_stat;
    document.getElementById('pokemon-sp-defense').textContent = pokemon.stats[4].base_stat;
    document.getElementById('pokemon-speed').textContent = pokemon.stats[5].base_stat;
    document.getElementById('pokemon-total').textContent = status(pokemon.stats);
    document.getElementById('pokemon-moves').textContent = pokemon.moves.map((move) => move.move.name).join(', ');

}

// Função principal para carregar os detalhes do Pokémon
async function loadPokemonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');

    if (pokemonId) {
        const pokemon = await fetchPokemonData(pokemonId);
        displayPokemonDetails(pokemon);
        getEvolutions(pokemon);
    } else {
        alert('Pokémon não encontrado!');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".nav-button");
    const contents = document.querySelectorAll(".content");
    let currentIndex = 0; // Índice do conteúdo atual

    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const target = button.getAttribute("data-target");
            const targetContent = document.getElementById(target);

            // Determina a direção da animação
            const targetIndex = Array.from(contents).indexOf(targetContent);
            if (targetIndex > currentIndex) {
                targetContent.classList.add("slide-right");
            } else {
                targetContent.classList.add("slide-left");
            }

            // Oculta o conteúdo atual
            contents[currentIndex].classList.remove("active");
            contents[currentIndex].classList.add(
                targetIndex > currentIndex ? "slide-left" : "slide-right"
            );

            // Exibe o novo conteúdo
            setTimeout(() => {
                contents[currentIndex].classList.remove("slide-left", "slide-right");
                targetContent.classList.remove("slide-left", "slide-right");
                targetContent.classList.add("active");
            }, 10); // Pequeno delay para garantir a transição

            // Atualiza o índice atual
            currentIndex = targetIndex;
        });
    });

    // Exibe o primeiro conteúdo por padrão
    contents[currentIndex].classList.add("active");
});

loadPokemonDetails()