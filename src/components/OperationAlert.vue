<template>
  <div>
    <v-alert
      border="left"
      color="red lighten-2"
      dense
      prominent
      text
      outlined
      type="error"
      :key="idx"
      v-for="(err, idx) in errors"
    >
      <div class="red--text subtitle-1">{{ err.title }}</div>
      <div class="caption">
        {{ err.descr }}
        <span v-if="err.with" style="word-break: break-all">: {{ err.with }}</span>
        <span
          v-else-if="err.id.includes('contract.balance_too_low')"
          style="word-break: break-all"
        >: {{ err.balance | uxtz }} &lt; {{ err.amount | uxtz }}</span>
      </div>
    </v-alert>
  </div>
</template>

<script>
export default {
  name: "OperationAlert",
  props: {
    errors: Array
  }
};
</script>