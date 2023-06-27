<template>
  <div id="app">
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: 'App',
})
</script>

<style lang="scss">
@import "./css/style.scss";
</style>