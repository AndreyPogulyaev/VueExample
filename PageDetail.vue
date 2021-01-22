<template lang="pug">
  DetailWrapper(
    :page="page" 
    :info="info" 
    :switcher="{ enable: false, status: status }" 
    :info-settings="infoSettings"
    :data="partnerData"
    :documents-link="($store.getters['auth/isRoot']) ? '/documents/'+id : ''"
    contact-user-field="contactUser"
    @changeStatus="changeStatus"
    @changeContactUser="changeContactUser" 
  )
    template(v-slot:box)
      TableView(
        :data="$store.getters['outlets/getListByPartnerId'](id)"
        :is-loading="$store.state.outlets.list.loading"
        :columns="columns"
        :navigate="navigate"
        searchfield="name"
        :paginated="true"
        :label-status-enum="$store.getters['outlets/statusTypeLabels']"
        :label-status-type-enum="true" 
      )
        b-button.is-info.is-mobile-hide(
          v-if="$store.getters['auth/isRoot']"
          tag="router-link" 
          :to="{ path: '/outlets/add/'+id }" 
        ) Добавить торговую точку
</template>

<script>
import TableView from '@/components/TableView.vue';
import DetailWrapper from '@/components/DetailWrapper.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState } = createNamespacedHelpers('partners');

export default {
  name: 'PartnersDetail',
  components: { TableView, DetailWrapper },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    const active = false;
    const columns = [
      {
        field: 'name',
        label: 'Наименование',
        numeric: false,
        searchable: false,
        sortable: true,
      },
      {
        field: 'address',
        label: 'Адрес',
        numeric: false,
        searchable: false,
        sortable: true,
        cellClass: 'table-cell-textsmall',
      },
      {
        field: 'segment.name',
        label: 'Сегмент',
        numeric: false,
        searchable: false,
        centered: true,
        sortable: true,
      },
      {
        field: 'status',
        label: 'Статус',
        numeric: false,
        searchable: false,
        centered: true,
        sortable: true,
      },
    ];

    const infoSettings = {
      title: 'Реквизиты',
      cols: 'two',
      link: '/partners/' + this.id + '/edit',
      agent_title: 'Представитель',
      agent_link: true,
    };
    const page = {
      description: '',
      boxTitle: 'Торговые точки',
    };

    const enumStatusTypes = this.$store.getters['partners/enumStatusTypes'];
    const info = [
      { label: 'Бик', field: 'bankIdentificationCode' },
      { label: 'Юр. адрес', field: 'legalAddress' },
      { label: 'Почтовый адрес', field: 'postalCode' },
      { label: 'Р/С', field: 'companyPaymentAccount' },
      { label: 'ИНН/ОГРН', field: 'taxpayerCode' },
      { label: 'Генеральный директор', field: 'ceoFullName' },
    ];
    return {
      active,
      columns,
      info,
      page,
      infoSettings,
      enumStatusTypes,
    };
  },
  computed: {
    ...mapState({
      partnerData(state) {
        let partner = this.$store.getters['partners/getById'](this.id);
        if (partner) {
          return partner;
        } else if ((!partner && state.list.updateRequired) || !this.id) {
          return {};
        } else {
          this.$api.onError('lookupErrGet', { code: '404', message: '' });
        }
      },
      status() {
        return this.partnerData.status === this.enumStatusTypes.ACTIVE;
      },
    }),
  },
  created() {
    this.init();
    this.$store.dispatch('outlets/init');
  },
  methods: {
    ...mapActions([
      'init',
      'deleteOutlets',
      'setContactUser',
      'activate',
      'deactivate',
    ]),
    navigate(el) {
      this.$router.push('/outlets/' + el._id);
    },
    changeStatus(status) {
      status ? this.activate(this.id) : this.deactivate(this.id);
    },
    changeContactUser(username) {
      this.setContactUser({ id: this.id, username: username });
    },
  },
};
</script>
