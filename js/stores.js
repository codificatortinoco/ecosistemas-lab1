class DataStore {
    constructor(initialState, actionTypes, dataKey) {
        this.state = { ...initialState };
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
        const { type, payload } = action;
        const { LOADING, SUCCESS, ERROR, EMPTY } = this.actionTypes;

        switch (type) {
            case LOADING:
                this.updateState({ loading: true, error: null, ...payload });
                break;
            case SUCCESS:
                this.updateState({ [this.dataKey]: payload, loading: false, error: null });
                break;
            case ERROR:
                this.updateState({ error: payload, loading: false, [this.dataKey]: [] });
                break;
            case EMPTY:
                this.updateState({ [this.dataKey]: [], loading: false, error: null });
                break;
        }
    }

    updateState(updates) {
        this.state = { ...this.state, ...updates };
        this.emit();
    }
}

// Create stores with consistent initial state
const createStore = (actionTypes, dataKey, additionalState = {}) => {
    const initialState = {
        [dataKey]: [],
        loading: false,
        error: null,
        ...additionalState
    };
    return new DataStore(initialState, actionTypes, dataKey);
};

const pokemonStore = createStore(CONFIG.ACTIONS.POKEMON, 'pokemon', { searchTerm: '' });
const animeStore = createStore(CONFIG.ACTIONS.ANIME, 'anime', { searchTerm: '', filter: '', limit: CONFIG.UI.defaultLimit });
const usersStore = createStore(CONFIG.ACTIONS.USERS, 'users', { limit: CONFIG.UI.defaultLimit, filter: '' });
const jokesStore = createStore(CONFIG.ACTIONS.JOKES, 'jokes', { limit: CONFIG.UI.defaultLimit }); 