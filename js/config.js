const CONFIG = {
    APIs: {
        POKEMON: {
            base: 'https://pokeapi.co/api/v2',
            endpoints: {
                pokemon: '/pokemon'
            }
        },
        ANIME: {
            base: 'https://api.jikan.moe/v4',
            endpoints: {
                search: '/anime'
            }
        },
        USERS: {
            base: 'https://randomuser.me/api',
            endpoints: {
                users: '/'
            }
        }
    },

    UI: {
        defaultLimit: 5,
        maxLimit: 50,
        animationDuration: 300,
        spinnerSize: 40,
        userChunkSize: 5
    },

    POKEMON_TYPES: {
        normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
        grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
        ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
        rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
        steel: '#B8B8D0', fairy: '#EE99AC'
    },

    ACTIONS: {
        POKEMON: {
            SEARCH: 'POKEMON_SEARCH',
            RANDOM: 'POKEMON_RANDOM',
            LOADING: 'POKEMON_LOADING',
            SUCCESS: 'POKEMON_SUCCESS',
            ERROR: 'POKEMON_ERROR',
            EMPTY: 'POKEMON_EMPTY'
        },
        ANIME: {
            SEARCH: 'ANIME_SEARCH',
            LOADING: 'ANIME_LOADING',
            SUCCESS: 'ANIME_SUCCESS',
            ERROR: 'ANIME_ERROR',
            EMPTY: 'ANIME_EMPTY'
        },
        USERS: {
            LOAD: 'USERS_LOAD',
            SINGLE: 'USERS_SINGLE',
            LOADING: 'USERS_LOADING',
            SUCCESS: 'USERS_SUCCESS',
            ERROR: 'USERS_ERROR',
            EMPTY: 'USERS_EMPTY'
        }
    }
}; 