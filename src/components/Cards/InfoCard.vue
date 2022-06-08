<template>
  <v-card flat class="mt-10 pa-10 d-flex flex-column align-center justify-center transparent">
    <v-img src="@/assets/relocation.png" max-height="100" class="icon"></v-img>    
    <div class="information font-weight-regular mt-2"><slot /></div>
  </v-card>
</template>

<script>
export default {
  name: "InfoCard",
  props: {
    icon: String
  }
}
</script>

<style scoped>
.information {
  width: 583px;
  height: 64px;
  font-style: normal;
  font-size: 20px;
  line-height: 160%;
  text-align: center;
  color: #959595;
}

.icon {
  margin-right: 30px
}
</style>