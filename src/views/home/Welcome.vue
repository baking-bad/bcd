<template>
  <span>Welcome</span>
</template>

<script>
import { login } from '@/utils/auth.js';

export default {
  created() {
    login(this.$route.query.jwt);
    this.$router.push({ path: "/" });
  }
};
</script>