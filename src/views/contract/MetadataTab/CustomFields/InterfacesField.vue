<template>
  <span>
    <a
      v-for="interfaceName in linkableInterfaces"
      v-bind:key="getInterfaceLink(interfaceName)"
      :href="getInterfaceLink(interfaceName)"
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
      const constant = `https://gitlab.com/tzip/tzip/-/blob/master/proposals`;
      return `${constant}/${interfaceName.toLowerCase()}`
    },
    isInterfaceWithLink(interfaceName) {
      const regex = /TZIP-[1-9]+[0]*$/;
      return regex.test(interfaceName)
    },
  }
}
</script>
