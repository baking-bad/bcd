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
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon class="mr-2 text--secondary" @click="showRaw = true">
              <v-icon>mdi-code-json</v-icon>
            </v-btn>
          </template>
          <span>View raw JSON</span>
        </v-tooltip>
        <v-tooltip top>
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
        <v-tooltip top>
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
      <v-col cols="11">
        <span v-if="data.internal" class="mr-2 hash font-weight-thin">internal</span>
        <span v-if="data.entrypoint" class="hash secondary--text">{{ data.entrypoint }}</span>
        <span v-else class="hash accent--text">{{ data.kind }}</span>
        <v-chip class="ml-3 overline" :color="statusColor" small outlined label>{{ data.status }}</v-chip>
      </v-col>
      <v-col
        cols="1"
        class="py-0 d-flex justify-end align-center"
        v-if="hasParameters || hasStorageDiff"
      >
        <v-btn
          v-if="showParams"
          text
          small
          @click="showParams = !showParams"
          class="text--secondary"
        >
          <v-icon small class="mr-1">mdi-file-tree</v-icon>
          <span>Hide details</span>
        </v-btn>
        <v-btn v-else text small @click="showParams = !showParams">
          <v-icon small class="mr-1">mdi-file-tree</v-icon>
          <span>Show details</span>
        </v-btn>
      </v-col>
      <v-col cols="2">
        <AccountBox
          v-if="data.source"
          :title="sourceHeader"
          :address="data.source"
          :alias="data.source_alias"
          :highlighted="data.source == address"
          :network="data.network"
        />
      </v-col>
      <v-col cols="2" v-if="data.destination">
        <AccountBox
          :title="destinationHeader"
          :address="data.destination"
          :alias="data.destination_alias"
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
          :alias="data.delegate_alias"
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
      <div v-show="showParams" class="px-4 pb-2">
        <v-row v-if="data.errors" no-gutters>
          <v-col>
            <OperationAlert :errors="data.errors" :operationId="data.id" :network="data.network"/>
          </v-col>
        </v-row>
        <v-row
          class="my-1 parameters px-2 py-3 canvas"
          v-if="hasParameters || hasStorageDiff"
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
            <template v-if="hasStorageDiff">
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
                v-if="data"
              >{{ data.storage_size | bytes}}</span>
              <MiguelTreeView :miguel="data.storage_diff" :network="data.network" diffMode />
            </template>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
    <RawJsonViewer
      :show.sync="showRaw"
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
  },
  data: () => ({
    showRaw: false,
    showParams: false,
    expanded: false,
  }),
  created() {
    this.showParams =
      this.data.errors !== undefined ||
      this.data.destination === this.address ||
      this.address === undefined;
  },
  computed: {
    source() {
      if (this.data.source_alias) {
        return this.data.source_alias;
      }
      if (this.data.source) {
        return this.data.source;
      }
      return "unset";
    },
    destination() {
      if (this.data.destination_alias) {
        return this.data.destination_alias;
      }
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
        if (this.gasLimit > 0) {
          s += ` (${(
            (this.data.consumed_gas * 100) /
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
        this.data.storage_diff != null &&
        this.data.storage_diff !== undefined
      );
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
  },
  methods: {
    ...mapActions(["showClipboardOK"]),
  },
};
</script>
