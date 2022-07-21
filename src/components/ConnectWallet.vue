<template>
  <div>
    <v-btn
        v-if="!account"
        icon
        class="text--secondary"
        @click="auth"
    >
      <v-icon>mdi-wallet</v-icon>
    </v-btn>
    <div v-else>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <img v-bind="attrs" v-on="on" alt="avatar" class="avatar" :src="`https://catava.dipdup.net/${account}`">
        </template>
        <v-list>
          <v-list-item class="px-4 cursor-pointer">
            <v-list-item-title class="text-capitalize" @click="changeWallet">Change wallet</v-list-item-title>
          </v-list-item>
          <v-list-item class="px-4 cursor-pointer">
            <v-list-item-title class="text-capitalize" @click="logOut">Log out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import {Wallet} from "@/utils/wallet";

export default {
  name: "ConnectWallet",
  data() {
    return {
      wallet: null,
      account: null,
      isGettingWalletProgress: false
    }
  },
  mounted() {
    this.account = Wallet.getLastUsedAccount();
  },
  methods: {
    async auth() {
      try {
        await Wallet.getClient(this.selectedNetwork, [], true);
      } catch (e) {
        console.error(e);
      }
      this.account = Wallet.getLastUsedAccount();
    },
    async changeWallet() {
      try {
        await Wallet.getClient(this.selectedNetwork, [], false);
      } catch (e) {
        console.error(e);
      }
      this.account = Wallet.getLastUsedAccount();
    },
    logOut() {
      localStorage.removeItem('beacon:accounts')
      this.account = null
    }
  },
  computed: {
    selectedNetwork() {
      return this.$route.query.network || this.$route.params.network || 'mainnet'
    }
  }
}
</script>

<style scoped lang="scss">
.avatar {
  width: 40px;
  cursor: pointer;
  height: 40px;
}
</style>