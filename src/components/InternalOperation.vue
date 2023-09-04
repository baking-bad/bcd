<template>
  <div class="pb-2 data">
    <v-row v-if="!data.internal && !noheader" no-gutters class="px-4 py-1 sidebar">
      <v-col cols="2">
        <InfoItem title="Counter"  v-if="data.counter" :subtitle="String(data.counter)" />
      </v-col>
      <v-col cols="2">
        <InfoItem title="Burned" :subtitle="(burned || 0) | uxtz" />
      </v-col>
      <v-col cols="2">
        <InfoItem title="Fee" :subtitle="(data.fee || 0) | uxtz" />
      </v-col>
      <v-col cols="2">
        <InfoItem title="Gas limit" :subtitle="String(data.gas_limit || 0)" />
      </v-col>
      <v-col cols="2">
        <InfoItem title="Storage limit" :subtitle="(data.storage_limit) || 0 | bytes" />
      </v-col>
      <v-col cols="2" v-if="address" class="py-0 d-flex justify-end align-center">
        <v-tooltip top v-if="isReplayable">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              target="_blank"
              class="mr-2 text--secondary"
              :to="{
                name: 'interact',  
                params: {
                  network: data.network, 
                  address: data.destination, 
                  entrypoint: data.entrypoint,
                },
                query: {
                  hash: data.hash,
                  counter: data.counter
                }
              }"
            >
              <v-icon>mdi-repeat</v-icon>
            </v-btn>
          </template>
          <span>Repeat operation group</span>
        </v-tooltip>
        <v-tooltip top v-if="data.hash">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon class="mr-2 text--secondary" @click="showRaw = true">
              <v-icon>mdi-code-json</v-icon>
            </v-btn>
          </template>
          <span>View raw JSON</span>
        </v-tooltip>
        <v-tooltip top v-if="data.hash">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              class="mr-2 text--secondary"
              @click="() => {
                $clipboard(data.hash);
                showClipboardOK();
              }"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>Copy operation hash</span>
        </v-tooltip>
        <v-tooltip top v-if="data.hash">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              :href="`/${data.network}/opg/${data.hash}`"
              target="_blank"
              icon
              class="mr-2 text--secondary"
            >
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
          <span>View operation group</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row no-gutters class="px-4 pt-4" style="font-size: 16px;">
      <v-col cols="10" lg="10" xl="10" md="9">
        <span v-if="data.tag" class="hash accent--text">event {{ data.tag }}</span>
        <span v-else>
          <span v-if="data.internal" class="mr-2 hash font-weight-thin">internal</span>
          <span v-if="!data.entrypoint || data.kind === 'transfer_ticket'" class="hash accent--text">{{ data.kind }}</span>
          <span v-else class="hash secondary--text">{{ data.entrypoint }}</span>
        </span>
        <v-chip class="ml-3 overline" :color="statusColor" small outlined label>{{ data.status }}</v-chip>
      </v-col>
      <v-col cols="1" class="d-flex justify-end">
        <v-tooltip top v-if="data.ticket_updates_count > 0">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              class="mr-5 text--secondary"
              small
              @click="openTicketCard"
            >
              <v-icon small>mdi-ticket-confirmation</v-icon>
            </v-btn>
          </template>
          <span>{{ helpers.plural(data.ticket_updates_count, "ticket update") }}</span>
        </v-tooltip>
        <v-dialog v-model="showTicketUpdates" width="auto" @keydown.esc="showTicketUpdates = false">
          <v-card class="bcd-table">
            <v-card-title class="py-3 px-7">Ticket updates</v-card-title>
            <v-card-text class="pa-0">
              <TicketTab
                :network="data.network"
                :operationId="data.id"
              />
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col
        cols="1" lg="1" xl="1" md="2"
        class="py-0 d-flex justify-end align-center"
      >
        <v-btn
          v-if="showDetails"
          text
          small
          @click="showParams = !showParams"
          :class="showParams ? 'text--secondary' : ''"
        >
          <v-icon small class="mr-1">mdi-file-tree</v-icon>
          <span>{{ showParams ? 'Hide' : 'Show' }} details</span>
        </v-btn>
      </v-col>
      <v-col cols="2">
        <AccountBox
          v-if="data.source"
          :title="sourceHeader"
          :address="data.source"
          :highlighted="data.source == address"
          :network="data.network"
        />
      </v-col>
      <v-col cols="2" v-if="data.destination">
        <AccountBox
          :title="destinationHeader"
          :address="data.destination"
          :highlighted="data.destination == address"
          :network="data.network"
        />
      </v-col>
      <v-col cols="2">
        <InfoItem
          v-if="data.kind !== 'delegation'"
          title="Amount"
          :subtitle="(isNaN(data.amount) ? 0 : data.amount) | uxtz"
        />
      </v-col>
      <v-col cols="2" v-if="data.delegate || data.kind === 'delegation'">
        <AccountBox
          v-if="data.delegate"
          title="Delegate"
          :address="data.delegate"
          :highlighted="false"
          :network="data.network"
        />
        <InfoItem v-else title="Delegate" subtitle="None" />
      </v-col>
      <v-col cols="2" v-if="consumedGas">
        <InfoItem title="Consumed Gas" :subtitle="consumedGas" />
      </v-col>
      <v-col cols="2" v-if="paidStorageDiff">
        <InfoItem title="Paid storage diff" :subtitle="paidStorageDiff" />
      </v-col>
      <v-col cols="2" v-if="allocationFee">
        <InfoItem title="Allocation fee" :subtitle="allocationFee | uxtz" />
      </v-col>
    </v-row>

    <v-expand-transition>
      <div v-if="showParams" class="px-4 pb-2">
        <v-row v-if="data.errors" no-gutters>
          <v-col>
            <OperationAlert :errors="data.errors" :operationId="data.id" :network="data.network"/>
          </v-col>
        </v-row>
        <v-row
          class="my-1 parameters px-2 py-3 canvas"
          v-if="loadingDiffs || hasParameters || hasStorageDiff"
          no-gutters
        >
          <v-col :cols="expanded ? 12 : 6">
            <template v-if="hasParameters">
              <span class="overline ml-3">Parameters</span>&nbsp;
              <v-btn
                v-if="hasStorageDiff"
                icon
                small
                @click="expanded = !expanded"
                class="text--disabled"
              >
                <v-icon v-if="expanded" small>mdi-table-row</v-icon>
                <v-icon v-else small>mdi-table-column</v-icon>
              </v-btn>
              <MiguelTreeView :miguel="data.parameters" :network="data.network" openAll />
            </template>
          </v-col>
          <v-col :cols="expanded ? 12 : 6" :class="expanded ? 'mt-4' : ''">
            <template v-if="loadingDiffs">
              <p class="overline" >Loading storage diff...</p>
            </template>
            <template v-else-if="hasStorageDiff">
              <span class="overline ml-3">Storage</span>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    :to="`/${data.network}/${data.destination}/storage?level=${data.level}`"
                    target="_blank"
                    tile
                    x-small
                    text
                  >
                    <v-icon class="text--secondary" small>mdi-open-in-new</v-icon>
                  </v-btn>
                </template>
                <span>View storage at level {{ data.level }}</span>
              </v-tooltip>
              <span
                class="text--secondary caption"
                v-if="data && data.storage_size"
              >{{ data.storage_size | bytes}}</span>
              <MiguelTreeView :miguel="diffs" :network="data.network" diffMode />
            </template>
          </v-col>
        </v-row>
        <v-row
          class="my-1 parameters px-2 py-3 canvas"
          v-else-if="hasEventPayload"
          no-gutters
        >
          <v-col :cols="expanded ? 12 : 6">
              <span class="overline ml-3">Payload</span>
              <MiguelTreeView :miguel="data.payload" :network="data.network" openAll />
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
    <RawJsonViewer
      v-model="showRaw"
      type="operation"
      :network="data.network"
      :level="data.level"
      :hash="data.hash"
      :raw="data.rawMempool"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import InfoItem from "@/components/InfoItem.vue";
