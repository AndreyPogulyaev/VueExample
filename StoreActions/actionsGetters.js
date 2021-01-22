export default {
  getById: state => id => {
    return state.list.items.find(item => item._id === id);
  },

  getListByOutletId: state => outletId => {
    if (state.list.updateRequired) {
      return [];
    } else {
      return state.list.items.filter(item => {
        return item.outletId === outletId && item.isStopped === false;
      });
    }
  },

  getListStoppedByOutletId: state => outletId => {
    if (state.list.updateRequired) {
      return [];
    } else {
      return state.list.items.filter(item => {
        return item.outletId === outletId && item.isStopped === true;
      });
    }
  },

  getAllListByOutletId: state => outletId => {
    if (state.list.updateRequired) {
      return [];
    } else {
      return state.list.items.filter(item => {
        return item.outletId === outletId;
      });
    }
  },

  getListRecommendedBySegment: state => segmentId => {
    if (state.list.updateRequired) {
      return [];
    } else {
      return state.list.items.filter(item => {
        return item.outlet.businessSegment === segmentId;
      });
    }
  },

  getListNotRecommendedBySegment: state => segmentId => {
    if (state.list.updateRequired) {
      return [];
    } else {
      return state.list.items.filter(item => {
        return item.outlet.businessSegment === segmentId;
      });
    }
  },

  enumTimingTypes() {
    return {
      LIMITED: 'LIMITED',
      PERPETUAL: 'PERPETUAL',
    };
  },
};
