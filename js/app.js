class App {
    constructor() {
        this.views = {};
        this.actions = {};
        this.initialize();
    }

    initialize() {
        this.actions.pokemon = new ApiActions(dispatcher, {
            API: CONFIG.APIs.POKEMON,
            ACTIONS: CONFIG.ACTIONS.POKEMON
        });
        this.actions.anime = new ApiActions(dispatcher, {
            API: CONFIG.APIs.ANIME,
            ACTIONS: CONFIG.ACTIONS.ANIME
        });
        this.actions.users = new ApiActions(dispatcher, {
            API: CONFIG.APIs.USERS,
            ACTIONS: CONFIG.ACTIONS.USERS
        });

        this.views.pokemon = new View('pokemon', pokemonStore, this.actions.pokemon);
        this.views.anime = new View('anime', animeStore, this.actions.anime);
        this.views.users = new View('users', usersStore, this.actions.users);

        this.loadInitialData();
    }

    loadInitialData() {
        setTimeout(() => {
            this.actions.pokemon.loadRandomPokemon();
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 