import OperationAlert from "@/components/OperationAlert.vue";
import AccountBox from "@/components/Dialogs/AccountBox.vue";
import RawJsonViewer from "@/components/Dialogs/RawJsonViewer.vue";
import MiguelTreeView from "@/components/MiguelTreeView.vue";
import TicketTab from "../views/contract/TicketTab/TicketTab.vue";

export default {
  props: {
    data: Object,
    address: String,
    mainOperation: Object,
    noheader: Boolean,
  },
  components: {
    InfoItem,
    RawJsonViewer,
    OperationAlert,
    AccountBox,
    MiguelTreeView,
    TicketTab,
  },
  data: () => ({
    showRaw: false,
    showParams: false,
    showTicketUpdates: false,
    expanded: false,
    loadingDiffs: false,
    diffs: null
  }),
  created() {
    this.showParams =
      this.data.errors !== undefined;
  },
  computed: {
    source() {
      if (this.data.source) {
        return this.data.source;
      }
      return "unset";
    },
    destination() {
      if (this.data.destination) {
        return this.data.destination;
      }
      return "unset";
    },
    sourceHeader() {
      if (!this.data.internal) return "Source";
      return "Sender";
    },
    destinationHeader() {
      if (this.data.kind === "transaction") {
        return "Destination";
      } else if (this.data.kind === "delegation") {
        return "Delegate";
      } else if (this.data.kind === "origination") {
        return "Originated Contract";
      } else if (this.data.kind === "reveal") {
        return "Public Key";
      }
      return "Destination";
    },
    gasLimit() {
      if (this.data.internal) {
        return this.mainOperation.gas_limit;
      }
      return this.data.gas_limit;
    },
    storageLimit() {
      if (this.data.internal) {
        return this.mainOperation.storage_limit;
      }
      return this.data.storage_limit;
    },
    consumedGas() {
      if (this.data && this.data.consumed_gas) {
        let s = `${this.data.consumed_gas}`;
        if (this.data.consumed_gas > this.gasLimit) {
          s = this.$options.filters.milligas(this.data.consumed_gas);
        }
        if (this.gasLimit > 0) {
          s += ` (${(
            (this.data.consumed_gas * 100 / 1000) /
            this.gasLimit
          ).toFixed(0)}%)`;
        }
        return s;
      }
      return "0 (0%)";
    },
    allocationFee() {
      return this.data.allocated_destination_contract_burned || 0;
    },
    paidStorageDiff() {
      if (this.data && this.data.paid_storage_size_diff) {
        let s = this.$options.filters.bytes(
          this.data.paid_storage_size_diff
        );
        if (this.storageLimit > 0) {
          s += ` (${(
            (this.data.paid_storage_size_diff * 100) /
            this.storageLimit
          ).toFixed(0)}%)`;
        }
        return s;
      }
      return this.$options.filters.bytes(0) + " (0%)";
    },
    hasParameters() {
      return (
        this.data != null &&
        this.data !== undefined &&
        this.data.parameters != null &&
        this.data.parameters !== undefined
      );
    },
    hasStorageDiff() {
      return (
        this.data != null &&
        this.data !== undefined &&
        this.diffs != null &&
        this.diffs !== undefined
      );
    },
    hasEventPayload() {
      return (
        this.data != null &&
        this.data !== undefined &&
        this.data.payload != null &&
        this.data.payload !== undefined
      );
    },
    showDetails() {
      return this.data.hash === undefined || 
        this.data.kind === 'origination' || 
        this.hasParameters || 
        this.hasStorageDiff ||
        this.hasEventPayload;
    },
    statusColor() {
      if (this.data.status === "applied") return "success";
      if (this.data.status === "backtracked") return "warning";
      if (this.data.status === "failed") return "error";
      if (this.data.status === "pending") return "secondary";
      if (this.data.status === "lost") return "grey";
      if (this.data.status === "branch_refused") return "error";
      if (this.data.status === "refused") return "error";
      return "grey";
    },
    burned() {
      let val = this.data.burned || 0;
      if (
        !this.data.internal &&
        !this.data.mempool &&
        this.data.internal_operations
      ) {
        for (let i = 0; i < this.data.internal_operations.length; i++) {
          val += this.data.internal_operations[i].burned || 0;
        }
      }
      return val;
    },
    isReplayable() {
      return !this.data.mempool && 
        this.data.hash && 
        this.data.destination && 
        this.data.entrypoint && 
        this.data.status === 'applied';
    },
  },
  methods: {
    ...mapActions(["showClipboardOK", "showError"]),
    getDiff() {
      if (this.data.status !== "applied") return;
      if (this.diffs !== null) return;
      if (this.data.storage_diff) {
        this.diffs = this.data.storage_diff;
        return;
      }
      this.loadingDiffs = true;

      this.api.getOperationDiff(this.data.network, this.data.id).
        then((res) => {
          this.diffs = res;
        }).
        catch(err => {
          console.error(err);
          this.showError(err);
        }).
        finally(() => {
          this.loadingDiffs = false;
        })
    },
    openTicketCard() {
      this.showTicketUpdates = true;
    },
  },
  watch: {
    showParams(newValue) {
      if (newValue && this.diffs === null && !this.loadingDiffs) {
        this.getDiff();
      }
    }
  }
};
</script>
