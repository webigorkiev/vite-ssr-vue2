<template>
  <div id="app">
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  name: 'App',
})
</script>

<style lang="scss">
@import "./css/style.scss";
</style>