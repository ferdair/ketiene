export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },
}
export const state = () => ({
  aux: null,
})

export const mutations = {
  SET_USER(state, mutation) {
    state.auth.user = mutation
  },
}
