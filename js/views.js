class View {
    constructor(moduleName, store, actions) {
        this.moduleName = moduleName;
        this.store = store;
        this.actions = actions;
        this.moduleElement = document.querySelector(`[data-module="${moduleName}"]`);
        this.resultsElement = this.moduleElement.querySelector('[data-results]');
        
        this.actionHandlers = this.createActionHandlers();
        this.cardRenderers = this.createCardRenderers();
        
        this.bindEvents();
        this.subscribeToStore();
    }

    createActionHandlers() {
        return {
            pokemon: {
                search: () => this.actions.searchPokemon(this.getSearchValue()),
                random: () => this.actions.loadMultipleRandomPokemon(this.getCountValue())
            },
            anime: {
                search: () => this.actions.searchAnime(this.getSearchValue(), this.getFilterValue(), this.getLimitValue())
            },
            users: {
                load: () => this.actions.loadUsers(this.getLimitValue(), this.getFilterValue()),
                single: () => this.actions.loadSingleUser()
            },
            jokes: {
                load: () => this.actions.loadJokes(this.getLimitValue()),
                single: () => this.actions.loadSingleJoke()
            }
        };
    }

    createCardRenderers() {
        return {
            pokemon: this.renderPokemonCards.bind(this),
            anime: this.renderAnimeCards.bind(this),
            users: this.renderUserCards.bind(this),
            jokes: this.renderJokeCards.bind(this)
        };
    }

    bindEvents() {
        const controls = this.moduleElement.querySelector('.module-controls');
        
        // Bind search input
        const searchInput = controls.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        }

        // Bind buttons
        controls.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleAction(action);
            });
        });

        // Bind form controls
        ['filter-select', 'limit-input'].forEach(selector => {
            const element = controls.querySelector(`.${selector}`);
            if (element) {
                element.addEventListener('change', () => this.handleFormChange());
            }
        });
    }

    subscribeToStore() {
        this.store.subscribe((state) => this.render(state));
    }

    render(state) {
        this.updateState(state);
        this.renderResults(state);
    }

    updateState(state) {
        const states = ['loading', 'error', 'empty'];
        states.forEach(stateType => {
            const element = this.moduleElement.querySelector(`.state-${stateType}`);
            if (element) {
                element.style.display = 'none';
            }
        });

        if (state.loading) {
            this.moduleElement.querySelector('.state-loading').style.display = 'block';
        } else if (state.error) {
            this.moduleElement.querySelector('.state-error').style.display = 'block';
        } else if (!state[this.getDataKey()] || state[this.getDataKey()].length === 0) {
            this.moduleElement.querySelector('.state-empty').style.display = 'block';
        }
    }

    renderResults(state) {
        const data = state[this.getDataKey()];
        this.resultsElement.innerHTML = data?.length > 0 ? this.renderCards(data) : '';
    }

    getDataKey() {
        const dataKeys = { pokemon: 'pokemon', anime: 'anime', users: 'users', jokes: 'jokes' };
        return dataKeys[this.moduleName];
    }

    handleSearch() {
        const handlers = this.actionHandlers[this.moduleName];
        if (handlers?.search) handlers.search();
    }

    handleAction(action) {
        const handlers = this.actionHandlers[this.moduleName];
        if (handlers?.[action]) handlers[action]();
    }

    handleFormChange() {
        if (['anime', 'users'].includes(this.moduleName)) {
            this.handleSearch();
        }
    }

    getSearchValue() {
        const input = this.moduleElement.querySelector('.search-input');
        return input?.value?.trim() || '';
    }

    getFilterValue() {
        const select = this.moduleElement.querySelector('.filter-select');
        return select?.value || '';
    }

    getLimitValue() {
        const input = this.moduleElement.querySelector('.limit-input');
        return input ? parseInt(input.value) : CONFIG.UI.defaultLimit;
    }

    getCountValue() {
        const input = this.moduleElement.querySelector('.limit-input');
        return input ? parseInt(input.value) : 5;
    }

    renderCards(data) {
        const renderer = this.cardRenderers[this.moduleName];
        return renderer ? renderer(data) : '';
    }

    renderPokemonCards(pokemonList) {
        return pokemonList.map(pokemon => `
            <div class="card pokemon-card">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" onerror="this.src='https://via.placeholder.com/120x120?text=Pokemon'">
                <h3>${pokemon.name}</h3>
                <div class="pokemon-types">
                    ${pokemon.types.map(type => `
                        <span class="type-badge" style="background-color: ${CONFIG.POKEMON_TYPES[type.type.name] || '#777'}">
                            ${type.type.name}
                        </span>
                    `).join('')}
                </div>
                <p><strong>Height:</strong> ${pokemon.height / 10}m</p>
                <p><strong>Weight:</strong> ${pokemon.weight / 10}kg</p>
                <p><strong>Abilities:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
            </div>
        `).join('');
    }

    renderAnimeCards(animeList) {
        return animeList.map(anime => `
            <div class="card anime-card">
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}" onerror="this.src='https://via.placeholder.com/80x120?text=Anime'">
                <div class="anime-info">
                    <h3>${anime.title}</h3>
                    <p><strong>Type:</strong> ${anime.type}</p>
                    <p><strong>Status:</strong> ${anime.status}</p>
                    <p><strong>Episodes:</strong> ${anime.episodes || 'Unknown'}</p>
                    <p><strong>Score:</strong> ${anime.score || 'N/A'}/10</p>
                    <p><strong>Year:</strong> ${anime.year || 'Unknown'}</p>
                    <p style="font-size: 0.8rem; color: #888; margin-top: 8px;">
                        ${anime.synopsis ? anime.synopsis.substring(0, 100) + '...' : 'No synopsis available'}
                    </p>
                </div>
            </div>
        `).join('');
    }

    renderUserCards(users) {
        return users.map(user => `
            <div class="card user-card">
                <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}" onerror="this.src='https://via.placeholder.com/120x120?text=User'">
                <div class="user-info">
                    <h3>${user.name.first} ${user.name.last}</h3>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Age:</strong> ${user.dob.age} years old</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <div class="user-location">
                        ${user.location.city}, ${user.location.country}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderJokeCards(jokes) {
        return jokes.map(joke => {
            const jokeContent = joke.type === 'single' 
                ? `<p>${joke.joke}</p>`
                : `<p><strong>Setup:</strong> ${joke.setup}</p><p><strong>Delivery:</strong> ${joke.delivery}</p>`;
            
            const flags = joke.flags ? Object.entries(joke.flags)
                .filter(([, value]) => value)
                .map(([key]) => `<span class="joke-flag">${key.toUpperCase()}</span>`)
                .join('') : '';
            
            return `
                <div class="card joke-card">
                    ${jokeContent}
                    <div class="joke-meta">
                        <span class="joke-category">${joke.category}</span>
                        ${flags}
                    </div>
                </div>
            `;
        }).join('');
    }
} 