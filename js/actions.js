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

    async fetchMultiple(urls, processData) {
        this.dispatch({ type: this.config.ACTIONS.LOADING });
        try {
            const promises = urls.map(url => fetch(url).then(res => res.json()));
            const results = await Promise.all(promises);
            const processed = processData ? processData(results) : results;
            this.dispatch({
                type: this.config.ACTIONS.SUCCESS,
                payload: processed
            });
        } catch (error) {
            this.dispatch({
                type: this.config.ACTIONS.ERROR,
                payload: error.message
            });
        }
    }

    // Generic search method
    async search(searchTerm, endpoint, params = {}) {
        if (!searchTerm?.trim()) {
            this.dispatch({ type: this.config.ACTIONS.EMPTY });
            return;
        }
        
        const url = new URL(`${this.config.API.base}${endpoint}`);
        url.searchParams.set('q', searchTerm);
        Object.entries(params).forEach(([key, value]) => {
            if (value) url.searchParams.set(key, value);
        });
        
        await this.fetchData({
            url: url.toString(),
            loadingType: this.config.ACTIONS.LOADING,
            successType: this.config.ACTIONS.SUCCESS,
            errorType: this.config.ACTIONS.ERROR,
            emptyType: this.config.ACTIONS.EMPTY,
            processData: (data) => data.data || data,
        });
    }

    // Generic load method
    async load(endpoint, params = {}, processData) {
        const url = new URL(`${this.config.API.base}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => {
            if (value) url.searchParams.set(key, value);
        });
        
        await this.fetchData({
            url: url.toString(),
            loadingType: this.config.ACTIONS.LOADING,
            successType: this.config.ACTIONS.SUCCESS,
            errorType: this.config.ACTIONS.ERROR,
            emptyType: this.config.ACTIONS.EMPTY,
            processData,
        });
    }

    // Pokemon methods
    async searchPokemon(searchTerm) {
        if (!searchTerm?.trim()) {
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
        await this.load(`${this.config.API.endpoints.pokemon}/${randomId}`, {}, (pokemon) => [pokemon]);
    }

    async loadMultipleRandomPokemon(count = 5) {
        const usedIds = new Set();
        const urls = [];
        
        while (urls.length < count) {
            const randomId = Math.floor(Math.random() * 151) + 1;
            if (!usedIds.has(randomId)) {
                usedIds.add(randomId);
                urls.push(`${this.config.API.base}${this.config.API.endpoints.pokemon}/${randomId}`);
            }
        }
        
        await this.fetchMultiple(urls);
    }

    // Anime methods
    async searchAnime(searchTerm, filter = '', limit = 10) {
        await this.search(searchTerm, this.config.API.endpoints.search, { limit, type: filter });
    }

    // Users methods
    async loadUsers(limit = 10, filter = '') {
        const params = { results: limit };
        if (filter) params.gender = filter;
        await this.load(this.config.API.endpoints.users, params, (data) => data.results || []);
    }

    async loadSingleUser() {
        await this.load(this.config.API.endpoints.users, { results: 1 }, (data) => data.results || []);
    }

    // Jokes methods
    async loadJokes(limit = 5) {
        const urls = Array(limit).fill().map(() => 
            `${this.config.API.base}${this.config.API.endpoints.random}?safe-mode`
        );
        await this.fetchMultiple(urls);
    }

    async loadSingleJoke() {
        await this.load(this.config.API.endpoints.random, { 'safe-mode': '' }, (joke) => [joke]);
    }
} 