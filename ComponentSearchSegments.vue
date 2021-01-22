<template lang="pug">
  b-taginput(
    placeholder="Введите название сегмента" 
    v-model="valueModel"
    type="search"
    icon="search"
    :open-on-focus="true"
    :data="filteredSegments"
    @typing="setFilteredSegmentsText"
    :allow-new="false"
    autocomplete
    field="name"
    :maxtags="maxtags"
    :disabled="disabled"
  )
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('segments');

export default {
  name: 'SearchSegments',
  model: {
    prop: 'value',
    event: 'valuechange',
  },
  props: {
    // eslint-disable-next-line
    value: {},
    disabled: {
      type: Boolean,
    },
    maxtags: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      filteredSegmentsText: '',
      valueArray: [],
    };
  },
  computed: {
    valueModel: {
      get: function () {
        return this.currentValue;
      },
      set: function (newValue) {
        this.currentValue = newValue;
        if (this.maxtags > 1) {
          this.$emit(
            'valuechange',
            newValue.map((item) => {
              return item._id;
            })
          );
        } else {
          const valueId = newValue[0] ? newValue[0]._id : '';
          this.$emit('valuechange', valueId);
        }
      },
    },
    currentValue: {
      get: function () {
        if (this.value && this.valueArray.length === 0) {
          return this.$store.getters['segments/getByIds'](this.value);
        } else {
          return this.valueArray;
        }
      },
      set: function (newValue) {
        this.valueArray = newValue;
      },
    },
    filteredSegments() {
      return this.$store.state.segments.list.items.filter((option) => {
        return (
          option.name
            .toString()
            .toLowerCase()
            .indexOf(this.filteredSegmentsText.toLowerCase()) >= 0
        );
      });
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions(['init']),
    setFilteredSegmentsText(text) {
      this.filteredSegmentsText = text;
    },
  },
};
</script>
