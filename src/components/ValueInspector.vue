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
      @click="() => {
        copy(value)
      }"
    ></v-textarea>
    <v-text-field
      v-else
      :value="value"
      :suffix="suffix"
      readonly
      filled
      :label="label"
      @click="() => {
        copy(value)
      }"
    ></v-text-field>

    <v-btn
        text
        small
        link
        @click.prevent.stop="() => {
          copy(value)
        }"
        :class="isPreFormatted ? 'pl-0 mt-4' : ''"
    >
      <v-icon small class="mr-1">mdi-content-copy</v-icon>
      <span>Copy Value</span>
    </v-btn>

    <v-btn
      v-if="value !== $route.params.address && isAddress"
      text
      small
      link
      @click.prevent.stop="handleAddress(value)"
    >
      <v-icon small class="mr-1" v-if="!sameTab">mdi-open-in-new</v-icon>
      <span>View</span>
    </v-btn>

    <v-btn
      v-else-if="isIpfsHash"
      text
      small
      link
      @click.prevent.stop="handleIpfsHash(value)"
    >
      <v-icon small class="mr-1">mdi-open-in-new</v-icon>
      <span>View IPFS</span>
    </v-btn>

    <v-btn
      v-else-if="isIpfsURI"
      text
      small
      link
      @click.prevent.stop="handleIpfsURI(value)"
    >
      <v-icon small class="mr-1">mdi-open-in-new</v-icon>
      <span>View IPFS</span>
    </v-btn>

    <v-btn
      v-if="isTezosStorage"
      text
      small
      link
      @click.prevent.stop="handleStorage(value)"
    >
      <v-icon small class="mr-1">mdi-open-in-new</v-icon>
      <span>View Storage</span>
    </v-btn>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import isIpfs from "is-ipfs";
import Michelson from "@/components/Michelson.vue";
import { copyToClipboard } from "@/utils/clipboard";
import { checkAddress, matchAddress } from "@/utils/tz.js";

export default {
  name: "ValueInspector",
  props: {
    value: String,
    prim: String,
    label: String,
    network: String,
    sameTab: Boolean,
  },
  components: {
    Michelson,
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
    isIpfsHash() {
      return this.prim === "string" && isIpfs.multihash(this.value);
    },
    isIpfsURI() {
      return this.hasProtocol(this.value, "ipfs:");
    },
    isTezosStorage() {
      return this.hasProtocol(this.value, "tezos-storage:") &&
          checkAddress(this.value.slice("tezos-storage://".length));
    },
    isAddress() {
      return (this.prim === "address" || this.prim === "contract");
    },
  },
  methods: {
    ...mapActions(["showClipboardOK", "showClipboardFail"]),
    copy(text, successMessage, failMessage) {
      copyToClipboard(text, this.showClipboardOK.bind(null, successMessage), this.showClipboardFail.bind(null, failMessage));
    },
    handleAddress(span) {
      const address = matchAddress(span);
      const path = { path: `/${this.network}/${address}` };
      if (this.sameTab) {
        this.$router.push(path);
      } else {
        window.open(this.$router.resolve(path).href, "_blank");
      }
    },
    handleStorage(value) {
      const address = value.match(/(KT)[1-9A-HJ-NP-Za-km-z]{34}/);
      if (!address) {
        return
      }
      const path = { path: `/${this.network}/${address[0]}/storage` };
      if (this.sameTab) {
        this.$router.push(path);
      } else {
        window.open(this.$router.resolve(path).href, "_blank");
      }
    },
    handleIpfsHash(hash) {
      window.open(`https://cloudflare-ipfs.com/ipfs/${hash}`, "_blank");
    },
    handleIpfsURI(uri) {
      window.open(
        `https://cloudflare-ipfs.com/ipfs/${uri.slice("ipfs://".length)}`,
        "_blank"
      );
    },
    hasProtocol(value, protocol) {
      let url;

      try {
        url = new URL(value);
      } catch (_) {
        return false;
      }

      return url.protocol === protocol;
    },
  },
};
</script>
