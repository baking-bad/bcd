<template>
  <div>
    <v-menu offset-y v-if="!account">
      <template v-slot:activator="{ on, attrs }">
      <v-btn icon class="text--secondary" v-bind="attrs" v-on="on" >
        <v-icon size="26">mdi-wallet</v-icon>
      </v-btn>
      </template>
      <v-list>
        <v-list-item class="pr-8 pl-4 cursor-pointer" @click="auth('mainnet')" v-for="network in config.networks" :key="network">
          <v-list-item-title class="text-capitalize">{{network}}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <div v-else>
      <v-menu offset-y  v-model="isOpened" :close-on-content-click="false">
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
          <template v-if="!isChangeWallet">
            <v-list-item class="px-4 cursor-pointer" @click="isChangeWallet = true">
              <v-list-item-title class="text-capitalize">Change wallet</v-list-item-title>
            </v-list-item>
            <v-list-item class="px-4 cursor-pointer" @click="logOut">
              <v-list-item-title class="text-capitalize">Log out</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item v-else class="pr-8 pl-4 cursor-pointer" @click="auth('mainnet', false)" v-for="network in config.networks" :key="network">
            <v-list-item-title class="text-capitalize">{{network}}</v-list-item-title>
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
      isOpened: false,
      wallet: null,
      account: null,
      isChangeWallet: false,
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
  watch: {
    isOpened() {
      this.isChangeWallet = false
    }
  },
  methods: {
    async auth(network = 'mainnet', isLast = true) {
      this.isOpened = false;
      try {
        await Wallet.getClient(network, [], isLast);
      } catch (e) {
        console.error(e);
      }
      this.account = Wallet.getLastUsedAccount();
      this.isChangeWallet = false;
    },
    async logOut() {
      this.isOpened = false;
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