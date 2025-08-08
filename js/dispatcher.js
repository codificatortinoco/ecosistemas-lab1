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
}

const dispatcher = new Dispatcher();
dispatcher.register(action => pokemonStore.handleAction(action));
dispatcher.register(action => animeStore.handleAction(action));
dispatcher.register(action => usersStore.handleAction(action));
dispatcher.register(action => jokesStore.handleAction(action)); 