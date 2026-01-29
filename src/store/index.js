import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    userTransaction: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setUserTransaction(state, userTransaction) {
      state.userTransaction = userTransaction
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('setUser', null)
    },
    storeUserTransaction({ commit }, userTransaction) {
      commit('setUserTransaction', userTransaction)
    }
  },
  getters: {
    user: (state) => state.user,
    userTransaction: (state) => state.userTransaction
  }
})
