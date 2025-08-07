class DataStore {
    constructor(initialState, actionTypes, dataKey) {
        this.state = initialState;
        this.listeners = [];
        this.actionTypes = actionTypes;
        this.dataKey = dataKey;
    }

    getState() {
        return this.state;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    emit() {
        this.listeners.forEach(listener => listener(this.state));
    }

    handleAction(action) {
        switch (action.type) {
            case this.actionTypes.LOADING:
                this.state.loading = true;
                this.state.error = null;
                if (action.payload) {
                    Object.assign(this.state, action.payload);
                }
                break;
            case this.actionTypes.SUCCESS:
                this.state[this.dataKey] = action.payload;
                this.state.loading = false;
                this.state.error = null;
                break;
            case this.actionTypes.ERROR:
                this.state.error = action.payload;
                this.state.loading = false;
                this.state[this.dataKey] = [];
                break;
            case this.actionTypes.EMPTY:
                this.state[this.dataKey] = [];
                this.state.loading = false;
                this.state.error = null;
                break;
        }
        this.emit();
    }
}

const pokemonStore = new DataStore(
    { pokemon: [], loading: false, error: null, searchTerm: '' },
    CONFIG.ACTIONS.POKEMON,
    'pokemon'
);

const animeStore = new DataStore(
    { anime: [], loading: false, error: null, searchTerm: '', filter: '', limit: CONFIG.UI.defaultLimit },
    CONFIG.ACTIONS.ANIME,
    'anime'
);

const usersStore = new DataStore(
    { users: [], loading: false, error: null, limit: CONFIG.UI.defaultLimit, filter: '' },
    CONFIG.ACTIONS.USERS,
    'users'
); 