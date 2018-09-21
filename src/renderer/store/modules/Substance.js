import {api} from '../../helpers';

const state = {
    appliedQuery: '',
    results: {},
    suggestions: [],
    loading: false,
    error: ''
};

const mutations = {
    CHANGE_APPLIED_QUERY(state, query) {
        state.appliedQuery = query;
    },
    START_LOADING(state) {
        state.loading = true;
    },
    STOP_LOADING(state) {
        state.loading = false;
    },
    RESULTS_SUCCEEDED(state, response) {
        state.results = response;
    },
    ERROR(state, error) {
        state.error = error;
    },
    SUGGESTIONS_SUCCEEDED(state, suggestions) {
        state.suggestions = suggestions;
    }
};

const actions = {
    changeSearchType({commit, state}) {
        commit('Main/CHANGE_QUERY', state.appliedQuery, {root: true});
    },
    async getResults({commit, state}, query) {
        const payload = {
            queryKey: 'substance',
            queryValue: query
        };

        commit('START_LOADING');

        try {
            const response = await api.searchResults(payload);

            commit('CHANGE_APPLIED_QUERY', query);
            commit('RESULTS_SUCCEEDED', response);
            commit('STOP_LOADING');
        } catch (e) {
            commit('ERROR', e.toString());
        }

    },
    async changeQuery({commit}, query) {
        if (query.length > 2) {
            try {
                commit('START_LOADING');

                const {values} = await api.searchSuggestions(query);

                commit('SUGGESTIONS_SUCCEEDED', values);
                commit('STOP_LOADING');
            } catch (e) {
                commit('ERROR', e.toString());
            }
        }
    }
};

export default {
    state,
    mutations,
    actions,
    namespaced: true
}
