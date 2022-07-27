<template>
  <div>
    <v-btn
        v-if="!account"
        icon
        class="text--secondary"
        @click="auth"
    >
      <v-icon size="26">mdi-wallet</v-icon>
    </v-btn>
    <div v-else>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <img v-bind="attrs" v-on="on" alt="avatar" class="avatar" :src="`https://catava.dipdup.net/${account.address}`">
        </template>
        <v-list>
          <v-subheader>
            <div class="wallet-info">
              <small>{{account.walletName}}</small>
              <span v-past-html="helpers.shortcut(account.address, 6)"></span>
            </div>
          </v-subheader>
          <v-list-item class="px-4 cursor-pointer" @click="changeWallet">
            <v-list-item-title class="text-capitalize">Change wallet</v-list-item-title>
          </v-list-item>
          <v-list-item class="px-4 cursor-pointer" @click="logOut">
            <v-list-item-title class="text-capitalize">Log out</v-list-item-title>
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
  created() {
    Wallet.changeWalletState(() => {
      this.account = Wallet.getLastUsedAccount();
    });
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
    async logOut() {
      if(Wallet.wallet) {
        await Wallet.wallet.clearActiveAccount();
      }
      localStorage.removeItem('beacon:accounts')
      localStorage.setItem('beacon:active-peer', '');
      localStorage.setItem('beacon:active-account', '');
      Wallet.wallet = null
      Wallet.isPermissionGiven = false
      this.account = null
    }
  },
  computed: {
    selectedNetwork() {
      return 'mainnet'
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

.text--secondary {
  margin-top: 2px;
}

.wallet-info {
  display: flex;
  flex-direction: column;
  padding: 4px 12px 8px 0;
  border-bottom: 1px solid #414141;
}
</style>