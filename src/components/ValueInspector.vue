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
      v-if="value !== $route.params.address"
      text
      small
      link
      @click.prevent.stop="handleAddress(value)"
    >
      <v-icon small class="mr-1" v-if="!sameTab">mdi-open-in-new</v-icon>
      <span>View</span>
    </v-btn>
    <v-btn v-if="isKeyHash" text small link :to="`/${value}`" target="_blank">
      <v-icon small class="mr-1">mdi-magnify</v-icon>
      <span>Search address</span>
    </v-btn>
    <v-btn
      v-else-if="prim === 'big_map'"
      text
      small
      link
      :to="{ path: `/${network}/big_map/${value}` }"
    >View Big Map</v-btn>
    <v-btn
      v-if="isIpfsHash"
      text
      small
      link
      @click.prevent.stop="handleIpfsHash(value)"
    >
      <v-icon small class="mr-1">mdi-open-in-new</v-icon>
      <span>View IPFS</span>
    </v-btn>
  </div>
</template>

<script>
import Michelson from "@/components/Michelson.vue";
import isIpfs from "is-ipfs";

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
    },
    isIpfsHash() {
      return this.prim === "string" && isIpfs.multihash(this.value);
    }
  },
  methods: {
    handleAddress(s, external = false) {
      const address = s.match(/(tz|KT)[1-9A-HJ-NP-Za-km-z]{34}/)[0];
      if (external) {
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
    },
    handleIpfsHash(hash) {
      window.open(`https://cloudflare-ipfs.com/ipfs/${hash}`, "_blank");
    }
  }
};
</script>