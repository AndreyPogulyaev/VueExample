import Vue from 'vue';

export default {
  async init({ state, dispatch, commit, rootGetters }) {
    if (state.list.updateRequired && !state.list.updateProcess) {
      commit('UPDATE_PROCESS');
      await dispatch('outlets/init', null, { root: true });
      if (['isCashier', 'isManager'].includes(rootGetters['auth/userRole'])) {
        await dispatch('getList', rootGetters['auth/neededOutletId']);
      } else if (rootGetters['auth/userRole'] === 'isPartner') {
        const outlets = rootGetters['auth/auth'].roles.outlets;
        if (outlets) {
          for (const item in outlets) {
            await dispatch('getList', item);
          }
        }
      } else {
        await dispatch('getList');
      }
      commit('UPDATE_REQUIRED_DOWN');
    }
  },

  async getList({ commit, dispatch }, outletId = false) {
    commit('LOADING_START');
    return Vue.prototype.$api.action
      .getList(outletId)
      .then(response => {
        return dispatch('resolveRelations', response.items).then(data => {
          commit('MERGE_LIST', data);
          return data;
        });
      })
      .catch(error => {
        commit(
          'notification/NEW',
          { type: 'error', message: error.message },
          { root: true }
        );
        throw error;
      })
      .finally(() => {
        commit('LOADING_END');
      });
  },

  get({ commit }, id) {
    commit('LOADING_START');
    return Vue.prototype.$api.action
      .get(id)
      .then(response => {
        commit('UPDATE_LIST_ITEM', response.data);
      })
      .catch(error => {
        commit(
          'notification/NEW',
          { type: 'error', message: error.message },
          { root: true }
        );
      })
      .finally(() => {
        commit('LOADING_END');
      });
  },

  start({ commit }, templateId) {
    commit('LOADING_START');
    return Vue.prototype.$api.action
      .start(templateId)
      .then(() => {
        commit('UPDATE_REQUIRED_UP');
        commit(
          'notification/NEW',
          { type: 'success', message: ' Акция запущена' },
          { root: true }
        );
      })
      .catch(error => {
        commit(
          'notification/NEW',
          { type: 'error', message: error.message },
          { root: true }
        );
      })
      .finally(() => {
        commit('LOADING_END');
      });
  },

  stop({ commit }, id) {
    commit('LOADING_START');
    return Vue.prototype.$api.action
      .stop(id)
      .then(() => {
        commit('UPDATE_REQUIRED_UP');
        commit(
          'notification/NEW',
          { type: 'success', message: ' Акция остановлена' },
          { root: true }
        );
      })
      .catch(error => {
        commit(
          'notification/NEW',
          { type: 'error', message: error.message },
          { root: true }
        );
      })
      .finally(() => {
        commit('LOADING_END');
      });
  },

  resolveRelations({ rootGetters }, items) {
    return items.reduce((accumulator, currentValue) => {
      currentValue.outlet = rootGetters['outlets/getById'](
        currentValue.outletId
      );
      accumulator.push(currentValue);
      return accumulator;
    }, []);
  },
};
