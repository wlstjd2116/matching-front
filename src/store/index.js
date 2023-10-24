import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
  state() {
    return {
      mainPageData: null
    };
  },
  mutations: {
    setMainPageData(state, data) {
      state.mainPageData = data;
    }
  },
  actions: {
    setMainPageData({ commit }, data) {
      commit('setMainPageData', data);
    }
  },
  getters: {
    getMainPageData(state) {
      return state.mainPageData;
    }
  }
});

export default store;