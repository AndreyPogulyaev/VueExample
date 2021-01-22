import state from './actionsState';
import mutations from './actionsMutations';
import getters from './actionsGetters';
import actions from './actionsActions';

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
