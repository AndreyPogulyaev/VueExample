import Vue from 'vue';

export default {
  SET_LIST(state, items) {
    state.list.items = items;
  },

  MERGE_LIST(state, items) {
    let isNew = true;
    items.forEach(itemN => {
      state.list.items.forEach(item => {
        if (item._id === itemN._id) {
          isNew = false;
          item = itemN;
        }
      });
      if (isNew) {
        state.list.items.push(itemN);
      } else {
        isNew = true;
      }
    });
    Vue.set(state.list, 'items', [...state.list.items]);
  },

  DELETE_LIST_ITEM(state, _id) {
    state.list.items.forEach((item, index, object) => {
      if (item._id === _id) {
        object.splice(index, 1);
      }
    });
  },

  ADD_LIST_ITEM(state, action) {
    state.list.items.push(action);
  },

  UPDATE_LIST_ITEM(state, action) {
    const newItems = state.list.items.map(item => {
      if (item._id === action._id) {
        return action;
      } else {
        return item;
      }
    });
    Vue.set(state.list, 'items', [...newItems]);
  },

  LOADING_START(state) {
    state.list.loading = true;
  },

  LOADING_END(state) {
    state.list.loading = false;
  },

  UPDATE_REQUIRED_UP(state) {
    state.list.updateRequired = true;
  },

  UPDATE_PROCESS(state) {
    state.list.updateProcess = true;
  },

  UPDATE_REQUIRED_DOWN(state) {
    state.list.updateRequired = false;
    state.list.updateProcess = false;
  },
};
