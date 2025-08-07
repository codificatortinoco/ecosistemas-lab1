class ApiActions {
    constructor(dispatcher, config) {
        this.dispatcher = dispatcher;
        this.config = config;
    }

    dispatch(action) {
        this.dispatcher.dispatch(action);
    }

    async fetchData({ url, loadingType, successType, errorType, emptyType, processData }) {
        this.dispatch({ type: loadingType });
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Request failed');
            const data = await response.json();
            const result = processData ? processData(data) : data;
            if (Array.isArray(result) && result.length === 0) {
                this.dispatch({ type: emptyType });
            } else {
                this.dispatch({ type: successType, payload: result });
            }
        } catch (error) {
            this.dispatch({ type: errorType, payload: error.message });
        }
    }

    // Pokemon
    async searchPokemon(searchTerm) {
        if (!searchTerm.trim()) {
            this.dispatch({ type: this.config.ACTIONS.EMPTY });
            return;
        }
        const url = `${this.config.API.base}${this.config.API.endpoints.pokemon}/${searchTerm.toLowerCase()}`;
        await this.fetchData({
            url,
            loadingType: this.config.ACTIONS.LOADING,
            successType: this.config.ACTIONS.SUCCESS,
            errorType: this.config.ACTIONS.ERROR,
            emptyType: this.config.ACTIONS.EMPTY,
            processData: (pokemon) => [pokemon],
        });
    }
    
    async loadRandomPokemon() {
        const randomId = Math.floor(Math.random() * 151) + 1;
        const url = `${this.config.API.base}${this.config.API.endpoints.pokemon}/${randomId}`;
        await this.fetchData({
            url,
            loadingType: this.config.ACTIONS.LOADING,
            successType: this.config.ACTIONS.SUCCESS,
            errorType: this.config.ACTIONS.ERROR,
            emptyType: this.config.ACTIONS.EMPTY,
            processData: (pokemon) => [pokemon],
        });
    }

    async loadMultipleRandomPokemon(count = 5) {
        this.dispatch({ type: this.config.ACTIONS.LOADING });
        
        try {
            const pokemonPromises = [];
            const usedIds = new Set();
            
            // Generate unique random IDs
            for (let i = 0; i < count; i++) {
                let randomId;
                do {
                    randomId = Math.floor(Math.random() * 151) + 1;
                } while (usedIds.has(randomId));
                usedIds.add(randomId);
                
                const url = `${this.config.API.base}${this.config.API.endpoints.pokemon}/${randomId}`;
                pokemonPromises.push(fetch(url).then(res => res.json()));
            }
            
            const pokemonList = await Promise.all(pokemonPromises);
            this.dispatch({
                type: this.config.ACTIONS.SUCCESS,
                payload: pokemonList
            });
        } catch (error) {
            this.dispatch({
                type: this.config.ACTIONS.ERROR,
                payload: error.message
            });
        }
    }

    // Anime
    async searchAnime(searchTerm, filter = '', limit = 10) {
        if (!searchTerm.trim()) {
            this.dispatch({ type: this.config.ACTIONS.EMPTY });
            return;
        }
        let url = `${this.config.API.base}${this.config.API.endpoints.search}?q=${encodeURIComponent(searchTerm)}&limit=${limit}`;
        if (filter) url += `&type=${filter}`;
        await this.fetchData({
            url,
            loadingType: this.config.ACTIONS.LOADING,
            successType: this.config.ACTIONS.SUCCESS,
            errorType: this.config.ACTIONS.ERROR,
            emptyType: this.config.ACTIONS.EMPTY,
            processData: (data) => data.data || [],
        });
    }

    // Users
    async loadUsers(limit = 10, filter = '') {
        let url = `${this.config.API.base}${this.config.API.endpoints.users}?results=${limit}`;
        if (filter) url += `&gender=${filter}`;
        await this.fetchData({
            url,
            loadingType: this.config.ACTIONS.LOADING,
            successType: this.config.ACTIONS.SUCCESS,
            errorType: this.config.ACTIONS.ERROR,
            emptyType: this.config.ACTIONS.EMPTY,
            processData: (data) => data.results || [],
        });
    }
    async loadSingleUser() {
        const url = `${this.config.API.base}${this.config.API.endpoints.users}?results=1`;
        await this.fetchData({
            url,
            loadingType: this.config.ACTIONS.LOADING,
            successType: this.config.ACTIONS.SUCCESS,
            errorType: this.config.ACTIONS.ERROR,
            emptyType: this.config.ACTIONS.EMPTY,
            processData: (data) => data.results || [],
        });
    }
} 