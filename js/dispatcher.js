class Dispatcher {
    constructor() {
        this.callbacks = [];
        this.isDispatching = false;
        this.pendingPayload = null;
    }

    register(callback) {
        this.callbacks.push(callback);
        return this.callbacks.length - 1;
    }

    unregister(token) {
        this.callbacks[token] = null;
    }

    dispatch(action) {
        if (this.isDispatching) {
            throw new Error('Dispatcher is already dispatching');
        }
        this.isDispatching = true;
        this.pendingPayload = action;
        try {
            this.callbacks.forEach(callback => {
                if (callback) callback(action);
            });
        } finally {
            this.isDispatching = false;
            this.pendingPayload = null;
        }
    }

    registerStore(store) {
        return this.register(action => store.handleAction(action));
    }
}

const dispatcher = new Dispatcher();

// Register all stores
const stores = [pokemonStore, animeStore, usersStore, jokesStore];
stores.forEach(store => dispatcher.registerStore(store)); 