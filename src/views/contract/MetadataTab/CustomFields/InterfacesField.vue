<template>
  <span>
    <a
      v-for="interfaceName in linkableInterfaces"
      v-bind:key="getInterfaceLink(interfaceName)"
      :href="getInterfaceLink(interfaceName)"
      target="_blank"
      rel="noopener"
      class="mr-3"
    >{{interfaceName}}</a>
    <span
      v-for="interfaceName in unlinkableInterfaces"
      v-bind:key="interfaceName"
      class="mr-3"
    >
      {{
        interfaceName
      }}
    </span>
  </span>
</template>

<script>
export default {
  name: "InterfacesField",
  props: {
    value: Array,
  },
  computed: {
    linkableInterfaces() {
      return this.value.filter(interfaceName => this.isInterfaceWithLink(interfaceName))
    },
    unlinkableInterfaces() {
      return this.value.filter(interfaceName => !this.isInterfaceWithLink(interfaceName))
    }
  },
  methods: {
    getInterfaceLink(interfaceName) {
      const constant = `https://gitlab.com/tzip/tzip/-/tree/master/proposals`;
      return `${constant}/${this.getTZIPlinkableName(interfaceName.trim())}`
    },
    getTZIPlinkableName(name) {
      const regex = /^(TZIP-([0-9]+))/;
      return regex.exec(name)[0].toLowerCase().split('-0').join('-');
    },
    isInterfaceWithLink(interfaceName) {
      const regex = /^(TZIP-([0-9]+).*)/;
      return regex.test(interfaceName)
    },
  }
}
</script>
