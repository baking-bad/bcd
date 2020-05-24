<template>
  <div>
    <Michelson v-if="prim === 'lambda'" :code="value"></Michelson>
    <pre v-else-if="isPreFormatted">{{ value }}</pre>
    <v-textarea
      v-else-if="prim === 'string' || prim === 'bytes'"
      auto-grow
      rows="1"
      filled
      readonly
      :label="label"
      :value="value"
    ></v-textarea>
    <v-text-field v-else :value="value" :suffix="suffix" readonly filled :label="label"></v-text-field>
    <v-btn
      v-if="(isKeyHash || isContract) && tzkt.supports(network)"
      text
      small
      link
      @click.prevent.stop="handleAddress(value, true)"
    >
      <v-icon small class="mr-1">mdi-open-in-new</v-icon>
      <span>Open in TzKT.io</span>
    </v-btn>
    <v-btn
      v-if="isContract && value !== $route.params.address"
      text
      small
      link
      @click.prevent.stop="handleAddress(value)"
    >
      <v-icon small class="mr-1" v-if="!sameTab">mdi-open-in-new</v-icon>
      <span>View contract</span>
    </v-btn>
    <v-btn
      v-else-if="prim === 'big_map'"
      text
      small
      link
      :to="{ path: `/${network}/big_map/${value}` }"
    >View Big Map</v-btn>
  </div>
</template>

<script>
import Michelson from "@/components/Michelson.vue";

export default {
  name: "ValueInspector",
  props: {
    value: String,
    prim: String,
    label: String,
    network: String,
    sameTab: Boolean
  },
  components: {
    Michelson
  },
  computed: {
    suffix() {
      if (this.prim === "mutez") {
        return "utz";
      }
      return null;
    },
    isPreFormatted() {
      return this.prim === "string" && /\n/.test(this.value);
    },
    isKeyHash() {
      return (
        this.prim === "key_hash" ||
        (this.prim === "address" && this.value.startsWith("tz"))
      );
    },
    isContract() {
      return (
        (this.prim === "address" || this.prim === "contract") &&
        this.value.startsWith("KT")
      );
    }
  },
  methods: {
    handleAddress(s, external = false) {
      const address = s.match(/(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/)[0];
      if (address.startsWith("tz") || external) {
        let href = this.tzkt.resolve(this.network, address);
        window.open(href, "_blank");
      } else {
        const path = { path: `/${this.network}/${address}` };
        if (this.sameTab) {
          this.$router.push(path);
        } else {
          window.open(this.$router.resolve(path).href, "_blank");
        }
      }
    }
  }
};
</script>