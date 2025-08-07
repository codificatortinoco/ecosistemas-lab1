class View {
    constructor(moduleName, store, actions) {
        this.moduleName = moduleName;
        this.store = store;
        this.actions = actions;
        this.moduleElement = document.querySelector(`[data-module="${moduleName}"]`);
        this.resultsElement = this.moduleElement.querySelector('[data-results]');
        
        this.bindEvents();
        this.subscribeToStore();
    }

    bindEvents() {
        const controls = this.moduleElement.querySelector('.module-controls');
        
        const searchInput = controls.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }

        const buttons = controls.querySelectorAll('[data-action]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleAction(action);
            });
        });

        const filterSelect = controls.querySelector('.filter-select');
        const limitInput = controls.querySelector('.limit-input');
        
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                this.handleFilterChange();
            });
        }
        
        if (limitInput) {
            limitInput.addEventListener('change', () => {
                this.handleLimitChange();
            });
        }
    }

    subscribeToStore() {
        this.store.subscribe((state) => {
            this.render(state);
        });
    }

    render(state) {
        this.updateState(state);
        this.renderResults(state);
    }

    updateState(state) {
        const loadingEl = this.moduleElement.querySelector('.state-loading');
        const errorEl = this.moduleElement.querySelector('.state-error');
        const emptyEl = this.moduleElement.querySelector('.state-empty');

        loadingEl.style.display = 'none';
        errorEl.style.display = 'none';
        emptyEl.style.display = 'none';

        if (state.loading) {
            loadingEl.style.display = 'block';
        } else if (state.error) {
            errorEl.style.display = 'block';
        } else if (!state[this.getDataKey()] || state[this.getDataKey()].length === 0) {
            emptyEl.style.display = 'block';
        }
    }

    renderResults(state) {
        const data = state[this.getDataKey()];
        if (data && data.length > 0) {
            this.resultsElement.innerHTML = this.renderCards(data);
        } else {
            this.resultsElement.innerHTML = '';
        }
    }

    getDataKey() {
        const keys = {
            'pokemon': 'pokemon',
            'anime': 'anime',
            'users': 'users'
        };
        return keys[this.moduleName];
    }

    handleSearch() {
        const searchInput = this.moduleElement.querySelector('.search-input');
        const searchTerm = searchInput.value.trim();
        
        if (this.moduleName === 'pokemon') {
            this.actions.searchPokemon(searchTerm);
        } else if (this.moduleName === 'anime') {
            const filter = this.getFilterValue();
            const limit = this.getLimitValue();
            this.actions.searchAnime(searchTerm, filter, limit);
        }
    }

    handleAction(action) {
        if (this.moduleName === 'pokemon') {
            if (action === 'search') {
                this.handleSearch();
            } else if (action === 'random') {
                this.actions.loadRandomPokemon();
            }
        } else if (this.moduleName === 'anime') {
            if (action === 'search') {
                this.handleSearch();
            }
        } else if (this.moduleName === 'users') {
            if (action === 'load') {
                const limit = this.getLimitValue();
                const filter = this.getFilterValue();
                this.actions.loadUsers(limit, filter);
            } else if (action === 'single') {
                this.actions.loadSingleUser();
            }
        }
    }

    handleFilterChange() {
        if (this.moduleName === 'anime' || this.moduleName === 'users') {
            this.handleSearch();
        }
    }

    handleLimitChange() {
        if (this.moduleName === 'anime' || this.moduleName === 'users') {
            this.handleSearch();
        }
    }

    getFilterValue() {
        const filterSelect = this.moduleElement.querySelector('.filter-select');
        return filterSelect ? filterSelect.value : '';
    }

    getLimitValue() {
        const limitInput = this.moduleElement.querySelector('.limit-input');
        return limitInput ? parseInt(limitInput.value) : CONFIG.UI.defaultLimit;
    }

    renderCards(data) {
        switch (this.moduleName) {
            case 'pokemon':
                return this.renderPokemonCards(data);
            case 'anime':
                return this.renderAnimeCards(data);
            case 'users':
                return this.renderUserCards(data);
            default:
                return '';
        }
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
} 