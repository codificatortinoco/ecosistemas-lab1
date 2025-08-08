class App {
    constructor() {
        this.views = {};
        this.actions = {};
        this.initialize();
    }

    initialize() {
        this.createActions();
        this.createViews();
        this.loadInitialData();
    }

    createActions() {
        const modules = ['pokemon', 'anime', 'users', 'jokes'];
        modules.forEach(module => {
            this.actions[module] = new ApiActions(dispatcher, {
                API: CONFIG.APIs[module.toUpperCase()],
                ACTIONS: CONFIG.ACTIONS[module.toUpperCase()]
            });
        });
    }

    createViews() {
        const stores = { pokemon: pokemonStore, anime: animeStore, users: usersStore, jokes: jokesStore };
        Object.entries(stores).forEach(([module, store]) => {
            this.views[module] = new View(module, store, this.actions[module]);
        });
    }

    loadInitialData() {
        setTimeout(() => {
            this.actions.pokemon.loadMultipleRandomPokemon(5);
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 