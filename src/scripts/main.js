

const offset = 0;
const limit = 10;
const URL = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;


fetch(URL).then(function (response) {
    console.log(response);
});